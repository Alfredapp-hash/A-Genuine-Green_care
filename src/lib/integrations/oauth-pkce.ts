import crypto from 'crypto'

export function generateCodeVerifier(): string {
  return crypto.randomBytes(96).toString('base64url')
}

export function generateCodeChallenge(codeVerifier: string): string {
  return crypto.createHash('sha256').update(codeVerifier).digest('base64url')
}

export function generateOAuthState(): string {
  return crypto.randomBytes(96).toString('base64url')
}

/** Platforms that require PKCE during OAuth token exchange. */
export const PKCE_OAUTH_PLATFORMS = new Set(['x', 'tiktok', 'pinterest'])

export function platformUsesPkce(platform: string): boolean {
  return PKCE_OAUTH_PLATFORMS.has(platform)
}
