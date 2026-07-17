import type { SpecsTableBlock } from '../../types'

export default function SpecsTableBlockRenderer({ block }: { block: SpecsTableBlock }) {
  const d = block.data
  return (
    <section className="max-w-3xl mx-auto px-6 py-8">
      {d.heading && <h2 className="text-xl font-bold mb-4" style={{ color: '#0d2b55', fontFamily: 'var(--font-display), Georgia, serif' }}>{d.heading}</h2>}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <tbody>
            {d.specs.map((spec, idx) => (
              <tr key={spec.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 font-semibold text-gray-700 w-1/3 border-b border-gray-100">{spec.label}</td>
                <td className="px-4 py-3 text-gray-900 border-b border-gray-100">{spec.value || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
