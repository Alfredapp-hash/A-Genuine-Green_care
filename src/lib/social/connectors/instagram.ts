// ─────────────────────────────────────────────────────────────────────────────
// Instagram Business Connector
// Uses Meta OAuth — same app as Facebook.
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

const SCOPES = ['pages_show_list', 'pages_read_engagement', 'instagram_basic', 'instagram_content_publish']

export const instagramConnector: SocialConnector = {
  id: 'instagram',
  label: 'Instagram Business',
  description: 'Publish photos and reels to your professional Instagram account.',
  requiredScopes: SCOPES,
  supportsImages: true,
  supportsVideo: true,
  supportsScheduling: false,
  supportsDrafts: false,
  supportsAnalytics: false,
  isMock: false,

  getAuthUrl(state: string): string {
    const appId = getCredential('META_APP_ID')
    const redirectUri = getCredential('META_REDIRECT_URI') ?? getRedirectUri('instagram')
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
    const redirectUri = getCredential('META_REDIRECT_URI') ?? getRedirectUri('instagram')

    const tokenRes = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${appSecret}&code=${code}`
    )
    const tokenData = await tokenRes.json() as { access_token: string }
    const userToken = tokenData.access_token

    const pagesRes = await fetch(
      `https://graph.facebook.com/v19.0/me/accounts?fields=id,name,instagram_business_account&access_token=${userToken}`
    )
    const pagesData = await pagesRes.json() as { data?: Array<{ id: string; name: string; instagram_business_account?: { id: string } }> }
    const pages = pagesData.data ?? []

    const selectableAccounts: SelectableAccount[] = []
    for (const page of pages) {
      if (page.instagram_business_account?.id) {
        const igRes = await fetch(
          `https://graph.facebook.com/v19.0/${page.instagram_business_account.id}?fields=id,name,username,profile_picture_url&access_token=${userToken}`
        )
        const igData = await igRes.json() as { id: string; name?: string; username?: string; profile_picture_url?: string }
        selectableAccounts.push({
          externalId: igData.id,
          name: igData.name ?? igData.username ?? 'Instagram Account',
          handle: igData.username ? `@${igData.username}` : undefined,
          imageUrl: igData.profile_picture_url,
          type: 'Instagram Business',
          metadata: { linkedFacebookPageId: page.id },
        })
      }
    }

    const first = selectableAccounts[0]
    const account: Partial<NormalizedSocialAccount> = {
      platform: 'instagram',
      accountName: first?.name ?? 'Instagram Business',
      accountHandle: first?.handle,
      externalAccountId: first?.externalId,
      externalPageId: first?.metadata?.linkedFacebookPageId as string | undefined,
      profileImageUrl: first?.imageUrl,
      status: first ? 'connected' : 'error',
      connectedAt: new Date().toISOString(),
      scopesGranted: SCOPES,
      scopesRequired: SCOPES,
      errorMessage: !first ? 'No Instagram Business account linked to your Facebook Pages.' : undefined,
    }

    const token: OAuthTokenPayload = {
      accessToken: userToken,
      scope: SCOPES.join(' '),
      tokenType: 'Bearer',
    }

    return {
      account,
      token,
      selectableAccounts: selectableAccounts.length > 1 ? selectableAccounts : undefined,
    }
  },

  async disconnect(_accountId, _token) {
    await fetch(`https://graph.facebook.com/v19.0/me/permissions?access_token=${_token.accessToken}`, { method: 'DELETE' })
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
      if (!account.externalAccountId) return { valid: false, missingScopes: [], errorMessage: 'No Instagram account ID stored' }
      const res = await fetch(
        `https://graph.facebook.com/v19.0/${account.externalAccountId}?fields=id,name&access_token=${token.accessToken}`
      )
      if (!res.ok) return { valid: false, missingScopes: [], errorMessage: 'Token invalid or expired' }
      return { valid: true, missingScopes: [] }
    } catch (e) {
      return { valid: false, missingScopes: [], errorMessage: String(e) }
    }
  },

  async publishPost(account, job, token): Promise<SocialPublishResult> {
    const igAccountId = account.externalAccountId
    if (!igAccountId) {
      return { platform: 'instagram', success: false, errorCode: 'NO_ACCOUNT_ID', errorMessage: 'No Instagram account ID configured' }
    }

    const imageUrl = job.media?.find((m) => m.type === 'image')?.url
    if (!imageUrl) {
      return { platform: 'instagram', success: false, errorCode: 'IMAGE_REQUIRED', errorMessage: 'Instagram requires an image or video to publish' }
    }

    try {
      const containerRes = await fetch(`https://graph.facebook.com/v19.0/${igAccountId}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: imageUrl, caption: job.message, access_token: token.accessToken }),
      })
      const container = await containerRes.json() as { id?: string; error?: { message: string; code: number } }
      if (container.error) {
        return { platform: 'instagram', success: false, errorCode: String(container.error.code), errorMessage: container.error.message }
      }

      const publishRes = await fetch(`https://graph.facebook.com/v19.0/${igAccountId}/media_publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creation_id: container.id, access_token: token.accessToken }),
      })
      const published = await publishRes.json() as { id?: string; error?: { message: string; code: number } }
      if (published.error) {
        return { platform: 'instagram', success: false, errorCode: String(published.error.code), errorMessage: published.error.message }
      }

      return {
        platform: 'instagram',
        success: true,
        externalPostId: published.id,
        publishedAt: new Date().toISOString(),
      }
    } catch (e) {
      return { platform: 'instagram', success: false, errorCode: 'NETWORK_ERROR', errorMessage: String(e) }
    }
  },
}
