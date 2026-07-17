import StaffClient, { type StaffPosition } from './StaffClient'

async function getStaffPositions(): Promise<StaffPosition[]> {
  // TODO: connect Supabase
  // const { createClient } = await import('@/lib/supabase/server')
  // const supabase = await createClient()
  // const { data, error } = await supabase
  //   .from('staff_positions')
  //   .select('id, title, slug, type, description, duties, requirements, pay_range, location, active, sort_order')
  //   .order('sort_order', { ascending: true })
  //   .order('title', { ascending: true })
  // if (error) console.error('[staff] select error:', error)
  // return (data as unknown as StaffPosition[]) ?? []
  return []
}

export default async function AdminStaffPage() {
  const positions = await getStaffPositions()
  return <StaffClient initialPositions={positions} />
}
