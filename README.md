# EaseMail - AI-Powered Email Client

A modern, AI-powered email management application built with Next.js 14, Supabase, and Tailwind CSS.

## ✨ Features (Phase 1 - Foundation)

- ✅ **Custom Username Authentication** - Users create unique usernames during signup (not email-based)
- ✅ **Real-time Username Validation** - Check availability as you type
- ✅ **Dark/Light Theme Support** - System, light, and dark modes with smooth transitions
- ✅ **Responsive Design** - Mobile-first design with touch-friendly interfaces
- ✅ **Inline Notifications** - Non-intrusive notification system (no browser toasts)
- ✅ **Protected Routes** - Middleware-based authentication
- ✅ **Modern UI Components** - shadcn/ui components with Tailwind CSS
- ✅ **Mobile Bottom Navigation** - Easy navigation on mobile devices

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database & Auth**: Supabase
- **ORM**: Drizzle ORM (type-safe database access)
- **State Management**: Zustand
- **Theme**: next-themes
- **Icons**: Lucide React

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd easemail-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `env.template` to `.env.local` and fill in your Supabase credentials:
   ```bash
   cp env.template .env.local
   ```

   Required variables:
   ```
   NEXT_PUBLIC_APP_URL=http://localhost:3001
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Set up Supabase database**
   
   **Using Drizzle (Recommended)** - Type-safe migrations:
   
   a. Get your DATABASE_URL from Supabase:
      - Go to Project Settings → Database
      - Copy the "Connection Pooling" URL (Transaction mode)
      - Add to `.env.local`:
        ```
        DATABASE_URL=postgresql://postgres.xxxxx:[PASSWORD]@...
        ```
   
   b. Apply the migration:
      - **Option 1** (SQL Editor): Copy `drizzle/0000_initial_schema.sql` and run in Supabase SQL Editor
      - **Option 2** (CLI): Run `npm run db:push`
   
   See `DRIZZLE_GUIDE.md` for detailed Drizzle documentation.

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be available at [http://localhost:3001](http://localhost:3001)

## 🗂️ Project Structure

```
easemail-app/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/         # Protected dashboard area
│   │   ├── layout.tsx       # Dashboard layout with sidebar + header
│   │   └── page.tsx         # Dashboard home
│   ├── api/                 # API routes
│   │   └── auth/
│   ├── globals.css          # Global styles with theme variables
│   └── layout.tsx           # Root layout with theme provider
├── components/
│   ├── layout/              # Layout components
│   │   ├── Header.tsx       # Top header with search and user menu
│   │   ├── Sidebar.tsx      # Collapsible sidebar navigation
│   │   ├── MobileNav.tsx    # Bottom navigation for mobile
│   │   └── ThemeToggle.tsx  # Theme switcher
│   ├── providers/           # Context providers
│   └── ui/                  # shadcn/ui components
├── lib/
│   ├── supabase/            # Supabase client utilities
│   ├── stores/              # Zustand stores
│   └── utils.ts             # Utility functions
├── supabase/
│   └── schema.sql           # Database schema
├── types/
│   └── database.types.ts    # TypeScript types for database
└── middleware.ts            # Route protection

```

## 🔒 Authentication Flow

1. **Signup**:
   - User provides username (3-20 chars, lowercase alphanumeric + underscore)
   - Real-time username availability check
   - Email and password validation
   - Profile automatically created via database trigger

2. **Login**:
   - Email + password authentication
   - Automatic redirect to dashboard
   - Session persistence

3. **Protected Routes**:
   - `/dashboard/*` - Requires authentication
   - `/admin/*` - Requires admin role (future)
   - Auto-redirect to login if not authenticated

## 🎨 Design System

### Colors

- **Primary**: Red/Coral (#FF4C5A) - Main brand color
- **Category Colors**:
  - Important: Red
  - Social: Purple
  - Promotion: Blue
  - Updates: Orange

### Theme Support

- Light mode (default)
- Dark mode
- System preference

## 📱 Responsive Breakpoints

- Mobile: < 768px (with bottom navigation)
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔧 Development Commands

```bash
# Start development server (port 3001)
npm run dev

# Build for production
npm run build

# Start production server (port 3001)
npm start

# Run linter
npm run lint

# Database commands (Drizzle)
npm run db:generate    # Generate migrations from schema changes
npm run db:push        # Push schema to database
npm run db:migrate     # Run migrations
npm run db:studio      # Open Drizzle Studio (database GUI)
```

## 🗃️ Database Schema

### Tables

- **profiles**: User profiles with username, email, plan, role
- **usernames**: Case-insensitive username lookup table

### RLS Policies

- Public read access to profiles
- Users can only update their own profile
- Admins can view and update all profiles

## 🚧 Future Phases

### Phase 2: Email Connectivity
- Nylas integration (Google, Microsoft, IMAP)
- Aurinko fallback
- Email sync with Inngest

### Phase 3: Core Email Features
- Inbox, sent, drafts
- Email compose and send
- Attachments
- Tags and categories

### Phase 4: AI Features
- Email summarization (hover preview)
- AI compose assistant
- Voice-to-text
- Smart replies
- Auto-categorization

### Phase 5: SMS & Communications
- Twilio SMS integration
- Contact management
- Scheduled messages

### Phase 6: Admin Area
- User management
- Subscription management
- Analytics dashboard
- Platform settings

## 📄 License

[Add your license here]

## 🤝 Contributing

[Add contribution guidelines here]

## 📞 Support

For support, email [your-email] or open an issue.

---

Built with ❤️ for modern email management

