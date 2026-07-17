import type { RichTextBlock } from '../../types'

export default function RichTextBlockRenderer({ block }: { block: RichTextBlock }) {
  const d = block.data
  return (
    <section className="max-w-3xl mx-auto px-6 py-8">
      {d.heading && (
        <h2 className="text-xl md:text-2xl font-bold mb-4" style={{ color: '#0d2b55', fontFamily: 'var(--font-display), Georgia, serif' }}>
          {d.heading}
        </h2>
      )}
      <div className="text-gray-700 leading-relaxed whitespace-pre-line">{d.body}</div>
    </section>
  )
}
