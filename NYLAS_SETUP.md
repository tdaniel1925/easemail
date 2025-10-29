# Nylas Integration Setup Guide

## ✅ Files Created

1. **lib/nylas/client.ts** - Nylas SDK client and helper functions
2. **app/api/nylas/auth/route.ts** - OAuth initiation endpoint
3. **app/api/nylas/callback/route.ts** - OAuth callback handler
4. **app/api/emails/route.ts** - Fetch emails API
5. **app/api/emails/folders/route.ts** - Fetch folders API
6. **app/api/emails/send/route.ts** - Send emails API
7. **supabase/migrations/002_nylas_accounts.sql** - Database migration

## 📋 Next Steps

### 1. Add Environment Variables

Update your `.env.local` file:

```env
# Nylas Configuration
NYLAS_API_KEY=nyk_v0_your_actual_api_key_here
NYLAS_API_URI=https://api.us.nylas.com
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### 2. Run Database Migration

Run this SQL in your Supabase SQL Editor or use the migration file:

```sql
-- See supabase/migrations/002_nylas_accounts.sql
```

Or copy the contents and run directly in Supabase Dashboard → SQL Editor.

### 3. Test the OAuth Flow

1. Start your dev server: `npm run dev`
2. Navigate to: `http://localhost:3001/api/nylas/auth`
3. This will redirect you to Nylas OAuth
4. Select your email provider (Gmail, Outlook, etc.)
5. Authorize access
6. You'll be redirected back to `/dashboard/emails?connected=true`

### 4. Available API Endpoints

**Get Emails:**
```
GET /api/emails?folder=inbox&limit=50&offset=0
```

**Get Folders:**
```
GET /api/emails/folders
```

**Send Email:**
```
POST /api/emails/send
Body: {
  "to": ["recipient@example.com"],
  "subject": "Test Email",
  "body": "Hello from Nylas!",
  "cc": [],
  "bcc": []
}
```

### 5. Update Your UI Components

The emails page component needs to be updated to:
- Check if user has connected email
- Show "Connect Email" button if not connected
- Fetch real emails from `/api/emails`
- Display real folders from `/api/emails/folders`

## 🔧 Helper Functions Available

From `lib/nylas/client.ts`:

- `getEmails(grantId, params)` - Fetch emails
- `getFolders(grantId)` - Fetch folders
- `sendEmail(grantId, email)` - Send email
- `getMessage(grantId, messageId)` - Get single message
- `updateMessage(grantId, messageId, updates)` - Update message (read/star)

## 🚨 Important Notes

1. **Grant ID** is stored in `nylas_accounts` table per user
2. Each user can only have ONE connected email account (enforced by UNIQUE constraint)
3. All API calls require authentication (checks `auth.uid()`)
4. Nylas syncs in background automatically - no manual sync needed
5. Free tier: 100 accounts, good for development

## 📚 Resources

- Nylas Docs: https://developer.nylas.com/
- SDK Reference: https://nylas-v3-sdk-node-reference.netlify.app/
- API Reference: https://developer.nylas.com/docs/api/v3/

## 🔐 Security Checklist

✅ Environment variables are server-side only  
✅ RLS policies protect nylas_accounts table  
✅ API routes verify user authentication  
✅ Grant IDs are unique per user  
✅ OAuth redirects are validated  

