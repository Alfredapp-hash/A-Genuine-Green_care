const ENC_KEY =
  process.env.INTEGRATION_SECRETS_ENCRYPTION_KEY?.trim() ||
  process.env.SOCIAL_TOKEN_ENCRYPTION_KEY?.trim() ||
  ''

async function getKey(): Promise<CryptoKey | null> {
  if (!ENC_KEY || ENC_KEY.length < 32) return null
  const raw = Buffer.from(ENC_KEY.slice(0, 32), 'utf8')
  return crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt'])
}

export async function encryptSecret(plaintext: string): Promise<string> {
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

export async function decryptSecret(ciphertext: string): Promise<string> {
  if (ciphertext.startsWith('unenc:')) {
    return Buffer.from(ciphertext.slice(6), 'base64').toString('utf8')
  }
  const key = await getKey()
  if (!key) throw new Error('INTEGRATION_SECRETS_ENCRYPTION_KEY not configured for decryption')
  const buf = Buffer.from(ciphertext, 'base64')
  const iv = buf.slice(0, 12)
  const data = buf.slice(12)
  const dec = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data)
  return Buffer.from(dec).toString('utf8')
}
