// ─────────────────────────────────────────────────────────────────────────────
// Blog Studio — Post Format Templates & Default Block Factories
// ─────────────────────────────────────────────────────────────────────────────

import { nanoid } from 'nanoid'
import type {
  BlogBlock,
  BlogPostType,
  DesignSettings,
  SEOSettings,
  HeroBlock,
  IntroBlock,
  RichTextBlock,
  QuickAnswerBlock,
  ChecklistBlock,
  WarningSignsBlock,
  ServiceStepsBlock,
  ComparisonTableBlock,
  SpecsTableBlock,
  FAQBlock,
  QuoteBlock,
  TeamMemberBlock,
  RelatedServicesBlock,
  RelatedInventoryBlock,
  BeforeAfterBlock,
  TrustBadgesBlock,
  CTABlock,
  GalleryBlock,
} from './types'

// ── Default block factories ───────────────────────────────────────────────────

export function createDefaultHeroBlock(overrides?: Partial<HeroBlock['data']>): HeroBlock {
  return {
    id: nanoid(),
    type: 'hero',
    enabled: true,
    internalLabel: 'Hero',
    data: {
      eyebrow: '',
      title: 'Post Title Goes Here',
      subtitle: '',
      image: undefined,
      primaryCta: { text: 'Schedule Service', url: '/contact', style: 'primary' },
      secondaryCta: { text: 'View Services', url: '/services', style: 'ghost' },
      ...overrides,
    },
  }
}

export function createDefaultIntroBlock(overrides?: Partial<IntroBlock['data']>): IntroBlock {
  return {
    id: nanoid(),
    type: 'intro',
    enabled: true,
    internalLabel: 'Introduction',
    data: {
      headline: '',
      body: 'Write your introduction here. Set the context for the reader and explain what they will learn.',
      ...overrides,
    },
  }
}

export function createDefaultRichTextBlock(overrides?: Partial<RichTextBlock['data']>): RichTextBlock {
  return {
    id: nanoid(),
    type: 'rich_text',
    enabled: true,
    internalLabel: 'Body Text',
    data: {
      heading: '',
      body: '',
      ...overrides,
    },
  }
}

export function createDefaultQuickAnswerBlock(overrides?: Partial<QuickAnswerBlock['data']>): QuickAnswerBlock {
  return {
    id: nanoid(),
    type: 'quick_answer',
    enabled: true,
    internalLabel: 'Quick Answer',
    data: {
      title: 'Quick Answer',
      answer: '',
      ...overrides,
    },
  }
}

export function createDefaultChecklistBlock(overrides?: Partial<ChecklistBlock['data']>): ChecklistBlock {
  return {
    id: nanoid(),
    type: 'checklist',
    enabled: true,
    internalLabel: 'Checklist',
    data: {
      heading: 'Checklist',
      intro: '',
      items: [
        { id: nanoid(), text: 'Checklist item 1', note: '' },
        { id: nanoid(), text: 'Checklist item 2', note: '' },
        { id: nanoid(), text: 'Checklist item 3', note: '' },
      ],
      ...overrides,
    },
  }
}

export function createDefaultWarningSignsBlock(overrides?: Partial<WarningSignsBlock['data']>): WarningSignsBlock {
  return {
    id: nanoid(),
    type: 'warning_signs',
    enabled: true,
    internalLabel: 'Warning Signs',
    data: {
      heading: 'Warning Signs to Watch For',
      intro: '',
      signs: [
        { id: nanoid(), title: 'Warning sign 1', description: '' },
        { id: nanoid(), title: 'Warning sign 2', description: '' },
        { id: nanoid(), title: 'Warning sign 3', description: '' },
      ],
      ...overrides,
    },
  }
}

export function createDefaultServiceStepsBlock(overrides?: Partial<ServiceStepsBlock['data']>): ServiceStepsBlock {
  return {
    id: nanoid(),
    type: 'service_steps',
    enabled: true,
    internalLabel: 'Service Steps',
    data: {
      heading: 'Our Process',
      steps: [
        { id: nanoid(), stepNumber: 1, title: 'Step 1', description: '' },
        { id: nanoid(), stepNumber: 2, title: 'Step 2', description: '' },
        { id: nanoid(), stepNumber: 3, title: 'Step 3', description: '' },
        { id: nanoid(), stepNumber: 4, title: 'Step 4', description: '' },
      ],
      ...overrides,
    },
  }
}

