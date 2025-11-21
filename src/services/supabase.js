import { createClient } from '@supabase/supabase-js'

// IMPORTANTE: Substitui estes valores pelos teus do Supabase
// 1. Vai a https://supabase.com
// 2. Cria um novo projeto (gratuito)
// 3. Vai em Settings > API
// 4. Copia a URL e a anon key

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
