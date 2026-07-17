import Image from 'next/image'
import type { ImageTextBlock } from '../../types'

export default function ImageTextBlockRenderer({ block }: { block: ImageTextBlock }) {
  const d = block.data
  const isLeft = d.imagePosition === 'left'
  return (
    <section className="max-w-5xl mx-auto px-6 py-10">
      <div className={`flex flex-col ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8`}>
        <div className="relative w-full md:w-1/2 aspect-[4/3] rounded-2xl overflow-hidden flex-shrink-0">
          <Image src={d.image.url} alt={d.image.alt} fill className="object-cover" />
        </div>
        <div className="flex-1">
          {d.heading && <h2 className="text-xl md:text-2xl font-bold mb-3" style={{ color: '#0d2b55', fontFamily: 'var(--font-display), Georgia, serif' }}>{d.heading}</h2>}
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{d.body}</p>
        </div>
      </div>
    </section>
  )
}
