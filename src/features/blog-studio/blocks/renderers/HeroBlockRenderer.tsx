import PremiumButton from '@/components/PremiumButton'
import type { HeroBlock } from '../../types'

export default function HeroBlockRenderer({ block }: { block: HeroBlock }) {
  const d = block.data
  return (
    <section
      className="relative min-h-[420px] flex items-end pb-14 text-white overflow-hidden"
      style={{
        backgroundImage: d.image ? `url(${d.image.url})` : 'none',
        backgroundColor: '#0d2b55',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(4,14,34,0.92) 0%, rgba(4,14,34,0.55) 60%, rgba(4,14,34,0.3) 100%)' }} />
      <div className="relative max-w-4xl mx-auto px-6 w-full">
        {d.eyebrow && (
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#c9a84c' }}>{d.eyebrow}</p>
        )}
        <h1 className="text-3xl md:text-5xl font-bold mb-3 leading-tight" style={{ fontFamily: 'var(--font-display), Georgia, serif' }}>
          {d.title || 'Post Title'}
        </h1>
        {d.subtitle && <p className="text-gray-300 text-lg mb-6">{d.subtitle}</p>}
        <div className="flex flex-wrap gap-3">
          {d.primaryCta && (
            <PremiumButton href={d.primaryCta.url} variant="primary">
              {d.primaryCta.text}
            </PremiumButton>
          )}
          {d.secondaryCta && (
            <PremiumButton href={d.secondaryCta.url} variant="ghost">
              {d.secondaryCta.text}
            </PremiumButton>
          )}
        </div>
      </div>
    </section>
  )
}
