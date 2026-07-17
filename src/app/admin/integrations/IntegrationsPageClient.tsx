'use client'
import { useEffect, useState } from 'react'
import { ExternalLink, Plug, CheckCircle2, AlertCircle } from 'lucide-react'
import type { IntegrationLink } from '@/lib/integrations/config'

export default function IntegrationsPageClient() {
  const [integrations, setIntegrations] = useState<IntegrationLink[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: connect Supabase — fetch from /api/admin/integrations/status
    fetch('/api/admin/integrations/status')
      .then((r) => r.json())
      .then((d) => { setIntegrations(d.integrations ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const categories = ['email', 'content', 'social', 'cache', 'database'] as const

  const byCategory = (cat: string) => integrations.filter((i) => i.category === cat)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0f4f8' }}>
      <div className="px-8 py-6 border-b" style={{ background: 'linear-gradient(135deg, #0a3d2e 0%, #1a6b4f 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <Plug className="w-6 h-6 text-white" />
            <h1 className="text-2xl font-bold text-white">Integrations</h1>
          </div>
          <p className="text-sm text-green-200 mt-1 ml-9">API connections and third-party service status</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-6 space-y-8">
        {loading && (
          <div className="text-center py-16 text-gray-400 text-sm">Loading integration status…</div>
        )}

        {!loading && integrations.length === 0 && (
          <div className="text-center py-16">
            <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Could not load integration status. Check that <code className="font-mono">/api/admin/integrations/status</code> is implemented.</p>
          </div>
        )}

        {!loading && integrations.length > 0 && categories.map((cat) => {
          const items = byCategory(cat)
          if (items.length === 0) return null
          return (
            <div key={cat}>
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{cat}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((integration) => (
                  <div key={integration.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className={`px-5 py-4 flex items-center justify-between ${integration.configured ? 'bg-green-50' : integration.status === 'optional' ? 'bg-gray-50' : 'bg-red-50'}`}>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{integration.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{integration.description}</p>
                      </div>
                      {integration.configured ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                      ) : (
                        <AlertCircle className={`w-5 h-5 shrink-0 ${integration.status === 'optional' ? 'text-gray-300' : 'text-red-400'}`} />
                      )}
                    </div>
                    <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          integration.configured ? 'bg-green-100 text-green-700' :
                          integration.status === 'optional' ? 'bg-gray-100 text-gray-500' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {integration.configured ? 'Configured' : integration.status === 'optional' ? 'Optional' : 'Missing'}
                        </span>
                        {integration.envKeys.slice(0, 1).map((k) => (
                          <code key={k} className="text-xs text-gray-400 font-mono hidden sm:inline">{k}</code>
                        ))}
                      </div>
                      <a
                        href={integration.consoleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        Console <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    {integration.setupHint && !integration.configured && (
                      <div className="px-5 py-3 border-t border-gray-50 bg-amber-50 text-xs text-amber-700">
                        {integration.setupHint}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
