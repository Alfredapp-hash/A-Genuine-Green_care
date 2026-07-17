import type { BlogBlock } from '../../types'

export default function PlaceholderBlockRenderer({ block }: { block: BlogBlock }) {
  return (
    <section className="max-w-3xl mx-auto px-6 py-8">
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 py-10 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
          {block.type.replace(/_/g, ' ')}
        </p>
        <p className="text-sm text-gray-400">Renderer coming soon</p>
      </div>
    </section>
  )
}
