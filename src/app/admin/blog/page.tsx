// TODO: connect Supabase
// import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, ChevronRight, FileText, Calendar, CheckCircle2, FileEdit } from 'lucide-react'

type BlogRow = {
  id: string
  title: string
  slug: string
  status: 'draft' | 'scheduled' | 'published' | 'archived' | null
  published_at: string | null
  scheduled_for: string | null
  updated_at: string
  cover_image_url: string | null
}

const statusBadges = {
  draft:     { label: 'Draft',     icon: FileEdit,    color: '#6b7280', bg: '#f3f4f6' },
  scheduled: { label: 'Scheduled', icon: Calendar,    color: '#1d4ed8', bg: '#dbeafe' },
  published: { label: 'Published', icon: CheckCircle2,color: '#15803d', bg: '#dcfce7' },
  archived:  { label: 'Archived',  icon: FileText,    color: '#9ca3af', bg: '#f3f4f6' },
} as const

export default async function BlogAdminPage() {
  // TODO: connect Supabase
  // const supabase = await createClient()
  // const { data } = await supabase
  //   .from('blog_posts')
  //   .select('id, title, slug, status, published_at, scheduled_for, updated_at, cover_image_url')
  //   .order('updated_at', { ascending: false })
  const posts: BlogRow[] = []

  return (
    <div className="p-8">
      <div className="mb-6 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
        <p className="font-semibold mb-1">Legacy blog posts (TipTap)</p>
        <p>
          These posts use the original rich-text editor and publish to <code className="text-xs bg-white/80 px-1 rounded">/blog/[slug]</code>.
          For new articles with structured blocks, use{' '}
          <Link href="/admin/blog-studio" className="font-semibold underline">Blog Studio</Link>{' '}
          (<code className="text-xs bg-white/80 px-1 rounded">/blog/studio/[slug]</code>).
          No automatic migration between systems in this phase.
        </p>
      </div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: '#2c6b4a' }}>
            Blog Posts <span className="text-sm font-normal text-gray-400">(Legacy)</span>
          </h1>
          <p className="text-gray-500 text-sm">
            {posts.length} post{posts.length === 1 ? '' : 's'} total
            {' · '}
            For new articles, use{' '}
            <Link href="/admin/blog-studio" className="font-semibold hover:underline" style={{ color: '#6366f1' }}>
              Blog Studio
            </Link>
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm text-white"
          style={{ backgroundColor: '#2c6b4a' }}
        >
          <Plus size={16} /> New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
          <FileText size={40} className="mx-auto mb-4 text-gray-300" />
          <p className="font-semibold mb-1" style={{ color: '#2c6b4a' }}>No posts yet</p>
          <p className="text-sm text-gray-500 mb-6">Write your first post to get started.</p>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm text-white"
            style={{ backgroundColor: '#2c6b4a' }}
          >
            <Plus size={16} /> Create Post
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="text-left px-5 py-3 font-semibold">Title</th>
                <th className="text-left px-5 py-3 font-semibold">Status</th>
                <th className="text-left px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => {
                const status = (post.status ?? 'draft') as keyof typeof statusBadges
                const badge = statusBadges[status]
                const Icon = badge.icon
                const date =
                  status === 'scheduled' ? post.scheduled_for :
                  status === 'published' ? post.published_at :
                  post.updated_at
                return (
                  <tr key={post.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <Link href={`/admin/blog/${post.id}`} className="font-semibold" style={{ color: '#2c6b4a' }}>
                        {post.title || 'Untitled'}
                      </Link>
                      <p className="text-xs text-gray-500 mt-0.5">/blog/{post.slug}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{ color: badge.color, backgroundColor: badge.bg }}
                      >
                        <Icon size={12} /> {badge.label}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-xs">
                      {date ? new Date(date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '—'}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link href={`/admin/blog/${post.id}`} className="text-gray-400 hover:text-green-700">
                        <ChevronRight size={18} />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
