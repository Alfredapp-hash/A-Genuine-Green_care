'use client'

import { useEffect } from 'react'

export default function AdminToast({
  message,
  tone = 'success',
  onDone,
}: {
  message: string | null
  tone?: 'success' | 'error'
  onDone?: () => void
}) {
  useEffect(() => {
    if (!message) return
    const timer = window.setTimeout(() => onDone?.(), 4000)
    return () => window.clearTimeout(timer)
  }, [message, onDone])

  if (!message) return null

  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] max-w-sm rounded-xl border px-4 py-3 text-sm font-semibold shadow-lg ${
        tone === 'error'
          ? 'bg-red-50 border-red-200 text-red-800'
          : 'bg-green-50 border-green-200 text-green-900'
      }`}
      role="status"
    >
      {message}
    </div>
  )
}
