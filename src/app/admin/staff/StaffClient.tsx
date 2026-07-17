'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, X, Check, GripVertical } from 'lucide-react'

export type StaffPosition = {
  id: string
  title: string
  slug: string
  type: string
  description: string
  duties: string
  requirements: string
  pay_range: string
  location: string
  active: boolean
  sort_order: number
}

function toSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

const EMPTY: Omit<StaffPosition, 'id'> = {
  title: '',
  slug: '',
  type: '',
  description: '',
  duties: '',
  requirements: '',
  pay_range: '',
  location: 'Myrtle Beach, SC',
  active: true,
  sort_order: 0,
}

export default function StaffClient({ initialPositions }: { initialPositions: StaffPosition[] }) {
  const router = useRouter()
  const [positions, setPositions] = useState<StaffPosition[]>(initialPositions)
  const [editing, setEditing] = useState<Partial<StaffPosition> | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function openNew() {
    setEditing({ ...EMPTY })
    setIsNew(true)
    setError(null)
  }

  function openEdit(pos: StaffPosition) {
    setEditing({ ...pos })
    setIsNew(false)
    setError(null)
  }

  function cancelEdit() {
    setEditing(null)
    setError(null)
  }

  async function save() {
    if (!editing?.title?.trim()) { setError('Title is required.'); return }
    setSaving(true)
    setError(null)
    try {
      // TODO: connect Supabase — wire /api/admin/staff POST endpoint
      // const res = await fetch('/api/admin/staff', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(editing),
      // })
      // const json = await res.json()
      // if (!res.ok) { setError(json.error ?? 'Save failed.'); return }
      // router.refresh()
      // setEditing(null)
      setError('Saving requires Supabase — connect Supabase to persist.')
    } catch {
      setError('Network error.')
    } finally {
      setSaving(false)
    }
  }

  async function deletePos(id: string) {
    if (!confirm('Delete this position?')) return
    setDeleting(id)
    try {
      // TODO: connect Supabase — wire /api/admin/staff DELETE endpoint
      // const res = await fetch(`/api/admin/staff?id=${id}`, { method: 'DELETE' })
      // if (!res.ok) { alert('Delete failed.'); return }
      // setPositions((prev) => prev.filter((p) => p.id !== id))
      // router.refresh()
      void id
      alert('Delete requires Supabase — connect Supabase to enable.')
    } finally {
      setDeleting(null)
    }
  }

  async function toggleActive(pos: StaffPosition) {
    // TODO: connect Supabase
    // const updated = { ...pos, active: !pos.active }
    // await fetch('/api/admin/staff', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(updated),
    // })
    // setPositions((prev) => prev.map((p) => p.id === pos.id ? updated : p))
    // router.refresh()
    void pos
    router.refresh()
  }

  return (
    <div className="p-8">
      {/* Supabase stub notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-6">
        <p className="text-sm font-bold text-amber-800 mb-1">Supabase not yet connected</p>
        <p className="text-xs text-amber-700">
          Staff positions will persist once Supabase is wired. See{' '}
          <code className="font-mono bg-amber-100 px-1 rounded">src/app/admin/staff/StaffClient.tsx</code>.
        </p>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: '#1B3A5C' }}>Staff &amp; Positions</h1>
          <p className="text-gray-500 text-sm">{positions.length} position{positions.length === 1 ? '' : 's'} — shown on Join Our Team page</p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm text-white"
          style={{ backgroundColor: '#1B3A5C' }}
        >
          <Plus size={16} /> Add Position
        </button>
      </div>

      {/* Add / Edit form */}
      {editing && (
        <div className="bg-white rounded-xl border-2 border-blue-200 shadow-sm p-6 mb-8">
          <h2 className="font-bold mb-4 text-sm uppercase tracking-wider" style={{ color: '#1B3A5C' }}>
            {isNew ? 'New Position' : 'Edit Position'}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Position Title *</label>
              <input
                type="text"
                value={editing.title ?? ''}
                onChange={(e) => {
                  const title = e.target.value
                  setEditing((prev) => ({
                    ...prev,
                    title,
                    slug: isNew ? toSlug(title) : prev?.slug ?? toSlug(title),
                  }))
                }}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="e.g. Lead Preschool Teacher"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Employment Type</label>
              <input
                type="text"
                value={editing.type ?? ''}
                onChange={(e) => setEditing((prev) => ({ ...prev, type: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="e.g. Full-Time / Part-Time"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-600 mb-1">URL Slug</label>
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <span className="px-3 py-2 text-xs text-gray-400 bg-gray-50 border-r border-gray-200 shrink-0">/careers/</span>
              <input
                type="text"
                value={editing.slug ?? ''}
                onChange={(e) => setEditing((prev) => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                className="flex-1 px-3 py-2 text-sm focus:outline-none"
                placeholder="lead-preschool-teacher"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Short Description</label>
            <textarea
              value={editing.description ?? ''}
              onChange={(e) => setEditing((prev) => ({ ...prev, description: e.target.value }))}
              rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
              placeholder="Brief summary shown on the listing card..."
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Duties &amp; Responsibilities</label>
            <textarea
              value={editing.duties ?? ''}
              onChange={(e) => setEditing((prev) => ({ ...prev, duties: e.target.value }))}
              rows={5}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
              placeholder="Enter each duty on a new line..."
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Requirements / Qualifications</label>
            <textarea
              value={editing.requirements ?? ''}
              onChange={(e) => setEditing((prev) => ({ ...prev, requirements: e.target.value }))}
              rows={4}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
              placeholder="Enter each requirement on a new line..."
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Pay Range</label>
              <input
                type="text"
                value={editing.pay_range ?? ''}
                onChange={(e) => setEditing((prev) => ({ ...prev, pay_range: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="e.g. $18–$24/hr or Competitive"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Location</label>
              <input
                type="text"
                value={editing.location ?? 'Myrtle Beach, SC'}
                onChange={(e) => setEditing((prev) => ({ ...prev, location: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="e.g. Myrtle Beach, SC"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={editing.active ?? true}
                onChange={(e) => setEditing((prev) => ({ ...prev, active: e.target.checked }))}
                className="w-4 h-4 rounded"
              />
              Visible on site
            </label>
          </div>
          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
          <div className="flex gap-3">
            <button
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-sm text-white disabled:opacity-60 transition-opacity hover:opacity-85"
              style={{ backgroundColor: '#1B3A5C' }}
            >
              <Check size={15} /> {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              onClick={cancelEdit}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-sm text-gray-600 border border-gray-200 hover:bg-gray-50"
            >
              <X size={15} /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Positions list */}
      {positions.length === 0 && !editing ? (
        <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
          <GripVertical size={40} className="mx-auto mb-4 text-gray-300" />
          <p className="font-semibold mb-1" style={{ color: '#1B3A5C' }}>No positions yet</p>
          <p className="text-sm text-gray-500 mb-6">Add your first open position to show on the careers page.</p>
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm text-white"
            style={{ backgroundColor: '#1B3A5C' }}
          >
            <Plus size={16} /> Add Position
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="text-left px-5 py-3 font-semibold">Title</th>
                <th className="text-left px-5 py-3 font-semibold">Type</th>
                <th className="text-left px-5 py-3 font-semibold hidden md:table-cell">Slug</th>
                <th className="text-left px-5 py-3 font-semibold">Visible</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {positions.map((pos) => (
                <tr key={pos.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-5 py-3 font-semibold" style={{ color: '#1B3A5C' }}>
                    {pos.title}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: 'rgba(91,138,90,0.12)', color: '#3a6b39' }}
                    >
                      {pos.type || '—'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs hidden md:table-cell">
                    <span className="font-mono text-gray-400">/careers/{pos.slug}</span>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => toggleActive(pos)}
                      className={`w-8 h-5 rounded-full transition-colors relative ${pos.active ? 'bg-green-500' : 'bg-gray-300'}`}
                      title={pos.active ? 'Visible — click to hide' : 'Hidden — click to show'}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${pos.active ? 'translate-x-3' : 'translate-x-0.5'}`}
                      />
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => openEdit(pos)}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-blue-700 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => deletePos(pos.id)}
                        disabled={deleting === pos.id}
                        className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-40"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
