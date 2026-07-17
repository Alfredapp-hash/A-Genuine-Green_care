'use client'
import { useState } from 'react'
import type { SocialPlatformPost, SocialPlatform, SocialValidationWarning } from '../types'
import { PLATFORM_LABELS, PLATFORM_COLORS } from '../types'
import { CAPTION_GENERATORS, generateHashtags, type MinimalBlogPost } from '../captionGenerators'
import { PLATFORM_CHAR_LIMITS } from '../platformRules'
import { validatePost } from '../socialService'
import {
  FacebookPreviewCard, InstagramPreviewCard, LinkedInPreviewCard,
  YouTubePreviewCard, GoogleBusinessProfilePreviewCard, XPreviewCard,
} from './PlatformPreviews'

const PREVIEW_MAP: Record<SocialPlatform, React.ComponentType<{ post: SocialPlatformPost }>> = {
  facebook: FacebookPreviewCard,
  instagram: InstagramPreviewCard,
  linkedin: LinkedInPreviewCard,
  youtube: YouTubePreviewCard,
  google_business_profile: GoogleBusinessProfilePreviewCard,
  x: XPreviewCard,
  tiktok: FacebookPreviewCard,
  pinterest: FacebookPreviewCard,
  threads: InstagramPreviewCard,
}

const STATUS_PILL: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600',
  ready: 'bg-blue-100 text-blue-700',
  scheduled: 'bg-purple-100 text-purple-700',
  queued: 'bg-yellow-100 text-yellow-700',
  mock_posted: 'bg-teal-100 text-teal-700',
  posted_api: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-500',
  archived: 'bg-gray-100 text-gray-400',
}

const CTA_OPTIONS = [
  { value: '', label: 'No CTA' },
  { value: 'LEARN_MORE', label: 'Learn More' },
  { value: 'SHOP_NOW', label: 'Shop Now' },
  { value: 'BOOK_NOW', label: 'Book Now' },
  { value: 'CONTACT_US', label: 'Contact Us' },
  { value: 'CALL_NOW', label: 'Call Now' },
  { value: 'GET_DIRECTIONS', label: 'Get Directions' },
]

type Props = {
  post: SocialPlatformPost
  sourceBlogPost?: MinimalBlogPost
  onChange: (patch: Partial<SocialPlatformPost>) => void
  onMockPublish: () => Promise<void>
  onSchedule: (scheduledFor: string) => void
  onMarkPosted: (externalUrl?: string) => void
  onDelete?: () => void
}

