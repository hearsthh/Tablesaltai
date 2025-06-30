import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

const isSupabaseServerConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

// Browser client
const createBrowserClient = () => {
  if (!isSupabaseConfigured()) {
    console.warn("Supabase browser environment variables not configured")
    return null
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Create a mock client for when Supabase is not configured
const createMockClient = () => {
  return {
    auth: {
      getUser: async () => ({
        data: { user: null },
        error: { message: "Supabase not configured" },
      }),
      signUp: async () => ({
        data: { user: null },
        error: { message: "Supabase not configured" },
      }),
      signInWithPassword: async () => ({
        data: { user: null },
        error: { message: "Supabase not configured" },
      }),
      signOut: async () => ({
        error: { message: "Supabase not configured" },
      }),
      resetPasswordForEmail: async () => ({
        error: { message: "Supabase not configured" },
      }),
      updateUser: async () => ({
        error: { message: "Supabase not configured" },
      }),
    },
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

// Server client function - EXPORTED
export function getSupabaseServerClient() {
  if (!isSupabaseServerConfigured()) {
    console.warn("Supabase server environment variables not configured")
    return createMockClient()
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

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
