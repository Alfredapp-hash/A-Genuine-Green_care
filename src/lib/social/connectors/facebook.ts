// ─────────────────────────────────────────────────────────────────────────────
// Facebook Page Connector
// Required env: META_APP_ID, META_APP_SECRET, META_REDIRECT_URI
// ─────────────────────────────────────────────────────────────────────────────
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

const SCOPES = ['pages_show_list', 'pages_read_engagement', 'pages_manage_posts']

export const facebookConnector: SocialConnector = {
  id: 'facebook',
  label: 'Facebook Page',
  description: 'Publish posts, updates, and media to your Facebook Business Page.',
  requiredScopes: SCOPES,
  supportsImages: true,
  supportsVideo: true,
  supportsScheduling: true,
  supportsDrafts: false,
  supportsAnalytics: true,
  isMock: false,

  getAuthUrl(state: string): string {
    const appId = getCredential('META_APP_ID')
    const redirectUri = getCredential('META_REDIRECT_URI') ?? getRedirectUri('facebook')
    if (!appId || !redirectUri) throw new Error('META_APP_ID or redirect URI not configured')
    const params = new URLSearchParams({
      client_id: appId,
      redirect_uri: redirectUri,
      scope: SCOPES.join(','),
      response_type: 'code',
      state,
    })
    return `https://www.facebook.com/v19.0/dialog/oauth?${params}`
  },

  async handleCallback(code, _state, _raw) {
    const appId = getCredential('META_APP_ID')!
    const appSecret = getCredential('META_APP_SECRET')!
    const redirectUri = getCredential('META_REDIRECT_URI') ?? getRedirectUri('facebook')

    const tokenRes = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${appSecret}&code=${code}`
    )
    const tokenData = await tokenRes.json() as { access_token: string; expires_in?: number }
    const userToken = tokenData.access_token

    const pagesRes = await fetch(
      `https://graph.facebook.com/v19.0/me/accounts?fields=id,name,category,access_token&access_token=${userToken}`
    )
    const pagesData = await pagesRes.json() as { data?: Array<{ id: string; name: string; category?: string; access_token: string }> }
    const pages = pagesData.data ?? []

    const selectableAccounts: SelectableAccount[] = pages.map((p) => ({
      externalId: p.id,
      name: p.name,
      type: p.category ?? 'Facebook Page',
      metadata: { pageAccessToken: p.access_token },
    }))

    const selectedPage = pages.length === 1 ? pages[0] : undefined

    const account: Partial<NormalizedSocialAccount> = {
      platform: 'facebook',
      accountName: selectedPage?.name ?? 'Facebook Page',
      externalPageId: selectedPage?.id,
      status: 'connected',
      connectedAt: new Date().toISOString(),
      scopesGranted: SCOPES,
      scopesRequired: SCOPES,
      metadata: selectedPage ? { pageAccessToken: selectedPage.access_token } : undefined,
    }

    const token: OAuthTokenPayload = {
      accessToken: selectedPage?.access_token ?? userToken,
      expiresAt: tokenData.expires_in
        ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
        : undefined,
      scope: SCOPES.join(' '),
      tokenType: 'Bearer',
      rawResponse: tokenData,
    }

    return { account, token, selectableAccounts: pages.length > 1 ? selectableAccounts : undefined }
  },

  async disconnect(_accountId, token) {
    await fetch(`https://graph.facebook.com/v19.0/me/permissions?access_token=${token.accessToken}`, { method: 'DELETE' })
      .catch(() => { /* best-effort */ })
  },

  async refreshToken(_accountId, token) {
    const appId = getCredential('META_APP_ID')!
    const appSecret = getCredential('META_APP_SECRET')!
    const res = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${token.accessToken}`
    )
    const data = await res.json() as { access_token: string; expires_in?: number }
    return {
      ...token,
      accessToken: data.access_token,
      expiresAt: data.expires_in ? new Date(Date.now() + data.expires_in * 1000).toISOString() : undefined,
    }
  },

  async getAccountProfile(token): Promise<AccountProfileResult> {
    const res = await fetch(`https://graph.facebook.com/v19.0/me?fields=id,name&access_token=${token.accessToken}`)
    const data = await res.json() as { id: string; name: string }
    return { externalAccountId: data.id, accountName: data.name }
  },

  async validateConnection(account, token) {
    try {
      const res = await fetch(`https://graph.facebook.com/v19.0/me?access_token=${token.accessToken}`)
      if (!res.ok) return { valid: false, missingScopes: [], errorMessage: 'Token invalid or expired' }
      return { valid: true, missingScopes: [] }
    } catch (e) {
      return { valid: false, missingScopes: [], errorMessage: String(e) }
    }
  },

  async publishPost(account, job, token): Promise<SocialPublishResult> {
    const pageToken = (account.metadata?.pageAccessToken as string) ?? token.accessToken
    const pageId = account.externalPageId
    if (!pageId) {
      return { platform: 'facebook', success: false, errorCode: 'NO_PAGE_ID', errorMessage: 'No Facebook Page ID configured' }
    }

    const payload: Record<string, string> = { message: job.message, access_token: pageToken }
    if (job.media?.[0]?.type === 'image') payload.link = job.media[0].url

    try {
      const res = await fetch(`https://graph.facebook.com/v19.0/${pageId}/feed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json() as { id?: string; error?: { message: string; code: number } }
      if (data.error) {
        return { platform: 'facebook', success: false, errorCode: String(data.error.code), errorMessage: data.error.message }
      }
      return {
        platform: 'facebook',
        success: true,
        externalPostId: data.id,
        externalPostUrl: data.id ? `https://facebook.com/${data.id}` : undefined,
        publishedAt: new Date().toISOString(),
      }
    } catch (e) {
      return { platform: 'facebook', success: false, errorCode: 'NETWORK_ERROR', errorMessage: String(e) }
    }
  },
}
