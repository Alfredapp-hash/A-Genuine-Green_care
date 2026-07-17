import AnnouncementForm from '../_components/AnnouncementForm'

export default async function NewAnnouncementPage() {
  // TODO: connect Supabase — add auth check here
  // const supabase = await createClient()
  // const { data: { user } } = await supabase.auth.getUser()
  // if (!user) redirect('/login')

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-1" style={{ color: '#1B3A5C' }}>New Announcement</h1>
      <p className="text-gray-500 text-sm mb-8">Popup announcement shown on the Saltwater Sprouts site.</p>
      <AnnouncementForm />
    </div>
  )
}
