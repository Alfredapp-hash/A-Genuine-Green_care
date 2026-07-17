'use client'
import type { ExternalVideoBlock } from '../../types'
import { isSafeIframeSrc, ALLOWED_VIDEO_HOSTS, SAFE_IFRAME_PROPS } from '../../videoUtils'

type Props = { block: ExternalVideoBlock; onChange: (b: ExternalVideoBlock) => void }

export default function ExternalVideoBlockEditor({ block, onChange }: Props) {
  const d = block.data
  const isSafe = isSafeIframeSrc(d.iframeSrc)

  function update(patch: Partial<ExternalVideoBlock['data']>) {
    onChange({ ...block, data: { ...d, ...patch } })
  }

  return (
    <div className="p-4 space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
        <p className="text-xs font-bold text-amber-800 mb-1">Allowlisted hosts only</p>
        <p className="text-xs text-amber-700 leading-relaxed">
          Only iframes from approved hosts are allowed: {ALLOWED_VIDEO_HOSTS.join(', ')}
        </p>
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">iframe src URL <span className="text-red-500">*</span></label>
        <input type="url" value={d.iframeSrc} onChange={(e) => update({ iframeSrc: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-100"
          placeholder="https://player.vimeo.com/video/..." />
        {d.iframeSrc && (
          isSafe
            ? <p className="mt-1 text-xs text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-lg inline-block font-semibold">Host approved ✓</p>
            : <p className="mt-1 text-xs text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg inline-block font-semibold">⛔ Host not on allowlist — iframe will not render</p>
        )}
      </div>
      {isSafe && (
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Preview</p>
          <div className="aspect-video rounded-xl overflow-hidden bg-black shadow">
            <iframe src={d.iframeSrc} className="w-full h-full" title={d.title ?? 'Video'} {...SAFE_IFRAME_PROPS} />
          </div>
        </div>
      )}
      <div>
        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">iframe Title (accessibility)</label>
        <input type="text" value={d.title ?? ''} onChange={(e) => update({ title: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
          placeholder="e.g. Product demo video" />
      </div>
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
    </div>
  )
}
