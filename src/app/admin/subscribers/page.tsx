// TODO: connect Supabase — replace stub with real Supabase query
// Requires: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in env
import { Mail, Download } from 'lucide-react'

type NewsletterSubscriber = {
  id: string
  email: string
  name?: string | null
  created_at: string
  confirmed: boolean
}

async function getSubscribers(): Promise<NewsletterSubscriber[]> {
  // TODO: connect Supabase
  // const { createServiceRoleClient } = await import('@/lib/supabase/service-role')
  // const db = createServiceRoleClient()
  // const { data } = await db.from('newsletter_subscribers').select('*').order('created_at', { ascending: false })
  // return data ?? []
  return []
}

function toCsv(rows: NewsletterSubscriber[]): string {
  const header = 'id,email,name,created_at,confirmed'
  const lines = rows.map((r) =>
    [r.id, r.email, r.name ?? '', r.created_at, String(r.confirmed)].map((v) => `"${v}"`).join(',')
  )
  return [header, ...lines].join('\n')
}

export default async function SubscribersPage() {
  // TODO: connect Supabase — fetches empty until wired
  let subscribers: NewsletterSubscriber[] = []
  try {
    subscribers = await getSubscribers()
  } catch { /* empty data until Supabase is wired */ }

  const csv = toCsv(subscribers)
  const csvDataUrl = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0f4f8' }}>
      <div className="px-8 py-6 border-b" style={{ background: 'linear-gradient(135deg, #0a3d2e 0%, #1a6b4f 100%)' }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="w-6 h-6 text-white" />
            <div>
              <h1 className="text-2xl font-bold text-white">Newsletter Subscribers</h1>
              <p className="text-sm text-green-200 mt-0.5">{subscribers.length} subscribers</p>
            </div>
          </div>
          {subscribers.length > 0 && (
            <a
              href={csvDataUrl}
              download="subscribers.csv"
              className="flex items-center gap-2 text-xs px-4 py-2 rounded-lg font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </a>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-6">
        {/* Supabase stub notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-6">
          <p className="text-sm font-bold text-amber-800 mb-1">Supabase not yet connected</p>
          <p className="text-xs text-amber-700">
            Add <code className="font-mono bg-amber-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
            <code className="font-mono bg-amber-100 px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code> to your environment,
            then uncomment the Supabase query in <code className="font-mono bg-amber-100 px-1 rounded">src/app/admin/subscribers/page.tsx</code>.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {subscribers.length === 0 ? (
            <div className="py-20 text-center">
              <Mail className="w-10 h-10 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400 text-sm">No subscribers yet (or Supabase not connected).</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50">
                  <th className="text-left px-5 py-3">Email</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Name</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Confirmed</th>
                  <th className="text-left px-4 py-3">Subscribed</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((s) => (
                  <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-gray-900">{s.email}</td>
                    <td className="px-4 py-3.5 hidden md:table-cell text-gray-500">{s.name ?? '—'}</td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.confirmed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {s.confirmed ? 'Confirmed' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-400">
                      {new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
