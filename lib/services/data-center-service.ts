import { createClient } from "@supabase/supabase-js"
import type { Restaurant, MediaAsset, Review, Customer, Campaign, MenuData, Integration } from "@/lib/types/core"

export class DataCenterService {
  private supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  // Restaurant Data Management
  async createRestaurant(restaurantData: Partial<Restaurant>): Promise<Restaurant> {
    const { data, error } = await this.supabase.from("restaurants").insert(restaurantData).select().single()

    if (error) throw new Error(`Failed to create restaurant: ${error.message}`)
    return data
  }

  async updateRestaurant(id: string, updates: Partial<Restaurant>): Promise<Restaurant> {
    const { data, error } = await this.supabase.from("restaurants").update(updates).eq("id", id).select().single()

    if (error) throw new Error(`Failed to update restaurant: ${error.message}`)
    return data
  }

  async getRestaurant(id: string): Promise<Restaurant | null> {
    const { data, error } = await this.supabase
      .from("restaurants")
      .select(`
        *,
        media_assets(*),
        menu_categories(*),
        menu_items(*),
        reviews(*),
        customers(*),
        campaigns(*)
      `)
      .eq("id", id)
      .single()

    if (error && error.code !== "PGRST116") {
      throw new Error(`Failed to get restaurant: ${error.message}`)
    }

    return data
  }

  // Media Asset Management
  async uploadMediaAsset(file: File, metadata: Partial<MediaAsset>): Promise<MediaAsset> {
    // Upload to Supabase Storage
    const fileName = `${Date.now()}-${file.name}`
    const { data: uploadData, error: uploadError } = await this.supabase.storage
      .from("restaurant-media")
      .upload(fileName, file)

    if (uploadError) throw new Error(`Failed to upload file: ${uploadError.message}`)

    // Get public URL
    const {
      data: { publicUrl },
    } = this.supabase.storage.from("restaurant-media").getPublicUrl(fileName)

    // Save metadata to database
    const assetData = {
      ...metadata,
      url: publicUrl,
      metadata: {
        size: file.size,
        format: file.type,
        uploadedAt: new Date().toISOString(),
        uploadedBy: metadata.uploadedBy || "system",
      },
    }

    const { data, error } = await this.supabase.from("media_assets").insert(assetData).select().single()

    if (error) throw new Error(`Failed to save media asset: ${error.message}`)
    return data
  }

  async getMediaAssets(
    restaurantId: string,
    filters?: {
      category?: string
      type?: "image" | "video"
      isFeatured?: boolean
    },
  ): Promise<MediaAsset[]> {
    let query = this.supabase
      .from("media_assets")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .eq("is_active", true)
      .order("display_order")

    if (filters?.category) query = query.eq("category", filters.category)
    if (filters?.type) query = query.eq("type", filters.type)
    if (filters?.isFeatured !== undefined) query = query.eq("is_featured", filters.isFeatured)

    const { data, error } = await query

    if (error) throw new Error(`Failed to get media assets: ${error.message}`)
    return data || []
  }

  // Menu Data Management
  async syncMenuData(restaurantId: string, menuData: Partial<MenuData>): Promise<void> {
    const { error } = await this.supabase.rpc("sync_menu_data", {
      restaurant_id: restaurantId,
      menu_data: menuData,
    })

    if (error) throw new Error(`Failed to sync menu data: ${error.message}`)
  }

  async getMenuAnalytics(
    restaurantId: string,
    dateRange?: {
      start: string
      end: string
    },
  ): Promise<any> {
    const { data, error } = await this.supabase.rpc("get_menu_analytics", {
      restaurant_id: restaurantId,
      start_date: dateRange?.start,
      end_date: dateRange?.end,
    })

    if (error) throw new Error(`Failed to get menu analytics: ${error.message}`)
    return data
  }

  // Review Data Management
  async syncReviewData(restaurantId: string, platform: string, reviews: Review[]): Promise<void> {
    const reviewsWithMetadata = reviews.map((review) => ({
      ...review,
      restaurant_id: restaurantId,
      platform,
      synced_at: new Date().toISOString(),
    }))

    const { error } = await this.supabase
      .from("reviews")
      .upsert(reviewsWithMetadata, { onConflict: "platform_review_id" })

    if (error) throw new Error(`Failed to sync review data: ${error.message}`)
  }

  async getReviewAnalytics(restaurantId: string): Promise<any> {
    const { data, error } = await this.supabase.rpc("get_review_analytics", {
      restaurant_id: restaurantId,
    })

    if (error) throw new Error(`Failed to get review analytics: ${error.message}`)
    return data
  }

  // Customer Data Management
  async syncCustomerData(restaurantId: string, customers: Customer[]): Promise<void> {
    const customersWithMetadata = customers.map((customer) => ({
      ...customer,
      restaurant_id: restaurantId,
      synced_at: new Date().toISOString(),
    }))

    const { error } = await this.supabase.from("customers").upsert(customersWithMetadata, { onConflict: "email" })

    if (error) throw new Error(`Failed to sync customer data: ${error.message}`)
  }

  async getCustomerSegments(restaurantId: string): Promise<any> {
    const { data, error } = await this.supabase.rpc("get_customer_segments", {
      restaurant_id: restaurantId,
    })

    if (error) throw new Error(`Failed to get customer segments: ${error.message}`)
    return data
  }

  // Marketing Data Management
  async saveCampaign(campaignData: Partial<Campaign>): Promise<Campaign> {
    const { data, error } = await this.supabase.from("campaigns").insert(campaignData).select().single()

    if (error) throw new Error(`Failed to save campaign: ${error.message}`)
    return data
  }

  async getCampaignPerformance(campaignId: string): Promise<any> {
    const { data, error } = await this.supabase.rpc("get_campaign_performance", {
      campaign_id: campaignId,
    })

    if (error) throw new Error(`Failed to get campaign performance: ${error.message}`)
    return data
  }

  // Integration Management
  async saveIntegration(integrationData: Partial<Integration>): Promise<Integration> {
    const { data, error } = await this.supabase
      .from("integrations")
      .upsert(integrationData, { onConflict: "restaurant_id,platform" })
      .select()
      .single()

    if (error) throw new Error(`Failed to save integration: ${error.message}`)
    return data
  }

  async getIntegrations(restaurantId: string): Promise<Integration[]> {
    const { data, error } = await this.supabase.from("integrations").select("*").eq("restaurant_id", restaurantId)

    if (error) throw new Error(`Failed to get integrations: ${error.message}`)
    return data || []
  }

  // Analytics and Reporting
  async getRestaurantAnalytics(
    restaurantId: string,
    dateRange?: {
      start: string
      end: string
    },
  ): Promise<any> {
    const { data, error } = await this.supabase.rpc("get_restaurant_analytics", {
      restaurant_id: restaurantId,
      start_date: dateRange?.start,
      end_date: dateRange?.end,
    })

    if (error) throw new Error(`Failed to get restaurant analytics: ${error.message}`)
    return data
  }
}
