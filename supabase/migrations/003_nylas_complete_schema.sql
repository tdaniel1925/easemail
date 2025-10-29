-- Complete Nylas Email Integration Schema
-- Migration: 003_nylas_complete_schema

-- =============================================================================
-- 1. NYLAS ACCOUNTS TABLE (Updated)
-- =============================================================================
-- Drop existing table if exists
DROP TABLE IF EXISTS nylas_accounts CASCADE;

CREATE TABLE nylas_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  grant_id TEXT UNIQUE NOT NULL,
  email_address TEXT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('google', 'microsoft', 'imap')),
  is_default BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'syncing', 'error', 'disconnected')),
  sync_status JSONB DEFAULT '{}',
  last_synced_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================================================
-- 2. FOLDER MAPPINGS TABLE
-- =============================================================================
CREATE TABLE nylas_folder_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES nylas_accounts(id) ON DELETE CASCADE,
  server_folder_id TEXT NOT NULL,
  server_folder_name TEXT NOT NULL,
  app_folder_name TEXT NOT NULL,
  parent_id TEXT,
  folder_type TEXT CHECK (folder_type IN ('system', 'custom', 'nested')),
  enabled BOOLEAN DEFAULT true,
  bidirectional_sync BOOLEAN DEFAULT false,
  unread_count INTEGER DEFAULT 0,
  total_count INTEGER DEFAULT 0,
  attributes TEXT[],
  last_synced_at TIMESTAMP,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_account_folder UNIQUE(account_id, server_folder_id)
);

-- =============================================================================
-- 3. EMAILS TABLE
-- =============================================================================
CREATE TABLE emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES nylas_accounts(id) ON DELETE CASCADE,
  folder_mapping_id UUID REFERENCES nylas_folder_mappings(id) ON DELETE SET NULL,
  message_id TEXT UNIQUE NOT NULL,
  thread_id TEXT,
  subject TEXT,
  from_email JSONB NOT NULL,
  to_emails JSONB,
  cc_emails JSONB,
  bcc_emails JSONB,
  reply_to JSONB,
  body_text TEXT,
  body_html TEXT,
  snippet TEXT,
  date TIMESTAMP NOT NULL,
  unread BOOLEAN DEFAULT true,
  starred BOOLEAN DEFAULT false,
  has_attachments BOOLEAN DEFAULT false,
  attachments JSONB,
  labels TEXT[],
  headers JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================================================
-- 4. EMAIL ATTACHMENTS TABLE
-- =============================================================================
CREATE TABLE email_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_id UUID NOT NULL REFERENCES emails(id) ON DELETE CASCADE,
  attachment_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  content_type TEXT,
  size INTEGER,
  is_inline BOOLEAN DEFAULT false,
  content_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================================================
-- 5. SYNC LOGS TABLE
-- =============================================================================
CREATE TABLE sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES nylas_accounts(id) ON DELETE CASCADE,
  sync_type TEXT CHECK (sync_type IN ('initial', 'incremental', 'manual', 'webhook')),
  status TEXT CHECK (status IN ('started', 'in_progress', 'completed', 'failed')),
  folders_synced INTEGER DEFAULT 0,
  emails_synced INTEGER DEFAULT 0,
  errors JSONB,
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Accounts indexes
CREATE INDEX idx_accounts_user ON nylas_accounts(user_id);
CREATE INDEX idx_accounts_user_default ON nylas_accounts(user_id, is_default) WHERE is_default = true;
CREATE INDEX idx_accounts_status ON nylas_accounts(status);
CREATE INDEX idx_accounts_grant ON nylas_accounts(grant_id);

-- Folder mappings indexes
CREATE INDEX idx_folder_mappings_account ON nylas_folder_mappings(account_id);
CREATE INDEX idx_folder_mappings_enabled ON nylas_folder_mappings(account_id, enabled) WHERE enabled = true;
CREATE INDEX idx_folder_mappings_type ON nylas_folder_mappings(folder_type);
CREATE INDEX idx_folder_mappings_server_id ON nylas_folder_mappings(server_folder_id);

-- Emails indexes
CREATE INDEX idx_emails_account ON emails(account_id);
CREATE INDEX idx_emails_folder ON emails(folder_mapping_id);
CREATE INDEX idx_emails_account_date ON emails(account_id, date DESC);
CREATE INDEX idx_emails_account_unread ON emails(account_id, unread) WHERE unread = true;
CREATE INDEX idx_emails_account_starred ON emails(account_id, starred) WHERE starred = true;
CREATE INDEX idx_emails_thread ON emails(thread_id);
CREATE INDEX idx_emails_message ON emails(message_id);

-- Attachments indexes
CREATE INDEX idx_attachments_email ON email_attachments(email_id);

