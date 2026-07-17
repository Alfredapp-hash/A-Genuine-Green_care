'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AnnouncementSchemaBanner() {
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    // TODO: connect Supabase — fetch('/api/admin/announcements/schema') when API is wired
    // fetch('/api/admin/announcements/schema')
    //   .then((res) => res.json())
    //   .then((json) => {
    //     if (!json.extendedReady) setMessage(json.message)
    //   })
    //   .catch(() => {})
  }, [])

  if (!message) return null

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      <p className="font-semibold mb-1">Database update required</p>
      <p className="mb-2">{message}</p>
      <Link
        href="https://supabase.com/dashboard"
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold underline"
      >
        Open Supabase SQL editor
      </Link>
      {' '}and run the announcements migration.
      Announcements still save in basic mode until then.
    </div>
  )
}
