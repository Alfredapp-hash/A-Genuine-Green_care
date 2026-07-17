import { Search, X } from 'lucide-react'

const NAVY = '#1B3A5C'

// ── Query helper (inlined) ────────────────────────────────────────────────────
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
type AdminSearchFormProps = {
  basePath: string
  placeholder: string
  query: string
  searchParams: Record<string, string | string[] | undefined>
}

export function AdminSearchForm({ basePath, placeholder, query, searchParams }: AdminSearchFormProps) {
  const clearHref = `${basePath}${buildAdminQuery(searchParams, { q: null, page: null })}`

  return (
    <form method="get" action={basePath} className="flex gap-2 mb-6">
      {searchParams.status && (
        <input type="hidden" name="status" value={String(searchParams.status)} />
      )}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder={placeholder}
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-[#1B3A5C]"
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
        style={{ backgroundColor: NAVY }}
      >
        Search
      </button>
      {query && (
        <a
          href={clearHref}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          <X size={14} /> Clear
        </a>
      )}
    </form>
  )
}
