import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export interface ProfileAnalytics {
  socialProfile: {
    platforms: number
    profileViews: number
    completeness: number
    lastUpdated: string
    connectedPlatforms: string[]
    missingFields: string[]
  }
  menuManager: {
    menuItems: number
    categories: number
    aiDescriptions: number
    totalDescriptions: number
    avgPrice: number
    lastMenuUpdate: string
    popularItems: Array<{ name: string; orders: number }>
  }
  reviewManager: {
    totalReviews: number
    avgRating: number
    responseRate: number
    sentiment: "positive" | "neutral" | "negative"
    platformBreakdown: Record<string, { reviews: number; rating: number }>
    recentResponses: number
  }
  integrations: {
    totalPlatforms: number
    connectedPlatforms: number
    connectionHealth: Record<string, "healthy" | "warning" | "error">
    lastSync: string
    syncErrors: string[]
  }
}

export class ProfileAnalyticsService {
  private supabase = getSupabaseBrowserClient()

  // Calculate Social Profile Analytics
  async getSocialProfileAnalytics(restaurantId: string): Promise<ProfileAnalytics["socialProfile"]> {
    try {
      // Get restaurant profile data - handle case where profile doesn't exist
      const { data: profile, error: profileError } = await this.supabase
        .from("restaurant_profiles")
        .select("*")
        .eq("id", restaurantId)
        .maybeSingle()

      // If no profile exists, return default values
      if (!profile || profileError) {
        console.log("No profile found, returning default values")
        return {
          platforms: 0,
          profileViews: 0,
          completeness: 0,
          lastUpdated: new Date().toISOString(),
          connectedPlatforms: [],
          missingFields: [
            "name",
            "description",
            "cuisine",
            "phone",
            "email",
            "address",
            "logo_url",
            "operating_hours",
            "social_media",
          ],
        }
      }

      // Calculate completeness based on filled fields
      const requiredFields = [
        "name",
        "description",
        "cuisine",
        "phone",
        "email",
        "address",
        "logo_url",
        "operating_hours",
        "social_media",
      ]

      const filledFields = requiredFields.filter((field) => {
        const value = profile[field]
        if (typeof value === "object") {
          return value && Object.keys(value).length > 0
        }
        return value && value.toString().trim().length > 0
      })

      const completeness = Math.round((filledFields.length / requiredFields.length) * 100)

      // Get connected platforms - handle case where table doesn't exist
      const { data: integrations, error: integrationsError } = await this.supabase
        .from("platform_integrations")
        .select("platform_name, status")
        .eq("restaurant_id", restaurantId)
        .eq("status", "connected")

      const connectedPlatforms = integrations?.map((i) => i.platform_name) || []

      // Get profile views - handle case where table doesn't exist
      const { data: viewsData, error: viewsError } = await this.supabase
        .from("profile_views")
        .select("count")
        .eq("restaurant_id", restaurantId)
        .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

      const profileViews = viewsData?.reduce((sum, record) => sum + (record.count || 0), 0) || 0

      return {
        platforms: connectedPlatforms.length,
        profileViews,
        completeness,
        lastUpdated: profile.updated_at || profile.created_at || new Date().toISOString(),
        connectedPlatforms,
        missingFields: requiredFields.filter((field) => !filledFields.includes(field)),
      }
    } catch (error) {
      console.error("Error calculating social profile analytics:", error)
      // Return safe fallback data
      return {
        platforms: 0,
        profileViews: 0,
        completeness: 0,
        lastUpdated: new Date().toISOString(),
        connectedPlatforms: [],
        missingFields: [
          "name",
          "description",
          "cuisine",
          "phone",
          "email",
          "address",
          "logo_url",
          "operating_hours",
          "social_media",
        ],
      }
    }
  }

