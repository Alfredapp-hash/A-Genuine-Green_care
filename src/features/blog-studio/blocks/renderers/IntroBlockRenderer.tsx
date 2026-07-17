import type { IntroBlock } from '../../types'

export default function IntroBlockRenderer({ block }: { block: IntroBlock }) {
  const d = block.data
  return (
    <section className="max-w-3xl mx-auto px-6 py-10">
      {d.headline && (
        <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#0d2b55', fontFamily: 'var(--font-display), Georgia, serif' }}>
          {d.headline}
        </h2>
      )}
      <p className="text-gray-700 text-lg leading-relaxed">{d.body}</p>
    </section>
  )
}
