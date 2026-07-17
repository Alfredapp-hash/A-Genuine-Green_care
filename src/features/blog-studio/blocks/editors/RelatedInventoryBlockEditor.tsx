import type { RelatedInventoryBlock } from '../../types'

type Props = { block: RelatedInventoryBlock; onChange: (b: RelatedInventoryBlock) => void }

export default function RelatedInventoryBlockEditor({ block, onChange }: Props) {
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
          placeholder="Related Inventory"
        />
      </div>
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-5 text-center">
        <p className="text-sm text-gray-400 mb-1">
          {d.inventoryIds.length > 0 ? `${d.inventoryIds.length} item(s) linked` : 'No inventory linked'}
        </p>
        <p className="text-xs text-gray-400">
          {/* TODO: Connect inventory picker to live ARI inventory feed or Supabase inventory table */}
          Inventory picker will connect to live listings when backend is wired.
        </p>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Display Style</label>
        <select
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          value={d.displayStyle ?? 'cards'}
          onChange={(e) => set({ displayStyle: e.target.value as 'cards' | 'list' })}
        >
          <option value="cards">Cards</option>
          <option value="list">List</option>
        </select>
      </div>
    </div>
  )
}
