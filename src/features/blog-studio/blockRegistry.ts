// ─────────────────────────────────────────────────────────────────────────────
// Blog Studio — Block Registry
// Powers: Add Block menu, dynamic editor, public preview renderer
// ─────────────────────────────────────────────────────────────────────────────

import type { ComponentType } from 'react'
import type { BlogBlock, BlockType } from './types'

// ── Editors ───────────────────────────────────────────────────────────────────
import HeroBlockEditor from './blocks/editors/HeroBlockEditor'
import IntroBlockEditor from './blocks/editors/IntroBlockEditor'
import RichTextBlockEditor from './blocks/editors/RichTextBlockEditor'
import QuickAnswerBlockEditor from './blocks/editors/QuickAnswerBlockEditor'
import ChecklistBlockEditor from './blocks/editors/ChecklistBlockEditor'
import FAQBlockEditor from './blocks/editors/FAQBlockEditor'
import CTABlockEditor from './blocks/editors/CTABlockEditor'
import GalleryBlockEditor from './blocks/editors/GalleryBlockEditor'
import SpecsTableBlockEditor from './blocks/editors/SpecsTableBlockEditor'
import ComparisonTableBlockEditor from './blocks/editors/ComparisonTableBlockEditor'
import RelatedServicesBlockEditor from './blocks/editors/RelatedServicesBlockEditor'
import RelatedInventoryBlockEditor from './blocks/editors/RelatedInventoryBlockEditor'
import BeforeAfterBlockEditor from './blocks/editors/BeforeAfterBlockEditor'
import PlaceholderBlockEditor from './blocks/editors/PlaceholderBlockEditor'
import VideoBlockEditor from './blocks/editors/VideoBlockEditor'
import DividerBlockEditor from './blocks/editors/DividerBlockEditor'
import HeadingBlockEditor from './blocks/editors/HeadingBlockEditor'
import ParagraphBlockEditor from './blocks/editors/ParagraphBlockEditor'
import ButtonCtaBlockEditor from './blocks/editors/ButtonCtaBlockEditor'
import ServiceCalloutBlockEditor from './blocks/editors/ServiceCalloutBlockEditor'
import YouTubeVideoBlockEditor from './blocks/editors/YouTubeVideoBlockEditor'
import VimeoVideoBlockEditor from './blocks/editors/VimeoVideoBlockEditor'
import ExternalVideoBlockEditor from './blocks/editors/ExternalVideoBlockEditor'

// ── Renderers ─────────────────────────────────────────────────────────────────
import HeroBlockRenderer from './blocks/renderers/HeroBlockRenderer'
import IntroBlockRenderer from './blocks/renderers/IntroBlockRenderer'
import RichTextBlockRenderer from './blocks/renderers/RichTextBlockRenderer'
import QuickAnswerBlockRenderer from './blocks/renderers/QuickAnswerBlockRenderer'
import ChecklistBlockRenderer from './blocks/renderers/ChecklistBlockRenderer'
import FAQBlockRenderer from './blocks/renderers/FAQBlockRenderer'
import CTABlockRenderer from './blocks/renderers/CTABlockRenderer'
import GalleryBlockRenderer from './blocks/renderers/GalleryBlockRenderer'
import SpecsTableBlockRenderer from './blocks/renderers/SpecsTableBlockRenderer'
import ComparisonTableBlockRenderer from './blocks/renderers/ComparisonTableBlockRenderer'
import ServiceStepsBlockRenderer from './blocks/renderers/ServiceStepsBlockRenderer'
import WarningSignsBlockRenderer from './blocks/renderers/WarningSignsBlockRenderer'
import QuoteBlockRenderer from './blocks/renderers/QuoteBlockRenderer'
import TeamMemberBlockRenderer from './blocks/renderers/TeamMemberBlockRenderer'
import RelatedServicesBlockRenderer from './blocks/renderers/RelatedServicesBlockRenderer'
import RelatedInventoryBlockRenderer from './blocks/renderers/RelatedInventoryBlockRenderer'
import BeforeAfterBlockRenderer from './blocks/renderers/BeforeAfterBlockRenderer'
import TrustBadgesBlockRenderer from './blocks/renderers/TrustBadgesBlockRenderer'
import ImageTextBlockRenderer from './blocks/renderers/ImageTextBlockRenderer'
import FullImageBlockRenderer from './blocks/renderers/FullImageBlockRenderer'
import ContactFormBlockRenderer from './blocks/renderers/ContactFormBlockRenderer'
import MapBlockRenderer from './blocks/renderers/MapBlockRenderer'
import VideoBlockRenderer from './blocks/renderers/VideoBlockRenderer'
import DividerBlockRenderer from './blocks/renderers/DividerBlockRenderer'
import HeadingBlockRenderer from './blocks/renderers/HeadingBlockRenderer'
import ParagraphBlockRenderer from './blocks/renderers/ParagraphBlockRenderer'
import ButtonCtaBlockRenderer from './blocks/renderers/ButtonCtaBlockRenderer'
import ServiceCalloutBlockRenderer from './blocks/renderers/ServiceCalloutBlockRenderer'
import YouTubeVideoBlockRenderer from './blocks/renderers/YouTubeVideoBlockRenderer'
import VimeoVideoBlockRenderer from './blocks/renderers/VimeoVideoBlockRenderer'
import ExternalVideoBlockRenderer from './blocks/renderers/ExternalVideoBlockRenderer'

