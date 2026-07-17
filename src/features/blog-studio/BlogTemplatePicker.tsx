'use client'
import { useMemo, useState } from 'react'
import { nanoid } from 'nanoid'
import type { BlogBlock } from './types'

export type TemplateCategory = 'Article' | 'Service' | 'Sales' | 'Seasonal'

export type StudioTemplate = {
  id: string
  label: string
  description: string
  icon: string
  category: TemplateCategory
  blocks: () => BlogBlock[]
}

const CATEGORY_ORDER: TemplateCategory[] = ['Article', 'Service', 'Sales', 'Seasonal']

function heading(text: string, level: 2 | 3 = 2, eyebrow?: string): BlogBlock {
  return { id: nanoid(), type: 'heading', enabled: true, internalLabel: 'Heading', data: { text, level, align: 'left', eyebrow } }
}
function paragraph(body: string): BlogBlock {
  return { id: nanoid(), type: 'paragraph', enabled: true, internalLabel: 'Text Section', data: { body, size: 'base', align: 'left' } }
}
function divider(style: 'line' | 'wave' | 'dots' | 'space' = 'line'): BlogBlock {
  return { id: nanoid(), type: 'divider', enabled: true, internalLabel: 'Divider', data: { style } }
}
function cta(title: string, url = '/contact'): BlogBlock {
  return { id: nanoid(), type: 'cta', enabled: true, internalLabel: 'Call To Action', data: { title, text: 'Our certified team is ready to help.', primaryButtonText: 'Schedule Service', primaryButtonUrl: url, style: 'service' } }
}
function buttonCta(label: string, url = '/contact'): BlogBlock {
  return { id: nanoid(), type: 'button_cta', enabled: true, internalLabel: 'Button', data: { label, url, style: 'primary', align: 'center', subtext: 'Georgetown, SC — (843) 833-8054' } }
}

