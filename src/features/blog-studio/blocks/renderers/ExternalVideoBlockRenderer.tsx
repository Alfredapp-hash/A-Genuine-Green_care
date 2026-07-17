import type { ExternalVideoBlock } from '../../types'
import { isSafeIframeSrc, SAFE_IFRAME_PROPS } from '../../videoUtils'

export default function ExternalVideoBlockRenderer({ block }: { block: ExternalVideoBlock }) {
  const { iframeSrc, heading, caption, title } = block.data
  if (!isSafeIframeSrc(iframeSrc)) return null

  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      {heading && (
        <h2 className="text-xl md:text-2xl font-bold mb-5 text-center" style={{ color: '#0d2b55' }}>{heading}</h2>
      )}
      <div className="relative rounded-2xl overflow-hidden bg-black shadow-2xl aspect-video ring-1 ring-black/10">
        <iframe
          src={iframeSrc}
          className="absolute inset-0 w-full h-full"
          title={title ?? heading ?? 'Video'}
          {...SAFE_IFRAME_PROPS}
        />
      </div>
      {caption && (
        <p className="text-xs text-gray-400 mt-3 text-center italic">{caption}</p>
      )}
    </section>
  )
}
