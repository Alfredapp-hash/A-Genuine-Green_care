import PremiumButton from '@/components/PremiumButton'
import type { ContactFormBlock } from '../../types'

export default function ContactFormBlockRenderer({ block }: { block: ContactFormBlock }) {
  const d = block.data
  return (
    <section className="max-w-3xl mx-auto px-6 py-10">
      {d.heading && <h2 className="text-xl font-bold mb-4" style={{ color: '#0d2b55' }}>{d.heading}</h2>}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
        <p className="text-gray-600 text-sm mb-4">
          {/* TODO: Embed live contact form component when backend is wired */}
          Ready to connect? Reach out to the Thomas Marine team.
        </p>
        <PremiumButton href="/contact" variant="primary">
          Open Contact Form
        </PremiumButton>
      </div>
    </section>
  )
}