export const STUDIO_TEMPLATES: StudioTemplate[] = [
  {
    id: 'standard_blog',
    label: 'Standard Blog Post',
    description: 'A clean article with intro, main content, and a service CTA.',
    icon: '📝',
    category: 'Article',
    blocks: () => [
      heading('Your Post Title Here'),
      paragraph('Write your introduction here. Tell readers what this post is about and why it matters to them as a boat owner.'),
      divider('wave'),
      heading('Main Section Heading', 2),
      paragraph('Add your main content here. Break it into multiple text sections as needed.'),
      divider('dots'),
      { id: nanoid(), type: 'quote', enabled: true, internalLabel: 'Customer Quote', data: { quote: 'Add a customer testimonial or key takeaway here.', attribution: 'Happy Customer', role: 'Georgetown, SC' } } as BlogBlock,
      divider('line'),
      cta('Ready to Schedule Service?'),
    ],
  },
  {
    id: 'service_explainer',
    label: 'Service Explainer',
    description: 'Walk customers through a service with steps and FAQs.',
    icon: '🔧',
    category: 'Service',
    blocks: () => [
      heading('What Is [Service Name] and Why Does It Matter?'),
      paragraph('Explain the service in simple terms. Who needs it? When should it be done?'),
      divider('wave'),
      { id: nanoid(), type: 'quick_answer', enabled: true, internalLabel: 'Quick Answer', data: { title: 'What is the short answer?', answer: 'Summarize the service benefit in 1–2 sentences here.' } } as BlogBlock,
      heading('How the Service Works', 2),
      { id: nanoid(), type: 'service_steps', enabled: true, internalLabel: 'Service Steps', data: { heading: 'Our Process', steps: [ { id: nanoid(), stepNumber: 1, title: 'Inspection', description: 'We inspect your boat\'s system before beginning work.' }, { id: nanoid(), stepNumber: 2, title: 'Service', description: 'Our certified technicians perform the service.' }, { id: nanoid(), stepNumber: 3, title: 'Quality Check', description: 'We verify everything is working correctly.' }, ] } } as BlogBlock,
      divider('dots'),
      { id: nanoid(), type: 'faq', enabled: true, internalLabel: 'FAQ', data: { heading: 'Common Questions', items: [ { id: nanoid(), question: 'How often should this be done?', answer: 'Enter the recommended frequency here.' }, { id: nanoid(), question: 'How much does it cost?', answer: 'Contact us for a free estimate.' }, ] } } as BlogBlock,
      buttonCta('Get a Free Estimate'),
    ],
  },
  {
    id: 'maintenance_checklist',
    label: 'Maintenance Checklist',
    description: 'A practical checklist post with numbered steps.',
    icon: '✅',
    category: 'Service',
    blocks: () => [
      heading('Your Complete [Topic] Checklist'),
      paragraph('Use this checklist to make sure you cover every step. A few minutes of preparation can save hours of trouble on the water.'),
      divider('line'),
      { id: nanoid(), type: 'checklist', enabled: true, internalLabel: 'Checklist', data: { heading: 'What to Check', intro: 'Go through each item before heading out.', items: [ { id: nanoid(), text: 'Check engine oil level', note: 'Replace if dark or low.' }, { id: nanoid(), text: 'Inspect fuel lines for cracks', note: 'Replace any cracked lines immediately.' }, { id: nanoid(), text: 'Test navigation lights', note: 'Required by law after sunset.' }, { id: nanoid(), text: 'Check battery charge level', note: 'Should read 12.6V or higher.' }, { id: nanoid(), text: 'Inspect propeller for damage', note: 'Any dings affect performance.' }, ] } } as BlogBlock,
      divider('dots'),
      paragraph('If any of these items need attention, bring your boat in before your next trip. Catching issues early is always less expensive than repairs.'),
      cta('Schedule a Pre-Season Inspection'),
    ],
  },
  {
    id: 'before_after',
    label: 'Before & After Project',
    description: 'Showcase a restoration or repair project with before/after photos.',
    icon: '🔄',
    category: 'Sales',
    blocks: () => [
      heading('Project Spotlight: [Describe the Job]'),
      paragraph('Describe the project. Who brought the boat in? What was the issue? What were the goals?'),
      divider('wave'),
      { id: nanoid(), type: 'before_after', enabled: true, internalLabel: 'Before & After', data: { heading: 'The Transformation', beforeImage: { id: '', url: '', alt: 'Before' }, afterImage: { id: '', url: '', alt: 'After' }, beforeLabel: 'Before', afterLabel: 'After', description: 'Describe the key difference the work made.' } } as BlogBlock,
      divider('dots'),
      heading('What We Did', 2),
      { id: nanoid(), type: 'service_steps', enabled: true, internalLabel: 'Steps', data: { heading: 'The Process', steps: [ { id: nanoid(), stepNumber: 1, title: 'Assessment', description: 'We evaluated the full scope of work needed.' }, { id: nanoid(), stepNumber: 2, title: 'Repair Work', description: 'Our technicians completed the work to factory spec.' }, { id: nanoid(), stepNumber: 3, title: 'Final Detail', description: 'We finished with a thorough clean and quality inspection.' }, ] } } as BlogBlock,
      cta('Have a Similar Project?'),
    ],
  },
  {
    id: 'video_post',
    label: 'Video Post',
    description: 'Center a post around a YouTube or Vimeo video.',
    icon: '▶️',
    category: 'Article',
    blocks: () => [
      heading('Watch: [Video Title]'),
      paragraph('Add a short intro before the video. What will viewers learn? Why should they watch?'),
      { id: nanoid(), type: 'youtube_video', enabled: true, internalLabel: 'Main Video', data: { url: '', heading: '', caption: 'Video from Thomas Marine LLC' } } as BlogBlock,
      divider('line'),
      heading('Key Takeaways', 2),
      { id: nanoid(), type: 'checklist', enabled: true, internalLabel: 'Key Takeaways', data: { heading: 'What You Learned', intro: '', items: [ { id: nanoid(), text: 'Add a key point from the video here.' }, { id: nanoid(), text: 'Add another takeaway.' }, ] } } as BlogBlock,
      cta('Questions? We Are Here to Help.'),
    ],
  },
  {
    id: 'faq_article',
    label: 'FAQ Article',
    description: 'Answer common customer questions in one place.',
    icon: '❓',
    category: 'Article',
    blocks: () => [
      heading('Everything You Need to Know About [Topic]'),
      paragraph('This guide answers the most common questions we hear from boat owners in Georgetown, SC. Bookmark it as a reference.'),
      divider('wave'),
      { id: nanoid(), type: 'faq', enabled: true, internalLabel: 'FAQ Section', data: { heading: 'Frequently Asked Questions', items: [ { id: nanoid(), question: 'What is the first question?', answer: 'Write a clear, direct answer here.' }, { id: nanoid(), question: 'What is the second question?', answer: 'Write a clear, direct answer here.' }, { id: nanoid(), question: 'What is the third question?', answer: 'Write a clear, direct answer here.' }, { id: nanoid(), question: 'How do I schedule service?', answer: 'Call us at (843) 833-8054 or fill out our contact form online.' }, ] } } as BlogBlock,
      divider('dots'),
      { id: nanoid(), type: 'service_callout', enabled: true, internalLabel: 'Service Callout', data: { heading: 'Still Have Questions?', description: 'Our team at Thomas Marine is always happy to help. Stop by or call us.', services: [ { id: nanoid(), name: 'Call Us', description: '(843) 833-8054', url: 'tel:8438338054' }, { id: nanoid(), name: 'Visit Us', description: '1199 David W Ray Road, Georgetown, SC', url: '/contact' }, ] } } as BlogBlock,
    ],
  },
  {
    id: 'seasonal_reminder',
    label: 'Seasonal Service Reminder',
    description: 'Timely service reminders for spring/fall/winter.',
    icon: '🌊',
    category: 'Seasonal',
    blocks: () => [
      heading('It\'s Time for Your [Season] Boat Service'),
      paragraph('Seasonal service keeps your boat running reliably and protects your investment. Here\'s what to schedule now and why it matters.'),
      divider('wave'),
      { id: nanoid(), type: 'checklist', enabled: true, internalLabel: 'Seasonal Checklist', data: { heading: 'This Season\'s Service List', intro: 'These are the most important items for this time of year.', items: [ { id: nanoid(), text: 'Engine oil and filter change' }, { id: nanoid(), text: 'Gear oil change (lower unit)' }, { id: nanoid(), text: 'Fuel system inspection' }, { id: nanoid(), text: 'Cooling system flush and inspect' }, { id: nanoid(), text: 'Battery test and terminal clean' }, ] } } as BlogBlock,
      divider('dots'),
      { id: nanoid(), type: 'quick_answer', enabled: true, internalLabel: 'Why Now?', data: { title: 'Why does timing matter?', answer: 'Scheduling early means you beat the rush and your boat is ready when the season starts. Most service issues found during seasonal inspections are minor — until they are not.' } } as BlogBlock,
      cta('Book Your Seasonal Service Now'),
    ],
  },
  {
    id: 'inventory_spotlight',
    label: 'Boat or Inventory Spotlight',
    description: 'Showcase a specific boat or product in detail.',
    icon: '🛥️',
    category: 'Sales',
    blocks: () => [
      heading('Spotlight: [Year Make Model]'),
      paragraph('Describe the boat or product. Key features, condition, and what makes it stand out. Who is this a great fit for?'),
      divider('wave'),
      { id: nanoid(), type: 'specs_table', enabled: true, internalLabel: 'Specs', data: { heading: 'Key Specifications', specs: [ { id: nanoid(), label: 'Year', value: '' }, { id: nanoid(), label: 'Length', value: '' }, { id: nanoid(), label: 'Engine', value: '' }, { id: nanoid(), label: 'Hours', value: '' }, { id: nanoid(), label: 'Asking Price', value: '' }, ] } } as BlogBlock,
      divider('dots'),
      heading('Why We Like This One', 2),
      paragraph('Add your team\'s perspective. What makes this particular boat or product worth considering?'),
      { id: nanoid(), type: 'trust_badges', enabled: true, internalLabel: 'Trust Badges', data: { badges: [ { id: nanoid(), label: 'Inspected by Our Team' }, { id: nanoid(), label: 'Certified Suzuki Dealer' }, { id: nanoid(), label: 'Georgetown, SC' }, ] } } as BlogBlock,
      cta('Interested? Contact Our Team Today'),
    ],
  },
  {
    id: 'repower_buyers_guide',
    label: 'Repower Buyer\'s Guide',
    description: 'Compare engine options with specs, FAQs, and a repower CTA.',
    icon: '⚡',
    category: 'Service',
    blocks: () => [
      heading('Your Complete Repower Buyer\'s Guide'),
      paragraph('Choosing the right outboard is one of the biggest decisions a boat owner makes. This guide walks you through the options so you can repower with confidence.'),
      divider('wave'),
      { id: nanoid(), type: 'comparison_table', enabled: true, internalLabel: 'Engine Comparison', data: { heading: 'Compare Your Options', labelA: 'Option A', labelB: 'Option B', rows: [ { id: nanoid(), feature: 'Horsepower Range', optionA: 'Enter HP range', optionB: 'Enter HP range' }, { id: nanoid(), feature: 'Fuel Efficiency', optionA: 'Enter rating', optionB: 'Enter rating' }, { id: nanoid(), feature: 'Weight', optionA: 'Enter weight', optionB: 'Enter weight' }, { id: nanoid(), feature: 'Warranty', optionA: 'Enter warranty', optionB: 'Enter warranty' }, { id: nanoid(), feature: 'Best For', optionA: 'Enter use case', optionB: 'Enter use case' }, ] } } as BlogBlock,
      divider('dots'),
      { id: nanoid(), type: 'specs_table', enabled: true, internalLabel: 'Recommended Specs', data: { heading: 'Key Specifications to Consider', specs: [ { id: nanoid(), label: 'Boat Length', value: '' }, { id: nanoid(), label: 'Current Engine HP', value: '' }, { id: nanoid(), label: 'Recommended HP', value: '' }, { id: nanoid(), label: 'Shaft Length', value: '' }, { id: nanoid(), label: 'Estimated Install Time', value: '' }, ] } } as BlogBlock,
      divider('line'),
      { id: nanoid(), type: 'faq', enabled: true, internalLabel: 'Repower FAQ', data: { heading: 'Repower Questions Answered', items: [ { id: nanoid(), question: 'How do I know if I need a repower?', answer: 'Signs include declining performance, rising fuel costs, and frequent repairs on an aging engine.' }, { id: nanoid(), question: 'How long does a repower take?', answer: 'Most repowers at Thomas Marine are completed within 1–2 weeks depending on parts availability.' }, { id: nanoid(), question: 'Do you handle the full installation?', answer: 'Yes — our certified team manages engine selection, rigging, controls, and sea trial.' }, ] } } as BlogBlock,
      { id: nanoid(), type: 'cta', enabled: true, internalLabel: 'Repower CTA', data: { title: 'Ready to Repower Your Boat?', text: 'Talk to our Suzuki-certified repower specialists about the right engine for your hull and budget.', primaryButtonText: 'Explore Repower Options', primaryButtonUrl: '/repower', style: 'service' } } as BlogBlock,
    ],
  },
  {
    id: 'local_seo_pillar',
    label: 'Local SEO Pillar',
    description: 'Quick answer, checklist, map, and service callout for local search.',
    icon: '📍',
    category: 'Service',
    blocks: () => [
      heading('Boat Service in Georgetown, SC — What You Need to Know'),
      paragraph('Whether you\'re a local owner or visiting Winyah Bay, this guide covers the essentials for keeping your boat ready on the South Carolina coast.'),
      divider('wave'),
      { id: nanoid(), type: 'quick_answer', enabled: true, internalLabel: 'Quick Answer', data: { title: 'Where can I get boat service near Georgetown, SC?', answer: 'Thomas Marine LLC at 1199 David W Ray Road is a certified Suzuki dealer offering outboard sales, repower, maintenance, and repair for Georgetown and the surrounding Lowcountry.' } } as BlogBlock,
      { id: nanoid(), type: 'checklist', enabled: true, internalLabel: 'Local Owner Checklist', data: { heading: 'What Georgetown Boat Owners Should Know', intro: 'Use this checklist when choosing a local service partner.', items: [ { id: nanoid(), text: 'Confirm factory-certified technicians on staff' }, { id: nanoid(), text: 'Ask about Suzuki dealer credentials' }, { id: nanoid(), text: 'Verify warranty work is handled in-house' }, { id: nanoid(), text: 'Check turnaround time for seasonal service' }, { id: nanoid(), text: 'Look for transparent estimates before work begins' }, ] } } as BlogBlock,
      divider('dots'),
      { id: nanoid(), type: 'map', enabled: true, internalLabel: 'Location Map', data: { heading: 'Visit Thomas Marine', address: '1199 David W Ray Road, Georgetown, SC 29440' } } as BlogBlock,
      { id: nanoid(), type: 'service_callout', enabled: true, internalLabel: 'Service Callout', data: { heading: 'Services We Offer Locally', description: 'From routine maintenance to full repowers, our Georgetown team has you covered.', services: [ { id: nanoid(), name: 'Outboard Service', description: 'Oil changes, tune-ups, and diagnostics', url: '/services' }, { id: nanoid(), name: 'Repower', description: 'Suzuki outboard sales and installation', url: '/repower' }, { id: nanoid(), name: 'Pre-Owned Boats', description: 'Inspected inventory ready for the water', url: '/inventory' }, ] } } as BlogBlock,
    ],
  },
  {
    id: 'customer_case_study',
    label: 'Customer Case Study',
    description: 'Quote, before/after, service steps, and trust badges.',
    icon: '⭐',
    category: 'Sales',
    blocks: () => [
      heading('Customer Success: [Customer Name or Boat]'),
      paragraph('Share the customer\'s starting situation, what they needed, and the outcome our team delivered.'),
      divider('wave'),
      { id: nanoid(), type: 'quote', enabled: true, internalLabel: 'Customer Quote', data: { quote: 'Thomas Marine exceeded our expectations. The boat runs better than it has in years.', attribution: 'Customer Name', role: 'Georgetown, SC' } } as BlogBlock,
      { id: nanoid(), type: 'before_after', enabled: true, internalLabel: 'Before & After', data: { heading: 'The Results', beforeImage: { id: '', url: '', alt: 'Before' }, afterImage: { id: '', url: '', alt: 'After' }, beforeLabel: 'Before', afterLabel: 'After', description: 'Describe the visible and performance improvements.' } } as BlogBlock,
      divider('dots'),
      { id: nanoid(), type: 'service_steps', enabled: true, internalLabel: 'What We Did', data: { heading: 'How We Got There', steps: [ { id: nanoid(), stepNumber: 1, title: 'Initial Consultation', description: 'We listened to the customer\'s goals and inspected the boat.' }, { id: nanoid(), stepNumber: 2, title: 'Work Completed', description: 'Our team performed the service or upgrade to spec.' }, { id: nanoid(), stepNumber: 3, title: 'Sea Trial & Handoff', description: 'We verified performance and walked the customer through everything.' }, ] } } as BlogBlock,
      { id: nanoid(), type: 'trust_badges', enabled: true, internalLabel: 'Trust Badges', data: { badges: [ { id: nanoid(), label: 'Certified Suzuki Dealer' }, { id: nanoid(), label: 'Factory-Trained Technicians' }, { id: nanoid(), label: 'Serving Georgetown Since [Year]' }, ] } } as BlogBlock,
      cta('Want Results Like This?'),
    ],
  },
  {
    id: 'event_open_house',
    label: 'Event / Open House',
    description: 'Hero-style heading, checklist, button CTA, and contact form.',
    icon: '🎉',
    category: 'Seasonal',
    blocks: () => [
      { id: nanoid(), type: 'hero', enabled: true, internalLabel: 'Event Hero', data: { eyebrow: 'Open House', title: 'Join Us at Thomas Marine', subtitle: 'Date, time, and location — add your event details here.', primaryCta: { text: 'RSVP Now', url: '/contact' } } } as BlogBlock,
      paragraph('Tell visitors what to expect — demos, specials, food, giveaways, or new inventory reveals. Make it easy for them to decide to come.'),
      divider('wave'),
      { id: nanoid(), type: 'checklist', enabled: true, internalLabel: 'Event Checklist', data: { heading: 'What to Expect', intro: 'Here\'s what\'s happening at our open house.', items: [ { id: nanoid(), text: 'Live product demos and walkthroughs' }, { id: nanoid(), text: 'Meet our certified service team' }, { id: nanoid(), text: 'Exclusive event-only pricing' }, { id: nanoid(), text: 'Refreshments and family-friendly activities' }, { id: nanoid(), text: 'Free estimates on service and repower' }, ] } } as BlogBlock,
      divider('dots'),
      buttonCta('Save My Spot', '/contact'),
      { id: nanoid(), type: 'contact_form', enabled: true, internalLabel: 'RSVP Form', data: { heading: 'RSVP for the Event', formType: 'general', subjectPreset: 'Open House RSVP' } } as BlogBlock,
    ],
  },
]

