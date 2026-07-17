import { AsyncLocalStorage } from 'node:async_hooks'
import { loadIntegrationSecretsMap } from './secrets-store'

const store = new AsyncLocalStorage<Record<string, string>>()

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://saltwatersprouts.com'

export function getCredential(envKey: string): string | undefined {
  const fromStore = store.getStore()?.[envKey]?.trim()
  if (fromStore) return fromStore
  const fromEnv = process.env[envKey]?.trim()
  return fromEnv || undefined
}

export function getRedirectUri(platform: string): string {
  const explicit =
    getCredential(`${platform === 'linkedin' ? 'LINKEDIN' : platform === 'google' ? 'GOOGLE' : 'META'}_REDIRECT_URI`) ??
    process.env[`${platform === 'linkedin' ? 'LINKEDIN' : platform === 'google' || platform.startsWith('google') ? 'GOOGLE' : 'META'}_REDIRECT_URI`]
  if (explicit) return explicit
  return `${siteUrl}/api/social/oauth/${platform}/callback`
}

export function hasMetaCredentials(): boolean {
  return !!(
    getCredential('META_APP_ID') &&
    getCredential('META_APP_SECRET') &&
    (getCredential('META_REDIRECT_URI') || siteUrl)
  )
}

export function hasLinkedInCredentials(): boolean {
  return !!(
    getCredential('LINKEDIN_CLIENT_ID') &&
    getCredential('LINKEDIN_CLIENT_SECRET')
  )
}

export function hasGoogleCredentials(): boolean {
  return !!(
    getCredential('GOOGLE_CLIENT_ID') &&
    getCredential('GOOGLE_CLIENT_SECRET')
  )
}

export function hasResendCredentials(): boolean {
  return !!getCredential('RESEND_API_KEY')
}

export function hasOpenAICredentials(): boolean {
  return !!getCredential('OPENAI_API_KEY')
}

export function hasCanvaCredentials(): boolean {
  return !!(getCredential('CANVA_CLIENT_ID') && getCredential('CANVA_CLIENT_SECRET'))
}

export function hasXCredentials(): boolean {
  return !!(getCredential('X_CLIENT_ID') && getCredential('X_CLIENT_SECRET'))
}

export function hasTikTokCredentials(): boolean {
  return !!(getCredential('TIKTOK_CLIENT_KEY') && getCredential('TIKTOK_CLIENT_SECRET'))
}

export function hasPinterestCredentials(): boolean {
  return !!(getCredential('PINTEREST_APP_ID') && getCredential('PINTEREST_APP_SECRET'))
}

export async function runWithIntegrationCredentials<T>(fn: () => Promise<T>): Promise<T> {
  // TODO: connect Supabase — loadIntegrationSecretsMap reads from integration_secrets table
  let dbSecrets: Record<string, string> = {}
  try {
    dbSecrets = await loadIntegrationSecretsMap()
  } catch {
    /* use env vars only */
  }
  const merged: Record<string, string> = { ...dbSecrets }

  if (!merged.META_REDIRECT_URI && merged.META_APP_ID) {
    merged.META_REDIRECT_URI = `${siteUrl}/api/social/oauth/facebook/callback`
  }
  if (!merged.LINKEDIN_REDIRECT_URI && merged.LINKEDIN_CLIENT_ID) {
    merged.LINKEDIN_REDIRECT_URI = `${siteUrl}/api/social/oauth/linkedin/callback`
  }
  if (!merged.GOOGLE_REDIRECT_URI && merged.GOOGLE_CLIENT_ID) {
    merged.GOOGLE_REDIRECT_URI = `${siteUrl}/api/social/oauth/youtube/callback`
  }
  if (!merged.CANVA_REDIRECT_URI && merged.CANVA_CLIENT_ID) {
    merged.CANVA_REDIRECT_URI = `${siteUrl}/api/canva/oauth/callback`
  }

  return store.run(merged, fn)
}

export async function resolveCredential(envKey: string): Promise<string | undefined> {
  return runWithIntegrationCredentials(() => Promise.resolve(getCredential(envKey)))
}
