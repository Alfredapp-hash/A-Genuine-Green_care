'use client'
// ─────────────────────────────────────────────────────────────────────────────
// Developer Setup Screen — /admin/social/setup
// Shows which environment variables are configured (presence only, no values).
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react'
import Link from 'next/link'

type PlatformStatus = {
  platform: string
  label: string
  mode: 'live' | 'mock' | 'setup_needed'
  credentialKeys: string[]
  configured: boolean
}

type SetupData = {
  globalMode: string
  mockAllowed: boolean
  platforms: PlatformStatus[]
}

const CREDENTIAL_GROUPS = [
  {
    title: 'Facebook & Instagram (Meta)',
    description: 'Required for both Facebook Page and Instagram Business connectors. Create an app at developers.facebook.com.',
    keys: ['META_APP_ID', 'META_APP_SECRET', 'META_REDIRECT_URI'],
    docsUrl: 'https://developers.facebook.com/docs/facebook-login/',
    platforms: ['facebook', 'instagram'],
  },
  {
    title: 'LinkedIn',
    description: 'Required for LinkedIn Page publishing. Create an app at linkedin.com/developers.',
    keys: ['LINKEDIN_CLIENT_ID', 'LINKEDIN_CLIENT_SECRET', 'LINKEDIN_REDIRECT_URI'],
    docsUrl: 'https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow',
    platforms: ['linkedin'],
  },
  {
    title: 'Google (YouTube + Google Business Profile)',
    description: 'Shared credentials for YouTube and Google Business Profile. Create OAuth app in Google Cloud Console.',
    keys: ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REDIRECT_URI'],
    docsUrl: 'https://console.cloud.google.com/',
    platforms: ['youtube', 'google_business_profile'],
  },
]

const OPTIONAL_VARS = [
  { key: 'SOCIAL_CONNECTORS_MODE', description: '"mock" or "live" — defaults to auto-detect from credentials' },
  { key: 'SOCIAL_TOKEN_ENCRYPTION_KEY', description: '32+ character key for AES-GCM token encryption' },
  { key: 'SOCIAL_WEBHOOK_SECRET', description: 'Secret for verifying inbound platform webhooks' },
  { key: 'SOCIAL_CALLBACK_BASE_URL', description: 'Base URL for OAuth redirect URIs' },
]

const MODE_BADGE: Record<string, { label: string; cls: string }> = {
  live:         { label: '✓ Live', cls: 'bg-green-100 text-green-700 border border-green-200' },
  mock:         { label: '◎ Mock', cls: 'bg-purple-100 text-purple-700 border border-purple-200' },
  setup_needed: { label: '⚙ Setup Needed', cls: 'bg-orange-100 text-orange-700 border border-orange-200' },
}

