import PremiumButton from '@/components/PremiumButton'
import type { ButtonCtaBlock } from '../../types'
import type { PremiumButtonVariant } from '@/components/PremiumButton'

const ALIGN_CLASSES: Record<string, string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
}

const VARIANT_MAP: Record<string, PremiumButtonVariant> = {
  primary: 'primary',
  secondary: 'outline',
  ghost: 'ghost',
  outline: 'outline',
}

export default function ButtonCtaBlockRenderer({ block }: { block: ButtonCtaBlock }) {
  const { label, url, style = 'primary', align = 'center', subtext } = block.data
  const alignClass = ALIGN_CLASSES[align] ?? 'justify-center'
  const variant = VARIANT_MAP[style] ?? 'primary'

  return (
    <section className="max-w-4xl mx-auto px-6 py-8">
      <div className={`flex flex-col items-center sm:flex-row ${alignClass} gap-3`}>
        <div className={`flex flex-col items-${align === 'center' ? 'center' : 'start'} gap-1`}>
          <PremiumButton href={url} variant={variant} shape="rounded">
            {label}
          </PremiumButton>
          {subtext && (
            <p className="text-xs text-gray-400 mt-1">{subtext}</p>
          )}
        </div>
      </div>
    </section>
  )
}
