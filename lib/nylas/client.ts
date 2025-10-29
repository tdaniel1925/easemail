import Nylas from 'nylas'

if (!process.env.NYLAS_API_KEY) {
  throw new Error('NYLAS_API_KEY is not set in environment variables')
}

export const nylasClient = new Nylas({
  apiKey: process.env.NYLAS_API_KEY,
  apiUri: process.env.NYLAS_API_URI || 'https://api.us.nylas.com'
})

// Helper to get emails
export async function getEmails(grantId: string, params?: {
  limit?: number
  offset?: number
  in?: string // folder name like 'inbox', 'sent', etc.
}) {
  const response = await nylasClient.messages.list({
    identifier: grantId,
    queryParams: {
      limit: params?.limit || 50,
      offset: params?.offset || 0,
      in: params?.in || 'inbox'
    }
  })
  
  return response.data
}

// Helper to get folders
export async function getFolders(grantId: string) {
  const response = await nylasClient.folders.list({
    identifier: grantId
  })
  
  return response.data
}

// Helper to send email
export async function sendEmail(grantId: string, email: {
  to: string[]
  subject: string
  body: string
  cc?: string[]
  bcc?: string[]
}) {
  const draft = await nylasClient.drafts.create({
    identifier: grantId,
    requestBody: {
      to: email.to.map(e => ({ email: e })),
      subject: email.subject,
      body: email.body,
      cc: email.cc?.map(e => ({ email: e })),
      bcc: email.bcc?.map(e => ({ email: e }))
    }
  })

  const sent = await nylasClient.drafts.send({
    identifier: grantId,
    draftId: draft.data.id
  })

  return sent.data
}

// Helper to get a single message
export async function getMessage(grantId: string, messageId: string) {
  const response = await nylasClient.messages.find({
    identifier: grantId,
    messageId
  })
  
  return response.data
}

// Helper to update message (mark as read, starred, etc.)
export async function updateMessage(grantId: string, messageId: string, updates: {
  unread?: boolean
  starred?: boolean
  folders?: string[]
}) {
  const response = await nylasClient.messages.update({
    identifier: grantId,
    messageId,
    requestBody: updates
  })
  
  return response.data
}

