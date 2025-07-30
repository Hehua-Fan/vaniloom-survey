import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database table structure type definitions
export interface BetaAccountRow {
  id: string
  username: string
  password: string
  is_assigned: boolean
  assigned_to: string | null
  assigned_at: string | null
  created_at: string
  updated_at: string
}

export interface SurveyResponse {
  id?: string
  name: string
  email: string
  contact?: string  // Made optional since no longer collected in new form
  age: string
  gender: string
  orientation: string
  ao3_content?: string
  favorite_cp_tags?: string
  identity: string[]
  other_identity?: string
  accept_follow_up: string
  assigned_account_id?: string
  created_at?: string
  updated_at?: string
} 