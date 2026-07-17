// ─────────────────────────────────────────────────────────────────────────────
// Thomas Marine Blog Studio — Core Type Definitions
// ─────────────────────────────────────────────────────────────────────────────

// ── Enumerations ──────────────────────────────────────────────────────────────

export type BlogPostType =
  | 'standard_article'
  | 'service_guide'
  | 'buying_guide'
  | 'checklist'
  | 'company_story'
  | 'inventory_spotlight'
  | 'faq_explainer'
  | 'before_after_story'

export type BlogStatus =
  | 'draft'
  | 'needs_review'
  | 'approved'
  | 'scheduled'
  | 'published'
  | 'archived'

export type BlockType =
  | 'hero'
  | 'intro'
  | 'rich_text'
  | 'quick_answer'
  | 'image_text'
  | 'full_image'
  | 'gallery'
  | 'checklist'
  | 'warning_signs'
  | 'service_steps'
  | 'comparison_table'
  | 'specs_table'
  | 'faq'
  | 'quote'
  | 'team_member'
  | 'related_services'
  | 'related_inventory'
  | 'before_after'
  | 'trust_badges'
  | 'cta'
  | 'contact_form'
  | 'map'
  | 'video'
  | 'divider'
  | 'heading'
  | 'paragraph'
  | 'button_cta'
  | 'service_callout'
  | 'youtube_video'
  | 'vimeo_video'
  | 'external_video'

// ── Media ─────────────────────────────────────────────────────────────────────

export type MediaAsset = {
  id: string
  url: string
  alt: string
  caption?: string
  focalPoint?: { x: number; y: number }
  category?: string
}

// ── SEO ───────────────────────────────────────────────────────────────────────

export type SEOSettings = {
  title?: string
  description?: string
  primaryKeyword?: string
  secondaryKeywords?: string[]
  localSeoPhrase?: string
  canonicalUrl?: string
  openGraphImage?: MediaAsset
  enableArticleSchema?: boolean
  enableFaqSchema?: boolean
}

// ── Design ────────────────────────────────────────────────────────────────────

export type HeroStyle =
  | 'full_image'
  | 'split_text_image'
  | 'dark_overlay'
  | 'clean_editorial'
  | 'service_page'
  | 'inventory_spotlight'

export type LayoutStyle =
  | 'premium_editorial'
  | 'service_guide'
  | 'compact_news'
  | 'visual_story'
  | 'checklist'
  | 'sales_spotlight'

export type AccentColor = 'suzuki_blue' | 'navy' | 'charcoal' | 'silver' | 'white'

export type ImageTreatment = 'full_width' | 'contained' | 'rounded_card' | 'gallery_grid'

export type DesignSettings = {
  heroStyle: HeroStyle
  layoutStyle: LayoutStyle
  accentColor: AccentColor
  imageTreatment: ImageTreatment
}

// ── CTA helper ────────────────────────────────────────────────────────────────

export type CTA = {
  text: string
  url: string
  style?: 'primary' | 'secondary' | 'ghost'
}

// ── Block base ────────────────────────────────────────────────────────────────

export type BaseBlock = {
  id: string
  enabled: boolean
  internalLabel?: string
}

// ── Block discriminated union ─────────────────────────────────────────────────

export type HeroBlock = BaseBlock & {
  type: 'hero'
  data: {
    eyebrow?: string
    title: string
    subtitle?: string
    image?: MediaAsset
    primaryCta?: CTA
    secondaryCta?: CTA
  }
}

export type IntroBlock = BaseBlock & {
  type: 'intro'
  data: {
    headline?: string
    body: string
  }
}

export type RichTextBlock = BaseBlock & {
  type: 'rich_text'
  data: {
    heading?: string
    body: string
  }
}

export type QuickAnswerBlock = BaseBlock & {
  type: 'quick_answer'
  data: {
    title: string
    answer: string
  }
}

export type ImageTextBlock = BaseBlock & {
  type: 'image_text'
  data: {
    image: MediaAsset
    heading?: string
    body: string
    imagePosition: 'left' | 'right'
  }
}

