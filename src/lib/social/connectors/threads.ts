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

const SCOPES = ['threads_basic', 'threads_content_publish', 'pages_show_list']

export const threadsConnector: SocialConnector = {
  id: 'threads',
  label: 'Threads',
  description: 'Publish to your Threads profile (via Meta Graph API).',
  requiredScopes: SCOPES,
  supportsImages: true,
  supportsVideo: false,
  supportsScheduling: false,
  supportsDrafts: false,
  supportsAnalytics: false,
  isMock: false,

  getAuthUrl(state: string): string {
    const appId = getCredential('META_APP_ID')
    const redirectUri = getCredential('META_REDIRECT_URI') ?? getRedirectUri('threads')
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
    const redirectUri = getCredential('META_REDIRECT_URI') ?? getRedirectUri('threads')

    const tokenRes = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${appSecret}&code=${code}`,
    )
    const tokenData = (await tokenRes.json()) as { access_token: string; expires_in?: number }
    const userToken = tokenData.access_token

    const pagesRes = await fetch(
      `https://graph.facebook.com/v19.0/me/accounts?fields=id,name,threads_profile&access_token=${userToken}`,
    )
    const pagesData = (await pagesRes.json()) as {
      data?: Array<{ id: string; name: string; threads_profile?: { id: string } }>
    }
    const pages = pagesData.data ?? []

    const selectableAccounts: SelectableAccount[] = []
    for (const page of pages) {
      if (page.threads_profile?.id) {
        selectableAccounts.push({
          externalId: page.threads_profile.id,
          name: `${page.name} (Threads)`,
          type: 'Threads Profile',
          metadata: { linkedFacebookPageId: page.id },
        })
      }
    }

    const first = selectableAccounts[0]
    const account: Partial<NormalizedSocialAccount> = {
      platform: 'threads',
      accountName: first?.name ?? 'Threads Profile',
      externalAccountId: first?.externalId,
      externalPageId: first?.metadata?.linkedFacebookPageId as string | undefined,
      status: first ? 'connected' : 'error',
      connectedAt: new Date().toISOString(),
      scopesGranted: SCOPES,
      scopesRequired: SCOPES,
      errorMessage: !first ? 'No Threads profile linked to your Facebook Pages.' : undefined,
    }

    const token: OAuthTokenPayload = {
      accessToken: userToken,
      expiresAt: tokenData.expires_in
        ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
        : undefined,
      scope: SCOPES.join(' '),
      tokenType: 'Bearer',
      rawResponse: tokenData,
    }

    return { account, token, selectableAccounts: selectableAccounts.length > 1 ? selectableAccounts : undefined }
  },

  async disconnect(_accountId, token) {
    await fetch(`https://graph.facebook.com/v19.0/me/permissions?access_token=${token.accessToken}`, { method: 'DELETE' }).catch(() => {})
  },

  async refreshToken(_accountId, token) {
    const appId = getCredential('META_APP_ID')!
    const appSecret = getCredential('META_APP_SECRET')!
    const res = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${token.accessToken}`,
    )
    const data = (await res.json()) as { access_token: string; expires_in?: number }
    return {
      ...token,
      accessToken: data.access_token,
      expiresAt: data.expires_in ? new Date(Date.now() + data.expires_in * 1000).toISOString() : token.expiresAt,
    }
  },

  async getAccountProfile(token): Promise<AccountProfileResult> {
    const res = await fetch(`https://graph.facebook.com/v19.0/me?fields=id,name&access_token=${token.accessToken}`)
    const data = (await res.json()) as { id: string; name: string }
    return { externalAccountId: data.id, accountName: data.name ?? 'Threads Profile' }
  },

  async validateConnection(_account, token) {
    try {
      const res = await fetch(`https://graph.facebook.com/v19.0/me?access_token=${token.accessToken}`)
      return { valid: res.ok, missingScopes: res.ok ? [] : SCOPES }
    } catch {
      return { valid: false, missingScopes: SCOPES, errorMessage: 'Threads token validation failed' }
    }
  },

  async publishPost(account, job, token): Promise<SocialPublishResult> {
    const threadsUserId = account.externalAccountId
    if (!threadsUserId) {
      return { platform: 'threads', success: false, errorMessage: 'Threads user ID missing on account.' }
    }
    const res = await fetch(`https://graph.facebook.com/v19.0/${threadsUserId}/threads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        media_type: job.media?.[0]?.url ? 'IMAGE' : 'TEXT',
        text: job.message,
        image_url: job.media?.[0]?.url,
        access_token: token.accessToken,
      }),
    })
    const data = (await res.json()) as { id?: string; error?: { message?: string } }
    if (!res.ok) {
      return { platform: 'threads', success: false, errorMessage: data.error?.message ?? JSON.stringify(data).slice(0, 200) }
    }
    return {
      platform: 'threads',
      success: true,
      externalPostId: data.id,
      publishedAt: new Date().toISOString(),
    }
  },
}
