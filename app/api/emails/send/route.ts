import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendEmail as nylassendEmail } from '@/lib/nylas/client'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { account_id, to, cc, bcc, subject, body: emailBody, reply_to_message_id } = body

    // Validate required fields
    if (!account_id || !to || to.length === 0 || !subject) {
      return NextResponse.json(
        { error: 'Missing required fields: account_id, to, subject' },
        { status: 400 }
      )
    }

    // Get account
    const { data: account } = await supabase
      .from('nylas_accounts')
      .select('*')
      .eq('id', account_id)
      .eq('user_id', user.id)
      .single()

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    // Send email via Nylas
    const sentEmail = await nylassendEmail(account.grant_id, {
      to,
      cc,
      bcc,
      subject,
      body: emailBody
    })

    // Save sent email to database
    const { data: savedEmail } = await supabase
      .from('emails')
      .insert({
        account_id: account.id,
        message_id: sentEmail.id,
        thread_id: sentEmail.threadId || sentEmail.id,
        subject,
        from_email: JSON.stringify([{ email: account.email_address }]),
        to_emails: JSON.stringify(to.map((email: string) => ({ email }))),
        cc_emails: cc ? JSON.stringify(cc.map((email: string) => ({ email }))) : null,
        bcc_emails: bcc ? JSON.stringify(bcc.map((email: string) => ({ email }))) : null,
        body_text: emailBody,
        snippet: emailBody.substring(0, 200),
        date: new Date().toISOString(),
        unread: false,
        starred: false,
        has_attachments: false
      })
      .select()
      .single()

    return NextResponse.json({
      success: true,
      email: savedEmail
    })
  } catch (error: any) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Failed to send email', details: error.message },
      { status: 500 }
    )
  }
}
