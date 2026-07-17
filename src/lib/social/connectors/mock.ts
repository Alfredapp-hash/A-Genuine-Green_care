// ─────────────────────────────────────────────────────────────────────────────
// Mock Connector — used when SOCIAL_CONNECTORS_MODE=mock or in development
// when real credentials are not configured. Never used in production.
// ─────────────────────────────────────────────────────────────────────────────
import type {
  SocialConnector,
  SocialPlatformId,
  NormalizedSocialAccount,
  OAuthTokenPayload,
  SocialPublishJob,
  SocialPublishResult,
  AccountProfileResult,
} from './types'
import { nanoid } from 'nanoid'

export function createMockConnector(
  platform: SocialPlatformId,
  label: string,
  description: string,
  requiredScopes: string[],
  caps: { supportsImages?: boolean; supportsVideo?: boolean; supportsScheduling?: boolean; supportsDrafts?: boolean; supportsAnalytics?: boolean } = {}
): SocialConnector {
  return {
    id: platform,
    label,
    description,
    requiredScopes,
    supportsImages: caps.supportsImages ?? true,
    supportsVideo: caps.supportsVideo ?? false,
    supportsScheduling: caps.supportsScheduling ?? true,
    supportsDrafts: caps.supportsDrafts ?? true,
    supportsAnalytics: caps.supportsAnalytics ?? false,
    isMock: true,

    getAuthUrl(state: string, _pkce?: { codeChallenge: string }): string {
      return `/api/social/oauth/${platform}/start?state=${state}&mock=1`
    },

    async handleCallback(_code, _state, _raw) {
      const account: Partial<NormalizedSocialAccount> = {
        platform,
        accountName: `Mock ${label} Account`,
        accountHandle: `@mock_${platform}`,
        externalAccountId: `mock_${nanoid(8)}`,
        status: 'connected',
        connectedAt: new Date().toISOString(),
        scopesGranted: requiredScopes,
        scopesRequired: requiredScopes,
      }
      const token: OAuthTokenPayload = {
        accessToken: `mock_access_${nanoid(16)}`,
        refreshToken: `mock_refresh_${nanoid(16)}`,
        expiresAt: new Date(Date.now() + 60 * 24 * 3600_000).toISOString(),
        scope: requiredScopes.join(' '),
        tokenType: 'Bearer',
      }
      return { account, token }
    },

    async disconnect(_accountId, _token) {
      // Mock: nothing to revoke
    },

    async refreshToken(_accountId, token) {
      return {
        ...token,
        accessToken: `mock_access_${nanoid(16)}`,
        expiresAt: new Date(Date.now() + 60 * 24 * 3600_000).toISOString(),
      }
    },

    async getAccountProfile(_token): Promise<AccountProfileResult> {
      return {
        externalAccountId: `mock_${nanoid(8)}`,
        accountName: `Mock ${label} Account`,
        accountHandle: `@mock_${platform}`,
      }
    },

    async validateConnection(_account, _token) {
      return { valid: true, missingScopes: [] }
    },

    async publishPost(
      account: NormalizedSocialAccount,
      _job: SocialPublishJob,
      _token: OAuthTokenPayload
    ): Promise<SocialPublishResult> {
      return {
        platform: account.platform,
        success: true,
        externalPostId: `mock_post_${nanoid(8)}`,
        externalPostUrl: `https://example.com/mock/${platform}/${nanoid(8)}`,
        publishedAt: new Date().toISOString(),
      }
    },
  }
}

// ── Pre-built mock connectors for each platform ───────────────────────────────

export const MOCK_CONNECTORS: Record<SocialPlatformId, SocialConnector> = {
  facebook: createMockConnector(
    'facebook', 'Facebook Page', 'Publish posts to your Facebook Business Page.',
    ['pages_show_list', 'pages_read_engagement', 'pages_manage_posts'],
    { supportsImages: true, supportsScheduling: true, supportsAnalytics: true }
  ),
  instagram: createMockConnector(
    'instagram', 'Instagram Business', 'Publish photo and video content to Instagram.',
    ['pages_show_list', 'instagram_basic', 'instagram_content_publish'],
    { supportsImages: true, supportsVideo: true, supportsScheduling: false }
  ),
  linkedin: createMockConnector(
    'linkedin', 'LinkedIn Page', 'Share professional updates and articles.',
    ['openid', 'profile', 'email', 'w_member_social'],
    { supportsImages: true, supportsScheduling: false }
  ),
  youtube: createMockConnector(
    'youtube', 'YouTube Channel', 'Upload videos to your YouTube channel.',
    ['https://www.googleapis.com/auth/youtube.upload', 'https://www.googleapis.com/auth/youtube.readonly'],
    { supportsVideo: true, supportsImages: false, supportsScheduling: false }
  ),
  google_business_profile: createMockConnector(
    'google_business_profile', 'Google Business Profile', 'Post updates to your local business listing.',
    ['https://www.googleapis.com/auth/business.manage'],
    { supportsImages: true, supportsScheduling: false, supportsAnalytics: true }
  ),
  x: createMockConnector(
    'x', 'X (Twitter)', 'Publish posts to your X profile.',
    ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
    { supportsImages: true, supportsScheduling: false }
  ),
  tiktok: createMockConnector(
    'tiktok', 'TikTok', 'Publish video content to TikTok.',
    ['user.info.basic', 'video.publish', 'video.upload'],
    { supportsVideo: true, supportsImages: false }
  ),
  pinterest: createMockConnector(
    'pinterest', 'Pinterest', 'Publish pins to Pinterest.',
    ['boards:read', 'pins:write', 'user_accounts:read'],
    { supportsImages: true }
  ),
  threads: createMockConnector(
    'threads', 'Threads', 'Publish to your Threads profile.',
    ['threads_basic', 'threads_content_publish'],
    { supportsImages: true }
  ),
  meta_marketing: createMockConnector(
    'meta_marketing', 'Meta Marketing (Ads)', 'Connect Meta ad account for AI ad drafts.',
    ['ads_read', 'ads_management', 'business_management'],
    { supportsAnalytics: true, supportsDrafts: true, supportsImages: false }
  ),
}
