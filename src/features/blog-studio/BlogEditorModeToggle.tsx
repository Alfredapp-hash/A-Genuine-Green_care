'use client'

export type EditorMode = 'simple' | 'advanced'

type Props = {
  mode: EditorMode
  onChange: (m: EditorMode) => void
}

export default function BlogEditorModeToggle({ mode, onChange }: Props) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 border border-gray-200">
      <button
        onClick={() => onChange('simple')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
          mode === 'simple'
            ? 'bg-white text-[#0d2b55] shadow-sm border border-gray-200'
            : 'text-gray-400 hover:text-gray-700'
        }`}
      >
        ✏️ Simple Editor
      </button>
      <button
        onClick={() => onChange('advanced')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
          mode === 'advanced'
            ? 'bg-white text-[#0d2b55] shadow-sm border border-gray-200'
            : 'text-gray-400 hover:text-gray-700'
        }`}
      >
        ⚙️ Advanced Builder
      </button>
    </div>
  )
}
