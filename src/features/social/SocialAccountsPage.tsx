'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { getSocialAccounts, mockConnectAccount, mockDisconnectAccount, updateSocialAccount } from './socialStore'
import type { SocialAccount, SocialPlatform } from './types'
import { PLATFORM_LABELS, PLATFORM_COLORS } from './types'
import SocialAccountSelectionModal from './components/SocialAccountSelectionModal'

// ── Types for server-side connector status ────────────────────────────────────
type PlatformSetupStatus = {
  platform: SocialPlatform
  label: string
  mode: 'live' | 'mock' | 'setup_needed'
  credentialKeys: string[]
  configured: boolean
}

type SetupConfig = {
  globalMode: string
  mockAllowed: boolean
  platforms: PlatformSetupStatus[]
}

// ── Status display config ─────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; pill: string; icon: string }> = {
  connected:     { label: 'Connected',        pill: 'bg-green-100 text-green-700',   icon: '✓' },
  not_connected: { label: 'Not Connected',    pill: 'bg-gray-100 text-gray-500',    icon: '○' },
  expired:       { label: 'Token Expired',    pill: 'bg-orange-100 text-orange-700', icon: '⚠' },
  error:         { label: 'Connection Error', pill: 'bg-red-100 text-red-700',      icon: '✕' },
  needs_reauth:  { label: 'Needs Reconnect',  pill: 'bg-amber-100 text-amber-700',  icon: '⚠' },
  setup_needed:  { label: 'Setup Needed',     pill: 'bg-purple-100 text-purple-700', icon: '⚙' },
  disabled:      { label: 'Disabled',         pill: 'bg-gray-100 text-gray-400',    icon: '—' },
}

const PLATFORM_ICONS: Record<SocialPlatform, string> = {
  facebook: 'f',
  instagram: '◎',
  linkedin: 'in',
  youtube: '▶',
  google_business_profile: 'G',
  x: 'X',
  tiktok: '♪',
  pinterest: 'P',
  threads: '@',
}

const PLATFORM_CAPABILITIES: Record<SocialPlatform, string[]> = {
  facebook:              ['Text posts', 'Images', 'Link previews', 'Scheduling'],
  instagram:             ['Photo posts', 'Reels', 'Professional account required'],
  linkedin:              ['Text posts', 'Article links', 'Image posts'],
  youtube:               ['Video uploads', 'Channel management'],
  google_business_profile: ['Local updates', 'Event posts', 'Photos', 'Maps visibility'],
  x:                     ['Short posts', 'Images', 'Thread support'],
  tiktok:                ['Short video', 'Captions', 'Hashtags'],
  pinterest:             ['Pins', 'Images', 'Link destinations'],
  threads:               ['Text posts', 'Images', 'Cross-post from Instagram'],
}

const ALL_PLATFORMS: SocialPlatform[] = ['facebook', 'instagram', 'linkedin', 'youtube', 'google_business_profile']

