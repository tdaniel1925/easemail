import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: account, error } = await supabase
      .from('nylas_accounts')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (error || !account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    return NextResponse.json({ account })
  } catch (error: any) {
    console.error('Error fetching account:', error)
    return NextResponse.json(
      { error: 'Failed to fetch account', details: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify ownership
    const { data: account } = await supabase
      .from('nylas_accounts')
      .select('id, is_default, email_address, provider')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    console.log(`🗑️ Deleting account: ${account.email_address} (${account.provider})`)

    // Get counts before deletion for logging
    const { count: folderCount } = await supabase
      .from('nylas_folder_mappings')
      .select('*', { count: 'exact', head: true })
      .eq('account_id', params.id)

    const { count: emailCount } = await supabase
      .from('emails')
      .select('*', { count: 'exact', head: true })
      .eq('account_id', params.id)

    const { count: attachmentCount } = await supabase
      .from('email_attachments')
      .select('*', { count: 'exact', head: true })
      .in('email_id', 
        supabase.from('emails').select('id').eq('account_id', params.id)
      )

    console.log(`📊 Data to be deleted:`)
    console.log(`  - ${folderCount || 0} folders`)
    console.log(`  - ${emailCount || 0} emails`)
    console.log(`  - ${attachmentCount || 0} attachments`)

    // Delete account - CASCADE will automatically delete:
    // - nylas_folder_mappings (via account_id FK)
    // - emails (via account_id FK)
    // - email_attachments (via email_id FK from emails)
    // - sync_logs (via account_id FK)
    const { error } = await supabase
      .from('nylas_accounts')
      .delete()
      .eq('id', params.id)

    if (error) {
      throw error
    }

    console.log(`✅ Account deleted successfully`)
    console.log(`   Cascade deleted: ${folderCount || 0} folders, ${emailCount || 0} emails, ${attachmentCount || 0} attachments`)

    // If this was the default account, set another one as default
    if (account.is_default) {
      const { data: otherAccounts } = await supabase
        .from('nylas_accounts')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)

      if (otherAccounts && otherAccounts.length > 0) {
        await supabase
          .from('nylas_accounts')
          .update({ is_default: true })
          .eq('id', otherAccounts[0].id)
        
        console.log(`✅ Set new default account: ${otherAccounts[0].id}`)
      }
    }

    return NextResponse.json({ 
      success: true,
      deleted: {
        account: account.email_address,
        folders: folderCount || 0,
        emails: emailCount || 0,
        attachments: attachmentCount || 0
      }
    })
  } catch (error: any) {
    console.error('❌ Error deleting account:', error)
    return NextResponse.json(
      { error: 'Failed to delete account', details: error.message },
      { status: 500 }
    )
  }
}

