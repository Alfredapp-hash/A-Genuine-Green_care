// ─────────────────────────────────────────────────────────────────────────────
// Blog Studio — Sample Post Data (5 Posts)
// ─────────────────────────────────────────────────────────────────────────────

import { nanoid } from 'nanoid'
import type { BlogPost } from './types'
import { DEFAULT_DESIGN, DEFAULT_SEO } from './templates'

const NOW = new Date().toISOString()

export const SAMPLE_POSTS: BlogPost[] = [
  // ── 1. Suzuki Maintenance Schedule ──────────────────────────────────────────
  {
    id: 'post_001',
    title: 'Suzuki Outboard Maintenance Schedule: What Owners Should Know',
    slug: 'suzuki-outboard-maintenance-schedule',
    subtitle: 'Keep your Suzuki running right all season long',
    excerpt:
      'A practical guide to keeping your Suzuki outboard dependable, efficient, and ready for long days on the water.',
    postType: 'service_guide',
    category: 'Suzuki Outboards',
    tags: ['Suzuki', 'Maintenance', 'Outboards', 'Georgetown SC'],
    featuredImage: {
      id: 'img_001',
      url: '/images/blogs/ThomasMarineOilChangesFlyer.png',
      alt: 'Suzuki outboard oil change service at Thomas Marine',
    },
    blocks: [
      {
        id: nanoid(), type: 'hero', enabled: true, internalLabel: 'Hero',
        data: {
          eyebrow: 'Service Guide',
          title: 'Suzuki Outboard Maintenance Schedule',
          subtitle: 'Keep your motor running right — every season.',
          image: { id: 'img_001', url: '/images/blogs/ThomasMarineOilChangesFlyer.png', alt: 'Suzuki outboard service' },
          primaryCta: { text: 'Schedule Service', url: '/contact', style: 'primary' },
          secondaryCta: { text: 'Call Us', url: 'tel:8438338054', style: 'ghost' },
        },
      },
      {
        id: nanoid(), type: 'quick_answer', enabled: true, internalLabel: 'Quick Answer',
        data: {
          title: 'How often should a Suzuki outboard be serviced?',
          answer: 'Suzuki recommends an initial 20-hour break-in service, then annual service or every 100 hours — whichever comes first. Frequent saltwater use warrants more frequent check-ups.',
        },
      },
      {
        id: nanoid(), type: 'service_steps', enabled: true, internalLabel: 'Service Steps',
        data: {
          heading: 'What\'s Included in a Suzuki Annual Service',
          steps: [
            { id: nanoid(), stepNumber: 1, title: 'Oil & Filter Change', description: 'Drain old oil, replace with Suzuki-spec marine oil, install new filter.' },
            { id: nanoid(), stepNumber: 2, title: 'Spark Plug Inspection', description: 'Inspect and replace plugs if worn. Check gap per Suzuki spec.' },
            { id: nanoid(), stepNumber: 3, title: 'Gear Oil Service', description: 'Drain and replace lower unit gear oil. Inspect for water intrusion.' },
            { id: nanoid(), stepNumber: 4, title: 'Fuel System Inspection', description: 'Inspect fuel lines, filter, and connections for wear or leaks.' },
          ],
        },
      },
      {
        id: nanoid(), type: 'faq', enabled: true, internalLabel: 'FAQ',
        data: {
          heading: 'Suzuki Service FAQs',
          items: [
            { id: nanoid(), question: 'Can I do my own Suzuki outboard service?', answer: 'Basic maintenance like flushing and visual checks can be DIY. Oil changes and gear lube service are achievable for mechanically inclined owners. Anything involving fuel systems, electrical, or warranty work should be done by an authorized dealer.' },
            { id: nanoid(), question: 'Does Thomas Marine service all Suzuki models?', answer: 'Yes. Thomas Marine is an authorized Suzuki Marine dealer and services all current Suzuki outboard models from 2.5 HP to 350 HP.' },
          ],
        },
      },
      {
        id: nanoid(), type: 'cta', enabled: true, internalLabel: 'Service CTA',
        data: {
          title: 'Ready to Schedule Your Suzuki Service?',
          text: 'Thomas Marine provides authorized Suzuki service with factory-trained technicians in Georgetown, SC.',
          primaryButtonText: 'Schedule Service',
          primaryButtonUrl: '/contact',
          secondaryButtonText: '(843) 833-8054',
          secondaryButtonUrl: 'tel:8438338054',
          style: 'service',
        },
      },
    ],
    relatedServiceIds: ['oil-changes', 'tune-ups'],
    seo: {
      ...DEFAULT_SEO,
      title: 'Suzuki Outboard Maintenance Schedule | Thomas Marine Georgetown SC',
      description: 'Learn the recommended Suzuki outboard service intervals and what\'s included in each service. Authorized Suzuki dealer in Georgetown, SC.',
      primaryKeyword: 'Suzuki outboard maintenance schedule',
      localSeoPhrase: 'Georgetown SC',
      enableArticleSchema: true,
      enableFaqSchema: true,
    },
    design: { ...DEFAULT_DESIGN, heroStyle: 'service_page', layoutStyle: 'service_guide' },
    status: 'published',
    featured: true,
    showOnBlogPage: true,
    authorName: 'Thomas Marine Team',
    createdAt: NOW,
    updatedAt: NOW,
    publishedAt: NOW,
  },

  // ── 2. 5 Signs Your Outboard Needs Service ──────────────────────────────────
  {
    id: 'post_002',
    title: '5 Signs Your Outboard Needs Professional Service',
    slug: 'signs-outboard-needs-service',
    excerpt: 'Hard starts, poor idle, weak water flow, and unusual vibration can all point to issues worth inspecting early.',
    postType: 'standard_article',
    category: 'Boat Maintenance',
    tags: ['Outboard', 'Diagnostics', 'Maintenance'],
    featuredImage: {
      id: 'img_002',
      url: '/images/blogs/ThomasMarineEngineInstallationServiceFlyer.png',
      alt: 'Outboard engine service at Thomas Marine',
    },
    blocks: [
      {
        id: nanoid(), type: 'hero', enabled: true, internalLabel: 'Hero',
        data: {
          eyebrow: 'Maintenance Tips',
          title: '5 Signs Your Outboard Needs Professional Service',
          image: { id: 'img_002', url: '/images/blogs/ThomasMarineEngineInstallationServiceFlyer.png', alt: 'Engine service' },
          primaryCta: { text: 'Schedule Service', url: '/contact', style: 'primary' },
        },
      },
      {
        id: nanoid(), type: 'warning_signs', enabled: true, internalLabel: 'Warning Signs',
        data: {
          heading: '5 Signs That Deserve a Closer Look',
          signs: [
            { id: nanoid(), title: 'Hard or Inconsistent Starting', description: 'If your outboard cranks but won\'t start on the first attempt — or starts rough — it could be fuel system, spark plugs, or compression.' },
            { id: nanoid(), title: 'Weak or No Water from Tell-Tale', description: 'The tell-tale water stream tells you your water pump impeller is working. No stream means potential overheating.' },
            { id: nanoid(), title: 'Unusual Vibration at Idle or WOT', description: 'Vibration beyond normal engine feel often points to prop damage, cavitation, or internal motor issues.' },
            { id: nanoid(), title: 'Power Loss Under Load', description: 'If your boat won\'t reach normal RPMs under load, look at fuel delivery, ignition timing, or worn components.' },
            { id: nanoid(), title: 'Visible Oil or Fluid Leaks', description: 'Any oil or gear lube on the engine mount area should be inspected immediately.' },
          ],
        },
      },
      {
        id: nanoid(), type: 'cta', enabled: true, internalLabel: 'CTA',
        data: {
          title: 'Noticing Any of These Signs?',
          text: 'Don\'t wait. Early diagnosis saves money and prevents bigger repairs.',
          primaryButtonText: 'Schedule a Diagnostic',
          primaryButtonUrl: '/contact',
          style: 'service',
        },
      },
    ],
    seo: { ...DEFAULT_SEO, title: '5 Signs Your Outboard Needs Service | Thomas Marine', enableArticleSchema: true },
    design: DEFAULT_DESIGN,
    status: 'published',
    featured: false,
    showOnBlogPage: true,
    authorName: 'Thomas Marine Team',
    createdAt: NOW,
    updatedAt: NOW,
    publishedAt: NOW,
  },

  // ── 3. Pre-Owned Boat Buying Guide ──────────────────────────────────────────
  {
    id: 'post_003',
    title: 'What to Check Before Buying a Pre-Owned Boat',
    slug: 'what-to-check-before-buying-pre-owned-boat',
    excerpt: 'Know what to inspect before making a decision so you can shop with more confidence and fewer surprises.',
    postType: 'buying_guide',
    category: 'Pre-Owned Buying Tips',
    tags: ['Pre-Owned', 'Buying Guide', 'Inspection'],
    featuredImage: {
      id: 'img_003',
      url: '/images/blogs/ThomasMarineBoatingDetailingFlyer.png',
      alt: 'Pre-owned boat inspection guide',
    },
    blocks: [
      {
        id: nanoid(), type: 'hero', enabled: true, internalLabel: 'Hero',
        data: {
          eyebrow: 'Buying Guide',
          title: 'What to Check Before Buying a Pre-Owned Boat',
          primaryCta: { text: 'View Inventory', url: '/inventory', style: 'primary' },
          secondaryCta: { text: 'Contact Our Team', url: '/contact', style: 'ghost' },
        },
      },
      {
        id: nanoid(), type: 'intro', enabled: true, internalLabel: 'Introduction',
        data: {
          headline: 'Shop With Confidence',
          body: 'A pre-owned boat can be an excellent value — if you know what to look for. This guide walks you through the key inspection points so you don\'t end up with hidden surprises after purchase.',
        },
      },
      {
        id: nanoid(), type: 'checklist', enabled: true, internalLabel: 'Inspection Checklist',
        data: {
          heading: 'Pre-Purchase Inspection Checklist',
          items: [
            { id: nanoid(), text: 'Check hull for cracks, blistering, or osmotic damage' },
            { id: nanoid(), text: 'Inspect transom for softness or delamination' },
            { id: nanoid(), text: 'Test all electrical systems: bilge pump, nav lights, electronics' },
            { id: nanoid(), text: 'Inspect engine hours and request service records' },
            { id: nanoid(), text: 'Check for water intrusion in storage compartments' },
            { id: nanoid(), text: 'Verify trailer condition: bunks, bearings, lights, coupler' },
            { id: nanoid(), text: 'Run the engine at idle and wide-open throttle if possible' },
          ],
        },
      },
      {
        id: nanoid(), type: 'cta', enabled: true, internalLabel: 'Inventory CTA',
        data: {
          title: 'Browse Trusted Pre-Owned Inventory',
          text: 'Every boat Thomas Marine sells has been through our service department.',
          primaryButtonText: 'View Pre-Owned Inventory',
          primaryButtonUrl: '/inventory',
          style: 'inventory',
        },
      },
    ],
    seo: { ...DEFAULT_SEO, title: 'Pre-Owned Boat Buying Guide | Thomas Marine Georgetown SC', enableArticleSchema: true },
    design: { ...DEFAULT_DESIGN, layoutStyle: 'premium_editorial' },
    status: 'published',
    featured: false,
    showOnBlogPage: true,
    authorName: 'Thomas Marine Team',
    createdAt: NOW,
    updatedAt: NOW,
    publishedAt: NOW,
  },

  // ── 4. Spring Season Prep ────────────────────────────────────────────────────
  {
    id: 'post_004',
    title: 'Preparing Your Boat for the Myrtle Beach Boating Season',
    slug: 'preparing-boat-myrtle-beach-season',
    excerpt: 'Spring commissioning steps every South Carolina boat owner should complete before heading out for the season.',
    postType: 'checklist',
    category: 'Seasonal Service',
    tags: ['Spring', 'Commissioning', 'Myrtle Beach', 'Seasonal'],
    featuredImage: {
      id: 'img_004',
      url: '/images/blogs/ThomasMarineSpringCommissioningFlyer.png',
      alt: 'Spring boat commissioning Thomas Marine Georgetown SC',
    },
    blocks: [
      {
        id: nanoid(), type: 'hero', enabled: true, internalLabel: 'Hero',
        data: {
          eyebrow: 'Seasonal Service',
          title: 'Spring Commissioning Checklist',
          subtitle: 'Get your boat ready before the season starts.',
          primaryCta: { text: 'Schedule Spring Service', url: '/contact?service=spring-commissioning', style: 'primary' },
        },
      },
      {
        id: nanoid(), type: 'checklist', enabled: true, internalLabel: 'Spring Checklist',
        data: {
          heading: 'Spring Commissioning Checklist',
          intro: 'Complete these steps before your first day on the water.',
          items: [
            { id: nanoid(), text: 'Change engine oil and filter' },
            { id: nanoid(), text: 'Inspect and replace spark plugs if needed' },
            { id: nanoid(), text: 'Check fuel lines and connections for cracks' },
            { id: nanoid(), text: 'Flush and test cooling system' },
            { id: nanoid(), text: 'Inspect propeller for dings or damage' },
            { id: nanoid(), text: 'Test battery and charging system' },
            { id: nanoid(), text: 'Check bilge pump operation' },
            { id: nanoid(), text: 'Inspect hull and running gear' },
          ],
        },
      },
      {
        id: nanoid(), type: 'related_services', enabled: true, internalLabel: 'Related Services',
        data: { heading: 'Related Services', serviceIds: ['spring-commissioning', 'oil-changes', 'tune-ups'], displayStyle: 'cards' },
      },
      {
        id: nanoid(), type: 'cta', enabled: true, internalLabel: 'CTA',
        data: {
          title: 'Let Thomas Marine Handle Your Spring Service',
          primaryButtonText: 'Schedule Spring Service',
          primaryButtonUrl: '/contact',
          style: 'service',
        },
      },
    ],
    seo: { ...DEFAULT_SEO, title: 'Spring Boat Commissioning Checklist | Thomas Marine Georgetown SC', enableArticleSchema: true },
    design: { ...DEFAULT_DESIGN, layoutStyle: 'checklist' },
    status: 'published',
    featured: false,
    showOnBlogPage: true,
    authorName: 'Thomas Marine Team',
    createdAt: NOW,
    updatedAt: NOW,
    publishedAt: NOW,
  },

  // ── 5. Inventory Spotlight (Draft) ──────────────────────────────────────────
  {
    id: 'post_005',
    title: 'Featured Pre-Owned Boat of the Week',
    slug: 'featured-pre-owned-boat-of-the-week',
    excerpt: 'This week we\'re spotlighting a clean, ready-to-fish pre-owned boat from our current inventory.',
    postType: 'inventory_spotlight',
    category: 'Pre-Owned Buying Tips',
    tags: ['Inventory', 'Pre-Owned', 'Spotlight'],
    blocks: [
      {
        id: nanoid(), type: 'hero', enabled: true, internalLabel: 'Hero',
        data: {
          eyebrow: 'Inventory Spotlight',
          title: 'Featured Pre-Owned Boat of the Week',
          primaryCta: { text: 'Inquire About This Boat', url: '/contact', style: 'primary' },
        },
      },
      {
        id: nanoid(), type: 'specs_table', enabled: true, internalLabel: 'Specs Table',
        data: {
          heading: 'Boat Specifications',
          specs: [
            { id: nanoid(), label: 'Year', value: '' },
            { id: nanoid(), label: 'Make / Model', value: '' },
            { id: nanoid(), label: 'Length', value: '' },
            { id: nanoid(), label: 'Engine', value: '' },
            { id: nanoid(), label: 'Hours', value: '' },
            { id: nanoid(), label: 'Price', value: '' },
          ],
        },
      },
      {
        id: nanoid(), type: 'gallery', enabled: true, internalLabel: 'Gallery',
        data: { heading: 'Photos', images: [], columns: 3 },
      },
      {
        id: nanoid(), type: 'rich_text', enabled: true, internalLabel: 'Why We Like It',
        data: { heading: 'Why We Like It', body: '' },
      },
      {
        id: nanoid(), type: 'related_inventory', enabled: true, internalLabel: 'Related Inventory',
        data: { heading: 'More Pre-Owned Boats', inventoryIds: [], displayStyle: 'cards' },
      },
      {
        id: nanoid(), type: 'cta', enabled: true, internalLabel: 'Contact CTA',
        data: {
          title: 'Interested in This Boat?',
          primaryButtonText: 'Contact Our Team',
          primaryButtonUrl: '/contact',
          style: 'inventory',
        },
      },
    ],
    seo: { ...DEFAULT_SEO, title: 'Featured Pre-Owned Boat | Thomas Marine Georgetown SC' },
    design: { ...DEFAULT_DESIGN, heroStyle: 'inventory_spotlight', layoutStyle: 'sales_spotlight' },
    status: 'draft',
    featured: false,
    showOnBlogPage: false,
    authorName: 'Thomas Marine Team',
    createdAt: NOW,
    updatedAt: NOW,
  },

  // ── 6. Demo post — showcases all new block types ─────────────────────────────
  {
    id: 'post_006',
    title: 'Why Suzuki Outboards Are the Gold Standard for Georgetown Boaters',
    slug: 'suzuki-outboard-gold-standard-georgetown',
    subtitle: 'Performance, reliability, and dealer support — all in one package',
    excerpt: 'From fuel injection to dealer-backed warranties, here\'s why Suzuki outboard motors have become the engine of choice for serious South Carolina boaters.',
    postType: 'standard_article',
    category: 'Suzuki Outboards',
    tags: ['Suzuki', 'Outboards', 'Georgetown SC', 'Marine Service', 'Repower'],
    featuredImage: {
      id: 'img_006',
      url: '/images/blogs/ThomasMarineOilChangesFlyer.png',
      alt: 'Suzuki outboard motors at Thomas Marine Georgetown SC',
    },
    blocks: [
      {
        id: nanoid(), type: 'heading', enabled: true, internalLabel: 'Section Heading',
        data: { text: 'The Engine That Outlasts the Rest', level: 2, align: 'left', eyebrow: 'Suzuki Outboards' },
      },
      {
        id: nanoid(), type: 'paragraph', enabled: true, internalLabel: 'Intro Paragraph',
        data: {
          body: 'When Georgetown boaters choose an outboard, they\'re not just buying horsepower — they\'re making a 10-year commitment to reliability on the water. Suzuki\'s marine division has earned a reputation as the most fuel-efficient, technically advanced outboard manufacturer in the world. And Thomas Marine is Georgetown, SC\'s only authorized Suzuki dealer and full-service center.',
          size: 'lg',
          align: 'left',
        },
      },
      {
        id: nanoid(), type: 'divider', enabled: true, internalLabel: 'Divider',
        data: { style: 'wave' },
      },
      {
        id: nanoid(), type: 'quick_answer', enabled: true, internalLabel: 'Quick Answer',
        data: {
          title: 'Why do so many South Carolina anglers choose Suzuki?',
          answer: 'Suzuki outboards deliver best-in-class fuel economy, industry-leading warranty coverage, and a reputation for start-every-time reliability — even in demanding saltwater environments. Their Lean Burn technology alone can cut fuel costs by up to 14% compared to competitors at cruising speed.',
        },
      },
      {
        id: nanoid(), type: 'youtube_video', enabled: true, internalLabel: 'Suzuki Video Overview',
        data: {
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          heading: 'See the Suzuki DF150 in Action',
          caption: 'Suzuki DF150 — outstanding power-to-weight ratio and best-in-class fuel economy',
        },
      },
      {
        id: nanoid(), type: 'heading', enabled: true, internalLabel: 'Features Heading',
        data: { text: 'Key Features That Set Suzuki Apart', level: 2, align: 'left' },
      },
      {
        id: nanoid(), type: 'checklist', enabled: true, internalLabel: 'Features Checklist',
        data: {
          heading: 'What You Get With a Suzuki Outboard',
          items: [
            { id: nanoid(), text: 'Lean Burn Fuel Control System — up to 14% better fuel economy' },
            { id: nanoid(), text: 'Suzuki Selective Rotation — same engine, port or starboard' },
            { id: nanoid(), text: 'Multi-point sequential fuel injection as standard on all 4-strokes' },
            { id: nanoid(), text: '3-year limited factory warranty — extendable to 5 years' },
            { id: nanoid(), text: 'Corrosion-resistant sealing and stainless steel hardware for saltwater' },
          ],
        },
      },
      {
        id: nanoid(), type: 'divider', enabled: true, internalLabel: 'Divider',
        data: { style: 'dots' },
      },
      {
        id: nanoid(), type: 'quote', enabled: true, internalLabel: 'Customer Quote',
        data: {
          quote: 'We repowered our 24-foot Mako with a Suzuki DF200 last spring. Best decision we ever made — starts every time, runs smooth in rough water, and we\'re saving almost $30 a trip in gas.',
          attribution: 'Mark T.',
          role: 'Georgetown, SC — Thomas Marine Customer',
        },
      },
      {
        id: nanoid(), type: 'service_callout', enabled: true, internalLabel: 'Service Callout',
        data: {
          heading: 'Thomas Marine — Your Authorized Suzuki Dealer',
          description: 'We sell, install, and service the full Suzuki outboard lineup. From first-time buyers to experienced captains repowering a charter boat.',
          services: [
            { id: nanoid(), name: 'New Suzuki Sales', description: 'Full DF lineup from 2.5 HP to 350 HP in stock and available to order', url: '/inventory' },
            { id: nanoid(), name: 'Suzuki Annual Service', description: 'Factory-spec oil, gear oil, plugs, fuel filters, and full inspection', url: '/services/oil-changes' },
            { id: nanoid(), name: 'Repower Service', description: 'We handle engine removal, rigging, installation, and break-in service', url: '/services/repower' },
          ],
          ctaLabel: 'View All Services',
          ctaUrl: '/services',
        },
      },
      {
        id: nanoid(), type: 'faq', enabled: true, internalLabel: 'Suzuki FAQ',
        data: {
          heading: 'Frequently Asked Questions',
          items: [
            {
              id: nanoid(),
              question: 'How often does a Suzuki outboard need to be serviced?',
              answer: 'Suzuki recommends an initial 20-hour break-in service, then annual service or every 100 hours of operation — whichever comes first. For heavy saltwater use, more frequent inspections are recommended.',
            },
            {
              id: nanoid(),
              question: 'Does Thomas Marine offer financing for new Suzuki outboards?',
              answer: 'Yes — we work with multiple marine financing partners to offer competitive rates on new Suzuki engine purchases and complete repower packages. Contact us for current offers.',
            },
            {
              id: nanoid(),
              question: 'What warranty coverage comes with a new Suzuki outboard?',
              answer: 'All new Suzuki outboards come with a 3-year limited factory warranty. Extended warranty coverage up to 5 years is available through Suzuki\'s protection plan.',
            },
          ],
        },
      },
      {
        id: nanoid(), type: 'divider', enabled: true, internalLabel: 'Divider',
        data: { style: 'line' },
      },
      {
        id: nanoid(), type: 'button_cta', enabled: true, internalLabel: 'CTA Button',
        data: {
          label: 'Schedule a Service Appointment',
          url: '/contact',
          style: 'primary',
          align: 'center',
          subtext: 'Georgetown, SC — (843) 833-8054',
        },
      },
    ],
    seo: {
      title: 'Suzuki Outboards Georgetown SC | Thomas Marine LLC',
      description: 'Thomas Marine is Georgetown, SC\'s authorized Suzuki outboard dealer. Expert sales, installation, and service. Visit us at 1199 David W Ray Road.',
      primaryKeyword: 'Suzuki outboard Georgetown SC',
      localSeoPhrase: 'Georgetown, SC',
      enableArticleSchema: true,
      enableFaqSchema: true,
    },
    design: { ...DEFAULT_DESIGN, heroStyle: 'dark_overlay', layoutStyle: 'premium_editorial' },
    status: 'published',
    featured: true,
    showOnBlogPage: true,
    authorName: 'Thomas Marine Team',
    createdAt: NOW,
    updatedAt: NOW,
    publishedAt: NOW,
  },
]
