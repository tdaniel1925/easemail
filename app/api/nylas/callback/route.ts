import { NextResponse } from 'next/server'
import { nylasClient } from '@/lib/nylas/client'
import { createClient } from '@/lib/supabase/server'
import { syncFoldersFromServer } from '@/lib/nylas/sync'

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
      clientId: process.env.NYLAS_CLIENT_ID!,
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

    // Detect provider from email or OAuth
    let provider = 'google' // default
    if (email?.includes('@outlook.com') || email?.includes('@hotmail.com') || email?.includes('@live.com')) {
      provider = 'microsoft'
    }

    // Check if this is the first account for this user
    const { data: existingAccounts } = await supabase
      .from('nylas_accounts')
      .select('id')
      .eq('user_id', user.id)

    const isFirstAccount = !existingAccounts || existingAccounts.length === 0

    // Save account to database
    const { data: savedAccount, error: dbError } = await supabase
      .from('nylas_accounts')
      .upsert({
        user_id: user.id,
        grant_id: grantId,
        email_address: email,
        provider: provider,
        is_default: isFirstAccount, // First account is default
        status: 'syncing',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'grant_id'
      })
      .select()
      .single()

    if (dbError || !savedAccount) {
      console.error('Error saving Nylas account:', dbError)
      throw dbError
    }

    const accountId = savedAccount.id

    // Sync folders from server (this populates the folder mappings table)
    try {
      await syncFoldersFromServer(accountId, grantId)
      console.log('Folders synced successfully for account:', accountId)
    } catch (syncError) {
      console.error('Error syncing folders:', syncError)
      // Continue even if sync fails - user can retry later
    }

    // Update account status to active
    await supabase
      .from('nylas_accounts')
      .update({ status: 'active' })
      .eq('id', accountId)

    // Redirect to emails page with modal trigger
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/emails?show_sync_config=true&account_id=${accountId}&email=${encodeURIComponent(email || '')}`
    )
  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/emails?error=connection_failed`
    )
  }
}

