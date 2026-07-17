import type { BeforeAfterBlock } from '../../types'

type Props = { block: BeforeAfterBlock; onChange: (b: BeforeAfterBlock) => void }

export default function BeforeAfterBlockEditor({ block, onChange }: Props) {
  const d = block.data
  const set = (patch: Partial<typeof d>) =>
    onChange({ ...block, data: { ...d, ...patch } })

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Section Heading</label>
        <input
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          value={d.heading ?? ''}
          onChange={(e) => set({ heading: e.target.value })}
          placeholder="Before & After"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-center">
          <p className="text-xs font-semibold text-gray-400 mb-1">BEFORE Image</p>
          <p className="text-xs text-gray-400">
            {/* TODO: Wire to MediaLibraryModal for before image selection */}
            {d.beforeImage?.alt || 'No image selected'}
          </p>
        </div>
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-center">
          <p className="text-xs font-semibold text-gray-400 mb-1">AFTER Image</p>
          <p className="text-xs text-gray-400">
            {/* TODO: Wire to MediaLibraryModal for after image selection */}
            {d.afterImage?.alt || 'No image selected'}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Before Label</label>
          <input
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            value={d.beforeLabel ?? ''}
            onChange={(e) => set({ beforeLabel: e.target.value })}
            placeholder="Before"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">After Label</label>
          <input
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            value={d.afterLabel ?? ''}
            onChange={(e) => set({ afterLabel: e.target.value })}
            placeholder="After"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
        <textarea
          rows={3}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
          value={d.description ?? ''}
          onChange={(e) => set({ description: e.target.value })}
          placeholder="Describe the transformation..."
        />
      </div>
    </div>
  )
}
