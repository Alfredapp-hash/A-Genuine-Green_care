import type { Metadata } from 'next'
import { Suspense } from 'react'
import BlogStudioDashboard from '@/features/blog-studio/BlogStudioDashboard'

export const metadata: Metadata = {
  title: 'Blog Studio | Thomas Marine Admin',
  description: 'Create and manage blog content with structured blocks.',
  robots: { index: false, follow: false },
}

export default function BlogStudioPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f0f4f8' }}>
        <p className="text-gray-400 text-sm">Loading Blog Studio…</p>
      </div>
    }>
      <BlogStudioDashboard />
    </Suspense>
  )
}
