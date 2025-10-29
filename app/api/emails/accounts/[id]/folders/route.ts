import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { nylasClient } from '@/lib/nylas/client'

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

    // Fetch folders from Nylas
    const response = await nylasClient.folders.list({
      identifier: account.grant_id
    })

    const folders = response.data.map(folder => ({
      id: folder.id,
      name: folder.name,
      displayName: folder.displayName || folder.name,
      parentId: folder.parentId || null,
      attributes: folder.attributes || [],
      totalCount: folder.totalCount || 0,
      unreadCount: folder.unreadCount || 0
    }))

    return NextResponse.json({ folders })
  } catch (error: any) {
    console.error('Error fetching folders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch folders', details: error.message },
      { status: 500 }
    )
  }
}

