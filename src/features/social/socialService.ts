// ─────────────────────────────────────────────────────────────────────────────
// Social service layer — orchestration between store, adapters, and validators
// TODO: In production, move all writes to server-side Next.js API routes.
//       This file should become a thin client that calls /api/social/* endpoints.
// ─────────────────────────────────────────────────────────────────────────────
import type { SocialPlatform, SocialPlatformPost, SocialValidationWarning } from './types'
import { getAdapter } from './socialAdapters'
import {
  getSocialCampaignById,
  updatePlatformPost,
  schedulePlatformPost,
  markPlatformPostAsManuallyPosted,
} from './socialStore'

export type ValidationResult = {
  platformPostId: string
  platform: SocialPlatform
  warnings: SocialValidationWarning[]
  hasErrors: boolean
}

export function validatePost(post: SocialPlatformPost): ValidationResult {
  const adapter = getAdapter(post.platform)
  const warnings = adapter.validatePost(post)
  return {
    platformPostId: post.id,
    platform: post.platform,
    warnings,
    hasErrors: warnings.some((w) => w.severity === 'error'),
  }
}

export function validateCampaign(campaignId: string): ValidationResult[] {
  const campaign = getSocialCampaignById(campaignId)
  if (!campaign) return []
  return campaign.platformPosts.map((post) => validatePost(post))
}

export async function publishPost(campaignId: string, platformPostId: string): Promise<void> {
  const campaign = getSocialCampaignById(campaignId)
  if (!campaign) throw new Error(`Campaign ${campaignId} not found`)
  const post = campaign.platformPosts.find((p) => p.id === platformPostId)
  if (!post) throw new Error(`Post ${platformPostId} not found`)

  if (!post.accountId) {
    throw new Error('Select a connected account for this platform before publishing.')
  }

  const res = await fetch(`/api/social/posts/${platformPostId}/publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      accountId: post.accountId,
      platform: post.platform,
      caption: post.caption,
      link: post.trackedUrl ?? post.link,
      imageUrl: post.image?.url,
      campaignId,
    }),
  })

  const data = (await res.json()) as {
    success?: boolean
    status?: string
    externalPostId?: string
    externalPostUrl?: string
    errorMessage?: string
  }

  if (!res.ok || !data.success) {
    updatePlatformPost(campaignId, platformPostId, {
      status: 'failed',
      errorMessage: data.errorMessage ?? 'Publish failed.',
    })
    throw new Error(data.errorMessage ?? 'Publish failed.')
  }

  updatePlatformPost(campaignId, platformPostId, {
    status: 'posted_api',
    postedAt: new Date().toISOString(),
    externalPostId: data.externalPostId,
    externalPostUrl: data.externalPostUrl,
    errorMessage: undefined,
  })
}

export function schedulePost(
  campaignId: string,
  platformPostId: string,
  scheduledFor: string,
): void {
  const campaign = getSocialCampaignById(campaignId)
  if (!campaign) throw new Error(`Campaign ${campaignId} not found`)
  const post = campaign.platformPosts.find((p) => p.id === platformPostId)
  if (!post) throw new Error(`Post ${platformPostId} not found`)

  const validation = validatePost(post)
  if (validation.hasErrors) {
    updatePlatformPost(campaignId, platformPostId, {
      validationWarnings: validation.warnings,
    })
    throw new Error('Post has validation errors. Fix them before scheduling.')
  }

  updatePlatformPost(campaignId, platformPostId, { validationWarnings: validation.warnings })
  schedulePlatformPost(campaignId, platformPostId, scheduledFor)
}

export function markManuallyPosted(
  campaignId: string,
  platformPostId: string,
  externalPostUrl?: string,
): void {
  markPlatformPostAsManuallyPosted(campaignId, platformPostId, externalPostUrl)
}

export function generateTrackedUrl(
  campaignId: string,
  platformPostId: string,
): string | undefined {
  const campaign = getSocialCampaignById(campaignId)
  if (!campaign) return undefined
  const post = campaign.platformPosts.find((p) => p.id === platformPostId)
  if (!post) return undefined
  return post.trackedUrl
}
