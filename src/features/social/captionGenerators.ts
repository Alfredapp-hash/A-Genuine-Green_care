// ─────────────────────────────────────────────────────────────────────────────
// Caption generators — deterministic placeholders
// TODO: Replace with AI-generated captions (Claude or similar) later.
//       Hook into /api/social/generate-caption with a model call.
// ─────────────────────────────────────────────────────────────────────────────
import type { SocialPlatform } from './types'

export type MinimalBlogPost = {
  title: string
  excerpt?: string
  slug?: string
  category?: string
  tags?: string[]
}

const BRAND_HANDLE = 'Saltwater Sprouts Early Learning Center'
const BASE_HASHTAGS_BRAND = ['#SaltwaterSprouts', '#EarlyChildhood', '#EarlyLearning']
const BASE_HASHTAGS_CURRICULUM = ['#PlayBasedLearning', '#ChildDevelopment', '#Preschool']
const BASE_HASHTAGS_SEASONAL = ['#KidsActivities', '#LearningThroughPlay', '#EarlyEducation', '#ChildCare']
const BASE_HASHTAGS_ENROLLMENT = ['#NowEnrolling', '#Childcare', '#DaycareLife', '#PreschoolLife']
const BASE_HASHTAGS_COMMUNITY = ['#FamilyCommunity', '#ParentingTips', '#EarlyChildhoodEducation', '#ToddlerLife']

// ── Default ──────────────────────────────────────────────────────────────────
export function generateDefaultCaption(post: MinimalBlogPost, _platform: SocialPlatform): string {
  return `${post.excerpt ?? post.title}\n\nRead more on the ${BRAND_HANDLE} blog.`
}

// ── Professional ─────────────────────────────────────────────────────────────
export function generateProfessionalCaption(post: MinimalBlogPost, _platform: SocialPlatform): string {
  const excerpt = post.excerpt?.trim() ?? ''
  return excerpt
    ? `${excerpt}\n\n${BRAND_HANDLE} — nurturing play-based early childhood education. Read the full article on our website.`
    : `${BRAND_HANDLE} has published a new article: "${post.title}". Visit our website to read the full guide.`
}

// ── Friendly ─────────────────────────────────────────────────────────────────
export function generateFriendlyCaption(post: MinimalBlogPost, _platform: SocialPlatform): string {
  return `Hey parents! 🌱 We just posted something you'll want to read:\n\n"${post.title}"\n\n${post.excerpt ?? ''}\n\nTap the link to check it out! 🌊`
}

// ── Short ────────────────────────────────────────────────────────────────────
export function generateShortCaption(post: MinimalBlogPost, _platform: SocialPlatform): string {
  const shortened = post.title.length > 80 ? post.title.slice(0, 77) + '…' : post.title
  return `${shortened} — ${BRAND_HANDLE}`
}

// ── Curriculum-focused ───────────────────────────────────────────────────────
export function generateCurriculumFocusedCaption(post: MinimalBlogPost, _platform: SocialPlatform): string {
  return `Every child learns best through play and exploration. ${BRAND_HANDLE} put together this guide to help parents understand how early learning experiences shape development.\n\n"${post.title}"\n\nRead it on our website — link below.`
}

// ── Enrollment-focused ───────────────────────────────────────────────────────
export function generateEnrollmentFocusedCaption(post: MinimalBlogPost, _platform: SocialPlatform): string {
  return `Looking for the right childcare program for your family? ${BRAND_HANDLE} offers nurturing, play-based learning for infants through pre-K.\n\n"${post.title}"\n\nLearn more and schedule a tour at saltwatersprouts.com.`
}

// ── Local SEO ────────────────────────────────────────────────────────────────
export function generateLocalSeoCaption(post: MinimalBlogPost, _platform: SocialPlatform): string {
  return `Serving families in our community — ${BRAND_HANDLE} is dedicated to nurturing the whole child through intentional, play-based early education.\n\n"${post.title}"\n\nVisit us or learn more at saltwatersprouts.com.`
}

// ── Seasonal ────────────────────────────────────────────────────────────────
export function generateSeasonalCaption(post: MinimalBlogPost, _platform: SocialPlatform): string {
  const month = new Date().toLocaleString('en-US', { month: 'long' })
  return `${month} is a wonderful time to explore new learning adventures with your little ones. 🌿\n\n"${post.title}"\n\nRead our latest tips and ideas from ${BRAND_HANDLE}.`
}

// ── Hashtag generator ────────────────────────────────────────────────────────
export function generateHashtags(post: MinimalBlogPost, platform: SocialPlatform): string[] {
  // TODO: Replace with AI-powered hashtag research using platform-specific trending data.
  const tags = new Set<string>([...BASE_HASHTAGS_BRAND])
  const titleLower = post.title.toLowerCase()
  const catLower = (post.category ?? '').toLowerCase()

  if (titleLower.includes('learn') || titleLower.includes('develop') || titleLower.includes('play') || catLower.includes('curriculum'))
    BASE_HASHTAGS_CURRICULUM.forEach((t) => tags.add(t))
  if (titleLower.includes('enroll') || titleLower.includes('program') || catLower.includes('enrollment'))
    BASE_HASHTAGS_ENROLLMENT.forEach((t) => tags.add(t))

  BASE_HASHTAGS_SEASONAL.forEach((t) => tags.add(t))
  BASE_HASHTAGS_COMMUNITY.forEach((t) => tags.add(t))

  if (post.tags) post.tags.forEach((t) => tags.add(`#${t.replace(/\s+/g, '')}`))

  // Platform limits
  const limits: Record<SocialPlatform, number> = {
    facebook: 5, instagram: 20, linkedin: 3, youtube: 15, google_business_profile: 0, x: 3,
    tiktok: 10, pinterest: 10, threads: 10,
  }
  return [...tags].slice(0, limits[platform] || 5)
}

export const CAPTION_GENERATORS: Record<string, (post: MinimalBlogPost, platform: SocialPlatform) => string> = {
  default: generateDefaultCaption,
  professional: generateProfessionalCaption,
  friendly: generateFriendlyCaption,
  short: generateShortCaption,
  service: generateCurriculumFocusedCaption,
  inventory: generateEnrollmentFocusedCaption,
  local_seo: generateLocalSeoCaption,
  seasonal: generateSeasonalCaption,
}
