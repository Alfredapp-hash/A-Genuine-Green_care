'use client'

// TODO: connect Supabase
// Supabase storage upload (createClient from @/lib/supabase/client) is stubbed.
// Site hero images library and Canva picker are removed — add when available.

import { useRef, useState } from 'react'
import Image from 'next/image'
import type { MediaAsset } from './types'

type Tab = 'upload' | 'custom'

type Props = {
  onSelect: (asset: MediaAsset) => void
  onClose: () => void
  title?: string
  defaultAlt?: string
}

export default function MediaLibraryModal({
  onSelect,
  onClose,
  title = 'Choose Image',
  defaultAlt = '',
}: Props) {
  const [tab, setTab] = useState<Tab>('upload')
  const [altEdit, setAltEdit] = useState(defaultAlt)
  const [customUrl, setCustomUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function confirmCustom() {
    const url = customUrl.trim()
    if (!url) {
      setError('Enter an image URL.')
      return
    }
    onSelect({
      id: `custom-${Date.now()}`,
      url,
      alt: altEdit.trim() || defaultAlt || 'Blog image',
    })
    onClose()
  }

  async function uploadFile(file: File) {
    setUploading(true)
    setError(null)
    try {
      // TODO: connect Supabase — replace with actual storage upload
      // const supabase = createClient()
      // const path = `blog-studio/${Date.now()}-${...}.${ext}`
      // const { error: upErr } = await supabase.storage.from('blog-images').upload(path, file, ...)
      // const { data } = supabase.storage.from('blog-images').getPublicUrl(path)
      // onSelect({ id: path, url: data.publicUrl, alt: altEdit || file.name })
      const objectUrl = URL.createObjectURL(file)
      onSelect({
        id: `local-${Date.now()}`,
        url: objectUrl,
        alt: altEdit.trim() || file.name.replace(/\.[^.]+$/, '') || defaultAlt || 'Blog image',
      })
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const tabClass = (t: Tab) =>
    `px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
      tab === t ? 'bg-[#2c6b4a] text-white' : 'text-gray-500 hover:bg-gray-100'
    }`

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[80vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900">{title}</h2>
            <p className="text-xs text-gray-400 mt-0.5">Upload an image or paste a URL</p>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none" aria-label="Close">
            ✕
          </button>
        </div>

        <div className="px-6 pt-4 flex flex-wrap gap-2">
          <button type="button" className={tabClass('upload')} onClick={() => setTab('upload')}>Upload</button>
          <button type="button" className={tabClass('custom')} onClick={() => setTab('custom')}>Custom URL</button>
        </div>

        {error && <p className="px-6 pt-3 text-sm text-red-600">{error}</p>}

        <div className="flex flex-1 overflow-hidden min-h-0">
          {tab === 'upload' && (
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Alt text</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2c6b4a]/30"
                  value={altEdit}
                  onChange={(e) => setAltEdit(e.target.value)}
                  placeholder={defaultAlt || 'Describe the image for accessibility'}
                />
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) void uploadFile(file)
                }}
              />
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileRef.current?.click()}
                className="w-full py-12 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#2c6b4a]/40 hover:bg-gray-50 transition-colors text-sm text-gray-600 disabled:opacity-60"
              >
                {uploading ? 'Uploading…' : 'Click to choose an image from your computer'}
              </button>
              <p className="text-xs text-gray-400">
                Note: Upload uses a local object URL until Supabase storage is connected.
              </p>
            </div>
          )}

          {tab === 'custom' && (
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Image URL</label>
                <input
                  type="url"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#2c6b4a]/30"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Alt text</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2c6b4a]/30"
                  value={altEdit}
                  onChange={(e) => setAltEdit(e.target.value)}
                  placeholder={defaultAlt || 'Describe the image'}
                />
              </div>
              {customUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={customUrl} alt={altEdit || 'Preview'} className="w-full max-h-48 object-cover rounded-xl border border-gray-100" />
              )}
              <button
                type="button"
                onClick={confirmCustom}
                className="w-full py-2.5 rounded-xl font-bold text-white text-sm bg-[#2c6b4a] hover:bg-[#1e4e35] transition-colors"
              >
                Use this URL
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
