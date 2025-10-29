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
      .select('id, is_default')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    // Delete account (cascades to folders and emails via database constraints)
    const { error } = await supabase
      .from('nylas_accounts')
      .delete()
      .eq('id', params.id)

    if (error) {
      throw error
    }

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
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting account:', error)
    return NextResponse.json(
      { error: 'Failed to delete account', details: error.message },
      { status: 500 }
    )
  }
}

