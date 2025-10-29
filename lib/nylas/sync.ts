import { nylasClient } from './client'
import { createClient } from '@/lib/supabase/server'

// =============================================================================
// TYPES
// =============================================================================

export interface SyncOptions {
  folderIds?: string[]
  limit?: number
  syncOnlyMapped?: boolean
}

export interface SyncResult {
  success: boolean
  foldersSynced: number
  emailsSynced: number
  errors: string[]
}

// =============================================================================
// FOLDER SYNCING
// =============================================================================

/**
 * Sync all folders from the email server (Gmail/Outlook/IMAP) to database
 */
export async function syncFoldersFromServer(
  accountId: string,
  grantId: string
): Promise<void> {
  try {
    const supabase = await createClient()

    // Fetch folders from Nylas
    const response = await nylasClient.folders.list({
      identifier: grantId
    })

    if (!response.data || response.data.length === 0) {
      console.log('No folders found for account:', accountId)
      return
    }

    // Process and categorize folders
    const folderMappings = response.data.map(folder => {
      const folderType = categorizeFolder(folder.attributes || [])
      const isSystem = folderType === 'system'

      return {
        account_id: accountId,
        server_folder_id: folder.id,
        server_folder_name: folder.name,
        app_folder_name: folder.displayName || folder.name,
        parent_id: folder.parentId || null,
        folder_type: folderType,
        attributes: folder.attributes || [],
        total_count: folder.totalCount || 0,
        unread_count: folder.unreadCount || 0,
        enabled: true, // Default: all folders enabled
        bidirectional_sync: isSystem, // Only system folders sync back by default
        sort_order: isSystem ? getSortOrder(folder.attributes) : 999
      }
    })

    // Upsert folders to database
    const { error } = await supabase
      .from('nylas_folder_mappings')
      .upsert(folderMappings, {
        onConflict: 'account_id,server_folder_id',
        ignoreDuplicates: false
      })

    if (error) {
      console.error('Error syncing folders:', error)
      throw error
    }

    console.log(`Synced ${folderMappings.length} folders for account ${accountId}`)
  } catch (error) {
    console.error('Failed to sync folders:', error)
    throw error
  }
}

/**
 * Sync emails for specific folders
 */
export async function syncEmailsForFolders(
  accountId: string,
  grantId: string,
  options: SyncOptions = {}
): Promise<SyncResult> {
  const supabase = await createClient()
  const errors: string[] = []
  let emailsSynced = 0
  let foldersSynced = 0

  try {
    // Create sync log
    const { data: syncLog } = await supabase
      .from('sync_logs')
      .insert({
        account_id: accountId,
        sync_type: options.syncOnlyMapped ? 'initial' : 'incremental',
        status: 'started'
      })
      .select()
      .single()

    // Get folder mappings to sync
    let query = supabase
      .from('nylas_folder_mappings')
      .select('*')
      .eq('account_id', accountId)
      .eq('enabled', true)

    if (options.folderIds && options.folderIds.length > 0) {
      query = query.in('server_folder_id', options.folderIds)
    }

    const { data: folders, error: foldersError } = await query

    if (foldersError) {
      throw foldersError
    }

    if (!folders || folders.length === 0) {
      console.log('No folders to sync for account:', accountId)
      return { success: true, foldersSynced: 0, emailsSynced: 0, errors: [] }
    }

    // Sync emails for each folder
    for (const folder of folders) {
      try {
        console.log(`Syncing folder: ${folder.app_folder_name}`)

        const emails = await nylasClient.messages.list({
          identifier: grantId,
          queryParams: {
            in: folder.server_folder_id,
            limit: options.limit || 100
          }
        })

        if (emails.data && emails.data.length > 0) {
          // Transform and save emails
          const emailRecords = emails.data.map(email => ({
            account_id: accountId,
            folder_mapping_id: folder.id,
            message_id: email.id,
            thread_id: email.threadId || email.id,
            subject: email.subject || '(No Subject)',
            from_email: email.from ? JSON.stringify(email.from) : null,
            to_emails: email.to ? JSON.stringify(email.to) : null,
            cc_emails: email.cc ? JSON.stringify(email.cc) : null,
            bcc_emails: email.bcc ? JSON.stringify(email.bcc) : null,
            body_text: email.body,
            snippet: email.snippet,
            date: new Date(email.date * 1000).toISOString(),
            unread: email.unread ?? true,
            starred: email.starred ?? false,
            has_attachments: (email.attachments?.length || 0) > 0,
            attachments: email.attachments ? JSON.stringify(email.attachments) : null,
            labels: email.labels || []
          }))

          // Upsert emails
          const { error: emailsError } = await supabase
            .from('emails')
            .upsert(emailRecords, {
              onConflict: 'message_id',
              ignoreDuplicates: false
            })

          if (emailsError) {
            errors.push(`Error syncing emails for folder ${folder.app_folder_name}: ${emailsError.message}`)
            continue
          }

          emailsSynced += emailRecords.length
        }

        // Update folder sync timestamp and counts
        await supabase
          .from('nylas_folder_mappings')
          .update({
            last_synced_at: new Date().toISOString(),
            total_count: emails.data?.length || 0
          })
          .eq('id', folder.id)

        foldersSynced++
      } catch (folderError: any) {
        errors.push(`Error syncing folder ${folder.app_folder_name}: ${folderError.message}`)
        console.error('Folder sync error:', folderError)
      }
    }

    // Update sync log
    if (syncLog) {
      await supabase
        .from('sync_logs')
        .update({
          status: errors.length > 0 ? 'completed' : 'completed',
          folders_synced: foldersSynced,
          emails_synced: emailsSynced,
          errors: errors.length > 0 ? JSON.stringify(errors) : null,
          completed_at: new Date().toISOString()
        })
        .eq('id', syncLog.id)
    }

    // Update account last synced
    await supabase
      .from('nylas_accounts')
      .update({
        last_synced_at: new Date().toISOString(),
        status: 'active'
      })
      .eq('id', accountId)

    return {
      success: errors.length === 0,
      foldersSynced,
      emailsSynced,
      errors
    }
  } catch (error: any) {
    console.error('Failed to sync emails:', error)
    return {
      success: false,
      foldersSynced: 0,
      emailsSynced: 0,
      errors: [error.message]
    }
  }
}

