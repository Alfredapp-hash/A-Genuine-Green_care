// ─────────────────────────────────────────────────────────────────────────────
// YouTube Channel Connector
// Required env: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI
// ─────────────────────────────────────────────────────────────────────────────
import type {
  SocialConnector,
  NormalizedSocialAccount,
  OAuthTokenPayload,
  SocialPublishResult,
  AccountProfileResult,
} from './types'
import { getCredential, getRedirectUri } from '@/lib/integrations/credential-resolver'

const SCOPES = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube.readonly',
  'openid',
  'profile',
  'email',
]

export const youtubeConnector: SocialConnector = {
  id: 'youtube',
  label: 'YouTube Channel',
  description: 'Upload videos to your YouTube channel.',
  requiredScopes: SCOPES,
  supportsImages: false,
  supportsVideo: true,
  supportsScheduling: false,
  supportsDrafts: false,
  supportsAnalytics: false,
  isMock: false,

  getAuthUrl(state: string): string {
    const clientId = getCredential('GOOGLE_CLIENT_ID')
    const redirectUri = getCredential('GOOGLE_REDIRECT_URI') ?? getRedirectUri('youtube')
    if (!clientId || !redirectUri) throw new Error('GOOGLE_CLIENT_ID or redirect URI not configured')
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: SCOPES.join(' '),
      access_type: 'offline',
      prompt: 'consent',
      state,
    })
    return `https://accounts.google.com/o/oauth2/v2/auth?${params}`
  },

  async handleCallback(code, _state, _raw) {
    const clientId = getCredential('GOOGLE_CLIENT_ID')!
    const clientSecret = getCredential('GOOGLE_CLIENT_SECRET')!
    const redirectUri = getCredential('GOOGLE_REDIRECT_URI') ?? getRedirectUri('youtube')

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })
    const tokenData = await tokenRes.json() as {
      access_token: string;
      refresh_token?: string;
      expires_in?: number;
      scope?: string;
    }

    const channelRes = await fetch(
      'https://www.googleapis.com/youtube/v3/channels?part=snippet,id&mine=true',
      { headers: { Authorization: `Bearer ${tokenData.access_token}` } }
    )
    const channelData = await channelRes.json() as {
      items?: Array<{ id: string; snippet: { title: string; customUrl?: string; thumbnails?: { default?: { url: string } } } }>
    }
    const channel = channelData.items?.[0]

    const account: Partial<NormalizedSocialAccount> = {
      platform: 'youtube',
      accountName: channel?.snippet.title ?? 'YouTube Channel',
      accountHandle: channel?.snippet.customUrl ? `@${channel.snippet.customUrl.replace('@', '')}` : undefined,
      externalAccountId: channel?.id,
      profileImageUrl: channel?.snippet.thumbnails?.default?.url,
      status: channel ? 'connected' : 'error',
      connectedAt: new Date().toISOString(),
      scopesGranted: (tokenData.scope ?? '').split(' ').filter(Boolean),
      scopesRequired: SCOPES,
      errorMessage: !channel ? 'No YouTube channel found for this Google account.' : undefined,
      metadata: { channelId: channel?.id },
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

  async disconnect(_accountId, token) {
    await fetch(`https://oauth2.googleapis.com/revoke?token=${token.accessToken}`, { method: 'POST' })
      .catch(() => { /* best-effort */ })
  },

  async refreshToken(_accountId, token) {
    if (!token.refreshToken) throw new Error('No refresh token for YouTube')
    const clientId = getCredential('GOOGLE_CLIENT_ID')!
    const clientSecret = getCredential('GOOGLE_CLIENT_SECRET')!
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    })
    const data = await res.json() as { access_token: string; expires_in?: number }
    return {
      ...token,
      accessToken: data.access_token,
      expiresAt: data.expires_in ? new Date(Date.now() + data.expires_in * 1000).toISOString() : undefined,
    }
  },

  async getAccountProfile(token): Promise<AccountProfileResult> {
    const res = await fetch(
      'https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true',
      { headers: { Authorization: `Bearer ${token.accessToken}` } }
    )
    const data = await res.json() as { items?: Array<{ id: string; snippet: { title: string; customUrl?: string } }> }
    const ch = data.items?.[0]
    return {
      externalAccountId: ch?.id ?? '',
      accountName: ch?.snippet.title ?? 'YouTube Channel',
      accountHandle: ch?.snippet.customUrl ? `@${ch.snippet.customUrl}` : undefined,
    }
  },

  async validateConnection(_account, token) {
    try {
      const res = await fetch(
        'https://www.googleapis.com/youtube/v3/channels?part=id&mine=true',
        { headers: { Authorization: `Bearer ${token.accessToken}` } }
      )
      if (!res.ok) return { valid: false, missingScopes: [], errorMessage: 'Token invalid or expired' }
      return { valid: true, missingScopes: [] }
    } catch (e) {
      return { valid: false, missingScopes: [], errorMessage: String(e) }
    }
  },

  async publishPost(_account, _job, _token): Promise<SocialPublishResult> {
    return {
      platform: 'youtube',
      success: false,
      errorCode: 'NOT_IMPLEMENTED',
      errorMessage: 'YouTube publishing requires a video file upload. Use the YouTube Studio or provide a video media URL.',
    }
  },
}