export default function SocialAccountsPage() {
  const searchParams = useSearchParams()
  const [accounts, setAccounts] = useState<SocialAccount[]>(() => getSocialAccounts())
  const [setupConfig, setSetupConfig] = useState<SetupConfig | null>(null)
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({})
  const [actionMessage, setActionMessage] = useState<{ id: string; msg: string; type: 'success' | 'error' } | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editFields, setEditFields] = useState<Partial<SocialAccount>>({})
  const [expandedDetails, setExpandedDetails] = useState<Set<string>>(new Set())
  const [selectionModal, setSelectionModal] = useState<{ accountId: string; platform: SocialPlatform; options: unknown[] } | null>(() => {
    const select = searchParams.get('select')
    const platform = searchParams.get('platform') as SocialPlatform | null
    const accountId = searchParams.get('accountId')
    const options = searchParams.get('options')
    if (select === '1' && platform && accountId && options) {
      try { return { accountId, platform, options: JSON.parse(decodeURIComponent(options)) } } catch { /* ignore */ }
    }
    return null
  })

  useEffect(() => {
    // TODO: connect Supabase — fetch from /api/social/setup
    fetch('/api/social/setup').then((r) => r.json()).then(setSetupConfig).catch(() => null)
  }, [])

  useEffect(() => {
    const connected = searchParams.get('connected')
    const error = searchParams.get('error')
    const platform = searchParams.get('platform') as SocialPlatform | null

    if (connected && platform) {
      showMessage(platform, `✓ ${PLATFORM_LABELS[platform]} connected successfully.`, 'success')
    }
    if (error) {
      const plat = platform ?? 'unknown'
      showMessage(plat, `Connection failed: ${error.replace(/_/g, ' ')}`, 'error')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function showMessage(id: string, msg: string, type: 'success' | 'error') {
    setActionMessage({ id, msg, type })
    setTimeout(() => setActionMessage(null), 5000)
  }

  function refresh() { setAccounts(getSocialAccounts()) }

  const setLoading = useCallback((id: string, val: boolean) => {
    setActionLoading((prev) => ({ ...prev, [id]: val }))
  }, [])

  function handleConnect(platform: SocialPlatform, mock = false) {
    const url = mock
      ? `/api/social/oauth/${platform}/start?mock=1`
      : `/api/social/oauth/${platform}/start`
    window.location.href = url
  }

  async function handleValidate(account: SocialAccount) {
    setLoading(account.id, true)
    try {
      const res = await fetch(`/api/social/accounts/${account.id}/validate`, { method: 'POST' })
      const data = await res.json() as { valid: boolean; errorMessage?: string }
      showMessage(account.id, data.valid ? '✓ Connection validated.' : `Validation failed: ${data.errorMessage ?? 'unknown error'}`, data.valid ? 'success' : 'error')
      refresh()
    } catch { showMessage(account.id, 'Validation request failed.', 'error') }
    finally { setLoading(account.id, false) }
  }

  async function handleRefreshToken(account: SocialAccount) {
    setLoading(account.id, true)
    try {
      const res = await fetch(`/api/social/accounts/${account.id}/refresh`, { method: 'POST' })
      const data = await res.json() as { success: boolean; error?: string }
      showMessage(account.id, data.success ? '✓ Token refreshed.' : `Refresh failed: ${data.error}`, data.success ? 'success' : 'error')
      refresh()
    } catch { showMessage(account.id, 'Token refresh failed.', 'error') }
    finally { setLoading(account.id, false) }
  }

  async function handleDisconnect(account: SocialAccount) {
    if (!confirm(`Disconnect ${PLATFORM_LABELS[account.platform]}? This will revoke access.`)) return
    setLoading(account.id, true)
    try {
      const res = await fetch(`/api/social/accounts/${account.id}/disconnect`, { method: 'POST' })
      if (res.ok) {
        mockDisconnectAccount(account.id)
        showMessage(account.id, `${PLATFORM_LABELS[account.platform]} disconnected.`, 'success')
        refresh()
      }
    } catch { showMessage(account.id, 'Disconnect failed.', 'error') }
    finally { setLoading(account.id, false) }
  }

  function handleMockConnect(account: SocialAccount) {
    mockConnectAccount(account.id)
    showMessage(account.id, '✓ Mock connection applied (dev mode only).', 'success')
    refresh()
  }

  function getPlatformSetup(platform: SocialPlatform): PlatformSetupStatus | undefined {
    return setupConfig?.platforms.find((p) => p.platform === platform)
  }

  function toggleDetails(id: string) {
    setExpandedDetails((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  function renderPlatformCard(platform: SocialPlatform) {
    const account = accounts.find((a) => a.platform === platform)
    const setup = getPlatformSetup(platform)
    const color = PLATFORM_COLORS[platform]
    const loading = actionLoading[account?.id ?? platform] ?? false
    const isConnected = account?.connectionStatus === 'connected'
    const status = account?.connectionStatus as string | undefined
    const needsAction = status === 'expired' || status === 'error' || status === 'needs_reauth'
    const statusCfg = STATUS_CONFIG[account?.connectionStatus ?? 'not_connected'] ?? STATUS_CONFIG.not_connected
    const isExpanded = expandedDetails.has(platform)
    const msg = actionMessage?.id === (account?.id ?? platform) ? actionMessage : null
    const isMockMode = setupConfig?.globalMode === 'mock' || setup?.mode === 'mock'
    const isSetupNeeded = !setup?.configured && setup?.mode === 'setup_needed'
    const mockAllowed = setupConfig?.mockAllowed ?? true
    const caps = PLATFORM_CAPABILITIES[platform] ?? []
    const editing = editingId === account?.id

    return (
      <div key={platform} className={`bg-white rounded-2xl border overflow-hidden shadow-sm transition-all ${isConnected ? 'border-green-200' : needsAction ? 'border-amber-200' : 'border-gray-200'}`}>
        {/* Card header */}
        <div className="px-5 py-4 flex items-center justify-between" style={{ backgroundColor: color + '0d' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm"
              style={{ backgroundColor: color }}
            >
              {PLATFORM_ICONS[platform]}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">{PLATFORM_LABELS[platform]}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${statusCfg.pill}`}>
                  {statusCfg.icon} {statusCfg.label}
                </span>
                {isMockMode && (
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-600">Mock Mode</span>
                )}
                {isSetupNeeded && (
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-600">Setup Required</span>
                )}
              </div>
            </div>
          </div>

          {account && isConnected && (
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-gray-400">Active</span>
              <button
                onClick={() => { updateSocialAccount(account.id, { enabled: !account.enabled }); refresh() }}
                className={`relative w-9 h-5 rounded-full transition-colors ${account.enabled ? 'bg-green-600' : 'bg-gray-200'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${account.enabled ? 'left-4' : 'left-0.5'}`} />
              </button>
            </div>
          )}
        </div>

        {/* Main body */}
        <div className="px-5 py-4 space-y-3">
          {account && isConnected && (
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Account Name</p>
                {editing ? (
                  <input
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
                    value={editFields.accountName ?? ''}
                    onChange={(e) => setEditFields((f) => ({ ...f, accountName: e.target.value }))}
                  />
                ) : (
                  <p className="text-sm font-semibold text-gray-800">{account.accountName}</p>
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Handle</p>
                {editing ? (
                  <input
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
                    value={editFields.accountHandle ?? ''}
                    placeholder="@handle"
                    onChange={(e) => setEditFields((f) => ({ ...f, accountHandle: e.target.value }))}
                  />
                ) : (
                  <p className="text-sm text-gray-500">{account.accountHandle ?? '—'}</p>
                )}
              </div>
            </div>
          )}

          {!isConnected && (
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">What this connector can do</p>
              <div className="flex flex-wrap gap-1.5">
                {caps.map((c) => (
                  <span key={c} className="text-xs px-2.5 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-600">{c}</span>
                ))}
              </div>
            </div>
          )}

          {account?.lastError && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 text-xs text-red-700 flex items-start gap-2">
              <span className="shrink-0 font-bold">⚠</span>
              <span>{account.lastError}</span>
            </div>
          )}

          {isSetupNeeded && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl px-3 py-2.5 text-xs text-orange-700">
              <strong>API credentials not configured.</strong> Add environment variables to enable live connections.{' '}
              <Link href="/admin/social/setup" className="underline font-bold hover:text-orange-800">View Setup Guide →</Link>
            </div>
          )}

          {msg && (
            <div className={`rounded-xl px-3 py-2.5 text-xs font-semibold ${msg.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
              {msg.msg}
            </div>
          )}

          {account && isConnected && (
            <button
              onClick={() => toggleDetails(platform)}
              className="text-xs font-semibold text-gray-400 hover:text-gray-600 flex items-center gap-1"
            >
              {isExpanded ? '▲ Hide' : '▼ Show'} connection details
            </button>
          )}

          {isExpanded && account && (
            <div className="grid sm:grid-cols-2 gap-2 pt-1 text-xs text-gray-500 border-t border-gray-100">
              <div><span className="font-semibold">Connected:</span> {account.connectedAt ? new Date(account.connectedAt).toLocaleDateString() : '—'}</div>
              <div><span className="font-semibold">Last post:</span> {account.lastSuccessfulPostAt ? new Date(account.lastSuccessfulPostAt).toLocaleDateString() : '—'}</div>
              <div className="sm:col-span-2"><span className="font-semibold">Platform:</span> {platform}</div>
            </div>
          )}
        </div>

        {/* Action footer */}
        <div className="px-5 py-3.5 border-t border-gray-100 bg-gray-50 flex flex-wrap items-center gap-2">
          {account && editing ? (
            <>
              <button onClick={() => { updateSocialAccount(account.id, editFields); setEditingId(null); refresh() }}
                className="text-xs px-3 py-2 rounded-lg font-bold text-white bg-green-600 hover:bg-green-700 transition-colors">Save</button>
              <button onClick={() => setEditingId(null)}
                className="text-xs px-3 py-2 rounded-lg font-semibold border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
            </>
          ) : (
            <>
              {!isConnected && !isSetupNeeded && (
                <button
                  onClick={() => handleConnect(platform, false)}
                  disabled={loading}
                  className="text-xs px-4 py-2 rounded-lg font-bold text-white transition-all hover:scale-105 disabled:opacity-50"
                  style={{ backgroundColor: color }}
                >
                  {loading ? 'Connecting…' : `Connect ${PLATFORM_LABELS[platform]}`}
                </button>
              )}

              {isSetupNeeded && (
                <Link href="/admin/social/setup"
                  className="text-xs px-4 py-2 rounded-lg font-bold bg-orange-100 text-orange-700 border border-orange-200 hover:bg-orange-200 transition-colors">
                  ⚙ Setup Credentials
                </Link>
              )}

              {isConnected && (
                <>
                  <button onClick={() => handleValidate(account!)} disabled={loading}
                    className="text-xs px-3 py-2 rounded-lg font-semibold border border-gray-200 text-gray-700 hover:bg-white transition-colors disabled:opacity-50">
                    {loading ? '…' : '✓ Validate'}
                  </button>
                  <button onClick={() => handleRefreshToken(account!)} disabled={loading}
                    className="text-xs px-3 py-2 rounded-lg font-semibold border border-gray-200 text-gray-700 hover:bg-white transition-colors disabled:opacity-50">
                    {loading ? '…' : '↻ Refresh Token'}
                  </button>
                  <button onClick={() => handleConnect(platform, false)} disabled={loading}
                    className="text-xs px-3 py-2 rounded-lg font-semibold border border-gray-200 text-gray-700 hover:bg-white transition-colors disabled:opacity-50">
                    Reconnect
                  </button>
                  <button onClick={() => { setEditingId(account!.id); setEditFields({ accountName: account!.accountName, accountHandle: account!.accountHandle ?? '' }) }}
                    className="text-xs px-3 py-2 rounded-lg font-semibold border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors">
                    Edit Details
                  </button>
                  <button onClick={() => handleDisconnect(account!)} disabled={loading}
                    className="ml-auto text-xs px-3 py-2 rounded-lg font-semibold border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50">
                    Disconnect
                  </button>
                </>
              )}

              {needsAction && account && (
                <button onClick={() => handleConnect(platform, false)} disabled={loading}
                  className="text-xs px-4 py-2 rounded-lg font-bold text-white transition-all"
                  style={{ backgroundColor: color }}>
                  Reconnect
                </button>
              )}

              {mockAllowed && !isConnected && (
                <button
                  onClick={() => handleMockConnect(account ?? { id: platform, platform, accountName: PLATFORM_LABELS[platform], connectionStatus: 'not_connected', enabled: false })}
                  className="text-xs px-3 py-2 rounded-lg font-semibold border border-dashed border-purple-300 text-purple-600 hover:bg-purple-50 transition-colors"
                >
                  Mock Connect (dev)
                </button>
              )}
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0f4f8' }}>
      {/* Page header */}
      <div className="px-8 py-6 border-b" style={{ background: 'linear-gradient(135deg, #0a3d2e 0%, #1a6b4f 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <Link href="/admin/social" className="text-xs text-green-300 hover:text-white mb-3 flex items-center gap-1 transition-colors">← Social Publisher</Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔗</span>
              <div>
                <h1 className="text-2xl font-bold text-white">Social Account Settings</h1>
                <p className="text-sm text-green-200 mt-0.5">Connect and manage your social media publishing accounts</p>
              </div>
            </div>
            <Link href="/admin/social/setup"
              className="text-xs px-3 py-2 rounded-lg font-bold bg-white/10 text-white hover:bg-white/20 border border-white/20 transition-colors flex items-center gap-1.5">
              ⚙ Setup Guide
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-6 space-y-5">
        <div className="bg-green-900/5 border border-green-700/20 rounded-2xl px-5 py-4">
          <div className="flex items-start gap-3">
            <span className="text-green-700 text-lg shrink-0">🔒</span>
            <div>
              <p className="text-sm font-bold text-green-800 mb-1">Secure connector architecture</p>
              <p className="text-xs text-gray-600 leading-relaxed">
                OAuth tokens are stored server-side only and never sent to your browser. Real connections require provider API credentials configured as environment variables.{' '}
                {setupConfig && (
                  <span>
                    Current mode: <strong className={setupConfig.globalMode === 'live' ? 'text-green-700' : setupConfig.globalMode === 'mock' ? 'text-purple-700' : 'text-orange-700'}>
                      {setupConfig.globalMode}
                    </strong>.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {ALL_PLATFORMS.map(renderPlatformCard)}
        </div>
      </div>

      {selectionModal && (
        <SocialAccountSelectionModal
          platform={selectionModal.platform}
          options={selectionModal.options}
          accountId={selectionModal.accountId}
          onClose={() => setSelectionModal(null)}
          onSelected={() => { setSelectionModal(null); refresh() }}
        />
      )}
    </div>
  )
}
