import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const accountId = searchParams.get('account_id')
    const folderId = searchParams.get('folder_id')
    const unreadOnly = searchParams.get('unread') === 'true'
    const starredOnly = searchParams.get('starred') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build query
    let query = supabase
      .from('emails')
      .select(`
        *,
        account:nylas_accounts(id, email_address, provider),
        folder:nylas_folder_mappings(id, app_folder_name, server_folder_name)
      `)

    // Filter by user's accounts
    query = query.in('account_id', 
      supabase
        .from('nylas_accounts')
        .select('id')
        .eq('user_id', user.id)
    )

    // Filter by account
    if (accountId) {
      query = query.eq('account_id', accountId)
    }

    // Filter by folder
    if (folderId) {
      query = query.eq('folder_mapping_id', folderId)
    }

    // Filter by unread
    if (unreadOnly) {
      query = query.eq('unread', true)
    }

    // Filter by starred
    if (starredOnly) {
      query = query.eq('starred', true)
    }

    // Order by date descending
    query = query.order('date', { ascending: false })

    // Pagination
    query = query.range(offset, offset + limit - 1)

    const { data: emails, error, count } = await query

    if (error) {
      throw error
    }

    // Parse JSON fields
    const parsedEmails = (emails || []).map(email => ({
      ...email,
      from_email: typeof email.from_email === 'string' ? JSON.parse(email.from_email) : email.from_email,
      to_emails: typeof email.to_emails === 'string' ? JSON.parse(email.to_emails || '[]') : email.to_emails,
      cc_emails: email.cc_emails ? (typeof email.cc_emails === 'string' ? JSON.parse(email.cc_emails) : email.cc_emails) : null,
      bcc_emails: email.bcc_emails ? (typeof email.bcc_emails === 'string' ? JSON.parse(email.bcc_emails) : email.bcc_emails) : null,
      attachments: email.attachments ? (typeof email.attachments === 'string' ? JSON.parse(email.attachments) : email.attachments) : null,
    }))

    return NextResponse.json({
      emails: parsedEmails,
      total: count,
      limit,
      offset
    })
  } catch (error: any) {
    console.error('Error fetching emails:', error)
    return NextResponse.json(
      { error: 'Failed to fetch emails', details: error.message },
      { status: 500 }
    )
  }
}
