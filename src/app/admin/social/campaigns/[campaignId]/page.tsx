'use client'
import { useParams, notFound } from 'next/navigation'
import { getSocialCampaignById } from '@/features/social/socialStore'
import SocialCampaignEditor from '@/features/social/components/SocialCampaignEditor'

export default function CampaignEditorPage() {
  const { campaignId } = useParams() as { campaignId: string }
  const campaign = getSocialCampaignById(campaignId)
  if (!campaign) return notFound()
  return <SocialCampaignEditor initialCampaign={campaign} />
}