// ── Default block factories ───────────────────────────────────────────────────
import {
  createDefaultHeroBlock,
  createDefaultIntroBlock,
  createDefaultRichTextBlock,
  createDefaultQuickAnswerBlock,
  createDefaultChecklistBlock,
  createDefaultFAQBlock,
  createDefaultCTABlock,
  createDefaultGalleryBlock,
  createDefaultSpecsTableBlock,
  createDefaultComparisonTableBlock,
  createDefaultServiceStepsBlock,
  createDefaultWarningSignsBlock,
  createDefaultQuoteBlock,
  createDefaultTeamMemberBlock,
  createDefaultRelatedServicesBlock,
  createDefaultRelatedInventoryBlock,
  createDefaultBeforeAfterBlock,
  createDefaultTrustBadgesBlock,
} from './templates'
import { nanoid } from 'nanoid'
import type {
  ImageTextBlock, FullImageBlock, ContactFormBlock, MapBlock, VideoBlock,
  DividerBlock, HeadingBlock, ParagraphBlock, ButtonCtaBlock, ServiceCalloutBlock,
  YouTubeVideoBlock, VimeoVideoBlock, ExternalVideoBlock,
} from './types'

// ── Registry entry type ───────────────────────────────────────────────────────

export type BlockRegistryEntry = {
  label: string
  icon: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editor: ComponentType<{ block: any; onChange: (b: any) => void }>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderer: ComponentType<{ block: any }>
  createDefault: () => BlogBlock
  category: 'layout' | 'content' | 'media' | 'data' | 'cta' | 'social'
}

// ── Default factories for remaining types ─────────────────────────────────────

function createDefaultImageTextBlock(): ImageTextBlock {
  return { id: nanoid(), type: 'image_text', enabled: true, internalLabel: 'Image + Text', data: { image: { id: nanoid(), url: '/hero.PNG', alt: '' }, body: '', imagePosition: 'left' } }
}
function createDefaultFullImageBlock(): FullImageBlock {
  return { id: nanoid(), type: 'full_image', enabled: true, internalLabel: 'Full Image', data: { image: { id: nanoid(), url: '/hero.PNG', alt: '' } } }
}
function createDefaultContactFormBlock(): ContactFormBlock {
  return { id: nanoid(), type: 'contact_form', enabled: true, internalLabel: 'Contact Form', data: { heading: 'Get in Touch', formType: 'general' } }
}
function createDefaultMapBlock(): MapBlock {
  return { id: nanoid(), type: 'map', enabled: true, internalLabel: 'Map', data: { heading: 'Find Us', address: '1199 David W Ray Road, Georgetown, SC 29440' } }
}
function createDefaultVideoBlock(): VideoBlock {
  return { id: nanoid(), type: 'video', enabled: true, internalLabel: 'Video', data: { url: '', heading: '' } }
}
function createDefaultDividerBlock(): DividerBlock {
  return { id: nanoid(), type: 'divider', enabled: true, internalLabel: 'Divider', data: { style: 'line' } }
}
function createDefaultHeadingBlock(): HeadingBlock {
  return { id: nanoid(), type: 'heading', enabled: true, internalLabel: 'Heading', data: { text: 'Section Heading', level: 2, align: 'left' } }
}
function createDefaultParagraphBlock(): ParagraphBlock {
  return { id: nanoid(), type: 'paragraph', enabled: true, internalLabel: 'Paragraph', data: { body: '', size: 'base', align: 'left' } }
}
function createDefaultButtonCtaBlock(): ButtonCtaBlock {
  return { id: nanoid(), type: 'button_cta', enabled: true, internalLabel: 'Button CTA', data: { label: 'Schedule Service', url: '/contact', style: 'primary', align: 'center' } }
}
function createDefaultServiceCalloutBlock(): ServiceCalloutBlock {
  return { id: nanoid(), type: 'service_callout', enabled: true, internalLabel: 'Service Callout', data: { heading: 'Our Marine Services', services: [{ id: nanoid(), name: 'Oil Changes', description: 'Suzuki-spec oil and filter service', url: '/services/oil-changes' }] } }
}
function createDefaultYouTubeVideoBlock(): YouTubeVideoBlock {
  return { id: nanoid(), type: 'youtube_video', enabled: true, internalLabel: 'YouTube Video', data: { url: '' } }
}
function createDefaultVimeoVideoBlock(): VimeoVideoBlock {
  return { id: nanoid(), type: 'vimeo_video', enabled: true, internalLabel: 'Vimeo Video', data: { url: '' } }
}
function createDefaultExternalVideoBlock(): ExternalVideoBlock {
  return { id: nanoid(), type: 'external_video', enabled: true, internalLabel: 'External Video', data: { iframeSrc: '' } }
}

