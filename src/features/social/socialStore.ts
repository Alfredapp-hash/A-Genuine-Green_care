'use client'
// ─────────────────────────────────────────────────────────────────────────────
// Social Publisher — mock localStorage store
// TODO: Replace localStorage with Supabase tables:
//   - social_accounts (id, platform, account_name, connection_status, ...)
//   - social_campaigns (id, blog_post_id, campaign_name, status, utm jsonb, ...)
//   - social_platform_posts (id, campaign_id, platform, status, caption, ...)
// TODO: Add Supabase RLS policies so only authenticated admins can read/write.
// TODO: Replace in-memory mutations with Supabase .insert(), .update(), .delete()
// ─────────────────────────────────────────────────────────────────────────────
import { nanoid } from 'nanoid'
import type {
  SocialAccount, SocialCampaign, SocialPlatformPost,
  SocialPlatform, SocialPostStatus,
} from './types'
import { SAMPLE_ACCOUNTS, SAMPLE_CAMPAIGNS } from './sampleSocialData'
import { buildDefaultUTM, buildTrackedUrl } from './utm'
import { getAdapter } from './socialAdapters'

const ACCOUNTS_KEY = 'ss_social_accounts'
const CAMPAIGNS_KEY = 'ss_social_campaigns'

// ── Hydration helpers ─────────────────────────────────────────────────────────
function loadAccounts(): SocialAccount[] {
  if (typeof window === 'undefined') return SAMPLE_ACCOUNTS
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY)
    return raw ? (JSON.parse(raw) as SocialAccount[]) : SAMPLE_ACCOUNTS
  } catch { return SAMPLE_ACCOUNTS }
}

function loadCampaigns(): SocialCampaign[] {
  if (typeof window === 'undefined') return SAMPLE_CAMPAIGNS
  try {
    const raw = localStorage.getItem(CAMPAIGNS_KEY)
    return raw ? (JSON.parse(raw) as SocialCampaign[]) : SAMPLE_CAMPAIGNS
  } catch { return SAMPLE_CAMPAIGNS }
}

function saveAccounts(accounts: SocialAccount[]): void {
  if (typeof window !== 'undefined') localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}

function saveCampaigns(campaigns: SocialCampaign[]): void {
  if (typeof window !== 'undefined') localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(campaigns))
}

// ── Account functions ─────────────────────────────────────────────────────────
export function getSocialAccounts(): SocialAccount[] {
  return loadAccounts()
}

export function getSocialAccountByPlatform(platform: SocialPlatform): SocialAccount | undefined {
  return loadAccounts().find((a) => a.platform === platform)
}

export function updateSocialAccount(id: string, patch: Partial<SocialAccount>): void {
  const accounts = loadAccounts()
  const idx = accounts.findIndex((a) => a.id === id)
  if (idx === -1) return
  accounts[idx] = { ...accounts[idx], ...patch }
  saveAccounts(accounts)
}

export function mockConnectAccount(id: string): void {
  updateSocialAccount(id, {
    connectionStatus: 'connected',
    connectedAt: new Date().toISOString(),
    lastError: undefined,
  })
}

export function mockDisconnectAccount(id: string): void {
  updateSocialAccount(id, {
    connectionStatus: 'not_connected',
    connectedAt: undefined,
    externalAccountId: undefined,
  })
}

// ── Campaign functions ─────────────────────────────────────────────────────────
export function getSocialCampaigns(): SocialCampaign[] {
  return loadCampaigns()
}

/** Import a server-persisted campaign into localStorage for the Social Publisher editor. */
export function importServerCampaign(campaign: SocialCampaign): SocialCampaign {
  const campaigns = loadCampaigns()
  const idx = campaigns.findIndex((c) => c.id === campaign.id)
  if (idx === -1) {
    campaigns.unshift(campaign)
  } else {
    campaigns[idx] = campaign
  }
  saveCampaigns(campaigns)
  return campaign
}

