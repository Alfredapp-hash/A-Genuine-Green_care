'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type InquiryStatus = 'new' | 'contacted' | 'enrolled' | 'waitlisted' | 'closed'

const INQUIRY_STATUSES: InquiryStatus[] = ['new', 'contacted', 'enrolled', 'waitlisted', 'closed']

function formatInquiryStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ')
}

export default function InquiryActions({
  id,
  initialStatus,
  initialFollowUpAt,
}: {
  id: string
  initialStatus: InquiryStatus
  initialFollowUpAt: string | null
}) {
  const router = useRouter()
  const [status, setStatus] = useState(initialStatus)
  const [followUpAt, setFollowUpAt] = useState(
    initialFollowUpAt ? initialFollowUpAt.slice(0, 16) : '',
  )
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function save() {
    setSaving(true)
    setMessage(null)
    // TODO: connect Supabase — wire /api/admin/inquiries PATCH endpoint
    // const res = await fetch('/api/admin/inquiries', {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     id,
    //     status,
    //     follow_up_at: followUpAt ? new Date(followUpAt).toISOString() : null,
    //   }),
    // })
    // setSaving(false)
    // if (!res.ok) {
    //   const data = await res.json()
    //   setMessage(data.error || 'Update failed')
    //   return
    // }
    // setMessage('Saved')
    // router.refresh()
    void id
    setSaving(false)
    setMessage('Stubbed — connect Supabase to persist changes.')
    router.refresh()
  }

  const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm'

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
      <h2 className="text-lg font-bold" style={{ color: '#1B3A5C' }}>Update Inquiry</h2>
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase">Status</label>
        <select
          className={inputClass}
          value={status}
          onChange={(e) => setStatus(e.target.value as InquiryStatus)}
        >
          {INQUIRY_STATUSES.map((s) => (
            <option key={s} value={s}>{formatInquiryStatus(s)}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase">Follow-up reminder</label>
        <input
          className={inputClass}
          type="datetime-local"
          value={followUpAt}
          onChange={(e) => setFollowUpAt(e.target.value)}
        />
      </div>
      {message && <p className="text-sm text-gray-600">{message}</p>}
      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="px-5 py-2.5 rounded-lg font-semibold text-sm text-white disabled:opacity-60"
        style={{ backgroundColor: '#1B3A5C' }}
      >
        {saving ? 'Saving…' : 'Save changes'}
      </button>
    </div>
  )
}
