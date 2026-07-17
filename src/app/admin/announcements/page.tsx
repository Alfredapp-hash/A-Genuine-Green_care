import Link from 'next/link'
import { Plus, ChevronRight, Megaphone, ExternalLink, ArrowUpDown, Trophy } from 'lucide-react'
import AnnouncementListActions from './_components/AnnouncementListActions'

type AnnouncementStatus = 'draft' | 'active' | 'paused' | 'expired'

type AnnouncementRow = {
  id: string
  title: string
  status: AnnouncementStatus
  scheduled_start: string | null
  scheduled_end: string | null
  impressions: number
  clicks: number
  dismissals: number
  last_shown_at: string | null
  trigger_type: string | null
  created_at: string
}

const statusColors: Record<string, string> = {
  draft:   '#6b7280',
  active:  '#16a34a',
  paused:  '#d97706',
  expired: '#9ca3af',
}

function formatCtr(clicks: number, impressions: number): string {
  if (impressions === 0) return '—'
  return `${((clicks / impressions) * 100).toFixed(1)}%`
}

function formatDismissRate(dismissals: number, impressions: number): string {
  if (impressions === 0) return '—'
  return `${((dismissals / impressions) * 100).toFixed(1)}%`
}

type SortKey = 'created_at' | 'impressions' | 'status'

function parseSort(raw: string | undefined): SortKey {
  if (raw === 'impressions' || raw === 'status') return raw
  return 'created_at'
}

function parseStatusFilter(raw: string | undefined): AnnouncementStatus | 'all' {
  if (raw === 'draft' || raw === 'active' || raw === 'paused' || raw === 'expired') return raw
  return 'all'
}

function buildAdminQuery(
  current: Record<string, string | string[] | undefined>,
  overrides: Record<string, string | null>,
): string {
  const params = new URLSearchParams()
  for (const [k, v] of Object.entries(current)) {
    if (v !== undefined && !(k in overrides)) {
      params.set(k, Array.isArray(v) ? v[0] : v)
    }
  }
  for (const [k, v] of Object.entries(overrides)) {
    if (v !== null) params.set(k, v)
  }
  const str = params.toString()
  return str ? `?${str}` : ''
}

async function getAnnouncements(
  _statusFilter: AnnouncementStatus | 'all',
  _sort: SortKey,
): Promise<AnnouncementRow[]> {
  // TODO: connect Supabase
  // const { createStaffAdminClient } = await import('@/lib/admin/staff-supabase')
  // const staff = await createStaffAdminClient()
  // if (!staff.ok) return []
  // let query = staff.supabase
  //   .from('announcements')
  //   .select('id, title, status, scheduled_start, scheduled_end, impressions, clicks, dismissals, last_shown_at, trigger_type, created_at')
  // if (statusFilter !== 'all') query = query.eq('status', statusFilter)
  // if (sort === 'impressions') query = query.order('impressions', { ascending: false })
  // else if (sort === 'status') query = query.order('status', { ascending: true }).order('created_at', { ascending: false })
  // else query = query.order('created_at', { ascending: false })
  // const { data } = await query
  // return (data as unknown as AnnouncementRow[]) ?? []
  return []
}

