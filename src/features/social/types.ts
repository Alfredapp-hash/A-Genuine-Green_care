// ─────────────────────────────────────────────────────────────────────────────
// Social Publisher — TypeScript types
// ─────────────────────────────────────────────────────────────────────────────

export type SocialPlatform =
  | 'facebook'
  | 'instagram'
  | 'linkedin'
  | 'youtube'
  | 'google_business_profile'
  | 'x'
  | 'tiktok'
  | 'pinterest'
  | 'threads'

export type SocialConnectionStatus =
  | 'not_connected'
  | 'connected'
  | 'expired'
  | 'error'
  | 'disabled'

export type SocialPostStatus =
  | 'draft'
  | 'ready'
  | 'scheduled'
  | 'queued'
  | 'mock_posted'
  | 'posted_api'
  | 'failed'
  | 'cancelled'
  | 'archived'

export type MediaAsset = {
  url: string
  alt?: string
  width?: number
  height?: number
  mimeType?: string
}

export type SocialAccount = {
  id: string
  platform: SocialPlatform
  accountName: string
  accountHandle?: string
  connectionStatus: SocialConnectionStatus
  connectedAt?: string
  expiresAt?: string
  lastSuccessfulPostAt?: string
  lastError?: string
  enabled: boolean
  externalAccountId?: string
}

export type UTMSettings = {
  campaign: string
  source?: string
  medium: string
  content?: string
  term?: string
}

export type SocialValidationWarning = {
  id: string
  severity: 'info' | 'warning' | 'error'
  message: string
  field?: string
}

export type SocialPlatformPost = {
  id: string
  campaignId: string
  platform: SocialPlatform
  accountId?: string
  status: SocialPostStatus
  title?: string
  caption: string
  description?: string
  hashtags?: string[]
  image?: MediaAsset
  link?: string
  trackedUrl?: string
  ctaType?: string
  scheduledFor?: string
  queuedAt?: string
  postedAt?: string
  externalPostId?: string
  externalPostUrl?: string
  errorMessage?: string
  validationWarnings?: SocialValidationWarning[]
  createdAt: string
  updatedAt: string
}

export type SocialCampaign = {
  id: string
  blogPostId: string
  campaignName: string
  sourceUrl: string
  sourceTitle: string
  sourceExcerpt?: string
  sourceImage?: MediaAsset
  campaignStatus:
    | 'draft'
    | 'ready'
    | 'scheduled'
    | 'partially_posted'
    | 'posted'
    | 'failed'
    | 'archived'
  createdAt: string
  updatedAt: string
  createdBy?: string
  platformPosts: SocialPlatformPost[]
  utm: UTMSettings
}

export type SocialPublishResult = {
  success: boolean
  platform: SocialPlatform
  status: SocialPostStatus
  externalPostId?: string
  externalPostUrl?: string
  errorMessage?: string
  rawResponse?: unknown
}

export type SocialApiError = {
  code: string
  message: string
  platform?: SocialPlatform
  details?: unknown
}

export interface SocialPlatformAdapter {
  platform: SocialPlatform
  validatePost(post: SocialPlatformPost): SocialValidationWarning[]
  buildPayload(post: SocialPlatformPost): unknown
  mockPublish(post: SocialPlatformPost): Promise<SocialPublishResult>
  publish?(post: SocialPlatformPost): Promise<SocialPublishResult>
}

export const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  facebook: 'Facebook Page',
  instagram: 'Instagram Business',
  linkedin: 'LinkedIn Page',
  youtube: 'YouTube Channel',
  google_business_profile: 'Google Business Profile',
  x: 'X (Twitter)',
  tiktok: 'TikTok',
  pinterest: 'Pinterest',
  threads: 'Threads',
}

export const PLATFORM_COLORS: Record<SocialPlatform, string> = {
  facebook: '#1877F2',
  instagram: '#E1306C',
  linkedin: '#0A66C2',
  youtube: '#FF0000',
  google_business_profile: '#4285F4',
  x: '#000000',
  tiktok: '#010101',
  pinterest: '#E60023',
  threads: '#000000',
}
