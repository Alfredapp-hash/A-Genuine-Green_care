'use client'
import { useCallback } from 'react'
import { nanoid } from 'nanoid'
import type { BlogPost, BlogCategory, BlogBlock } from './types'
import VideoEmbedInput from './VideoEmbedInput'
import FeaturedImageField, { syncHeroBlockImage } from './FeaturedImageField'

const CATEGORIES: BlogCategory[] = [
  'Suzuki Outboards', 'Boat Maintenance', 'Repower Guides',
  'Pre-Owned Buying Tips', 'Seasonal Service', 'Local Boating',
  'Company News', 'Buying Guide',
]

const INPUT_CLASS = 'w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d2b55]/20 focus:border-[#0d2b55]/40 transition-colors'

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-bold text-gray-700">{label}</label>
      {hint && <p className="text-xs text-gray-400 leading-relaxed">{hint}</p>}
      {children}
    </div>
  )
}

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()

// ── Helpers to read/write logical sections from the blocks array ──────────────

function getBlock<T extends BlogBlock>(blocks: BlogBlock[], type: T['type']): T | undefined {
  return blocks.find((b) => b.type === type) as T | undefined
}

function setBlock(blocks: BlogBlock[], block: BlogBlock): BlogBlock[] {
  const idx = blocks.findIndex((b) => b.id === block.id)
  if (idx >= 0) {
    const next = [...blocks]
    next[idx] = block
    return next
  }
  return [...blocks, block]
}

function removeBlocksByType(blocks: BlogBlock[], type: BlogBlock['type']): BlogBlock[] {
  return blocks.filter((b) => b.type !== type)
}

type Props = {
  post: BlogPost
  onChange: (patch: Partial<BlogPost>) => void
}

