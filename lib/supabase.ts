import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// 数据库表结构类型定义
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