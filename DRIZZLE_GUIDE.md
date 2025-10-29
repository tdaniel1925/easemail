# Drizzle ORM Setup Guide

This project uses **Drizzle ORM** for type-safe database access with Supabase PostgreSQL.

## 🚀 Quick Start

### 1. Get Your Supabase Connection String

Go to your Supabase Dashboard:
1. Navigate to **Project Settings** → **Database**
2. Find the **Connection Pooling** section
3. Copy the **Connection string** (Transaction mode)
4. It should look like:
   ```
   postgresql://postgres.xxxxx:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
   ```

### 2. Add to Environment Variables

Add the connection string to your `.env.local`:

```bash
# Your existing Supabase vars
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Add this for Drizzle
DATABASE_URL=postgresql://postgres.xxxxx:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

### 3. Apply the Initial Migration

**Option A: Using Supabase SQL Editor (Recommended)**
1. Go to Supabase Dashboard → **SQL Editor**
2. Click **New query**
3. Copy the contents of `drizzle/0000_initial_schema.sql`
4. Paste and click **Run**

**Option B: Using Drizzle CLI**
```bash
npm run db:push
```

## 📦 Available Scripts

```bash
# Generate new migrations from schema changes
npm run db:generate

# Apply migrations to database
npm run db:migrate

# Push schema directly to database (for development)
npm run db:push

# Open Drizzle Studio (database GUI)
npm run db:studio
```

## 🗂️ Project Structure

```
lib/
├── db/
│   ├── schema.ts       # Drizzle schema definitions
│   └── index.ts        # Database client
drizzle/
└── 0000_initial_schema.sql  # Initial migration
```

## 📝 Schema Overview

### Tables

#### `profiles`
- `id` (UUID) - References auth.users, primary key
- `username` (TEXT) - Unique, 3-20 chars, lowercase alphanumeric + underscore
- `email` (TEXT) - Unique
- `full_name` (TEXT) - Optional
- `avatar_url` (TEXT) - Optional
- `plan_tier` (TEXT) - Default: 'free'
- `role` (ENUM) - 'user', 'admin', or 'super_admin'
- `created_at` (TIMESTAMPTZ)

#### `usernames`
- `username` (TEXT) - Primary key, case-insensitive
- `user_id` (UUID) - References profiles.id
- `created_at` (TIMESTAMPTZ)

### Functions

#### `check_username_available(username_to_check TEXT)`
Returns boolean indicating if username is available (case-insensitive check)

#### `handle_new_user()`
Trigger function that automatically creates profile and username entries when a new user signs up

## 💻 Using Drizzle in Your Code

### Basic Queries

```typescript
import { db } from '@/lib/db'
import { profiles, usernames } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// Get user profile by ID
const profile = await db
  .select()
  .from(profiles)
  .where(eq(profiles.id, userId))
  .limit(1)

// Check username availability
const existing = await db
  .select()
  .from(usernames)
  .where(eq(usernames.username, username.toLowerCase()))
  .limit(1)

const isAvailable = existing.length === 0

// Update profile
await db
  .update(profiles)
  .set({ fullName: 'John Doe' })
  .where(eq(profiles.id, userId))

// Get all users with a specific role
const admins = await db
  .select()
  .from(profiles)
  .where(eq(profiles.role, 'admin'))
```

### With Relations

```typescript
import { db } from '@/lib/db'
import { profiles } from '@/lib/db/schema'

// Get profile with related username
const profileWithUsername = await db.query.profiles.findFirst({
  where: eq(profiles.id, userId),
  with: {
    username: true,
  },
})
```

### Type-Safe Inserts

```typescript
import { db } from '@/lib/db'
import { profiles, type NewProfile } from '@/lib/db/schema'

// TypeScript will enforce correct types
const newProfile: NewProfile = {
  id: userId,
  username: 'john_doe',
  email: 'john@example.com',
  role: 'user', // TypeScript knows valid values: 'user' | 'admin' | 'super_admin'
  planTier: 'free',
}

await db.insert(profiles).values(newProfile)
```

## 🔄 Making Schema Changes

1. **Edit the schema** in `lib/db/schema.ts`

```typescript
// Example: Add a new field
export const profiles = pgTable('profiles', {
  // ... existing fields ...
  bio: text('bio'),
  website: text('website'),
})
```

2. **Generate migration**

```bash
npm run db:generate
```

3. **Review the generated migration** in `drizzle/` folder

4. **Apply migration** to Supabase

```bash
npm run db:push
```

Or manually run the SQL in Supabase SQL Editor

## 🎨 Drizzle Studio

Launch the visual database browser:

```bash
npm run db:studio
```

Opens at `https://local.drizzle.studio`

- View all tables
- Edit data directly
- Test queries
- See relationships

## ⚡ Benefits of Drizzle

### Type Safety
```typescript
// TypeScript knows the exact shape of your data
const profile = await db.select().from(profiles)
//    ^? Profile[]

// Auto-completion for all fields
profile[0].username // ✅
profile[0].invalidField // ❌ TypeScript error
```

### Auto-Generated Types
```typescript
import { type Profile, type NewProfile } from '@/lib/db/schema'

// Profile = what you get from SELECT queries
// NewProfile = what you need for INSERT queries
```

### SQL-like Syntax
```typescript
// Drizzle syntax is close to SQL
await db
  .select()
  .from(profiles)
  .where(eq(profiles.role, 'admin'))
  .orderBy(desc(profiles.createdAt))
  .limit(10)
```

### Migration Management
- Version controlled migrations
- Easy rollbacks
- Clear change history

## 🔒 Security with RLS

The migration includes Row Level Security (RLS) policies:

- ✅ All users can view public profile info
- ✅ Users can only update their own profile
- ✅ Admins can view and update all profiles
- ✅ Username lookups are public (for validation)

These work seamlessly with Supabase Auth!

## 🚨 Common Issues

### "relation does not exist"
- Make sure you've run the migration in Supabase
- Check that the table was created successfully

### "Could not connect to database"
- Verify your DATABASE_URL in `.env.local`
- Make sure you're using the **Connection Pooling** URL from Supabase
- Check that your database password is correct

### Type errors after schema changes
```bash
# Regenerate types
npm run db:generate
```

## 📚 Resources

- [Drizzle Docs](https://orm.drizzle.team/docs/overview)
- [Drizzle with Supabase](https://orm.drizzle.team/docs/get-started-postgresql#supabase)
- [SQL operators](https://orm.drizzle.team/docs/operators)

## 🎯 Next Steps

After applying the initial migration:

1. Test signup flow - profile should be auto-created
2. Test username validation
3. Try Drizzle Studio: `npm run db:studio`
4. Start building Phase 2 features with type-safe queries!