export function createDefaultComparisonTableBlock(overrides?: Partial<ComparisonTableBlock['data']>): ComparisonTableBlock {
  return {
    id: nanoid(),
    type: 'comparison_table',
    enabled: true,
    internalLabel: 'Comparison Table',
    data: {
      heading: 'Comparison',
      labelA: 'Option A',
      labelB: 'Option B',
      rows: [
        { id: nanoid(), feature: 'Feature 1', optionA: '', optionB: '' },
        { id: nanoid(), feature: 'Feature 2', optionA: '', optionB: '' },
        { id: nanoid(), feature: 'Feature 3', optionA: '', optionB: '' },
      ],
      ...overrides,
    },
  }
}

export function createDefaultSpecsTableBlock(overrides?: Partial<SpecsTableBlock['data']>): SpecsTableBlock {
  return {
    id: nanoid(),
    type: 'specs_table',
    enabled: true,
    internalLabel: 'Specs Table',
    data: {
      heading: 'Specifications',
      specs: [
        { id: nanoid(), label: 'Spec 1', value: '' },
        { id: nanoid(), label: 'Spec 2', value: '' },
        { id: nanoid(), label: 'Spec 3', value: '' },
      ],
      ...overrides,
    },
  }
}

export function createDefaultFAQBlock(overrides?: Partial<FAQBlock['data']>): FAQBlock {
  return {
    id: nanoid(),
    type: 'faq',
    enabled: true,
    internalLabel: 'FAQ',
    data: {
      heading: 'Frequently Asked Questions',
      items: [
        { id: nanoid(), question: 'Question 1?', answer: '' },
        { id: nanoid(), question: 'Question 2?', answer: '' },
      ],
      ...overrides,
    },
  }
}

export function createDefaultQuoteBlock(overrides?: Partial<QuoteBlock['data']>): QuoteBlock {
  return {
    id: nanoid(),
    type: 'quote',
    enabled: true,
    internalLabel: 'Quote',
    data: {
      quote: '',
      attribution: '',
      role: '',
      ...overrides,
    },
  }
}

export function createDefaultTeamMemberBlock(overrides?: Partial<TeamMemberBlock['data']>): TeamMemberBlock {
  return {
    id: nanoid(),
    type: 'team_member',
    enabled: true,
    internalLabel: 'Team Member',
    data: {
      name: '',
      role: '',
      bio: '',
      ...overrides,
    },
  }
}

export function createDefaultRelatedServicesBlock(overrides?: Partial<RelatedServicesBlock['data']>): RelatedServicesBlock {
  return {
    id: nanoid(),
    type: 'related_services',
    enabled: true,
    internalLabel: 'Related Services',
    data: {
      heading: 'Related Services',
      serviceIds: [],
      displayStyle: 'cards',
      ...overrides,
    },
  }
}

export function createDefaultRelatedInventoryBlock(overrides?: Partial<RelatedInventoryBlock['data']>): RelatedInventoryBlock {
  return {
    id: nanoid(),
    type: 'related_inventory',
    enabled: true,
    internalLabel: 'Related Inventory',
    data: {
      heading: 'Related Inventory',
      inventoryIds: [],
      displayStyle: 'cards',
      ...overrides,
    },
  }
}

export function createDefaultBeforeAfterBlock(overrides?: Partial<BeforeAfterBlock['data']>): BeforeAfterBlock {
  return {
    id: nanoid(),
    type: 'before_after',
    enabled: true,
    internalLabel: 'Before & After',
    data: {
      heading: 'Before & After',
      beforeImage: { id: nanoid(), url: '/hero.PNG', alt: 'Before' },
      afterImage: { id: nanoid(), url: '/hero.PNG', alt: 'After' },
      beforeLabel: 'Before',
      afterLabel: 'After',
      description: '',
      ...overrides,
    },
  }
}

