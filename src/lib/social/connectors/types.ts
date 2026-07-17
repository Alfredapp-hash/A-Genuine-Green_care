// ─────────────────────────────────────────────────────────────────────────────
// Social Connector — shared interface types
// ─────────────────────────────────────────────────────────────────────────────

export type SocialPlatformId =
  | 'facebook'
  | 'instagram'
  | 'linkedin'
  | 'youtube'
  | 'google_business_profile'
  | 'x'
  | 'tiktok'
  | 'pinterest'
  | 'threads'
  | 'meta_marketing'

// ── Normalized account ────────────────────────────────────────────────────────

export type AccountStatus =
  | 'connected'
  | 'not_connected'
  | 'expired'
  | 'error'
  | 'needs_reauth'
  | 'setup_needed'

export type NormalizedSocialAccount = {
  id: string
  platform: SocialPlatformId
  accountName: string
  accountHandle?: string
  externalAccountId?: string
  externalPageId?: string
  externalBusinessId?: string
  status: AccountStatus
  enabled: boolean
  connectedAt?: string
  lastSuccessfulPostAt?: string
  lastValidatedAt?: string
  scopesGranted: string[]
  scopesRequired: string[]
  profileImageUrl?: string
  metadata?: Record<string, unknown>
  errorMessage?: string
}

// ── Publish job ───────────────────────────────────────────────────────────────

export type PublishJobStatus =
  | 'draft'
  | 'queued'
  | 'publishing'
  | 'published'
  | 'partial_failure'
  | 'failed'

export type PublishSourceType =
  | 'manual'
  | 'blog_post'
  | 'promotion'
  | 'inventory'
  | 'service_page'

export type PublishMediaItem = {
  url: string
  type: 'image' | 'video'
  alt?: string
  caption?: string
}

export type SocialPublishJob = {
  id: string
  platforms: SocialPlatformId[]
  status: PublishJobStatus
  sourceType: PublishSourceType
  sourceId?: string
  message: string
  media?: PublishMediaItem[]
  scheduledFor?: string
  createdAt: string
  updatedAt: string
  publishedResults?: SocialPublishResult[]
}

export type SocialPublishResult = {
  platform: SocialPlatformId
  success: boolean
  externalPostId?: string
  externalPostUrl?: string
  errorCode?: string
  errorMessage?: string
  publishedAt?: string
}

// ── Account profile returned from OAuth callback ──────────────────────────────

export type OAuthTokenPayload = {
  accessToken: string
  refreshToken?: string
  expiresAt?: string
  scope?: string
  tokenType?: string
  rawResponse?: unknown
}

export type AccountProfileResult = {
  externalAccountId: string
  externalPageId?: string
  accountName: string
  accountHandle?: string
  profileImageUrl?: string
  metadata?: Record<string, unknown>
}

// ── Page/location selection (for platforms that return multiple) ──────────────

export type SelectableAccount = {
  externalId: string
  name: string
  handle?: string
  imageUrl?: string
  type: string
  metadata?: Record<string, unknown>
}

// ── Connector interface ───────────────────────────────────────────────────────

export interface SocialConnector {
  id: SocialPlatformId
  label: string
  description: string
  requiredScopes: string[]
  supportsImages: boolean
  supportsVideo: boolean
  supportsScheduling: boolean
  supportsDrafts: boolean
  supportsAnalytics: boolean
  isMock: boolean

  /** Returns the OAuth authorization URL to redirect the user to */
  getAuthUrl(state: string, pkce?: { codeChallenge: string }): string

  /** Exchange code for token, fetch profile, return normalized account */
  handleCallback(
    code: string,
    state: string,
    rawQuery: Record<string, string>
  ): Promise<{ account: Partial<NormalizedSocialAccount>; token: OAuthTokenPayload; selectableAccounts?: SelectableAccount[] }>

  /** Revoke/invalidate the stored token */
  disconnect(accountId: string, token: OAuthTokenPayload): Promise<void>

  /** Use refresh token to get a new access token */
  refreshToken(accountId: string, token: OAuthTokenPayload): Promise<OAuthTokenPayload>

  /** Fetch the latest profile info for an already-connected account */
  getAccountProfile(token: OAuthTokenPayload): Promise<AccountProfileResult>

  /** Confirm the token is still valid and has required scopes */
  validateConnection(
    account: NormalizedSocialAccount,
    token: OAuthTokenPayload
  ): Promise<{ valid: boolean; missingScopes: string[]; errorMessage?: string }>

  /** Publish a job to this platform */
  publishPost(
    account: NormalizedSocialAccount,
    job: SocialPublishJob,
    token: OAuthTokenPayload
  ): Promise<SocialPublishResult>
}
