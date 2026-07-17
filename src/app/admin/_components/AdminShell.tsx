'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  FileText,
  PenSquare,
  Megaphone,
  Settings,
  LogOut,
  Search,
  Share2,
  Calendar,
  Mail,
  Sparkles,
  Menu,
  X,
  Clock,
  ClipboardList,
  Image,
  Upload,
  UserCheck,
  type LucideIcon,
} from 'lucide-react'

const NAVY = '#1B3A5C'
const SIDEBAR_BG = '#0e2238'

type NavItem = {
  label: string
  href: string
  icon: LucideIcon
  external?: boolean
  legacy?: boolean
}

type NavGroup = {
  label: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [{ label: 'Dashboard', href: '/admin', icon: LayoutDashboard }],
  },
  {
    label: 'Content',
    items: [
      { label: 'Blog Studio', href: '/admin/blog-studio', icon: PenSquare },
      { label: 'Blog Posts', href: '/admin/blog', icon: FileText, legacy: true },
      { label: 'AI Command Center', href: '/admin/ai-command-center', icon: Sparkles },
      { label: 'Announcements', href: '/admin/announcements', icon: Megaphone },
    ],
  },
  {
    label: 'Marketing',
    items: [
      { label: 'Social Publisher', href: '/admin/social', icon: Share2 },
      { label: 'SEO Center', href: '/admin/seo', icon: Search },
      { label: 'Newsletter', href: '/admin/subscribers', icon: Mail },
    ],
  },
  {
    label: 'Enrollment',
    items: [
      { label: 'Inquiries', href: '/admin/inquiries', icon: Users },
      { label: 'Waitlist', href: '/admin/waitlist', icon: Clock },
      { label: 'Applications', href: '/admin/enrollment', icon: ClipboardList },
    ],
  },
  {
    label: 'Family Portal',
    items: [
      { label: 'Child Photo Galleries', href: '/admin/galleries', icon: Image },
      { label: 'Upload Photos', href: '/admin/galleries/upload', icon: Upload },
    ],
  },
  {
    label: 'Operations',
    items: [
      { label: 'Staff', href: '/admin/staff', icon: UserCheck },
      { label: 'Events Calendar', href: '/admin/events', icon: Calendar },
      { label: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
]

function isActiveRoute(pathname: string, href: string): boolean {
  if (href === '/admin') return pathname === '/admin'
  if (href === '/admin/blog') {
    return (
      pathname === '/admin/blog' ||
      (pathname.startsWith('/admin/blog/') && !pathname.startsWith('/admin/blog-studio'))
    )
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}

function NavLink({
  item,
  active,
  onNavigate,
}: {
  item: NavItem
  active: boolean
  onNavigate?: () => void
}) {
  const className = [
    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
    active
      ? 'bg-white/15 text-white font-semibold'
      : 'text-gray-300 hover:bg-white/10 hover:text-white',
  ].join(' ')

  const content = (
    <>
      <item.icon size={16} />
      <span className="flex-1 min-w-0">{item.label}</span>
      {item.legacy && (
        <span className="text-[10px] font-medium uppercase tracking-wide text-gray-500 shrink-0">
          Legacy
        </span>
      )}
    </>
  )

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onNavigate}
      >
        {content}
      </a>
    )
  }

  return (
    <Link href={item.href} className={className} onClick={onNavigate}>
      {content}
    </Link>
  )
}

function SidebarContent({
  userEmail,
  pathname,
  onNavigate,
}: {
  userEmail: string | null
  pathname: string
  onNavigate?: () => void
}) {
  return (
    <>
      <div className="px-5 py-5 border-b border-white/10">
        <p className="font-bold text-base" style={{ color: '#7ec8a0' }}>
          Saltwater Sprouts
        </p>
        <p className="text-xs text-gray-400">Admin Portal</p>
      </div>

      <nav className="flex-1 py-4 px-2 overflow-y-auto" aria-label="Admin navigation">
        {navGroups.map((group, groupIndex) => (
          <div key={group.label} className={groupIndex > 0 ? 'mt-4' : ''}>
            <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  active={!item.external && isActiveRoute(pathname, item.href)}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-2 py-4 border-t border-white/10">
        <p className="text-xs text-gray-500 px-3 mb-2 truncate" title={userEmail ?? ''}>
          {userEmail}
        </p>
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-white/10 hover:text-white transition-colors w-full"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </form>
      </div>
    </>
  )
}

export default function AdminShell({
  userEmail,
  children,
}: {
  userEmail: string | null
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!mobileOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileOpen])

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#f4f6f9' }}>
      <a
        href="#admin-main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2.5 focus:bg-white focus:rounded-lg focus:shadow-lg focus:outline focus:outline-2 focus:outline-offset-2"
        style={{ color: NAVY }}
      >
        Skip to main content
      </a>

      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex w-56 shrink-0 text-white flex-col"
        style={{ backgroundColor: SIDEBAR_BG }}
      >
        <SidebarContent userEmail={userEmail} pathname={pathname} />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 w-64 text-white flex flex-col md:hidden transition-transform duration-200',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
        style={{ backgroundColor: SIDEBAR_BG }}
      >
        <div className="flex items-center justify-end px-3 pt-3">
          <button
            type="button"
            aria-label="Close menu"
            className="p-2 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white"
            onClick={() => setMobileOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        <SidebarContent
          userEmail={userEmail}
          pathname={pathname}
          onNavigate={() => setMobileOpen(false)}
        />
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header
          className="md:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3 border-b border-gray-200 shadow-sm"
          style={{ backgroundColor: SIDEBAR_BG }}
        >
          <button
            type="button"
            aria-label="Open navigation menu"
            className="p-2 -ml-2 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={22} />
          </button>
          <div>
            <p className="font-bold text-sm" style={{ color: '#7ec8a0' }}>
              Saltwater Sprouts
            </p>
            <p className="text-[10px] text-gray-400">Admin Portal</p>
          </div>
        </header>

        <main id="admin-main-content" className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
