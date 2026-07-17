'use client'
import { useState, useCallback, useMemo } from 'react'
import type { SocialCampaign, SocialPlatform, SocialPlatformPost } from '../types'
import { PLATFORM_LABELS, PLATFORM_COLORS } from '../types'
import {
  updateSocialCampaign, updatePlatformPost, createPlatformPost,
  deletePlatformPost, mockPublishPlatformPost, schedulePlatformPost,
  markPlatformPostAsManuallyPosted, duplicateSocialCampaign, archiveSocialCampaign,
} from '../socialStore'
import { validateCampaign } from '../socialService'
import { generateDefaultCaption, generateHashtags } from '../captionGenerators'
import { buildTrackedUrl } from '../utm'
import { META_AD_CHAR_LIMITS } from '../platformRules'
import { META_AD_COPY_TEMPLATES, type MetaAdCopyTemplate } from '../adCopyTemplates'
import PlatformPostEditor from './PlatformPostEditor'

// TODO: connect Supabase — CanvaDesignPicker stubbed out
type CanvaDesignPickerProps = { defaultAlt?: string; returnTo?: string; onImport: (asset: { url: string; alt: string }) => void }
function CanvaDesignPicker({ onImport }: CanvaDesignPickerProps) {
  return (
    <div className="p-8 text-center text-gray-400 text-sm">
      <p>Canva integration not yet configured.</p>
      <p className="text-xs mt-1">Connect Canva in Settings to import designs.</p>
    </div>
  )
}

const ALL_PLATFORMS: SocialPlatform[] = ['facebook', 'instagram', 'linkedin', 'youtube', 'google_business_profile', 'x']

