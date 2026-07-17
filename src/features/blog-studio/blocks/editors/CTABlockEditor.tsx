import type { CTABlock, CTAStyle } from '../../types'

type Props = { block: CTABlock; onChange: (b: CTABlock) => void }

const CTA_STYLES: { value: CTAStyle; label: string }[] = [
  { value: 'service', label: 'Schedule Service' },
  { value: 'inventory', label: 'View Inventory' },
  { value: 'contact', label: 'Contact Thomas Marine' },
  { value: 'quote', label: 'Request Quote' },
]

const PRESET_CTAS = [
  { label: 'Schedule Service', primaryText: 'Schedule Service', primaryUrl: '/contact', secondaryText: 'View Services', secondaryUrl: '/services', style: 'service' as CTAStyle },
  { label: 'View Inventory', primaryText: 'View Inventory', primaryUrl: '/inventory', secondaryText: 'Contact Our Team', secondaryUrl: '/contact', style: 'inventory' as CTAStyle },
  { label: 'Contact Us', primaryText: 'Contact Thomas Marine', primaryUrl: '/contact', secondaryText: '(843) 833-8054', secondaryUrl: 'tel:8438338054', style: 'contact' as CTAStyle },
  { label: 'Request Quote', primaryText: 'Request a Quote', primaryUrl: '/contact?type=quote', secondaryText: undefined, secondaryUrl: undefined, style: 'quote' as CTAStyle },
]

export default function CTABlockEditor({ block, onChange }: Props) {
  const d = block.data
  const set = (patch: Partial<typeof d>) =>
    onChange({ ...block, data: { ...d, ...patch } })

  function applyPreset(idx: number) {
    const p = PRESET_CTAS[idx]
    set({
      primaryButtonText: p.primaryText,
      primaryButtonUrl: p.primaryUrl,
      secondaryButtonText: p.secondaryText,
      secondaryButtonUrl: p.secondaryUrl,
      style: p.style,
    })
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Preset CTAs</label>
        <div className="flex flex-wrap gap-2">
          {PRESET_CTAS.map((p, i) => (
            <button
              key={p.label}
              onClick={() => applyPreset(i)}
              className="text-xs px-3 py-1.5 rounded-full border border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Title <span className="text-red-400">*</span></label>
        <input
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          value={d.title}
          onChange={(e) => set({ title: e.target.value })}
          placeholder="CTA headline"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Supporting Text</label>
        <input
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          value={d.text ?? ''}
          onChange={(e) => set({ text: e.target.value })}
          placeholder="Optional supporting sentence"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Primary Button Label</label>
          <input
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            value={d.primaryButtonText}
            onChange={(e) => set({ primaryButtonText: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Primary Button URL</label>
          <input
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            value={d.primaryButtonUrl}
            onChange={(e) => set({ primaryButtonUrl: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Secondary Button Label</label>
          <input
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            value={d.secondaryButtonText ?? ''}
            onChange={(e) => set({ secondaryButtonText: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Secondary Button URL</label>
          <input
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            value={d.secondaryButtonUrl ?? ''}
            onChange={(e) => set({ secondaryButtonUrl: e.target.value })}
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">CTA Style</label>
        <select
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          value={d.style ?? 'service'}
          onChange={(e) => set({ style: e.target.value as CTAStyle })}
        >
          {CTA_STYLES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
