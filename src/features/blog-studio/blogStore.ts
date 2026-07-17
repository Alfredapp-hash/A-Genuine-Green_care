'use client'

// ─────────────────────────────────────────────────────────────────────────────
// Blog Studio — Supabase-backed persistence store
// All mutations go through /api/blog-studio/* server routes (auth-gated).
// Falls back to SAMPLE_POSTS for the initial optimistic render before data loads.
// ─────────────────────────────────────────────────────────────────────────────

import { nanoid } from 'nanoid'
import type { BlogPost, BlogPostType } from './types'
import { SAMPLE_POSTS } from './sampleData'
import { getFormatMeta, DEFAULT_SEO } from './templates'

const BASE = '/api/blog-studio'

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error((err as { error: string }).error ?? res.statusText)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// ── Public API — all async ────────────────────────────────────────────────────

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    return await apiFetch<BlogPost[]>(BASE)
  } catch {
    return SAMPLE_POSTS
  }
}

export async function getBlogPostById(id: string): Promise<BlogPost | undefined> {
  try {
    return await apiFetch<BlogPost>(`${BASE}/${id}`)
  } catch {
    return SAMPLE_POSTS.find((p) => p.id === id)
  }
}

export async function createBlogPost(
  postType: BlogPostType,
  options?: { blank?: boolean },
): Promise<BlogPost> {
  const meta = getFormatMeta(postType)
  const now = new Date().toISOString()
  const newPost: BlogPost = {
    id: nanoid(),
    title: `New ${meta.label}`,
    slug: `new-${meta.type.replace(/_/g, '-')}-${Date.now()}`,
    excerpt: '',
    postType,
    category: 'Boat Maintenance',
    tags: [],
    blocks: options?.blank ? [] : meta.createBlocks(),
    seo: { ...DEFAULT_SEO },
    design: { ...meta.defaultDesign },
    status: 'draft',
    featured: false,
    showOnBlogPage: false,
    authorName: 'Admin',
    createdAt: now,
    updatedAt: now,
  }
  return apiFetch<BlogPost>(BASE, { method: 'POST', body: JSON.stringify(newPost) })
}

export async function updateBlogPost(id: string, patch: Partial<BlogPost>): Promise<BlogPost | undefined> {
  const slugPatch = patch.slug ?? (patch.title ? slugify(patch.title) : undefined)
  return apiFetch<BlogPost>(`${BASE}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ ...patch, ...(slugPatch ? { slug: slugPatch } : {}) }),
  })
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  try {
    await apiFetch<void>(`${BASE}/${id}`, { method: 'DELETE' })
    return true
  } catch {
    return false
  }
}

export async function duplicateBlogPost(id: string): Promise<BlogPost | undefined> {
  const post = await getBlogPostById(id)
  if (!post) return undefined
  const now = new Date().toISOString()
  const copy: BlogPost = {
    ...JSON.parse(JSON.stringify(post)),
    id: nanoid(),
    title: `${post.title} (Copy)`,
    slug: `${post.slug}-copy-${Date.now()}`,
    status: 'draft',
    featured: false,
    publishedAt: undefined,
    createdAt: now,
    updatedAt: now,
  }
  return apiFetch<BlogPost>(BASE, { method: 'POST', body: JSON.stringify(copy) })
}

export async function publishBlogPost(id: string): Promise<BlogPost | undefined> {
  return apiFetch<BlogPost>(`${BASE}/${id}/publish`, { method: 'POST' })
}

export async function archiveBlogPost(id: string): Promise<BlogPost | undefined> {
  return updateBlogPost(id, { status: 'archived' })
}