export default async function AnnouncementsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; status?: string }>
}) {
  const params = await searchParams
  const sort = parseSort(params.sort)
  const statusFilter = parseStatusFilter(params.status)

  const announcements = await getAnnouncements(statusFilter, sort)

  const activeAnnouncements = announcements.filter((a) => a.status === 'active')
  const totalActiveImpressions = activeAnnouncements.reduce((sum, a) => sum + (a.impressions ?? 0), 0)
  const totalActiveClicks = activeAnnouncements.reduce((sum, a) => sum + (a.clicks ?? 0), 0)
  const totalDismissals = announcements.reduce((sum, a) => sum + (a.dismissals ?? 0), 0)

  const bestPerformer = [...announcements]
    .filter((a) => (a.impressions ?? 0) >= 10)
    .sort((a, b) => (b.clicks / b.impressions) - (a.clicks / a.impressions))[0]

  const sortLink = (key: SortKey, label: string) => {
    const active = sort === key
    const href = `/admin/announcements${buildAdminQuery(params, { sort: active && key !== 'created_at' ? null : key === 'created_at' ? null : key })}`
    return (
      <Link
        href={href}
        className={`inline-flex items-center gap-1 hover:text-[#1B3A5C] ${active ? 'text-[#1B3A5C]' : ''}`}
      >
        {label}
        <ArrowUpDown size={12} className={active ? 'opacity-100' : 'opacity-40'} />
      </Link>
    )
  }

  const statusFilterLink = (value: AnnouncementStatus | 'all', label: string) => {
    const active = statusFilter === value
    const href = `/admin/announcements${buildAdminQuery(params, { status: active ? null : value === 'all' ? null : value })}`
    return (
      <Link
        href={href}
        className={`px-3 py-1 rounded-full text-xs font-semibold border ${
          active ? 'bg-[#1B3A5C] text-white border-[#1B3A5C]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
        }`}
      >
        {label}
      </Link>
    )
  }

  return (
    <div className="p-8">
      {/* Supabase stub notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-6">
        <p className="text-sm font-bold text-amber-800 mb-1">Supabase not yet connected</p>
        <p className="text-xs text-amber-700">
          Announcements will appear here once Supabase is wired up. See{' '}
          <code className="font-mono bg-amber-100 px-1 rounded">src/app/admin/announcements/page.tsx</code>{' '}
          for the stubbed query.
        </p>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: '#1B3A5C' }}>Announcements</h1>
          <p className="text-gray-500 text-sm">{announcements.length} announcement{announcements.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/admin/announcements/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm text-white"
          style={{ backgroundColor: '#1B3A5C' }}
        >
          <Plus size={16} /> New Announcement
        </Link>
      </div>

      {announcements.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
            {[
              { label: 'Active', value: activeAnnouncements.length, color: '#16a34a' },
              { label: 'Impressions', value: totalActiveImpressions.toLocaleString(), color: '#1B3A5C' },
              { label: 'Clicks', value: totalActiveClicks.toLocaleString(), color: '#3b82f6' },
              { label: 'CTR', value: formatCtr(totalActiveClicks, totalActiveImpressions), color: '#d97706' },
              { label: 'Dismiss rate', value: formatDismissRate(totalDismissals, totalActiveImpressions), color: '#7c3aed' },
              {
                label: 'Best CTR',
                value: bestPerformer ? formatCtr(bestPerformer.clicks, bestPerformer.impressions) : '—',
                color: '#0891b2',
              },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white rounded-xl border border-gray-100 p-4">
                <p className="text-2xl font-bold" style={{ color }}>{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            ))}
          </div>

          {bestPerformer && (
            <div className="mb-6 flex items-center gap-2 text-sm text-gray-600 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
              <Trophy size={16} className="text-blue-700" />
              <span>
                Top performer: <strong>{bestPerformer.title}</strong> ({formatCtr(bestPerformer.clicks, bestPerformer.impressions)} CTR)
              </span>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            {statusFilterLink('all', 'All')}
            {statusFilterLink('active', 'Active')}
            {statusFilterLink('draft', 'Draft')}
            {statusFilterLink('paused', 'Paused')}
            {statusFilterLink('expired', 'Expired')}
          </div>
        </>
      )}

      {announcements.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
          <Megaphone size={40} className="mx-auto mb-4 text-gray-300" />
          <p className="font-semibold mb-1" style={{ color: '#1B3A5C' }}>No announcements yet</p>
          <p className="text-sm text-gray-500 mb-6">Create an announcement to notify families about center closures, events, or holiday schedules.</p>
          <Link
            href="/admin/announcements/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm text-white"
            style={{ backgroundColor: '#1B3A5C' }}
          >
            <Plus size={16} /> Create Announcement
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="text-left px-5 py-3 font-semibold">Title</th>
                <th className="text-left px-5 py-3 font-semibold">{sortLink('status', 'Status')}</th>
                <th className="text-left px-5 py-3 font-semibold hidden md:table-cell">Schedule</th>
                <th className="text-left px-5 py-3 font-semibold hidden lg:table-cell">Trigger</th>
                <th className="text-right px-5 py-3 font-semibold hidden sm:table-cell">{sortLink('impressions', 'Impr.')}</th>
                <th className="text-right px-5 py-3 font-semibold hidden sm:table-cell">CTR</th>
                <th className="text-right px-5 py-3 font-semibold hidden xl:table-cell">Dismiss %</th>
                <th className="text-left px-5 py-3 font-semibold hidden xl:table-cell">Last shown</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {announcements.map((announcement) => (
                <tr key={announcement.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-5 py-3 font-semibold" style={{ color: '#1B3A5C' }}>{announcement.title}</td>
                  <td className="px-5 py-3">
                    <span
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold text-white capitalize"
                      style={{ backgroundColor: statusColors[announcement.status] ?? '#6b7280' }}
                    >
                      {announcement.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs hidden md:table-cell">
                    {announcement.scheduled_start
                      ? `${new Date(announcement.scheduled_start).toLocaleDateString()} → ${announcement.scheduled_end ? new Date(announcement.scheduled_end).toLocaleDateString() : '∞'}`
                      : 'Always'}
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs capitalize hidden lg:table-cell">
                    {(announcement.trigger_type ?? 'scroll').replace('_', ' ')}
                  </td>
                  <td className="px-5 py-3 text-gray-700 text-xs text-right tabular-nums hidden sm:table-cell">
                    {(announcement.impressions ?? 0).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-gray-700 text-xs text-right tabular-nums hidden sm:table-cell">
                    {formatCtr(announcement.clicks ?? 0, announcement.impressions ?? 0)}
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs text-right tabular-nums hidden xl:table-cell">
                    {formatDismissRate(announcement.dismissals ?? 0, announcement.impressions ?? 0)}
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs hidden xl:table-cell">
                    {announcement.last_shown_at ? new Date(announcement.last_shown_at).toLocaleString() : '—'}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <AnnouncementListActions id={announcement.id} status={announcement.status} />
                      <a
                        href={`/?announcement_preview=${announcement.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Staff preview"
                        className="p-2 rounded-lg text-gray-500 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <ExternalLink size={15} />
                      </a>
                      <Link href={`/admin/announcements/${announcement.id}`} className="p-2 rounded-lg text-gray-400 hover:text-blue-700 hover:bg-blue-50">
                        <ChevronRight size={18} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
