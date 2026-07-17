import type {
  SocialConnector,
  NormalizedSocialAccount,
  OAuthTokenPayload,
  SocialPublishJob,
  SocialPublishResult,
  AccountProfileResult,
  SelectableAccount,
} from './types'
import { getCredential, getRedirectUri } from '@/lib/integrations/credential-resolver'

const SCOPES = ['boards:read', 'boards:write', 'pins:read', 'pins:write', 'user_accounts:read']

export const pinterestConnector: SocialConnector = {
  id: 'pinterest',
  label: 'Pinterest',
  description: 'Publish pins to your Pinterest business account.',
  requiredScopes: SCOPES,
  supportsImages: true,
  supportsVideo: false,
  supportsScheduling: false,
  supportsDrafts: false,
  supportsAnalytics: false,
  isMock: false,

  getAuthUrl(state: string, pkce?: { codeChallenge: string }): string {
    const appId = getCredential('PINTEREST_APP_ID')
    const redirectUri = getCredential('PINTEREST_REDIRECT_URI') ?? getRedirectUri('pinterest')
    if (!appId || !redirectUri) throw new Error('PINTEREST_APP_ID or redirect URI not configured')
    if (!pkce?.codeChallenge) throw new Error('Pinterest OAuth requires PKCE code challenge')

    const params = new URLSearchParams({
      client_id: appId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: SCOPES.join(','),
      state,
      code_challenge: pkce.codeChallenge,
      code_challenge_method: 'S256',
    })
    return `https://www.pinterest.com/oauth/?${params}`
  },

  async handleCallback(code, _state, rawQuery) {
    const appId = getCredential('PINTEREST_APP_ID')!
    const appSecret = getCredential('PINTEREST_APP_SECRET')!
    const redirectUri = getCredential('PINTEREST_REDIRECT_URI') ?? getRedirectUri('pinterest')
    const codeVerifier = rawQuery.__code_verifier
    if (!codeVerifier) throw new Error('Missing PKCE code verifier for Pinterest OAuth')

    const basic = Buffer.from(`${appId}:${appSecret}`).toString('base64')
    const tokenRes = await fetch('https://api.pinterest.com/v5/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${basic}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    })
    const tokenData = (await tokenRes.json()) as {
      access_token?: string
      refresh_token?: string
      expires_in?: number
      scope?: string
    }
    if (!tokenRes.ok || !tokenData.access_token) throw new Error(JSON.stringify(tokenData).slice(0, 300))

    const userRes = await fetch('https://api.pinterest.com/v5/user_account', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    const user = (await userRes.json()) as { username?: string; business_name?: string; profile_image?: string; id?: string }

    const account: Partial<NormalizedSocialAccount> = {
      platform: 'pinterest',
      accountName: user.business_name ?? user.username ?? 'Pinterest Account',
      accountHandle: user.username ? `@${user.username}` : undefined,
      externalAccountId: user.id,
      profileImageUrl: user.profile_image,
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

  async disconnect(_accountId, _token) {},

  async refreshToken(_accountId, token) {
    const appId = getCredential('PINTEREST_APP_ID')!
    const appSecret = getCredential('PINTEREST_APP_SECRET')!
    if (!token.refreshToken) throw new Error('No Pinterest refresh token')
    const basic = Buffer.from(`${appId}:${appSecret}`).toString('base64')
    const res = await fetch('https://api.pinterest.com/v5/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${basic}`,
      },
      body: new URLSearchParams({
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
    const res = await fetch('https://api.pinterest.com/v5/user_account', {
      headers: { Authorization: `Bearer ${token.accessToken}` },
    })
    const user = (await res.json()) as { username?: string; business_name?: string; profile_image?: string; id?: string }
    return {
      externalAccountId: user.id ?? '',
      accountName: user.business_name ?? user.username ?? 'Pinterest Account',
      accountHandle: user.username ? `@${user.username}` : undefined,
      profileImageUrl: user.profile_image,
    }
  },

  async validateConnection(_account, token) {
    try {
      const res = await fetch('https://api.pinterest.com/v5/user_account', {
        headers: { Authorization: `Bearer ${token.accessToken}` },
      })
      return { valid: res.ok, missingScopes: res.ok ? [] : SCOPES }
    } catch {
      return { valid: false, missingScopes: SCOPES, errorMessage: 'Pinterest token validation failed' }
    }
  },

  async publishPost(account, job, token): Promise<SocialPublishResult> {
    const imageUrl = job.media?.[0]?.url
    if (!imageUrl) {
      return { platform: 'pinterest', success: false, errorMessage: 'Pinterest pins require an image URL.' }
    }

    const boardsRes = await fetch('https://api.pinterest.com/v5/boards', {
      headers: { Authorization: `Bearer ${token.accessToken}` },
    })
    const boardsJson = (await boardsRes.json()) as { items?: Array<{ id: string; name?: string }> }
    const boardId = boardsJson.items?.[0]?.id
    if (!boardId) {
      return { platform: 'pinterest', success: false, errorMessage: 'No Pinterest board found on this account.' }
    }

    const pinRes = await fetch('https://api.pinterest.com/v5/pins', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        board_id: boardId,
        title: job.message.slice(0, 100),
        description: job.message.slice(0, 500),
        media_source: { source_type: 'image_url', url: imageUrl },
      }),
    })
    const pinData = (await pinRes.json()) as { id?: string; link?: string; message?: string }
    if (!pinRes.ok) {
      return { platform: 'pinterest', success: false, errorMessage: pinData.message ?? JSON.stringify(pinData).slice(0, 200) }
    }
    return {
      platform: 'pinterest',
      success: true,
      externalPostId: pinData.id,
      externalPostUrl: pinData.link ?? (pinData.id ? `https://www.pinterest.com/pin/${pinData.id}` : undefined),
      publishedAt: new Date().toISOString(),
    }
  },
}
