import 'server-only'

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export function createServerClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Supabase server environment variables are missing')
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey)
}
