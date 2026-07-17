'use client'

import { useState } from 'react'
import { ImageIcon } from 'lucide-react'
import type { HeroBlock } from '../../types'
import MediaLibraryModal from '../../MediaLibraryModal'

type Props = { block: HeroBlock; onChange: (b: HeroBlock) => void }

export default function HeroBlockEditor({ block, onChange }: Props) {
  const [modalOpen, setModalOpen] = useState(false)
  const d = block.data
  const set = (patch: Partial<typeof d>) =>
    onChange({ ...block, data: { ...d, ...patch } })

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Hero Image</label>
        {d.image?.url ? (
          <div className="space-y-2 mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={d.image.url} alt={d.image.alt} className="w-full h-32 object-cover rounded-xl border border-gray-100" />
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              value={d.image.alt ?? ''}
              onChange={(e) => set({ image: { ...d.image!, alt: e.target.value } })}
              placeholder="Alt text for accessibility"
            />
          </div>
        ) : (
          <p className="text-xs text-gray-400 mb-2">No hero image selected.</p>
        )}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
            style={{ backgroundColor: '#0d2b55' }}
          >
            <ImageIcon size={13} />
            {d.image?.url ? 'Change hero' : 'Choose hero image'}
          </button>
          {d.image?.url && (
            <button
              type="button"
              onClick={() => set({ image: undefined })}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Eyebrow Text</label>
        <input
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          value={d.eyebrow ?? ''}
          onChange={(e) => set({ eyebrow: e.target.value })}
          placeholder="e.g. Service Guide"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Title <span className="text-red-400">*</span></label>
        <input
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          value={d.title}
          onChange={(e) => set({ title: e.target.value })}
          placeholder="Post headline"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Subtitle</label>
        <input
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          value={d.subtitle ?? ''}
          onChange={(e) => set({ subtitle: e.target.value })}
          placeholder="Supporting line under the title"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Primary CTA Label</label>
          <input
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            value={d.primaryCta?.text ?? ''}
            onChange={(e) => set({ primaryCta: { ...(d.primaryCta ?? { url: '/contact', style: 'primary' }), text: e.target.value } })}
            placeholder="Schedule Service"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Primary CTA URL</label>
          <input
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            value={d.primaryCta?.url ?? ''}
            onChange={(e) => set({ primaryCta: { ...(d.primaryCta ?? { text: '', style: 'primary' }), url: e.target.value } })}
            placeholder="/contact"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Secondary CTA Label</label>
          <input
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            value={d.secondaryCta?.text ?? ''}
            onChange={(e) => set({ secondaryCta: { ...(d.secondaryCta ?? { url: '/', style: 'ghost' }), text: e.target.value } })}
            placeholder="View Services"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Secondary CTA URL</label>
          <input
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            value={d.secondaryCta?.url ?? ''}
            onChange={(e) => set({ secondaryCta: { ...(d.secondaryCta ?? { text: '', style: 'ghost' }), url: e.target.value } })}
            placeholder="/services"
          />
        </div>
      </div>

      {modalOpen && (
        <MediaLibraryModal
          title="Hero Image"
          defaultAlt={d.title || 'Blog hero image'}
          onSelect={(asset) => set({ image: asset })}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}
