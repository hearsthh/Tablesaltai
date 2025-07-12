import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Check if we're in a server environment that supports Supabase
const canUseSupabase = () => {
  return !!(supabaseUrl && supabaseServiceKey && typeof cookies !== "undefined")
}

// Create Supabase server client
export async function createClient() {
  if (!canUseSupabase()) {
    console.log("Using mock server client - Supabase not available")
    return createMockServerClient()
  }

  try {
    const cookieStore = await cookies()

    return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Ignore cookie setting errors in preview
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: "", ...options })
          } catch (error) {
            // Ignore cookie removal errors in preview
          }
        },
      },
    })
  } catch (error) {
    console.log("Falling back to mock server client")
    return createMockServerClient()
  }
}

// Mock server client for preview environments
function createMockServerClient() {
  const mockData = {
    restaurant: {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "Spice Garden Mumbai",
      cuisine_type: "Indian",
      avg_rating: 4.3,
      total_reviews: 247,
    },
    menuItems: [
      { id: "1", name: "Butter Chicken", price: 380, category: "Main Course" },
      { id: "2", name: "Dal Makhani", price: 280, category: "Main Course" },
    ],
    reviews: [
      { id: "1", author_name: "Priya", rating: 5, content: "Amazing food!" },
      { id: "2", author_name: "Arjun", rating: 4, content: "Great taste, slow service" },
    ],
  }

  return {
    auth: {
      getUser: async () => ({ data: { user: { id: "mock-user" } }, error: null }),
    },
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          single: async () => {
            await new Promise((resolve) => setTimeout(resolve, 300))
            return { data: mockData.restaurant, error: null }
          },
        }),
        then: async () => {
          await new Promise((resolve) => setTimeout(resolve, 300))
          if (table === "menu_items") return { data: mockData.menuItems, error: null }
          if (table === "reviews") return { data: mockData.reviews, error: null }
          return { data: [], error: null }
        },
      }),
      insert: async () => ({ data: { id: "mock-insert" }, error: null }),
      update: () => ({
        eq: () => ({
          select: async () => ({ data: { id: "mock-update" }, error: null }),
        }),
      }),
    }),
  } as any
}

// Get Supabase server client (alias for compatibility)
export const getSupabaseServerClient = createClient

// User management functions
export async function createUser(userData: {
  email: string
  password: string
  firstName: string
  lastName: string
  restaurantName?: string
}) {
  const supabase = await createClient()

  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          restaurant_name: userData.restaurantName,
        },
      },
    })

    if (authError) throw authError

    // Create user profile
    if (authData.user) {
      const { error: profileError } = await supabase.from("user_profiles").insert({
        id: authData.user.id,
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        restaurant_name: userData.restaurantName,
        created_at: new Date().toISOString(),
      })

      if (profileError) {
        console.error("Profile creation error:", profileError)
      }
    }

    return {
      success: true,
      user: authData.user,
      session: authData.session,
    }
  } catch (error) {
    console.error("User creation error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create user",
    }
  }
}

// Get user profile
export async function getUserProfile(userId: string) {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.from("user_profiles").select("*").eq("id", userId).single()

    if (error) throw error

    return {
      success: true,
      profile: data,
    }
  } catch (error) {
    console.error("Get user profile error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get user profile",
    }
  }
}

// Update user profile
export async function updateUserProfile(userId: string, updates: any) {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      profile: data,
    }
  } catch (error) {
    console.error("Update user profile error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update user profile",
    }
  }
}

// Restaurant management functions
export async function createRestaurant(restaurantData: {
  userId: string
  name: string
  cuisine: string
  description?: string
  address?: string
  phone?: string
  website?: string
}) {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from("restaurants")
      .insert({
        user_id: restaurantData.userId,
        name: restaurantData.name,
        cuisine: restaurantData.cuisine,
        description: restaurantData.description,
        address: restaurantData.address,
        phone: restaurantData.phone,
        website: restaurantData.website,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      restaurant: data,
    }
  } catch (error) {
    console.error("Restaurant creation error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create restaurant",
    }
  }
}

