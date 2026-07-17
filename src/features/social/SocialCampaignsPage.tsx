'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { SocialCampaign, SocialPlatform } from './types'
import { PLATFORM_LABELS, PLATFORM_COLORS } from './types'
import {
  getSocialCampaigns,
  deleteSocialCampaign,
  archiveSocialCampaign,
  duplicateSocialCampaign,
  importServerCampaign,
} from './socialStore'

const STATUS_PILL: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600',
  ready: 'bg-blue-100 text-blue-700',
  scheduled: 'bg-purple-100 text-purple-700',
  partially_posted: 'bg-yellow-100 text-yellow-700',
  posted: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  archived: 'bg-gray-100 text-gray-400',
}

function PlatformBadge({ platform }: { platform: SocialPlatform }) {
  return (
    <span
      className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full text-white"
      style={{ backgroundColor: PLATFORM_COLORS[platform] }}
      title={PLATFORM_LABELS[platform]}
    >
      {platform[0].toUpperCase()}
    </span>
  )
}

export default function SocialCampaignsPage() {
  const [campaigns, setCampaigns] = useState<SocialCampaign[]>(() => getSocialCampaigns())
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [search, setSearch] = useState('')
  const [showArchived, setShowArchived] = useState(false)

  function refresh() { setCampaigns(getSocialCampaigns()) }

  useEffect(() => {
    // TODO: connect Supabase — fetch from /api/social/campaigns
    fetch('/api/social/campaigns')
      .then((r) => r.json())
      .then((d) => {
        const server = (d.campaigns ?? []) as SocialCampaign[]
        for (const c of server) importServerCampaign(c)
        setCampaigns(getSocialCampaigns())
      })
      .catch(() => {})
  }, [])

  function handleDelete(id: string) {
    if (!confirm('Delete this campaign permanently?')) return
    deleteSocialCampaign(id)
    refresh()
  }

  function handleArchive(id: string) {
    archiveSocialCampaign(id)
    refresh()
  }

  function handleDuplicate(id: string) {
    duplicateSocialCampaign(id)
    refresh()
  }

  const filtered = campaigns.filter((c) => {
    if (!showArchived && c.campaignStatus === 'archived') return false
    if (filterStatus && c.campaignStatus !== filterStatus) return false
    if (search) {
      const q = search.toLowerCase()
      return c.campaignName.toLowerCase().includes(q) || c.sourceTitle.toLowerCase().includes(q)
    }
    return true
  })

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0f4f8' }}>
      {/* Header */}
      <div className="px-8 py-6 border-b" style={{ background: 'linear-gradient(135deg, #0a3d2e 0%, #1a6b4f 100%)' }}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link href="/admin/social" className="text-xs text-green-300 hover:text-white mb-3 flex items-center gap-1 transition-colors">← Social Publisher</Link>
            <div className="flex items-center gap-3">
              <span className="text-2xl">📋</span>
              <h1 className="text-2xl font-bold text-white">Social Campaigns</h1>
            </div>
            <p className="text-sm text-green-200 ml-11 mt-1">{campaigns.filter((c) => c.campaignStatus !== 'archived').length} active campaigns</p>
          </div>
          <Link href="/admin/blog-studio" className="text-xs px-4 py-2 rounded-lg font-bold text-white transition-all hover:opacity-85" style={{ backgroundColor: '#2d9e6b' }}>
            + Promote a Blog Post
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <input
            className="flex-1 min-w-[200px] border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            placeholder="Search campaigns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white shadow-sm focus:outline-none"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            {['draft', 'ready', 'scheduled', 'partially_posted', 'posted', 'failed'].map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
            <input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} />
            Show archived
          </label>
          <span className="text-sm text-gray-400">{filtered.length} shown</span>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <div className="text-5xl mb-4">📢</div>
              <p className="text-gray-500 font-medium">No campaigns found</p>
              <div className="flex flex-col gap-1 mt-2">
                <Link href="/admin/blog-studio" className="text-sm text-blue-600 hover:underline">
                  Promote a blog post from Blog Studio
                </Link>
              </div>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider" style={{ backgroundColor: '#f8fafc' }}>
                  <th className="text-left px-5 py-3">Campaign</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Status</th>
                  <th className="text-left px-4 py-3 hidden lg:table-cell">Platforms</th>
                  <th className="text-left px-4 py-3 hidden lg:table-cell">Scheduled</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Updated</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, idx) => (
                  <tr
                    key={c.id}
                    className={`border-b border-gray-50 hover:bg-blue-50/30 transition-colors ${idx % 2 === 0 ? '' : 'bg-gray-50/40'}`}
                  >
                    <td className="px-5 py-3.5">
                      <Link href={`/admin/social/campaigns/${c.id}`} className="font-semibold text-gray-900 hover:text-blue-700 line-clamp-1 block">
                        {c.campaignName}
                      </Link>
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{c.sourceTitle}</p>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_PILL[c.campaignStatus] ?? 'bg-gray-100 text-gray-500'}`}>
                        {c.campaignStatus.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <div className="flex gap-1">
                        {c.platformPosts.map((p) => <PlatformBadge key={p.id} platform={p.platform} />)}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell text-xs text-gray-400">
                      {c.platformPosts.some((p) => p.scheduledFor)
                        ? new Date(c.platformPosts.find((p) => p.scheduledFor)!.scheduledFor!).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell text-xs text-gray-400">
                      {new Date(c.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <Link href={`/admin/social/campaigns/${c.id}`} title="Open" className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors text-xs">✏️</Link>
                        <button onClick={() => handleDuplicate(c.id)} title="Duplicate" className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors text-xs">⧉</button>
                        <button onClick={() => handleArchive(c.id)} title="Archive" className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition-colors text-xs">📦</button>
                        <button onClick={() => handleDelete(c.id)} title="Delete" className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors text-xs">🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
