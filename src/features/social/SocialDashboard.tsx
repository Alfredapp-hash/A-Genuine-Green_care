'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { SocialAccount, SocialCampaign, SocialPlatform } from './types'
import { PLATFORM_LABELS, PLATFORM_COLORS } from './types'
import { getSocialAccounts, getSocialCampaigns, mockConnectAccount, mockDisconnectAccount, updateSocialAccount } from './socialStore'

const CONN_PILL: Record<string, string> = {
  connected: 'bg-green-100 text-green-700',
  not_connected: 'bg-gray-100 text-gray-500',
  expired: 'bg-orange-100 text-orange-700',
  error: 'bg-red-100 text-red-700',
  disabled: 'bg-gray-100 text-gray-400',
}

const CAMP_STATUS_PILL: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600',
  ready: 'bg-blue-100 text-blue-700',
  scheduled: 'bg-purple-100 text-purple-700',
  partially_posted: 'bg-yellow-100 text-yellow-700',
  posted: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  archived: 'bg-gray-100 text-gray-400',
}

function PlatformDot({ platform }: { platform: SocialPlatform }) {
  return (
    <span
      className="inline-block w-2 h-2 rounded-full"
      style={{ backgroundColor: PLATFORM_COLORS[platform] }}
      title={PLATFORM_LABELS[platform]}
    />
  )
}

