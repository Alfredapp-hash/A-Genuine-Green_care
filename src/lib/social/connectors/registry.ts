// ─────────────────────────────────────────────────────────────────────────────
// Connector Registry
// Resolves to mock connectors when credentials are missing or mode=mock.
// Resolves to real connectors when credentials are present and mode=live.
// ─────────────────────────────────────────────────────────────────────────────
import type { SocialConnector, SocialPlatformId } from './types'
import { MOCK_CONNECTORS } from './mock'
import { facebookConnector } from './facebook'
import { instagramConnector } from './instagram'
import { linkedinConnector } from './linkedin'
import { youtubeConnector } from './youtube'
import { googleBusinessConnector } from './googleBusiness'
import { xConnector } from './x'
import { tiktokConnector } from './tiktok'
import { pinterestConnector } from './pinterest'
import { threadsConnector } from './threads'
import { metaMarketingConnector } from './metaMarketing'

import {
  hasGoogleCredentials,
  hasLinkedInCredentials,
  hasMetaCredentials,
  hasPinterestCredentials,
  hasTikTokCredentials,
  hasXCredentials,
} from '@/lib/integrations/credential-resolver'

export type ConnectorMode = 'live' | 'mock' | 'setup_needed'

export { hasGoogleCredentials, hasLinkedInCredentials, hasMetaCredentials, hasXCredentials, hasTikTokCredentials, hasPinterestCredentials }

export const ALL_SOCIAL_PLATFORMS: SocialPlatformId[] = [
  'facebook',
  'instagram',
  'linkedin',
  'youtube',
  'google_business_profile',
  'x',
  'tiktok',
  'pinterest',
  'threads',
  'meta_marketing',
]

export function getGlobalMode(): ConnectorMode {
  const envMode = process.env.SOCIAL_CONNECTORS_MODE
  if (envMode === 'mock') return 'mock'
  if (envMode === 'live') return 'live'
  if (
    hasMetaCredentials() ||
    hasLinkedInCredentials() ||
    hasGoogleCredentials() ||
    hasXCredentials() ||
    hasTikTokCredentials() ||
    hasPinterestCredentials()
  ) {
    return 'live'
  }
  return 'setup_needed'
}

export function isMockAllowed(): boolean {
  return process.env.NODE_ENV !== 'production' || process.env.SOCIAL_CONNECTORS_MODE === 'mock'
}

export function getPlatformMode(platform: SocialPlatformId): ConnectorMode {
  const global = getGlobalMode()
  if (global === 'mock') return 'mock'

  switch (platform) {
    case 'facebook':
    case 'instagram':
    case 'threads':
    case 'meta_marketing':
      return hasMetaCredentials() ? 'live' : 'setup_needed'
    case 'linkedin':
      return hasLinkedInCredentials() ? 'live' : 'setup_needed'
    case 'youtube':
    case 'google_business_profile':
      return hasGoogleCredentials() ? 'live' : 'setup_needed'
    case 'x':
      return hasXCredentials() ? 'live' : 'setup_needed'
    case 'tiktok':
      return hasTikTokCredentials() ? 'live' : 'setup_needed'
    case 'pinterest':
      return hasPinterestCredentials() ? 'live' : 'setup_needed'
    default:
      return 'setup_needed'
  }
}

const LIVE_CONNECTORS: Record<SocialPlatformId, SocialConnector> = {
  facebook: facebookConnector,
  instagram: instagramConnector,
  linkedin: linkedinConnector,
  youtube: youtubeConnector,
  google_business_profile: googleBusinessConnector,
  x: xConnector,
  tiktok: tiktokConnector,
  pinterest: pinterestConnector,
  threads: threadsConnector,
  meta_marketing: metaMarketingConnector,
}

export function getConnector(platform: SocialPlatformId): SocialConnector {
  const mode = getPlatformMode(platform)
  if (mode === 'live') return LIVE_CONNECTORS[platform]
  return MOCK_CONNECTORS[platform]
}

export function getAllConnectors(): Record<SocialPlatformId, SocialConnector> {
  return Object.fromEntries(ALL_SOCIAL_PLATFORMS.map((p) => [p, getConnector(p)])) as Record<
    SocialPlatformId,
    SocialConnector
  >
}

export type PlatformCredentialStatus = {
  platform: SocialPlatformId
  label: string
  mode: ConnectorMode
  credentialKeys: string[]
  configured: boolean
}

export function getCredentialStatuses(): PlatformCredentialStatus[] {
  return [
    {
      platform: 'facebook',
      label: 'Facebook / Instagram (Meta)',
      mode: getPlatformMode('facebook'),
      credentialKeys: ['META_APP_ID', 'META_APP_SECRET', 'META_REDIRECT_URI'],
      configured: hasMetaCredentials(),
    },
    {
      platform: 'instagram',
      label: 'Instagram (shares Meta credentials)',
      mode: getPlatformMode('instagram'),
      credentialKeys: ['META_APP_ID', 'META_APP_SECRET', 'META_REDIRECT_URI'],
      configured: hasMetaCredentials(),
    },
    {
      platform: 'threads',
      label: 'Threads (shares Meta credentials)',
      mode: getPlatformMode('threads'),
      credentialKeys: ['META_APP_ID', 'META_APP_SECRET', 'META_REDIRECT_URI'],
      configured: hasMetaCredentials(),
    },
    {
      platform: 'meta_marketing',
      label: 'Meta Marketing / Ads (shares Meta app)',
      mode: getPlatformMode('meta_marketing'),
      credentialKeys: ['META_APP_ID', 'META_APP_SECRET', 'META_MARKETING_REDIRECT_URI'],
      configured: hasMetaCredentials(),
    },
    {
      platform: 'linkedin',
      label: 'LinkedIn',
      mode: getPlatformMode('linkedin'),
      credentialKeys: ['LINKEDIN_CLIENT_ID', 'LINKEDIN_CLIENT_SECRET', 'LINKEDIN_REDIRECT_URI'],
      configured: hasLinkedInCredentials(),
    },
    {
      platform: 'youtube',
      label: 'YouTube',
      mode: getPlatformMode('youtube'),
      credentialKeys: ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REDIRECT_URI'],
      configured: hasGoogleCredentials(),
    },
    {
      platform: 'google_business_profile',
      label: 'Google Business Profile',
      mode: getPlatformMode('google_business_profile'),
      credentialKeys: ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REDIRECT_URI'],
      configured: hasGoogleCredentials(),
    },
    {
      platform: 'x',
      label: 'X (Twitter)',
      mode: getPlatformMode('x'),
      credentialKeys: ['X_CLIENT_ID', 'X_CLIENT_SECRET', 'X_REDIRECT_URI'],
      configured: hasXCredentials(),
    },
    {
      platform: 'tiktok',
      label: 'TikTok',
      mode: getPlatformMode('tiktok'),
      credentialKeys: ['TIKTOK_CLIENT_KEY', 'TIKTOK_CLIENT_SECRET', 'TIKTOK_REDIRECT_URI'],
      configured: hasTikTokCredentials(),
    },
    {
      platform: 'pinterest',
      label: 'Pinterest',
      mode: getPlatformMode('pinterest'),
      credentialKeys: ['PINTEREST_APP_ID', 'PINTEREST_APP_SECRET', 'PINTEREST_REDIRECT_URI'],
      configured: hasPinterestCredentials(),
    },
  ]
}
