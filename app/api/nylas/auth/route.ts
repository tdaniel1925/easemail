import { NextResponse } from 'next/server'
import { nylasClient } from '@/lib/nylas/client'

export async function GET() {
  try {
    const config = {
      clientId: process.env.NYLAS_CLIENT_ID!,
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/nylas/callback`,
      // You can add provider: 'google' or 'microsoft' to pre-select
      scopes: [
        'email.read_only',
        'email.send',
        'email.drafts',
        'email.folders',
        'contacts.read_only',
        'calendar.read_only'
      ]
    }

    const authUrl = nylasClient.auth.urlForOAuth2(config)
    
    return NextResponse.redirect(authUrl)
  } catch (error) {
    console.error('Error generating auth URL:', error)
    return NextResponse.json(
      { error: 'Failed to generate auth URL' },
      { status: 500 }
    )
  }
}

