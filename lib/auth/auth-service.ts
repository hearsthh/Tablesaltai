import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import type { User } from "@supabase/supabase-js"

// Client-side auth functions
export const authService = {
  // Sign up with email and password
  async signUp(email: string, password: string, userData: any) {
    const supabase = getSupabaseBrowserClient()

    // Create user account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      return { user: null, error: authError.message }
    }

    if (!authData.user) {
      return { user: null, error: "User creation failed" }
    }

    // Add user profile data
    const { error: profileError } = await supabase.from("restaurant_profiles").insert([
      {
        user_id: authData.user.id,
        ...userData,
        created_at: new Date().toISOString(),
      },
    ])

    if (profileError) {
      return { user: authData.user, error: profileError.message }
    }

    return { user: authData.user, error: null }
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    const supabase = getSupabaseBrowserClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { user: null, error: error.message }
    }

    return { user: data.user, error: null }
  },

  // Sign out
  async signOut() {
    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      return { error: error.message }
    }

    return { error: null }
  },

  // Get current user
  async getCurrentUser(): Promise<{ user: User | null; error: string | null }> {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase.auth.getUser()

    if (error) {
      return { user: null, error: error.message }
    }

    return { user: data.user, error: null }
  },

  // Reset password
  async resetPassword(email: string) {
    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      return { error: error.message }
    }

    return { error: null }
  },

  // Update password
  async updatePassword(password: string) {
    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      return { error: error.message }
    }

    return { error: null }
  },
}

// Server-side auth functions
export const serverAuthService = {
  // Get current user on server
  async getCurrentUser() {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase.auth.getUser()

    if (error || !data?.user) {
      return { user: null, error: error?.message || "User not found" }
    }

    return { user: data.user, error: null }
  },

  // Get user profile data
  async getUserProfile(userId: string) {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase.from("restaurant_profiles").select("*").eq("user_id", userId).single()

    if (error) {
      return { profile: null, error: error.message }
    }

    return { profile: data, error: null }
  },
}
