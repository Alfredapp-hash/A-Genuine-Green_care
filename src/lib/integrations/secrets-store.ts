// TODO: connect Supabase — replace in-memory stubs with createServiceRoleClient()
// when NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are configured.
import { decryptToken, encryptToken } from '@/lib/social/tokenStore'

export type ConnectorSecretRow = {
  connector_id: string
  secret_encrypted: string
  hint: string | null
  verified_at: string | null
  updated_at: string
}

const CONNECTOR_TO_ENV: Record<string, string> = {
  resend: 'RESEND_API_KEY',
  openai: 'OPENAI_API_KEY',
  meta_app_id: 'META_APP_ID',
  meta_app_secret: 'META_APP_SECRET',
  linkedin_client_id: 'LINKEDIN_CLIENT_ID',
  linkedin_client_secret: 'LINKEDIN_CLIENT_SECRET',
  google_client_id: 'GOOGLE_CLIENT_ID',
  google_client_secret: 'GOOGLE_CLIENT_SECRET',
  canva_client_id: 'CANVA_CLIENT_ID',
  canva_client_secret: 'CANVA_CLIENT_SECRET',
}

// ── In-memory fallback ────────────────────────────────────────────────────────
const _secrets = new Map<string, { encrypted: string; hint: string | null; verifiedAt: string | null; updatedAt: string }>()

export function secretHint(value: string): string {
  const trimmed = value.trim()
  if (trimmed.length <= 8) return '••••'
  return `••••${trimmed.slice(-4)}`
}

export async function saveIntegrationSecret(
  connectorId: string,
  plaintext: string,
  userId?: string,
): Promise<void> {
  // TODO: connect Supabase — upsert into integration_secrets table
  try {
    const encrypted = await encryptToken(plaintext.trim())
    _secrets.set(connectorId, {
      encrypted,
      hint: secretHint(plaintext),
      verifiedAt: null,
      updatedAt: new Date().toISOString(),
    })
  } catch (err) {
    throw new Error(`saveIntegrationSecret failed: ${err instanceof Error ? err.message : err}`)
  }
}

export async function deleteIntegrationSecret(connectorId: string): Promise<void> {
  // TODO: connect Supabase — delete from integration_secrets where connector_id = connectorId
  try {
    _secrets.delete(connectorId)
  } catch (err) {
    throw new Error(`deleteIntegrationSecret failed: ${err instanceof Error ? err.message : err}`)
  }
}

export async function getIntegrationSecretPlaintext(connectorId: string): Promise<string | null> {
  // TODO: connect Supabase — select from integration_secrets where connector_id = connectorId
  try {
    const row = _secrets.get(connectorId)
    if (!row) return null
    return await decryptToken(row.encrypted)
  } catch {
    return null
  }
}

export async function listIntegrationSecretMeta(): Promise<
  Array<{ connectorId: string; hint: string | null; verifiedAt: string | null; updatedAt: string }>
> {
  // TODO: connect Supabase — select connector_id, hint, verified_at, updated_at from integration_secrets
  try {
    return Array.from(_secrets.entries()).map(([connectorId, row]) => ({
      connectorId,
      hint: row.hint,
      verifiedAt: row.verifiedAt,
      updatedAt: row.updatedAt,
    }))
  } catch {
    return []
  }
}

export async function markIntegrationVerified(connectorId: string): Promise<void> {
  // TODO: connect Supabase — update integration_secrets set verified_at = now()
  try {
    const row = _secrets.get(connectorId)
    if (row) _secrets.set(connectorId, { ...row, verifiedAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
  } catch { /* best-effort */ }
}

/** Load DB secrets into env-var-shaped map (does not include env fallbacks). */
export async function loadIntegrationSecretsMap(): Promise<Record<string, string>> {
  // TODO: connect Supabase — select connector_id, secret_encrypted from integration_secrets
  try {
    const out: Record<string, string> = {}
    for (const [connectorId, row] of _secrets.entries()) {
      const envKey = CONNECTOR_TO_ENV[connectorId]
      if (!envKey) continue
      try {
        const plain = await decryptToken(row.encrypted)
        if (plain) out[envKey] = plain
      } catch {
        /* skip bad row */
      }
    }
    return out
  } catch {
    return {}
  }
}

export { CONNECTOR_TO_ENV }
