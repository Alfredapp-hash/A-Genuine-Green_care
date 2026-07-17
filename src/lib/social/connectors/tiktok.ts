import type {
  SocialConnector,
  NormalizedSocialAccount,
  OAuthTokenPayload,
  SocialPublishJob,
  SocialPublishResult,
  AccountProfileResult,
} from './types'
import { getCredential, getRedirectUri } from '@/lib/integrations/credential-resolver'

const SCOPES = ['user.info.basic', 'video.publish', 'video.upload']

export const tiktokConnector: SocialConnector = {
  id: 'tiktok',
  label: 'TikTok',
  description: 'Connect your TikTok Business account for video publishing (requires TikTok developer app approval).',
  requiredScopes: SCOPES,
  supportsImages: false,
  supportsVideo: true,
  supportsScheduling: false,
  supportsDrafts: true,
  supportsAnalytics: false,
  isMock: false,

  getAuthUrl(state: string, pkce?: { codeChallenge: string }): string {
    const clientKey = getCredential('TIKTOK_CLIENT_KEY')
    const redirectUri = getCredential('TIKTOK_REDIRECT_URI') ?? getRedirectUri('tiktok')
    if (!clientKey || !redirectUri) throw new Error('TIKTOK_CLIENT_KEY or redirect URI not configured')
    if (!pkce?.codeChallenge) throw new Error('TikTok OAuth requires PKCE code challenge')

    const params = new URLSearchParams({
      client_key: clientKey,
      redirect_uri: redirectUri,
      scope: SCOPES.join(','),
      response_type: 'code',
      state,
      code_challenge: pkce.codeChallenge,
      code_challenge_method: 'S256',
    })
    return `https://www.tiktok.com/v2/auth/authorize/?${params}`
  },

  async handleCallback(code, _state, rawQuery) {
    const clientKey = getCredential('TIKTOK_CLIENT_KEY')!
    const clientSecret = getCredential('TIKTOK_CLIENT_SECRET')!
    const redirectUri = getCredential('TIKTOK_REDIRECT_URI') ?? getRedirectUri('tiktok')
    const codeVerifier = rawQuery.__code_verifier
    if (!codeVerifier) throw new Error('Missing PKCE code verifier for TikTok OAuth')

    const tokenRes = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_key: clientKey,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    })
    const tokenData = (await tokenRes.json()) as {
      access_token?: string
      refresh_token?: string
      expires_in?: number
      scope?: string
      open_id?: string
      error?: string
      error_description?: string
    }
    if (!tokenRes.ok || !tokenData.access_token) {
      throw new Error(tokenData.error_description ?? tokenData.error ?? JSON.stringify(tokenData).slice(0, 300))
    }

    const userRes = await fetch('https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name,avatar_url,username', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    const userJson = (await userRes.json()) as {
      data?: { user?: { open_id?: string; display_name?: string; avatar_url?: string; username?: string } }
    }
    const user = userJson.data?.user

    const account: Partial<NormalizedSocialAccount> = {
      platform: 'tiktok',
      accountName: user?.display_name ?? 'TikTok Account',
      accountHandle: user?.username ? `@${user.username}` : undefined,
      externalAccountId: user?.open_id ?? tokenData.open_id,
      profileImageUrl: user?.avatar_url,
      status: 'connected',
      connectedAt: new Date().toISOString(),
      scopesGranted: tokenData.scope?.split(',') ?? SCOPES,
      scopesRequired: SCOPES,
    }

    const token: OAuthTokenPayload = {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: tokenData.expires_in
        ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
        : undefined,
      scope: tokenData.scope,
      tokenType: 'Bearer',
      rawResponse: tokenData,
    }

    return { account, token }
  },

  async disconnect(_accountId, _token) {
    /* TikTok token revoke optional */
  },

  async refreshToken(_accountId, token) {
    const clientKey = getCredential('TIKTOK_CLIENT_KEY')!
    const clientSecret = getCredential('TIKTOK_CLIENT_SECRET')!
    if (!token.refreshToken) throw new Error('No TikTok refresh token')
    const res = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_key: clientKey,
        client_secret: clientSecret,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
      }),
    })
    const data = (await res.json()) as { access_token?: string; refresh_token?: string; expires_in?: number }
    if (!res.ok || !data.access_token) throw new Error(JSON.stringify(data).slice(0, 300))
    return {
      ...token,
      accessToken: data.access_token,
      refreshToken: data.refresh_token ?? token.refreshToken,
      expiresAt: data.expires_in ? new Date(Date.now() + data.expires_in * 1000).toISOString() : token.expiresAt,
    }
  },

  async getAccountProfile(token): Promise<AccountProfileResult> {
    const res = await fetch('https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name,avatar_url,username', {
      headers: { Authorization: `Bearer ${token.accessToken}` },
    })
    const json = (await res.json()) as { data?: { user?: { open_id?: string; display_name?: string; username?: string; avatar_url?: string } } }
    const u = json.data?.user
    return {
      externalAccountId: u?.open_id ?? '',
      accountName: u?.display_name ?? 'TikTok Account',
      accountHandle: u?.username ? `@${u.username}` : undefined,
      profileImageUrl: u?.avatar_url,
    }
  },

  async validateConnection(_account, token) {
    try {
      const res = await fetch('https://open.tiktokapis.com/v2/user/info/?fields=open_id', {
        headers: { Authorization: `Bearer ${token.accessToken}` },
      })
      return { valid: res.ok, missingScopes: res.ok ? [] : SCOPES }
    } catch {
      return { valid: false, missingScopes: SCOPES, errorMessage: 'TikTok token validation failed' }
    }
  },

  async publishPost(_account, _job, _token): Promise<SocialPublishResult> {
    return {
      platform: 'tiktok',
      success: false,
      errorMessage: 'TikTok video upload requires a video file via Content Posting API. Save as draft and upload manually until media pipeline is wired.',
    }
  },
}
