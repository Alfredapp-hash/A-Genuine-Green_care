'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import type { BlogPost, BlogStatus, BlogPostType } from './types'
import {
  getBlogPosts, getBlogPostById, createBlogPost, deleteBlogPost,
  duplicateBlogPost, archiveBlogPost,
} from './blogStore'
import { FORMAT_TEMPLATES } from './templates'
import FormatSelector from './FormatSelector'
import BlogPostEditor from './BlogPostEditor'

const STATUS_PILL: Record<BlogStatus, string> = {
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

const TRACKED_STATUSES: BlogStatus[] = ['draft', 'needs_review', 'approved', 'scheduled', 'published']

function formatLabel(type: BlogPostType) {
  return FORMAT_TEMPLATES.find((f) => f.type === type)?.label ?? type
}

function formatIcon(type: BlogPostType) {
  return FORMAT_TEMPLATES.find((f) => f.type === type)?.icon ?? '📄'
}

function seoScore(post: BlogPost): { score: number; label: string; color: string } {
  let score = 0
  if (post.seo.title) score++
  if (post.seo.description) score++
  if (post.slug) score++
  if (post.featuredImage?.alt) score++
  if ((post.relatedServiceIds?.length ?? 0) > 0 || (post.relatedInventoryIds?.length ?? 0) > 0) score++
  const pct = Math.round((score / 5) * 100)
  return {
    score: pct,
    label: pct >= 80 ? 'Good' : pct >= 50 ? 'Fair' : 'Low',
    color: pct >= 80 ? 'text-green-600' : pct >= 50 ? 'text-yellow-600' : 'text-red-400',
  }
}

export default function BlogStudioDashboard() {
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<BlogStatus | ''>('')
  const [filterType, setFilterType] = useState<BlogPostType | ''>('')
  const [showFormatSelector, setShowFormatSelector] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [deepLinkHandled, setDeepLinkHandled] = useState(false)

  async function refresh() {
    const data = await getBlogPosts()
    setPosts(data)
  }

  useEffect(() => {
    let mounted = true
    void (async () => {
      const data = await getBlogPosts()
      if (mounted) { setPosts(data); setLoading(false) }
    })()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (loading || !editId || deepLinkHandled) return
    const fromList = posts.find((p) => p.id === editId)
    if (fromList) {
      setEditingPost(fromList)
      setDeepLinkHandled(true)
      return
    }
    let mounted = true
    void getBlogPostById(editId).then((post) => {
      if (mounted && post) setEditingPost(post)
      if (mounted) setDeepLinkHandled(true)
    })
    return () => { mounted = false }
  }, [loading, editId, posts, deepLinkHandled])

  async function handleCreate(type: BlogPostType) {
    const post = await createBlogPost(type)
    setShowFormatSelector(false)
    setEditingPost(post)
  }

  async function handleCreateFromTemplate() {
    const post = await createBlogPost('standard_article', { blank: true })
    setEditingPost(post)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this post? This cannot be undone.')) return
    await deleteBlogPost(id)
    await refresh()
  }

  async function handleDuplicate(id: string) {
    await duplicateBlogPost(id)
    await refresh()
  }

  async function handleArchive(id: string) {
    await archiveBlogPost(id)
    await refresh()
  }

  function handleEdit(post: BlogPost) {
    setEditingPost(post)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f0f4f8' }}>
        <p className="text-gray-400 text-sm">Loading posts…</p>
      </div>
    )
  }

  if (editingPost) {
    return (
      <BlogPostEditor
        initialPost={editingPost}
        onBack={() => { setEditingPost(null); refresh() }}
      />
    )
  }

  const filtered = posts.filter((p) => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !filterStatus || p.status === filterStatus
    const matchType = !filterType || p.postType === filterType
    return matchSearch && matchStatus && matchType
  })

  const statusCounts = TRACKED_STATUSES.reduce((acc, status) => {
    acc[status] = posts.filter((p) => p.status === status).length
    return acc
  }, {} as Record<BlogStatus, number>)
  const archivedCount = posts.filter((p) => p.status === 'archived').length

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0f4f8' }}>
      {/* ── Header ────────────────────────────────────────────────────────────── */}
      <div className="px-8 py-6 border-b border-gray-200" style={{ background: 'linear-gradient(135deg, #040e21 0%, #0d2b55 100%)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl">✍️</span>
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display), Georgia, serif' }}>
                Blog Studio
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60">Thomas Marine</span>
            </div>
            <p className="text-sm text-blue-200 ml-11">
              New posts with structured blocks · publishes to <code className="text-xs bg-white/10 px-1 rounded">/blog/studio/[slug]</code>
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => void handleCreateFromTemplate()}
              className="flex items-center gap-2 px-5 py-3 rounded-full font-bold transition-all hover:scale-105 border"
              style={{ color: '#c9a84c', borderColor: 'rgba(201,168,76,0.5)', backgroundColor: 'rgba(201,168,76,0.1)' }}
            >
              New from Template
            </button>
            <button
              onClick={() => setShowFormatSelector(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, rgba(29,78,216,0.9), rgba(8,47,120,0.95))', boxShadow: '0 4px 20px rgba(29,78,216,0.4)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              + Create New Post
            </button>
          </div>
        </div>
      </div>

      {/* ── Status summary ──────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-8 pt-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {TRACKED_STATUSES.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilterStatus(filterStatus === status ? '' : status)}
              className={`rounded-xl border px-4 py-3 text-left transition-all ${filterStatus === status ? 'border-[#0d2b55] ring-2 ring-[#0d2b55]/20 bg-white shadow-sm' : 'border-gray-200 bg-white hover:border-[#0d2b55]/30'}`}
            >
              <p className="text-2xl font-bold" style={{ color: '#0d2b55' }}>{statusCounts[status]}</p>
              <p className="text-xs text-gray-500 mt-0.5">{STATUS_LABELS[status]}</p>
            </button>
          ))}
          {archivedCount > 0 && (
            <button
              type="button"
              onClick={() => setFilterStatus(filterStatus === 'archived' ? '' : 'archived')}
              className={`rounded-xl border px-4 py-3 text-left transition-all ${filterStatus === 'archived' ? 'border-[#0d2b55] ring-2 ring-[#0d2b55]/20 bg-white shadow-sm' : 'border-gray-200 bg-white hover:border-[#0d2b55]/30'}`}
            >
              <p className="text-2xl font-bold text-gray-400">{archivedCount}</p>
              <p className="text-xs text-gray-500 mt-0.5">Archived</p>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 pt-4">
        <div className="rounded-xl border border-indigo-200 bg-indigo-50/90 px-4 py-3 text-sm text-indigo-900">
          <p className="font-semibold mb-1">Blog Studio vs legacy posts</p>
          <p>
            Studio = block editor for <strong>new</strong> articles at{' '}
            <code className="text-xs bg-white/80 px-1 rounded">/blog/studio/[slug]</code>.
            Legacy TipTap posts remain in{' '}
            <a href="/admin/blog" className="font-semibold underline">Blog Posts (Legacy)</a>{' '}
            at <code className="text-xs bg-white/80 px-1 rounded">/blog/[slug]</code>.
            No data migration in this phase.
          </p>
        </div>
      </div>

      {/* ── Filters ───────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <input
            className="flex-1 min-w-[200px] border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as BlogStatus | '')}
          >
            <option value="">All Statuses</option>
            {(['draft','needs_review','approved','scheduled','published','archived'] as BlogStatus[]).map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
            ))}
          </select>
          <select
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as BlogPostType | '')}
          >
            <option value="">All Formats</option>
            {FORMAT_TEMPLATES.map((f) => (
              <option key={f.type} value={f.type}>{f.icon} {f.label}</option>
            ))}
          </select>
          <span className="text-sm text-gray-400">{filtered.length} post{filtered.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* ── Post table ────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-8 pb-10">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <div className="text-5xl mb-4">📝</div>
              <p className="text-gray-500 font-medium">No posts found</p>
              <p className="text-gray-400 text-sm mt-1">Create your first post to get started</p>
              <button onClick={() => setShowFormatSelector(true)} className="mt-4 text-sm font-bold text-blue-600 hover:text-blue-800">
                + Create New Post
              </button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100" style={{ backgroundColor: '#f8fafc' }}>
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Format</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">SEO</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Updated</th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((post, idx) => {
                  const seo = seoScore(post)
                  return (
                    <tr key={post.id} className={`border-b border-gray-50 hover:bg-blue-50/30 transition-colors ${idx % 2 === 0 ? '' : 'bg-gray-50/40'}`}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleEdit(post)} className="text-left hover:text-blue-700 transition-colors">
                            <p className="font-semibold text-gray-900 line-clamp-1">{post.title}</p>
                            <p className="text-xs text-gray-400 font-mono mt-0.5">/blog/{post.slug}</p>
                          </button>
                          {post.featured && <span className="text-xs px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-bold shrink-0">★</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span className="flex items-center gap-1.5 text-xs text-gray-600">
                          <span>{formatIcon(post.postType)}</span>
                          <span>{formatLabel(post.postType)}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        <span className="text-xs text-gray-500">{post.category}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_PILL[post.status]}`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        <span className={`text-xs font-bold ${seo.color}`}>{seo.label} ({seo.score}%)</span>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span className="text-xs text-gray-400">
                          {new Date(post.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleEdit(post)} title="Edit" className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors text-xs">✏️</button>
                          <a href={`/blog/preview/${post.id}`} target="_blank" rel="noopener noreferrer" title="Preview" className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors text-xs">👁</a>
                          <a href={`/admin/blog-studio/${post.id}/promote`} title="Promote to Social" className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-pink-600 hover:bg-pink-50 transition-colors text-xs">📣</a>
                          <button onClick={() => handleDuplicate(post.id)} title="Duplicate" className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors text-xs">⧉</button>
                          <button onClick={() => handleArchive(post.id)} title="Archive" className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition-colors text-xs">📦</button>
                          <button onClick={() => handleDelete(post.id)} title="Delete" className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors text-xs">🗑</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer notes */}
        <div className="mt-4 flex flex-wrap gap-6 text-xs text-gray-400">
          <span>★ Featured post</span>
          <span>SEO score based on title, description, slug, image alt, and related links</span>
          {/* TODO: Add analytics dashboard — page views, engagement, conversion */}
          {/* TODO: Add scheduled publishing UI */}
          {/* TODO: Add admin roles and approval workflow */}
          {/* TODO: Add version history / revision diff viewer */}
          {/* TODO: Add AI writing assistant (title suggestions, meta description generation) */}
        </div>
      </div>

      {showFormatSelector && (
        <FormatSelector onSelect={handleCreate} onClose={() => setShowFormatSelector(false)} />
      )}
    </div>
  )
}
