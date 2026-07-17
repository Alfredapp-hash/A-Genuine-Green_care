// ─────────────────────────────────────────────────────────────────────────────
// Video Embed Utilities — secure URL extraction + iframe allowlist
// ─────────────────────────────────────────────────────────────────────────────

export const ALLOWED_VIDEO_HOSTS = [
  'youtube.com',
  'www.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
  'youtu.be',
  'vimeo.com',
  'player.vimeo.com',
  'wistia.com',
  'fast.wistia.net',
  'loom.com',
  'www.loom.com',
] as const

// ── YouTube ───────────────────────────────────────────────────────────────────

export function extractYouTubeId(url: string): string | null {
  if (!url) return null
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ]
  for (const re of patterns) {
    const m = url.match(re)
    if (m) return m[1]
  }
  return null
}

export function buildYouTubeEmbedUrl(
  id: string,
  opts: { autoplay?: boolean; loop?: boolean } = {}
): string {
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    ...(opts.autoplay ? { autoplay: '1', mute: '1' } : {}),
    ...(opts.loop ? { loop: '1', playlist: id } : {}),
  })
  return `https://www.youtube-nocookie.com/embed/${id}?${params}`
}

// ── Vimeo ─────────────────────────────────────────────────────────────────────

export function extractVimeoId(url: string): string | null {
  if (!url) return null
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  return m ? m[1] : null
}

export function buildVimeoEmbedUrl(
  id: string,
  opts: { autoplay?: boolean; loop?: boolean } = {}
): string {
  const params = new URLSearchParams({
    ...(opts.autoplay ? { autoplay: '1', muted: '1' } : {}),
    ...(opts.loop ? { loop: '1' } : {}),
    dnt: '1',
  })
  return `https://player.vimeo.com/video/${id}?${params}`
}

// ── External iframe allowlist ─────────────────────────────────────────────────

export function isSafeIframeSrc(src: string): boolean {
  if (!src) return false
  try {
    const url = new URL(src)
    if (url.protocol !== 'https:') return false
    return ALLOWED_VIDEO_HOSTS.some(
      (host) => url.hostname === host || url.hostname.endsWith(`.${host}`)
    )
  } catch {
    return false
  }
}

// ── Auto-detect and build embed URL from any pasted URL ──────────────────────

export type EmbedResult =
  | { type: 'youtube'; embedUrl: string; id: string }
  | { type: 'vimeo'; embedUrl: string; id: string }
  | { type: 'external'; embedUrl: string }
  | null

export function resolveVideoUrl(
  url: string,
  opts: { autoplay?: boolean; loop?: boolean } = {}
): EmbedResult {
  const ytId = extractYouTubeId(url)
  if (ytId) return { type: 'youtube', embedUrl: buildYouTubeEmbedUrl(ytId, opts), id: ytId }
  const vimeoId = extractVimeoId(url)
  if (vimeoId) return { type: 'vimeo', embedUrl: buildVimeoEmbedUrl(vimeoId, opts), id: vimeoId }
  if (isSafeIframeSrc(url)) return { type: 'external', embedUrl: url }
  return null
}

// ── Shared safe iframe props ──────────────────────────────────────────────────

export const SAFE_IFRAME_PROPS = {
  loading: 'lazy' as const,
  allowFullScreen: true,
  referrerPolicy: 'strict-origin-when-cross-origin' as const,
  allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
}
