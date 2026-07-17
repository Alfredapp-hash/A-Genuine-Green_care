// ─────────────────────────────────────────────────────────────────────────────
// Google Business Profile Connector
// Required env: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI
// ─────────────────────────────────────────────────────────────────────────────
import type {
  SocialConnector,
  NormalizedSocialAccount,
  OAuthTokenPayload,
  SocialPublishResult,
  AccountProfileResult,
  SelectableAccount,
} from './types'
import { getCredential, getRedirectUri } from '@/lib/integrations/credential-resolver'

const SCOPES = [
  'https://www.googleapis.com/auth/business.manage',
  'openid',
  'profile',
  'email',
]

export const googleBusinessConnector: SocialConnector = {
  id: 'google_business_profile',
  label: 'Google Business Profile',
  description: 'Post updates to your local business listing on Google Search and Maps.',
  requiredScopes: SCOPES,
  supportsImages: true,
  supportsVideo: false,
  supportsScheduling: false,
  supportsDrafts: false,
  supportsAnalytics: true,
  isMock: false,

  getAuthUrl(state: string): string {
    const clientId = getCredential('GOOGLE_CLIENT_ID')
    const redirectUri = getCredential('GOOGLE_REDIRECT_URI') ?? getRedirectUri('google_business_profile')
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
    const redirectUri = getCredential('GOOGLE_REDIRECT_URI') ?? getRedirectUri('google_business_profile')

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

    const accountsRes = await fetch(
      'https://mybusinessaccountmanagement.googleapis.com/v1/accounts',
      { headers: { Authorization: `Bearer ${tokenData.access_token}` } }
    )
    const accountsData = await accountsRes.json() as {
      accounts?: Array<{ name: string; accountName: string; type: string }>
    }
    const gbpAccounts = accountsData.accounts ?? []

    const selectableAccounts: SelectableAccount[] = []
    for (const gbpAccount of gbpAccounts) {
      const locRes = await fetch(
        `https://mybusinessbusinessinformation.googleapis.com/v1/${gbpAccount.name}/locations?readMask=name,title,storefrontAddress`,
        { headers: { Authorization: `Bearer ${tokenData.access_token}` } }
      )
      const locData = await locRes.json() as {
        locations?: Array<{ name: string; title?: string; storefrontAddress?: { addressLines?: string[]; locality?: string; administrativeArea?: string } }>
      }
      for (const loc of locData.locations ?? []) {
        const addr = [
          ...(loc.storefrontAddress?.addressLines ?? []),
          loc.storefrontAddress?.locality,
          loc.storefrontAddress?.administrativeArea,
        ].filter(Boolean).join(', ')
        selectableAccounts.push({
          externalId: loc.name,
          name: loc.title ?? gbpAccount.accountName,
          type: 'Google Business Location',
          metadata: { locationName: loc.name, accountName: gbpAccount.name, address: addr },
        })
      }
    }

    const first = selectableAccounts[0]
    const account: Partial<NormalizedSocialAccount> = {
      platform: 'google_business_profile',
      accountName: first?.name ?? 'Google Business Profile',
      externalAccountId: first?.metadata?.accountName as string | undefined,
      externalBusinessId: first?.externalId,
      status: first ? 'connected' : 'error',
      connectedAt: new Date().toISOString(),
      scopesGranted: (tokenData.scope ?? '').split(' ').filter(Boolean),
      scopesRequired: SCOPES,
      metadata: first?.metadata,
      errorMessage: !first ? 'No Google Business Profile locations found.' : undefined,
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

    return {
      account,
      token,
      selectableAccounts: selectableAccounts.length > 1 ? selectableAccounts : undefined,
    }
  },

  async disconnect(_accountId, token) {
    await fetch(`https://oauth2.googleapis.com/revoke?token=${token.accessToken}`, { method: 'POST' })
      .catch(() => { /* best-effort */ })
  },

  async refreshToken(_accountId, token) {
    if (!token.refreshToken) throw new Error('No refresh token for Google Business Profile')
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
      'https://mybusinessaccountmanagement.googleapis.com/v1/accounts',
      { headers: { Authorization: `Bearer ${token.accessToken}` } }
    )
    const data = await res.json() as { accounts?: Array<{ name: string; accountName: string }> }
    const acc = data.accounts?.[0]
    return { externalAccountId: acc?.name ?? '', accountName: acc?.accountName ?? 'Google Business Profile' }
  },

  async validateConnection(_account, token) {
    try {
      const res = await fetch(
        'https://mybusinessaccountmanagement.googleapis.com/v1/accounts',
        { headers: { Authorization: `Bearer ${token.accessToken}` } }
      )
      if (!res.ok) return { valid: false, missingScopes: [], errorMessage: 'Token invalid or expired' }
      return { valid: true, missingScopes: [] }
    } catch (e) {
      return { valid: false, missingScopes: [], errorMessage: String(e) }
    }
  },

  async publishPost(account, job, token): Promise<SocialPublishResult> {
    const locationName = account.metadata?.locationName as string | undefined
    if (!locationName) {
      return { platform: 'google_business_profile', success: false, errorCode: 'NO_LOCATION', errorMessage: 'No Google Business Profile location configured' }
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://saltwatersprouts.com'
    const postBody: Record<string, unknown> = {
      languageCode: 'en-US',
      summary: job.message,
      callToAction: { actionType: 'LEARN_MORE', url: siteUrl },
    }

    if (job.media?.[0]?.type === 'image') {
      postBody.media = [{ mediaFormat: 'PHOTO', sourceUrl: job.media[0].url }]
    }

    try {
      const res = await fetch(
        `https://mybusiness.googleapis.com/v4/${locationName}/localPosts`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postBody),
        }
      )
      if (!res.ok) {
        const err = await res.json() as { error?: { message: string; code: number } }
        return { platform: 'google_business_profile', success: false, errorCode: String(err.error?.code ?? 'API_ERROR'), errorMessage: err.error?.message ?? 'GBP API error' }
      }
      const data = await res.json() as { name?: string; searchUrl?: string }
      return {
        platform: 'google_business_profile',
        success: true,
        externalPostId: data.name,
        externalPostUrl: data.searchUrl,
        publishedAt: new Date().toISOString(),
      }
    } catch (e) {
      return { platform: 'google_business_profile', success: false, errorCode: 'NETWORK_ERROR', errorMessage: String(e) }
    }
  },
}
