import type { QuickAnswerBlock } from '../../types'

type Props = { block: QuickAnswerBlock; onChange: (b: QuickAnswerBlock) => void }

export default function QuickAnswerBlockEditor({ block, onChange }: Props) {
  const d = block.data
  const set = (patch: Partial<typeof d>) =>
    onChange({ ...block, data: { ...d, ...patch } })

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Question / Title <span className="text-red-400">*</span></label>
        <input
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          value={d.title}
          onChange={(e) => set({ title: e.target.value })}
          placeholder="e.g. How often should a Suzuki outboard be serviced?"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Answer <span className="text-red-400">*</span></label>
        <textarea
          rows={4}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-y"
          value={d.answer}
          onChange={(e) => set({ answer: e.target.value })}
          placeholder="Concise, direct answer..."
        />
        <p className="text-xs text-gray-400 mt-1">This block generates FAQ schema markup if enabled in SEO settings.</p>
      </div>
    </div>
  )
}
