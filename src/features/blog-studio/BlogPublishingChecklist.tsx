'use client'
import type { BlogPost } from './types'

type CheckItem = {
  label: string
  ok: boolean
  warn?: boolean
  tip: string
}

function buildChecklist(post: BlogPost): CheckItem[] {
  const hasCta = post.blocks.some((b) => ['cta', 'button_cta', 'service_callout'].includes(b.type) && b.enabled)
  const hasInternalLink = (post.relatedServiceIds?.length ?? 0) > 0 || (post.relatedInventoryIds?.length ?? 0) > 0
  const titleLen = (post.seo?.title ?? '').length
  const descLen = (post.seo?.description ?? '').length

  return [
    {
      label: 'Post title added',
      ok: !!post.title && post.title.length > 5,
      tip: 'Add a clear, specific post title.',
    },
    {
      label: 'Featured image added',
      ok: !!post.featuredImage?.url,
      tip: 'Add a photo — posts with images get more clicks.',
    },
    {
      label: 'Summary written',
      ok: !!post.excerpt && post.excerpt.length > 20,
      tip: 'The summary appears on the blog listing page.',
    },
    {
      label: 'Category selected',
      ok: !!post.category,
      tip: 'Choose the right category to help readers find this post.',
    },
    {
      label: 'SEO title added',
      ok: titleLen >= 30 && titleLen <= 65,
      warn: titleLen > 0 && (titleLen < 30 || titleLen > 65),
      tip: 'Keep your SEO title between 30 and 65 characters.',
    },
    {
      label: 'Meta description added',
      ok: descLen >= 120 && descLen <= 160,
      warn: descLen > 0 && (descLen < 120 || descLen > 160),
      tip: 'Write 120–160 characters describing this post for search engines.',
    },
    {
      label: 'Social sharing image set',
      ok: !!post.seo?.openGraphImage?.url || !!post.featuredImage?.url,
      warn: !post.seo?.openGraphImage?.url && !!post.featuredImage?.url,
      tip: 'A dedicated OG image improves how the post looks when shared.',
    },
    {
      label: 'Call to action included',
      ok: hasCta,
      tip: 'Add a CTA button or contact section to convert readers.',
    },
    {
      label: 'Internal link or related service added',
      ok: hasInternalLink,
      tip: 'Linking to related services helps SEO and drives service bookings.',
    },
    {
      label: 'At least one section of content',
      ok: post.blocks.filter((b) => b.enabled).length >= 2,
      tip: 'Add text, images, or video to make the post worth reading.',
    },
  ]
}

type Props = {
  post: BlogPost
  onPublish: () => void
  onCancel: () => void
  isPublishing: boolean
}

export default function BlogPublishingChecklist({ post, onPublish, onCancel, isPublishing }: Props) {
  const items = buildChecklist(post)
  const passed = items.filter((i) => i.ok).length
  const warnings = items.filter((i) => i.warn && !i.ok).length
  const failed = items.filter((i) => !i.ok && !i.warn).length
  const pct = Math.round((passed / items.length) * 100)

  const scoreColor = pct >= 80 ? 'text-green-600' : pct >= 50 ? 'text-amber-500' : 'text-red-500'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(4,14,33,0.75)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100" style={{ background: 'linear-gradient(135deg, #040e21, #0d2b55)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Ready to Publish?</h2>
              <p className="text-xs text-blue-200 mt-0.5">Review this checklist before your post goes live.</p>
            </div>
            {/* Score ring */}
            <div className="relative w-12 h-12 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" strokeWidth="3"
                  className={`stroke-current ${scoreColor}`}
                  strokeDasharray={`${pct} ${100 - pct}`}
                  strokeLinecap="round"
                />
              </svg>
              <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${scoreColor}`}>{pct}%</span>
            </div>
          </div>
        </div>

        {/* Checklist */}
        <div className="overflow-y-auto max-h-[55vh] px-6 py-4 space-y-1.5">
          {items.map((item, i) => {
            const icon = item.ok ? '✓' : item.warn ? '⚠' : '✗'
            const color = item.ok ? 'text-green-600' : item.warn ? 'text-amber-500' : 'text-red-500'
            const bg = item.ok ? 'bg-green-50 border-green-100' : item.warn ? 'bg-amber-50 border-amber-100' : 'bg-red-50/60 border-red-100'
            return (
              <div key={i} className={`flex items-start gap-3 px-3 py-2.5 rounded-xl border ${bg}`}>
                <span className={`font-bold text-sm mt-0.5 w-4 shrink-0 ${color}`}>{icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-bold ${color}`}>{item.label}</p>
                  {!item.ok && <p className="text-xs text-gray-500 mt-0.5">{item.tip}</p>}
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary + actions */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
          {(warnings > 0 || failed > 0) && (
            <p className="text-xs text-gray-500 mb-3">
              {failed > 0 && <span className="text-red-500 font-semibold">{failed} missing item{failed !== 1 ? 's' : ''}. </span>}
              {warnings > 0 && <span className="text-amber-500 font-semibold">{warnings} suggestion{warnings !== 1 ? 's' : ''}. </span>}
              You can still publish — these are recommended improvements.
            </p>
          )}
          {passed === items.length && (
            <p className="text-xs text-green-600 font-semibold mb-3">✓ All checks passed! Your post is ready to publish.</p>
          )}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={onPublish}
              disabled={isPublishing}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02] disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #1d4ed8, #0a2d7a)', boxShadow: '0 4px 16px rgba(29,78,216,0.3)' }}
            >
              {isPublishing ? 'Publishing…' : failed > 0 ? 'Publish Anyway' : 'Publish Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
