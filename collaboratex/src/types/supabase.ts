/**
 * This file contains type definitions for your Supabase database.
 * You can replace it with a generated version using the Supabase CLI:
 * npm run supabase:gen-types
 */

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
      documents: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          content: Json
          owner_id: string
          is_public: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          content: Json
          owner_id: string
          is_public?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          content?: Json
          owner_id?: string
          is_public?: boolean
        }
      }
      collaborators: {
        Row: {
          id: string
          document_id: string
          user_id: string
          permissions: string[]
          created_at: string
        }
        Insert: {
          id?: string
          document_id: string
          user_id: string
          permissions?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          user_id?: string
          permissions?: string[]
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          updated_at: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
        }
        Insert: {
          id: string
          updated_at?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          updated_at?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
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