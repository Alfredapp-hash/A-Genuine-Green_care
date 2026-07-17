import PremiumButton from '@/components/PremiumButton'
import type { RelatedServicesBlock } from '../../types'

const SERVICE_LABELS: Record<string, string> = {
  'boating-detailing': 'Boat Detailing', 'boat-storage': 'Boat Storage', 'bottom-painting': 'Bottom Painting',
  'canvas-work': 'Canvas Work', 'de-winterization': 'De-Winterization', 'electrical-repair-installation': 'Electrical Repair',
  'engine-installation': 'Engine Installation', 'fiberglass-gelcoat-repair': 'Fiberglass & Gelcoat Repair',
  'insurance-warranty': 'Insurance & Warranty', 'interior-repair': 'Interior Repair', 'mobile-service': 'Mobile Service',
  'oil-changes': 'Oil Changes', 'outdrive-service': 'Outdrive Service', 'pontoon-restoration': 'Pontoon Restoration',
  'pressure-washing': 'Pressure Washing', 'repower': 'Repower', 'shrink-wrapping': 'Shrink Wrapping',
  'spring-commissioning': 'Spring Commissioning', 'spring-start-up': 'Spring Start-Up', 'tune-ups': 'Tune-Ups',
  'winterization': 'Winterization',
}

export default function RelatedServicesBlockRenderer({ block }: { block: RelatedServicesBlock }) {
  const d = block.data
  if (d.serviceIds.length === 0) return null
  return (
    <section className="max-w-5xl mx-auto px-6 py-10">
      {d.heading && <h2 className="text-xl font-bold mb-6" style={{ color: '#0d2b55', fontFamily: 'var(--font-display), Georgia, serif' }}>{d.heading}</h2>}
      <div className="flex flex-wrap gap-3">
        {d.serviceIds.map((id) => (
          <PremiumButton
            key={id}
            href={`/services/${id}`}
            variant="outline"
            size="sm"
          >
            {SERVICE_LABELS[id] ?? id}
          </PremiumButton>
        ))}
      </div>
    </section>
  )
}
