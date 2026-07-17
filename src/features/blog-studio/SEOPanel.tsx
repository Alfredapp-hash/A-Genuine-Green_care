'use client'
import type { SEOSettings, BlogPost } from './types'

type Props = { seo: SEOSettings; post: BlogPost; onChange: (s: SEOSettings) => void }

type CheckItem = { ok: boolean; label: string; warn?: boolean }

function Check({ ok, label, warn }: CheckItem) {
  const color = ok ? 'text-green-600' : warn ? 'text-yellow-600' : 'text-red-500'
  const icon = ok ? '✓' : warn ? '⚠' : '✗'
  return (
    <div className={`flex items-center gap-2 text-xs py-0.5 ${color}`}>
      <span className="font-bold w-3.5">{icon}</span>
      <span>{label}</span>
    </div>
  )
}

function seoScore(checks: CheckItem[]): { pct: number; label: string; bg: string; ring: string; text: string } {
  const passed = checks.filter((c) => c.ok).length
  const pct = Math.round((passed / checks.length) * 100)
  if (pct >= 80) return { pct, label: 'Good', bg: 'bg-green-500', ring: 'ring-green-200', text: 'text-green-700' }
  if (pct >= 50) return { pct, label: 'Fair', bg: 'bg-yellow-400', ring: 'ring-yellow-200', text: 'text-yellow-700' }
  return { pct, label: 'Low', bg: 'bg-red-500', ring: 'ring-red-200', text: 'text-red-600' }
}

export default function SEOPanel({ seo, post, onChange }: Props) {
  const set = (patch: Partial<SEOSettings>) => onChange({ ...seo, ...patch })

  const descLen = (seo.description ?? '').length
  const titleLen = (seo.title ?? '').length

  const checks: CheckItem[] = [
    { ok: titleLen >= 30 && titleLen <= 65, label: 'SEO title (30–65 chars)', warn: titleLen > 0 && (titleLen < 30 || titleLen > 65) },
    { ok: descLen >= 120 && descLen <= 160, label: 'Meta description (120–160 chars)', warn: descLen > 0 && (descLen < 120 || descLen > 160) },
    { ok: !!post.slug, label: 'URL slug set' },
    { ok: !!post.excerpt, label: 'Excerpt / summary set' },
    { ok: !!post.category, label: 'Category assigned' },
    { ok: !!post.featuredImage?.alt, label: 'Featured image has alt text' },
    { ok: (post.relatedServiceIds?.length ?? 0) > 0, label: 'Has related service link' },
    { ok: !!seo.openGraphImage?.url || !!post.featuredImage?.url, label: 'OG / share image set' },
    { ok: !seo.enableFaqSchema || post.blocks.some((b) => b.type === 'faq'), label: 'FAQ block (for FAQ schema)', warn: seo.enableFaqSchema && !post.blocks.some((b) => b.type === 'faq') },
  ]

  const score = seoScore(checks)
  const ogImageUrl = seo.openGraphImage?.url ?? post.featuredImage?.url ?? ''
  const previewTitle = seo.title ?? post.title
  const previewDesc = seo.description ?? post.excerpt
  const previewDomain = 'thomasmarinellc.com'

  return (
    <div className="space-y-5">
      {/* Score badge */}
      <div className={`flex items-center gap-4 p-4 rounded-2xl border bg-white ring-2 ${score.ring}`}>
        <div className="relative w-14 h-14 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="w-14 h-14 -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3" />
            <circle cx="18" cy="18" r="15.9" fill="none" strokeWidth="3"
              className={score.bg.replace('bg-', 'stroke-')}
              strokeDasharray={`${score.pct} ${100 - score.pct}`}
              strokeLinecap="round"
            />
          </svg>
          <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${score.text}`}>{score.pct}%</span>
        </div>
        <div>
          <p className={`text-lg font-bold ${score.text}`}>SEO Health: {score.label}</p>
          <p className="text-xs text-gray-400">{checks.filter((c) => c.ok).length} of {checks.length} checks passed</p>
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Checklist</p>
        {checks.map((c, i) => <Check key={i} {...c} />)}
      </div>

      {/* Fields */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">SEO Title</label>
        <input className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${titleLen > 65 ? 'border-red-300' : 'border-gray-200'}`}
          value={seo.title ?? ''} onChange={(e) => set({ title: e.target.value })}
          placeholder="SEO page title (30–65 chars)" maxLength={80}
        />
        <p className={`text-xs mt-0.5 ${titleLen > 65 ? 'text-red-500' : titleLen >= 30 ? 'text-green-600' : 'text-gray-400'}`}>{titleLen} / 65 chars</p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Meta Description</label>
        <textarea rows={3} className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none ${descLen > 160 ? 'border-red-300' : 'border-gray-200'}`}
          value={seo.description ?? ''} onChange={(e) => set({ description: e.target.value })}
          placeholder="Meta description (120–160 chars)" maxLength={200}
        />
        <p className={`text-xs mt-0.5 ${descLen > 160 ? 'text-red-500' : descLen >= 120 ? 'text-green-600' : 'text-gray-400'}`}>{descLen} / 160 chars</p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Primary Keyword</label>
        <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          value={seo.primaryKeyword ?? ''} onChange={(e) => set({ primaryKeyword: e.target.value })}
          placeholder="e.g. Suzuki outboard service Georgetown SC"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Local SEO Phrase</label>
        <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          value={seo.localSeoPhrase ?? ''} onChange={(e) => set({ localSeoPhrase: e.target.value })}
          placeholder="Georgetown, SC"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Open Graph Image URL <span className="font-normal text-gray-400">(overrides featured image for social shares)</span></label>
        <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          value={seo.openGraphImage?.url ?? ''} onChange={(e) => set({ openGraphImage: e.target.value ? { id: 'og', url: e.target.value, alt: previewTitle } : undefined })}
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Canonical URL <span className="font-normal text-gray-400">(optional)</span></label>
        <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          value={seo.canonicalUrl ?? ''} onChange={(e) => set({ canonicalUrl: e.target.value })}
          placeholder="https://thomasmarinellc.com/blog/..."
        />
      </div>

      {/* Social preview card */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Social Preview</p>
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
          {ogImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={ogImageUrl} alt="OG preview" className="w-full h-32 object-cover" />
          ) : (
            <div className="w-full h-32 flex items-center justify-center text-xs text-gray-400" style={{ backgroundColor: '#f0f4f8' }}>No image set</div>
          )}
          <div className="p-3">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">{previewDomain}</p>
            <p className="text-sm font-bold text-gray-900 line-clamp-1">{previewTitle || 'Post title will appear here'}</p>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{previewDesc || 'Meta description will appear here...'}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-1">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={seo.enableArticleSchema ?? false} onChange={(e) => set({ enableArticleSchema: e.target.checked })} className="accent-blue-600" />
          <span className="text-sm text-gray-700">Enable Article schema markup</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={seo.enableFaqSchema ?? false} onChange={(e) => set({ enableFaqSchema: e.target.checked })} className="accent-blue-600" />
          <span className="text-sm text-gray-700">Enable FAQ schema markup</span>
        </label>
      </div>
    </div>
  )
}