  // Calculate Menu Manager Analytics
  async getMenuAnalytics(restaurantId: string): Promise<ProfileAnalytics["menuManager"]> {
    try {
      // Get menu items count - handle case where table doesn't exist
      const { data: menuItems, error: menuError } = await this.supabase
        .from("menu_items")
        .select("id, name, description, price, category_id, ai_generated, updated_at, created_at")
        .eq("restaurant_id", restaurantId)

      // Get categories count - handle case where table doesn't exist
      const { data: categories, error: categoriesError } = await this.supabase
        .from("menu_categories")
        .select("id")
        .eq("restaurant_id", restaurantId)

      const totalItems = menuItems?.length || 0
      const totalCategories = categories?.length || 0
      const aiDescriptions = menuItems?.filter((item) => item.ai_generated).length || 0

      // Calculate average price
      const prices = menuItems?.map((item) => item.price).filter((price) => price > 0) || []
      const avgPrice = prices.length > 0 ? prices.reduce((sum, price) => sum + price, 0) / prices.length : 0

      // Get last menu update
      const lastUpdate = menuItems?.reduce((latest, item) => {
        const itemDate = new Date(item.updated_at || item.created_at || 0)
        return itemDate > latest ? itemDate : latest
      }, new Date(0))

      // Get popular items - handle case where table doesn't exist
      const { data: orderData, error: orderError } = await this.supabase
        .from("order_items")
        .select("menu_item_id, count")
        .eq("restaurant_id", restaurantId)
        .order("count", { ascending: false })
        .limit(5)

      const popularItems =
        orderData?.map((order) => {
          const item = menuItems?.find((item) => item.id === order.menu_item_id)
          return {
            name: item?.name || "Unknown Item",
            orders: order.count || 0,
          }
        }) || []

      return {
        menuItems: totalItems,
        categories: totalCategories,
        aiDescriptions,
        totalDescriptions: totalItems,
        avgPrice: Math.round(avgPrice),
        lastMenuUpdate: lastUpdate?.toISOString() || new Date().toISOString(),
        popularItems,
      }
    } catch (error) {
      console.error("Error calculating menu analytics:", error)
      return {
        menuItems: 0,
        categories: 0,
        aiDescriptions: 0,
        totalDescriptions: 0,
        avgPrice: 0,
        lastMenuUpdate: new Date().toISOString(),
        popularItems: [],
      }
    }
  }

  // Calculate Review Manager Analytics
  async getReviewAnalytics(restaurantId: string): Promise<ProfileAnalytics["reviewManager"]> {
    try {
      // Get all reviews - handle case where table doesn't exist
      const { data: reviews, error: reviewsError } = await this.supabase
        .from("reviews")
        .select("rating, platform, sentiment, response, responded_at")
        .eq("restaurant_id", restaurantId)

      const totalReviews = reviews?.length || 0

      // Calculate average rating
      const ratings = reviews?.map((r) => r.rating).filter((r) => r > 0) || []
      const avgRating = ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0

      // Calculate response rate
      const reviewsWithResponse = reviews?.filter((r) => r.response && r.response.trim().length > 0).length || 0
      const responseRate = totalReviews > 0 ? Math.round((reviewsWithResponse / totalReviews) * 100) : 0

      // Calculate overall sentiment
      const sentiments = reviews?.map((r) => r.sentiment).filter((s) => s) || []
      const positiveCount = sentiments.filter((s) => s === "positive").length
      const negativeCount = sentiments.filter((s) => s === "negative").length
      const neutralCount = sentiments.filter((s) => s === "neutral").length

      let overallSentiment: "positive" | "neutral" | "negative" = "neutral"
      if (positiveCount > negativeCount && positiveCount > neutralCount) {
        overallSentiment = "positive"
      } else if (negativeCount > positiveCount && negativeCount > neutralCount) {
        overallSentiment = "negative"
      }

      // Platform breakdown
      const platformBreakdown: Record<string, { reviews: number; rating: number }> = {}
      reviews?.forEach((review) => {
        if (!platformBreakdown[review.platform]) {
          platformBreakdown[review.platform] = { reviews: 0, rating: 0 }
        }
        platformBreakdown[review.platform].reviews++
        platformBreakdown[review.platform].rating += review.rating
      })

      // Calculate average ratings per platform
      Object.keys(platformBreakdown).forEach((platform) => {
        const data = platformBreakdown[platform]
        data.rating = data.reviews > 0 ? data.rating / data.reviews : 0
      })

      // Recent responses (last 7 days)
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      const recentResponses = reviews?.filter((r) => r.responded_at && r.responded_at > weekAgo).length || 0

      return {
        totalReviews,
        avgRating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
        responseRate,
        sentiment: overallSentiment,
        platformBreakdown,
        recentResponses,
      }
    } catch (error) {
      console.error("Error calculating review analytics:", error)
      return {
        totalReviews: 0,
        avgRating: 0,
        responseRate: 0,
        sentiment: "neutral",
        platformBreakdown: {},
        recentResponses: 0,
      }
    }
  }

