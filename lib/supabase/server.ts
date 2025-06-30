import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

// Create Supabase server client
export function createClient() {
  const cookieStore = cookies()

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options })
        } catch (error) {
          // The `delete` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

// Get Supabase server client (alias for compatibility)
export function getSupabaseServerClient() {
  return createClient()
}

// User management functions
export async function createUser(userData: {
  email: string
  password: string
  firstName: string
  lastName: string
  restaurantName?: string
}) {
  const supabase = createClient()

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
  const supabase = createClient()

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
  const supabase = createClient()

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
  const supabase = createClient()

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
  const supabase = createClient()

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
  const supabase = createClient()

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
  const supabase = createClient()

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
  const supabase = createClient()

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
  const supabase = createClient()

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
  const supabase = createClient()

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
  const supabase = createClient()

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
