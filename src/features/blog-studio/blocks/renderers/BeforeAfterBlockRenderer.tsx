import Image from 'next/image'
import type { BeforeAfterBlock } from '../../types'

export default function BeforeAfterBlockRenderer({ block }: { block: BeforeAfterBlock }) {
  const d = block.data
  return (
    <section className="max-w-5xl mx-auto px-6 py-10">
      {d.heading && <h2 className="text-xl font-bold mb-6" style={{ color: '#0d2b55', fontFamily: 'var(--font-display), Georgia, serif' }}>{d.heading}</h2>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative">
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
            <Image src={d.beforeImage.url} alt={d.beforeImage.alt} fill className="object-cover" />
          </div>
          <p className="mt-2 text-center text-sm font-semibold text-gray-500 uppercase tracking-widest">{d.beforeLabel ?? 'Before'}</p>
        </div>
        <div className="relative">
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
            <Image src={d.afterImage.url} alt={d.afterImage.alt} fill className="object-cover" />
          </div>
          <p className="mt-2 text-center text-sm font-semibold uppercase tracking-widest" style={{ color: '#1d4ed8' }}>{d.afterLabel ?? 'After'}</p>
        </div>
      </div>
      {d.description && <p className="mt-4 text-gray-700 text-sm leading-relaxed max-w-2xl mx-auto text-center">{d.description}</p>}
    </section>
  )
}
