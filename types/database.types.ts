export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          email: string
          full_name: string | null
          avatar_url: string | null
          plan_tier: string
          role: 'user' | 'admin' | 'super_admin'
          created_at: string
        }
        Insert: {
          id: string
          username: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          plan_tier?: string
          role?: 'user' | 'admin' | 'super_admin'
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          plan_tier?: string
          role?: 'user' | 'admin' | 'super_admin'
          created_at?: string
        }
      }
      usernames: {
        Row: {
          username: string
          user_id: string
          created_at: string
        }
        Insert: {
          username: string
          user_id: string
          created_at?: string
        }
        Update: {
          username?: string
          user_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