type Props = {
  onSelect: (blocks: BlogBlock[]) => void
  onClose: () => void
}

export default function BlogTemplatePicker({ onSelect, onClose }: Props) {
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState<TemplateCategory | ''>('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return STUDIO_TEMPLATES.filter((t) => {
      const matchCategory = !filterCategory || t.category === filterCategory
      const matchSearch = !q
        || t.label.toLowerCase().includes(q)
        || t.description.toLowerCase().includes(q)
        || t.category.toLowerCase().includes(q)
      return matchCategory && matchSearch
    })
  }, [search, filterCategory])

  const grouped = useMemo(() => {
    const map = new Map<TemplateCategory, StudioTemplate[]>()
    for (const cat of CATEGORY_ORDER) map.set(cat, [])
    for (const t of filtered) map.get(t.category)?.push(t)
    return CATEGORY_ORDER
      .map((cat) => ({ category: cat, templates: map.get(cat) ?? [] }))
      .filter((g) => g.templates.length > 0)
  }, [filtered])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(4,14,33,0.7)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10" style={{ background: 'linear-gradient(135deg, #040e21, #0d2b55)' }}>
          <div>
            <h2 className="text-lg font-bold text-white">Choose a Starter Template</h2>
            <p className="text-xs text-blue-200 mt-0.5">Pick one to pre-fill your post with the right sections. You can change everything after.</p>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white text-xl leading-none">✕</button>
        </div>

        {/* Search & filter */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/80 space-y-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates…"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0d2b55]/20"
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterCategory('')}
              className={`text-xs font-semibold px-3 py-1 rounded-full border transition-colors ${!filterCategory ? 'border-[#0d2b55] bg-[#0d2b55] text-white' : 'border-gray-200 text-gray-600 hover:border-[#0d2b55]/40'}`}
            >
              All
            </button>
            {CATEGORY_ORDER.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(filterCategory === cat ? '' : cat)}
                className={`text-xs font-semibold px-3 py-1 rounded-full border transition-colors ${filterCategory === cat ? 'border-[#c9a84c] bg-[#c9a84c] text-[#0d2b55]' : 'border-gray-200 text-gray-600 hover:border-[#c9a84c]/60'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Template grid */}
        <div className="overflow-y-auto p-6">
          {grouped.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-400">
              No templates match your search. Try a different keyword or category.
            </div>
          ) : (
            grouped.map(({ category, templates }) => (
              <section key={category} className="mb-6 last:mb-0">
                <h3 className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: '#0d2b55' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#c9a84c' }} />
                  {category}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {templates.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => { onSelect(t.blocks()); onClose() }}
                      className="group text-left p-5 rounded-2xl border-2 border-gray-100 hover:border-[#0d2b55] bg-white hover:bg-[#0d2b55]/5 transition-all"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{t.icon}</span>
                        <span className="font-bold text-sm text-gray-900 group-hover:text-[#0d2b55]">{t.label}</span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{t.description}</p>
                    </button>
                  ))}
                </div>
              </section>
            ))
          )}
          <div className="mt-4 text-center">
            <button onClick={() => { onSelect([]); onClose() }} className="text-xs text-gray-400 hover:text-gray-600 underline">
              Start with a blank post instead
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
