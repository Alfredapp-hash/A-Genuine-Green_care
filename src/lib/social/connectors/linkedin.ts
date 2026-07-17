// ─────────────────────────────────────────────────────────────────────────────
// LinkedIn Connector
// Required env: LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, LINKEDIN_REDIRECT_URI
// ─────────────────────────────────────────────────────────────────────────────
import type {
  SocialConnector,
  NormalizedSocialAccount,
  OAuthTokenPayload,
  SocialPublishResult,
  AccountProfileResult,
} from './types'
import { getCredential, getRedirectUri } from '@/lib/integrations/credential-resolver'

const SCOPES = ['openid', 'profile', 'email', 'w_member_social']

export const linkedinConnector: SocialConnector = {
  id: 'linkedin',
  label: 'LinkedIn Page',
  description: 'Share professional updates, articles, and service announcements.',
  requiredScopes: SCOPES,
  supportsImages: true,
  supportsVideo: false,
  supportsScheduling: false,
  supportsDrafts: false,
  supportsAnalytics: false,
  isMock: false,

  getAuthUrl(state: string): string {
    const clientId = getCredential('LINKEDIN_CLIENT_ID')
    const redirectUri = getCredential('LINKEDIN_REDIRECT_URI') ?? getRedirectUri('linkedin')
    if (!clientId || !redirectUri) throw new Error('LINKEDIN_CLIENT_ID or redirect URI not configured')
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: SCOPES.join(' '),
      state,
    })
    return `https://www.linkedin.com/oauth/v2/authorization?${params}`
  },

  async handleCallback(code, _state, _raw) {
    const clientId = getCredential('LINKEDIN_CLIENT_ID')!
    const clientSecret = getCredential('LINKEDIN_CLIENT_SECRET')!
    const redirectUri = getCredential('LINKEDIN_REDIRECT_URI') ?? getRedirectUri('linkedin')

    const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    })
    const tokenData = await tokenRes.json() as {
      access_token: string;
      refresh_token?: string;
      expires_in?: number;
      scope?: string;
    }

    const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    const profile = await profileRes.json() as {
      sub: string;
      name?: string;
      given_name?: string;
      family_name?: string;
      email?: string;
      picture?: string;
    }

    const accountName = profile.name ?? [profile.given_name, profile.family_name].filter(Boolean).join(' ') ?? 'LinkedIn Member'

    const account: Partial<NormalizedSocialAccount> = {
      platform: 'linkedin',
      accountName,
      externalAccountId: profile.sub,
      profileImageUrl: profile.picture,
      status: 'connected',
      connectedAt: new Date().toISOString(),
      scopesGranted: (tokenData.scope ?? SCOPES.join(' ')).split(' '),
      scopesRequired: SCOPES,
      metadata: { authorUrn: `urn:li:person:${profile.sub}` },
    }

    const token: OAuthTokenPayload = {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: tokenData.expires_in
        ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
        : undefined,
      scope: tokenData.scope,
      tokenType: 'Bearer',
    }

    return { account, token }
  },

  async disconnect(_accountId, _token) {
    // LinkedIn does not support token revocation via API in the basic tier
  },

  async refreshToken(_accountId, token) {
    if (!token.refreshToken) throw new Error('No refresh token available for LinkedIn')
    const clientId = getCredential('LINKEDIN_CLIENT_ID')!
    const clientSecret = getCredential('LINKEDIN_CLIENT_SECRET')!
    const res = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    })
    const data = await res.json() as { access_token: string; refresh_token?: string; expires_in?: number }
    return {
      ...token,
      accessToken: data.access_token,
      refreshToken: data.refresh_token ?? token.refreshToken,
      expiresAt: data.expires_in ? new Date(Date.now() + data.expires_in * 1000).toISOString() : undefined,
    }
  },

  async getAccountProfile(token): Promise<AccountProfileResult> {
    const res = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${token.accessToken}` },
    })
    const data = await res.json() as { sub: string; name?: string; picture?: string }
    return {
      externalAccountId: data.sub,
      accountName: data.name ?? 'LinkedIn Member',
      profileImageUrl: data.picture,
    }
  },

  async validateConnection(_account, token) {
    try {
      const res = await fetch('https://api.linkedin.com/v2/userinfo', {
        headers: { Authorization: `Bearer ${token.accessToken}` },
      })
      if (!res.ok) return { valid: false, missingScopes: [], errorMessage: 'Token invalid or expired' }
      return { valid: true, missingScopes: [] }
    } catch (e) {
      return { valid: false, missingScopes: [], errorMessage: String(e) }
    }
  },

  async publishPost(account, job, token): Promise<SocialPublishResult> {
    const authorUrn = account.metadata?.authorUrn as string | undefined
    if (!authorUrn) {
      return { platform: 'linkedin', success: false, errorCode: 'NO_AUTHOR_URN', errorMessage: 'No LinkedIn author URN configured' }
    }

    const shareContent: Record<string, unknown> = {
      author: authorUrn,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: { text: job.message },
          shareMediaCategory: 'NONE',
        },
      },
      visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
    }

    try {
      const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
        body: JSON.stringify(shareContent),
      })
      if (!res.ok) {
        const err = await res.json() as { message?: string; status?: number }
        return { platform: 'linkedin', success: false, errorCode: String(err.status ?? 'API_ERROR'), errorMessage: err.message ?? 'LinkedIn API error' }
      }
      const postId = res.headers.get('x-restli-id') ?? undefined
      return {
        platform: 'linkedin',
        success: true,
        externalPostId: postId,
        publishedAt: new Date().toISOString(),
      }
    } catch (e) {
      return { platform: 'linkedin', success: false, errorCode: 'NETWORK_ERROR', errorMessage: String(e) }
    }
  },
}
