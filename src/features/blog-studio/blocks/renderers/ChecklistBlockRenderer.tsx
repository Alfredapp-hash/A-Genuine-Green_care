import type { ChecklistBlock } from '../../types'

export default function ChecklistBlockRenderer({ block }: { block: ChecklistBlock }) {
  const d = block.data
  return (
    <section className="max-w-3xl mx-auto px-6 py-8">
      {d.heading && <h2 className="text-xl md:text-2xl font-bold mb-2" style={{ color: '#0d2b55', fontFamily: 'var(--font-display), Georgia, serif' }}>{d.heading}</h2>}
      {d.intro && <p className="text-gray-600 mb-5">{d.intro}</p>}
      <ul className="space-y-3">
        {d.items.map((item, idx) => (
          <li key={item.id} className="flex items-start gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
            <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: '#1d4ed8' }}>{idx + 1}</span>
            <div>
              <p className="text-sm font-medium text-gray-900">{item.text}</p>
              {item.note && <p className="text-xs text-gray-500 mt-0.5">{item.note}</p>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
