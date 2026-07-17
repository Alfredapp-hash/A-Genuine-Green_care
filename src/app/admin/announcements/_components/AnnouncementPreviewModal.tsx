'use client'

import { X } from 'lucide-react'

type PreviewAnnouncement = {
  title: string
  body?: string | null
  image_url?: string | null
  cta_label?: string | null
  cta_url?: string | null
  dismissible?: boolean
  slug?: string | null
  append_utm?: boolean
}

export default function AnnouncementPreviewModal({
  announcement,
  onClose,
}: {
  announcement: PreviewAnnouncement
  onClose: () => void
}) {
  const ctaHref = announcement.cta_url
    ? (announcement.append_utm && announcement.slug
        ? `${announcement.cta_url}${announcement.cta_url.includes('?') ? '&' : '?'}utm_source=popup&utm_medium=banner&utm_campaign=${announcement.slug}`
        : announcement.cta_url)
    : null

  return (
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50" onClick={onClose}>
      <div
        className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Announcement preview"
      >
        <div className="bg-slate-100 text-slate-700 text-xs font-semibold px-4 py-2 text-center">
          Inline preview — not saved yet
        </div>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-10 right-3 min-h-11 min-w-11 p-2.5 inline-flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20"
          aria-label="Close preview"
        >
          <X size={18} />
        </button>
        {announcement.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={announcement.image_url} alt={announcement.title || 'Announcement preview'} className="w-full h-48 object-cover" />
        )}
        <div className="p-6">
          <h2 className="text-xl font-bold mb-2" style={{ color: '#1B3A5C' }}>{announcement.title || 'Untitled announcement'}</h2>
          {announcement.body && <p className="text-gray-600 text-sm mb-5 leading-relaxed">{announcement.body}</p>}
          {ctaHref && (
            <a
              href={ctaHref}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm text-white"
              style={{ backgroundColor: '#1B3A5C' }}
            >
              {announcement.cta_label || 'Learn More'}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
