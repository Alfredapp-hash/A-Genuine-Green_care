// TODO: connect Supabase — replace memory stubs with createServiceRoleClient() calls
// when NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are configured.
import type {
  NormalizedSocialAccount,
  OAuthTokenPayload,
  SocialPlatformId,
} from '@/lib/social/connectors/types'

// ── In-memory fallback store (used until Supabase is wired) ──────────────────
const _accounts = new Map<string, NormalizedSocialAccount>()
const _tokens = new Map<string, {
  encryptedAccess: string
  encryptedRefresh?: string
  expiresAt?: string
  scope?: string
  tokenType?: string
}>()
const _oauthStates = new Map<string, {
  platform: SocialPlatformId
  mock: boolean
  expiresAt: number
  returnTo?: string
  codeVerifier?: string
}>()

export async function storeOAuthStateDb(
  state: string,
  platform: SocialPlatformId,
  mock: boolean,
  returnTo?: string,
  ttlMs = 10 * 60_000,
  codeVerifier?: string,
): Promise<void> {
  // TODO: connect Supabase — upsert into social_oauth_states table
  try {
    _oauthStates.set(state, { platform, mock, expiresAt: Date.now() + ttlMs, returnTo, codeVerifier })
  } catch (err) {
    console.error('storeOAuthStateDb failed:', err)
  }
}

export async function consumeOAuthStateDb(
  state: string,
): Promise<{ platform: SocialPlatformId; mock: boolean; returnTo: string | null; codeVerifier?: string } | null> {
  // TODO: connect Supabase — select + delete from social_oauth_states
  try {
    const entry = _oauthStates.get(state)
    if (!entry) return null
    _oauthStates.delete(state)
    if (entry.expiresAt < Date.now()) return null
    return { platform: entry.platform, mock: entry.mock, returnTo: entry.returnTo ?? null, codeVerifier: entry.codeVerifier }
  } catch {
    return null
  }
}

export async function upsertSocialAccount(account: NormalizedSocialAccount): Promise<void> {
  // TODO: connect Supabase — upsert into social_accounts table
  try {
    _accounts.set(account.id, account)
  } catch (err) {
    console.error('upsertSocialAccount failed:', err)
  }
}

export async function getSocialAccount(accountId: string): Promise<NormalizedSocialAccount | null> {
  // TODO: connect Supabase — select from social_accounts where id = accountId
  try {
    return _accounts.get(accountId) ?? null
  } catch {
    return null
  }
}

export async function listSocialAccounts(): Promise<NormalizedSocialAccount[]> {
  // TODO: connect Supabase — select * from social_accounts order by connected_at desc
  try {
    return Array.from(_accounts.values())
  } catch {
    return []
  }
}

export async function deleteSocialAccount(accountId: string): Promise<void> {
  // TODO: connect Supabase — delete from social_accounts where id = accountId
  try {
    _accounts.delete(accountId)
  } catch { /* best-effort */ }
}

export async function saveSocialTokenDb(
  accountId: string,
  platform: string,
  encryptedAccess: string,
  encryptedRefresh: string | undefined,
  payload: OAuthTokenPayload,
): Promise<void> {
  // TODO: connect Supabase — upsert into social_tokens table
  try {
    _tokens.set(accountId, {
      encryptedAccess,
      encryptedRefresh,
      expiresAt: payload.expiresAt,
      scope: payload.scope,
      tokenType: payload.tokenType,
    })
  } catch (err) {
    console.error('saveSocialTokenDb failed:', err)
  }
}

export async function getSocialTokenDb(accountId: string): Promise<{
  encryptedAccess: string
  encryptedRefresh?: string
  expiresAt?: string
  scope?: string
  tokenType?: string
} | null> {
  // TODO: connect Supabase — select from social_tokens where account_id = accountId
  try {
    return _tokens.get(accountId) ?? null
  } catch {
    return null
  }
}

export async function deleteSocialTokenDb(accountId: string): Promise<void> {
  // TODO: connect Supabase — delete from social_tokens where account_id = accountId
  try {
    _tokens.delete(accountId)
  } catch { /* best-effort */ }
}

export async function markAccountPosted(accountId: string): Promise<void> {
  // TODO: connect Supabase — update social_accounts set last_successful_post_at = now()
  try {
    const acc = _accounts.get(accountId)
    if (acc) _accounts.set(accountId, { ...acc, lastSuccessfulPostAt: new Date().toISOString() })
  } catch { /* best-effort */ }
}
