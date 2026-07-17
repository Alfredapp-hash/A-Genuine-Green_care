import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { AdminPagination } from '@/app/admin/_components/AdminPagination'
import { AdminSearchForm } from '@/app/admin/_components/AdminSearchForm'

type InquiryStatus = 'new' | 'contacted' | 'enrolled' | 'waitlisted' | 'closed'

const INQUIRY_STATUSES: InquiryStatus[] = ['new', 'contacted', 'enrolled', 'waitlisted', 'closed']

const INQUIRY_STATUS_COLORS: Record<InquiryStatus, string> = {
  new:         '#1B3A5C',
  contacted:   '#5B8A5A',
  enrolled:    '#16a34a',
  waitlisted:  '#d97706',
  closed:      '#6b7280',
}

function formatInquiryStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ')
}

function isInquiryStatus(value: string): value is InquiryStatus {
  return INQUIRY_STATUSES.includes(value as InquiryStatus)
}

type InquiryRow = {
  id: string
  name: string
  email: string | null
  phone: string | null
  /** Program interest (e.g. "Infant Care", "Toddler Program") */
  type: string
  status: InquiryStatus
  created_at: string
  message: string | null
  utm_source?: string | null
  utm_medium?: string | null
  utm_campaign?: string | null
}

const ADMIN_PAGE_SIZE = 25

function parsePage(raw: string | undefined): number {
  const n = parseInt(raw ?? '1', 10)
  return isNaN(n) || n < 1 ? 1 : n
}

