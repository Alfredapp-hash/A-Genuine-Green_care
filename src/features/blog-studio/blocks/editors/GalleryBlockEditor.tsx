import type { GalleryBlock } from '../../types'

type Props = { block: GalleryBlock; onChange: (b: GalleryBlock) => void }

export default function GalleryBlockEditor({ block, onChange }: Props) {
  const d = block.data
  const set = (patch: Partial<typeof d>) =>
    onChange({ ...block, data: { ...d, ...patch } })

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Heading</label>
        <input
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          value={d.heading ?? ''}
          onChange={(e) => set({ heading: e.target.value })}
          placeholder="Gallery heading"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Columns</label>
        <select
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          value={d.columns ?? 3}
          onChange={(e) => set({ columns: Number(e.target.value) as 2 | 3 | 4 })}
        >
          <option value={2}>2 Columns</option>
          <option value={3}>3 Columns</option>
          <option value={4}>4 Columns</option>
        </select>
      </div>
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center">
        <p className="text-sm text-gray-400 mb-1">
          {d.images.length > 0 ? `${d.images.length} image(s) selected` : 'No images selected'}
        </p>
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          Open Media Library
          {/* TODO: Wire MediaLibraryModal to populate gallery images */}
        </button>
      </div>
    </div>
  )
}
