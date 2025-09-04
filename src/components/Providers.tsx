'use client'
import { AuthProvider } from '@/context/AuthContext'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: 'identified_only', 
    capture_pageview: false // pageviews are captured manually
  })
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider client={posthog}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </PostHogProvider>
  )
}