import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all accounts for the user
    const { data: accounts, error } = await supabase
      .from('nylas_accounts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    // Get folder and email counts for each account
    const accountsWithCounts = await Promise.all(
      (accounts || []).map(async (account) => {
        // Get folder count
        const { count: folderCount } = await supabase
          .from('nylas_folder_mappings')
          .select('*', { count: 'exact', head: true })
          .eq('account_id', account.id)
          .eq('enabled', true)

        // Get email count
        const { count: emailCount } = await supabase
          .from('emails')
          .select('*', { count: 'exact', head: true })
          .eq('account_id', account.id)

        return {
          ...account,
          folderCount: folderCount || 0,
          emailCount: emailCount || 0
        }
      })
    )

    return NextResponse.json({ accounts: accountsWithCounts })
  } catch (error: any) {
    console.error('Error fetching accounts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch accounts', details: error.message },
      { status: 500 }
    )
  }
}

