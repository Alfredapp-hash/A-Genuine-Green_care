import type { RichTextBlock } from '../../types'

type Props = { block: RichTextBlock; onChange: (b: RichTextBlock) => void }

export default function RichTextBlockEditor({ block, onChange }: Props) {
  const d = block.data
  const set = (patch: Partial<typeof d>) =>
    onChange({ ...block, data: { ...d, ...patch } })

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Section Heading (optional)</label>
        <input
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          value={d.heading ?? ''}
          onChange={(e) => set({ heading: e.target.value })}
          placeholder="Section heading"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Body Text <span className="text-red-400">*</span></label>
        <textarea
          rows={8}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-y"
          value={d.body}
          onChange={(e) => set({ body: e.target.value })}
          placeholder="Write your content..."
        />
        {/* TODO: Replace with rich text editor (Tiptap or Quill) with predefined styles only — no raw HTML */}
        <p className="text-xs text-gray-400 mt-1">Plain text only for now. Rich text formatting coming soon.</p>
      </div>
    </div>
  )
}
