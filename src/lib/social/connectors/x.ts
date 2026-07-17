import type {
  SocialConnector,
  NormalizedSocialAccount,
  OAuthTokenPayload,
  SocialPublishJob,
  SocialPublishResult,
  AccountProfileResult,
} from './types'
import { getCredential, getRedirectUri } from '@/lib/integrations/credential-resolver'

const SCOPES = ['tweet.read', 'tweet.write', 'users.read', 'offline.access']

export const xConnector: SocialConnector = {
  id: 'x',
  label: 'X (Twitter)',
  description: 'Publish posts to your X profile. Requires a paid X API developer plan for write access.',
  requiredScopes: SCOPES,
  supportsImages: true,
  supportsVideo: false,
  supportsScheduling: false,
  supportsDrafts: false,
  supportsAnalytics: false,
  isMock: false,

  getAuthUrl(state: string, pkce?: { codeChallenge: string }): string {
    const clientId = getCredential('X_CLIENT_ID')
    const redirectUri = getCredential('X_REDIRECT_URI') ?? getRedirectUri('x')
    if (!clientId || !redirectUri) throw new Error('X_CLIENT_ID or redirect URI not configured')
    if (!pkce?.codeChallenge) throw new Error('X OAuth requires PKCE code challenge')

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: SCOPES.join(' '),
      state,
      code_challenge: pkce.codeChallenge,
      code_challenge_method: 'S256',
    })
    return `https://twitter.com/i/oauth2/authorize?${params}`
  },

  async handleCallback(code, _state, rawQuery) {
    const clientId = getCredential('X_CLIENT_ID')!
    const clientSecret = getCredential('X_CLIENT_SECRET')!
    const redirectUri = getCredential('X_REDIRECT_URI') ?? getRedirectUri('x')
    const codeVerifier = rawQuery.__code_verifier
    if (!codeVerifier) throw new Error('Missing PKCE code verifier for X OAuth')

    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    const tokenRes = await fetch('https://api.twitter.com/2/oauth2/token', {
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
      access_token: string
      refresh_token?: string
      expires_in?: number
      scope?: string
      token_type?: string
    }
    if (!tokenRes.ok) throw new Error(JSON.stringify(tokenData).slice(0, 300))

    const profileRes = await fetch('https://api.twitter.com/2/users/me?user.fields=profile_image_url,username,name', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    const profileJson = (await profileRes.json()) as {
      data?: { id: string; name?: string; username?: string; profile_image_url?: string }
    }
    const profile = profileJson.data

    const account: Partial<NormalizedSocialAccount> = {
      platform: 'x',
      accountName: profile?.name ?? 'X Account',
      accountHandle: profile?.username ? `@${profile.username}` : undefined,
      externalAccountId: profile?.id,
      profileImageUrl: profile?.profile_image_url,
      status: 'connected',
      connectedAt: new Date().toISOString(),
      scopesGranted: tokenData.scope?.split(' ') ?? SCOPES,
      scopesRequired: SCOPES,
    }

    const token: OAuthTokenPayload = {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: tokenData.expires_in
        ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
        : undefined,
      scope: tokenData.scope,
      tokenType: tokenData.token_type ?? 'Bearer',
      rawResponse: tokenData,
    }

    return { account, token }
  },

  async disconnect(_accountId, token) {
    const clientId = getCredential('X_CLIENT_ID')
    const clientSecret = getCredential('X_CLIENT_SECRET')
    if (!clientId || !clientSecret || !token.accessToken) return
    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    await fetch('https://api.twitter.com/2/oauth2/revoke', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `Basic ${basic}` },
      body: new URLSearchParams({ token: token.accessToken, token_type_hint: 'access_token' }),
    }).catch(() => {})
  },

  async refreshToken(_accountId, token) {
    const clientId = getCredential('X_CLIENT_ID')!
    const clientSecret = getCredential('X_CLIENT_SECRET')!
    if (!token.refreshToken) throw new Error('No X refresh token available')
    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    const res = await fetch('https://api.twitter.com/2/oauth2/token', {
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
    const data = (await res.json()) as { access_token: string; refresh_token?: string; expires_in?: number }
    if (!res.ok) throw new Error(JSON.stringify(data).slice(0, 300))
    return {
      ...token,
      accessToken: data.access_token,
      refreshToken: data.refresh_token ?? token.refreshToken,
      expiresAt: data.expires_in ? new Date(Date.now() + data.expires_in * 1000).toISOString() : token.expiresAt,
    }
  },

  async getAccountProfile(token): Promise<AccountProfileResult> {
    const res = await fetch('https://api.twitter.com/2/users/me?user.fields=profile_image_url,username,name', {
      headers: { Authorization: `Bearer ${token.accessToken}` },
    })
    const json = (await res.json()) as { data?: { id: string; name?: string; username?: string; profile_image_url?: string } }
    const d = json.data
    return {
      externalAccountId: d?.id ?? '',
      accountName: d?.name ?? 'X Account',
      accountHandle: d?.username ? `@${d.username}` : undefined,
      profileImageUrl: d?.profile_image_url,
    }
  },

  async validateConnection(_account, token) {
    try {
      const res = await fetch('https://api.twitter.com/2/users/me', {
        headers: { Authorization: `Bearer ${token.accessToken}` },
      })
      return { valid: res.ok, missingScopes: res.ok ? [] : SCOPES }
    } catch {
      return { valid: false, missingScopes: SCOPES, errorMessage: 'X token validation failed' }
    }
  },

  async publishPost(account, job, token): Promise<SocialPublishResult> {
    const text = job.message.slice(0, 280)
    const res = await fetch('https://api.twitter.com/2/tweets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    })
    const data = (await res.json()) as { data?: { id: string }; errors?: Array<{ message: string }> }
    if (!res.ok) {
      return {
        platform: 'x',
        success: false,
        errorMessage: data.errors?.[0]?.message ?? JSON.stringify(data).slice(0, 200),
      }
    }
    const id = data.data?.id
    return {
      platform: 'x',
      success: true,
      externalPostId: id,
      externalPostUrl: id ? `https://x.com/i/web/status/${id}` : undefined,
      publishedAt: new Date().toISOString(),
    }
  },
}
