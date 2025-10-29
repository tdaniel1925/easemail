import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getFolders } from '@/lib/nylas/client'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { data: nylasAccount } = await supabase
      .from('nylas_accounts')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!nylasAccount) {
      return NextResponse.json(
        { error: 'No email account connected', needsConnection: true },
        { status: 404 }
      )
    }

    const folders = await getFolders(nylasAccount.grant_id)

    return NextResponse.json({ folders })
  } catch (error) {
    console.error('Error fetching folders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch folders' },
      { status: 500 }
    )
  }
}

