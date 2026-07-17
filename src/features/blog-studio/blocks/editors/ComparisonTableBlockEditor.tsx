import { nanoid } from 'nanoid'
import type { ComparisonTableBlock, ComparisonRow } from '../../types'

type Props = { block: ComparisonTableBlock; onChange: (b: ComparisonTableBlock) => void }

export default function ComparisonTableBlockEditor({ block, onChange }: Props) {
  const d = block.data
  const set = (patch: Partial<typeof d>) =>
    onChange({ ...block, data: { ...d, ...patch } })

  function updateRow(id: string, patch: Partial<ComparisonRow>) {
    set({ rows: d.rows.map((r) => (r.id === id ? { ...r, ...patch } : r)) })
  }
  function addRow() {
    set({ rows: [...d.rows, { id: nanoid(), feature: '', optionA: '', optionB: '' }] })
  }
  function removeRow(id: string) {
    set({ rows: d.rows.filter((r) => r.id !== id) })
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Heading</label>
        <input
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          value={d.heading ?? ''}
          onChange={(e) => set({ heading: e.target.value })}
          placeholder="Comparison heading"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Column A Label</label>
          <input
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            value={d.labelA}
            onChange={(e) => set({ labelA: e.target.value })}
            placeholder="Option A"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Column B Label</label>
          <input
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            value={d.labelB}
            onChange={(e) => set({ labelB: e.target.value })}
            placeholder="Option B"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-2">Rows</label>
        <div className="space-y-2">
          {d.rows.map((row) => (
            <div key={row.id} className="flex items-center gap-2">
              <input
                className="w-1/3 border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/30"
                value={row.feature}
                onChange={(e) => updateRow(row.id, { feature: e.target.value })}
                placeholder="Feature"
              />
              <input
                className="w-1/3 border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/30"
                value={row.optionA}
                onChange={(e) => updateRow(row.id, { optionA: e.target.value })}
                placeholder={d.labelA || 'A'}
              />
              <input
                className="w-1/3 border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/30"
                value={row.optionB}
                onChange={(e) => updateRow(row.id, { optionB: e.target.value })}
                placeholder={d.labelB || 'B'}
              />
              <button onClick={() => removeRow(row.id)} className="text-red-300 hover:text-red-500 text-sm shrink-0">✕</button>
            </div>
          ))}
        </div>
        <button onClick={addRow} className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
          + Add Row
        </button>
      </div>
    </div>
  )
}
