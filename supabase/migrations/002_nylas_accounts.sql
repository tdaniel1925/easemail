-- Create table to store Nylas account connections
CREATE TABLE IF NOT EXISTS nylas_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  grant_id TEXT NOT NULL UNIQUE,
  email_address TEXT NOT NULL,
  provider TEXT NOT NULL, -- 'google', 'microsoft', etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE nylas_accounts ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own accounts
CREATE POLICY "Users can view own nylas accounts"
  ON nylas_accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own nylas accounts"
  ON nylas_accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own nylas accounts"
  ON nylas_accounts FOR UPDATE
  USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_nylas_accounts_user_id ON nylas_accounts(user_id);
CREATE INDEX idx_nylas_accounts_grant_id ON nylas_accounts(grant_id);

