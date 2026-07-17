'use client'
import type { BlogPostType } from './types'
import { FORMAT_TEMPLATES } from './templates'

type Props = {
  onSelect: (type: BlogPostType) => void
  onClose: () => void
}

export default function FormatSelector({ onSelect, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold" style={{ color: '#0d2b55' }}>Choose a Post Format</h2>
              <p className="text-sm text-gray-500 mt-1">Each format preloads a recommended block layout. You can add or remove blocks after.</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
          </div>
        </div>

        {/* Format cards */}
        <div className="overflow-y-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FORMAT_TEMPLATES.map((fmt) => (
              <button
                key={fmt.type}
                onClick={() => onSelect(fmt.type)}
                className="group text-left border-2 border-gray-100 rounded-2xl p-5 hover:border-blue-500 hover:shadow-md transition-all"
              >
                <div className="text-3xl mb-3">{fmt.icon}</div>
                <p className="font-bold text-gray-900 text-sm mb-1 group-hover:text-blue-700 transition-colors">{fmt.label}</p>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">{fmt.description}</p>
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Best for</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{fmt.whenToUse}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
