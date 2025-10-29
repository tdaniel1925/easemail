import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateEmailStatus, moveEmailToFolder } from '@/lib/nylas/sync'

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

    const { data: email, error } = await supabase
      .from('emails')
      .select(`
        *,
        account:nylas_accounts(id, email_address, provider, grant_id),
        folder:nylas_folder_mappings(id, app_folder_name, server_folder_name)
      `)
      .eq('id', params.id)
      .single()

    if (error || !email) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 })
    }

    // Verify user owns this email
    if (email.account?.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Parse JSON fields
    const parsedEmail = {
      ...email,
      from_email: typeof email.from_email === 'string' ? JSON.parse(email.from_email) : email.from_email,
      to_emails: typeof email.to_emails === 'string' ? JSON.parse(email.to_emails || '[]') : email.to_emails,
      cc_emails: email.cc_emails ? (typeof email.cc_emails === 'string' ? JSON.parse(email.cc_emails) : email.cc_emails) : null,
      bcc_emails: email.bcc_emails ? (typeof email.bcc_emails === 'string' ? JSON.parse(email.bcc_emails) : email.bcc_emails) : null,
      attachments: email.attachments ? (typeof email.attachments === 'string' ? JSON.parse(email.attachments) : email.attachments) : null,
    }

    return NextResponse.json({ email: parsedEmail })
  } catch (error: any) {
    console.error('Error fetching email:', error)
    return NextResponse.json(
      { error: 'Failed to fetch email', details: error.message },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { unread, starred, folder_id } = body

    // Verify email exists and user owns it
    const { data: email } = await supabase
      .from('emails')
      .select('id, account:nylas_accounts(user_id)')
      .eq('id', params.id)
      .single()

    if (!email || email.account?.user_id !== user.id) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 })
    }

    // If moving to a folder
    if (folder_id) {
      await moveEmailToFolder(params.id, folder_id)
    }

    // If updating status
    if (unread !== undefined || starred !== undefined) {
      const updates: any = {}
      if (unread !== undefined) updates.unread = unread
      if (starred !== undefined) updates.starred = starred
      
      await updateEmailStatus(params.id, updates)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error updating email:', error)
    return NextResponse.json(
      { error: 'Failed to update email', details: error.message },
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

    // Verify email exists and user owns it
    const { data: email } = await supabase
      .from('emails')
      .select('id, account:nylas_accounts(user_id)')
      .eq('id', params.id)
      .single()

    if (!email || email.account?.user_id !== user.id) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 })
    }

    // Delete from database
    const { error } = await supabase
      .from('emails')
      .delete()
      .eq('id', params.id)

    if (error) {
      throw error
    }

    // TODO: Also delete from server if bidirectional_sync is enabled

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting email:', error)
    return NextResponse.json(
      { error: 'Failed to delete email', details: error.message },
      { status: 500 }
    )
  }
}

