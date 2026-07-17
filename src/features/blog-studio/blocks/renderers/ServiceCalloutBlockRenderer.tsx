import Link from 'next/link'
import PremiumButton from '@/components/PremiumButton'
import type { ServiceCalloutBlock } from '../../types'

export default function ServiceCalloutBlockRenderer({ block }: { block: ServiceCalloutBlock }) {
  const { heading, description, services, ctaLabel, ctaUrl } = block.data
  return (
    <section className="py-12 px-4" style={{ background: 'linear-gradient(135deg, #081d3a 0%, #0d2b55 100%)' }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{heading}</h2>
          {description && <p className="text-gray-300 text-base max-w-2xl mx-auto">{description}</p>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {services.map((s) => (
            <div key={s.id} className="bg-white/8 backdrop-blur-sm border border-white/15 rounded-2xl p-5 hover:bg-white/12 transition-colors">
              <h3 className="font-bold text-white text-base mb-1.5">{s.name}</h3>
              {s.description && <p className="text-sm text-gray-300 leading-relaxed">{s.description}</p>}
              {s.url && (
                <Link href={s.url} className="inline-block mt-3 text-xs font-bold uppercase tracking-wider hover:underline" style={{ color: '#c9a84c' }}>
                  Learn more →
                </Link>
              )}
            </div>
          ))}
        </div>
        {ctaLabel && ctaUrl && (
          <div className="text-center">
            <PremiumButton href={ctaUrl} variant="gold" shape="rounded" size="lg">
              {ctaLabel}
            </PremiumButton>
          </div>
        )}
      </div>
    </section>
  )
}
