'use client'
import type { HeadingBlock } from '../../types'

type Props = { block: HeadingBlock; onChange: (b: HeadingBlock) => void }

export default function HeadingBlockEditor({ block, onChange }: Props) {
  const d = block.data
  function update(patch: Partial<HeadingBlock['data']>) {
    onChange({ ...block, data: { ...d, ...patch } })
  }
  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Eyebrow <span className="font-normal text-gray-400">(optional)</span></label>
        <input type="text" value={d.eyebrow ?? ''} onChange={(e) => update({ eyebrow: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
          placeholder="e.g. Service Guide" />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Heading Text <span className="text-red-500">*</span></label>
        <input type="text" value={d.text} onChange={(e) => update({ text: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
          placeholder="Enter heading..." />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Level</label>
          <div className="flex gap-2">
            {([2, 3, 4] as const).map((l) => (
              <button key={l} onClick={() => update({ level: l })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${d.level === l || (!d.level && l === 2) ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                H{l}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Align</label>
          <div className="flex gap-2">
            {(['left', 'center', 'right'] as const).map((a) => (
              <button key={a} onClick={() => update({ align: a })}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${(d.align ?? 'left') === a ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
