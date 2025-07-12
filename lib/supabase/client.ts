import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Check if we're in v0 preview environment
const isV0Preview = () => {
  return typeof window !== "undefined" && window.location.hostname.includes("v0.dev")
}

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

// Singleton instance
let supabaseInstance: any = null

// Browser client with singleton pattern
export const createBrowserClient = () => {
  if (supabaseInstance) {
    return supabaseInstance
  }

  if (!isSupabaseConfigured() || isV0Preview()) {
    console.log("Using mock Supabase client for v0 preview")
    supabaseInstance = createMockClient()
    return supabaseInstance
  }

  supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })

  return supabaseInstance
}

// Server client function
export function getSupabaseServerClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || isV0Preview()) {
    console.log("Using mock Supabase server client")
    return createMockClient()
  }

  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Mock client that returns realistic data for v0 preview
const createMockClient = () => {
  const mockRestaurantData = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "Spice Garden Mumbai",
    cuisine_type: "Indian",
    restaurant_type: "Casual Dining",
    price_range: "$$",
    city: "Mumbai",
    avg_rating: 4.3,
    total_reviews: 247,
    monthly_revenue: 450000,
    monthly_orders: 1250,
    avg_order_value: 360,
  }

  const mockMenuItems = [
    {
      id: "item-1",
      name: "Butter Chicken",
      description: "Tender chicken in rich tomato cream sauce",
      price: 380,
      category: "Main Course",
      is_available: true,
      total_orders: 234,
      avg_rating: 4.7,
    },
    {
      id: "item-2",
      name: "Dal Makhani",
      description: "Slow-cooked black lentils in creamy gravy",
      price: 280,
      category: "Main Course",
      is_available: true,
      total_orders: 178,
      avg_rating: 4.4,
    },
  ]

  const mockReviews = [
    {
      id: "review-1",
      author_name: "Priya Sharma",
      rating: 5,
      content: "Amazing food and service! The butter chicken was absolutely divine.",
      platform: "google",
      review_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      has_response: true,
    },
    {
      id: "review-2",
      author_name: "Arjun Patel",
      rating: 4,
      content: "Great food, could improve wait times during peak hours.",
      platform: "zomato",
      review_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      has_response: false,
    },
  ]

  return {
    auth: {
      getUser: async () => ({
        data: { user: { id: "mock-user", email: "test@restaurant.com" } },
        error: null,
      }),
      getSession: async () => ({
        data: { session: { user: { id: "mock-user", email: "test@restaurant.com" } } },
        error: null,
      }),
      onAuthStateChange: (callback: any) => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
      refreshSession: async () => ({
        data: { session: { user: { id: "mock-user" } } },
        error: null,
      }),
      signUp: async () => ({
        data: { user: { id: "mock-user" } },
        error: null,
      }),
      signInWithPassword: async () => ({
        data: { user: { id: "mock-user" } },
        error: null,
      }),
      signOut: async () => ({ error: null }),
    },
    from: (table: string) => ({
      select: (columns = "*") => ({
        eq: (column: string, value: any) => ({
          single: async () => {
            await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate loading

            if (table === "restaurant_profiles") {
              return { data: mockRestaurantData, error: null }
            }
            return { data: null, error: null }
          },
          limit: (count: number) => ({
            order: (column: string, options?: any) => ({
              then: async (callback: any) => {
                await new Promise((resolve) => setTimeout(resolve, 300))

                if (table === "menu_items") {
                  return callback({ data: mockMenuItems, error: null })
                }
                if (table === "reviews") {
                  return callback({ data: mockReviews, error: null })
                }
                return callback({ data: [], error: null })
              },
            }),
          }),
        }),
        order: (column: string, options?: any) => ({
          limit: (count: number) => ({
            then: async (callback: any) => {
              await new Promise((resolve) => setTimeout(resolve, 300))

              if (table === "menu_items") {
                return callback({ data: mockMenuItems, error: null })
              }
              if (table === "reviews") {
                return callback({ data: mockReviews, error: null })
              }
              return callback({ data: [], error: null })
            },
          }),
        }),
        then: async (callback: any) => {
          await new Promise((resolve) => setTimeout(resolve, 300))

          if (table === "restaurant_profiles") {
            return callback({ data: [mockRestaurantData], error: null })
          }
          if (table === "menu_items") {
            return callback({ data: mockMenuItems, error: null })
          }
          if (table === "reviews") {
            return callback({ data: mockReviews, error: null })
          }
          return callback({ data: [], error: null })
        },
      }),
      insert: (data: any) => ({
        select: () => ({
          single: async () => {
            await new Promise((resolve) => setTimeout(resolve, 500))
            return { data: { ...data, id: `mock-${Date.now()}` }, error: null }
          },
        }),
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          select: () => ({
            single: async () => {
              await new Promise((resolve) => setTimeout(resolve, 500))
              return { data: { ...data, id: value }, error: null }
            },
          }),
        }),
      }),
    }),
  } as any
}

// Legacy export for compatibility - now uses singleton
export const supabase = createBrowserClient()

// Additional exports for compatibility
export const getSupabaseBrowserClient = createBrowserClient
export { createClient } from "@supabase/supabase-js"

// Default export for legacy compatibility
export default createBrowserClient()
