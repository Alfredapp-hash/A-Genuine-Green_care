import type { TrustBadgesBlock } from '../../types'

export default function TrustBadgesBlockRenderer({ block }: { block: TrustBadgesBlock }) {
  const d = block.data
  return (
    <section className="max-w-5xl mx-auto px-6 py-10">
      {d.heading && (
        <h2 className="text-xl font-bold mb-6 text-center" style={{ color: '#0d2b55', fontFamily: 'var(--font-display), Georgia, serif' }}>
          {d.heading}
        </h2>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {d.badges.map((badge) => (
          <div key={badge.id} className="flex flex-col items-center text-center bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            {badge.icon && <span className="text-2xl mb-2">{badge.icon}</span>}
            <p className="text-sm font-bold" style={{ color: '#0d2b55' }}>{badge.label}</p>
            {badge.description && <p className="text-xs text-gray-500 mt-1">{badge.description}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}
