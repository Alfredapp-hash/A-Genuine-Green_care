import { notFound } from 'next/navigation'
import AnnouncementForm, { type AnnouncementInitial } from '../_components/AnnouncementForm'

async function getAnnouncement(_id: string): Promise<AnnouncementInitial | null> {
  // TODO: connect Supabase
  // const { createStaffAdminClient } = await import('@/lib/admin/staff-supabase')
  // const staff = await createStaffAdminClient()
  // if (!staff.ok) return null
  // const { data } = await staff.supabase
  //   .from('announcements')
  //   .select('*')
  //   .eq('id', id)
  //   .single()
  // return data as unknown as AnnouncementInitial | null
  return null
}

export default async function EditAnnouncementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // TODO: connect Supabase — add auth check here
  // const supabase = await createClient()
  // const { data: { user } } = await supabase.auth.getUser()
  // if (!user) redirect('/login')

  const announcement = await getAnnouncement(id)
  if (!announcement) notFound()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-1" style={{ color: '#1B3A5C' }}>Edit Announcement</h1>
      <p className="text-gray-500 text-sm mb-8">{announcement.title}</p>
      <AnnouncementForm initialAnnouncement={announcement} />
    </div>
  )
}
