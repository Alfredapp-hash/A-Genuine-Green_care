'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Copy, Pause, Play, Square } from 'lucide-react'
import AdminToast from './AdminToast'

type AnnouncementStatus = 'draft' | 'active' | 'paused' | 'expired'

export default function AnnouncementListActions({
  id,
  status,
}: {
  id: string
  status: AnnouncementStatus
}) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [toastTone, setToastTone] = useState<'success' | 'error'>('success')

  async function runAction(action: 'publish' | 'pause' | 'expire' | 'duplicate') {
    setLoading(action)
    try {
      // TODO: connect Supabase — wire /api/admin/announcements PATCH endpoint
      // const res = await fetch('/api/admin/announcements', {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ id, action }),
      // })
      // const data = await res.json()
      // if (!res.ok) throw new Error(data.error || 'Action failed')
      // setToastTone('success')
      // setToast(data.message || 'Updated.')
      // if (action === 'duplicate' && data.id) {
      //   router.push(`/admin/announcements/${data.id}`)
      // } else {
      //   router.refresh()
      // }
      setToastTone('success')
      setToast('Action stubbed — connect Supabase to enable.')
      router.refresh()
    } catch (e) {
      setToastTone('error')
      setToast(e instanceof Error ? e.message : 'Action failed')
    } finally {
      setLoading(null)
    }
  }

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        {status !== 'active' && (
          <button
            type="button"
            title="Publish"
            disabled={!!loading}
            onClick={() => runAction('publish')}
            className="p-2 rounded-lg text-green-700 hover:bg-green-50 disabled:opacity-50"
          >
            <Play size={15} />
          </button>
        )}
        {status === 'active' && (
          <button
            type="button"
            title="Pause"
            disabled={!!loading}
            onClick={() => runAction('pause')}
            className="p-2 rounded-lg text-amber-700 hover:bg-amber-50 disabled:opacity-50"
          >
            <Pause size={15} />
          </button>
        )}
        {status !== 'expired' && (
          <button
            type="button"
            title="End now"
            disabled={!!loading}
            onClick={() => runAction('expire')}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            <Square size={15} />
          </button>
        )}
        <button
          type="button"
          title="Duplicate"
          disabled={!!loading}
          onClick={() => runAction('duplicate')}
          className="p-2 rounded-lg text-blue-700 hover:bg-blue-50 disabled:opacity-50"
        >
          <Copy size={15} />
        </button>
      </div>
      <AdminToast message={toast} tone={toastTone} onDone={() => setToast(null)} />
    </>
  )
}
