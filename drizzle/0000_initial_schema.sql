-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create user_role enum
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('user', 'admin', 'super_admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  plan_tier TEXT DEFAULT 'free',
  role user_role DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 20),
  CONSTRAINT username_format CHECK (username ~* '^[a-z0-9_]+$')
);

-- Create usernames table for fast case-insensitive lookups
CREATE TABLE IF NOT EXISTS usernames (
  username TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create index for case-insensitive username lookup
CREATE INDEX IF NOT EXISTS usernames_lower_idx ON usernames (lower(username));

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.email
  );
  
  INSERT INTO public.usernames (username, user_id)
  VALUES (
    lower(NEW.raw_user_meta_data->>'username'),
    NEW.id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE usernames ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
DROP POLICY IF EXISTS "Usernames are viewable by everyone" ON usernames;
DROP POLICY IF EXISTS "Usernames can be inserted during signup" ON usernames;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
    )
  );

-- Policies for usernames
CREATE POLICY "Usernames are viewable by everyone"
  ON usernames FOR SELECT
  USING (true);

CREATE POLICY "Usernames can be inserted during signup"
  ON usernames FOR INSERT
  WITH CHECK (true);

-- Function to check username availability
CREATE OR REPLACE FUNCTION public.check_username_available(username_to_check TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM public.usernames
    WHERE lower(username) = lower(username_to_check)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT ALL ON public.usernames TO anon, authenticated;