// ── Registry ──────────────────────────────────────────────────────────────────

export const blockRegistry: Record<BlockType, BlockRegistryEntry> = {
  hero:               { label: 'Hero',               icon: '🏔️', category: 'layout',  editor: HeroBlockEditor,              renderer: HeroBlockRenderer,              createDefault: createDefaultHeroBlock },
  intro:              { label: 'Intro',               icon: '📖', category: 'content', editor: IntroBlockEditor,             renderer: IntroBlockRenderer,             createDefault: createDefaultIntroBlock },
  rich_text:          { label: 'Rich Text',           icon: '📝', category: 'content', editor: RichTextBlockEditor,          renderer: RichTextBlockRenderer,          createDefault: createDefaultRichTextBlock },
  quick_answer:       { label: 'Quick Answer',        icon: '💡', category: 'content', editor: QuickAnswerBlockEditor,       renderer: QuickAnswerBlockRenderer,       createDefault: createDefaultQuickAnswerBlock },
  image_text:         { label: 'Image + Text',        icon: '🖼️', category: 'media',   editor: PlaceholderBlockEditor,       renderer: ImageTextBlockRenderer,         createDefault: createDefaultImageTextBlock },
  full_image:         { label: 'Full Image',          icon: '📷', category: 'media',   editor: PlaceholderBlockEditor,       renderer: FullImageBlockRenderer,         createDefault: createDefaultFullImageBlock },
  gallery:            { label: 'Gallery',             icon: '🎞️', category: 'media',   editor: GalleryBlockEditor,           renderer: GalleryBlockRenderer,           createDefault: createDefaultGalleryBlock },
  checklist:          { label: 'Checklist',           icon: '✅', category: 'content', editor: ChecklistBlockEditor,         renderer: ChecklistBlockRenderer,         createDefault: createDefaultChecklistBlock },
  warning_signs:      { label: 'Warning Signs',       icon: '⚠️', category: 'content', editor: PlaceholderBlockEditor,       renderer: WarningSignsBlockRenderer,      createDefault: createDefaultWarningSignsBlock },
  service_steps:      { label: 'Service Steps',       icon: '🔧', category: 'content', editor: PlaceholderBlockEditor,       renderer: ServiceStepsBlockRenderer,      createDefault: createDefaultServiceStepsBlock },
  comparison_table:   { label: 'Comparison Table',    icon: '⚖️', category: 'data',    editor: ComparisonTableBlockEditor,   renderer: ComparisonTableBlockRenderer,   createDefault: createDefaultComparisonTableBlock },
  specs_table:        { label: 'Specs Table',         icon: '📋', category: 'data',    editor: SpecsTableBlockEditor,        renderer: SpecsTableBlockRenderer,        createDefault: createDefaultSpecsTableBlock },
  faq:                { label: 'FAQ',                 icon: '❓', category: 'content', editor: FAQBlockEditor,               renderer: FAQBlockRenderer,               createDefault: createDefaultFAQBlock },
  quote:              { label: 'Quote',               icon: '💬', category: 'social',  editor: PlaceholderBlockEditor,       renderer: QuoteBlockRenderer,             createDefault: createDefaultQuoteBlock },
  team_member:        { label: 'Team Member',         icon: '👤', category: 'social',  editor: PlaceholderBlockEditor,       renderer: TeamMemberBlockRenderer,        createDefault: createDefaultTeamMemberBlock },
  related_services:   { label: 'Related Services',    icon: '🔗', category: 'cta',     editor: RelatedServicesBlockEditor,   renderer: RelatedServicesBlockRenderer,   createDefault: createDefaultRelatedServicesBlock },
  related_inventory:  { label: 'Related Inventory',   icon: '🛥️', category: 'cta',     editor: RelatedInventoryBlockEditor,  renderer: RelatedInventoryBlockRenderer,  createDefault: createDefaultRelatedInventoryBlock },
  before_after:       { label: 'Before & After',      icon: '🔄', category: 'media',   editor: BeforeAfterBlockEditor,       renderer: BeforeAfterBlockRenderer,       createDefault: createDefaultBeforeAfterBlock },
  trust_badges:       { label: 'Trust Badges',        icon: '🏅', category: 'social',  editor: PlaceholderBlockEditor,       renderer: TrustBadgesBlockRenderer,       createDefault: createDefaultTrustBadgesBlock },
  cta:                { label: 'CTA',                 icon: '🎯', category: 'cta',     editor: CTABlockEditor,               renderer: CTABlockRenderer,               createDefault: createDefaultCTABlock },
  contact_form:       { label: 'Contact Form',        icon: '📬', category: 'cta',     editor: PlaceholderBlockEditor,       renderer: ContactFormBlockRenderer,       createDefault: createDefaultContactFormBlock },
  map:                { label: 'Map',                 icon: '🗺️', category: 'layout',  editor: PlaceholderBlockEditor,       renderer: MapBlockRenderer,               createDefault: createDefaultMapBlock },
  video:              { label: 'Video',               icon: '🎥', category: 'media',   editor: VideoBlockEditor,             renderer: VideoBlockRenderer,             createDefault: createDefaultVideoBlock },
  divider:            { label: 'Divider',             icon: '➖', category: 'layout',  editor: DividerBlockEditor,           renderer: DividerBlockRenderer,           createDefault: createDefaultDividerBlock },
  heading:            { label: 'Heading',             icon: '🔤', category: 'content', editor: HeadingBlockEditor,           renderer: HeadingBlockRenderer,           createDefault: createDefaultHeadingBlock },
  paragraph:          { label: 'Paragraph',           icon: '📄', category: 'content', editor: ParagraphBlockEditor,         renderer: ParagraphBlockRenderer,         createDefault: createDefaultParagraphBlock },
  button_cta:         { label: 'Button CTA',          icon: '🔘', category: 'cta',     editor: ButtonCtaBlockEditor,         renderer: ButtonCtaBlockRenderer,         createDefault: createDefaultButtonCtaBlock },
  service_callout:    { label: 'Service Callout',     icon: '⚓', category: 'cta',     editor: ServiceCalloutBlockEditor,    renderer: ServiceCalloutBlockRenderer,    createDefault: createDefaultServiceCalloutBlock },
  youtube_video:      { label: 'YouTube Video',       icon: '▶️', category: 'media',   editor: YouTubeVideoBlockEditor,      renderer: YouTubeVideoBlockRenderer,      createDefault: createDefaultYouTubeVideoBlock },
  vimeo_video:        { label: 'Vimeo Video',         icon: '🎬', category: 'media',   editor: VimeoVideoBlockEditor,        renderer: VimeoVideoBlockRenderer,        createDefault: createDefaultVimeoVideoBlock },
  external_video:     { label: 'External Video',      icon: '📹', category: 'media',   editor: ExternalVideoBlockEditor,     renderer: ExternalVideoBlockRenderer,     createDefault: createDefaultExternalVideoBlock },
}

export function getBlockEntry(type: BlockType): BlockRegistryEntry {
  return blockRegistry[type]
}

export const BLOCK_CATEGORIES = ['layout', 'content', 'media', 'data', 'cta', 'social'] as const
