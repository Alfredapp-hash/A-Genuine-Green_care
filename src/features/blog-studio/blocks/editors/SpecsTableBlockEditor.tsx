import { nanoid } from 'nanoid'
import type { SpecsTableBlock, SpecRow } from '../../types'

type Props = { block: SpecsTableBlock; onChange: (b: SpecsTableBlock) => void }

export default function SpecsTableBlockEditor({ block, onChange }: Props) {
  const d = block.data
  const set = (patch: Partial<typeof d>) =>
    onChange({ ...block, data: { ...d, ...patch } })

  function updateRow(id: string, patch: Partial<SpecRow>) {
    set({ specs: d.specs.map((r) => (r.id === id ? { ...r, ...patch } : r)) })
  }
  function addRow() {
    set({ specs: [...d.specs, { id: nanoid(), label: '', value: '' }] })
  }
  function removeRow(id: string) {
    set({ specs: d.specs.filter((r) => r.id !== id) })
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Heading</label>
        <input
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          value={d.heading ?? ''}
          onChange={(e) => set({ heading: e.target.value })}
          placeholder="Specifications"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-2">Spec Rows</label>
        <div className="space-y-2">
          {d.specs.map((row) => (
            <div key={row.id} className="flex items-center gap-2">
              <input
                className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/30"
                value={row.label}
                onChange={(e) => updateRow(row.id, { label: e.target.value })}
                placeholder="Label (e.g. Year)"
              />
              <input
                className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/30"
                value={row.value}
                onChange={(e) => updateRow(row.id, { value: e.target.value })}
                placeholder="Value (e.g. 2022)"
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