export function createDefaultTrustBadgesBlock(overrides?: Partial<TrustBadgesBlock['data']>): TrustBadgesBlock {
  return {
    id: nanoid(),
    type: 'trust_badges',
    enabled: true,
    internalLabel: 'Trust Badges',
    data: {
      heading: 'Why Thomas Marine',
      badges: [
        { id: nanoid(), label: 'Authorized Suzuki Dealer', description: 'Factory-trained technicians' },
        { id: nanoid(), label: 'Family Owned Since 2019', description: 'Georgetown, SC' },
        { id: nanoid(), label: 'Honest Estimates', description: 'No surprise charges' },
        { id: nanoid(), label: 'Same-Day Service', description: 'On most repairs' },
      ],
      ...overrides,
    },
  }
}

export function createDefaultCTABlock(overrides?: Partial<CTABlock['data']>): CTABlock {
  return {
    id: nanoid(),
    type: 'cta',
    enabled: true,
    internalLabel: 'CTA',
    data: {
      title: 'Ready to Get Started?',
      text: 'Contact the Thomas Marine team — we\'re here to help.',
      primaryButtonText: 'Schedule Service',
      primaryButtonUrl: '/contact',
      secondaryButtonText: 'Call (843) 833-8054',
      secondaryButtonUrl: 'tel:8438338054',
      style: 'service',
      ...overrides,
    },
  }
}

export function createDefaultGalleryBlock(overrides?: Partial<GalleryBlock['data']>): GalleryBlock {
  return {
    id: nanoid(),
    type: 'gallery',
    enabled: true,
    internalLabel: 'Gallery',
    data: {
      heading: 'Gallery',
      images: [],
      columns: 3,
      ...overrides,
    },
  }
}

// ── Default design settings per format ───────────────────────────────────────

export const DEFAULT_DESIGN: DesignSettings = {
  heroStyle: 'dark_overlay',
  layoutStyle: 'premium_editorial',
  accentColor: 'suzuki_blue',
  imageTreatment: 'full_width',
}

export const DEFAULT_SEO: SEOSettings = {
  title: '',
  description: '',
  primaryKeyword: '',
  secondaryKeywords: [],
  localSeoPhrase: 'Georgetown, SC',
  enableArticleSchema: true,
  enableFaqSchema: false,
}

// ── Format template block preloads ────────────────────────────────────────────

export type FormatMeta = {
  type: BlogPostType
  label: string
  description: string
  icon: string
  whenToUse: string
  defaultDesign: DesignSettings
  createBlocks: () => BlogBlock[]
}

