'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, Save, Trash2, ArrowLeft, Upload, Pause, Play, Square } from 'lucide-react'
import AdminToast from './AdminToast'
import AnnouncementSchemaBanner from './AnnouncementSchemaBanner'
import AnnouncementPathPicker, { pathsFromPresets } from './AnnouncementPathPicker'
import AnnouncementPreviewModal from './AnnouncementPreviewModal'
import AnnouncementReadinessPanel from './AnnouncementReadinessPanel'

type AnnouncementStatus = 'draft' | 'active' | 'paused' | 'expired'
type TriggerType = 'scroll' | 'load' | 'delay' | 'exit_intent'
type DeviceTarget = 'all' | 'mobile' | 'desktop'

export type AnnouncementInitial = {
  id: string
  title: string
  body: string | null
  image_url: string | null
  cta_label: string | null
  cta_url: string | null
  scroll_trigger_percent: number
  show_once_per_session: boolean
  dismissible: boolean
  target_paths: string[] | null
  status: AnnouncementStatus
  scheduled_start: string | null
  scheduled_end: string | null
  trigger_type?: TriggerType
  trigger_delay_seconds?: number
  show_cooldown_days?: number
  slug?: string | null
  priority?: number
  append_utm?: boolean
  device_target?: DeviceTarget
}

function toDatetimeLocal(iso: string | null) {
  if (!iso) return ''
  const d = new Date(iso)
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}

function slugifyTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

// Adapt preset IDs to selected IDs from saved target_paths
function presetsFromPaths(targetPaths: string[] | null): { selectedIds: string[]; customPaths: string[] } {
  if (!targetPaths || targetPaths.length === 0) return { selectedIds: ['all'], customPaths: [] }
  const presetMap: Record<string, string> = {
    '/': 'home',
    '/programs': 'programs',
    '/enrollment': 'enrollment',
    '/about': 'about',
    '/resources': 'resources',
    '/contact': 'contact',
  }
  const selectedIds: string[] = []
  const customPaths: string[] = []
  for (const path of targetPaths) {
    if (presetMap[path]) selectedIds.push(presetMap[path])
    else customPaths.push(path)
  }
  return { selectedIds: selectedIds.length ? selectedIds : ['all'], customPaths }
}

