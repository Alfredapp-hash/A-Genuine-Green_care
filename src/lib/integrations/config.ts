import {
  getCredentialStatuses,
  getGlobalMode,
  isMockAllowed,
} from '@/lib/social/connectors/registry'
import {
  getCredential,
  hasCanvaCredentials,
  hasGoogleCredentials,
  hasLinkedInCredentials,
  hasMetaCredentials,
  hasOpenAICredentials,
  hasResendCredentials,
} from '@/lib/integrations/credential-resolver'

export type IntegrationStatus = 'configured' | 'missing' | 'optional'

export type IntegrationLink = {
  id: string
  name: string
  description: string
  category: 'email' | 'cache' | 'social' | 'content' | 'database'
  status: IntegrationStatus
  envKeys: string[]
  configured: boolean
  consoleUrl: string
  docsUrl?: string
  adminPath?: string
  setupHint?: string
}

function hasEnv(...keys: string[]): boolean {
  return keys.every((k) => Boolean(process.env[k]?.trim()))
}

function envStatus(keys: string[], optional = false): IntegrationStatus {
  if (hasEnv(...keys)) return 'configured'
  return optional ? 'optional' : 'missing'
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://saltwatersprouts.com'

/** Env-only catalog (used for env fallback badges on Settings connectors). */
export function getIntegrationCatalog(): IntegrationLink[] {
  return [
    {
      id: 'resend',
      name: 'Resend',
      description: 'Transactional email — contact forms, parent communications, newsletter signups.',
      category: 'email',
      envKeys: ['RESEND_API_KEY'],
      configured: hasEnv('RESEND_API_KEY'),
      status: envStatus(['RESEND_API_KEY']),
      consoleUrl: 'https://resend.com/emails',
      docsUrl: 'https://resend.com/docs/dashboard/domains/introduction',
      setupHint: 'Verify saltwatersprouts.com in Resend → Domains, then add RESEND_API_KEY to Vercel.',
    },
    {
      id: 'upstash',
      name: 'Upstash Redis',
      description: 'Distributed rate limits, OAuth state, and social publish queue (recommended for production).',
      category: 'cache',
      envKeys: ['UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN'],
      configured: hasEnv('UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN'),
      status: envStatus(['UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN'], true),
      consoleUrl: 'https://console.upstash.com/redis',
      docsUrl: 'https://upstash.com/docs/redis/overall/getstarted',
      setupHint: 'Create a Redis database → copy REST URL + token → add to Vercel env.',
    },
    {
      id: 'openai',
      name: 'OpenAI',
      description: 'AI content drafts — blog posts, SEO, and social captions.',
      category: 'content',
      envKeys: ['OPENAI_API_KEY'],
      configured: hasEnv('OPENAI_API_KEY'),
      status: envStatus(['OPENAI_API_KEY']),
      consoleUrl: 'https://platform.openai.com/api-keys',
      docsUrl: 'https://platform.openai.com/docs/guides/text',
      adminPath: '/admin/ai-command-center',
      setupHint: 'Optional: OPENAI_MODEL (default gpt-4.1-mini). All outputs saved for review — never auto-published.',
    },
    {
      id: 'blog-studio',
      name: 'Blog Studio',
      description: 'Author and publish posts to saltwatersprouts.com/blog.',
      category: 'content',
      envKeys: ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'],
      configured: hasEnv('NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'),
      status: envStatus(['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY']),
      consoleUrl: `${siteUrl}/admin/blog-studio`,
      adminPath: '/admin/blog-studio',
    },
    {
      id: 'canva',
      name: 'Canva Connect',
      description: 'Import Canva designs into Blog Studio and Social campaigns.',
      category: 'content',
      envKeys: ['CANVA_CLIENT_ID', 'CANVA_CLIENT_SECRET', 'CANVA_REDIRECT_URI'],
      configured: hasEnv('CANVA_CLIENT_ID', 'CANVA_CLIENT_SECRET'),
      status: envStatus(['CANVA_CLIENT_ID', 'CANVA_CLIENT_SECRET'], true),
      consoleUrl: 'https://www.canva.com/developers/',
      docsUrl: 'https://www.canva.dev/docs/connect/authentication/',
      adminPath: '/admin/settings',
      setupHint: `Save Client ID + Secret in Settings → Connectors, then connect your Canva account. Redirect URI: ${siteUrl}/api/canva/oauth/callback`,
    },
    {
      id: 'social-publisher',
      name: 'Social Publisher',
      description: 'Promote Blog Studio posts to Facebook, Instagram, LinkedIn, YouTube, and Google Business.',
      category: 'social',
      envKeys: ['SOCIAL_TOKEN_ENCRYPTION_KEY'],
      configured: hasEnv('SOCIAL_TOKEN_ENCRYPTION_KEY'),
      status: envStatus(['SOCIAL_TOKEN_ENCRYPTION_KEY'], true),
      consoleUrl: `${siteUrl}/admin/social`,
      adminPath: '/admin/social',
      setupHint: 'Connect accounts under Social → Accounts; configure platform OAuth keys in setup.',
    },
    {
      id: 'meta',
      name: 'Meta (Facebook + Instagram)',
      description: 'Page and Instagram Business publishing via Graph API.',
      category: 'social',
      envKeys: ['META_APP_ID', 'META_APP_SECRET', 'META_REDIRECT_URI'],
      configured: hasEnv('META_APP_ID', 'META_APP_SECRET', 'META_REDIRECT_URI'),
      status: envStatus(['META_APP_ID', 'META_APP_SECRET', 'META_REDIRECT_URI'], true),
      consoleUrl: 'https://developers.facebook.com/apps/',
      docsUrl: 'https://developers.facebook.com/docs/pages-api/',
      adminPath: '/admin/social/setup',
      setupHint: `Redirect URI: ${siteUrl}/api/social/oauth/facebook/callback`,
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      description: 'Company page posts via LinkedIn Marketing API.',
      category: 'social',
      envKeys: ['LINKEDIN_CLIENT_ID', 'LINKEDIN_CLIENT_SECRET', 'LINKEDIN_REDIRECT_URI'],
      configured: hasEnv('LINKEDIN_CLIENT_ID', 'LINKEDIN_CLIENT_SECRET', 'LINKEDIN_REDIRECT_URI'),
      status: envStatus(['LINKEDIN_CLIENT_ID', 'LINKEDIN_CLIENT_SECRET', 'LINKEDIN_REDIRECT_URI'], true),
      consoleUrl: 'https://www.linkedin.com/developers/apps',
      docsUrl: 'https://learn.microsoft.com/en-us/linkedin/marketing/',
      adminPath: '/admin/social/setup',
      setupHint: `Redirect URI: ${siteUrl}/api/social/oauth/linkedin/callback`,
    },
    {
      id: 'google',
      name: 'Google (YouTube + Business Profile)',
      description: 'YouTube uploads and Google Business Profile updates.',
      category: 'social',
      envKeys: ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REDIRECT_URI'],
      configured: hasEnv('GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REDIRECT_URI'),
      status: envStatus(['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REDIRECT_URI'], true),
      consoleUrl: 'https://console.cloud.google.com/apis/credentials',
      docsUrl: 'https://developers.google.com/youtube/v3',
      adminPath: '/admin/social/setup',
      setupHint: `Redirect URI: ${siteUrl}/api/social/oauth/youtube/callback`,
    },
    {
      id: 'supabase',
      name: 'Supabase',
      description: 'Database, auth, blog studio, and newsletter subscribers.',
      category: 'database',
      envKeys: ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'],
      configured: hasEnv('NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'),
      status: envStatus(['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']),
      consoleUrl: 'https://supabase.com/dashboard',
      docsUrl: 'https://supabase.com/docs',
    },
  ]
}

/** Honors Settings-stored secrets when called inside runWithIntegrationCredentials. */
export function getIntegrationCatalogResolved(): IntegrationLink[] {
  const metaRedirect = getCredential('META_REDIRECT_URI') ?? `${siteUrl}/api/social/oauth/facebook/callback`
  const linkedinRedirect = getCredential('LINKEDIN_REDIRECT_URI') ?? `${siteUrl}/api/social/oauth/linkedin/callback`
  const googleRedirect = getCredential('GOOGLE_REDIRECT_URI') ?? `${siteUrl}/api/social/oauth/youtube/callback`

  function resolved(keys: string[], optional = false): IntegrationStatus {
    const ok = keys.every((k) => Boolean(getCredential(k)))
    if (ok) return 'configured'
    return optional ? 'optional' : 'missing'
  }

  return [
    {
      id: 'resend',
      name: 'Resend',
      description: 'Transactional email — contact forms, parent communications, newsletter signups.',
      category: 'email',
      envKeys: ['RESEND_API_KEY'],
      configured: hasResendCredentials(),
      status: resolved(['RESEND_API_KEY']),
      consoleUrl: 'https://resend.com/emails',
      docsUrl: 'https://resend.com/docs/dashboard/domains/introduction',
      setupHint: 'Add your API key in Settings → Connectors, or set RESEND_API_KEY in Vercel. Verify saltwatersprouts.com in Resend.',
      adminPath: '/admin/settings',
    },
    {
      id: 'upstash',
      name: 'Upstash Redis',
      description: 'Distributed rate limits, OAuth state, and social publish queue (recommended for production).',
      category: 'cache',
      envKeys: ['UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN'],
      configured: hasEnv('UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN'),
      status: envStatus(['UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN'], true),
      consoleUrl: 'https://console.upstash.com/redis',
      docsUrl: 'https://upstash.com/docs/redis/overall/getstarted',
      setupHint: 'Create a Redis database → copy REST URL + token → add to Vercel env.',
    },
    {
      id: 'openai',
      name: 'OpenAI',
      description: 'AI content drafts — blog posts, SEO, and social captions.',
      category: 'content',
      envKeys: ['OPENAI_API_KEY'],
      configured: hasOpenAICredentials(),
      status: resolved(['OPENAI_API_KEY']),
      consoleUrl: 'https://platform.openai.com/api-keys',
      docsUrl: 'https://platform.openai.com/docs/guides/text',
      adminPath: '/admin/ai-command-center',
      setupHint: 'Add your API key in Settings → Connectors, or set OPENAI_API_KEY in Vercel.',
    },
    {
      id: 'blog-studio',
      name: 'Blog Studio',
      description: 'Author and publish posts to saltwatersprouts.com/blog.',
      category: 'content',
      envKeys: ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'],
      configured: hasEnv('NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'),
      status: envStatus(['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY']),
      consoleUrl: `${siteUrl}/admin/blog-studio`,
      adminPath: '/admin/blog-studio',
    },
    {
      id: 'canva',
      name: 'Canva Connect',
      description: 'Import Canva designs into Blog Studio and Social campaigns.',
      category: 'content',
      envKeys: ['CANVA_CLIENT_ID', 'CANVA_CLIENT_SECRET', 'CANVA_REDIRECT_URI'],
      configured: hasCanvaCredentials(),
      status: hasCanvaCredentials() ? 'configured' : 'optional',
      consoleUrl: 'https://www.canva.com/developers/',
      docsUrl: 'https://www.canva.dev/docs/connect/authentication/',
      adminPath: '/admin/settings',
      setupHint: `Save Client ID + Secret in Settings → Connectors, then connect your Canva account. Redirect URI: ${getCredential('CANVA_REDIRECT_URI') ?? `${siteUrl}/api/canva/oauth/callback`}`,
    },
    {
      id: 'social-publisher',
      name: 'Social Publisher',
      description: 'Promote Blog Studio posts to Facebook, Instagram, LinkedIn, YouTube, and Google Business.',
      category: 'social',
      envKeys: ['SOCIAL_TOKEN_ENCRYPTION_KEY'],
      configured: hasEnv('SOCIAL_TOKEN_ENCRYPTION_KEY'),
      status: envStatus(['SOCIAL_TOKEN_ENCRYPTION_KEY'], true),
      consoleUrl: `${siteUrl}/admin/social`,
      adminPath: '/admin/social',
      setupHint: 'Connect accounts under Social → Accounts; configure platform OAuth keys in Settings → Connectors.',
    },
    {
      id: 'meta',
      name: 'Meta (Facebook + Instagram)',
      description: 'Page and Instagram Business publishing via Graph API.',
      category: 'social',
      envKeys: ['META_APP_ID', 'META_APP_SECRET', 'META_REDIRECT_URI'],
      configured: hasMetaCredentials(),
      status: hasMetaCredentials() ? 'configured' : 'optional',
      consoleUrl: 'https://developers.facebook.com/apps/',
      docsUrl: 'https://developers.facebook.com/docs/pages-api/',
      adminPath: '/admin/settings',
      setupHint: `Save App ID + Secret in Settings → Connectors. Redirect URI: ${metaRedirect}`,
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      description: 'Company page posts via LinkedIn Marketing API.',
      category: 'social',
      envKeys: ['LINKEDIN_CLIENT_ID', 'LINKEDIN_CLIENT_SECRET', 'LINKEDIN_REDIRECT_URI'],
      configured: hasLinkedInCredentials(),
      status: hasLinkedInCredentials() ? 'configured' : 'optional',
      consoleUrl: 'https://www.linkedin.com/developers/apps',
      docsUrl: 'https://learn.microsoft.com/en-us/linkedin/marketing/',
      adminPath: '/admin/settings',
      setupHint: `Save Client ID + Secret in Settings → Connectors. Redirect URI: ${linkedinRedirect}`,
    },
    {
      id: 'google',
      name: 'Google (YouTube + Business Profile)',
      description: 'YouTube uploads and Google Business Profile updates.',
      category: 'social',
      envKeys: ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REDIRECT_URI'],
      configured: hasGoogleCredentials(),
      status: hasGoogleCredentials() ? 'configured' : 'optional',
      consoleUrl: 'https://console.cloud.google.com/apis/credentials',
      docsUrl: 'https://developers.google.com/youtube/v3',
      adminPath: '/admin/settings',
      setupHint: `Save Client ID + Secret in Settings → Connectors. Redirect URI: ${googleRedirect}`,
    },
    {
      id: 'supabase',
      name: 'Supabase',
      description: 'Database, auth, blog studio, and newsletter subscribers.',
      category: 'database',
      envKeys: ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'],
      configured: hasEnv('NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'),
      status: envStatus(['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']),
      consoleUrl: 'https://supabase.com/dashboard',
      docsUrl: 'https://supabase.com/docs',
    },
  ]
}

export function getSocialConnectorSummary() {
  return {
    globalMode: getGlobalMode(),
    mockAllowed: isMockAllowed(),
    platforms: getCredentialStatuses(),
  }
}

export function getSocialConnectorSummaryResolved() {
  return {
    globalMode: getGlobalMode(),
    mockAllowed: isMockAllowed(),
    platforms: getCredentialStatuses(),
  }
}
