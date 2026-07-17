import Image from 'next/image'
import type { QuoteBlock } from '../../types'

export default function QuoteBlockRenderer({ block }: { block: QuoteBlock }) {
  const d = block.data
  return (
    <section className="max-w-3xl mx-auto px-6 py-10">
      <blockquote className="relative border-l-4 pl-6" style={{ borderColor: '#c9a84c' }}>
        <p className="text-xl md:text-2xl font-medium italic text-gray-800 leading-relaxed mb-4">
          &ldquo;{d.quote}&rdquo;
        </p>
        {d.attribution && (
          <footer className="flex items-center gap-3">
            {d.avatar && <Image src={d.avatar.url} alt={d.avatar.alt} width={40} height={40} className="rounded-full object-cover" />}
            <div>
              <p className="text-sm font-semibold" style={{ color: '#0d2b55' }}>{d.attribution}</p>
              {d.role && <p className="text-xs text-gray-500">{d.role}</p>}
            </div>
          </footer>
        )}
      </blockquote>
    </section>
  )
}