export const FORMAT_TEMPLATES: FormatMeta[] = [
  {
    type: 'standard_article',
    label: 'Standard Article',
    icon: '📝',
    description: 'A general knowledge article, tip piece, or news item.',
    whenToUse: 'Use for seasonal tips, boating education, general advice, or company announcements.',
    defaultDesign: { ...DEFAULT_DESIGN, layoutStyle: 'premium_editorial' },
    createBlocks: () => [
      createDefaultHeroBlock(),
      createDefaultIntroBlock(),
      createDefaultRichTextBlock({ heading: 'Section 1' }),
      createDefaultRichTextBlock({ heading: 'Section 2' }),
      createDefaultFAQBlock(),
      createDefaultCTABlock(),
    ],
  },
  {
    type: 'service_guide',
    label: 'Service Guide',
    icon: '🔧',
    description: 'A detailed guide to a specific service Thomas Marine offers.',
    whenToUse: 'Use for winterization, repower, oil change, bottom painting, or any service walkthrough.',
    defaultDesign: { ...DEFAULT_DESIGN, layoutStyle: 'service_guide', heroStyle: 'service_page' },
    createBlocks: () => [
      createDefaultHeroBlock({ primaryCta: { text: 'Schedule Service', url: '/contact', style: 'primary' } }),
      createDefaultQuickAnswerBlock(),
      createDefaultRichTextBlock({ heading: 'The Problem: Why This Matters' }),
      createDefaultWarningSignsBlock(),
      createDefaultServiceStepsBlock(),
      createDefaultRelatedServicesBlock(),
      createDefaultFAQBlock(),
      createDefaultCTABlock({ style: 'service' }),
    ],
  },
  {
    type: 'buying_guide',
    label: 'Buying Guide',
    icon: '🛥️',
    description: 'A guide to help customers make confident boat or engine purchase decisions.',
    whenToUse: 'Use for pre-owned boat buying, Suzuki outboard selection, trailer buying.',
    defaultDesign: { ...DEFAULT_DESIGN, layoutStyle: 'premium_editorial' },
    createBlocks: () => [
      createDefaultHeroBlock(),
      createDefaultIntroBlock(),
      createDefaultChecklistBlock({ heading: 'What to Look For' }),
      createDefaultComparisonTableBlock(),
      createDefaultRelatedInventoryBlock(),
      createDefaultFAQBlock(),
      createDefaultCTABlock({ style: 'inventory' }),
    ],
  },
  {
    type: 'checklist',
    label: 'Checklist',
    icon: '✅',
    description: 'A structured checklist for boat owners to follow.',
    whenToUse: 'Use for spring commissioning, pre-trip inspection, winterization prep, or safety checks.',
    defaultDesign: { ...DEFAULT_DESIGN, layoutStyle: 'checklist' },
    createBlocks: () => [
      createDefaultHeroBlock(),
      createDefaultIntroBlock(),
      createDefaultChecklistBlock(),
      createDefaultRelatedServicesBlock(),
      createDefaultFAQBlock(),
      createDefaultCTABlock(),
    ],
  },
  {
    type: 'company_story',
    label: 'Company Story / Team Post',
    icon: '👥',
    description: 'A human-interest story about the Thomas Marine team, milestones, or culture.',
    whenToUse: 'Use for meet-the-team features, anniversary posts, community involvement, or behind-the-scenes stories.',
    defaultDesign: { ...DEFAULT_DESIGN, layoutStyle: 'visual_story', heroStyle: 'clean_editorial' },
    createBlocks: () => [
      createDefaultHeroBlock(),
      createDefaultIntroBlock(),
      createDefaultTeamMemberBlock(),
      createDefaultQuoteBlock(),
      createDefaultGalleryBlock(),
      createDefaultTrustBadgesBlock(),
      createDefaultCTABlock({ style: 'contact' }),
    ],
  },
  {
    type: 'inventory_spotlight',
    label: 'Inventory Spotlight',
    icon: '⭐',
    description: 'A featured listing for a specific pre-owned or new boat in inventory.',
    whenToUse: 'Use when you want to highlight a specific boat with rich content beyond the listing page.',
    defaultDesign: { ...DEFAULT_DESIGN, layoutStyle: 'sales_spotlight', heroStyle: 'inventory_spotlight' },
    createBlocks: () => [
      createDefaultHeroBlock({ primaryCta: { text: 'Inquire About This Boat', url: '/contact', style: 'primary' } }),
      createDefaultSpecsTableBlock(),
      createDefaultGalleryBlock(),
      createDefaultRichTextBlock({ heading: 'Why We Like It' }),
      createDefaultRelatedInventoryBlock(),
      createDefaultCTABlock({ style: 'inventory' }),
    ],
  },
  {
    type: 'faq_explainer',
    label: 'FAQ / Explainer',
    icon: '💬',
    description: 'A focused answer to a common customer question or topic.',
    whenToUse: 'Use for "How often should I service my outboard?", "What is a repower?", or any FAQ-style content.',
    defaultDesign: { ...DEFAULT_DESIGN, layoutStyle: 'compact_news' },
    createBlocks: () => [
      createDefaultHeroBlock(),
      createDefaultQuickAnswerBlock(),
      createDefaultFAQBlock(),
      createDefaultRelatedServicesBlock(),
      createDefaultCTABlock(),
    ],
  },
  {
    type: 'before_after_story',
    label: 'Before & After Story',
    icon: '🔄',
    description: 'A transformation story showing the boat or service before and after.',
    whenToUse: 'Use for repower stories, restoration projects, detailing before/after, or fiberglass repairs.',
    defaultDesign: { ...DEFAULT_DESIGN, layoutStyle: 'visual_story' },
    createBlocks: () => [
      createDefaultHeroBlock(),
      createDefaultBeforeAfterBlock(),
      createDefaultServiceStepsBlock(),
      createDefaultGalleryBlock(),
      createDefaultQuoteBlock(),
      createDefaultRelatedServicesBlock(),
      createDefaultCTABlock({ style: 'service' }),
    ],
  },
]

export function getFormatMeta(type: BlogPostType): FormatMeta {
  return FORMAT_TEMPLATES.find((t) => t.type === type) ?? FORMAT_TEMPLATES[0]
}
