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

    // Verify account ownership
    const { data: account } = await supabase
      .from('nylas_accounts')
      .select('id')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    // Get only enabled folder mappings
    const { data: folders, error } = await supabase
      .from('nylas_folder_mappings')
      .select('*')
      .eq('account_id', params.id)
      .eq('enabled', true)
      .order('sort_order, app_folder_name')

    if (error) {
      throw error
    }

    return NextResponse.json({ folders: folders || [] })
  } catch (error: any) {
    console.error('Error fetching mapped folders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch mapped folders', details: error.message },
      { status: 500 }
    )
  }
}

