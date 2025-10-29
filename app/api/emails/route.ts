import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getEmails } from '@/lib/nylas/client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const folder = searchParams.get('folder') || 'inbox'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Get current user
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get user's Nylas account
    const { data: nylasAccount, error: accountError } = await supabase
      .from('nylas_accounts')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (accountError || !nylasAccount) {
      return NextResponse.json(
        { error: 'No email account connected', needsConnection: true },
        { status: 404 }
      )
    }

    // Fetch emails from Nylas
    const emails = await getEmails(nylasAccount.grant_id, {
      limit,
      offset,
      in: folder
    })

    return NextResponse.json({
      emails,
      account: {
        email: nylasAccount.email_address,
        provider: nylasAccount.provider
      }
    })
  } catch (error) {
    console.error('Error fetching emails:', error)
    return NextResponse.json(
      { error: 'Failed to fetch emails' },
      { status: 500 }
    )
  }
}

