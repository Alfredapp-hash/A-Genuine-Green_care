'use client'
import { useState } from 'react'
import type { VimeoVideoBlock } from '../../types'
import { extractVimeoId, buildVimeoEmbedUrl, SAFE_IFRAME_PROPS } from '../../videoUtils'

type Props = { block: VimeoVideoBlock; onChange: (b: VimeoVideoBlock) => void }

export default function VimeoVideoBlockEditor({ block, onChange }: Props) {
  const d = block.data
  const [url, setUrl] = useState(d.url ?? '')
  const vimeoId = extractVimeoId(url)

  function update(patch: Partial<VimeoVideoBlock['data']>) {
    onChange({ ...block, data: { ...d, ...patch } })
  }

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Vimeo URL <span className="text-red-500">*</span></label>
        <input type="url" value={url}
          onChange={(e) => setUrl(e.target.value)}
          onBlur={() => update({ url: url.trim() })}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-100"
          placeholder="https://vimeo.com/123456789" />
        {vimeoId
          ? <p className="mt-1 text-xs text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg inline-block font-semibold">Vimeo detected ✓ — ID: {vimeoId}</p>
          : url
            ? <p className="mt-1 text-xs text-orange-600">⚠ Not a recognized Vimeo URL</p>
            : <p className="mt-1 text-xs text-gray-400">Supports: vimeo.com/[id] or vimeo.com/video/[id]</p>
        }
      </div>

      {vimeoId && (
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Preview</p>
          <div className="aspect-video rounded-xl overflow-hidden bg-black shadow">
            <iframe
              src={buildVimeoEmbedUrl(vimeoId, { autoplay: d.autoplay, loop: d.loop })}
              className="w-full h-full"
              title="Vimeo preview"
              {...SAFE_IFRAME_PROPS}
            />
          </div>
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Section Heading <span className="font-normal text-gray-400">(optional)</span></label>
        <input type="text" value={d.heading ?? ''} onChange={(e) => update({ heading: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100" />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Caption <span className="font-normal text-gray-400">(optional)</span></label>
        <input type="text" value={d.caption ?? ''} onChange={(e) => update({ caption: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100" />
      </div>
      <div className="flex gap-4 text-sm text-gray-600">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={d.autoplay ?? false} onChange={(e) => update({ autoplay: e.target.checked })} className="w-4 h-4 rounded accent-blue-600" />
          Autoplay (muted)
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={d.loop ?? false} onChange={(e) => update({ loop: e.target.checked })} className="w-4 h-4 rounded accent-blue-600" />
          Loop
        </label>
      </div>
    </div>
  )
}
