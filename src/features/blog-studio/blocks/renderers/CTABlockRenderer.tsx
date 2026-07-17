import PremiumButton from '@/components/PremiumButton'
import type { CTABlock } from '../../types'

export default function CTABlockRenderer({ block }: { block: CTABlock }) {
  const d = block.data
  return (
    <section className="relative py-16 px-6 overflow-hidden" style={{ background: 'linear-gradient(135deg, #040e21 0%, #0d2b55 55%, #1a4080 100%)' }}>
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 12px)' }} />
      <div className="relative max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-display), Georgia, serif' }}>{d.title}</h2>
        {d.text && <p className="text-gray-300 mb-8 text-base">{d.text}</p>}
        <div className="flex flex-wrap justify-center gap-4">
          <PremiumButton href={d.primaryButtonUrl} variant="primary">
            {d.primaryButtonText}
          </PremiumButton>
          {d.secondaryButtonText && d.secondaryButtonUrl && (
            <PremiumButton href={d.secondaryButtonUrl} variant="ghost">
              {d.secondaryButtonText}
            </PremiumButton>
          )}
        </div>
      </div>
    </section>
  )
}
