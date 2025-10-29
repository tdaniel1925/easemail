import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/nylas/client'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { to, subject, body: emailBody, cc, bcc } = body

    if (!to || !Array.isArray(to) || to.length === 0) {
      return NextResponse.json(
        { error: 'Recipients (to) are required' },
        { status: 400 }
      )
    }

    if (!subject) {
      return NextResponse.json(
        { error: 'Subject is required' },
        { status: 400 }
      )
    }

    if (!emailBody) {
      return NextResponse.json(
        { error: 'Email body is required' },
        { status: 400 }
      )
    }

    // Get current user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Get user's Nylas account
    const { data: nylasAccount } = await supabase
      .from('nylas_accounts')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!nylasAccount) {
      return NextResponse.json(
        { error: 'No email account connected' },
        { status: 404 }
      )
    }

    // Send email via Nylas
    const sent = await sendEmail(nylasAccount.grant_id, {
      to,
      subject,
      body: emailBody,
      cc,
      bcc
    })

    return NextResponse.json({ success: true, message: sent })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}

