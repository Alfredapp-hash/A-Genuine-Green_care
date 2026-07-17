import type { DividerBlock } from '../../types'

export default function DividerBlockRenderer({ block }: { block: DividerBlock }) {
  const { style = 'line', label } = block.data

  if (style === 'space') {
    return <div className="py-8" aria-hidden="true" />
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10" aria-hidden="true">
      {label ? (
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px" style={{ backgroundColor: '#e2e8f0' }} />
          <span className="text-xs font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full border" style={{ color: '#c9a84c', borderColor: 'rgba(201,168,76,0.3)', backgroundColor: 'rgba(201,168,76,0.07)' }}>{label}</span>
          <div className="flex-1 h-px" style={{ backgroundColor: '#e2e8f0' }} />
        </div>
      ) : style === 'dots' ? (
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: '#c9a84c', opacity: 0.5 + i * 0.25 }} />
          ))}
        </div>
      ) : style === 'wave' ? (
        <div className="flex justify-center">
          <svg viewBox="0 0 120 12" className="w-24 h-3 opacity-30" fill="none">
            <path d="M0 6 Q15 0 30 6 Q45 12 60 6 Q75 0 90 6 Q105 12 120 6" stroke="#c9a84c" strokeWidth="2" fill="none" />
          </svg>
        </div>
      ) : (
        <div className="h-px" style={{ background: 'linear-gradient(to right, transparent, #c9a84c40, transparent)' }} />
      )}
    </div>
  )
}
