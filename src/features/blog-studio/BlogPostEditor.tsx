'use client'
import { useState, useCallback } from 'react'
import { nanoid } from 'nanoid'
import type { BlogPost, BlogBlock, BlogStatus, BlogCategory } from './types'
import { blockRegistry } from './blockRegistry'
import { updateBlogPost, publishBlogPost } from './blogStore'
import SEOPanel from './SEOPanel'
import DesignPanel from './DesignPanel'
import BlogPostPreview from './BlogPostPreview'
import SnippetLibraryPanel from './SnippetLibraryPanel'
import type { BlogSnippet } from './types'
import BlogEditorModeToggle, { type EditorMode } from './BlogEditorModeToggle'
import SimpleBlogEditor from './SimpleBlogEditor'
import AddSectionMenu from './AddSectionMenu'
import ContentBlockCard from './ContentBlockCard'
import BlogTemplatePicker from './BlogTemplatePicker'
import BlogPublishingChecklist from './BlogPublishingChecklist'
import DraftAutosaveStatus, { type SaveState } from './DraftAutosaveStatus'
import { useAutosave, loadLocalDraft, clearLocalDraft } from './useAutosave'

type PreviewSize = 'desktop' | 'tablet' | 'mobile'

const CATEGORIES: BlogCategory[] = [
  'Suzuki Outboards', 'Boat Maintenance', 'Repower Guides',
  'Pre-Owned Buying Tips', 'Seasonal Service', 'Local Boating',
  'Company News', 'Buying Guide',
]

const STATUS_COLORS: Record<BlogStatus, string> = {
  draft:        'bg-gray-100 text-gray-600',
  needs_review: 'bg-yellow-100 text-yellow-700',
  approved:     'bg-green-100 text-green-700',
  scheduled:    'bg-blue-100 text-blue-700',
  published:    'bg-emerald-100 text-emerald-700',
  archived:     'bg-red-100 text-red-600',
}