export default function SimpleBlogEditor({ post, onChange }: Props) {
  const update = useCallback((patch: Partial<BlogPost>) => onChange(patch), [onChange])

  // ── Read logical values from blocks ──────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const paragraphBlock = getBlock<any>(post.blocks, 'paragraph') ??
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getBlock<any>(post.blocks, 'intro') ??
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getBlock<any>(post.blocks, 'rich_text')
  const mainContent: string = paragraphBlock?.data?.body ?? paragraphBlock?.data?.body ?? ''

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const videoBlock = getBlock<any>(post.blocks, 'youtube_video') ??
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getBlock<any>(post.blocks, 'vimeo_video') ??
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getBlock<any>(post.blocks, 'video')
  const videoUrl: string = videoBlock?.data?.url ?? ''

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ctaBlock = getBlock<any>(post.blocks, 'cta') ?? getBlock<any>(post.blocks, 'button_cta')
  const ctaTitle: string = ctaBlock?.data?.title ?? ctaBlock?.data?.label ?? ''
  const ctaUrl: string = ctaBlock?.data?.primaryButtonUrl ?? ctaBlock?.data?.url ?? '/contact'

  // ── Write helpers ─────────────────────────────────────────────────────────────

  function setMainContent(body: string) {
    let blocks = post.blocks
    if (paragraphBlock) {
      blocks = setBlock(blocks, { ...paragraphBlock, data: { ...paragraphBlock.data, body } })
    } else {
      const newBlock: BlogBlock = { id: nanoid(), type: 'paragraph', enabled: true, internalLabel: 'Main Content', data: { body, size: 'base', align: 'left' } }
      blocks = [...blocks, newBlock]
    }
    update({ blocks })
  }

  function setVideoUrl(url: string) {
    let blocks = post.blocks
    // Detect platform and set appropriate block type
    const isVimeo = /vimeo\.com/.test(url)
    const blockType = isVimeo ? 'vimeo_video' : 'youtube_video'

    if (videoBlock) {
      // Update in-place preserving type if already set
      blocks = setBlock(blocks, { ...videoBlock, type: videoBlock.type === 'video' ? blockType : videoBlock.type, data: { ...videoBlock.data, url } })
    } else if (url) {
      const newBlock: BlogBlock = { id: nanoid(), type: isVimeo ? 'vimeo_video' : 'youtube_video', enabled: true, internalLabel: 'Video', data: { url } }
      blocks = [...blocks, newBlock]
    }
    if (!url && videoBlock) {
      blocks = removeBlocksByType(removeBlocksByType(removeBlocksByType(blocks, 'youtube_video'), 'vimeo_video'), 'video')
    }
    update({ blocks })
  }

  function setCtaTitle(title: string) {
    let blocks = post.blocks
    if (ctaBlock) {
      if (ctaBlock.type === 'cta') {
        blocks = setBlock(blocks, { ...ctaBlock, data: { ...ctaBlock.data, title } })
      } else {
        blocks = setBlock(blocks, { ...ctaBlock, data: { ...ctaBlock.data, label: title } })
      }
    } else if (title) {
      const newBlock: BlogBlock = { id: nanoid(), type: 'button_cta', enabled: true, internalLabel: 'Call to Action', data: { label: title, url: '/contact', style: 'primary', align: 'center' } }
      blocks = [...blocks, newBlock]
    }
    update({ blocks })
  }

  function setCtaUrl(url: string) {
    let blocks = post.blocks
    if (ctaBlock) {
      if (ctaBlock.type === 'cta') {
        blocks = setBlock(blocks, { ...ctaBlock, data: { ...ctaBlock.data, primaryButtonUrl: url } })
      } else {
        blocks = setBlock(blocks, { ...ctaBlock, data: { ...ctaBlock.data, url } })
      }
    }
    update({ blocks })
  }

  const inputClass = INPUT_CLASS

  return (
    <div className="space-y-6">
      {/* Post Title */}
      <Field
        label="Post Title"
        hint="Give your post a clear, descriptive title. This appears at the top of your post."
      >
        <input
          type="text"
          value={post.title}
          onChange={(e) => update({ title: e.target.value, slug: slugify(e.target.value) })}
          placeholder="e.g. 5 Signs Your Outboard Needs Service"
          className={`${inputClass} text-base font-bold`}
        />
        <p className="text-xs text-gray-400 mt-1">
          Page link: <span className="font-mono text-gray-500">/blog/{post.slug || 'your-post-title'}</span>
        </p>
      </Field>

      {/* Category */}
      <Field
        label="Category"
        hint="Choose the topic that best fits this post."
      >
        <select
          value={post.category}
          onChange={(e) => update({ category: e.target.value as BlogCategory })}
          className={inputClass}
        >
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>

      {/* Featured Image */}
      <FeaturedImageField
        defaultAlt={post.title || 'Blog post image'}
        value={post.featuredImage}
        onChange={(asset) => {
          update({
            featuredImage: asset,
            blocks: syncHeroBlockImage(post.blocks, asset),
          })
        }}
      />

      {/* Summary */}
      <Field
        label="Short Summary"
        hint="This appears on the blog listing page below your post title. Write 1–2 sentences describing what readers will learn."
      >
        <textarea
          rows={3}
          value={post.excerpt}
          onChange={(e) => update({ excerpt: e.target.value })}
          placeholder="e.g. Learn how to spot engine trouble early and avoid expensive repairs this season."
          className={`${inputClass} resize-none`}
        />
        <p className={`text-xs mt-1 ${post.excerpt.length > 160 ? 'text-amber-500' : 'text-gray-400'}`}>
          {post.excerpt.length} / 160 recommended
        </p>
      </Field>

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* Main Content */}
      <Field
        label="Main Content"
        hint="Write the body of your post here. You can use the Advanced Builder to add more sections, photos, and formatting."
      >
        <textarea
          rows={12}
          value={mainContent}
          onChange={(e) => setMainContent(e.target.value)}
          placeholder="Start writing your post here...&#10;&#10;Example:&#10;If you've noticed your outboard is harder to start than usual, or if the idle sounds rough, those are early warning signs worth paying attention to..."
          className={`${inputClass} resize-y font-normal leading-relaxed`}
        />
      </Field>

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* Add Video */}
      <VideoEmbedInput
        value={videoUrl}
        onChange={setVideoUrl}
        label="Add a Video (optional)"
      />

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* Call to Action */}
      <Field
        label="Call to Action"
        hint='This tells visitors what to do next, like scheduling service or viewing inventory. Example: "Schedule Your Service Today"'
      >
        <input
          type="text"
          value={ctaTitle}
          onChange={(e) => setCtaTitle(e.target.value)}
          placeholder="e.g. Schedule Your Service Today"
          className={inputClass}
        />
        {ctaTitle && (
          <input
            type="url"
            value={ctaUrl}
            onChange={(e) => setCtaUrl(e.target.value)}
            placeholder="Link URL — e.g. /contact"
            className={`${inputClass} mt-2 font-mono text-xs`}
          />
        )}
      </Field>

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* Quick SEO */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-base">🔍</span>
          <p className="text-sm font-bold text-[#0d2b55]">Search Engine Settings</p>
          <p className="text-xs text-gray-400 ml-1">(optional but recommended)</p>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-600">SEO Title</label>
          <p className="text-xs text-gray-400">This is the title people may see in Google. Keep it clear and under 60 characters.</p>
          <input
            type="text"
            value={post.seo?.title ?? ''}
            onChange={(e) => update({ seo: { ...post.seo, title: e.target.value } })}
            placeholder="e.g. Outboard Service Georgetown SC | Thomas Marine"
            className={inputClass}
            maxLength={80}
          />
          <p className={`text-xs mt-0.5 ${(post.seo?.title?.length ?? 0) > 65 ? 'text-red-500' : 'text-gray-400'}`}>
            {post.seo?.title?.length ?? 0} / 65 characters
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-600">Meta Description</label>
          <p className="text-xs text-gray-400">This short description helps people decide whether to click your page. Aim for 120–160 characters.</p>
          <textarea
            rows={3}
            value={post.seo?.description ?? ''}
            onChange={(e) => update({ seo: { ...post.seo, description: e.target.value } })}
            placeholder="e.g. Thomas Marine in Georgetown, SC provides Suzuki outboard service, repowers, and seasonal boat maintenance."
            className={`${inputClass} resize-none`}
            maxLength={200}
          />
          <p className={`text-xs mt-0.5 ${(post.seo?.description?.length ?? 0) > 160 ? 'text-red-500' : 'text-gray-400'}`}>
            {post.seo?.description?.length ?? 0} / 160 characters
          </p>
        </div>
      </div>

      {/* Show on blog toggle */}
      <div className="flex items-center gap-3 p-4 rounded-2xl border border-gray-100 bg-gray-50">
        <div
          className={`w-10 h-5 rounded-full transition-colors cursor-pointer relative ${post.showOnBlogPage ? 'bg-[#0d2b55]' : 'bg-gray-200'}`}
          onClick={() => update({ showOnBlogPage: !post.showOnBlogPage })}
        >
          <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${post.showOnBlogPage ? 'left-5' : 'left-0.5'}`} />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-700">Show on Blog Page</p>
          <p className="text-xs text-gray-400">When on, this post appears in the public blog listing.</p>
        </div>
      </div>
    </div>
  )
}
