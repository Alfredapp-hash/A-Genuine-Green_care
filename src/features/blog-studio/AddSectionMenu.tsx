'use client'
import type { BlogBlock } from './types'
import { blockRegistry } from './blockRegistry'

// Friendly labels and descriptions for non-technical users
const FRIENDLY: Partial<Record<BlogBlock['type'], { label: string; description: string }>> = {
  heading:          { label: 'Heading',                    description: 'A bold section title' },
  paragraph:        { label: 'Text Section',               description: 'A paragraph of written content' },
  rich_text:        { label: 'Rich Text',                  description: 'Formatted text with bold, lists, and links' },
  quote:            { label: 'Customer Quote',             description: 'A testimonial or pull quote' },
  image_text:       { label: 'Photo + Text',               description: 'Side-by-side image and text' },
  full_image:       { label: 'Full-Width Photo',           description: 'A large banner-style photo' },
  gallery:          { label: 'Photo Gallery',              description: 'Multiple photos in a grid' },
  youtube_video:    { label: 'YouTube Video',              description: 'Paste a YouTube link to embed a video' },
  vimeo_video:      { label: 'Vimeo Video',                description: 'Paste a Vimeo link to embed a video' },
  video:            { label: 'Video',                      description: 'Embed a YouTube, Vimeo, or direct video' },
  external_video:   { label: 'Video from Another Site',   description: 'Embed from Wistia, Loom, or other approved sites' },
  button_cta:       { label: 'Button / Call to Action',   description: 'A button that links to a page or action' },
  cta:              { label: 'Call to Action Banner',     description: 'A full-width CTA section with heading and buttons' },
  service_callout:  { label: 'Service Highlight',         description: 'Showcase related services with cards' },
  faq:              { label: 'Frequently Asked Questions', description: 'Expandable Q&A list' },
  checklist:        { label: 'Checklist',                  description: 'A numbered or bulleted checklist' },
  service_steps:    { label: 'Step-by-Step Process',      description: 'Numbered steps explaining a process' },
  related_services: { label: 'Related Services',          description: 'Links to related service pages' },
  divider:          { label: 'Divider Line',               description: 'A visual separator between sections' },
  hero:             { label: 'Hero Image',                 description: 'A large header image with title overlay' },
  intro:            { label: 'Introduction',               description: 'Opening section with headline and body' },
  quick_answer:     { label: 'Quick Answer Box',           description: 'A highlighted answer to a question' },
  before_after:     { label: 'Before & After',             description: 'Side-by-side comparison photos' },
  trust_badges:     { label: 'Trust Badges',               description: 'Certification and trust indicators' },
  specs_table:      { label: 'Specs Table',                description: 'A table of specifications or details' },
  comparison_table: { label: 'Comparison Table',          description: 'Compare two or more options' },
  related_inventory:{ label: 'Related Boats',              description: 'Link to related inventory listings' },
  team_member:      { label: 'Team Member Profile',        description: 'Highlight a staff member' },
  warning_signs:    { label: 'Warning Signs',              description: 'A list of signs the reader should watch for' },
  map:              { label: 'Map',                        description: 'Show your location on a map' },
  contact_form:     { label: 'Contact Form',               description: 'An inline service request form' },
}

// Friendly category names
const CATEGORY_LABELS: Record<string, string> = {
  content: 'Writing',
  media:   'Photos & Video',
  cta:     'Calls to Action',
  layout:  'Layout',
  social:  'Social Proof',
  data:    'Data & Tables',
}

// Preferred display order within each category
const CATEGORY_ORDER = ['content', 'media', 'cta', 'layout', 'social', 'data']

type Props = {
  onAdd: (type: BlogBlock['type']) => void
  onClose: () => void
}

export default function AddSectionMenu({ onAdd, onClose }: Props) {
  const byCategory: Record<string, Array<[string, { label: string; description: string }]>> = {}

  for (const [type, entry] of Object.entries(blockRegistry)) {
    const cat = entry.category
    const friendly = FRIENDLY[type as BlogBlock['type']]
    if (!byCategory[cat]) byCategory[cat] = []
    byCategory[cat].push([type, { label: friendly?.label ?? entry.label, description: friendly?.description ?? '' }])
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4" style={{ backgroundColor: 'rgba(4,14,33,0.65)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <p className="font-bold text-gray-900 text-sm">Add a Section</p>
            <p className="text-xs text-gray-400 mt-0.5">Choose the type of content to add to your post.</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">✕</button>
        </div>

        {/* Categories */}
        <div className="overflow-y-auto p-4 space-y-5">
          {CATEGORY_ORDER.filter((cat) => byCategory[cat]?.length).map((cat) => (
            <div key={cat}>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#0d2b55' }}>
                {CATEGORY_LABELS[cat] ?? cat}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {byCategory[cat].map(([type, { label, description }]) => (
                  <button
                    key={type}
                    onClick={() => { onAdd(type as BlogBlock['type']); onClose() }}
                    className="group text-left flex items-start gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-[#0d2b55]/5 hover:border-[#0d2b55]/30 transition-all"
                  >
                    <span className="text-lg mt-0.5 shrink-0">{blockRegistry[type as BlogBlock['type']]?.icon}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-800 group-hover:text-[#0d2b55]">{label}</p>
                      {description && <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{description}</p>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
