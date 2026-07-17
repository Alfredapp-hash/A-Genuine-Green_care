import type { VideoBlock } from '../../types'
import { resolveVideoUrl, SAFE_IFRAME_PROPS } from '../../videoUtils'

export default function VideoBlockRenderer({ block }: { block: VideoBlock }) {
  const d = block.data
  if (!d.url) return null

  const resolved = resolveVideoUrl(d.url, { autoplay: d.autoplay, loop: d.loop })

  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      {d.heading && (
        <h2 className="text-xl md:text-2xl font-bold mb-5 text-center" style={{ color: '#0d2b55' }}>{d.heading}</h2>
      )}
      <div className="relative rounded-2xl overflow-hidden bg-black shadow-2xl aspect-video ring-1 ring-black/10">
        {resolved ? (
          <iframe
            src={resolved.embedUrl}
            className="absolute inset-0 w-full h-full"
            title={d.heading ?? 'Video'}
            {...SAFE_IFRAME_PROPS}
          />
        ) : (
          <video
            src={d.url}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay={d.autoplay}
            loop={d.loop}
            muted={d.autoplay}
            controls={!d.autoplay}
            playsInline
          />
        )}
      </div>
      {d.caption && (
        <p className="text-xs text-gray-400 mt-3 text-center italic">{d.caption}</p>
      )}
    </section>
  )
}
