'use client'

type AnnouncementStatus = 'draft' | 'active' | 'paused' | 'expired'

type ReadinessCheck = {
  label: string
  detail: string
  ok: boolean
}

type ReadinessResult = {
  liveNow: boolean
  checks: ReadinessCheck[]
  blockers: string[]
}

function computeReadiness(args: {
  status: AnnouncementStatus
  title: string
  cta_url: string | null
  scheduled_start: string | null
  scheduled_end: string | null
  target_paths: string[]
}): ReadinessResult {
  const now = new Date()
  const checks: ReadinessCheck[] = []
  const blockers: string[] = []

  const isActive = args.status === 'active'
  checks.push({ label: 'Status', detail: args.status, ok: isActive })
  if (!isActive) blockers.push('not active')

  const hasTitle = args.title.trim().length > 0
  checks.push({ label: 'Title', detail: hasTitle ? args.title : 'Missing', ok: hasTitle })
  if (!hasTitle) blockers.push('title required')

  const startOk = !args.scheduled_start || new Date(args.scheduled_start) <= now
  checks.push({
    label: 'Start date',
    detail: args.scheduled_start ? new Date(args.scheduled_start).toLocaleDateString() : 'Immediate',
    ok: startOk,
  })
  if (!startOk) blockers.push('scheduled in the future')

  const endOk = !args.scheduled_end || new Date(args.scheduled_end) > now
  checks.push({
    label: 'End date',
    detail: args.scheduled_end ? new Date(args.scheduled_end).toLocaleDateString() : 'No end',
    ok: endOk,
  })
  if (!endOk) blockers.push('end date has passed')

  const pathsOk = args.target_paths.length === 0 || args.target_paths.length > 0
  checks.push({
    label: 'Pages',
    detail: args.target_paths.length === 0 ? 'All pages' : `${args.target_paths.length} page(s)`,
    ok: pathsOk,
  })

  return {
    liveNow: isActive && hasTitle && startOk && endOk,
    checks,
    blockers,
  }
}

type Props = {
  status: AnnouncementStatus
  title: string
  ctaUrl: string
  scheduledStart: string
  scheduledEnd: string
  targetPaths: string[]
}

export default function AnnouncementReadinessPanel(props: Props) {
  const readiness = computeReadiness({
    status: props.status,
    title: props.title,
    cta_url: props.ctaUrl || null,
    scheduled_start: props.scheduledStart ? new Date(props.scheduledStart).toISOString() : null,
    scheduled_end: props.scheduledEnd ? new Date(props.scheduledEnd).toISOString() : null,
    target_paths: props.targetPaths,
  })

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">Will this show?</h2>
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
            readiness.liveNow ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-900'
          }`}
        >
          {readiness.liveNow ? 'Live now' : 'Not live yet'}
        </span>
      </div>

      <ul className="space-y-2">
        {readiness.checks.map((check) => (
          <li key={check.label} className="flex items-start gap-2 text-sm">
            <span className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${check.ok ? 'bg-green-500' : 'bg-amber-500'}`} />
            <div>
              <span className="font-semibold text-gray-700">{check.label}: </span>
              <span className="text-gray-600">{check.detail}</span>
            </div>
          </li>
        ))}
      </ul>

      {readiness.blockers.length > 0 && (
        <p className="text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
          Blockers: {readiness.blockers.join(' · ')}
        </p>
      )}
    </div>
  )
}
