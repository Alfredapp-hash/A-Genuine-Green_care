import type { ParagraphBlock } from '../../types'

const SIZE_CLASSES: Record<string, string> = {
  sm: 'text-sm leading-relaxed',
  base: 'text-base md:text-lg leading-relaxed',
  lg: 'text-lg md:text-xl leading-relaxed',
}

export default function ParagraphBlockRenderer({ block }: { block: ParagraphBlock }) {
  const { body, size = 'base', align = 'left' } = block.data
  if (!body) return null
  return (
    <section className="max-w-4xl mx-auto px-6 py-4">
      <p
        className={`${SIZE_CLASSES[size] ?? SIZE_CLASSES.base} ${align === 'center' ? 'text-center' : 'text-left'} text-gray-700`}
        style={{ whiteSpace: 'pre-line' }}
      >
        {body}
      </p>
    </section>
  )
}
