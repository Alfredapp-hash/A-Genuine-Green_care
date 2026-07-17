'use client'
// ─────────────────────────────────────────────────────────────────────────────
// Platform preview cards — visual approximations only, not official UI copies
// ─────────────────────────────────────────────────────────────────────────────
import type { SocialPlatformPost } from '../types'

const SALTWATER_SPROUTS_LOGO = 'https://saltwatersprouts.com/images/logo.png'

function PreviewShell({ platform, accent, children }: { platform: string; accent: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      <div className="px-4 py-2.5 flex items-center gap-2 border-b border-gray-100" style={{ backgroundColor: accent + '12' }}>
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: accent }}>{platform} Preview</span>
      </div>
      {children}
    </div>
  )
}

function AccountLine({ handle }: { handle?: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-2.5">
      <img src={SALTWATER_SPROUTS_LOGO} alt="Saltwater Sprouts" className="w-9 h-9 rounded-full border border-gray-200 bg-gray-50 object-contain p-0.5" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
      <div>
        <p className="text-sm font-bold text-gray-900 leading-tight">Saltwater Sprouts Early Learning Center</p>
        {handle && <p className="text-xs text-gray-400">{handle}</p>}
      </div>
    </div>
  )
}

export function FacebookPreviewCard({ post }: { post: SocialPlatformPost }) {
  return (
    <PreviewShell platform="Facebook" accent="#1877F2">
      <div className="p-4">
        <AccountLine handle="Facebook Page" />
        {post.caption && <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed mb-3 line-clamp-4">{post.caption}</p>}
        {post.image ? (
          <img src={post.image.url} alt={post.image.alt ?? ''} className="w-full rounded-lg object-cover max-h-52 mb-2" />
        ) : (
          <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
            <span className="text-gray-300 text-xs">No image selected</span>
          </div>
        )}
        {post.trackedUrl && (
          <div className="border border-gray-200 rounded-lg p-2.5 bg-gray-50">
            <p className="text-xs text-gray-400 truncate">{post.trackedUrl}</p>
          </div>
        )}
        <div className="flex gap-4 mt-3 pt-2.5 border-t border-gray-100">
          {['👍 Like', '💬 Comment', '↗ Share'].map((a) => (
            <span key={a} className="text-xs text-gray-400 font-medium">{a}</span>
          ))}
        </div>
      </div>
    </PreviewShell>
  )
}

export function InstagramPreviewCard({ post }: { post: SocialPlatformPost }) {
  return (
    <PreviewShell platform="Instagram" accent="#E1306C">
      <div className="p-4">
        <AccountLine handle="@saltwatersprouts" />
        {post.image ? (
          <img src={post.image.url} alt={post.image.alt ?? ''} className="w-full rounded-lg object-cover aspect-square mb-3" />
        ) : (
          <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-3">
            <span className="text-gray-300 text-xs">Image required for Instagram</span>
          </div>
        )}
        {post.caption && (
          <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed line-clamp-3 mb-2">
            <span className="font-bold">saltwatersprouts </span>{post.caption}
          </p>
        )}
        {post.hashtags && post.hashtags.length > 0 && (
          <p className="text-xs text-blue-500 mt-1 line-clamp-2">{post.hashtags.join(' ')}</p>
        )}
        <div className="flex gap-3 mt-3 pt-2.5 border-t border-gray-100">
          {['❤️', '💬', '✈️', '🔖'].map((icon) => (
            <span key={icon} className="text-base">{icon}</span>
          ))}
        </div>
      </div>
    </PreviewShell>
  )
}

export function LinkedInPreviewCard({ post }: { post: SocialPlatformPost }) {
  return (
    <PreviewShell platform="LinkedIn" accent="#0A66C2">
      <div className="p-4">
        <AccountLine handle="Saltwater Sprouts Early Learning Center" />
        {post.caption && <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed mb-3 line-clamp-5">{post.caption}</p>}
        {post.image ? (
          <img src={post.image.url} alt={post.image.alt ?? ''} className="w-full rounded object-cover max-h-44 mb-2" />
        ) : post.trackedUrl ? (
          <div className="border border-gray-200 rounded p-3 bg-gray-50 mb-2">
            <p className="text-xs font-bold text-gray-700 mb-0.5">{post.title ?? 'Saltwater Sprouts'}</p>
            <p className="text-xs text-gray-400 truncate">{post.trackedUrl}</p>
          </div>
        ) : null}
        {post.hashtags && post.hashtags.length > 0 && (
          <p className="text-xs text-blue-600 mt-1">{post.hashtags.map((h) => h.startsWith('#') ? h : `#${h}`).join(' ')}</p>
        )}
        <div className="flex gap-4 mt-3 pt-2.5 border-t border-gray-100 text-xs text-gray-400 font-medium">
          {['👍 Like', '💬 Comment', '↗ Repost', '✉ Send'].map((a) => <span key={a}>{a}</span>)}
        </div>
      </div>
    </PreviewShell>
  )
}

export function YouTubePreviewCard({ post }: { post: SocialPlatformPost }) {
  return (
    <PreviewShell platform="YouTube" accent="#FF0000">
      <div className="p-4">
        {post.image ? (
          <div className="relative mb-3">
            <img src={post.image.url} alt={post.image.alt ?? ''} className="w-full rounded-xl object-cover aspect-video" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg opacity-90">
                <span className="text-white text-lg ml-1">▶</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full aspect-video bg-gray-900 rounded-xl flex items-center justify-center mb-3">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white text-lg ml-1">▶</span>
            </div>
          </div>
        )}
        {post.title && <p className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">{post.title}</p>}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-teal-100 border border-gray-200 flex items-center justify-center text-xs font-bold text-teal-700">S</div>
          <span className="text-xs text-gray-600 font-medium">Saltwater Sprouts Early Learning Center</span>
        </div>
        {post.caption && <p className="text-xs text-gray-500 line-clamp-3">{post.caption}</p>}
        {post.hashtags && post.hashtags.length > 0 && (
          <p className="text-xs text-blue-500 mt-1.5 line-clamp-1">{post.hashtags.join(' ')}</p>
        )}
      </div>
    </PreviewShell>
  )
}

export function GoogleBusinessProfilePreviewCard({ post }: { post: SocialPlatformPost }) {
  return (
    <PreviewShell platform="Google Business Profile" accent="#4285F4">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 font-bold text-sm">G</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 leading-tight">Saltwater Sprouts Early Learning Center</p>
            <p className="text-xs text-gray-400">Google Business Post</p>
          </div>
        </div>
        {post.image && (
          <img src={post.image.url} alt={post.image.alt ?? ''} className="w-full rounded-lg object-cover max-h-44 mb-3" />
        )}
        {post.caption && <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed mb-3 line-clamp-4">{post.caption}</p>}
        {post.trackedUrl && (
          <a className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-sm font-semibold text-white" style={{ backgroundColor: '#4285F4' }}>
            {post.ctaType === 'LEARN_MORE' ? 'Learn more' : post.ctaType ?? 'Learn more'}
          </a>
        )}
      </div>
    </PreviewShell>
  )
}

export function XPreviewCard({ post }: { post: SocialPlatformPost }) {
  const charCount = post.caption?.length ?? 0
  const overLimit = charCount > 280
  return (
    <PreviewShell platform="X (Twitter)" accent="#000000">
      <div className="p-4">
        <AccountLine handle="@SaltwaterSproutsELC" />
        {post.caption && (
          <p className={`text-sm whitespace-pre-wrap leading-relaxed mb-2 ${overLimit ? 'text-red-600' : 'text-gray-800'}`}>
            {post.caption}
          </p>
        )}
        {post.image && (
          <img src={post.image.url} alt={post.image.alt ?? ''} className="w-full rounded-2xl object-cover max-h-44 mb-2" />
        )}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
          <div className="flex gap-4 text-xs text-gray-400">
            {['💬', '🔁', '❤️', '📊', '↗'].map((icon) => <span key={icon}>{icon}</span>)}
          </div>
          <span className={`text-xs font-mono ${overLimit ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
            {charCount}/280
          </span>
        </div>
      </div>
    </PreviewShell>
  )
}
