import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

    const { mappings } = await request.json()

    if (!mappings || !Array.isArray(mappings)) {
      return NextResponse.json({ error: 'Invalid mappings data' }, { status: 400 })
    }

    // Prepare folder mappings for database
    const folderMappings = mappings.map((mapping: any) => ({
      account_id: params.id,
      server_folder_id: mapping.serverFolderId,
      server_folder_name: mapping.serverFolderName,
      app_folder_name: mapping.appFolderName,
      enabled: mapping.enabled,
      bidirectional_sync: mapping.bidirectionalSync,
      updated_at: new Date().toISOString()
    }))

    // Upsert folder mappings
    const { error } = await supabase
      .from('nylas_folder_mappings')
      .upsert(folderMappings, {
        onConflict: 'account_id,server_folder_id',
        ignoreDuplicates: false
      })

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error saving folder mappings:', error)
    return NextResponse.json(
      { error: 'Failed to save folder mappings', details: error.message },
      { status: 500 }
    )
  }
}

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

    // Get folder mappings
    const { data: mappings, error } = await supabase
      .from('nylas_folder_mappings')
      .select('*')
      .eq('account_id', params.id)
      .order('sort_order, app_folder_name')

    if (error) {
      throw error
    }

    return NextResponse.json({ mappings: mappings || [] })
  } catch (error: any) {
    console.error('Error fetching folder mappings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch folder mappings', details: error.message },
      { status: 500 }
    )
  }
}

