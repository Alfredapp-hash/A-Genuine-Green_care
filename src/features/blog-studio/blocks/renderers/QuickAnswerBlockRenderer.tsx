import type { QuickAnswerBlock } from '../../types'

export default function QuickAnswerBlockRenderer({ block }: { block: QuickAnswerBlock }) {
  const d = block.data
  return (
    <section className="max-w-3xl mx-auto px-6 py-6">
      <div className="rounded-2xl border-l-4 bg-blue-50 p-6" style={{ borderColor: '#1d4ed8' }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#1d4ed8' }}>Quick Answer</p>
        <h3 className="text-lg font-semibold mb-2" style={{ color: '#0d2b55' }}>{d.title}</h3>
        <p className="text-gray-700 leading-relaxed">{d.answer}</p>
      </div>
    </section>
  )
}
