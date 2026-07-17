'use client'

export type SaveState = 'saved' | 'saving' | 'unsaved' | 'idle'

type Props = { state: SaveState }

const CONFIG: Record<SaveState, { label: string; color: string; dot: string }> = {
  idle:    { label: '',              color: 'text-gray-300', dot: 'bg-gray-200' },
  saving:  { label: 'Saving…',      color: 'text-blue-500', dot: 'bg-blue-400 animate-pulse' },
  saved:   { label: 'Saved',        color: 'text-green-600', dot: 'bg-green-500' },
  unsaved: { label: 'Unsaved changes', color: 'text-amber-500', dot: 'bg-amber-400' },
}

export default function DraftAutosaveStatus({ state }: Props) {
  if (state === 'idle') return null
  const c = CONFIG[state]
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${c.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  )
}
