import type { ComparisonTableBlock } from '../../types'

export default function ComparisonTableBlockRenderer({ block }: { block: ComparisonTableBlock }) {
  const d = block.data
  return (
    <section className="max-w-3xl mx-auto px-6 py-8">
      {d.heading && <h2 className="text-xl font-bold mb-4" style={{ color: '#0d2b55', fontFamily: 'var(--font-display), Georgia, serif' }}>{d.heading}</h2>}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: '#0d2b55' }}>
              <th className="px-4 py-3 text-left text-white font-semibold">Feature</th>
              <th className="px-4 py-3 text-left text-white font-semibold">{d.labelA}</th>
              <th className="px-4 py-3 text-left text-white font-semibold">{d.labelB}</th>
            </tr>
          </thead>
          <tbody>
            {d.rows.map((row, idx) => (
              <tr key={row.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 font-medium text-gray-700 border-b border-gray-100">{row.feature}</td>
                <td className="px-4 py-3 text-gray-900 border-b border-gray-100">{row.optionA || '—'}</td>
                <td className="px-4 py-3 text-gray-900 border-b border-gray-100">{row.optionB || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
