import { NextResponse } from 'next/server'
import { nylasClient } from '@/lib/nylas/client'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/emails?error=no_code`
      )
    }

    // Exchange code for grant
    const response = await nylasClient.auth.exchangeCodeForToken({
      code,
      clientId: process.env.NYLAS_API_KEY!,
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/nylas/callback`
    })

    const { grantId, email } = response

    // Get current user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/login?error=not_authenticated`
      )
    }

    // Save to database
    const { error: dbError } = await supabase
      .from('nylas_accounts')
      .upsert({
        user_id: user.id,
        grant_id: grantId,
        email_address: email,
        provider: 'google', // You can detect this from the auth flow
        updated_at: new Date().toISOString()
      })

    if (dbError) {
      console.error('Error saving Nylas account:', dbError)
      throw dbError
    }

    // Redirect to emails page
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/emails?connected=true`
    )
  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/emails?error=connection_failed`
    )
  }
}

