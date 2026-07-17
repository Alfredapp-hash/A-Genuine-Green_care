// ─────────────────────────────────────────────────────────────────────────────
// Platform adapters — mock implementations only.
// TODO: Replace each mockPublish with a real publish() method that calls the
//       platform API via a secure server-side route (/api/social/posts/[id]/publish).
//       NEVER store OAuth tokens in frontend code.
//       All real API calls must go through Next.js server routes or Server Actions.
// ─────────────────────────────────────────────────────────────────────────────
import { nanoid } from 'nanoid'
import type { SocialPlatformAdapter, SocialPlatformPost, SocialPublishResult } from './types'
import {
  validateFacebook, validateInstagram, validateLinkedIn,
  validateYouTube, validateGoogleBusinessProfile, validateX,
} from './platformRules'

function mockDelay(ms = 600): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ── Facebook ─────────────────────────────────────────────────────────────────
export const facebookAdapter: SocialPlatformAdapter = {
  platform: 'facebook',

  validatePost: validateFacebook,

  buildPayload(post) {
    // TODO: Map to Facebook Graph API v18+ /page/feed payload.
    // Required scope: pages_manage_posts, pages_read_engagement
    return {
      message: post.caption,
      link: post.trackedUrl ?? post.link,
      ...(post.image ? { picture: post.image.url } : {}),
      call_to_action: post.ctaType ? { type: post.ctaType } : undefined,
    }
  },

  async mockPublish(_post): Promise<SocialPublishResult> {
    await mockDelay()
    const mockId = `mock-fb-${nanoid(8)}`
    return {
      success: true,
      platform: 'facebook',
      status: 'mock_posted',
      externalPostId: mockId,
      externalPostUrl: `https://example.com/mock-facebook-post/${mockId}`,
      rawResponse: { id: mockId, __mock: true },
    }
  },
}

// ── Instagram ────────────────────────────────────────────────────────────────
export const instagramAdapter: SocialPlatformAdapter = {
  platform: 'instagram',

  validatePost: validateInstagram,

  buildPayload(post) {
    // TODO: Map to Instagram Graph API — two-step: create container, then publish.
    // Required scope: instagram_content_publish, instagram_basic
    return {
      image_url: post.image?.url,
      caption: [post.caption, ...(post.hashtags ?? [])].join('\n\n'),
    }
  },

  async mockPublish(_post): Promise<SocialPublishResult> {
    await mockDelay()
    const mockId = `mock-ig-${nanoid(8)}`
    return {
      success: true,
      platform: 'instagram',
      status: 'mock_posted',
      externalPostId: mockId,
      externalPostUrl: `https://example.com/mock-instagram-post/${mockId}`,
      rawResponse: { id: mockId, __mock: true },
    }
  },
}

// ── LinkedIn ─────────────────────────────────────────────────────────────────
export const linkedinAdapter: SocialPlatformAdapter = {
  platform: 'linkedin',

  validatePost: validateLinkedIn,

  buildPayload(post) {
    // TODO: Map to LinkedIn Share API v2 /ugcPosts
    // Required scope: w_member_social, r_liteprofile
    return {
      author: 'urn:li:organization:{ORG_ID}', // TODO: replace with real org URN
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: { text: post.caption },
          shareMediaCategory: post.image ? 'IMAGE' : post.link ? 'ARTICLE' : 'NONE',
          media: post.link ? [{ status: 'READY', originalUrl: post.trackedUrl ?? post.link, title: { text: post.title ?? '' } }] : [],
        },
      },
      visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
    }
  },

  async mockPublish(_post): Promise<SocialPublishResult> {
    await mockDelay()
    const mockId = `mock-li-${nanoid(8)}`
    return {
      success: true,
      platform: 'linkedin',
      status: 'mock_posted',
      externalPostId: mockId,
      externalPostUrl: `https://example.com/mock-linkedin-post/${mockId}`,
      rawResponse: { id: mockId, __mock: true },
    }
  },
}

// ── YouTube ───────────────────────────────────────────────────────────────────
export const youtubeAdapter: SocialPlatformAdapter = {
  platform: 'youtube',

  validatePost: validateYouTube,

  buildPayload(post) {
    // TODO: Map to YouTube Data API v3 /videos endpoint (insert) for video upload,
    //       or /channels/sections for community posts.
    return {
      snippet: {
        title: post.title ?? '',
        description: [post.caption, ...(post.hashtags ?? [])].join('\n\n'),
        tags: (post.hashtags ?? []).map((t) => t.replace(/^#/, '')),
        categoryId: '26', // How-to & Style (childcare relevant)
      },
      status: {
        privacyStatus: 'public',
        selfDeclaredMadeForKids: true,
      },
    }
  },

  async mockPublish(_post): Promise<SocialPublishResult> {
    await mockDelay()
    const mockId = `mock-yt-${nanoid(8)}`
    return {
      success: true,
      platform: 'youtube',
      status: 'mock_posted',
      externalPostId: mockId,
      externalPostUrl: `https://www.youtube.com/watch?v=${mockId}`,
      rawResponse: { id: mockId, __mock: true },
    }
  },
}

// ── Google Business Profile ───────────────────────────────────────────────────
export const googleBusinessProfileAdapter: SocialPlatformAdapter = {
  platform: 'google_business_profile',

  validatePost: validateGoogleBusinessProfile,

  buildPayload(post) {
    // TODO: Map to Google My Business API v4 /accounts/{accountId}/locations/{locationId}/localPosts
    // Required scope: https://www.googleapis.com/auth/business.manage
    return {
      languageCode: 'en-US',
      summary: post.caption,
      callToAction: post.link ? { actionType: post.ctaType ?? 'LEARN_MORE', url: post.trackedUrl ?? post.link } : undefined,
      media: post.image ? [{ mediaFormat: 'PHOTO', sourceUrl: post.image.url }] : [],
    }
  },

  async mockPublish(_post): Promise<SocialPublishResult> {
    await mockDelay()
    const mockId = `mock-gbp-${nanoid(8)}`
    return {
      success: true,
      platform: 'google_business_profile',
      status: 'mock_posted',
      externalPostId: mockId,
      externalPostUrl: `https://example.com/mock-gbp-post/${mockId}`,
      rawResponse: { name: mockId, __mock: true },
    }
  },
}

// ── X (Twitter) ───────────────────────────────────────────────────────────────
export const xAdapter: SocialPlatformAdapter = {
  platform: 'x',

  validatePost: validateX,

  buildPayload(post) {
    // TODO: Map to X API v2 POST /2/tweets
    return {
      text: post.caption,
      ...(post.image ? { media: { media_ids: ['TODO_MEDIA_ID'] } } : {}),
    }
  },

  async mockPublish(_post): Promise<SocialPublishResult> {
    await mockDelay()
    const mockId = `mock-x-${nanoid(8)}`
    return {
      success: true,
      platform: 'x',
      status: 'mock_posted',
      externalPostId: mockId,
      externalPostUrl: `https://example.com/mock-x-post/${mockId}`,
      rawResponse: { data: { id: mockId }, __mock: true },
    }
  },
}

export const ADAPTERS: Record<string, SocialPlatformAdapter> = {
  facebook: facebookAdapter,
  instagram: instagramAdapter,
  linkedin: linkedinAdapter,
  youtube: youtubeAdapter,
  google_business_profile: googleBusinessProfileAdapter,
  x: xAdapter,
}

export function getAdapter(platform: string): SocialPlatformAdapter {
  const adapter = ADAPTERS[platform]
  if (!adapter) throw new Error(`No adapter found for platform: ${platform}`)
  return adapter
}
