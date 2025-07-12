import { getSupabaseServerClient } from "@/lib/supabase/server"
import type { RestaurantProfile, User } from "@/lib/store/app-store"

const DEMO_USER_ID = "550e8400-e29b-41d4-a716-446655440000"

export class DatabaseService {
  private static getClient() {
    return getSupabaseServerClient()
  }

  static async getRestaurant(id: string) {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase.from("restaurants").select("*").eq("id", id).single()

      if (error) {
        console.error("Error fetching restaurant:", error)
        // Return demo data if not found
        return {
          id: DEMO_USER_ID,
          name: "Demo Restaurant",
          cuisine: "Indian",
          description: "A wonderful restaurant serving delicious food",
          phone: "+1234567890",
          email: "demo@restaurant.com",
          address: "123 Main Street, City",
          opening_hours: "9:00 AM - 10:00 PM",
          social_media: { instagram: "@demorestaurant" },
        }
      }

      return data
    } catch (error) {
      console.error("Database service error:", error)
      // Return demo data on error
      return {
        id: DEMO_USER_ID,
        name: "Demo Restaurant",
        cuisine: "Indian",
        description: "A wonderful restaurant serving delicious food",
        phone: "+1234567890",
        email: "demo@restaurant.com",
        address: "123 Main Street, City",
        opening_hours: "9:00 AM - 10:00 PM",
        social_media: { instagram: "@demorestaurant" },
      }
    }
  }

  static async getMenuCategories(restaurantId: string = DEMO_USER_ID) {
    try {
      const supabase = this.getClient()
      const { data: categories, error: categoriesError } = await supabase
        .from("menu_categories")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("display_order")

      if (categoriesError) {
        console.error("Error fetching categories:", categoriesError)
        return this.getDemoMenuCategories()
      }

      const { data: items, error: itemsError } = await supabase
        .from("menu_items")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("display_order")

      if (itemsError) {
        console.error("Error fetching items:", itemsError)
        return this.getDemoMenuCategories()
      }

      // Group items by category
      const categoriesWithItems = (categories || []).map((category) => ({
        ...category,
        items: (items || []).filter((item) => item.category_id === category.id),
      }))

      return categoriesWithItems.length > 0 ? categoriesWithItems : this.getDemoMenuCategories()
    } catch (error) {
      console.error("Database error:", error)
      return this.getDemoMenuCategories()
    }
  }

  static async getReviews(restaurantId: string) {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching reviews:", error)
        return this.getDemoReviews()
      }

      return data && data.length > 0 ? data : this.getDemoReviews()
    } catch (error) {
      console.error("Database service error:", error)
      return this.getDemoReviews()
    }
  }

  static async getCampaigns(restaurantId: string) {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from("marketing_campaigns")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching campaigns:", error)
        return this.getDemoCampaigns()
      }

      return data && data.length > 0 ? data : this.getDemoCampaigns()
    } catch (error) {
      console.error("Database service error:", error)
      return this.getDemoCampaigns()
    }
  }

  static async getMenuItems(restaurantId: string) {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching menu items:", error)
        return this.getDemoMenuItems()
      }

      return data && data.length > 0 ? data : this.getDemoMenuItems()
    } catch (error) {
      console.error("Database service error:", error)
      return this.getDemoMenuItems()
    }
  }

  static async getAnalytics(restaurantId: string) {
    try {
      // Get reviews for rating calculation
      const reviews = await this.getReviews(restaurantId)
      const avgRating =
        reviews.length > 0 ? reviews.reduce((sum, review) => sum + (review.rating || 4), 0) / reviews.length : 4.2

      // Get campaigns for marketing metrics
      const campaigns = await this.getCampaigns(restaurantId)
      const activeCampaigns = campaigns.filter((c) => c.status === "active")

      // Get menu items for profile completion
      const menuItems = await this.getMenuItems(restaurantId)

      return {
        revenue: 125000, // Mock data - would come from POS integration
        orders: 342,
        rating: Number(avgRating.toFixed(1)),
        views: 1250,
        profileCompletion: Math.min(100, menuItems.length * 10 + reviews.length * 5 + campaigns.length * 15),
        customerSatisfaction: Math.round(avgRating * 20),
        marketingActivity: Math.min(100, activeCampaigns.length * 25 + 25),
        activeCampaigns: activeCampaigns.length,
        totalBudget: campaigns.reduce((sum, c) => sum + (c.budget || 0), 0),
      }
    } catch (error) {
      console.error("Database service error:", error)
      return {
        revenue: 125000,
        orders: 342,
        rating: 4.2,
        views: 1250,
        profileCompletion: 75,
        customerSatisfaction: 84,
        marketingActivity: 50,
        activeCampaigns: 2,
        totalBudget: 15000,
      }
    }
  }

  // Demo data methods
  private static getDemoMenuCategories() {
    return [
      {
        id: "cat-1",
        restaurant_id: DEMO_USER_ID,
        name: "Appetizers",
        description: "Start your meal with our delicious appetizers",
        display_order: 1,
        items: [
          {
            id: "item-1",
            restaurant_id: DEMO_USER_ID,
            category_id: "cat-1",
            name: "Samosa Chaat",
            description: "Crispy samosas topped with tangy chutneys and yogurt",
            price: 8.99,
            is_available: true,
            display_order: 1,
          },
          {
            id: "item-2",
            restaurant_id: DEMO_USER_ID,
            category_id: "cat-1",
            name: "Paneer Tikka",
            description: "Grilled cottage cheese with aromatic spices",
            price: 12.99,
            is_available: true,
            display_order: 2,
          },
        ],
      },
      {
        id: "cat-2",
        restaurant_id: DEMO_USER_ID,
        name: "Main Course",
        description: "Our signature main dishes",
        display_order: 2,
        items: [
          {
            id: "item-3",
            restaurant_id: DEMO_USER_ID,
            category_id: "cat-2",
            name: "Butter Chicken",
            description: "Tender chicken in rich tomato cream sauce",
            price: 16.99,
            is_available: true,
            display_order: 1,
          },
          {
            id: "item-4",
            restaurant_id: DEMO_USER_ID,
            category_id: "cat-2",
            name: "Dal Makhani",
            description: "Creamy black lentils slow-cooked with butter and cream",
            price: 14.99,
            is_available: true,
            display_order: 2,
          },
        ],
      },
    ]
  }

  private static getDemoMenuItems() {
    return [
      {
        id: "item-1",
        restaurant_id: DEMO_USER_ID,
        category_id: "cat-1",
        name: "Samosa Chaat",
        description: "Crispy samosas topped with tangy chutneys and yogurt",
        price: 8.99,
        is_available: true,
        created_at: new Date().toISOString(),
      },
      {
        id: "item-2",
        restaurant_id: DEMO_USER_ID,
        category_id: "cat-1",
        name: "Paneer Tikka",
        description: "Grilled cottage cheese with aromatic spices",
        price: 12.99,
        is_available: true,
        created_at: new Date().toISOString(),
      },
      {
        id: "item-3",
        restaurant_id: DEMO_USER_ID,
        category_id: "cat-2",
        name: "Butter Chicken",
        description: "Tender chicken in rich tomato cream sauce",
        price: 16.99,
        is_available: true,
        created_at: new Date().toISOString(),
      },
      {
        id: "item-4",
        restaurant_id: DEMO_USER_ID,
        category_id: "cat-2",
        name: "Dal Makhani",
        description: "Creamy black lentils slow-cooked with butter and cream",
        price: 14.99,
        is_available: true,
        created_at: new Date().toISOString(),
      },
    ]
  }

  private static getDemoReviews() {
    return [
      {
        id: "review-1",
        restaurant_id: DEMO_USER_ID,
        customer_name: "Sarah Johnson",
        rating: 5,
        title: "Amazing food and service!",
        content: "Had a wonderful dining experience. The butter chicken was exceptional!",
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        is_published: true,
      },
      {
        id: "review-2",
        restaurant_id: DEMO_USER_ID,
        customer_name: "Mike Chen",
        rating: 4,
        title: "Great atmosphere",
        content: "Love the ambiance and the food quality. Will definitely come back!",
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        is_published: true,
      },
      {
        id: "review-3",
        restaurant_id: DEMO_USER_ID,
        customer_name: "Emily Davis",
        rating: 5,
        title: "Best Indian food in town",
        content: "Authentic flavors and excellent service. Highly recommended!",
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        is_published: true,
      },
    ]
  }

  private static getDemoCampaigns() {
    return [
      {
        id: "camp-1",
        restaurant_id: DEMO_USER_ID,
        name: "Weekend Special Promotion",
        description: "Special weekend promotion with 20% off on all main courses",
        campaign_type: "promotion",
        status: "active",
        budget: 5000,
        spent: 2300,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "camp-2",
        restaurant_id: DEMO_USER_ID,
        name: "Social Media Campaign",
        description: "Instagram and Facebook marketing campaign to increase brand awareness",
        campaign_type: "social_media",
        status: "active",
        budget: 3000,
        spent: 1200,
        start_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]
  }

  // User operations
  static async createUser(userData: Omit<User, "id">): Promise<User> {
    const supabase = this.getClient()
    const demoUserId = DEMO_USER_ID

    const { data, error } = await supabase
      .from("user_profiles")
      .upsert({
        id: demoUserId,
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone: userData.phone,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw new Error(`Failed to create user: ${error.message}`)

    return {
      id: data.id,
      email: data.email,
      firstName: data.first_name,
      lastName: data.last_name,
      phone: data.phone,
    }
  }

  static async getUserById(id: string): Promise<User | null> {
    const supabase = this.getClient()
    const { data, error } = await supabase.from("user_profiles").select("*").eq("id", id).single()

    if (error && error.code !== "PGRST116") {
      throw new Error(`Failed to get user: ${error.message}`)
    }

    if (!data) return null

    return {
      id: data.id,
      email: data.email,
      firstName: data.first_name,
      lastName: data.last_name,
      phone: data.phone,
    }
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const supabase = this.getClient()
    const updateData: any = {}
    if (updates.email) updateData.email = updates.email
    if (updates.firstName) updateData.first_name = updates.firstName
    if (updates.lastName) updateData.last_name = updates.lastName
    if (updates.phone !== undefined) updateData.phone = updates.phone
    updateData.updated_at = new Date().toISOString()

    const { data, error } = await supabase.from("user_profiles").update(updateData).eq("id", id).select().single()

    if (error) throw new Error(`Failed to update user: ${error.message}`)

    return {
      id: data.id,
      email: data.email,
      firstName: data.first_name,
      lastName: data.last_name,
      phone: data.phone,
    }
  }

  // Restaurant operations
  static async createRestaurant(
    restaurantData: Omit<RestaurantProfile, "id" | "createdAt" | "updatedAt">,
  ): Promise<RestaurantProfile> {
    const supabase = this.getClient()
    const { data, error } = await supabase
      .from("restaurant_profiles")
      .insert({
        user_id: restaurantData.userId,
        restaurant_name: restaurantData.restaurantName,
        tagline: restaurantData.tagline,
        email: restaurantData.email,
        phone: restaurantData.phone,
        address: restaurantData.address,
        cuisine_type: restaurantData.cuisineType,
        restaurant_type: restaurantData.restaurantType,
        price_range: restaurantData.priceRange,
        website: restaurantData.website,
        description: restaurantData.description,
        operating_hours: restaurantData.operatingHours,
        social_media: restaurantData.socialMedia,
        brand_colors: restaurantData.brandColors,
        brand_voice: restaurantData.brandVoice,
        amenities: restaurantData.amenities,
        logo_url: restaurantData.logoUrl,
        cover_image_url: restaurantData.coverImageUrl,
        gallery_images: restaurantData.galleryImages,
        is_active: restaurantData.isActive,
        setup_completed: restaurantData.setupCompleted,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw new Error(`Failed to create restaurant: ${error.message}`)

    return this.mapRestaurantFromDB(data)
  }

  static async getRestaurantByUserId(userId: string): Promise<RestaurantProfile | null> {
    const supabase = this.getClient()
    const { data, error } = await supabase.from("restaurant_profiles").select("*").eq("user_id", userId).single()

    if (error && error.code !== "PGRST116") {
      throw new Error(`Failed to get restaurant: ${error.message}`)
    }

    if (!data) return null

    return this.mapRestaurantFromDB(data)
  }

  static async getRestaurantById(id: string): Promise<RestaurantProfile | null> {
    const supabase = this.getClient()
    const { data, error } = await supabase.from("restaurant_profiles").select("*").eq("id", id).single()

    if (error && error.code !== "PGRST116") {
      throw new Error(`Failed to get restaurant: ${error.message}`)
    }

    if (!data) return null

    return this.mapRestaurantFromDB(data)
  }

  static async updateRestaurant(id: string, updates: Partial<RestaurantProfile>): Promise<RestaurantProfile> {
    const supabase = this.getClient()
    const updateData: any = {}

    if (updates.restaurantName) updateData.restaurant_name = updates.restaurantName
    if (updates.tagline !== undefined) updateData.tagline = updates.tagline
    if (updates.email) updateData.email = updates.email
    if (updates.phone !== undefined) updateData.phone = updates.phone
    if (updates.address) updateData.address = updates.address
    if (updates.cuisineType) updateData.cuisine_type = updates.cuisineType
    if (updates.restaurantType) updateData.restaurant_type = updates.restaurantType
    if (updates.priceRange) updateData.price_range = updates.priceRange
    if (updates.website !== undefined) updateData.website = updates.website
    if (updates.description !== undefined) updateData.description = updates.description
    if (updates.operatingHours) updateData.operating_hours = updates.operatingHours
    if (updates.socialMedia) updateData.social_media = updates.socialMedia
    if (updates.brandColors) updateData.brand_colors = updates.brandColors
    if (updates.brandVoice !== undefined) updateData.brand_voice = updates.brandVoice
    if (updates.amenities) updateData.amenities = updates.amenities
    if (updates.logoUrl !== undefined) updateData.logo_url = updates.logoUrl
    if (updates.coverImageUrl !== undefined) updateData.cover_image_url = updates.coverImageUrl
    if (updates.galleryImages) updateData.gallery_images = updates.galleryImages
    if (updates.isActive !== undefined) updateData.is_active = updates.isActive
    if (updates.setupCompleted !== undefined) updateData.setup_completed = updates.setupCompleted
    updateData.updated_at = new Date().toISOString()

    const { data, error } = await supabase.from("restaurant_profiles").update(updateData).eq("id", id).select().single()

    if (error) throw new Error(`Failed to update restaurant: ${error.message}`)

    return this.mapRestaurantFromDB(data)
  }

  // Helper methods to map database objects to app objects
  private static mapRestaurantFromDB(data: any): RestaurantProfile {
    return {
      id: data.id,
      userId: data.user_id,
      restaurantName: data.restaurant_name,
      tagline: data.tagline,
      email: data.email,
      phone: data.phone,
      address: data.address,
      cuisineType: data.cuisine_type,
      restaurantType: data.restaurant_type,
      priceRange: data.price_range,
      website: data.website,
      description: data.description,
      operatingHours: data.operating_hours || {},
      socialMedia: data.social_media || {},
      brandColors: data.brand_colors || { primary: "#000000", secondary: "#666666" },
      brandVoice: data.brand_voice || "",
      amenities: data.amenities || [],
      logoUrl: data.logo_url,
      coverImageUrl: data.cover_image_url,
      galleryImages: data.gallery_images || [],
      isActive: data.is_active,
      setupCompleted: data.setup_completed,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  }
}
