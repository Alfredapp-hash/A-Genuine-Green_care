'use client'

// Childcare-relevant page paths for Saltwater Sprouts announcements
const SWS_PATH_PRESETS = [
  { id: 'all', label: 'All pages' },
  { id: 'home', label: 'Home (/)' },
  { id: 'programs', label: 'Programs' },
  { id: 'enrollment', label: 'Enrollment' },
  { id: 'about', label: 'About' },
  { id: 'resources', label: 'Resources' },
  { id: 'contact', label: 'Contact' },
]

// Maps preset IDs to actual URL paths
function pathsFromPresets(selectedIds: string[], customLines: string[]): string[] {
  if (selectedIds.includes('all')) return []
  const presetMap: Record<string, string> = {
    home: '/',
    programs: '/programs',
    enrollment: '/enrollment',
    about: '/about',
    resources: '/resources',
    contact: '/contact',
  }
  const presetPaths = selectedIds.flatMap((id) => (presetMap[id] ? [presetMap[id]] : []))
  const custom = customLines.map((l) => l.trim()).filter(Boolean)
  return [...new Set([...presetPaths, ...custom])]
}

type Props = {
  selectedIds: string[]
  customPaths: string
  onSelectedIdsChange: (ids: string[]) => void
  onCustomPathsChange: (value: string) => void
}

export default function AnnouncementPathPicker({
  selectedIds,
  customPaths,
  onSelectedIdsChange,
  onCustomPathsChange,
}: Props) {
  function toggle(id: string) {
    if (id === 'all') {
      onSelectedIdsChange(['all'])
      onCustomPathsChange('')
      return
    }

    const withoutAll = selectedIds.filter((x) => x !== 'all')
    const next = withoutAll.includes(id)
      ? withoutAll.filter((x) => x !== id)
      : [...withoutAll, id]

    onSelectedIdsChange(next.length ? next : ['all'])
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {SWS_PATH_PRESETS.map((preset) => {
          const active = selectedIds.includes(preset.id)
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => toggle(preset.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                active
                  ? 'bg-[#1B3A5C] text-white border-[#1B3A5C]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              {preset.label}
            </button>
          )
        })}
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase">Custom paths (advanced)</label>
        <textarea
          className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono min-h-16"
          value={customPaths}
          onChange={(e) => onCustomPathsChange(e.target.value)}
          placeholder="/special-event&#10;/programs/infant-care"
        />
      </div>
    </div>
  )
}

export { pathsFromPresets }
