import Image from 'next/image'
import type { GalleryBlock } from '../../types'

export default function GalleryBlockRenderer({ block }: { block: GalleryBlock }) {
  const d = block.data
  const cols = d.columns ?? 3
  const gridClass = cols === 2 ? 'grid-cols-2' : cols === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3'

  return (
    <section className="max-w-5xl mx-auto px-6 py-8">
      {d.heading && <h2 className="text-xl font-bold mb-5" style={{ color: '#0d2b55' }}>{d.heading}</h2>}
      {d.images.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 py-12 text-center text-gray-400 text-sm">No gallery images added yet</div>
      ) : (
        <div className={`grid ${gridClass} gap-3`}>
          {d.images.map((img) => (
            <div key={img.id} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
              <Image src={img.url} alt={img.alt} fill className="object-cover" />
              {img.caption && <p className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-xs px-2 py-1">{img.caption}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
