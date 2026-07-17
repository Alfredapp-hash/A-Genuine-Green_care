import { nanoid } from 'nanoid'
import type { ChecklistBlock, ChecklistItem } from '../../types'

type Props = { block: ChecklistBlock; onChange: (b: ChecklistBlock) => void }

export default function ChecklistBlockEditor({ block, onChange }: Props) {
  const d = block.data
  const set = (patch: Partial<typeof d>) =>
    onChange({ ...block, data: { ...d, ...patch } })

  function updateItem(id: string, patch: Partial<ChecklistItem>) {
    set({ items: d.items.map((it) => (it.id === id ? { ...it, ...patch } : it)) })
  }
  function addItem() {
    set({ items: [...d.items, { id: nanoid(), text: '', note: '' }] })
  }
  function removeItem(id: string) {
    set({ items: d.items.filter((it) => it.id !== id) })
  }
  function moveItem(id: string, dir: 'up' | 'down') {
    const items = [...d.items]
    const idx = items.findIndex((it) => it.id === id)
    if (dir === 'up' && idx > 0) { [items[idx - 1], items[idx]] = [items[idx], items[idx - 1]] }
    if (dir === 'down' && idx < items.length - 1) { [items[idx], items[idx + 1]] = [items[idx + 1], items[idx]] }
    set({ items })
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Heading</label>
        <input
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          value={d.heading ?? ''}
          onChange={(e) => set({ heading: e.target.value })}
          placeholder="Checklist heading"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Intro (optional)</label>
        <textarea
          rows={2}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
          value={d.intro ?? ''}
          onChange={(e) => set({ intro: e.target.value })}
          placeholder="Brief introduction before the checklist..."
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-2">Checklist Items</label>
        <div className="space-y-2">
          {d.items.map((item, idx) => (
            <div key={item.id} className="flex items-start gap-2 bg-gray-50 rounded-lg p-2 border border-gray-100">
              <div className="flex flex-col gap-1 pt-1">
                <button onClick={() => moveItem(item.id, 'up')} disabled={idx === 0} className="text-gray-300 hover:text-gray-500 disabled:opacity-20 text-xs leading-none">▲</button>
                <button onClick={() => moveItem(item.id, 'down')} disabled={idx === d.items.length - 1} className="text-gray-300 hover:text-gray-500 disabled:opacity-20 text-xs leading-none">▼</button>
              </div>
              <div className="flex-1 space-y-1.5">
                <input
                  className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/30"
                  value={item.text}
                  onChange={(e) => updateItem(item.id, { text: e.target.value })}
                  placeholder={`Item ${idx + 1}`}
                />
                <input
                  className="w-full border border-gray-100 rounded px-2 py-1 text-xs text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                  value={item.note ?? ''}
                  onChange={(e) => updateItem(item.id, { note: e.target.value })}
                  placeholder="Optional note or tip..."
                />
              </div>
              <button onClick={() => removeItem(item.id)} className="text-red-300 hover:text-red-500 text-sm mt-1 shrink-0">✕</button>
            </div>
          ))}
        </div>
        <button
          onClick={addItem}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
        >
          + Add Item
        </button>
      </div>
    </div>
  )
}
