'use client'
import type { BlogSnippet } from './types'

// TODO: Move snippets to Supabase table: blog_snippets
const SNIPPETS: BlogSnippet[] = [
  {
    id: 'snip_01',
    label: 'Schedule Service CTA',
    description: 'Navy gradient CTA with Schedule Service + Call Us buttons',
    blockType: 'cta',
    data: {
      title: 'Ready to Schedule Service?',
      text: 'Thomas Marine provides factory-trained Suzuki service in Georgetown, SC.',
      primaryButtonText: 'Schedule Service',
      primaryButtonUrl: '/contact',
      secondaryButtonText: '(843) 833-8054',
      secondaryButtonUrl: 'tel:8438338054',
      style: 'service',
    } as never,
  },
  {
    id: 'snip_02',
    label: 'Pre-Owned Inventory CTA',
    description: 'Inventory-style CTA linking to /inventory',
    blockType: 'cta',
    data: {
      title: 'Shopping for Your Next Boat?',
      text: 'Browse trusted pre-owned inventory from Thomas Marine.',
      primaryButtonText: 'View Pre-Owned Inventory',
      primaryButtonUrl: '/inventory',
      style: 'inventory',
    } as never,
  },
  {
    id: 'snip_03',
    label: 'Contact Thomas Marine CTA',
    description: 'General contact CTA with phone and email',
    blockType: 'cta',
    data: {
      title: 'Have Questions? We\'re Here to Help.',
      primaryButtonText: 'Contact Our Team',
      primaryButtonUrl: '/contact',
      secondaryButtonText: '(843) 833-8054',
      secondaryButtonUrl: 'tel:8438338054',
      style: 'contact',
    } as never,
  },
  {
    id: 'snip_04',
    label: 'Suzuki Outboard Disclaimer',
    description: 'Standard authorized dealer disclaimer paragraph',
    blockType: 'rich_text',
    data: {
      heading: '',
      body: 'Thomas Marine, LLC is an authorized Suzuki Marine dealer. All Suzuki outboard service is performed by factory-trained technicians using genuine Suzuki parts. Service intervals and recommendations are based on Suzuki factory guidelines and may vary by model, usage, and operating conditions.',
    } as never,
  },
  {
    id: 'snip_05',
    label: 'Myrtle Beach Service Area Paragraph',
    description: 'Boilerplate service area copy for local SEO',
    blockType: 'rich_text',
    data: {
      heading: '',
      body: 'Thomas Marine serves boat owners throughout Georgetown County, Pawleys Island, Murrells Inlet, Myrtle Beach, and the surrounding South Carolina Lowcountry. Whether you need outboard service, a repower, or help finding your next boat, we\'re your local marine team.',
    } as never,
  },
  {
    id: 'snip_06',
    label: 'Shop Confidently Statement',
    description: 'Trust-building paragraph for buying guide posts',
    blockType: 'rich_text',
    data: {
      heading: 'Shop With Confidence',
      body: 'Every pre-owned boat Thomas Marine sells has gone through our service department. We stand behind what we sell and are happy to walk you through the history and condition of any boat in our inventory.',
    } as never,
  },
]

type Props = {
  onInsert: (snippet: BlogSnippet) => void
  onClose: () => void
}

export default function SnippetLibraryPanel({ onInsert, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900">Snippet Library</h2>
            <p className="text-xs text-gray-400 mt-0.5">Insert a reusable block into your post</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        <div className="overflow-y-auto p-4 space-y-3">
          {SNIPPETS.map((snip) => (
            <div key={snip.id} className="flex items-start justify-between gap-4 border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
              <div>
                <p className="text-sm font-semibold text-gray-900">{snip.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{snip.description}</p>
                <span className="inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                  {snip.blockType.replace(/_/g, ' ')}
                </span>
              </div>
              <button
                onClick={() => { onInsert(snip); onClose() }}
                className="shrink-0 text-xs font-bold px-4 py-2 rounded-full text-white transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #1d4ed8, #0a2d7a)' }}
              >
                Insert
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
