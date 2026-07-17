'use client'
import { useState } from 'react'
import { resolveVideoUrl, SAFE_IFRAME_PROPS } from './videoUtils'

type Props = {
  value: string
  onChange: (url: string) => void
  label?: string
}

const PLATFORM_INFO: Record<string, { name: string; color: string; bg: string }> = {
  youtube:  { name: 'YouTube',  color: 'text-red-600',  bg: 'bg-red-50 border-red-200' },
  vimeo:    { name: 'Vimeo',    color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
  external: { name: 'Embedded', color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
}

export default function VideoEmbedInput({ value, onChange, label }: Props) {
  const [showPreview, setShowPreview] = useState(false)
  const resolved = value ? resolveVideoUrl(value) : null
  const isInvalid = value.length > 10 && !resolved

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
          {label ?? 'Video Link'}
        </label>
        <p className="text-xs text-gray-400 mb-2">Paste a YouTube, Vimeo, Wistia, or Loom link. No iframe code needed.</p>
        <div className="relative">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className={`w-full border rounded-xl px-3 py-2.5 text-sm pr-10 focus:outline-none focus:ring-2 transition-colors ${
              isInvalid
                ? 'border-red-300 focus:ring-red-100 bg-red-50/40'
                : resolved
                ? 'border-green-300 focus:ring-green-100'
                : 'border-gray-200 focus:ring-blue-100'
            }`}
          />
          {resolved && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-sm">✓</span>
          )}
        </div>

        {/* Detection badge */}
        {resolved && (
          <div className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full border text-xs font-bold ${PLATFORM_INFO[resolved.type]?.bg}`}>
            <span className={PLATFORM_INFO[resolved.type]?.color}>
              {PLATFORM_INFO[resolved.type]?.name} detected ✓
            </span>
          </div>
        )}
        {isInvalid && (
          <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
            ⚠ This link is not supported. Paste a YouTube, Vimeo, Wistia, or Loom URL.
          </p>
        )}
      </div>

      {/* Preview toggle */}
      {resolved && (
        <div>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="text-xs font-bold text-[#0d2b55] hover:underline"
          >
            {showPreview ? '▲ Hide preview' : '▼ Show preview'}
          </button>
          {showPreview && (
            <div className="mt-2 rounded-xl overflow-hidden bg-black aspect-video shadow-lg ring-1 ring-black/10">
              <iframe
                src={resolved.embedUrl}
                className="w-full h-full"
                title="Video preview"
                {...SAFE_IFRAME_PROPS}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
