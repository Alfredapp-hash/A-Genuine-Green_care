// ─────────────────────────────────────────────────────────────────────────────
// UTM tracking helpers
// ─────────────────────────────────────────────────────────────────────────────
import type { SocialPlatform, UTMSettings } from './types'

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
}

export function buildTrackedUrl(
  baseUrl: string,
  platform: SocialPlatform,
  settings: UTMSettings,
): string {
  const url = new URL(baseUrl.startsWith('http') ? baseUrl : `https://saltwatersprouts.com${baseUrl}`)
  url.searchParams.set('utm_source', settings.source ?? platform)
  url.searchParams.set('utm_medium', settings.medium ?? 'social')
  url.searchParams.set('utm_campaign', settings.campaign)
  if (settings.content) url.searchParams.set('utm_content', settings.content)
  if (settings.term) url.searchParams.set('utm_term', settings.term)
  return url.toString()
}

export function buildDefaultUTM(
  platform: SocialPlatform,
  campaignName: string,
  postTitle: string,
): UTMSettings {
  return {
    campaign: slugify(campaignName),
    source: platform,
    medium: 'social',
    content: slugify(postTitle) || platform,
  }
}
