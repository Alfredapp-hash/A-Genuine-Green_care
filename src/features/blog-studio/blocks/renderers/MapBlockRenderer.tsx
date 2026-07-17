import type { MapBlock } from '../../types'

export default function MapBlockRenderer({ block }: { block: MapBlock }) {
  const d = block.data
  const fallbackEmbed = 'https://maps.google.com/maps?q=1199+David+W+Ray+Road+Georgetown+SC+29440&output=embed'
  return (
    <section className="max-w-5xl mx-auto px-6 py-8">
      {d.heading && <h2 className="text-xl font-bold mb-4" style={{ color: '#0d2b55' }}>{d.heading}</h2>}
      <div className="rounded-2xl overflow-hidden border border-gray-200 h-72">
        <iframe
          src={d.embedUrl ?? fallbackEmbed}
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={d.heading ?? 'Map'}
          allowFullScreen
        />
      </div>
      {d.address && <p className="text-sm text-gray-500 mt-2 text-center">{d.address}</p>}
    </section>
  )
}
