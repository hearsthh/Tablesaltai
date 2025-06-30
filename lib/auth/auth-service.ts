import { getSupabaseBrowserClient, getSupabaseServerClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

class ServerAuthService {
  async getCurrentUser() {
    try {
      const supabase = getSupabaseServerClient()

      // Check if we have a real Supabase client or mock
      if (!supabase || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.log("Supabase not configured, skipping authentication")
        return { user: null, error: "Authentication service not configured" }
      }

      const { data, error } = await supabase.auth.getUser()

      if (error || !data?.user) {
        return { user: null, error: error?.message || "User not found" }
      }

      return { user: data.user, error: null }
    } catch (error) {
      console.error("Server auth error:", error)
      return { user: null, error: "Authentication service unavailable" }
    }
  }

  async getUserProfile(userId: string) {
    try {
      const supabase = getSupabaseServerClient()

      if (!supabase || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return { profile: null, error: "Authentication service not configured" }
      }

      const { data, error } = await supabase.from("restaurant_profiles").select("*").eq("user_id", userId).single()

      if (error) {
        return { profile: null, error: error.message }
      }

      return { profile: data, error: null }
    } catch (error) {
      console.error("Get profile error:", error)
      return { profile: null, error: "Profile service unavailable" }
    }
  }
}

// Client-side auth functions
export const authService = {
  // Sign up with email and password
  async signUp(email: string, password: string, userData: any) {
    try {
      const supabase = getSupabaseBrowserClient()

      if (!supabase) {
        return { user: null, error: "Authentication service not configured" }
      }

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
    } catch (error) {
      console.error("SignUp error:", error)
      return { user: null, error: "Authentication service unavailable" }
    }
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    try {
      const supabase = getSupabaseBrowserClient()

      if (!supabase) {
        return { user: null, error: "Authentication service not configured" }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { user: null, error: error.message }
      }

      return { user: data.user, error: null }
    } catch (error) {
      console.error("SignIn error:", error)
      return { user: null, error: "Authentication service unavailable" }
    }
  },

  // Sign out
  async signOut() {
    try {
      const supabase = getSupabaseBrowserClient()

      if (!supabase) {
        return { error: "Authentication service not configured" }
      }

      const { error } = await supabase.auth.signOut()

      if (error) {
        return { error: error.message }
      }

      return { error: null }
    } catch (error) {
      console.error("SignOut error:", error)
      return { error: "Authentication service unavailable" }
    }
  },

  // Get current user
  async getCurrentUser(): Promise<{ user: User | null; error: string | null }> {
    try {
      const supabase = getSupabaseBrowserClient()

      if (!supabase) {
        return { user: null, error: "Authentication service not configured" }
      }

      const { data, error } = await supabase.auth.getUser()

      if (error) {
        return { user: null, error: error.message }
      }

      return { user: data.user, error: null }
    } catch (error) {
      console.error("GetCurrentUser error:", error)
      return { user: null, error: "Authentication service unavailable" }
    }
  },

  // Reset password
  async resetPassword(email: string) {
    try {
      const supabase = getSupabaseBrowserClient()

      if (!supabase) {
        return { error: "Authentication service not configured" }
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        return { error: error.message }
      }

      return { error: null }
    } catch (error) {
      console.error("ResetPassword error:", error)
      return { error: "Authentication service unavailable" }
    }
  },

  // Update password
  async updatePassword(password: string) {
    try {
      const supabase = getSupabaseBrowserClient()

      if (!supabase) {
        return { error: "Authentication service not configured" }
      }

      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        return { error: error.message }
      }

      return { error: null }
    } catch (error) {
      console.error("UpdatePassword error:", error)
      return { error: "Authentication service unavailable" }
    }
  },
}

export const serverAuthService = new ServerAuthService()
