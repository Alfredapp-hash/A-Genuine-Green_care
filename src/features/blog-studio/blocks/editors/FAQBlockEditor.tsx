import { nanoid } from 'nanoid'
import type { FAQBlock, FAQItem } from '../../types'

type Props = { block: FAQBlock; onChange: (b: FAQBlock) => void }

export default function FAQBlockEditor({ block, onChange }: Props) {
  const d = block.data
  const set = (patch: Partial<typeof d>) =>
    onChange({ ...block, data: { ...d, ...patch } })

  function updateItem(id: string, patch: Partial<FAQItem>) {
    set({ items: d.items.map((it) => (it.id === id ? { ...it, ...patch } : it)) })
  }
  function addItem() {
    set({ items: [...d.items, { id: nanoid(), question: '', answer: '' }] })
  }
  function removeItem(id: string) {
    set({ items: d.items.filter((it) => it.id !== id) })
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Section Heading</label>
        <input
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          value={d.heading ?? ''}
          onChange={(e) => set({ heading: e.target.value })}
          placeholder="Frequently Asked Questions"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-2">Questions & Answers</label>
        <div className="space-y-3">
          {d.items.map((item, idx) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50 space-y-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-gray-400">Q{idx + 1}</span>
                <button onClick={() => removeItem(item.id)} className="text-red-300 hover:text-red-500 text-xs">Remove</button>
              </div>
              <input
                className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-blue-500/30"
                value={item.question}
                onChange={(e) => updateItem(item.id, { question: e.target.value })}
                placeholder="Question?"
              />
              <textarea
                rows={3}
                className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/30 resize-none"
                value={item.answer}
                onChange={(e) => updateItem(item.id, { answer: e.target.value })}
                placeholder="Answer..."
              />
            </div>
          ))}
        </div>
        <button onClick={addItem} className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
          + Add Question
        </button>
        <p className="text-xs text-gray-400 mt-1">Generates FAQ schema markup when enabled in SEO settings.</p>
      </div>
    </div>
  )
}