export type FullImageBlock = BaseBlock & {
  type: 'full_image'
  data: {
    image: MediaAsset
    caption?: string
  }
}

export type GalleryBlock = BaseBlock & {
  type: 'gallery'
  data: {
    heading?: string
    images: MediaAsset[]
    columns?: 2 | 3 | 4
  }
}

export type ChecklistItem = {
  id: string
  text: string
  note?: string
  checked?: boolean
}

export type ChecklistBlock = BaseBlock & {
  type: 'checklist'
  data: {
    heading?: string
    intro?: string
    items: ChecklistItem[]
  }
}

export type WarningSignsBlock = BaseBlock & {
  type: 'warning_signs'
  data: {
    heading?: string
    intro?: string
    signs: Array<{ id: string; title: string; description?: string }>
  }
}

export type ServiceStep = {
  id: string
  stepNumber: number
  title: string
  description: string
  icon?: string
}

export type ServiceStepsBlock = BaseBlock & {
  type: 'service_steps'
  data: {
    heading?: string
    steps: ServiceStep[]
  }
}

export type ComparisonRow = {
  id: string
  feature: string
  optionA: string
  optionB: string
  winner?: 'a' | 'b' | 'tie'
}

export type ComparisonTableBlock = BaseBlock & {
  type: 'comparison_table'
  data: {
    heading?: string
    labelA: string
    labelB: string
    rows: ComparisonRow[]
  }
}

export type SpecRow = {
  id: string
  label: string
  value: string
}

export type SpecsTableBlock = BaseBlock & {
  type: 'specs_table'
  data: {
    heading?: string
    specs: SpecRow[]
  }
}

export type FAQItem = {
  id: string
  question: string
  answer: string
}

export type FAQBlock = BaseBlock & {
  type: 'faq'
  data: {
    heading?: string
    items: FAQItem[]
  }
}

export type QuoteBlock = BaseBlock & {
  type: 'quote'
  data: {
    quote: string
    attribution?: string
    role?: string
    avatar?: MediaAsset
  }
}

export type TeamMemberBlock = BaseBlock & {
  type: 'team_member'
  data: {
    name: string
    role?: string
    bio?: string
    photo?: MediaAsset
    yearsExperience?: number
  }
}

export type RelatedServicesBlock = BaseBlock & {
  type: 'related_services'
  data: {
    heading?: string
    serviceIds: string[]
    displayStyle?: 'cards' | 'list'
  }
}

export type RelatedInventoryBlock = BaseBlock & {
  type: 'related_inventory'
  data: {
    heading?: string
    inventoryIds: string[]
    displayStyle?: 'cards' | 'list'
  }
}

export type BeforeAfterBlock = BaseBlock & {
  type: 'before_after'
  data: {
    heading?: string
    beforeImage: MediaAsset
    afterImage: MediaAsset
    beforeLabel?: string
    afterLabel?: string
    description?: string
  }
}

export type TrustBadge = {
  id: string
  label: string
  icon?: string
  description?: string
}

export type TrustBadgesBlock = BaseBlock & {
  type: 'trust_badges'
  data: {
    heading?: string
    badges: TrustBadge[]
  }
}

export type CTAStyle = 'service' | 'inventory' | 'contact' | 'quote'

export type CTABlock = BaseBlock & {
  type: 'cta'
  data: {
    title: string
    text?: string
    primaryButtonText: string
    primaryButtonUrl: string
    secondaryButtonText?: string
    secondaryButtonUrl?: string
    style?: CTAStyle
  }
}

export type ContactFormBlock = BaseBlock & {
  type: 'contact_form'
  data: {
    heading?: string
    formType?: 'general' | 'service_request' | 'inventory_inquiry'
    subjectPreset?: string
  }
}

export type MapBlock = BaseBlock & {
  type: 'map'
  data: {
    heading?: string
    address?: string
    embedUrl?: string
  }
}

export type VideoBlock = BaseBlock & {
  type: 'video'
  data: {
    heading?: string
    url: string
    caption?: string
    autoplay?: boolean
    loop?: boolean
  }
}

