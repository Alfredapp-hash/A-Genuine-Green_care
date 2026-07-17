import type { IntroBlock } from '../../types'

type Props = { block: IntroBlock; onChange: (b: IntroBlock) => void }

export default function IntroBlockEditor({ block, onChange }: Props) {
  const d = block.data
  const set = (patch: Partial<typeof d>) =>
    onChange({ ...block, data: { ...d, ...patch } })

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Headline (optional)</label>
        <input
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          value={d.headline ?? ''}
          onChange={(e) => set({ headline: e.target.value })}
          placeholder="Optional intro headline"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Body <span className="text-red-400">*</span></label>
        <textarea
          rows={5}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-y"
          value={d.body}
          onChange={(e) => set({ body: e.target.value })}
          placeholder="Write your introduction paragraph..."
        />
      </div>
    </div>
  )
}
