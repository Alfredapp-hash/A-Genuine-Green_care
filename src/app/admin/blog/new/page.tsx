// TODO: connect Supabase
// import { redirect } from 'next/navigation'
// import { createClient } from '@/lib/supabase/server'
import BlogPostForm from '../_components/BlogPostForm'

export default async function NewBlogPostPage() {
  // TODO: connect Supabase auth
  // const supabase = await createClient()
  // const { data: { user } } = await supabase.auth.getUser()
  // if (!user) redirect('/login')

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-1" style={{ color: '#2c6b4a' }}>New Blog Post</h1>
      <p className="text-gray-500 text-sm mb-8">Write your post, schedule it, and publish.</p>
      <BlogPostForm />
    </div>
  )
}
