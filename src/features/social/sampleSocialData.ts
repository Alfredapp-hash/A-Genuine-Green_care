// ─────────────────────────────────────────────────────────────────────────────
// Sample / seed data for mock social publisher
// ─────────────────────────────────────────────────────────────────────────────
import { nanoid } from 'nanoid'
import type { SocialAccount, SocialCampaign, SocialPlatformPost } from './types'

export const SAMPLE_ACCOUNTS: SocialAccount[] = [
  {
    id: 'acc-fb-001',
    platform: 'facebook',
    accountName: 'Saltwater Sprouts Early Learning Center',
    accountHandle: '@SaltwaterSprouts',
    connectionStatus: 'connected',
    connectedAt: '2024-01-15T10:00:00Z',
    lastSuccessfulPostAt: '2024-05-10T14:30:00Z',
    enabled: true,
    externalAccountId: 'mock-fb-page-123456',
  },
  {
    id: 'acc-ig-001',
    platform: 'instagram',
    accountName: 'saltwatersprouts',
    accountHandle: '@saltwatersprouts',
    connectionStatus: 'not_connected',
    enabled: true,
  },
  {
    id: 'acc-li-001',
    platform: 'linkedin',
    accountName: 'Saltwater Sprouts Early Learning Center',
    connectionStatus: 'not_connected',
    enabled: true,
  },
  {
    id: 'acc-yt-001',
    platform: 'youtube',
    accountName: 'Saltwater Sprouts Early Learning Center',
    accountHandle: '@SaltwaterSproutsELC',
    connectionStatus: 'not_connected',
    enabled: true,
  },
  {
    id: 'acc-gbp-001',
    platform: 'google_business_profile',
    accountName: 'Saltwater Sprouts Early Learning Center',
    connectionStatus: 'connected',
    connectedAt: '2024-02-01T09:00:00Z',
    lastSuccessfulPostAt: '2024-04-28T11:00:00Z',
    enabled: true,
    externalAccountId: 'mock-gbp-location-789',
  },
  {
    id: 'acc-x-001',
    platform: 'x',
    accountName: 'Saltwater Sprouts',
    accountHandle: '@SaltwaterSproutsELC',
    connectionStatus: 'disabled',
    enabled: false,
    lastError: 'X API write access requires a paid developer plan.',
  },
]

const SAMPLE_POST_FB: SocialPlatformPost = {
  id: nanoid(),
  campaignId: 'camp-sample-001',
  platform: 'facebook',
  accountId: 'acc-fb-001',
  status: 'draft',
  caption: 'Every child learns differently. Saltwater Sprouts Early Learning Center put together this guide to help parents understand how play-based learning builds critical thinking skills from day one.',
  link: 'https://saltwatersprouts.com/blog/play-based-learning-early-childhood',
  trackedUrl: 'https://saltwatersprouts.com/blog/play-based-learning-early-childhood?utm_source=facebook&utm_medium=social&utm_campaign=play-based-learning',
  hashtags: ['#SaltwaterSprouts', '#EarlyChildhood', '#PlayBasedLearning'],
  ctaType: 'LEARN_MORE',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

const SAMPLE_POST_IG: SocialPlatformPost = {
  id: nanoid(),
  campaignId: 'camp-sample-001',
  platform: 'instagram',
  accountId: 'acc-ig-001',
  status: 'draft',
  caption: 'Play is the work of childhood. 🌱\n\nCheck out our latest guide on play-based learning and early development — link in bio.',
  hashtags: ['#SaltwaterSprouts', '#EarlyChildhood', '#PlayBasedLearning', '#ChildDevelopment', '#Preschool', '#EarlyLearning', '#KidsActivities', '#LearningThroughPlay'],
  image: {
    url: 'https://saltwatersprouts.com/images/blogs/play-based-learning-cover.png',
    alt: 'Children engaged in play-based learning activities',
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

const SAMPLE_POST_GBP: SocialPlatformPost = {
  id: nanoid(),
  campaignId: 'camp-sample-001',
  platform: 'google_business_profile',
  accountId: 'acc-gbp-001',
  status: 'draft',
  caption: "Discover how play-based learning helps young children develop critical thinking and social skills at Saltwater Sprouts Early Learning Center. Read our latest blog post for tips you can use at home.",
  link: 'https://saltwatersprouts.com/blog/play-based-learning-early-childhood',
  trackedUrl: 'https://saltwatersprouts.com/blog/play-based-learning-early-childhood?utm_source=google_business_profile&utm_medium=social&utm_campaign=play-based-learning',
  ctaType: 'LEARN_MORE',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export const SAMPLE_CAMPAIGNS: SocialCampaign[] = [
  {
    id: 'camp-sample-001',
    blogPostId: 'sample-blog-post-001',
    campaignName: 'Play-Based Learning Guide — May 2025',
    sourceUrl: '/blog/play-based-learning-early-childhood',
    sourceTitle: 'Play-Based Learning in Early Childhood: What Parents Should Know',
    sourceExcerpt: 'A complete guide to how play-based learning develops cognitive, social, and emotional skills in children ages 0–6.',
    sourceImage: {
      url: 'https://saltwatersprouts.com/images/blogs/play-based-learning-cover.png',
      alt: 'Children engaged in play-based learning activities',
    },
    campaignStatus: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    platformPosts: [SAMPLE_POST_FB, SAMPLE_POST_IG, SAMPLE_POST_GBP],
    utm: {
      campaign: 'play-based-learning',
      source: 'social',
      medium: 'social',
      content: 'may-2025',
    },
  },
]
