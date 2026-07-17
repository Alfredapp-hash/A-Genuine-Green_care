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

const SCOPES = ['ads_read', 'ads_management', 'business_management', 'pages_show_list']

/** Meta Marketing / Ads account — for AI ad drafts and future Ads Manager sync. Not a social post publisher. */
export const metaMarketingConnector: SocialConnector = {
  id: 'meta_marketing',
  label: 'Meta Marketing (Ads)',
  description: 'Connect your Meta ad account for AI Command Center ad drafts and attribution (uses same Meta app).',
  requiredScopes: SCOPES,
  supportsImages: false,
  supportsVideo: false,
  supportsScheduling: false,
  supportsDrafts: true,
  supportsAnalytics: true,
  isMock: false,

  getAuthUrl(state: string): string {
    const appId = getCredential('META_APP_ID')
    const redirectUri = getCredential('META_MARKETING_REDIRECT_URI') ?? getRedirectUri('meta_marketing')
    if (!appId || !redirectUri) throw new Error('META_APP_ID or marketing redirect URI not configured')
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
    const redirectUri = getCredential('META_MARKETING_REDIRECT_URI') ?? getRedirectUri('meta_marketing')

    const tokenRes = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${appSecret}&code=${code}`,
    )
    const tokenData = (await tokenRes.json()) as { access_token: string; expires_in?: number }
    const userToken = tokenData.access_token

    const adAccountsRes = await fetch(
      `https://graph.facebook.com/v19.0/me/adaccounts?fields=id,name,account_id,currency&access_token=${userToken}`,
    )
    const adAccountsData = (await adAccountsRes.json()) as {
      data?: Array<{ id: string; name?: string; account_id?: string; currency?: string }>
    }
    const adAccounts = adAccountsData.data ?? []

    const selectableAccounts: SelectableAccount[] = adAccounts.map((a) => ({
      externalId: a.id,
      name: a.name ?? `Ad Account ${a.account_id ?? a.id}`,
      type: 'Meta Ad Account',
      metadata: { accountId: a.account_id, currency: a.currency },
    }))

    const first = selectableAccounts[0]
    const account: Partial<NormalizedSocialAccount> = {
      platform: 'meta_marketing',
      accountName: first?.name ?? 'Meta Ad Account',
      externalAccountId: first?.externalId,
      externalBusinessId: first?.metadata?.accountId as string | undefined,
      status: first ? 'connected' : 'error',
      connectedAt: new Date().toISOString(),
      scopesGranted: SCOPES,
      scopesRequired: SCOPES,
      errorMessage: !first ? 'No Meta ad accounts found for this user.' : undefined,
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
    return { externalAccountId: data.id, accountName: data.name ?? 'Meta Marketing' }
  },

  async validateConnection(account, token) {
    try {
      const adAccountId = account.externalAccountId
      if (!adAccountId) return { valid: false, missingScopes: SCOPES, errorMessage: 'No ad account selected' }
      const res = await fetch(`https://graph.facebook.com/v19.0/${adAccountId}?fields=id,name&access_token=${token.accessToken}`)
      return { valid: res.ok, missingScopes: res.ok ? [] : SCOPES }
    } catch {
      return { valid: false, missingScopes: SCOPES, errorMessage: 'Meta Marketing token validation failed' }
    }
  },

  async publishPost(_account, _job, _token): Promise<SocialPublishResult> {
    return {
      platform: 'meta_marketing',
      success: false,
      errorMessage: 'Meta Marketing connector is for ad account access — not for social posts.',
    }
  },
}
