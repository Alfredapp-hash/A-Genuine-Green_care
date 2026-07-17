'use client'
import { useState } from 'react'
import type { VideoBlock } from '../../types'
import { extractYouTubeId, extractVimeoId, buildYouTubeEmbedUrl, SAFE_IFRAME_PROPS } from '../../videoUtils'

function detectPlatform(url: string): 'youtube' | 'vimeo' | 'direct' | null {
  if (!url) return null
  if (extractYouTubeId(url)) return 'youtube'
  if (extractVimeoId(url)) return 'vimeo'
  if (url.match(/\.(mp4|webm|ogg)(\?|$)/i)) return 'direct'
  return null
}

const PLATFORM_BADGE: Record<string, { label: string; color: string }> = {
  youtube: { label: 'YouTube embed detected ✓', color: 'text-red-600 bg-red-50 border-red-200' },
  vimeo:   { label: 'Vimeo embed detected ✓',   color: 'text-blue-600 bg-blue-50 border-blue-200' },
  direct:  { label: 'Direct video file ✓',       color: 'text-green-700 bg-green-50 border-green-200' },
}

type Props = {
  block: VideoBlock
  onChange: (b: VideoBlock) => void
}

export default function VideoBlockEditor({ block, onChange }: Props) {
  const d = block.data
  const [url, setUrl] = useState(d.url ?? '')
  const platform = detectPlatform(url)

  function update(patch: Partial<VideoBlock['data']>) {
    onChange({ ...block, data: { ...d, ...patch } })
  }

  function handleUrlBlur() {
    update({ url: url.trim() })
  }

  return (
    <div className="p-4 space-y-4">
      {/* Heading */}
      <div>
        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
          Section Heading <span className="font-normal text-gray-400">(optional)</span>
        </label>
        <input
          type="text"
          value={d.heading ?? ''}
          onChange={(e) => update({ heading: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
          placeholder="e.g. Watch Our Suzuki Outboard Overview"
        />
      </div>

      {/* URL */}
      <div>
        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
          Video URL <span className="text-red-500">*</span>
        </label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onBlur={handleUrlBlur}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-100"
          placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
        />
        {/* Platform detection badge */}
        {platform ? (
          <p className={`mt-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border inline-block ${PLATFORM_BADGE[platform].color}`}>
            {PLATFORM_BADGE[platform].label}
          </p>
        ) : url ? (
          <p className="mt-1.5 text-xs text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-lg inline-block">
            ⚠ URL not recognized — paste a YouTube, Vimeo, or direct .mp4 URL
          </p>
        ) : (
          <p className="mt-1.5 text-xs text-gray-400">
            Supports: YouTube, Vimeo, or direct .mp4/.webm file URL
          </p>
        )}
      </div>

      {/* YouTube preview */}
      {platform === 'youtube' && extractYouTubeId(url) && (
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Preview</p>
          <div className="aspect-video rounded-xl overflow-hidden bg-black shadow">
            <iframe
              src={buildYouTubeEmbedUrl(extractYouTubeId(url)!)}
              className="w-full h-full"
              title="Video preview"
              {...SAFE_IFRAME_PROPS}
            />
          </div>
        </div>
      )}

      {/* Caption */}
      <div>
        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
          Caption <span className="font-normal text-gray-400">(optional)</span>
        </label>
        <input
          type="text"
          value={d.caption ?? ''}
          onChange={(e) => update({ caption: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
          placeholder="e.g. Suzuki DF150 walkthrough — Thomas Marine, Georgetown SC"
        />
      </div>

      {/* Options — only show for direct video files */}
      {platform === 'direct' && (
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={d.autoplay ?? false}
              onChange={(e) => update({ autoplay: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            Autoplay (muted)
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={d.loop ?? false}
              onChange={(e) => update({ loop: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            Loop
          </label>
        </div>
      )}
    </div>
  )
}