export type DividerBlock = BaseBlock & {
  type: 'divider'
  data: {
    style?: 'line' | 'wave' | 'dots' | 'space'
    label?: string
  }
}

export type HeadingBlock = BaseBlock & {
  type: 'heading'
  data: {
    text: string
    level?: 2 | 3 | 4
    align?: 'left' | 'center' | 'right'
    eyebrow?: string
  }
}

export type ParagraphBlock = BaseBlock & {
  type: 'paragraph'
  data: {
    body: string
    size?: 'sm' | 'base' | 'lg'
    align?: 'left' | 'center'
  }
}

export type ButtonCtaBlock = BaseBlock & {
  type: 'button_cta'
  data: {
    label: string
    url: string
    style?: 'primary' | 'secondary' | 'ghost' | 'outline'
    align?: 'left' | 'center' | 'right'
    subtext?: string
  }
}

export type ServiceCalloutBlock = BaseBlock & {
  type: 'service_callout'
  data: {
    heading: string
    description?: string
    icon?: string
    services: Array<{ id: string; name: string; description?: string; url?: string }>
    ctaLabel?: string
    ctaUrl?: string
  }
}

export type YouTubeVideoBlock = BaseBlock & {
  type: 'youtube_video'
  data: {
    url: string
    heading?: string
    caption?: string
    autoplay?: boolean
    loop?: boolean
  }
}

export type VimeoVideoBlock = BaseBlock & {
  type: 'vimeo_video'
  data: {
    url: string
    heading?: string
    caption?: string
    autoplay?: boolean
    loop?: boolean
  }
}

export type ExternalVideoBlock = BaseBlock & {
  type: 'external_video'
  data: {
    iframeSrc: string
    heading?: string
    caption?: string
    title?: string
  }
}

export type BlogBlock =
  | HeroBlock
  | IntroBlock
  | RichTextBlock
  | QuickAnswerBlock
  | ImageTextBlock
  | FullImageBlock
  | GalleryBlock
  | ChecklistBlock
  | WarningSignsBlock
  | ServiceStepsBlock
  | ComparisonTableBlock
  | SpecsTableBlock
  | FAQBlock
  | QuoteBlock
  | TeamMemberBlock
  | RelatedServicesBlock
  | RelatedInventoryBlock
  | BeforeAfterBlock
  | TrustBadgesBlock
  | CTABlock
  | ContactFormBlock
  | MapBlock
  | VideoBlock
  | DividerBlock
  | HeadingBlock
  | ParagraphBlock
  | ButtonCtaBlock
  | ServiceCalloutBlock
  | YouTubeVideoBlock
  | VimeoVideoBlock
  | ExternalVideoBlock

// ── Blog post ─────────────────────────────────────────────────────────────────

export type BlogCategory =
  | 'Suzuki Outboards'
  | 'Boat Maintenance'
  | 'Repower Guides'
  | 'Pre-Owned Buying Tips'
  | 'Seasonal Service'
  | 'Local Boating'
  | 'Company News'
  | 'Buying Guide'

export type BlogTag = {
  id: string
  label: string
  slug: string
}

export type BlogPost = {
  id: string
  title: string
  slug: string
  subtitle?: string
  excerpt: string
  postType: BlogPostType
  category: BlogCategory | string
  tags: string[]
  featuredImage?: MediaAsset
  galleryImages?: MediaAsset[]
  blocks: BlogBlock[]
  relatedServiceIds?: string[]
  relatedInventoryIds?: string[]
  seo: SEOSettings
  design: DesignSettings
  status: BlogStatus
  featured: boolean
  showOnHomepage?: boolean
  showOnBlogPage?: boolean
  authorName?: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
  scheduledFor?: string
}

// ── Snippet library ───────────────────────────────────────────────────────────

export type BlogSnippet = {
  id: string
  label: string
  description: string
  blockType: BlockType
  data: Partial<BlogBlock['data']>
}

// ── Revision history (future) ─────────────────────────────────────────────────

export type BlogRevision = {
  id: string
  postId: string
  snapshot: BlogPost
  createdAt: string
  authorName?: string
  note?: string
  // TODO: Connect to revision history backend (Supabase table: blog_revisions)
}
