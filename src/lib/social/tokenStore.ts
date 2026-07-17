import type { OAuthTokenPayload } from './connectors/types'
import {
  deleteSocialTokenDb,
  getSocialTokenDb,
  saveSocialTokenDb,
} from './persistence'

const ENC_KEY = process.env.SOCIAL_TOKEN_ENCRYPTION_KEY ?? ''

async function getKey(): Promise<CryptoKey | null> {
  if (!ENC_KEY || ENC_KEY.length < 32) return null
  const raw = Buffer.from(ENC_KEY.slice(0, 32), 'utf8')
  return crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt'])
}

export async function encryptToken(plaintext: string): Promise<string> {
  const key = await getKey()
  if (!key) {
    return `unenc:${Buffer.from(plaintext).toString('base64')}`
  }
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const enc = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, Buffer.from(plaintext, 'utf8'))
  const buf = new Uint8Array(12 + enc.byteLength)
  buf.set(iv, 0)
  buf.set(new Uint8Array(enc), 12)
  return Buffer.from(buf).toString('base64')
}

export async function decryptToken(ciphertext: string): Promise<string> {
  if (ciphertext.startsWith('unenc:')) {
    return Buffer.from(ciphertext.slice(6), 'base64').toString('utf8')
  }
  const key = await getKey()
  if (!key) throw new Error('SOCIAL_TOKEN_ENCRYPTION_KEY not configured for decryption')
  const buf = Buffer.from(ciphertext, 'base64')
  const iv = buf.slice(0, 12)
  const data = buf.slice(12)
  const dec = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data)
  return Buffer.from(dec).toString('utf8')
}

const _memory = new Map<string, {
  encryptedAccess: string
  encryptedRefresh?: string
  expiresAt?: string
  scope?: string
  tokenType?: string
}>()

export async function saveToken(
  accountId: string,
  platform: string,
  payload: OAuthTokenPayload,
): Promise<void> {
  const encAT = await encryptToken(payload.accessToken)
  const encRT = payload.refreshToken ? await encryptToken(payload.refreshToken) : undefined

  _memory.set(accountId, {
    encryptedAccess: encAT,
    encryptedRefresh: encRT,
    expiresAt: payload.expiresAt,
    scope: payload.scope,
    tokenType: payload.tokenType,
  })

  try {
    await saveSocialTokenDb(accountId, platform, encAT, encRT, payload)
  } catch (err) {
    console.error('social token db save failed (using memory fallback):', err instanceof Error ? err.message : err)
  }
}

export async function getToken(accountId: string): Promise<OAuthTokenPayload | null> {
  try {
    const stored = await getSocialTokenDb(accountId)
    if (stored) {
      return {
        accessToken: await decryptToken(stored.encryptedAccess),
        refreshToken: stored.encryptedRefresh
          ? await decryptToken(stored.encryptedRefresh)
          : undefined,
        expiresAt: stored.expiresAt,
        scope: stored.scope,
        tokenType: stored.tokenType,
      }
    }
  } catch (err) {
    console.error('social token db read failed:', err instanceof Error ? err.message : err)
  }

  const mem = _memory.get(accountId)
  if (!mem) return null
  return {
    accessToken: await decryptToken(mem.encryptedAccess),
    refreshToken: mem.encryptedRefresh ? await decryptToken(mem.encryptedRefresh) : undefined,
    expiresAt: mem.expiresAt,
    scope: mem.scope,
    tokenType: mem.tokenType,
  }
}

export async function updateToken(
  accountId: string,
  platform: string,
  payload: OAuthTokenPayload,
): Promise<void> {
  await saveToken(accountId, platform, payload)
}

export async function deleteToken(accountId: string): Promise<void> {
  _memory.delete(accountId)
  try {
    await deleteSocialTokenDb(accountId)
  } catch {
    /* best-effort */
  }
}

export function isTokenExpired(payload: OAuthTokenPayload): boolean {
  if (!payload.expiresAt) return false
  return Date.now() > new Date(payload.expiresAt).getTime() - 5 * 60_000
}
