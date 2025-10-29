import { pgTable, text, timestamp, uuid, pgEnum } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Enums
export const userRoleEnum = pgEnum('user_role', ['user', 'admin', 'super_admin'])

// Profiles table (extends Supabase auth.users)
// Note: The id references auth.users but we don't define that relationship in Drizzle
// since auth.users is managed by Supabase
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(), // References auth.users in Supabase
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  planTier: text('plan_tier').default('free'),
  role: userRoleEnum('role').default('user'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

// Usernames table for fast lookups
export const usernames = pgTable('usernames', {
  username: text('username').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

// Relations
export const profilesRelations = relations(profiles, ({ one }) => ({
  username: one(usernames, {
    fields: [profiles.id],
    references: [usernames.userId],
  }),
}))

export const usernamesRelations = relations(usernames, ({ one }) => ({
  profile: one(profiles, {
    fields: [usernames.userId],
    references: [profiles.id],
  }),
}))

// Type exports
export type Profile = typeof profiles.$inferSelect
export type NewProfile = typeof profiles.$inferInsert
export type Username = typeof usernames.$inferSelect
export type NewUsername = typeof usernames.$inferInsert

