'use client'
import { useEffect, useRef, useCallback } from 'react'
import type { BlogPost } from './types'
import type { SaveState } from './DraftAutosaveStatus'

const LS_KEY = (id: string) => `blog_studio_draft_${id}`

export function saveLocalDraft(post: BlogPost) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(LS_KEY(post.id), JSON.stringify({ post, savedAt: Date.now() }))
  } catch { /* quota exceeded or private mode */ }
}

export function loadLocalDraft(id: string): { post: BlogPost; savedAt: number } | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(LS_KEY(id))
    if (!raw) return null
    return JSON.parse(raw)
  } catch { return null }
}

export function clearLocalDraft(id: string) {
  if (typeof window === 'undefined') return
  try { localStorage.removeItem(LS_KEY(id)) } catch { /* noop */ }
}

export function useAutosave(
  post: BlogPost,
  onSave: (p: BlogPost) => Promise<void>,
  setSaveState: (s: SaveState) => void,
  delayMs = 3000,
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestPost = useRef(post)
  useEffect(() => { latestPost.current = post })

  const flush = useCallback(async () => {
    setSaveState('saving')
    saveLocalDraft(latestPost.current)
    await onSave(latestPost.current)
    setSaveState('saved')
    clearLocalDraft(latestPost.current.id)
    setTimeout(() => setSaveState('idle'), 2500)
  }, [onSave, setSaveState])

  useEffect(() => {
    setSaveState('unsaved')
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => { void flush() }, delayMs)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post])

  // Warn before unload when unsaved
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [])

  return { flush }
}