export default function SocialDashboard() {
  const [accounts, setAccounts] = useState<SocialAccount[]>(() => getSocialAccounts())
  const [campaigns, setCampaigns] = useState<SocialCampaign[]>(() => getSocialCampaigns())

  function refresh() {
    setAccounts(getSocialAccounts())
    setCampaigns(getSocialCampaigns())
  }

  const connected = accounts.filter((a) => a.connectionStatus === 'connected').length
  const draftCampaigns = campaigns.filter((c) => c.campaignStatus === 'draft').length
  const scheduledPosts = campaigns.flatMap((c) => c.platformPosts).filter((p) => p.status === 'scheduled').length
  const mockPosted = campaigns.flatMap((c) => c.platformPosts).filter((p) => p.status === 'mock_posted').length
  const failed = campaigns.flatMap((c) => c.platformPosts).filter((p) => p.status === 'failed').length

  function handleToggle(account: SocialAccount) {
    updateSocialAccount(account.id, { enabled: !account.enabled })
    refresh()
  }

  function handleConnect(account: SocialAccount) {
    mockConnectAccount(account.id)
    refresh()
  }

  function handleDisconnect(account: SocialAccount) {
    if (!confirm(`Disconnect ${PLATFORM_LABELS[account.platform]}?`)) return
    mockDisconnectAccount(account.id)
    refresh()
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0f4f8' }}>
      {/* Header */}
      <div className="px-8 py-6 border-b" style={{ background: 'linear-gradient(135deg, #0a3d2e 0%, #1a6b4f 100%)' }}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl">📣</span>
              <h1 className="text-2xl font-bold text-white">Social Publisher</h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60">Saltwater Sprouts</span>
            </div>
            <p className="text-sm text-green-200 ml-11">Publish blog content across social platforms</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/social/accounts" className="text-xs px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 font-semibold transition-colors">
              Account Settings
            </Link>
            <Link href="/admin/social/campaigns" className="text-xs px-4 py-2 rounded-lg font-bold text-white transition-all hover:opacity-85" style={{ backgroundColor: '#2d9e6b' }}>
              View All Campaigns
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-6 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Connected Accounts', value: connected, sub: `of ${accounts.length}`, color: '#10b981' },
            { label: 'Draft Campaigns', value: draftCampaigns, color: '#6b7280' },
            { label: 'Scheduled Posts', value: scheduledPosts, color: '#7c3aed' },
            { label: 'Mock Posted', value: mockPosted, color: '#0d9488' },
            { label: 'Failed Posts', value: failed, color: failed > 0 ? '#ef4444' : '#6b7280' },
          ].map(({ label, value, sub, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</p>
              <p className="text-3xl font-bold" style={{ color }}>{value}</p>
              {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
            </div>
          ))}
        </div>

        {/* Connected accounts */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between" style={{ backgroundColor: '#f8fafc' }}>
            <h2 className="font-bold text-gray-800">Social Accounts</h2>
            <Link href="/admin/social/accounts" className="text-xs text-blue-600 hover:text-blue-800 font-semibold">Manage →</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {accounts.map((account) => (
              <div key={account.id} className="px-5 py-4 flex items-center gap-4">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                  style={{ backgroundColor: PLATFORM_COLORS[account.platform] }}
                >
                  {account.platform[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-gray-900">{PLATFORM_LABELS[account.platform]}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${CONN_PILL[account.connectionStatus]}`}>
                      {account.connectionStatus.replace(/_/g, ' ')}
                    </span>
                    {!account.enabled && <span className="text-xs text-gray-400">(disabled)</span>}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{account.accountName}{account.accountHandle ? ` · ${account.accountHandle}` : ''}</p>
                  {account.lastSuccessfulPostAt && (
                    <p className="text-xs text-gray-300 mt-0.5">Last post: {new Date(account.lastSuccessfulPostAt).toLocaleDateString()}</p>
                  )}
                  {account.lastError && <p className="text-xs text-red-400 mt-0.5 truncate">{account.lastError}</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggle(account)}
                    className={`relative w-9 h-5 rounded-full transition-colors ${account.enabled ? 'bg-blue-600' : 'bg-gray-200'}`}
                    title={account.enabled ? 'Disable' : 'Enable'}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${account.enabled ? 'left-4' : 'left-0.5'}`} />
                  </button>
                  {account.connectionStatus === 'connected' ? (
                    <button onClick={() => handleDisconnect(account)} className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-600 font-semibold transition-colors">
                      Disconnect
                    </button>
                  ) : account.connectionStatus === 'disabled' ? (
                    <span className="text-xs text-gray-300 px-2">API not enabled</span>
                  ) : (
                    <button onClick={() => handleConnect(account)} className="text-xs px-2.5 py-1.5 rounded-lg font-semibold text-white transition-colors" style={{ backgroundColor: PLATFORM_COLORS[account.platform] }}>
                      Mock Connect
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent campaigns */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between" style={{ backgroundColor: '#f8fafc' }}>
            <h2 className="font-bold text-gray-800">Recent Campaigns</h2>
            <Link href="/admin/social/campaigns" className="text-xs text-blue-600 hover:text-blue-800 font-semibold">View All →</Link>
          </div>
          {campaigns.filter((c) => c.campaignStatus !== 'archived').length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-400 text-sm">No campaigns yet.</p>
              <Link href="/admin/blog-studio" className="text-xs text-blue-600 hover:underline mt-2 inline-block">
                Go to Blog Studio → Promote a Post to create your first campaign
              </Link>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider" style={{ backgroundColor: '#f8fafc' }}>
                  <th className="text-left px-5 py-3">Campaign</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Status</th>
                  <th className="text-left px-4 py-3 hidden lg:table-cell">Platforms</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Updated</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.filter((c) => c.campaignStatus !== 'archived').slice(0, 8).map((c) => (
                  <tr key={c.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <Link href={`/admin/social/campaigns/${c.id}`} className="font-semibold text-gray-900 hover:text-blue-700 line-clamp-1 block">{c.campaignName}</Link>
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{c.sourceTitle}</p>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CAMP_STATUS_PILL[c.campaignStatus] ?? 'bg-gray-100 text-gray-500'}`}>
                        {c.campaignStatus.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <div className="flex gap-1">
                        {c.platformPosts.map((p) => <PlatformDot key={p.id} platform={p.platform} />)}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell text-xs text-gray-400">
                      {new Date(c.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-4 py-3.5">
                      <Link href={`/admin/social/campaigns/${c.id}`} className="text-xs font-semibold text-blue-600 hover:text-blue-800">Open →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Failed / warning posts */}
        {failed > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
            <h2 className="font-bold text-red-700 mb-3 flex items-center gap-2">
              <span>⚠</span> Posts Needing Attention
            </h2>
            <div className="space-y-2">
              {campaigns.flatMap((c) =>
                c.platformPosts
                  .filter((p) => p.status === 'failed')
                  .map((p) => (
                    <div key={p.id} className="flex items-center justify-between gap-3 text-sm">
                      <div>
                        <span className="font-semibold text-red-700">{PLATFORM_LABELS[p.platform]}</span>
                        <span className="text-red-500 mx-2">·</span>
                        <span className="text-red-600">{c.campaignName}</span>
                        {p.errorMessage && <span className="text-red-400 ml-2 text-xs">— {p.errorMessage}</span>}
                      </div>
                      <Link href={`/admin/social/campaigns/${c.id}`} className="text-xs font-semibold text-red-600 hover:text-red-800 underline shrink-0">Fix →</Link>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
