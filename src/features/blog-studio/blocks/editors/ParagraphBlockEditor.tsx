'use client'
import type { ParagraphBlock } from '../../types'

type Props = { block: ParagraphBlock; onChange: (b: ParagraphBlock) => void }

export default function ParagraphBlockEditor({ block, onChange }: Props) {
  const d = block.data
  function update(patch: Partial<ParagraphBlock['data']>) {
    onChange({ ...block, data: { ...d, ...patch } })
  }
  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Body Text <span className="text-red-500">*</span></label>
        <textarea rows={5} value={d.body} onChange={(e) => update({ body: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 resize-y"
          placeholder="Enter paragraph text..." />
      </div>
      <div className="flex gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Size</label>
          <div className="flex gap-2">
            {(['sm', 'base', 'lg'] as const).map((s) => (
              <button key={s} onClick={() => update({ size: s })}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${(d.size ?? 'base') === s ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Align</label>
          <div className="flex gap-2">
            {(['left', 'center'] as const).map((a) => (
              <button key={a} onClick={() => update({ align: a })}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${(d.align ?? 'left') === a ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500'}`}>
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