export default function AnnouncementForm({ initialAnnouncement }: { initialAnnouncement?: AnnouncementInitial }) {
  const router = useRouter()
  const initialPaths = presetsFromPaths(initialAnnouncement?.target_paths ?? null)

  const [title, setTitle] = useState(initialAnnouncement?.title ?? '')
  const [body, setBody] = useState(initialAnnouncement?.body ?? '')
  const [imageUrl, setImageUrl] = useState(initialAnnouncement?.image_url ?? '')
  const [ctaLabel, setCtaLabel] = useState(initialAnnouncement?.cta_label ?? 'Learn More')
  const [ctaUrl, setCtaUrl] = useState(initialAnnouncement?.cta_url ?? '')
  const [scrollTrigger, setScrollTrigger] = useState(initialAnnouncement?.scroll_trigger_percent ?? 50)
  const [showOnce, setShowOnce] = useState(initialAnnouncement?.show_once_per_session ?? true)
  const [dismissible, setDismissible] = useState(initialAnnouncement?.dismissible ?? true)
  const [selectedPathIds, setSelectedPathIds] = useState(initialPaths.selectedIds)
  const [customPaths, setCustomPaths] = useState(initialPaths.customPaths.join('\n'))
  const [status, setStatus] = useState<AnnouncementStatus>(initialAnnouncement?.status ?? 'draft')
  const [scheduledStart, setScheduledStart] = useState(toDatetimeLocal(initialAnnouncement?.scheduled_start ?? null))
  const [scheduledEnd, setScheduledEnd] = useState(toDatetimeLocal(initialAnnouncement?.scheduled_end ?? null))
  const [triggerType, setTriggerType] = useState<TriggerType>(initialAnnouncement?.trigger_type ?? 'scroll')
  const [triggerDelay, setTriggerDelay] = useState(initialAnnouncement?.trigger_delay_seconds ?? 3)
  const [cooldownDays, setCooldownDays] = useState(initialAnnouncement?.show_cooldown_days ?? 0)
  const [priority, setPriority] = useState(initialAnnouncement?.priority ?? 0)
  const [appendUtm, setAppendUtm] = useState(initialAnnouncement?.append_utm ?? true)
  const [deviceTarget, setDeviceTarget] = useState<DeviceTarget>(initialAnnouncement?.device_target ?? 'all')
  const [slug, setSlug] = useState(initialAnnouncement?.slug ?? slugifyTitle(initialAnnouncement?.title ?? ''))
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [toastTone, setToastTone] = useState<'success' | 'error'>('success')
  const [showPreview, setShowPreview] = useState(false)

  const targetPaths = useMemo(
    () => pathsFromPresets(selectedPathIds, customPaths.split('\n')),
    [selectedPathIds, customPaths]
  )

  const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm'

  async function uploadImage(_file: File): Promise<string> {
    // TODO: connect Supabase storage
    // const supabase = createClient()
    // const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    // const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    // const { error: upErr } = await supabase.storage.from('announcement-images').upload(path, file)
    // if (upErr) throw upErr
    // return supabase.storage.from('announcement-images').getPublicUrl(path).data.publicUrl
    throw new Error('Image upload requires Supabase — connect Supabase to enable.')
  }

  function buildPayload(nextStatus: AnnouncementStatus) {
    return {
      id: initialAnnouncement?.id,
      title,
      body: body || null,
      image_url: imageUrl || null,
      cta_label: ctaLabel,
      cta_url: ctaUrl || null,
      scroll_trigger_percent: scrollTrigger,
      show_once_per_session: showOnce,
      dismissible,
      target_paths: targetPaths,
      status: nextStatus,
      scheduled_start: scheduledStart ? new Date(scheduledStart).toISOString() : null,
      scheduled_end: scheduledEnd ? new Date(scheduledEnd).toISOString() : null,
      trigger_type: triggerType,
      trigger_delay_seconds: triggerDelay,
      show_cooldown_days: cooldownDays,
      slug: slug || slugifyTitle(title),
      priority,
      append_utm: appendUtm,
      device_target: deviceTarget,
    }
  }

  async function saveAs(nextStatus: AnnouncementStatus) {
    setSaving(true)
    setError(null)
    try {
      // TODO: connect Supabase — wire /api/admin/announcements POST endpoint
      // const res = await fetch('/api/admin/announcements', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(buildPayload(nextStatus)),
      // })
      // const data = await res.json()
      // if (!res.ok) throw new Error(data.error || 'Save failed')
      // setStatus(data.status ?? nextStatus)
      // if (data.slug) setSlug(data.slug)
      // setToastTone('success')
      // setToast(data.message || 'Saved.')
      // if (!initialAnnouncement?.id) router.push(`/admin/announcements/${data.id}`)
      // else router.refresh()
      void buildPayload(nextStatus)
      setStatus(nextStatus)
      setToastTone('success')
      setToast('Stubbed — connect Supabase to persist.')
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Save failed'
      setError(msg)
      setToastTone('error')
      setToast(msg)
    } finally {
      setSaving(false)
    }
  }

  async function remove() {
    if (!initialAnnouncement?.id || !confirm('Delete this announcement?')) return
    // TODO: connect Supabase
    // await fetch(`/api/admin/announcements?id=${initialAnnouncement.id}`, { method: 'DELETE' })
    router.push('/admin/announcements')
  }

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/admin/announcements" className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline" style={{ color: '#1B3A5C' }}>
        <ArrowLeft size={14} /> All Announcements
      </Link>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2">{error}</p>}
      <AnnouncementSchemaBanner />

      <AnnouncementReadinessPanel
        status={status}
        title={title}
        ctaUrl={ctaUrl}
        scheduledStart={scheduledStart}
        scheduledEnd={scheduledEnd}
        targetPaths={targetPaths}
      />

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <div><label className="text-xs font-semibold text-gray-500 uppercase">Title</label><input className={inputClass} value={title} onChange={(e) => { setTitle(e.target.value); if (!initialAnnouncement?.slug) setSlug(slugifyTitle(e.target.value)) }} /></div>
        <div><label className="text-xs font-semibold text-gray-500 uppercase">Body</label><textarea className={`${inputClass} min-h-24`} value={body} onChange={(e) => setBody(e.target.value)} /></div>
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase">Image</label>
          <div className="flex gap-3 items-center mt-1">
            {imageUrl && <img src={imageUrl} alt={title ? `${title} announcement image` : 'Announcement image preview'} className="h-16 w-24 object-cover rounded border" />}
            <label className="inline-flex items-center gap-2 px-3 py-2 border rounded-lg text-sm cursor-pointer hover:bg-gray-50">
              <Upload size={14} /> {uploading ? 'Uploading…' : 'Upload'}
              <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                const file = e.target.files?.[0]
                if (!file) return
                setUploading(true)
                try { setImageUrl(await uploadImage(file)) } catch (err) {
                  setError(err instanceof Error ? err.message : 'Upload failed')
                } finally { setUploading(false) }
              }} />
            </label>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="text-xs font-semibold text-gray-500 uppercase">CTA label</label><input className={inputClass} value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} /></div>
          <div><label className="text-xs font-semibold text-gray-500 uppercase">CTA URL</label><input className={inputClass} value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} placeholder="/enrollment or https://..." /></div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase">Show on pages</label>
          <AnnouncementPathPicker
            selectedIds={selectedPathIds}
            customPaths={customPaths}
            onSelectedIdsChange={setSelectedPathIds}
            onCustomPathsChange={setCustomPaths}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Trigger</label>
            <select className={inputClass} value={triggerType} onChange={(e) => setTriggerType(e.target.value as TriggerType)}>
              <option value="scroll">On scroll</option>
              <option value="load">On page load</option>
              <option value="delay">After delay</option>
              <option value="exit_intent">Exit intent (desktop)</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Device</label>
            <select className={inputClass} value={deviceTarget} onChange={(e) => setDeviceTarget(e.target.value as DeviceTarget)}>
              <option value="all">All devices</option>
              <option value="mobile">Mobile only</option>
              <option value="desktop">Desktop only</option>
            </select>
          </div>
        </div>

        {triggerType === 'scroll' && (
          <div><label className="text-xs font-semibold text-gray-500 uppercase">Scroll trigger %</label><input className={inputClass} type="number" min={0} max={100} value={scrollTrigger} onChange={(e) => setScrollTrigger(Number(e.target.value))} /></div>
        )}
        {(triggerType === 'load' || triggerType === 'delay') && (
          <div><label className="text-xs font-semibold text-gray-500 uppercase">Delay (seconds)</label><input className={inputClass} type="number" min={0} max={300} value={triggerDelay} onChange={(e) => setTriggerDelay(Number(e.target.value))} /></div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="text-xs font-semibold text-gray-500 uppercase">Start</label><input className={inputClass} type="datetime-local" value={scheduledStart} onChange={(e) => setScheduledStart(e.target.value)} /></div>
          <div><label className="text-xs font-semibold text-gray-500 uppercase">End</label><input className={inputClass} type="datetime-local" value={scheduledEnd} onChange={(e) => setScheduledEnd(e.target.value)} /></div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="text-xs font-semibold text-gray-500 uppercase">Priority (higher wins)</label><input className={inputClass} type="number" value={priority} onChange={(e) => setPriority(Number(e.target.value))} /></div>
          <div><label className="text-xs font-semibold text-gray-500 uppercase">UTM slug</label><input className={inputClass} value={slug} onChange={(e) => setSlug(e.target.value)} /></div>
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={showOnce} onChange={(e) => setShowOnce(e.target.checked)} /> Once per session</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={dismissible} onChange={(e) => setDismissible(e.target.checked)} /> Dismissible</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={appendUtm} onChange={(e) => setAppendUtm(e.target.checked)} /> Append UTM to CTA</label>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase">Hide again for (days, 0 = off)</label>
          <input className={inputClass} type="number" min={0} max={365} value={cooldownDays} onChange={(e) => setCooldownDays(Number(e.target.value))} />
          <p className="text-xs text-gray-400 mt-1">Uses browser storage after dismiss. Separate from once-per-session.</p>
        </div>

        <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
          Current status: <strong className="capitalize">{status}</strong>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => saveAs('draft')} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-60">
          <Save size={16} /> {saving ? 'Saving…' : 'Save draft'}
        </button>
        <button type="button" onClick={() => saveAs('active')} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm text-white disabled:opacity-60" style={{ backgroundColor: '#16a34a' }}>
          <Play size={16} /> {saving ? 'Publishing…' : 'Publish'}
        </button>
        {status === 'active' && (
          <button type="button" onClick={() => saveAs('paused')} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm border border-amber-200 text-amber-800 hover:bg-amber-50 disabled:opacity-60">
            <Pause size={16} /> Pause
          </button>
        )}
        {status !== 'expired' && (
          <button type="button" onClick={() => saveAs('expired')} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-60">
            <Square size={16} /> End now
          </button>
        )}
        <button type="button" onClick={() => setShowPreview(true)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm border border-gray-200 text-gray-700 hover:bg-gray-50">
          <Eye size={16} /> Preview
        </button>
        {initialAnnouncement?.id && (
          <button type="button" onClick={remove} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm text-red-700 border border-red-200">
            <Trash2 size={16} /> Delete
          </button>
        )}
      </div>

      {showPreview && (
        <AnnouncementPreviewModal
          announcement={{
            title,
            body,
            image_url: imageUrl,
            cta_label: ctaLabel,
            cta_url: ctaUrl,
            dismissible,
            slug,
            append_utm: appendUtm,
          }}
          onClose={() => setShowPreview(false)}
        />
      )}

      <AdminToast message={toast} tone={toastTone} onDone={() => setToast(null)} />
    </div>
  )
}