export default function PlatformPostEditor({
  post, sourceBlogPost, onChange, onMockPublish, onSchedule, onMarkPosted, onDelete,
}: Props) {
  const [tab, setTab] = useState<'editor' | 'preview'>('editor')
  const [warnings, setWarnings] = useState<SocialValidationWarning[]>(post.validationWarnings ?? [])
  const [publishing, setPublishing] = useState(false)
  const [scheduleDate, setScheduleDate] = useState(post.scheduledFor ?? '')
  const [manualUrl, setManualUrl] = useState(post.externalPostUrl ?? '')
  const [hashtagInput, setHashtagInput] = useState((post.hashtags ?? []).join(', '))
  const [copied, setCopied] = useState<'caption' | 'url' | null>(null)

  const accent = PLATFORM_COLORS[post.platform]
  const charLimit = PLATFORM_CHAR_LIMITS[post.platform]
  const charCount = post.caption?.length ?? 0
  const overLimit = charCount > charLimit
  const PreviewCard = PREVIEW_MAP[post.platform]

  function handleValidate() {
    const result = validatePost(post)
    setWarnings(result.warnings)
    onChange({ validationWarnings: result.warnings })
  }

  async function handleMockPublish() {
    setPublishing(true)
    try { await onMockPublish() } finally { setPublishing(false) }
  }

  function applyCaption(style: string) {
    if (!sourceBlogPost) return
    const gen = CAPTION_GENERATORS[style]
    if (gen) onChange({ caption: gen(sourceBlogPost, post.platform) })
  }

  function applyHashtags() {
    if (!sourceBlogPost) return
    const tags = generateHashtags(sourceBlogPost, post.platform)
    setHashtagInput(tags.join(', '))
    onChange({ hashtags: tags })
  }

  function parseHashtags(raw: string): string[] {
    return raw.split(',').map((t) => {
      const clean = t.trim()
      return clean.startsWith('#') ? clean : `#${clean}`
    }).filter(Boolean)
  }

  function copyToClipboard(text: string, type: 'caption' | 'url') {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 flex items-center justify-between border-b border-gray-100" style={{ background: accent + '0f' }}>
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accent }} />
          <span className="font-bold text-sm" style={{ color: accent }}>{PLATFORM_LABELS[post.platform]}</span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_PILL[post.status] ?? 'bg-gray-100 text-gray-500'}`}>
            {post.status.replace(/_/g, ' ')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab('editor')}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${tab === 'editor' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
          >Editor</button>
          <button
            onClick={() => setTab('preview')}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${tab === 'preview' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
          >Preview</button>
          {onDelete && (
            <button onClick={onDelete} className="text-xs text-red-400 hover:text-red-600 ml-2 transition-colors">Remove</button>
          )}
        </div>
      </div>

      <div className="p-5 space-y-4">
        {tab === 'preview' ? (
          <PreviewCard post={post} />
        ) : (
          <>
            {/* Caption */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Caption {post.platform === 'google_business_profile' ? '/ Update Text' : ''}
                </label>
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs font-mono ${overLimit ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                    {charCount}/{charLimit}
                  </span>
                  {post.caption && (
                    <button onClick={() => copyToClipboard(post.caption, 'caption')} className="text-xs text-blue-500 hover:text-blue-700">
                      {copied === 'caption' ? '✓ Copied' : 'Copy'}
                    </button>
                  )}
                </div>
              </div>
              <textarea
                rows={4}
                value={post.caption}
                onChange={(e) => onChange({ caption: e.target.value })}
                className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 resize-none ${overLimit ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-100'}`}
                placeholder="Write your caption..."
              />
            </div>

            {/* Caption generator buttons */}
            {sourceBlogPost && (
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Generate Caption</p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    ['default', 'Default'], ['professional', 'Professional'], ['friendly', 'Friendly'],
                    ['short', 'Short'], ['service', 'Curriculum Focused'], ['inventory', 'Enrollment Focused'],
                    ['local_seo', 'Local SEO'], ['seasonal', 'Seasonal'],
                  ].map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => applyCaption(key)}
                      className="text-xs px-2.5 py-1 rounded-lg border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Title (YouTube, LinkedIn) */}
            {(post.platform === 'youtube' || post.platform === 'linkedin') && (
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                  {post.platform === 'youtube' ? 'Video Title *' : 'Post Title'}
                </label>
                <input
                  type="text"
                  value={post.title ?? ''}
                  onChange={(e) => onChange({ title: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder={post.platform === 'youtube' ? 'Video title (required)' : 'Optional post title'}
                />
              </div>
            )}

            {/* Hashtags */}
            {post.platform !== 'google_business_profile' && post.platform !== 'youtube' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Hashtags</label>
                  {sourceBlogPost && (
                    <button onClick={applyHashtags} className="text-xs text-blue-500 hover:text-blue-700">Generate</button>
                  )}
                </div>
                <input
                  type="text"
                  value={hashtagInput}
                  onChange={(e) => {
                    setHashtagInput(e.target.value)
                    onChange({ hashtags: parseHashtags(e.target.value) })
                  }}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="#SaltwaterSprouts, #EarlyChildhood, #PlayBasedLearning"
                />
              </div>
            )}

            {/* Image URL */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                Image URL {post.platform === 'instagram' ? '*' : ''}{post.platform === 'youtube' ? ' (Thumbnail)' : ''}
              </label>
              <input
                type="url"
                value={post.image?.url ?? ''}
                onChange={(e) => onChange({ image: e.target.value ? { url: e.target.value } : undefined })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="https://saltwatersprouts.com/images/..."
              />
              {/* TODO: Wire to MediaLibrary picker */}
            </div>

            {/* Tracked URL */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Tracked URL (UTM)</label>
                {post.trackedUrl && (
                  <button onClick={() => copyToClipboard(post.trackedUrl!, 'url')} className="text-xs text-blue-500 hover:text-blue-700">
                    {copied === 'url' ? '✓ Copied' : 'Copy'}
                  </button>
                )}
              </div>
              <input
                type="url"
                value={post.trackedUrl ?? ''}
                onChange={(e) => onChange({ trackedUrl: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="https://saltwatersprouts.com/blog/...?utm_source=..."
              />
            </div>

            {/* CTA */}
            {post.platform !== 'instagram' && post.platform !== 'x' && (
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">CTA Type</label>
                <select
                  value={post.ctaType ?? ''}
                  onChange={(e) => onChange({ ctaType: e.target.value || undefined })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  {CTA_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            )}

            {/* Schedule */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Schedule For</label>
              <div className="flex gap-2">
                <input
                  type="datetime-local"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                <button
                  onClick={() => scheduleDate && onSchedule(new Date(scheduleDate).toISOString())}
                  disabled={!scheduleDate}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-colors"
                  style={{ backgroundColor: '#7c3aed' }}
                >
                  Schedule
                </button>
              </div>
            </div>

            {/* Validation warnings */}
            {warnings.length > 0 && (
              <div className="space-y-1.5">
                {warnings.map((w) => (
                  <div
                    key={w.id}
                    className={`flex items-start gap-2 px-3 py-2 rounded-lg text-xs ${
                      w.severity === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
                      w.severity === 'warning' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                      'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    <span className="shrink-0 mt-0.5">
                      {w.severity === 'error' ? '✗' : w.severity === 'warning' ? '⚠' : 'ℹ'}
                    </span>
                    <span>{w.message}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Post status info */}
            {(post.externalPostId || post.postedAt || post.errorMessage) && (
              <div className="bg-gray-50 rounded-xl p-3 text-xs space-y-1 border border-gray-200">
                {post.externalPostId && <p className="text-gray-500">External ID: <span className="font-mono text-gray-700">{post.externalPostId}</span></p>}
                {post.postedAt && <p className="text-gray-500">Posted: {new Date(post.postedAt).toLocaleString()}</p>}
                {post.externalPostUrl && (
                  <p className="text-gray-500">Post URL: <a href={post.externalPostUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{post.externalPostUrl}</a></p>
                )}
                {post.errorMessage && <p className="text-red-600">Error: {post.errorMessage}</p>}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={handleValidate}
                className="text-xs px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold transition-colors"
              >
                Validate
              </button>
              <button
                onClick={handleMockPublish}
                disabled={publishing || post.status === 'mock_posted' || post.status === 'posted_api'}
                className="text-xs px-3 py-2 rounded-lg font-semibold text-white disabled:opacity-40 transition-colors"
                style={{ backgroundColor: '#0d4f3c' }}
              >
                {publishing ? 'Publishing…' : 'Mock Publish'}
              </button>
              <div className="flex items-center gap-1.5 flex-1 min-w-[220px]">
                <input
                  type="url"
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  placeholder="External post URL (optional)"
                  className="flex-1 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-200"
                />
                <button
                  onClick={() => onMarkPosted(manualUrl || undefined)}
                  className="text-xs px-3 py-1.5 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors whitespace-nowrap"
                >
                  Mark Posted
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