  // Calculate Integration Analytics
  async getIntegrationAnalytics(restaurantId: string): Promise<ProfileAnalytics["integrations"]> {
    try {
      // Get all platform integrations - handle case where table doesn't exist
      const { data: integrations, error: integrationsError } = await this.supabase
        .from("platform_integrations")
        .select("platform_name, status, last_sync, error_message")
        .eq("restaurant_id", restaurantId)

      const totalPlatforms = 12 // Total available platforms
      const connectedPlatforms = integrations?.filter((i) => i.status === "connected").length || 0

      // Check connection health
      const connectionHealth: Record<string, "healthy" | "warning" | "error"> = {}
      integrations?.forEach((integration) => {
        const { platform_name, status, last_sync, error_message } = integration

        if (status === "error" || error_message) {
          connectionHealth[platform_name] = "error"
        } else if (status === "connected") {
          // Check if last sync was more than 24 hours ago
          const lastSyncDate = new Date(last_sync || 0)
          const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

          if (lastSyncDate < dayAgo) {
            connectionHealth[platform_name] = "warning"
          } else {
            connectionHealth[platform_name] = "healthy"
          }
        }
      })

      // Get most recent sync time
      const lastSync = integrations?.reduce((latest, integration) => {
        const syncDate = new Date(integration.last_sync || 0)
        return syncDate > latest ? syncDate : latest
      }, new Date(0))

      // Get sync errors
      const syncErrors =
        integrations?.filter((i) => i.error_message).map((i) => `${i.platform_name}: ${i.error_message}`) || []

      return {
        totalPlatforms,
        connectedPlatforms,
        connectionHealth,
        lastSync: lastSync?.toISOString() || new Date().toISOString(),
        syncErrors,
      }
    } catch (error) {
      console.error("Error calculating integration analytics:", error)
      return {
        totalPlatforms: 12,
        connectedPlatforms: 0,
        connectionHealth: {},
        lastSync: new Date().toISOString(),
        syncErrors: [],
      }
    }
  }

  // Get complete profile analytics
  async getCompleteAnalytics(restaurantId: string): Promise<ProfileAnalytics> {
    const [socialProfile, menuManager, reviewManager, integrations] = await Promise.all([
      this.getSocialProfileAnalytics(restaurantId),
      this.getMenuAnalytics(restaurantId),
      this.getReviewAnalytics(restaurantId),
      this.getIntegrationAnalytics(restaurantId),
    ])

    return {
      socialProfile,
      menuManager,
      reviewManager,
      integrations,
    }
  }

  // Calculate progress percentage for each module
  calculateModuleProgress(analytics: ProfileAnalytics) {
    return {
      socialProfile: analytics.socialProfile.completeness,
      menuManager: Math.min(
        100,
        Math.round(
          (analytics.menuManager.menuItems * 10 +
            analytics.menuManager.aiDescriptions * 5 +
            analytics.menuManager.categories * 15) /
            2,
        ),
      ),
      reviewManager: Math.min(
        100,
        Math.round((analytics.reviewManager.responseRate + (analytics.reviewManager.totalReviews > 0 ? 50 : 0)) / 1.5),
      ),
      integrations: Math.round(
        (analytics.integrations.connectedPlatforms / analytics.integrations.totalPlatforms) * 100,
      ),
    }
  }

  // Create mock data for demonstration purposes
  async getMockAnalytics(): Promise<ProfileAnalytics> {
    return {
      socialProfile: {
        platforms: 8,
        profileViews: 2400,
        completeness: 85,
        lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        connectedPlatforms: [
          "Google My Business",
          "Zomato",
          "Swiggy",
          "Facebook",
          "Instagram",
          "Yelp",
          "TripAdvisor",
          "OpenTable",
        ],
        missingFields: ["social_media"],
      },
      menuManager: {
        menuItems: 47,
        categories: 6,
        aiDescriptions: 32,
        totalDescriptions: 47,
        avgPrice: 285,
        lastMenuUpdate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        popularItems: [
          { name: "Butter Chicken", orders: 156 },
          { name: "Biryani", orders: 134 },
          { name: "Paneer Tikka", orders: 98 },
          { name: "Dal Makhani", orders: 87 },
          { name: "Naan", orders: 76 },
        ],
      },
      reviewManager: {
        totalReviews: 156,
        avgRating: 4.2,
        responseRate: 78,
        sentiment: "positive",
        platformBreakdown: {
          Google: { reviews: 67, rating: 4.3 },
          Zomato: { reviews: 45, rating: 4.1 },
          Swiggy: { reviews: 32, rating: 4.0 },
          Yelp: { reviews: 12, rating: 4.4 },
        },
        recentResponses: 12,
      },
      integrations: {
        totalPlatforms: 12,
        connectedPlatforms: 8,
        connectionHealth: {
          "Google My Business": "healthy",
          Zomato: "healthy",
          Swiggy: "warning",
          Facebook: "healthy",
          Instagram: "healthy",
          Yelp: "healthy",
          TripAdvisor: "error",
          OpenTable: "healthy",
        },
        lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        syncErrors: ["TripAdvisor: API rate limit exceeded"],
      },
    }
  }
}

export const profileAnalyticsService = new ProfileAnalyticsService()
