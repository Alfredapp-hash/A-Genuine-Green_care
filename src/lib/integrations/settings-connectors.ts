export type ConnectorAuthType = 'api_key' | 'oauth'

export type SettingsConnectorDef = {
  id: string
  name: string
  description: string
  authType: ConnectorAuthType
  category: 'email' | 'ai' | 'social' | 'content'
  secretFields?: Array<{ connectorId: string; label: string; placeholder?: string }>
  oauthPlatforms?: Array<{ platform: string; label: string }>
  consoleUrl: string
  docsUrl?: string
  testable?: boolean
}

export const SETTINGS_CONNECTORS: SettingsConnectorDef[] = [
  {
    id: 'resend',
    name: 'Resend',
    description: 'Transactional email — contact forms, parent communications, newsletter signups.',
    authType: 'api_key',
    category: 'email',
    secretFields: [{ connectorId: 'resend', label: 'API Key', placeholder: 're_...' }],
    consoleUrl: 'https://resend.com/api-keys',
    docsUrl: 'https://resend.com/docs/dashboard/domains/introduction',
    testable: true,
  },
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'AI Command Center — blog, SEO, and content drafts.',
    authType: 'api_key',
    category: 'ai',
    secretFields: [{ connectorId: 'openai', label: 'API Key', placeholder: 'sk-...' }],
    consoleUrl: 'https://platform.openai.com/api-keys',
    docsUrl: 'https://platform.openai.com/docs/guides/text',
    testable: true,
  },
  {
    id: 'meta',
    name: 'Meta (Facebook & Instagram)',
    description: 'Connect your Facebook Page and Instagram Business account via OAuth.',
    authType: 'oauth',
    category: 'social',
    secretFields: [
      { connectorId: 'meta_app_id', label: 'App ID' },
      { connectorId: 'meta_app_secret', label: 'App Secret', placeholder: '••••••••' },
    ],
    oauthPlatforms: [
      { platform: 'facebook', label: 'Connect Facebook Page' },
      { platform: 'instagram', label: 'Connect Instagram Business' },
    ],
    consoleUrl: 'https://developers.facebook.com/apps/',
    docsUrl: 'https://developers.facebook.com/docs/pages-api/',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Publish to your LinkedIn Company Page.',
    authType: 'oauth',
    category: 'social',
    secretFields: [
      { connectorId: 'linkedin_client_id', label: 'Client ID' },
      { connectorId: 'linkedin_client_secret', label: 'Client Secret' },
    ],
    oauthPlatforms: [{ platform: 'linkedin', label: 'Connect LinkedIn Page' }],
    consoleUrl: 'https://www.linkedin.com/developers/apps',
    docsUrl: 'https://learn.microsoft.com/en-us/linkedin/marketing/',
  },
  {
    id: 'google',
    name: 'Google (YouTube & Business Profile)',
    description: 'YouTube uploads and Google Business Profile posts.',
    authType: 'oauth',
    category: 'social',
    secretFields: [
      { connectorId: 'google_client_id', label: 'Client ID' },
      { connectorId: 'google_client_secret', label: 'Client Secret' },
    ],
    oauthPlatforms: [
      { platform: 'youtube', label: 'Connect YouTube Channel' },
      { platform: 'google_business_profile', label: 'Connect Google Business Profile' },
    ],
    consoleUrl: 'https://console.cloud.google.com/apis/credentials',
    docsUrl: 'https://developers.google.com/youtube/v3',
  },
  {
    id: 'canva',
    name: 'Canva',
    description:
      'Import designs from Canva into Blog Studio and Social campaigns. Uses OAuth — create a Connect API integration in the Canva Developer Portal.',
    authType: 'oauth',
    category: 'content',
    secretFields: [
      { connectorId: 'canva_client_id', label: 'Client ID' },
      { connectorId: 'canva_client_secret', label: 'Client Secret', placeholder: '••••••••' },
    ],
    oauthPlatforms: [{ platform: 'canva', label: 'Connect Canva account' }],
    consoleUrl: 'https://www.canva.com/developers/',
    docsUrl: 'https://www.canva.dev/docs/connect/authentication/',
    testable: true,
  },
]

export function getSiteRedirectUri(platform: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://saltwatersprouts.com'
  if (platform === 'canva') {
    return `${base}/api/canva/oauth/callback`
  }
  return `${base}/api/social/oauth/${platform}/callback`
}