function CharCount({ value, limit }: { value: string; limit: number }) {
  const len = value.length
  const over = len > limit
  return (
    <span className={`text-xs font-mono ${over ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
      {len}/{limit}
    </span>
  )
}

const CAMPAIGN_STATUS_PILL: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600',
  ready: 'bg-blue-100 text-blue-700',
  scheduled: 'bg-purple-100 text-purple-700',
  partially_posted: 'bg-yellow-100 text-yellow-700',
  posted: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  archived: 'bg-gray-100 text-gray-400',
}

type Props = {
  initialCampaign: SocialCampaign
  onBack?: () => void
}

export default function SocialCampaignEditor({ initialCampaign, onBack }: Props) {
  const [campaign, setCampaign] = useState<SocialCampaign>(initialCampaign)
  const [saved, setSaved] = useState(false)
  const [validating, setValidating] = useState(false)
  const [validationSummary, setValidationSummary] = useState<{ errors: number; warnings: number } | null>(null)
  const [showCanvaPicker, setShowCanvaPicker] = useState(false)

  const refresh = useCallback(() => {
    import('../socialStore').then(({ getSocialCampaignById }) => {
      const fresh = getSocialCampaignById(campaign.id)
      if (fresh) setCampaign({ ...fresh })
    })
  }, [campaign.id])

  function handleSaveName(name: string) {
    updateSocialCampaign(campaign.id, { campaignName: name })
    setCampaign((c) => ({ ...c, campaignName: name }))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleAddPlatform(platform: SocialPlatform) {
    const existing = campaign.platformPosts.find((p) => p.platform === platform)
    if (existing) return
    const post = createPlatformPost(campaign.id, platform)
    const sourceBlog = {
      title: campaign.sourceTitle,
      excerpt: campaign.sourceExcerpt,
      slug: campaign.sourceUrl.replace('/blog/', ''),
    }
    const caption = generateDefaultCaption(sourceBlog, platform)
    const hashtags = generateHashtags(sourceBlog, platform)
    const trackedUrl = buildTrackedUrl(
      `https://saltwatersprouts.com${campaign.sourceUrl}`,
      platform,
      { ...campaign.utm, source: platform },
    )
    updatePlatformPost(campaign.id, post.id, { caption, hashtags, trackedUrl, link: campaign.sourceUrl })
    refresh()
  }

  function handleRemovePlatform(platformPostId: string) {
    if (!confirm('Remove this platform post?')) return
    deletePlatformPost(campaign.id, platformPostId)
    refresh()
  }

  function handlePostChange(platformPostId: string, patch: Partial<SocialPlatformPost>) {
    updatePlatformPost(campaign.id, platformPostId, patch)
    setCampaign((c) => ({
      ...c,
      platformPosts: c.platformPosts.map((p) => p.id === platformPostId ? { ...p, ...patch } : p),
    }))
  }

  async function handleMockPublish(platformPostId: string) {
    await mockPublishPlatformPost(campaign.id, platformPostId)
    refresh()
  }

  function handleSchedule(platformPostId: string, scheduledFor: string) {
    schedulePlatformPost(campaign.id, platformPostId, scheduledFor)
    refresh()
  }

  function handleMarkPosted(platformPostId: string, externalUrl?: string) {
    markPlatformPostAsManuallyPosted(campaign.id, platformPostId, externalUrl)
    refresh()
  }

  async function handleValidateAll() {
    setValidating(true)
    const results = validateCampaign(campaign.id)
    let errors = 0, warnings = 0
    results.forEach((r) => {
      errors += r.warnings.filter((w) => w.severity === 'error').length
      warnings += r.warnings.filter((w) => w.severity === 'warning').length
      updatePlatformPost(campaign.id, r.platformPostId, { validationWarnings: r.warnings })
    })
    setValidationSummary({ errors, warnings })
    setValidating(false)
    refresh()
  }

  function handleGenerateDrafts() {
    const sourceBlog = { title: campaign.sourceTitle, excerpt: campaign.sourceExcerpt, slug: campaign.sourceUrl.replace('/blog/', '') }
    campaign.platformPosts.forEach((post) => {
      if (post.caption) return
      const caption = generateDefaultCaption(sourceBlog, post.platform)
      const hashtags = generateHashtags(sourceBlog, post.platform)
      updatePlatformPost(campaign.id, post.id, { caption, hashtags })
    })
    refresh()
  }

  function handleDuplicate() {
    const copy = duplicateSocialCampaign(campaign.id)
    if (copy) {
      setCampaign(copy)
      alert(`Duplicated as "${copy.campaignName}"`)
    }
  }

  function handleArchive() {
    if (!confirm('Archive this campaign?')) return
    archiveSocialCampaign(campaign.id)
    refresh()
    if (onBack) onBack()
  }

  function handleCanvaImport(asset: { url: string; alt: string }) {
    const media = { url: asset.url, alt: asset.alt }
    updateSocialCampaign(campaign.id, { sourceImage: media })
    campaign.platformPosts.forEach((post) => {
      updatePlatformPost(campaign.id, post.id, { image: media })
    })
    setCampaign((c) => ({
      ...c,
      sourceImage: media,
      platformPosts: c.platformPosts.map((p) => ({ ...p, image: media })),
    }))
    setShowCanvaPicker(false)
  }

  const baseUrl = `https://saltwatersprouts.com${campaign.sourceUrl}`

  const utmPreviewUrls = useMemo(() => {
    const platforms = campaign.platformPosts.length > 0
      ? campaign.platformPosts.map((p) => p.platform)
      : ALL_PLATFORMS
    return platforms.map((platform) => ({
      platform,
      url: buildTrackedUrl(baseUrl, platform, { ...campaign.utm, source: platform }),
    }))
  }, [campaign.platformPosts, campaign.utm, baseUrl])

  const facebookPost = campaign.platformPosts.find((p) => p.platform === 'facebook')

  function rebuildTrackedUrls(utmCampaign: string) {
    const utm = { ...campaign.utm, campaign: utmCampaign }
    updateSocialCampaign(campaign.id, { utm })
    setCampaign((c) => ({ ...c, utm }))
    campaign.platformPosts.forEach((post) => {
      const trackedUrl = buildTrackedUrl(baseUrl, post.platform, { ...utm, source: post.platform })
      updatePlatformPost(campaign.id, post.id, { trackedUrl })
    })
    setCampaign((c) => ({
      ...c,
      utm,
      platformPosts: c.platformPosts.map((p) => ({
        ...p,
        trackedUrl: buildTrackedUrl(baseUrl, p.platform, { ...utm, source: p.platform }),
      })),
    }))
  }

  function applyAdTemplate(template: MetaAdCopyTemplate) {
    let fbPost = facebookPost
    if (!fbPost) {
      fbPost = createPlatformPost(campaign.id, 'facebook')
      setCampaign((c) => ({ ...c, platformPosts: [...c.platformPosts, fbPost!] }))
    }
    updatePlatformPost(campaign.id, fbPost.id, {
      caption: template.primaryText,
      title: template.headline,
      description: template.description,
      ctaType: template.suggestedCta,
      link: campaign.sourceUrl,
    })
    rebuildTrackedUrls(template.defaultUtmCampaignSlug)
    refresh()
  }

  function handleMetaFieldChange(field: 'caption' | 'title' | 'description', value: string) {
    if (!facebookPost) return
    handlePostChange(facebookPost.id, { [field]: value })
  }

  const activePlatforms = campaign.platformPosts.map((p) => p.platform)
  const sourceBlog = {
    title: campaign.sourceTitle,
    excerpt: campaign.sourceExcerpt,
    slug: campaign.sourceUrl.replace('/blog/', ''),
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0f4f8' }}>
      {/* Header */}
      <div className="px-8 py-5 border-b border-white/10" style={{ background: 'linear-gradient(135deg, #0a3d2e 0%, #1a6b4f 100%)' }}>
        <div className="max-w-6xl mx-auto">
          {onBack && (
            <button onClick={onBack} className="text-xs text-green-300 hover:text-white mb-3 flex items-center gap-1 transition-colors">
              ← Back to Campaigns
            </button>
          )}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xl">📢</span>
                <input
                  className="text-xl font-bold text-white bg-transparent border-none outline-none focus:bg-white/10 rounded px-2 -mx-2 flex-1 min-w-0"
                  value={campaign.campaignName}
                  onChange={(e) => setCampaign((c) => ({ ...c, campaignName: e.target.value }))}
                  onBlur={(e) => handleSaveName(e.target.value)}
                />
                {saved && <span className="text-xs text-green-400">Saved ✓</span>}
              </div>
              <div className="flex flex-wrap items-center gap-3 ml-8 mt-1">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CAMPAIGN_STATUS_PILL[campaign.campaignStatus] ?? 'bg-gray-100 text-gray-500'}`}>
                  {campaign.campaignStatus.replace(/_/g, ' ')}
                </span>
                <span className="text-xs text-green-200">
                  Source: <span className="text-white font-medium">{campaign.sourceTitle}</span>
                </span>
                <span className="text-xs text-green-300">{campaign.sourceUrl}</span>
              </div>
              <div className="ml-8 mt-1 text-xs text-green-300">
                Created {new Date(campaign.createdAt).toLocaleDateString()} · Updated {new Date(campaign.updatedAt).toLocaleDateString()}
              </div>
            </div>
            {/* Top actions */}
            <div className="flex flex-wrap gap-2">
              <button onClick={handleGenerateDrafts} className="text-xs px-3 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 font-semibold transition-colors">
                Generate Drafts
              </button>
              <button onClick={handleValidateAll} disabled={validating} className="text-xs px-3 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 font-semibold transition-colors">
                {validating ? 'Validating…' : 'Validate All'}
              </button>
              <button onClick={handleDuplicate} className="text-xs px-3 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 font-semibold transition-colors">
                Duplicate
              </button>
              <button onClick={handleArchive} className="text-xs px-3 py-2 rounded-lg bg-red-500/20 text-red-200 hover:bg-red-500/30 font-semibold transition-colors">
                Archive
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-6 space-y-6">
        {/* Validation summary */}
        {validationSummary && (
          <div className={`rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-3 ${
            validationSummary.errors > 0 ? 'bg-red-50 border border-red-200 text-red-700' :
            validationSummary.warnings > 0 ? 'bg-yellow-50 border border-yellow-200 text-yellow-700' :
            'bg-green-50 border border-green-200 text-green-700'
          }`}>
            {validationSummary.errors > 0
              ? `✗ ${validationSummary.errors} error${validationSummary.errors > 1 ? 's' : ''} found — fix before publishing`
              : validationSummary.warnings > 0
              ? `⚠ ${validationSummary.warnings} warning${validationSummary.warnings > 1 ? 's' : ''} — review recommended`
              : '✓ All posts passed validation'}
            <button onClick={() => setValidationSummary(null)} className="ml-auto text-xs opacity-60 hover:opacity-100">Dismiss</button>
          </div>
        )}

        {/* Source post info */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Source Blog Post</h2>
            <button
              type="button"
              onClick={() => setShowCanvaPicker(true)}
              className="text-xs px-3 py-1.5 rounded-lg font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #0a3d2e)' }}
            >
              Import from Canva
            </button>
          </div>
          <div className="flex items-start gap-4">
            {campaign.sourceImage && (
              <img src={campaign.sourceImage.url} alt={campaign.sourceImage.alt ?? ''} className="w-20 h-20 rounded-xl object-cover border border-gray-100 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 mb-1">{campaign.sourceTitle}</p>
              {campaign.sourceExcerpt && <p className="text-sm text-gray-500 line-clamp-2">{campaign.sourceExcerpt}</p>}
              <div className="flex items-center gap-3 mt-2">
                <a href={campaign.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">{campaign.sourceUrl}</a>
                <a href={`/admin/blog-studio`} className="text-xs text-gray-400 hover:text-gray-600">← Blog Studio</a>
              </div>
            </div>
          </div>
        </div>

        {/* Meta ad copy templates */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Meta / Facebook Ad Copy</h2>
            <div className="flex items-center gap-2">
              <label htmlFor="ad-template-select" className="text-xs font-semibold text-gray-500">Use Ad Template</label>
              <select
                id="ad-template-select"
                defaultValue=""
                onChange={(e) => {
                  const tpl = META_AD_COPY_TEMPLATES.find((t) => t.id === e.target.value)
                  if (tpl) applyAdTemplate(tpl)
                  e.target.value = ''
                }}
                className="text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 min-w-[180px]"
              >
                <option value="" disabled>Select template…</option>
                {META_AD_COPY_TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          {facebookPost ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Primary Text</label>
                  <CharCount value={facebookPost.caption ?? ''} limit={META_AD_CHAR_LIMITS.primaryText} />
                </div>
                <textarea
                  rows={3}
                  value={facebookPost.caption ?? ''}
                  onChange={(e) => handleMetaFieldChange('caption', e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 resize-none ${
                    (facebookPost.caption?.length ?? 0) > META_AD_CHAR_LIMITS.primaryText
                      ? 'border-red-300 focus:ring-red-200'
                      : 'border-gray-200 focus:ring-blue-100'
                  }`}
                  placeholder="Primary ad text (125 char recommended)…"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Headline</label>
                    <CharCount value={facebookPost.title ?? ''} limit={META_AD_CHAR_LIMITS.headline} />
                  </div>
                  <input
                    type="text"
                    value={facebookPost.title ?? ''}
                    onChange={(e) => handleMetaFieldChange('title', e.target.value)}
                    className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                      (facebookPost.title?.length ?? 0) > META_AD_CHAR_LIMITS.headline
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-gray-200 focus:ring-blue-100'
                    }`}
                    placeholder="Ad headline (40 char max)…"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Link Description</label>
                    <CharCount value={facebookPost.description ?? ''} limit={META_AD_CHAR_LIMITS.linkDescription} />
                  </div>
                  <input
                    type="text"
                    value={facebookPost.description ?? ''}
                    onChange={(e) => handleMetaFieldChange('description', e.target.value)}
                    className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                      (facebookPost.description?.length ?? 0) > META_AD_CHAR_LIMITS.linkDescription
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-gray-200 focus:ring-blue-100'
                    }`}
                    placeholder="Link description (30 char max)…"
                  />
                </div>
              </div>
              {facebookPost.ctaType && (
                <p className="text-xs text-gray-500">
                  Suggested CTA: <span className="font-semibold text-gray-700">{facebookPost.ctaType.replace(/_/g, ' ')}</span>
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-400">
              Select an ad template above to auto-add Facebook and pre-fill Meta ad fields, or add Facebook from the platform list below.
            </p>
          )}
        </div>

        {/* UTM preview */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100" style={{ backgroundColor: '#f8fafc' }}>
            <h2 className="text-sm font-bold text-gray-700">UTM Tracking Preview</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Campaign slug: <span className="font-mono text-gray-600">{campaign.utm.campaign}</span>
              {' · '}medium: {campaign.utm.medium}
            </p>
          </div>
          <div className="divide-y divide-gray-50">
            {utmPreviewUrls.map(({ platform, url }) => (
              <div key={platform} className="px-5 py-3 flex flex-wrap items-start gap-3">
                <span
                  className="text-xs font-bold shrink-0 px-2 py-1 rounded-lg"
                  style={{ color: PLATFORM_COLORS[platform], backgroundColor: PLATFORM_COLORS[platform] + '15' }}
                >
                  {PLATFORM_LABELS[platform]}
                </span>
                <code className="text-xs text-gray-600 font-mono break-all flex-1 min-w-0">{url}</code>
              </div>
            ))}
          </div>
        </div>

        {/* Platform selector */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Add Platforms</h2>
          <div className="flex flex-wrap gap-2">
            {ALL_PLATFORMS.map((platform) => {
              const active = activePlatforms.includes(platform)
              const color = PLATFORM_COLORS[platform]
              return (
                <button
                  key={platform}
                  onClick={() => !active && handleAddPlatform(platform)}
                  disabled={active}
                  className={`text-xs px-3 py-2 rounded-xl font-semibold border transition-all ${
                    active
                      ? 'text-white border-transparent cursor-default'
                      : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50'
                  }`}
                  style={active ? { backgroundColor: color, borderColor: color } : {}}
                >
                  {active ? `✓ ${PLATFORM_LABELS[platform]}` : `+ ${PLATFORM_LABELS[platform]}`}
                </button>
              )
            })}
          </div>
        </div>

        {/* Platform editors */}
        {campaign.platformPosts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-16 text-center">
            <p className="text-gray-400 text-sm">No platforms added yet. Select platforms above to start building posts.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-5">
            {campaign.platformPosts.map((post) => (
              <PlatformPostEditor
                key={post.id}
                post={post}
                sourceBlogPost={sourceBlog}
                onChange={(patch) => handlePostChange(post.id, patch)}
                onMockPublish={() => handleMockPublish(post.id)}
                onSchedule={(scheduledFor) => handleSchedule(post.id, scheduledFor)}
                onMarkPosted={(url) => handleMarkPosted(post.id, url)}
                onDelete={() => handleRemovePlatform(post.id)}
              />
            ))}
          </div>
        )}

        {/* Campaign history / post log */}
        {campaign.platformPosts.some((p) => p.postedAt || p.scheduledFor || p.errorMessage) && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100" style={{ backgroundColor: '#f8fafc' }}>
              <h2 className="text-sm font-bold text-gray-700">Post History</h2>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 uppercase tracking-wider">
                  <th className="text-left px-5 py-2.5 font-semibold">Platform</th>
                  <th className="text-left px-4 py-2.5 font-semibold">Status</th>
                  <th className="text-left px-4 py-2.5 font-semibold hidden md:table-cell">Scheduled</th>
                  <th className="text-left px-4 py-2.5 font-semibold hidden md:table-cell">Posted</th>
                  <th className="text-left px-4 py-2.5 font-semibold">Link</th>
                  <th className="text-left px-4 py-2.5 font-semibold">Error</th>
                </tr>
              </thead>
              <tbody>
                {campaign.platformPosts.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-5 py-3 font-semibold" style={{ color: PLATFORM_COLORS[p.platform] }}>
                      {PLATFORM_LABELS[p.platform]}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        p.status === 'mock_posted' || p.status === 'posted_api' ? 'bg-green-100 text-green-700' :
                        p.status === 'failed' ? 'bg-red-100 text-red-700' :
                        p.status === 'scheduled' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>{p.status.replace(/_/g, ' ')}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-400">
                      {p.scheduledFor ? new Date(p.scheduledFor).toLocaleString() : '—'}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-400">
                      {p.postedAt ? new Date(p.postedAt).toLocaleString() : '—'}
                    </td>
                    <td className="px-4 py-3">
                      {p.externalPostUrl
                        ? <a href={p.externalPostUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View</a>
                        : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-red-500 max-w-[120px] truncate">
                      {p.errorMessage ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCanvaPicker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={(e) => e.target === e.currentTarget && setShowCanvaPicker(false)}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="font-bold text-gray-900">Import from Canva</h2>
                <p className="text-xs text-gray-400 mt-0.5">Export a design and apply it as the campaign image</p>
              </div>
              <button type="button" onClick={() => setShowCanvaPicker(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none" aria-label="Close">
                ✕
              </button>
            </div>
            <CanvaDesignPicker
              defaultAlt={campaign.sourceTitle}
              returnTo="/admin/social"
              onImport={handleCanvaImport}
            />
          </div>
        </div>
      )}
    </div>
  )
}
