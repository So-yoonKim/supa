import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isConfigured = Boolean(url && anonKey)

// 키가 없어도 앱이 죽지 않도록 더미 값으로 생성 (안내 배너가 표시됨)
export const supabase = createClient(
  url || 'http://localhost',
  anonKey || 'missing-anon-key'
)
