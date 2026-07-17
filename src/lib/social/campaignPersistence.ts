// TODO: connect Supabase — replace in-memory stubs with createServiceRoleClient()
// when NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are configured.
import type { SocialCampaign, SocialPlatform, SocialPlatformPost, UTMSettings } from '@/features/social/types'

// ── In-memory fallback ────────────────────────────────────────────────────────
const _campaigns = new Map<string, SocialCampaign>()

export type CreateSocialCampaignInput = {
  aiGenerationId?: string
  blogPostId?: string
  campaignName: string
  sourceUrl: string
  sourceTitle: string
  sourceExcerpt?: string
  sourceImage?: SocialCampaign['sourceImage']
  utm: UTMSettings
  metadata?: Record<string, unknown>
  createdBy?: string
  platformPosts: Array<{
    platform: SocialPlatform
    caption: string
    title?: string
    description?: string
    link?: string
    trackedUrl?: string
    hashtags?: string[]
  }>
}

export async function createSocialCampaignDb(input: CreateSocialCampaignInput): Promise<SocialCampaign> {
  // TODO: connect Supabase — insert into social_campaigns + social_platform_posts
  try {
    const { nanoid } = await import('nanoid')
    const now = new Date().toISOString()
    const id = nanoid()
    const campaign: SocialCampaign = {
      id,
      blogPostId: input.blogPostId ?? '',
      campaignName: input.campaignName,
      sourceUrl: input.sourceUrl,
      sourceTitle: input.sourceTitle,
      sourceExcerpt: input.sourceExcerpt,
      sourceImage: input.sourceImage,
      campaignStatus: 'draft',
      createdAt: now,
      updatedAt: now,
      createdBy: input.createdBy,
      utm: input.utm,
      platformPosts: input.platformPosts.map((p) => ({
        id: nanoid(),
        campaignId: id,
        platform: p.platform,
        status: 'draft',
        caption: p.caption,
        title: p.title,
        description: p.description,
        link: p.link ?? input.sourceUrl,
        trackedUrl: p.trackedUrl,
        hashtags: p.hashtags ?? [],
        createdAt: now,
        updatedAt: now,
      })),
    }
    _campaigns.set(id, campaign)
    return campaign
  } catch (err) {
    throw new Error(`createSocialCampaignDb failed: ${err instanceof Error ? err.message : err}`)
  }
}

export async function getSocialCampaignDb(id: string): Promise<SocialCampaign | null> {
  // TODO: connect Supabase — select from social_campaigns + social_platform_posts
  try {
    return _campaigns.get(id) ?? null
  } catch {
    return null
  }
}

export async function listSocialCampaignsDb(limit = 50): Promise<SocialCampaign[]> {
  // TODO: connect Supabase — select from social_campaigns order by created_at desc
  try {
    return Array.from(_campaigns.values())
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit)
  } catch {
    return []
  }
}
