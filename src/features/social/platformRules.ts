// ─────────────────────────────────────────────────────────────────────────────
// Platform-specific validation rules
// ─────────────────────────────────────────────────────────────────────────────
import { nanoid } from 'nanoid'
import type { SocialPlatform, SocialPlatformPost, SocialValidationWarning } from './types'

function warn(severity: SocialValidationWarning['severity'], message: string, field?: string): SocialValidationWarning {
  return { id: nanoid(6), severity, message, field }
}

/** Meta Ads Manager field limits (Facebook / Instagram link ads) */
export const META_AD_CHAR_LIMITS = {
  primaryText: 125,
  headline: 40,
  linkDescription: 30,
} as const

export const PLATFORM_CHAR_LIMITS: Record<SocialPlatform, number> = {
  facebook: 63206,
  instagram: 2200,
  linkedin: 3000,
  youtube: 5000,
  google_business_profile: 1500,
  x: 280,
  tiktok: 2200,
  pinterest: 500,
  threads: 500,
}

export const PLATFORM_HASHTAG_LIMITS: Record<SocialPlatform, number> = {
  facebook: 30,
  instagram: 30,
  linkedin: 3,
  youtube: 15,
  google_business_profile: 0,
  x: 5,
  tiktok: 10,
  pinterest: 10,
  threads: 10,
}

export function validateFacebook(post: SocialPlatformPost): SocialValidationWarning[] {
  const warnings: SocialValidationWarning[] = []
  if (!post.caption || post.caption.trim().length === 0)
    warnings.push(warn('error', 'Caption is required for Facebook posts.', 'caption'))
  if (!post.image)
    warnings.push(warn('warning', 'Adding an image significantly increases engagement on Facebook.', 'image'))
  if (post.caption && post.caption.length > PLATFORM_CHAR_LIMITS.facebook)
    warnings.push(warn('error', `Caption exceeds Facebook's ${PLATFORM_CHAR_LIMITS.facebook} character limit.`, 'caption'))
  return warnings
}

export function validateInstagram(post: SocialPlatformPost): SocialValidationWarning[] {
  const warnings: SocialValidationWarning[] = []
  if (!post.image)
    warnings.push(warn('error', 'Instagram requires an image or video. No post can be published without media.', 'image'))
  if (!post.caption || post.caption.trim().length === 0)
    warnings.push(warn('error', 'Caption is required for Instagram posts.', 'caption'))
  if (post.link)
    warnings.push(warn('info', 'Links in Instagram captions are not clickable. Consider using "link in bio" or Instagram Stories.', 'link'))
  if (!post.hashtags || post.hashtags.length === 0)
    warnings.push(warn('warning', 'Hashtags are strongly recommended for Instagram discoverability.', 'hashtags'))
  if (post.caption && post.caption.length > PLATFORM_CHAR_LIMITS.instagram)
    warnings.push(warn('error', `Caption exceeds Instagram's ${PLATFORM_CHAR_LIMITS.instagram} character limit.`, 'caption'))
  return warnings
}

export function validateLinkedIn(post: SocialPlatformPost): SocialValidationWarning[] {
  const warnings: SocialValidationWarning[] = []
  if (!post.caption && !post.title)
    warnings.push(warn('error', 'Caption or title is required for LinkedIn posts.', 'caption'))
  if (!post.image)
    warnings.push(warn('warning', 'Images improve LinkedIn post performance significantly.', 'image'))
  if (post.caption && post.caption.length < 100)
    warnings.push(warn('warning', 'LinkedIn audiences engage more with detailed, professional content. Consider expanding your caption.', 'caption'))
  if (post.caption && post.caption.length > PLATFORM_CHAR_LIMITS.linkedin)
    warnings.push(warn('error', `Caption exceeds LinkedIn's ${PLATFORM_CHAR_LIMITS.linkedin} character limit.`, 'caption'))
  if (post.hashtags && post.hashtags.length > PLATFORM_HASHTAG_LIMITS.linkedin)
    warnings.push(warn('warning', `LinkedIn recommends no more than ${PLATFORM_HASHTAG_LIMITS.linkedin} hashtags per post.`, 'hashtags'))
  return warnings
}

export function validateYouTube(post: SocialPlatformPost): SocialValidationWarning[] {
  const warnings: SocialValidationWarning[] = []
  if (!post.title || post.title.trim().length === 0)
    warnings.push(warn('error', 'Video title is required for YouTube posts.', 'title'))
  if (!post.caption || post.caption.trim().length === 0)
    warnings.push(warn('warning', 'A video description improves discoverability on YouTube.', 'caption'))
  if (!post.image)
    warnings.push(warn('warning', 'A custom thumbnail image is strongly recommended for YouTube videos.', 'image'))
  if (post.title && post.title.length > 100)
    warnings.push(warn('error', 'YouTube video title must be 100 characters or fewer.', 'title'))
  if (post.caption && post.caption.length > PLATFORM_CHAR_LIMITS.youtube)
    warnings.push(warn('error', `Description exceeds YouTube's ${PLATFORM_CHAR_LIMITS.youtube} character limit.`, 'caption'))
  if (!post.hashtags || post.hashtags.length === 0)
    warnings.push(warn('info', 'Hashtags in YouTube descriptions improve search visibility.', 'hashtags'))
  warnings.push(warn('info', 'YouTube posts represent a Community Post or video description. A video file/URL is required for upload — wire to YouTube Data API v3 later.'))
  return warnings
}

export function validateGoogleBusinessProfile(post: SocialPlatformPost): SocialValidationWarning[] {
  const warnings: SocialValidationWarning[] = []
  if (!post.caption || post.caption.trim().length === 0)
    warnings.push(warn('error', 'Update text is required for Google Business Profile posts.', 'caption'))
  if (!post.link)
    warnings.push(warn('warning', 'Adding a CTA link helps customers take action from your Google Business post.', 'link'))
  if (!post.image)
    warnings.push(warn('warning', 'Images are recommended for Google Business Profile posts.', 'image'))
  if (post.caption && post.caption.length > PLATFORM_CHAR_LIMITS.google_business_profile)
    warnings.push(warn('error', `Update text exceeds Google Business Profile's ${PLATFORM_CHAR_LIMITS.google_business_profile} character limit.`, 'caption'))
  return warnings
}

export function validateX(post: SocialPlatformPost): SocialValidationWarning[] {
  const warnings: SocialValidationWarning[] = []
  if (!post.caption || post.caption.trim().length === 0)
    warnings.push(warn('error', 'Post text is required for X.', 'caption'))
  if (post.caption && post.caption.length > PLATFORM_CHAR_LIMITS.x)
    warnings.push(warn('error', `Post exceeds X's ${PLATFORM_CHAR_LIMITS.x} character limit.`, 'caption'))
  if (post.caption && post.caption.length > 200)
    warnings.push(warn('warning', `X posts perform best under 200 characters. Current: ${post.caption.length}.`, 'caption'))
  // TODO: X API v2 pricing — Basic tier required for write access. Verify subscription before enabling real posting.
  warnings.push(warn('info', 'X (Twitter) API write access requires a paid developer plan. Confirm API access before enabling live posting.'))
  return warnings
}

export const PLATFORM_VALIDATORS: Record<SocialPlatform, (post: SocialPlatformPost) => SocialValidationWarning[]> = {
  facebook: validateFacebook,
  instagram: validateInstagram,
  linkedin: validateLinkedIn,
  youtube: validateYouTube,
  google_business_profile: validateGoogleBusinessProfile,
  x: validateX,
  tiktok: validateInstagram,
  pinterest: validateFacebook,
  threads: validateInstagram,
}