const STATUS_LABELS: Record<BlogStatus, string> = {
  draft:        'Draft',
  needs_review: 'Needs Review',
  approved:     'Approved',
  scheduled:    'Scheduled',
  published:    'Published',
  archived:     'Archived',
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()

type Props = { initialPost: BlogPost; onBack: () => void }

export default function BlogPostEditor({ initialPost, onBack }: Props) {
  const isNewPost = initialPost.blocks.length === 0
  const [post, setPost] = useState<BlogPost>(initialPost)
  const [mode, setMode] = useState<EditorMode>(isNewPost ? 'simple' : 'advanced')
  const [activeTab, setActiveTab] = useState<'blocks' | 'seo' | 'design'>('blocks')
  const [previewSize, setPreviewSize] = useState<PreviewSize>('desktop')
  const [showAddSection, setShowAddSection] = useState(false)
  const [showSnippets, setShowSnippets] = useState(false)
  const [showTemplatePicker, setShowTemplatePicker] = useState(isNewPost)
  const [showPublishChecklist, setShowPublishChecklist] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [draftRecovery, setDraftRecovery] = useState<BlogPost | null>(() => {
    const saved = loadLocalDraft(initialPost.id)
    if (saved && saved.savedAt > Date.parse(initialPost.updatedAt)) return saved.post
    return null
  })

  const previewWidth = previewSize === 'desktop' ? 'w-full' : previewSize === 'tablet' ? 'w-[768px]' : 'w-[390px]'

  // ── Post mutations ────────────────────────────────────────────────────────
  const updatePost = useCallback((patch: Partial<BlogPost>) => {
    setPost((p) => ({ ...p, ...patch, updatedAt: new Date().toISOString() }))
  }, [])

  function updateBlock(index: number, block: BlogBlock) {
    const blocks = [...post.blocks]; blocks[index] = block; updatePost({ blocks })
  }
  function deleteBlock(index: number) {
    updatePost({ blocks: post.blocks.filter((_, i) => i !== index) })
  }
  function duplicateBlock(index: number) {
    const blocks = [...post.blocks]
    const copy = { ...JSON.parse(JSON.stringify(blocks[index])), id: nanoid() }
    blocks.splice(index + 1, 0, copy); updatePost({ blocks })
  }
  function moveBlock(index: number, dir: 'up' | 'down') {
    const blocks = [...post.blocks]
    if (dir === 'up' && index > 0) { [blocks[index - 1], blocks[index]] = [blocks[index], blocks[index - 1]] }
    if (dir === 'down' && index < blocks.length - 1) { [blocks[index], blocks[index + 1]] = [blocks[index + 1], blocks[index]] }
    updatePost({ blocks })
  }
  function addBlock(type: BlogBlock['type']) {
    const entry = blockRegistry[type]; if (!entry) return
    updatePost({ blocks: [...post.blocks, entry.createDefault()] })
  }
  function insertSnippet(snippet: BlogSnippet) {
    const entry = blockRegistry[snippet.blockType]; if (!entry) return
    const base = entry.createDefault()
    const newBlock = { ...base, id: nanoid(), data: { ...base.data, ...(snippet.data as typeof base.data) } } as BlogBlock
    updatePost({ blocks: [...post.blocks, newBlock] })
  }

  // ── Save / publish ────────────────────────────────────────────────────────
  const doSave = useCallback(async (p: BlogPost) => {
    await updateBlogPost(p.id, p)
  }, [])

  const { flush } = useAutosave(post, doSave, setSaveState)

  async function saveNow() {
    setSaveState('saving')
    await updateBlogPost(post.id, post)
    clearLocalDraft(post.id)
    setSaveState('saved')
    setTimeout(() => setSaveState('idle'), 2500)
  }

  async function handlePublish() {
    setIsPublishing(true)
    const result = await publishBlogPost(post.id)
    if (result) setPost(result)
    setIsPublishing(false)
    setShowPublishChecklist(false)
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#f0f4f8' }}>
      {/* ── LEFT EDITOR PANEL ───────────────────────────────────────────────── */}
      <div className="w-[500px] flex-shrink-0 flex flex-col border-r border-gray-200 bg-white overflow-hidden shadow-md">

        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100" style={{ background: 'linear-gradient(135deg, #040e21, #0d2b55)' }}>
          <button onClick={onBack} className="text-white/60 hover:text-white transition-colors text-sm shrink-0">← Back</button>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-blue-200 truncate">{post.title || 'Untitled post'}</p>
          </div>
          <DraftAutosaveStatus state={saveState} />
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[post.status]}`}>
            {STATUS_LABELS[post.status]}
          </span>
        </div>

        {/* Mode toggle + template trigger */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-100 bg-gray-50">
          <BlogEditorModeToggle mode={mode} onChange={setMode} />
          {mode === 'advanced' && (
            <button
              onClick={() => setShowTemplatePicker(true)}
              className="text-xs font-bold text-[#0d2b55] hover:text-[#0d2b55]/70 transition-colors flex items-center gap-1"
            >
              📋 Templates
            </button>
          )}
        </div>

        {/* Draft recovery banner */}
        {draftRecovery && (
          <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border-b border-amber-100">
            <span className="text-amber-500 text-sm">💾</span>
            <p className="text-xs text-amber-700 flex-1">We found an unsaved draft version of this post.</p>
            <button onClick={() => { setPost(draftRecovery); setDraftRecovery(null) }} className="text-xs font-bold text-amber-700 underline hover:text-amber-800">Restore</button>
            <button onClick={() => { clearLocalDraft(post.id); setDraftRecovery(null) }} className="text-xs text-amber-500 hover:text-amber-700 ml-1">Dismiss</button>
          </div>
        )}

        {/* ── SIMPLE MODE ──────────────────────────────────────────────────── */}
        {mode === 'simple' && (
          <>
            <div className="flex-1 overflow-y-auto p-5">
              <SimpleBlogEditor post={post} onChange={updatePost} />
            </div>
            <div className="flex gap-2 px-4 py-3 border-t border-gray-100">
              <button onClick={saveNow} className="flex-1 py-2.5 rounded-xl text-sm font-bold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                Save Draft
              </button>
              <button
                onClick={() => setShowPublishChecklist(true)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg, #1d4ed8, #0a2d7a)', boxShadow: '0 4px 16px rgba(29,78,216,0.3)' }}
              >
                {post.status === 'published' ? 'Update Post' : 'Publish Post'}
              </button>
            </div>
          </>
        )}

        {/* ── ADVANCED MODE ────────────────────────────────────────────────── */}
        {mode === 'advanced' && (
          <>
            {/* Quick meta bar */}
            <div className="px-4 py-3 border-b border-gray-100 space-y-2">
              <input
                className="w-full text-sm font-bold border-0 border-b border-gray-100 px-0 py-1 focus:outline-none focus:border-blue-400 text-gray-900"
                value={post.title}
                onChange={(e) => updatePost({ title: e.target.value, slug: slugify(e.target.value) })}
                placeholder="Post title..."
              />
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 shrink-0">/blog/</span>
                <input
                  className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500/30 text-gray-600"
                  value={post.slug}
                  onChange={(e) => updatePost({ slug: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <select className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs" value={post.category} onChange={(e) => updatePost({ category: e.target.value as BlogCategory })}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <select className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs" value={post.status} onChange={(e) => updatePost({ status: e.target.value as BlogStatus })}>
                  {(['draft','needs_review','approved','scheduled','published','archived'] as BlogStatus[]).map((s) => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={post.featured} onChange={(e) => updatePost({ featured: e.target.checked })} className="accent-blue-600" />
                  <span className="text-gray-600">Featured</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={post.showOnBlogPage ?? false} onChange={(e) => updatePost({ showOnBlogPage: e.target.checked })} className="accent-blue-600" />
                  <span className="text-gray-600">Show on Blog</span>
                </label>
              </div>
            </div>

            {/* Tab bar */}
            <div className="flex border-b border-gray-100 bg-white">
              {(['blocks', 'seo', 'design'] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 text-xs font-bold transition-colors ${activeTab === tab ? 'border-b-2 border-[#0d2b55] text-[#0d2b55]' : 'text-gray-400 hover:text-gray-700'}`}
                >
                  {tab === 'blocks' ? '⬛ Sections' : tab === 'seo' ? '🔍 SEO' : '🎨 Design'}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'blocks' && (
                <div className="space-y-3">
                  {post.blocks.length === 0 && (
                    <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-2xl">
                      <p className="text-2xl mb-2">✍️</p>
                      <p className="text-sm font-semibold text-gray-500 mb-1">No sections yet</p>
                      <p className="text-xs text-gray-400 mb-4">Start with a text section, image, video, or service callout.</p>
                      <button onClick={() => setShowAddSection(true)} className="text-xs font-bold text-[#0d2b55] underline">+ Add your first section</button>
                    </div>
                  )}
                  {post.blocks.map((block, idx) => (
                    <ContentBlockCard
                      key={block.id}
                      block={block}
                      index={idx}
                      total={post.blocks.length}
                      onChange={(b) => updateBlock(idx, b)}
                      onDelete={() => deleteBlock(idx)}
                      onDuplicate={() => duplicateBlock(idx)}
                      onMove={(dir) => moveBlock(idx, dir)}
                    />
                  ))}

                  {/* Add section buttons */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => setShowAddSection(true)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed text-sm font-bold transition-colors"
                      style={{ borderColor: '#0d2b55', color: '#0d2b55' }}
                    >
                      + Add Section
                    </button>
                    <button
                      onClick={() => setShowSnippets(true)}
                      className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl border-2 border-dashed border-gray-200 text-xs text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-colors"
                    >
                      📌 Snippets
                    </button>
                  </div>
                </div>
              )}
              {activeTab === 'seo' && (
                <SEOPanel seo={post.seo} post={post} onChange={(seo) => updatePost({ seo })} />
              )}
              {activeTab === 'design' && (
                <DesignPanel design={post.design} onChange={(design) => updatePost({ design })} />
              )}
            </div>

            {/* Footer actions */}
            <div className="flex gap-2 px-4 py-3 border-t border-gray-100 bg-white">
              <button onClick={saveNow} className="flex-1 py-2.5 rounded-xl text-sm font-bold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                Save Draft
              </button>
              <button
                onClick={() => setShowPublishChecklist(true)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg, #1d4ed8, #0a2d7a)', boxShadow: '0 4px 16px rgba(29,78,216,0.3)' }}
              >
                {post.status === 'published' ? 'Update Post' : 'Publish Post'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── RIGHT PREVIEW PANEL ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Preview toolbar */}
        <div className="flex items-center gap-3 px-6 py-3 border-b border-gray-200 bg-white shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">Live Preview</span>
          {(['desktop', 'tablet', 'mobile'] as PreviewSize[]).map((size) => (
            <button
              key={size}
              onClick={() => setPreviewSize(size)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold transition-colors ${previewSize === size ? 'text-white' : 'text-gray-400 hover:text-gray-700'}`}
              style={previewSize === size ? { background: '#0d2b55' } : {}}
            >
              {size === 'desktop' ? '🖥' : size === 'tablet' ? '📱' : '📲'}{' '}
              {size.charAt(0).toUpperCase() + size.slice(1)}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <a href={`/blog/preview/${post.id}`} target="_blank" rel="noopener noreferrer"
              className="text-xs font-bold text-[#0d2b55] hover:underline flex items-center gap-1">
              ↗ Open preview
            </a>
          </div>
        </div>

        {/* Preview viewport */}
        <div className="flex-1 overflow-auto bg-gray-200 flex justify-center p-6">
          <div className={`${previewWidth} bg-white shadow-xl rounded-xl overflow-hidden transition-all duration-300 min-h-full`}>
            {post.blocks.filter((b) => b.enabled).length === 0 && mode === 'simple' ? (
              <div className="flex flex-col items-center justify-center h-full py-24 text-center px-8">
                <div className="text-4xl mb-4">✍️</div>
                <p className="text-gray-400 text-sm">Start writing in the editor on the left and your post will appear here.</p>
              </div>
            ) : (
              <BlogPostPreview post={post} />
            )}
          </div>
        </div>
      </div>

      {/* ── Modals ────────────────────────────────────────────────────────────── */}

      {showTemplatePicker && (
        <BlogTemplatePicker
          onSelect={(blocks) => {
            if (blocks.length > 0) updatePost({ blocks })
            setMode('advanced')
          }}
          onClose={() => setShowTemplatePicker(false)}
        />
      )}

      {showAddSection && (
        <AddSectionMenu
          onAdd={(type) => { addBlock(type); void flush() }}
          onClose={() => setShowAddSection(false)}
        />
      )}

      {showSnippets && (
        <SnippetLibraryPanel
          onInsert={insertSnippet}
          onClose={() => setShowSnippets(false)}
        />
      )}

      {showPublishChecklist && (
        <BlogPublishingChecklist
          post={post}
          onPublish={handlePublish}
          onCancel={() => setShowPublishChecklist(false)}
          isPublishing={isPublishing}
        />
      )}
    </div>
  )
}