export default function SocialSetupPage() {
  const [data, setData] = useState<SetupData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: connect Supabase — fetch from /api/social/setup
    fetch('/api/social/setup')
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  function getPlatformMode(platform: string): PlatformStatus | undefined {
    return data?.platforms.find((p) => p.platform === platform)
  }

  function isGroupConfigured(keys: string[]): boolean {
    if (!data) return false
    return keys.every((k) =>
      data.platforms.some((p) => p.credentialKeys.includes(k) && p.configured)
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0f4f8' }}>
      {/* Header */}
      <div className="px-8 py-6 border-b" style={{ background: 'linear-gradient(135deg, #0a3d2e 0%, #1a6b4f 100%)' }}>
        <div className="max-w-4xl mx-auto">
          <Link href="/admin/social/accounts" className="text-xs text-green-300 hover:text-white mb-3 flex items-center gap-1 transition-colors">← Account Settings</Link>
          <Link href="/admin/integrations" className="text-xs text-green-300 hover:text-white mb-3 flex items-center gap-1 transition-colors ml-4">Integrations hub →</Link>
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚙</span>
            <div>
              <h1 className="text-2xl font-bold text-white">Social Connector Setup</h1>
              <p className="text-sm text-green-200 mt-0.5">Configure API credentials for each platform</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-6 space-y-6">
        {/* Global status */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-5">
          <div className="flex items-center justify-between mb-3">
            <p className="font-bold text-gray-900">Global Connector Mode</p>
            {data && (
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${MODE_BADGE[data.globalMode]?.cls ?? 'bg-gray-100 text-gray-500'}`}>
                {MODE_BADGE[data.globalMode]?.label ?? data.globalMode}
              </span>
            )}
            {loading && <span className="text-xs text-gray-400">Loading…</span>}
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Set <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-xs">SOCIAL_CONNECTORS_MODE=live</code> to force live mode,
            or <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-xs">mock</code> to force mock mode.
            When not set, the system auto-detects based on which credentials are present.
          </p>
          {data && (
            <p className="text-xs mt-2">
              <span className={`font-semibold ${data.mockAllowed ? 'text-purple-700' : 'text-gray-400'}`}>
                {data.mockAllowed ? '✓ Mock Connect available' : '✕ Mock Connect disabled in production'}
              </span>
            </p>
          )}
        </div>

        {/* Security note */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 text-xs text-amber-800 space-y-1">
          <p className="font-bold text-sm">Security rules — never break these</p>
          <ul className="list-disc list-inside space-y-0.5 text-amber-700">
            <li>Never commit <code className="font-mono">.env.local</code> to git</li>
            <li>Never expose client secrets or tokens in frontend code</li>
            <li>Never store provider tokens in <code className="font-mono">localStorage</code> or browser cookies</li>
            <li>Always set <code className="font-mono">SOCIAL_TOKEN_ENCRYPTION_KEY</code> in production</li>
            <li>Use HTTPS-only <code className="font-mono">REDIRECT_URI</code> values in production OAuth apps</li>
          </ul>
        </div>

        {/* Credential groups */}
        {CREDENTIAL_GROUPS.map((group) => {
          const configured = isGroupConfigured(group.keys)
          return (
            <div key={group.title} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className={`px-6 py-4 flex items-center justify-between border-b ${configured ? 'bg-green-50 border-green-100' : 'bg-orange-50 border-orange-100'}`}>
                <div>
                  <p className="font-bold text-gray-900">{group.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{group.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {group.platforms.map((p) => {
                    const ps = getPlatformMode(p)
                    const badge = MODE_BADGE[ps?.mode ?? 'setup_needed']
                    return (
                      <span key={p} className={`text-xs font-bold px-2 py-0.5 rounded-full ${badge.cls}`}>
                        {badge.label}
                      </span>
                    )
                  })}
                </div>
              </div>

              <div className="px-6 py-4 space-y-2">
                {group.keys.map((key) => (
                  <div key={key} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                    <code className="font-mono text-xs text-gray-800 font-semibold">{key}</code>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${configured ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {configured ? '✓ Configured' : '✕ Missing'}
                    </span>
                  </div>
                ))}
                <div className="pt-2">
                  <a href={group.docsUrl} target="_blank" rel="noopener noreferrer"
                    className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
                    View provider documentation →
                  </a>
                </div>
              </div>
            </div>
          )
        })}

        {/* Optional variables */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <p className="font-bold text-gray-900">Optional Variables</p>
            <p className="text-xs text-gray-500 mt-0.5">Recommended for production security and control</p>
          </div>
          <div className="px-6 py-4 space-y-3">
            {OPTIONAL_VARS.map((v) => (
              <div key={v.key} className="flex items-start gap-3">
                <code className="font-mono text-xs text-gray-800 font-semibold shrink-0 mt-0.5 w-56">{v.key}</code>
                <p className="text-xs text-gray-500">{v.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quickstart */}
        <div className="bg-[#0a3d2e] rounded-2xl px-6 py-5 text-white">
          <p className="font-bold mb-2 text-sm">Quickstart</p>
          <ol className="text-xs text-green-200 space-y-1.5 list-decimal list-inside">
            <li>Copy <code className="font-mono text-white bg-white/10 px-1 rounded">.env.example</code> to <code className="font-mono text-white bg-white/10 px-1 rounded">.env.local</code></li>
            <li>Fill in credentials from your provider developer consoles</li>
            <li>Add the same variables to your Vercel / Netlify environment settings</li>
            <li>Redeploy — connectors will switch from mock to live automatically</li>
            <li>Click <strong className="text-white">Connect</strong> on each platform card to complete OAuth</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
