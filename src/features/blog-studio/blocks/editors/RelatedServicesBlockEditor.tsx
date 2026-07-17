import type { RelatedServicesBlock } from '../../types'

// All 21 Thomas Marine service slugs
const ALL_SERVICES = [
  { id: 'boating-detailing', label: 'Boat Detailing' },
  { id: 'boat-storage', label: 'Boat Storage' },
  { id: 'bottom-painting', label: 'Bottom Painting' },
  { id: 'canvas-work', label: 'Canvas Work' },
  { id: 'de-winterization', label: 'De-Winterization' },
  { id: 'electrical-repair-installation', label: 'Electrical Repair' },
  { id: 'engine-installation', label: 'Engine Installation' },
  { id: 'fiberglass-gelcoat-repair', label: 'Fiberglass & Gelcoat Repair' },
  { id: 'insurance-warranty', label: 'Insurance & Warranty' },
  { id: 'interior-repair', label: 'Interior Repair' },
  { id: 'mobile-service', label: 'Mobile Service' },
  { id: 'oil-changes', label: 'Oil Changes' },
  { id: 'outdrive-service', label: 'Outdrive Service' },
  { id: 'pontoon-restoration', label: 'Pontoon Restoration' },
  { id: 'pressure-washing', label: 'Pressure Washing' },
  { id: 'repower', label: 'Repower' },
  { id: 'shrink-wrapping', label: 'Shrink Wrapping' },
  { id: 'spring-commissioning', label: 'Spring Commissioning' },
  { id: 'spring-start-up', label: 'Spring Start-Up' },
  { id: 'tune-ups', label: 'Tune-Ups' },
  { id: 'winterization', label: 'Winterization' },
]

type Props = { block: RelatedServicesBlock; onChange: (b: RelatedServicesBlock) => void }

export default function RelatedServicesBlockEditor({ block, onChange }: Props) {
  const d = block.data
  const set = (patch: Partial<typeof d>) =>
    onChange({ ...block, data: { ...d, ...patch } })

  function toggle(id: string) {
    const ids = d.serviceIds.includes(id)
      ? d.serviceIds.filter((s) => s !== id)
      : [...d.serviceIds, id]
    set({ serviceIds: ids })
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Section Heading</label>
        <input
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          value={d.heading ?? ''}
          onChange={(e) => set({ heading: e.target.value })}
          placeholder="Related Services"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-2">Select Services</label>
        <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
          {ALL_SERVICES.map((svc) => (
            <label key={svc.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 rounded px-1.5 py-1">
              <input
                type="checkbox"
                checked={d.serviceIds.includes(svc.id)}
                onChange={() => toggle(svc.id)}
                className="accent-blue-600"
              />
              <span>{svc.label}</span>
            </label>
          ))}
        </div>
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
