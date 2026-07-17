'use client'
// ─────────────────────────────────────────────────────────────────────────────
// Promote Blog Post page — create social campaigns from a blog post
// TODO: Load real blog post data from Supabase or Blog Studio store.
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { SocialPlatform, SocialCampaign } from './types'
import { PLATFORM_LABELS, PLATFORM_COLORS } from './types'
import {
  getSocialCampaignsByBlogPostId,
  createSocialCampaignFromBlogPost,
  type MinimalBlogPostForCampaign,
} from './socialStore'

const ALL_PLATFORMS: SocialPlatform[] = ['facebook', 'instagram', 'linkedin', 'youtube', 'google_business_profile', 'x']

type Props = {
  blogPost: MinimalBlogPostForCampaign
}

export default function PromoteBlogPostPage({ blogPost }: Props) {
  const router = useRouter()
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>(['facebook', 'google_business_profile'])
  const [existing, setExisting] = useState<SocialCampaign[]>(() => getSocialCampaignsByBlogPostId(blogPost.id))
  const [creating, setCreating] = useState(false)

  function togglePlatform(platform: SocialPlatform) {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    )
  }

  function handleCreate() {
    if (selectedPlatforms.length === 0) {
      alert('Select at least one platform.')
      return
    }
    setCreating(true)
    const campaign = createSocialCampaignFromBlogPost(blogPost, selectedPlatforms)
    setExisting(getSocialCampaignsByBlogPostId(blogPost.id))
    setCreating(false)
    router.push(`/admin/social/campaigns/${campaign.id}`)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0f4f8' }}>
      {/* Header */}
      <div className="px-8 py-6 border-b" style={{ background: 'linear-gradient(135deg, #0a3d2e 0%, #1a6b4f 100%)' }}>
        <div className="max-w-3xl mx-auto">
          <Link href="/admin/blog-studio" className="text-xs text-green-300 hover:text-white mb-3 flex items-center gap-1 transition-colors">
            ← Blog Studio
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-2xl">📣</span>
            <h1 className="text-2xl font-bold text-white">Promote This Post</h1>
          </div>
          <p className="text-sm text-green-200 ml-11 mt-1">Create social media campaigns from this blog post</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-6 space-y-6">
        {/* Post preview card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Blog Post</h2>
          <div className="flex items-start gap-4">
            {blogPost.featuredImage?.url && (
              <img
                src={blogPost.featuredImage.url}
                alt={blogPost.featuredImage.alt ?? ''}
                className="w-24 h-24 rounded-xl object-cover border border-gray-100 shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{blogPost.title}</h3>
              {blogPost.excerpt && <p className="text-sm text-gray-500 line-clamp-2">{blogPost.excerpt}</p>}
              {blogPost.slug && (
                <p className="text-xs font-mono text-gray-400 mt-2">/blog/{blogPost.slug}</p>
              )}
            </div>
          </div>
        </div>

        {/* Platform selector */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-sm font-bold text-gray-800 mb-1">Select Platforms</h2>
          <p className="text-xs text-gray-400 mb-4">Choose which platforms to create posts for. You can add more later.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ALL_PLATFORMS.map((platform) => {
              const active = selectedPlatforms.includes(platform)
              const color = PLATFORM_COLORS[platform]
              return (
                <button
                  key={platform}
                  onClick={() => togglePlatform(platform)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                    active ? 'text-white border-transparent shadow-sm' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                  style={active ? { backgroundColor: color, borderColor: color } : {}}
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ backgroundColor: active ? 'rgba(255,255,255,0.3)' : color }}
                  >
                    {platform[0].toUpperCase()}
                  </span>
                  <span className="truncate">{PLATFORM_LABELS[platform].replace(' Business', '').replace(' Page', '').replace(' Profile', '')}</span>
                  {active && <span className="ml-auto text-white/80">✓</span>}
                </button>
              )
            })}
          </div>
          <p className="text-xs text-gray-400 mt-3">{selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''} selected</p>
        </div>

        {/* Create button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCreate}
            disabled={creating || selectedPlatforms.length === 0}
            className="flex-1 py-3.5 rounded-xl font-bold text-white text-sm disabled:opacity-50 transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #0a3d2e, #2d9e6b)' }}
          >
            {creating ? 'Creating Campaign…' : '+ Create Social Campaign'}
          </button>
          <Link href="/admin/social/campaigns" className="text-sm text-gray-500 hover:text-gray-700">
            View all campaigns
          </Link>
        </div>

        {/* Existing campaigns */}
        {existing.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100" style={{ backgroundColor: '#f8fafc' }}>
              <h2 className="font-bold text-gray-700 text-sm">Existing Campaigns for This Post</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {existing.map((c) => (
                <div key={c.id} className="px-5 py-3.5 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{c.campaignName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        c.campaignStatus === 'posted' ? 'bg-green-100 text-green-700' :
                        c.campaignStatus === 'draft' ? 'bg-gray-100 text-gray-600' :
                        'bg-blue-100 text-blue-700'
                      }`}>{c.campaignStatus.replace(/_/g, ' ')}</span>
                      <span className="text-xs text-gray-400">{c.platformPosts.length} platform{c.platformPosts.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <Link
                    href={`/admin/social/campaigns/${c.id}`}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 whitespace-nowrap"
                  >
                    Open →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
