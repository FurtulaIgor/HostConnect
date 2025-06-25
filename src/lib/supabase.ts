import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface User {
  id: string
  email: string
  name: string
  verified: boolean
  created_at: string
}

export interface Listing {
  id: string
  user_id: string
  title: string
  description: string
  price: number
  location: string
  availability: boolean
  created_at: string
  updated_at: string
}

export interface Interaction {
  id: string
  user_id: string
  host_id: string
  message: string
  timestamp: string
  created_at: string
} 