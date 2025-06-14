import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Browser client
const createBrowserClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase environment variables not configured")
    // Return a mock client for development
    return null
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Server client function - EXPORTED
export function getSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn("Supabase server environment variables not configured")
    // Return a mock client that won't break the build
    return {
      from: (table: string) => ({
        select: (columns: string) => ({
          eq: (column: string, value: any) => ({
            single: async () => ({
              data: null,
              error: { message: "Supabase not configured" },
            }),
          }),
        }),
        insert: (data: any) => ({
          select: () => ({
            single: async () => ({
              data: null,
              error: { message: "Supabase not configured" },
            }),
          }),
        }),
        update: (data: any) => ({
          eq: (column: string, value: any) => ({
            select: () => ({
              single: async () => ({
                data: null,
                error: { message: "Supabase not configured" },
              }),
            }),
          }),
        }),
        delete: () => ({
          eq: (column: string, value: any) => ({
            select: () => ({
              single: async () => ({
                data: null,
                error: { message: "Supabase not configured" },
              }),
            }),
          }),
        }),
      }),
    } as any
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Browser client
export const getSupabaseBrowserClient = () => {
  return createBrowserClient()
}

// Legacy export
export const supabase = createBrowserClient()