function paginationRange(page: number, total: number): { from: number; to: number } {
  const from = Math.min((page - 1) * ADMIN_PAGE_SIZE + 1, total)
  const to = Math.min(page * ADMIN_PAGE_SIZE, total)
  return { from, to }
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

async function getInquiries(
  _statusFilter: InquiryStatus | null,
  _searchQuery: string,
  _offset: number,
): Promise<{ rows: InquiryRow[]; total: number; grandTotal: number }> {
  // TODO: connect Supabase
  // const { getAdminDb } = await import('@/lib/admin/db')
  // const supabase = getAdminDb()
  // let dataQuery = supabase
  //   .from('inquiries')
  //   .select('id, name, email, phone, type, status, created_at, message, utm_source, utm_medium, utm_campaign')
  //   .order('created_at', { ascending: false })
  //   .range(offset, offset + ADMIN_PAGE_SIZE - 1)
  // let countQuery = supabase.from('inquiries').select('*', { count: 'exact', head: true })
  // if (statusFilter) { dataQuery = dataQuery.eq('status', statusFilter); countQuery = countQuery.eq('status', statusFilter) }
  // if (searchQuery) {
  //   const term = `%${searchQuery.replace(/[%_\\]/g, '\\$&')}%`
  //   dataQuery = dataQuery.or(`name.ilike.${term},email.ilike.${term},phone.ilike.${term}`)
  //   countQuery = countQuery.or(`name.ilike.${term},email.ilike.${term},phone.ilike.${term}`)
  // }
  // const [{ data }, { count: totalCount }] = await Promise.all([dataQuery, countQuery])
  // return { rows: (data as unknown as InquiryRow[]) ?? [], total: totalCount ?? 0, grandTotal: totalCount ?? 0 }
  return { rows: [], total: 0, grandTotal: 0 }
}

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>
}) {
  const params = await searchParams
  const { status: rawStatus, q: rawQ, page: rawPage } = params
  const statusFilter = rawStatus && isInquiryStatus(rawStatus) ? rawStatus : null
  const searchQuery = (rawQ ?? '').trim()
  const page = parsePage(rawPage)
  const offset = (page - 1) * ADMIN_PAGE_SIZE

  const { rows: inquiries, total: filteredTotal, grandTotal } = await getInquiries(statusFilter, searchQuery, offset)
  const { from, to } = paginationRange(page, filteredTotal)

  const filterParams: Record<string, string | string[] | undefined> = {
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(searchQuery ? { q: searchQuery } : {}),
  }

  return (
    <div className="p-8">
      {/* Supabase stub notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-6">
        <p className="text-sm font-bold text-amber-800 mb-1">Supabase not yet connected</p>
        <p className="text-xs text-amber-700">
          Inquiries will appear here once Supabase is wired. See{' '}
          <code className="font-mono bg-amber-100 px-1 rounded">src/app/admin/inquiries/page.tsx</code>.
        </p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1B3A5C' }}>Inquiries</h1>
          <p className="text-gray-500 text-sm">
            {filteredTotal} {statusFilter ? formatInquiryStatus(statusFilter) : searchQuery ? 'matching' : 'total'} inquir{filteredTotal !== 1 ? 'ies' : 'y'}
            {filteredTotal > 0 ? ` · showing ${from}–${to}` : ''}
            {(searchQuery || statusFilter) && filteredTotal !== grandTotal
              ? ` · ${grandTotal} total`
              : ''}
          </p>
        </div>
      </div>

      <AdminSearchForm
        basePath="/admin/inquiries"
        placeholder="Search by name, email, or phone…"
        query={searchQuery}
        searchParams={params}
      />

      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href={`/admin/inquiries${buildAdminQuery(filterParams, { status: null, page: null })}`}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
            !statusFilter ? 'text-white border-transparent' : 'text-gray-600 border-gray-200 hover:bg-gray-50'
          }`}
          style={!statusFilter ? { backgroundColor: '#1B3A5C' } : undefined}
        >
          All
        </Link>
        {INQUIRY_STATUSES.map((status) => {
          const active = statusFilter === status
          return (
            <Link
              key={status}
              href={
                active
                  ? `/admin/inquiries${buildAdminQuery(filterParams, { status: null, page: null })}`
                  : `/admin/inquiries${buildAdminQuery(filterParams, { status, page: null })}`
              }
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border capitalize transition-colors ${
                active ? 'text-white border-transparent' : 'text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
              style={active ? { backgroundColor: INQUIRY_STATUS_COLORS[status] } : undefined}
            >
              {formatInquiryStatus(status)}
            </Link>
          )
        })}
      </div>

      {inquiries.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: '#f4f6f9' }}>
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Contact</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Program Interest</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden xl:table-cell">Source</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {inquiries.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium" style={{ color: '#1B3A5C' }}>
                    {inquiry.name}
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                    {inquiry.phone ?? inquiry.email ?? '—'}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-xs capitalize px-2 py-1 rounded bg-gray-100 text-gray-600">
                      {inquiry.type.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs font-semibold px-2 py-1 rounded text-white capitalize"
                      style={{
                        backgroundColor: INQUIRY_STATUS_COLORS[inquiry.status as InquiryStatus] ?? '#6b7280',
                      }}
                    >
                      {formatInquiryStatus(inquiry.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs hidden lg:table-cell">
                    {new Date(inquiry.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 hidden xl:table-cell">
                    {inquiry.utm_source ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                        {inquiry.utm_source}{inquiry.utm_medium ? ` / ${inquiry.utm_medium}` : ''}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-300">organic</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/inquiries/${inquiry.id}`}
                      className="inline-flex items-center text-xs font-medium hover:underline"
                      style={{ color: '#1B3A5C' }}
                    >
                      View <ChevronRight size={12} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <AdminPagination
            basePath="/admin/inquiries"
            page={page}
            total={filteredTotal}
            searchParams={params}
          />
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm">
          <p className="text-gray-400">
            {searchQuery
              ? `No inquiries matching "${searchQuery}".`
              : statusFilter
                ? `No ${formatInquiryStatus(statusFilter)} inquiries.`
                : 'No inquiries yet. They\'ll appear here when families submit enrollment inquiry forms.'}
          </p>
        </div>
      )}
    </div>
  )
}