-- Sync logs indexes
CREATE INDEX idx_sync_logs_account ON sync_logs(account_id);
CREATE INDEX idx_sync_logs_status ON sync_logs(status);
CREATE INDEX idx_sync_logs_started ON sync_logs(started_at DESC);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE nylas_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE nylas_folder_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;

-- Accounts policies
CREATE POLICY "Users can view their own accounts"
  ON nylas_accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own accounts"
  ON nylas_accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own accounts"
  ON nylas_accounts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own accounts"
  ON nylas_accounts FOR DELETE
  USING (auth.uid() = user_id);

-- Folder mappings policies
CREATE POLICY "Users can view their account folders"
  ON nylas_folder_mappings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM nylas_accounts
      WHERE nylas_accounts.id = nylas_folder_mappings.account_id
      AND nylas_accounts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their account folders"
  ON nylas_folder_mappings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM nylas_accounts
      WHERE nylas_accounts.id = nylas_folder_mappings.account_id
      AND nylas_accounts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their account folders"
  ON nylas_folder_mappings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM nylas_accounts
      WHERE nylas_accounts.id = nylas_folder_mappings.account_id
      AND nylas_accounts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their account folders"
  ON nylas_folder_mappings FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM nylas_accounts
      WHERE nylas_accounts.id = nylas_folder_mappings.account_id
      AND nylas_accounts.user_id = auth.uid()
    )
  );

-- Emails policies
CREATE POLICY "Users can view their emails"
  ON emails FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM nylas_accounts
      WHERE nylas_accounts.id = emails.account_id
      AND nylas_accounts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their emails"
  ON emails FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM nylas_accounts
      WHERE nylas_accounts.id = emails.account_id
      AND nylas_accounts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their emails"
  ON emails FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM nylas_accounts
      WHERE nylas_accounts.id = emails.account_id
      AND nylas_accounts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their emails"
  ON emails FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM nylas_accounts
      WHERE nylas_accounts.id = emails.account_id
      AND nylas_accounts.user_id = auth.uid()
    )
  );

-- Email attachments policies
CREATE POLICY "Users can view their email attachments"
  ON email_attachments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM emails
      JOIN nylas_accounts ON nylas_accounts.id = emails.account_id
      WHERE emails.id = email_attachments.email_id
      AND nylas_accounts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their email attachments"
  ON email_attachments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM emails
      JOIN nylas_accounts ON nylas_accounts.id = emails.account_id
      WHERE emails.id = email_attachments.email_id
      AND nylas_accounts.user_id = auth.uid()
    )
  );

-- Sync logs policies
CREATE POLICY "Users can view their sync logs"
  ON sync_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM nylas_accounts
      WHERE nylas_accounts.id = sync_logs.account_id
      AND nylas_accounts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their sync logs"
  ON sync_logs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM nylas_accounts
      WHERE nylas_accounts.id = sync_logs.account_id
      AND nylas_accounts.user_id = auth.uid()
    )
  );

-- =============================================================================
-- FUNCTIONS AND TRIGGERS
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_nylas_accounts_updated_at
  BEFORE UPDATE ON nylas_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_folder_mappings_updated_at
  BEFORE UPDATE ON nylas_folder_mappings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_emails_updated_at
  BEFORE UPDATE ON emails
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to ensure only one default account per user
CREATE OR REPLACE FUNCTION ensure_single_default_account()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default = true THEN
    UPDATE nylas_accounts
    SET is_default = false
    WHERE user_id = NEW.user_id
    AND id != NEW.id
    AND is_default = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_default_account_trigger
  BEFORE INSERT OR UPDATE ON nylas_accounts
  FOR EACH ROW
  WHEN (NEW.is_default = true)
  EXECUTE FUNCTION ensure_single_default_account();

-- =============================================================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================================================

COMMENT ON TABLE nylas_accounts IS 'Stores connected email accounts (Gmail, Outlook, IMAP) via Nylas';
COMMENT ON TABLE nylas_folder_mappings IS 'Maps server folders to app folders with sync configuration';
COMMENT ON TABLE emails IS 'Stores synced email messages';
COMMENT ON TABLE email_attachments IS 'Stores email attachment metadata';
COMMENT ON TABLE sync_logs IS 'Logs sync operations for debugging and monitoring';

COMMENT ON COLUMN nylas_accounts.grant_id IS 'Nylas grant ID for API calls';
COMMENT ON COLUMN nylas_accounts.provider IS 'Email provider: google, microsoft, or imap';
COMMENT ON COLUMN nylas_accounts.is_default IS 'Default account for compose and send operations';
COMMENT ON COLUMN nylas_folder_mappings.bidirectional_sync IS 'If true, changes sync back to server';
COMMENT ON COLUMN nylas_folder_mappings.app_folder_name IS 'Custom folder name shown in app (can differ from server)';

