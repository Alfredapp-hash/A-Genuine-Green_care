// Stub auth layer — replace with Supabase auth when ready.
// All functions reference a localStorage key "sws_parent_session".

export type ParentSession = {
  id: string
  name: string
  email: string
  children: ChildRecord[]
  balance: number          // cents owed
}

export type ChildRecord = {
  id: string
  name: string
  dob: string             // ISO date
  program: string
  enrolledSince: string
  photoCount: number
}

// Demo session used until Supabase auth is wired up
export const DEMO_SESSION: ParentSession = {
  id: 'parent-001',
  name: 'Jane Parent',
  email: 'parent@example.com',
  balance: 42500,          // $425.00 owed
  children: [
    {
      id: 'child-001',
      name: 'Emma',
      dob: '2022-03-15',
      program: 'Toddlers (2–3 years)',
      enrolledSince: '2024-09-01',
      photoCount: 12,
    },
    {
      id: 'child-002',
      name: 'Liam',
      dob: '2023-11-02',
      program: 'Infant Care (6 weeks–12 months)',
      enrolledSince: '2025-01-06',
      photoCount: 7,
    },
  ],
}

// Demo photo stubs per child — replace with Supabase Storage URLs
export type ChildPhoto = {
  id: string
  childId: string
  url: string
  thumbnail: string
  caption?: string
  takenAt: string
  filename: string
}

export const DEMO_PHOTOS: ChildPhoto[] = [
  { id: 'p1',  childId: 'child-001', url: '/demo/photo-placeholder.png', thumbnail: '/demo/photo-placeholder.png', caption: 'Art time!',           takenAt: '2025-06-10', filename: 'emma-art-2025-06-10.jpg' },
  { id: 'p2',  childId: 'child-001', url: '/demo/photo-placeholder.png', thumbnail: '/demo/photo-placeholder.png', caption: 'Storytime',            takenAt: '2025-06-12', filename: 'emma-storytime-2025-06-12.jpg' },
  { id: 'p3',  childId: 'child-001', url: '/demo/photo-placeholder.png', thumbnail: '/demo/photo-placeholder.png', caption: 'Playground fun',       takenAt: '2025-06-15', filename: 'emma-playground-2025-06-15.jpg' },
  { id: 'p4',  childId: 'child-001', url: '/demo/photo-placeholder.png', thumbnail: '/demo/photo-placeholder.png', caption: 'Sensory bin',          takenAt: '2025-06-18', filename: 'emma-sensory-2025-06-18.jpg' },
  { id: 'p5',  childId: 'child-002', url: '/demo/photo-placeholder.png', thumbnail: '/demo/photo-placeholder.png', caption: 'Tummy time',           takenAt: '2025-06-11', filename: 'liam-tummy-2025-06-11.jpg' },
  { id: 'p6',  childId: 'child-002', url: '/demo/photo-placeholder.png', thumbnail: '/demo/photo-placeholder.png', caption: 'Nap time champion',    takenAt: '2025-06-14', filename: 'liam-nap-2025-06-14.jpg' },
]

export function formatCents(cents: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
}