/**
 * Sync a single email by message ID
 */
export async function syncSingleEmail(
  accountId: string,
  grantId: string,
  messageId: string
): Promise<void> {
  try {
    const supabase = await createClient()

    const message = await nylasClient.messages.find({
      identifier: grantId,
      messageId
    })

    if (!message.data) {
      throw new Error('Email not found')
    }

    const email = message.data

    // Find folder mapping
    const { data: folder } = await supabase
      .from('nylas_folder_mappings')
      .select('id')
      .eq('account_id', accountId)
      .limit(1)
      .single()

    await supabase
      .from('emails')
      .upsert({
        account_id: accountId,
        folder_mapping_id: folder?.id || null,
        message_id: email.id,
        thread_id: email.threadId || email.id,
        subject: email.subject || '(No Subject)',
        from_email: JSON.stringify(email.from),
        to_emails: JSON.stringify(email.to),
        cc_emails: email.cc ? JSON.stringify(email.cc) : null,
        bcc_emails: email.bcc ? JSON.stringify(email.bcc) : null,
        body_text: email.body,
        snippet: email.snippet,
        date: new Date(email.date * 1000).toISOString(),
        unread: email.unread ?? true,
        starred: email.starred ?? false,
        has_attachments: (email.attachments?.length || 0) > 0,
        attachments: email.attachments ? JSON.stringify(email.attachments) : null,
      }, {
        onConflict: 'message_id'
      })
  } catch (error) {
    console.error('Failed to sync single email:', error)
    throw error
  }
}

// =============================================================================
// BIDIRECTIONAL SYNC
// =============================================================================

/**
 * Move email to folder (with bidirectional sync if enabled)
 */
export async function moveEmailToFolder(
  emailId: string,
  newFolderId: string
): Promise<void> {
  try {
    const supabase = await createClient()

    // Get email and folder details
    const { data: email } = await supabase
      .from('emails')
      .select('*, account:nylas_accounts(*)')
      .eq('id', emailId)
      .single()

    const { data: folder } = await supabase
      .from('nylas_folder_mappings')
      .select('*')
      .eq('id', newFolderId)
      .single()

    if (!email || !folder) {
      throw new Error('Email or folder not found')
    }

    // Update locally
    await supabase
      .from('emails')
      .update({ folder_mapping_id: newFolderId })
      .eq('id', emailId)

    // If bidirectional sync enabled, update on server
    if (folder.bidirectional_sync && email.account) {
      await nylasClient.messages.update({
        identifier: email.account.grant_id,
        messageId: email.message_id,
        requestBody: {
          folders: [folder.server_folder_id]
        }
      })
    }
  } catch (error) {
    console.error('Failed to move email:', error)
    throw error
  }
}

/**
 * Update email status (read/unread, starred, etc.)
 */
export async function updateEmailStatus(
  emailId: string,
  updates: {
    unread?: boolean
    starred?: boolean
  }
): Promise<void> {
  try {
    const supabase = await createClient()

    // Get email and folder details
    const { data: email } = await supabase
      .from('emails')
      .select('*, account:nylas_accounts(*), folder:nylas_folder_mappings(*)')
      .eq('id', emailId)
      .single()

    if (!email) {
      throw new Error('Email not found')
    }

    // Update locally
    await supabase
      .from('emails')
      .update(updates)
      .eq('id', emailId)

    // If bidirectional sync enabled, update on server
    if (email.folder?.bidirectional_sync && email.account) {
      await nylasClient.messages.update({
        identifier: email.account.grant_id,
        messageId: email.message_id,
        requestBody: updates
      })
    }
  } catch (error) {
    console.error('Failed to update email status:', error)
    throw error
  }
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Categorize folder based on attributes
 */
function categorizeFolder(attributes: string[]): 'system' | 'custom' | 'nested' {
  const systemAttrs = ['inbox', 'sent', 'drafts', 'trash', 'spam', 'archive', 'all']
  const hasSystemAttr = attributes.some(attr =>
    systemAttrs.includes(attr.toLowerCase())
  )

  if (hasSystemAttr) {
    return 'system'
  }

  return 'custom'
}

/**
 * Get sort order for system folders
 */
function getSortOrder(attributes: string[]): number {
  const attr = attributes[0]?.toLowerCase()
  const order: Record<string, number> = {
    'inbox': 1,
    'sent': 2,
    'drafts': 3,
    'archive': 4,
    'spam': 5,
    'trash': 6,
    'all': 7
  }
  return order[attr] || 999
}

/**
 * Check if folder is a system folder
 */
export function isSystemFolder(attributes: string[]): boolean {
  return categorizeFolder(attributes) === 'system'
}

