import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { syncEmailsForFolders } from '@/lib/nylas/sync'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const { syncOnlyMapped, folderIds } = body

    // Get account
    const { data: account } = await supabase
      .from('nylas_accounts')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    // Update status to syncing
    await supabase
      .from('nylas_accounts')
      .update({ status: 'syncing' })
      .eq('id', params.id)

    // Trigger sync
    const result = await syncEmailsForFolders(account.id, account.grant_id, {
      syncOnlyMapped,
      folderIds
    })

    // Update status based on result
    await supabase
      .from('nylas_accounts')
      .update({
        status: result.success ? 'active' : 'error',
        last_synced_at: new Date().toISOString()
      })
      .eq('id', params.id)

    return NextResponse.json({
      success: result.success,
      foldersSynced: result.foldersSynced,
      emailsSynced: result.emailsSynced,
      errors: result.errors
    })
  } catch (error: any) {
    console.error('Error syncing account:', error)
    
    // Update status to error
    const supabase = await createClient()
    await supabase
      .from('nylas_accounts')
      .update({ status: 'error' })
      .eq('id', params.id)

    return NextResponse.json(
      { error: 'Failed to sync account', details: error.message },
      { status: 500 }
    )
  }
}

