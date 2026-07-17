'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type InquiryNoteRow = {
  id: string
  note: string
  created_at: string
  author?: { full_name: string | null } | null
}

export default function InquiryNotes({
  inquiryId,
  initialNotes,
}: {
  inquiryId: string
  initialNotes: InquiryNoteRow[]
}) {
  const router = useRouter()
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function addNote() {
    const trimmed = note.trim()
    if (!trimmed) return

    setSaving(true)
    setError(null)
    // TODO: connect Supabase — wire /api/admin/inquiry-notes POST endpoint
    // const res = await fetch('/api/admin/inquiry-notes', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ inquiry_id: inquiryId, note: trimmed }),
    // })
    // setSaving(false)
    // if (!res.ok) {
    //   const data = await res.json()
    //   setError(data.error || 'Failed to save note')
    //   return
    // }
    // setNote('')
    // router.refresh()
    void inquiryId
    setSaving(false)
    setError('Note saving requires Supabase — connect Supabase to enable.')
    router.refresh()
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
      <h2 className="text-lg font-bold" style={{ color: '#1B3A5C' }}>Staff Notes</h2>

      {initialNotes.length > 0 ? (
        <ul className="space-y-3 max-h-64 overflow-y-auto">
          {initialNotes.map((entry) => (
            <li key={entry.id} className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{entry.note}</p>
              <p className="text-xs text-gray-400 mt-2">
                {entry.author?.full_name ?? 'Staff'}
                {' · '}
                {new Date(entry.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-400">No notes yet.</p>
      )}

      <div>
        <textarea
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm min-h-24"
          placeholder="Add an internal note about this inquiry…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="button"
        onClick={addNote}
        disabled={saving || !note.trim()}
        className="px-5 py-2.5 rounded-lg font-semibold text-sm text-white disabled:opacity-60"
        style={{ backgroundColor: '#1B3A5C' }}
      >
        {saving ? 'Saving…' : 'Add note'}
      </button>
    </div>
  )
}