// Get restaurant by user ID
export async function getRestaurantByUserId(userId: string) {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.from("restaurants").select("*").eq("user_id", userId).single()

    if (error) throw error

    return {
      success: true,
      restaurant: data,
    }
  } catch (error) {
    console.error("Get restaurant error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get restaurant",
    }
  }
}

// Menu management functions
export async function createMenuItem(itemData: {
  restaurantId: string
  name: string
  description?: string
  price: number
  category: string
  ingredients?: string[]
  dietary_info?: string[]
  image_url?: string
}) {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from("menu_items")
      .insert({
        restaurant_id: itemData.restaurantId,
        name: itemData.name,
        description: itemData.description,
        price: itemData.price,
        category: itemData.category,
        ingredients: itemData.ingredients,
        dietary_info: itemData.dietary_info,
        image_url: itemData.image_url,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      menuItem: data,
    }
  } catch (error) {
    console.error("Menu item creation error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create menu item",
    }
  }
}

// Get menu items by restaurant ID
export async function getMenuItems(restaurantId: string) {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("category", { ascending: true })
      .order("name", { ascending: true })

    if (error) throw error

    return {
      success: true,
      menuItems: data || [],
    }
  } catch (error) {
    console.error("Get menu items error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get menu items",
    }
  }
}

// Customer management functions
export async function createCustomer(customerData: {
  restaurantId: string
  name: string
  email?: string
  phone?: string
  preferences?: string[]
  notes?: string
}) {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from("customers")
      .insert({
        restaurant_id: customerData.restaurantId,
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        preferences: customerData.preferences,
        notes: customerData.notes,
        visit_count: 1,
        last_visit: new Date().toISOString(),
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      customer: data,
    }
  } catch (error) {
    console.error("Customer creation error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create customer",
    }
  }
}

// Get customers by restaurant ID
export async function getCustomers(restaurantId: string) {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("last_visit", { ascending: false })

    if (error) throw error

    return {
      success: true,
      customers: data || [],
    }
  } catch (error) {
    console.error("Get customers error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get customers",
    }
  }
}

// Analytics functions
export async function getRestaurantAnalytics(restaurantId: string) {
  const supabase = await createClient()

  try {
    // Get basic stats
    const [menuItemsResult, customersResult] = await Promise.all([
      supabase.from("menu_items").select("id").eq("restaurant_id", restaurantId),
      supabase.from("customers").select("id, visit_count, last_visit").eq("restaurant_id", restaurantId),
    ])

    const menuItemCount = menuItemsResult.data?.length || 0
    const customerCount = customersResult.data?.length || 0
    const totalVisits = customersResult.data?.reduce((sum, customer) => sum + (customer.visit_count || 0), 0) || 0
    const avgVisitsPerCustomer = customerCount > 0 ? totalVisits / customerCount : 0

    // Get recent activity (customers who visited in last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentCustomers =
      customersResult.data?.filter((customer) => customer.last_visit && new Date(customer.last_visit) > thirtyDaysAgo)
        .length || 0

    return {
      success: true,
      analytics: {
        menuItemCount,
        customerCount,
        totalVisits,
        avgVisitsPerCustomer: Math.round(avgVisitsPerCustomer * 10) / 10,
        recentCustomers,
        activeCustomerRate: customerCount > 0 ? Math.round((recentCustomers / customerCount) * 100) : 0,
      },
    }
  } catch (error) {
    console.error("Get analytics error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get analytics",
    }
  }
}

// Test database connection
export async function testDatabaseConnection() {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.from("user_profiles").select("count").limit(1)

    if (error) throw error

    return {
      success: true,
      message: "Database connection successful",
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Database connection test failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Database connection failed",
      message: "Database connection failed",
    }
  }
}
