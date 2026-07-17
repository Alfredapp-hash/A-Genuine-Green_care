import type { HeadingBlock } from '../../types'

const LEVEL_CLASSES: Record<number, string> = {
  2: 'text-3xl md:text-4xl font-bold',
  3: 'text-2xl md:text-3xl font-bold',
  4: 'text-xl md:text-2xl font-semibold',
}

const ALIGN_CLASSES: Record<string, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

export default function HeadingBlockRenderer({ block }: { block: HeadingBlock }) {
  const { text, level = 2, align = 'left', eyebrow } = block.data
  const alignClass = ALIGN_CLASSES[align] ?? 'text-left'
  const headingClass = `${LEVEL_CLASSES[level]} ${alignClass} leading-tight`
  const headingStyle = { color: '#0d2b55' }

  const heading =
    level === 4 ? (
      <h4 className={headingClass} style={headingStyle}>{text}</h4>
    ) : level === 3 ? (
      <h3 className={headingClass} style={headingStyle}>{text}</h3>
    ) : (
      <h2 className={headingClass} style={headingStyle}>{text}</h2>
    )

  return (
    <section className="max-w-4xl mx-auto px-6 pt-10 pb-3">
      {eyebrow && (
        <p className={`text-xs font-bold uppercase tracking-[0.18em] mb-3 ${alignClass}`} style={{ color: '#c9a84c' }}>
          {eyebrow}
        </p>
      )}
      {heading}
    </section>
  )
}