export function getSocialCampaignById(id: string): SocialCampaign | undefined {
  return loadCampaigns().find((c) => c.id === id)
}

export function getSocialCampaignsByBlogPostId(blogPostId: string): SocialCampaign[] {
  return loadCampaigns().filter((c) => c.blogPostId === blogPostId)
}

export type MinimalBlogPostForCampaign = {
  id: string
  title: string
  excerpt?: string
  slug?: string
  featuredImage?: { url: string; alt?: string }
}

export function createSocialCampaignFromBlogPost(
  blogPost: MinimalBlogPostForCampaign,
  platforms: SocialPlatform[],
): SocialCampaign {
  const now = new Date().toISOString()
  const sourceUrl = blogPost.slug ? `/blog/${blogPost.slug}` : `/blog`
  const utm = buildDefaultUTM('facebook', blogPost.title, blogPost.title)

  const platformPosts: SocialPlatformPost[] = platforms.map((platform) => ({
    id: nanoid(),
    campaignId: '', // will be filled below
    platform,
    status: 'draft' as SocialPostStatus,
    caption: '',
    hashtags: [],
    link: sourceUrl,
    trackedUrl: buildTrackedUrl(
      `https://saltwatersprouts.com${sourceUrl}`,
      platform,
      { ...utm, source: platform },
    ),
    createdAt: now,
    updatedAt: now,
  }))

  const campaign: SocialCampaign = {
    id: nanoid(),
    blogPostId: blogPost.id,
    campaignName: `${blogPost.title} — ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
    sourceUrl,
    sourceTitle: blogPost.title,
    sourceExcerpt: blogPost.excerpt,
    sourceImage: blogPost.featuredImage,
    campaignStatus: 'draft',
    createdAt: now,
    updatedAt: now,
    platformPosts: platformPosts.map((p) => ({ ...p, campaignId: '' })),
    utm,
  }

  // Back-fill campaignId
  campaign.platformPosts = platformPosts.map((p) => ({ ...p, campaignId: campaign.id }))

  const campaigns = loadCampaigns()
  campaigns.unshift(campaign)
  saveCampaigns(campaigns)
  return campaign
}

export function updateSocialCampaign(id: string, patch: Partial<SocialCampaign>): void {
  const campaigns = loadCampaigns()
  const idx = campaigns.findIndex((c) => c.id === id)
  if (idx === -1) return
  campaigns[idx] = { ...campaigns[idx], ...patch, updatedAt: new Date().toISOString() }
  saveCampaigns(campaigns)
}

export function deleteSocialCampaign(id: string): void {
  saveCampaigns(loadCampaigns().filter((c) => c.id !== id))
}

export function archiveSocialCampaign(id: string): void {
  updateSocialCampaign(id, { campaignStatus: 'archived' })
}

export function duplicateSocialCampaign(id: string): SocialCampaign | undefined {
  const original = getSocialCampaignById(id)
  if (!original) return
  const now = new Date().toISOString()
  const copy: SocialCampaign = {
    ...original,
    id: nanoid(),
    campaignName: `${original.campaignName} (Copy)`,
    campaignStatus: 'draft',
    createdAt: now,
    updatedAt: now,
    platformPosts: original.platformPosts.map((p) => ({
      ...p,
      id: nanoid(),
      status: 'draft' as SocialPostStatus,
      externalPostId: undefined,
      externalPostUrl: undefined,
      postedAt: undefined,
      scheduledFor: undefined,
      queuedAt: undefined,
      errorMessage: undefined,
      createdAt: now,
      updatedAt: now,
    })),
  }
  const campaigns = loadCampaigns()
  campaigns.unshift(copy)
  saveCampaigns(campaigns)
  return copy
}

// ── Platform post functions ───────────────────────────────────────────────────
export function createPlatformPost(campaignId: string, platform: SocialPlatform): SocialPlatformPost {
  const now = new Date().toISOString()
  const post: SocialPlatformPost = {
    id: nanoid(),
    campaignId,
    platform,
    status: 'draft',
    caption: '',
    createdAt: now,
    updatedAt: now,
  }
  const campaigns = loadCampaigns()
  const idx = campaigns.findIndex((c) => c.id === campaignId)
  if (idx !== -1) {
    campaigns[idx].platformPosts.push(post)
    campaigns[idx].updatedAt = now
    saveCampaigns(campaigns)
  }
  return post
}

export function updatePlatformPost(
  campaignId: string,
  platformPostId: string,
  patch: Partial<SocialPlatformPost>,
): void {
  const campaigns = loadCampaigns()
  const ci = campaigns.findIndex((c) => c.id === campaignId)
  if (ci === -1) return
  const pi = campaigns[ci].platformPosts.findIndex((p) => p.id === platformPostId)
  if (pi === -1) return
  campaigns[ci].platformPosts[pi] = {
    ...campaigns[ci].platformPosts[pi],
    ...patch,
    updatedAt: new Date().toISOString(),
  }
  campaigns[ci].updatedAt = new Date().toISOString()
  saveCampaigns(campaigns)
}

export function deletePlatformPost(campaignId: string, platformPostId: string): void {
  const campaigns = loadCampaigns()
  const ci = campaigns.findIndex((c) => c.id === campaignId)
  if (ci === -1) return
  campaigns[ci].platformPosts = campaigns[ci].platformPosts.filter((p) => p.id !== platformPostId)
  saveCampaigns(campaigns)
}

export function schedulePlatformPost(
  campaignId: string,
  platformPostId: string,
  scheduledFor: string,
): void {
  // TODO: Trigger a background job / cron here.
  updatePlatformPost(campaignId, platformPostId, { status: 'scheduled', scheduledFor })
  recalcCampaignStatus(campaignId)
}

export function queuePlatformPost(campaignId: string, platformPostId: string): void {
  updatePlatformPost(campaignId, platformPostId, {
    status: 'queued',
    queuedAt: new Date().toISOString(),
  })
}

export function markPlatformPostAsManuallyPosted(
  campaignId: string,
  platformPostId: string,
  externalPostUrl?: string,
): void {
  updatePlatformPost(campaignId, platformPostId, {
    status: 'posted_api',
    postedAt: new Date().toISOString(),
    externalPostUrl,
  })
  recalcCampaignStatus(campaignId)
}

export async function mockPublishPlatformPost(
  campaignId: string,
  platformPostId: string,
): Promise<void> {
  const campaign = getSocialCampaignById(campaignId)
  if (!campaign) throw new Error(`Campaign ${campaignId} not found`)
  const post = campaign.platformPosts.find((p) => p.id === platformPostId)
  if (!post) throw new Error(`Post ${platformPostId} not found`)

  const adapter = getAdapter(post.platform)
  const result = await adapter.mockPublish(post)

  updatePlatformPost(campaignId, platformPostId, {
    status: result.status,
    postedAt: new Date().toISOString(),
    externalPostId: result.externalPostId,
    externalPostUrl: result.externalPostUrl,
    errorMessage: result.errorMessage,
  })
  recalcCampaignStatus(campaignId)
}

function recalcCampaignStatus(campaignId: string): void {
  const campaign = getSocialCampaignById(campaignId)
  if (!campaign) return
  const posts = campaign.platformPosts
  const allPosted = posts.every((p) => p.status === 'mock_posted' || p.status === 'posted_api')
  const somePosted = posts.some((p) => p.status === 'mock_posted' || p.status === 'posted_api')
  const anyFailed = posts.some((p) => p.status === 'failed')
  const allScheduled = posts.every((p) => p.status === 'scheduled')

  let campaignStatus: SocialCampaign['campaignStatus'] = campaign.campaignStatus
  if (allPosted) campaignStatus = 'posted'
  else if (somePosted) campaignStatus = 'partially_posted'
  else if (anyFailed) campaignStatus = 'failed'
  else if (allScheduled) campaignStatus = 'scheduled'

  updateSocialCampaign(campaignId, { campaignStatus })
}
