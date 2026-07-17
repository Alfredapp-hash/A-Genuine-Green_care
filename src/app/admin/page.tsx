import Link from 'next/link'
import {
  ChevronRight, FileText, PenSquare,
  Megaphone, Mail, Search,
  ArrowRight,
  CheckCircle, Clock,
  Sparkles,
  Calendar, Users, ClipboardList, Image, Upload, UserCheck, Share2,
  type LucideIcon,
} from 'lucide-react'

const NAVY = '#1B3A5C'
const SAGE = '#5B8A5A'

// ── Mock static data ──────────────────────────────────────────────────────────
const enrolledChildren     = 0
const newInquiries         = 0
const blogPosts            = 0
const activeAnnouncements  = 0
const subscribers          = 0
const staffCount           = 0

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({
  label, value, sub, href, accent, alert,
}: { label: string; value: string | number; sub?: string; href: string; accent: string; alert?: boolean }) {
  return (
    <Link
      href={href}
      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
    >
      {alert && (
        <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white" />
      )}
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{label}</p>
      <p className="text-3xl font-bold mb-1" style={{ color: accent }}>{value}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
      <ChevronRight size={14} className="absolute bottom-4 right-4 text-gray-200 group-hover:text-gray-400 transition-colors" />
    </Link>
  )
}

// ── Tool card ─────────────────────────────────────────────────────────────────
function ToolCard({
  label, description, href, icon: Icon, accent, badge, badgeColor,
}: { label: string; description: string; href: string; icon: LucideIcon; accent: string; badge?: string; badgeColor?: string }) {
  return (
    <Link
      href={href}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex items-start gap-4 p-5"
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: accent }}>
        <Icon size={18} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="font-bold text-sm text-gray-900 group-hover:text-blue-700 transition-colors">{label}</p>
          {badge && (
            <span className="text-xs font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: badgeColor ?? '#fee2e2', color: badgeColor ? '#fff' : '#b91c1c' }}>
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">{description}</p>
      </div>
      <ArrowRight size={14} className="text-gray-200 group-hover:text-blue-400 transition-colors mt-1 shrink-0" />
    </Link>
  )
}

