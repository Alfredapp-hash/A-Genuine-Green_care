'use client'

import { useState } from 'react'
import { nanoid } from 'nanoid'
import { ImageIcon, Upload } from 'lucide-react'
import MediaLibraryModal from './MediaLibraryModal'
import type { MediaAsset } from './types'

type Props = {
  label?: string
  hint?: string
  value?: MediaAsset
  defaultAlt?: string
  onChange: (asset: MediaAsset | undefined) => void
}

export default function FeaturedImageField({
  label = 'Featured Image',
  hint = 'Appears at the top of your post and when shared on social media.',
  value,
  defaultAlt = '',
  onChange,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false)

  function handleSelect(asset: MediaAsset) {
    onChange(asset)
    setModalOpen(false)
  }

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-bold text-gray-700">{label}</label>
      {hint && <p className="text-xs text-gray-400 leading-relaxed">{hint}</p>}

      {value?.url ? (
        <div className="space-y-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value.url}
            alt={value.alt}
            className="w-full h-40 object-cover rounded-xl border border-gray-100"
          />
          <input
            type="text"
            value={value.alt ?? ''}
            onChange={(e) => onChange({ ...value, alt: e.target.value })}
            placeholder="Describe the image (for accessibility and SEO)"
            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#0d2b55]/20"
          />
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-6 text-center">
          <ImageIcon className="mx-auto text-gray-300 mb-2" size={28} />
          <p className="text-sm text-gray-500 mb-3">No image selected yet</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white"
          style={{ backgroundColor: '#0d2b55' }}
        >
          <ImageIcon size={14} />
          {value?.url ? 'Change image' : 'Choose from site heroes'}
        </button>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50"
        >
          <Upload size={14} />
          Upload or paste URL
        </button>
        {value?.url && (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="px-3 py-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50"
          >
            Remove
          </button>
        )}
      </div>

      {modalOpen && (
        <MediaLibraryModal
          title="Featured Image"
          defaultAlt={defaultAlt}
          onSelect={handleSelect}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}

/** Keep featured image and hero block in sync when both exist. */
export function syncHeroBlockImage(
  blocks: import('./types').BlogBlock[],
  image: MediaAsset | undefined,
): import('./types').BlogBlock[] {
  if (!image) return blocks
  const heroIdx = blocks.findIndex((b) => b.type === 'hero')
  if (heroIdx < 0) return blocks
  const hero = blocks[heroIdx]
  if (hero.type !== 'hero') return blocks
  const next = [...blocks]
  next[heroIdx] = {
    ...hero,
    data: { ...hero.data, image },
  }
  return next
}

export function featuredImageFromBlocks(blocks: import('./types').BlogBlock[]): MediaAsset | undefined {
  const hero = blocks.find((b) => b.type === 'hero')
  if (hero?.type === 'hero' && hero.data.image?.url) return hero.data.image
  return undefined
}

export function newFeaturedAsset(url: string, alt: string, existingId?: string): MediaAsset {
  return { id: existingId ?? nanoid(), url, alt }
}
