import type { ServiceStepsBlock } from '../../types'

export default function ServiceStepsBlockRenderer({ block }: { block: ServiceStepsBlock }) {
  const d = block.data
  return (
    <section className="max-w-3xl mx-auto px-6 py-10">
      {d.heading && <h2 className="text-xl md:text-2xl font-bold mb-8" style={{ color: '#0d2b55', fontFamily: 'var(--font-display), Georgia, serif' }}>{d.heading}</h2>}
      <div className="space-y-4">
        {d.steps.map((step) => (
          <div key={step.id} className="flex items-start gap-4">
            <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{ backgroundColor: '#1d4ed8' }}>
              {step.stepNumber}
            </div>
            <div className="flex-1 pb-4 border-b border-gray-100 last:border-0">
              <p className="font-semibold text-gray-900 mb-1">{step.title}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