// ── Quick action button ───────────────────────────────────────────────────────
function QuickAction({ href, label, icon: Icon, accent }: { href: string; label: string; icon: LucideIcon; accent: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-2 bg-white hover:scale-105 transition-all text-sm font-bold"
      style={{ borderColor: accent, color: accent }}
    >
      <Icon size={15} />
      {label}
    </Link>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="p-4 sm:p-8 max-w-screen-xl space-y-8">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: NAVY, fontFamily: 'var(--font-display), Georgia, serif' }}>
            {greeting} 👋
          </h1>
          <p className="text-gray-400 text-sm">Saltwater Sprouts admin portal — all tools in one place.</p>
        </div>
        <div className="text-right text-xs text-gray-400">
          <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          <p className="mt-0.5 font-semibold text-gray-500">saltwatersprouts.com</p>
        </div>
      </div>

      {/* ── All caught up state ────────────────────────────────────────────── */}
      <div className="flex items-center gap-2.5 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-semibold w-fit">
        <CheckCircle size={15} />
        All caught up — nothing needs attention
      </div>

      {/* ── Core metrics strip ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard
          label="Enrolled Children"
          value={enrolledChildren}
          sub={enrolledChildren === 0 ? 'no enrollments yet' : 'active enrollments'}
          href="/admin/enrollment"
          accent={NAVY}
        />
        <StatCard
          label="New Inquiries"
          value={newInquiries}
          sub={newInquiries === 0 ? 'none unread' : 'awaiting response'}
          href="/admin/inquiries"
          accent={SAGE}
          alert={newInquiries > 0}
        />
        <StatCard
          label="Blog Posts"
          value={blogPosts}
          sub={blogPosts === 0 ? 'no posts yet' : 'published'}
          href="/admin/blog-studio"
          accent="#6366f1"
        />
        <StatCard
          label="Active Announcements"
          value={activeAnnouncements}
          sub={activeAnnouncements === 0 ? 'none active' : 'live now'}
          href="/admin/announcements"
          accent="#0ea5e9"
        />
        <StatCard
          label="Subscribers"
          value={subscribers}
          sub={subscribers === 0 ? 'none yet' : 'newsletter list'}
          href="/admin/subscribers"
          accent="#8b5cf6"
        />
        <StatCard
          label="Staff Members"
          value={staffCount}
          sub={staffCount === 0 ? 'no staff added' : 'team members'}
          href="/admin/staff"
          accent="#10b981"
        />
      </div>

      {/* ── Tool grid ──────────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">All Admin Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <ToolCard href="/admin/blog-studio"       label="Blog Studio"          icon={PenSquare}    accent="#6366f1"   description="Block-based editor for creating and publishing blog articles." />
          <ToolCard href="/admin/blog"              label="Blog Posts"           icon={FileText}     accent="#4f46e5"   description="Manage legacy blog posts — edit, publish, archive, or delete." />
          <ToolCard href="/admin/ai-command-center" label="AI Command Center"    icon={Sparkles}     accent="#7c3aed"   description="Generate blog drafts, social posts, and content copy with AI workflows." />
          <ToolCard href="/admin/announcements"     label="Announcements"        icon={Megaphone}    accent="#0ea5e9"   description="Create and manage announcements for families and staff." />
          <ToolCard href="/admin/social"            label="Social Publisher"     icon={Share2}       accent="#1a4080"   description="Schedule and publish posts across social media channels." />
          <ToolCard href="/admin/seo"               label="SEO Center"           icon={Search}       accent={NAVY}      description="Manage metadata, schema, and indexing for all tracked pages." />
          <ToolCard href="/admin/subscribers"       label="Newsletter"           icon={Mail}         accent="#8b5cf6"   description="View newsletter subscribers and export the list for campaigns." />
          <ToolCard href="/admin/inquiries"         label="Inquiries"            icon={Users}        accent={SAGE}      description="Contact and enrollment inquiries from families." />
          <ToolCard href="/admin/waitlist"          label="Waitlist"             icon={Clock}        accent="#f59e0b"   description="Manage families on the waitlist for open enrollment spots." />
          <ToolCard href="/admin/enrollment"        label="Applications"         icon={ClipboardList} accent={NAVY}    description="Review and process enrollment applications." />
          <ToolCard href="/admin/galleries"         label="Child Photo Galleries" icon={Image}       accent="#ec4899"   description="Manage photo galleries shared with enrolled families." />
          <ToolCard href="/admin/galleries/upload"  label="Upload Photos"        icon={Upload}       accent="#db2777"   description="Upload new photos to family galleries." />
          <ToolCard href="/admin/staff"             label="Staff"                icon={UserCheck}    accent="#10b981"   description="Manage staff profiles, roles, and credentials." />
          <ToolCard href="/admin/events"            label="Events Calendar"      icon={Calendar}     accent="#0891b2"   description="Schedule and manage center events, field trips, and closures." />
          <ToolCard href="/admin/settings"          label="Settings"             icon={Search}       accent="#475569"   description="Configure site settings, branding, and preferences." />
        </div>
      </div>

      {/* ── Quick actions ───────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <QuickAction href="/admin/blog-studio"        label="Write Blog Post"      icon={PenSquare}    accent="#6366f1" />
          <QuickAction href="/admin/announcements"      label="New Announcement"     icon={Megaphone}    accent="#0ea5e9" />
          <QuickAction href="/admin/inquiries"          label="Check Inquiries"      icon={Users}        accent={SAGE}   />
          <QuickAction href="/admin/galleries/upload"   label="Upload Photos"        icon={Upload}       accent="#ec4899" />
          <QuickAction href="/admin/events"             label="Add Event"            icon={Calendar}     accent="#0891b2" />
          <QuickAction href="/admin/seo"                label="SEO Center"           icon={Search}       accent={NAVY}   />
        </div>
      </div>

      {/* ── Content at a glance ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock size={15} className="text-gray-400" />
            <p className="text-sm font-bold text-gray-800">Content at a Glance</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Enrolled Children', value: enrolledChildren, href: '/admin/enrollment',    color: NAVY },
            { label: 'Blog Posts',        value: blogPosts,        href: '/admin/blog-studio',   color: '#6366f1' },
            { label: 'Announcements',     value: activeAnnouncements, href: '/admin/announcements', color: '#0ea5e9' },
            { label: 'Staff Members',     value: staffCount,       href: '/admin/staff',          color: '#10b981' },
          ].map((item) => (
            <Link key={item.label} href={item.href} className="text-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group">
              <p className="text-2xl font-bold group-hover:scale-110 transition-transform inline-block" style={{ color: item.color }}>{item.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}
