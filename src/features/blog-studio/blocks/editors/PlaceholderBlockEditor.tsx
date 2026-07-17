import type { BlogBlock } from '../../types'

export default function PlaceholderBlockEditor({ block }: { block: BlogBlock; onChange: (b: BlogBlock) => void }) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
        {block.type.replace(/_/g, ' ')}
      </p>
      <p className="text-sm text-gray-400">Editor coming soon</p>
    </div>
  )
}
