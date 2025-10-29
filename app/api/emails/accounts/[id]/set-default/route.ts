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

    // Verify ownership
    const { data: account } = await supabase
      .from('nylas_accounts')
      .select('id')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    // Unset all other accounts as default
    await supabase
      .from('nylas_accounts')
      .update({ is_default: false })
      .eq('user_id', user.id)

    // Set this account as default
    const { error } = await supabase
      .from('nylas_accounts')
      .update({ is_default: true })
      .eq('id', params.id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error setting default account:', error)
    return NextResponse.json(
      { error: 'Failed to set default account', details: error.message },
      { status: 500 }
    )
  }
}

