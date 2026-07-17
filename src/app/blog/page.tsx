import type { Metadata } from 'next'
// TODO: connect Supabase
// import { createClient } from '@/lib/supabase/server'
import BlogClientPage, { type Post } from '@/components/blog/BlogClientPage'

export const metadata: Metadata = {
  title: 'Tips & News | Saltwater Sprouts Early Learning Center',
  description:
    'Early learning tips, child development insights, and news from Saltwater Sprouts Early Learning Center.',
  openGraph: {
    title: 'Tips & News | Saltwater Sprouts Early Learning Center',
    description: 'Early learning tips, child development insights, and news from Saltwater Sprouts.',
  },
}

export default async function BlogPage() {
  // TODO: connect Supabase
  // const supabase = await createClient()

  // Legacy blog_posts (TipTap HTML posts)
  // const { data: legacyData } = await supabase
  //   .from('blog_posts')
  //   .select('id, title, slug, summary, cover_image_url, published_at, tags')
  //   .eq('published', true)
  //   .order('published_at', { ascending: false })

  // Blog Studio block-based posts
  // const { data: studioData } = await supabase
  //   .from('blog_studio_posts')
  //   .select('id, title, slug, excerpt, featured_image, published_at, tags, category')
  //   .eq('status', 'published')
  //   .order('published_at', { ascending: false })

  // Return empty arrays until Supabase is connected — sample data renders via BlogClientPage
  const allPosts: Post[] = []

  return <BlogClientPage livePosts={allPosts} />
}
