'use client'
import type { DesignSettings, HeroStyle, LayoutStyle, AccentColor } from './types'

type Props = { design: DesignSettings; onChange: (d: DesignSettings) => void }

const HERO_STYLES: { value: HeroStyle; label: string; desc: string }[] = [
  { value: 'full_image',         label: 'Full Image Hero',         desc: 'Edge-to-edge image with dark overlay' },
  { value: 'split_text_image',   label: 'Split Text + Image',      desc: 'Text left, image right' },
  { value: 'dark_overlay',       label: 'Dark Overlay Hero',       desc: 'Strong navy gradient over image' },
  { value: 'clean_editorial',    label: 'Clean Editorial',         desc: 'White background, no image' },
  { value: 'service_page',       label: 'Service Page Hero',       desc: 'Bold service-style header' },
  { value: 'inventory_spotlight',label: 'Inventory Spotlight',     desc: 'Showcase a specific boat' },
]

const LAYOUT_STYLES: { value: LayoutStyle; label: string }[] = [
  { value: 'premium_editorial', label: 'Premium Editorial' },
  { value: 'service_guide',     label: 'Service Guide' },
  { value: 'compact_news',      label: 'Compact News' },
  { value: 'visual_story',      label: 'Visual Story' },
  { value: 'checklist',         label: 'Checklist' },
  { value: 'sales_spotlight',   label: 'Sales Spotlight' },
]

const ACCENT_COLORS: { value: AccentColor; label: string; hex: string }[] = [
  { value: 'suzuki_blue', label: 'Suzuki Blue',  hex: '#1d4ed8' },
  { value: 'navy',        label: 'Navy',          hex: '#0d2b55' },
  { value: 'charcoal',    label: 'Charcoal',      hex: '#374151' },
  { value: 'silver',      label: 'Silver',        hex: '#9ca3af' },
  { value: 'white',       label: 'White',         hex: '#ffffff' },
]

type DesignPreset = {
  id: string
  label: string
  description: string
  heroStyle: HeroStyle
  layoutStyle: LayoutStyle
  accentColor: AccentColor
}

const DESIGN_PRESETS: DesignPreset[] = [
  {
    id: 'classic_editorial',
    label: 'Classic Editorial',
    description: 'Clean article layout with navy accents',
    heroStyle: 'clean_editorial',
    layoutStyle: 'premium_editorial',
    accentColor: 'navy',
  },
  {
    id: 'service_guide',
    label: 'Service Guide',
    description: 'Bold service header with Suzuki blue',
    heroStyle: 'service_page',
    layoutStyle: 'service_guide',
    accentColor: 'suzuki_blue',
  },
  {
    id: 'visual_story',
    label: 'Visual Story',
    description: 'Full-image hero for photo-driven posts',
    heroStyle: 'full_image',
    layoutStyle: 'visual_story',
    accentColor: 'navy',
  },
  {
    id: 'sales_spotlight',
    label: 'Sales Spotlight',
    description: 'Inventory-focused layout for sales content',
    heroStyle: 'inventory_spotlight',
    layoutStyle: 'sales_spotlight',
    accentColor: 'suzuki_blue',
  },
]

function matchesPreset(design: DesignSettings, preset: DesignPreset): boolean {
  return design.heroStyle === preset.heroStyle
    && design.layoutStyle === preset.layoutStyle
    && design.accentColor === preset.accentColor
}

export default function DesignPanel({ design, onChange }: Props) {
  const set = (patch: Partial<DesignSettings>) => onChange({ ...design, ...patch })

  const activePresetId = DESIGN_PRESETS.find((p) => matchesPreset(design, p))?.id

  return (
    <div className="space-y-5">
      {/* Design Presets */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Design Preset</label>
        <p className="text-xs text-gray-400 mb-3">One-click combinations of hero, layout, and accent color.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {DESIGN_PRESETS.map((preset) => {
            const active = activePresetId === preset.id
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => set({
                  heroStyle: preset.heroStyle,
                  layoutStyle: preset.layoutStyle,
                  accentColor: preset.accentColor,
                })}
                className={`text-left rounded-lg border px-3 py-2.5 transition-all ${active ? 'border-[#c9a84c] bg-[#0d2b55]/5 ring-1 ring-[#c9a84c]/40' : 'border-gray-200 hover:border-[#0d2b55]/30 hover:bg-gray-50'}`}
              >
                <p className="text-sm font-semibold" style={{ color: active ? '#0d2b55' : '#1f2937' }}>{preset.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{preset.description}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Hero Style */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Hero Style</label>
        <div className="space-y-1.5">
          {HERO_STYLES.map((s) => (
            <label key={s.value} className={`flex items-start gap-3 cursor-pointer rounded-lg border px-3 py-2.5 transition-colors ${design.heroStyle === s.value ? 'border-[#0d2b55] bg-[#0d2b55]/5' : 'border-gray-200 hover:bg-gray-50'}`}>
              <input type="radio" name="heroStyle" value={s.value} checked={design.heroStyle === s.value} onChange={() => set({ heroStyle: s.value })} className="mt-0.5 accent-[#0d2b55]" />
              <div>
                <p className="text-sm font-semibold text-gray-800">{s.label}</p>
                <p className="text-xs text-gray-500">{s.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Layout Style */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Layout Style</label>
        <select
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d2b55]/20"
          value={design.layoutStyle}
          onChange={(e) => set({ layoutStyle: e.target.value as LayoutStyle })}
        >
          {LAYOUT_STYLES.map((l) => (
            <option key={l.value} value={l.value}>{l.label}</option>
          ))}
        </select>
      </div>

      {/* Accent Color */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Accent Color</label>
        <div className="flex gap-3 flex-wrap">
          {ACCENT_COLORS.map((c) => (
            <button
              key={c.value}
              title={c.label}
              onClick={() => set({ accentColor: c.value })}
              className={`w-8 h-8 rounded-full border-2 transition-all ${design.accentColor === c.value ? 'border-[#c9a84c] scale-110' : 'border-gray-300'}`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Selected: {ACCENT_COLORS.find((c) => c.value === design.accentColor)?.label}
        </p>
      </div>
    </div>
  )
}
