'use client'
import type { DividerBlock } from '../../types'

type Props = { block: DividerBlock; onChange: (b: DividerBlock) => void }
const STYLES = ['line', 'wave', 'dots', 'space'] as const

export default function DividerBlockEditor({ block, onChange }: Props) {
  const d = block.data
  function update(patch: Partial<DividerBlock['data']>) {
    onChange({ ...block, data: { ...d, ...patch } })
  }
  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Style</label>
        <div className="flex gap-2 flex-wrap">
          {STYLES.map((s) => (
            <button key={s} onClick={() => update({ style: s })}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${d.style === s ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
          Label <span className="font-normal text-gray-400">(optional — shown inline)</span>
        </label>
        <input type="text" value={d.label ?? ''} onChange={(e) => update({ label: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
          placeholder="e.g. More Details" />
      </div>
    </div>
  )
}
