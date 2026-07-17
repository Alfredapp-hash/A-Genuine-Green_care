import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Phone, Mail, MessageSquare, Calendar, TrendingUp } from 'lucide-react'
import InquiryActions from '../_components/InquiryActions'
import InquiryNotes from '../_components/InquiryNotes'

type InquiryStatus = 'new' | 'contacted' | 'enrolled' | 'waitlisted' | 'closed'

const INQUIRY_STATUS_COLORS: Record<InquiryStatus, string> = {
  new:         '#1B3A5C',
  contacted:   '#5B8A5A',
  enrolled:    '#16a34a',
  waitlisted:  '#d97706',
  closed:      '#6b7280',
}

function formatInquiryStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ')
}

type InquiryDetail = {
  id: string
  name: string
  email: string | null
  phone: string | null
  preferred_contact: string | null
  /** Program interest */
  type: string
  /** Child's age group */
  child_age_group?: string | null
  status: InquiryStatus
  message: string | null
  source_page: string | null
  created_at: string
  follow_up_at: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
}

async function getInquiry(_id: string): Promise<{ inquiry: InquiryDetail | null; notes: Array<{ id: string; note: string; created_at: string; author?: { full_name: string | null } | null }> }> {
  // TODO: connect Supabase
  // const { getAdminDb } = await import('@/lib/admin/db')
  // const supabase = getAdminDb()
  // const [{ data }, { data: notesData }] = await Promise.all([
  //   supabase
  //     .from('inquiries')
  //     .select('id, name, email, phone, preferred_contact, type, child_age_group, status, message, source_page, created_at, follow_up_at, utm_source, utm_medium, utm_campaign')
  //     .eq('id', id)
  //     .single(),
  //   supabase
  //     .from('inquiry_notes')
  //     .select('id, note, created_at, author:author_id (full_name)')
  //     .eq('inquiry_id', id)
  //     .order('created_at', { ascending: false }),
  // ])
  // return { inquiry: data as unknown as InquiryDetail | null, notes: (notesData as unknown as ...) ?? [] }
  return { inquiry: null, notes: [] }
}

export default async function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { inquiry, notes } = await getInquiry(id)

  if (!inquiry) notFound()

  const status = inquiry.status as InquiryStatus

  return (
    <div className="p-8 max-w-4xl">
      <Link
        href="/admin/inquiries"
        className="inline-flex items-center gap-1.5 text-sm font-semibold mb-6 hover:underline"
        style={{ color: '#1B3A5C' }}
      >
        <ArrowLeft size={14} /> All Inquiries
      </Link>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-2xl font-bold" style={{ color: '#1B3A5C' }}>{inquiry.name}</h1>
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full text-white capitalize"
                style={{ backgroundColor: INQUIRY_STATUS_COLORS[status] ?? '#6b7280' }}
              >
                {formatInquiryStatus(inquiry.status)}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-sm mb-6">
              {inquiry.email && (
                <a href={`mailto:${inquiry.email}`} className="flex items-center gap-2 text-blue-700 hover:underline">
                  <Mail size={14} /> {inquiry.email}
                </a>
              )}
              {inquiry.phone && (
                <a href={`tel:${inquiry.phone}`} className="flex items-center gap-2 text-blue-700 hover:underline">
                  <Phone size={14} /> {inquiry.phone}
                </a>
              )}
              <div className="flex items-center gap-2 text-gray-500">
                <MessageSquare size={14} />
                <span className="capitalize">Program interest: {inquiry.type.replace(/_/g, ' ')}</span>
              </div>
              {inquiry.child_age_group && (
                <div className="flex items-center gap-2 text-gray-500">
                  <MessageSquare size={14} />
                  <span>Child&apos;s age group: {inquiry.child_age_group}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-500">
                <Calendar size={14} />
                {new Date(inquiry.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
              </div>
              {inquiry.source_page && (
                <div className="flex items-center gap-2 text-gray-500 sm:col-span-2">
                  <span className="text-xs">Source page: {inquiry.source_page}</span>
                </div>
              )}
            </div>

            {inquiry.message && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Message</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{inquiry.message}</p>
              </div>
            )}
          </div>

          {(inquiry.utm_source || inquiry.utm_medium || inquiry.utm_campaign) && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={15} style={{ color: '#1B3A5C' }} />
                <p className="text-sm font-bold" style={{ color: '#1B3A5C' }}>Ad Attribution</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Source', value: inquiry.utm_source },
                  { label: 'Medium', value: inquiry.utm_medium },
                  { label: 'Campaign', value: inquiry.utm_campaign },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">{label}</p>
                    <p className="text-sm font-bold" style={{ color: '#1B3A5C' }}>
                      {value ?? <span className="text-gray-300 font-normal">—</span>}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {inquiry.email && (
              <a
                href={`mailto:${inquiry.email}?subject=Following up from Saltwater Sprouts`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm text-white"
                style={{ backgroundColor: '#1B3A5C' }}
              >
                <Mail size={14} /> Reply by Email
              </a>
            )}
            {inquiry.phone && (
              <a
                href={`tel:${inquiry.phone}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Phone size={14} /> Call {inquiry.name.split(' ')[0]}
              </a>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <InquiryActions
            id={inquiry.id}
            initialStatus={status}
            initialFollowUpAt={inquiry.follow_up_at}
          />
          <InquiryNotes inquiryId={inquiry.id} initialNotes={notes} />
        </div>
      </div>
    </div>
  )
}
