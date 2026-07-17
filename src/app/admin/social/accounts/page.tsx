import { Suspense } from 'react'
import SocialAccountsPage from '@/features/social/SocialAccountsPage'

export default function AdminSocialAccountsPage() {
  return (
    <Suspense>
      <SocialAccountsPage />
    </Suspense>
  )
}
