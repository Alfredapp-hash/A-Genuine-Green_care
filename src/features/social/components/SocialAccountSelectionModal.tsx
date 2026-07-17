'use client'
// ─────────────────────────────────────────────────────────────────────────────
// SocialAccountSelectionModal — shown when OAuth returns multiple pages/
// locations and the admin needs to pick which one to connect.
// ─────────────────────────────────────────────────────────────────────────────
import Image from 'next/image'
import type { SocialPlatform } from '../types'
import { PLATFORM_LABELS, PLATFORM_COLORS } from '../types'

type SelectableOption = {
  externalId: string
  name: string
  handle?: string
  imageUrl?: string
  type: string
  metadata?: Record<string, unknown>
}

type Props = {
  platform: SocialPlatform
  accountId: string
  options: unknown[]
  onClose: () => void
  onSelected: () => void
}

export default function SocialAccountSelectionModal({ platform, accountId, options, onClose, onSelected }: Props) {
  const color = PLATFORM_COLORS[platform]
  const label = PLATFORM_LABELS[platform]
  const items = options as SelectableOption[]

  async function select(option: SelectableOption) {
    try {
      await fetch(`/api/social/accounts/${accountId}/select`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedId: option.externalId, platform, metadata: option.metadata }),
      })
    } catch { /* best-effort */ }
    onSelected()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(4,14,33,0.7)' }}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 flex items-center gap-3 border-b border-gray-100" style={{ background: `linear-gradient(135deg, ${color}15, ${color}05)` }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm" style={{ backgroundColor: color }}>
            {platform[0].toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">Select {label}</p>
            <p className="text-xs text-gray-500">Multiple options were found — choose one to connect.</p>
          </div>
          <button onClick={onClose} className="ml-auto text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        {/* Options list */}
        <div className="px-6 py-4 space-y-2 max-h-96 overflow-y-auto">
          {items.map((opt) => (
            <button
              key={opt.externalId}
              onClick={() => select(opt)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
            >
              {opt.imageUrl ? (
                <Image src={opt.imageUrl} alt={opt.name} width={36} height={36} className="rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0" style={{ backgroundColor: color }}>
                  {opt.name[0]}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{opt.name}</p>
                {opt.handle && <p className="text-xs text-gray-500">{opt.handle}</p>}
                {typeof opt.metadata?.address === 'string' && (
                  <p className="text-xs text-gray-400 truncate">{opt.metadata.address as string}</p>
                )}
                <p className="text-xs text-gray-400">{opt.type} · ID: {opt.externalId}</p>
              </div>
              <span className="text-xs font-bold text-blue-600 shrink-0">Select →</span>
            </button>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
          <button onClick={onClose} className="text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
