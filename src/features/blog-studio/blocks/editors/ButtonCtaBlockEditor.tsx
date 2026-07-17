'use client'
import type { ButtonCtaBlock } from '../../types'

type Props = { block: ButtonCtaBlock; onChange: (b: ButtonCtaBlock) => void }

export default function ButtonCtaBlockEditor({ block, onChange }: Props) {
  const d = block.data
  function update(patch: Partial<ButtonCtaBlock['data']>) {
    onChange({ ...block, data: { ...d, ...patch } })
  }
  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Button Label <span className="text-red-500">*</span></label>
        <input type="text" value={d.label} onChange={(e) => update({ label: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
          placeholder="e.g. Schedule Service" />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">URL <span className="text-red-500">*</span></label>
        <input type="url" value={d.url} onChange={(e) => update({ url: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-100"
          placeholder="https://... or /contact" />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Sub-text <span className="font-normal text-gray-400">(optional)</span></label>
        <input type="text" value={d.subtext ?? ''} onChange={(e) => update({ subtext: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
          placeholder="e.g. No obligation — free estimate" />
      </div>
      <div className="flex gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Style</label>
          <div className="flex gap-2 flex-wrap">
            {(['primary', 'secondary', 'ghost', 'outline'] as const).map((s) => (
              <button key={s} onClick={() => update({ style: s })}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${(d.style ?? 'primary') === s ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Align</label>
          <div className="flex gap-2">
            {(['left', 'center', 'right'] as const).map((a) => (
              <button key={a} onClick={() => update({ align: a })}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${(d.align ?? 'center') === a ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500'}`}>
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
