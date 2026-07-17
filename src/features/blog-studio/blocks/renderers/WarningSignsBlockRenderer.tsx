import type { WarningSignsBlock } from '../../types'

export default function WarningSignsBlockRenderer({ block }: { block: WarningSignsBlock }) {
  const d = block.data
  return (
    <section className="max-w-3xl mx-auto px-6 py-8">
      {d.heading && <h2 className="text-xl md:text-2xl font-bold mb-2" style={{ color: '#0d2b55', fontFamily: 'var(--font-display), Georgia, serif' }}>{d.heading}</h2>}
      {d.intro && <p className="text-gray-600 mb-5">{d.intro}</p>}
      <div className="space-y-3">
        {d.signs.map((sign) => (
          <div key={sign.id} className="flex items-start gap-3 border-l-4 bg-red-50 rounded-r-xl px-4 py-3" style={{ borderColor: '#dc2626' }}>
            <span className="text-red-500 text-lg mt-0.5">⚠</span>
            <div>
              <p className="font-semibold text-sm text-gray-900">{sign.title}</p>
              {sign.description && <p className="text-xs text-gray-600 mt-0.5">{sign.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
