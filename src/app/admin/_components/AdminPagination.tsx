import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const NAVY = '#1B3A5C'
const ADMIN_PAGE_SIZE = 25

// ── Pagination helpers (inlined) ──────────────────────────────────────────────
function totalPages(total: number): number {
  return Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE))
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

// ── Component ─────────────────────────────────────────────────────────────────
type AdminPaginationProps = {
  basePath: string
  page: number
  total: number
  searchParams: Record<string, string | string[] | undefined>
}

export function AdminPagination({ basePath, page, total, searchParams }: AdminPaginationProps) {
  const pages = totalPages(total)
  const { from, to } = paginationRange(page, total)

  if (total === 0) return null

  const prevHref =
    page > 1
      ? `${basePath}${buildAdminQuery(searchParams, { page: page === 2 ? null : String(page - 1) })}`
      : null
  const nextHref =
    page < pages
      ? `${basePath}${buildAdminQuery(searchParams, { page: String(page + 1) })}`
      : null

  const windowStart = Math.max(1, page - 2)
  const windowEnd = Math.min(pages, page + 2)
  const pageNumbers: number[] = []
  for (let i = windowStart; i <= windowEnd; i++) pageNumbers.push(i)

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-t border-gray-100 bg-gray-50/50">
      <p className="text-xs text-gray-500">
        Showing {from}–{to} of {total}
        <span className="hidden sm:inline text-gray-400"> · {ADMIN_PAGE_SIZE} per page</span>
      </p>
      <div className="flex items-center gap-1">
        {prevHref ? (
          <Link
            href={prevHref}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-white"
          >
            <ChevronLeft size={14} /> Prev
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-gray-100 text-gray-300 cursor-not-allowed">
            <ChevronLeft size={14} /> Prev
          </span>
        )}
        {windowStart > 1 && (
          <>
            <Link
              href={`${basePath}${buildAdminQuery(searchParams, { page: null })}`}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-white"
            >
              1
            </Link>
            {windowStart > 2 && <span className="px-1 text-gray-400 text-xs">…</span>}
          </>
        )}
        {pageNumbers.map((n) =>
          n === page ? (
            <span
              key={n}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white"
              style={{ backgroundColor: NAVY }}
            >
              {n}
            </span>
          ) : (
            <Link
              key={n}
              href={`${basePath}${buildAdminQuery(searchParams, { page: n === 1 ? null : String(n) })}`}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-white"
            >
              {n}
            </Link>
          )
        )}
        {windowEnd < pages && (
          <>
            {windowEnd < pages - 1 && <span className="px-1 text-gray-400 text-xs">…</span>}
            <Link
              href={`${basePath}${buildAdminQuery(searchParams, { page: String(pages) })}`}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-white"
            >
              {pages}
            </Link>
          </>
        )}
        {nextHref ? (
          <Link
            href={nextHref}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-white"
          >
            Next <ChevronRight size={14} />
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-gray-100 text-gray-300 cursor-not-allowed">
            Next <ChevronRight size={14} />
          </span>
        )}
      </div>
    </div>
  )
}
