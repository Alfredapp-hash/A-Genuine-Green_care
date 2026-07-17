// ─────────────────────────────────────────────────────────────────────────────
// Social post queue — placeholder implementation
// TODO: Replace with a real job queue when live posting is enabled.
//       Recommended options:
//       - BullMQ + Redis (self-hosted or Upstash)
//       - Supabase pg_cron + Edge Functions
//       - Vercel Cron Jobs (/api/cron/social-queue)
//       - Netlify Scheduled Functions
// ─────────────────────────────────────────────────────────────────────────────
import type { SocialPostStatus } from './types'

export type QueueEntry = {
  postId: string
  campaignId: string
  platform: string
  scheduledFor?: string
  queuedAt: string
  status: SocialPostStatus
  attempts: number
  lastError?: string
}

// In-memory queue — resets on page reload.
// TODO: Persist to Supabase `social_post_queue` table.
const _queue: QueueEntry[] = []

export function enqueueSocialPost(
  postId: string,
  campaignId: string,
  platform: string,
  scheduledFor?: string,
): QueueEntry {
  const entry: QueueEntry = {
    postId,
    campaignId,
    platform,
    scheduledFor,
    queuedAt: new Date().toISOString(),
    status: 'queued',
    attempts: 0,
  }
  _queue.push(entry)
  return entry
}

export async function processSocialQueue(): Promise<void> {
  // TODO: This function would be called by a cron job or worker.
  console.warn('[SocialQueue] processSocialQueue() is a placeholder. No real jobs are run.')
}

export function cancelQueuedSocialPost(postId: string): void {
  const idx = _queue.findIndex((e) => e.postId === postId)
  if (idx !== -1) {
    _queue[idx].status = 'cancelled'
  }
}

export function getQueueSnapshot(): QueueEntry[] {
  return [..._queue]
}
