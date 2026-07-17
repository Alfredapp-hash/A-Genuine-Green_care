import Link from 'next/link'
import type { RelatedInventoryBlock } from '../../types'

export default function RelatedInventoryBlockRenderer({ block }: { block: RelatedInventoryBlock }) {
  const d = block.data
  return (
    <section className="max-w-5xl mx-auto px-6 py-10">
      {d.heading && <h2 className="text-xl font-bold mb-4" style={{ color: '#0d2b55', fontFamily: 'var(--font-display), Georgia, serif' }}>{d.heading}</h2>}
      {d.inventoryIds.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 py-10 text-center text-sm text-gray-400">
          No inventory linked.{/* TODO: Connect to live inventory feed */}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {d.inventoryIds.map((id) => (
            <Link key={id} href={`/inventory/${id}`} className="block rounded-xl border border-gray-200 p-4 hover:border-blue-300 transition-colors">
              <p className="text-sm font-medium text-gray-900">{id}</p>
              {/* TODO: Resolve inventory ID to full listing data */}
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
