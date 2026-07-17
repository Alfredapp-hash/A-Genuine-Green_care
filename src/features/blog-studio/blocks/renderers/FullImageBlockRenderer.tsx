import Image from 'next/image'
import type { FullImageBlock } from '../../types'

export default function FullImageBlockRenderer({ block }: { block: FullImageBlock }) {
  const d = block.data
  return (
    <section className="max-w-5xl mx-auto px-6 py-6">
      <div className="relative aspect-[16/7] rounded-2xl overflow-hidden">
        <Image src={d.image.url} alt={d.image.alt} fill className="object-cover" />
      </div>
      {d.caption && <p className="text-center text-xs text-gray-500 mt-2 italic">{d.caption}</p>}
    </section>
  )
}
