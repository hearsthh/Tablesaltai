import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { generateMarketingContent, generateSocialMediaPost } from "@/lib/ai/openai"
import { generateImage } from "@/lib/ai/fal"

export const marketingService = {
  // Get campaigns
  async getCampaigns(restaurantId: string) {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from("marketing_campaigns")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("created_at", { ascending: false })

    if (error) {
      return { campaigns: [], error: error.message }
    }

    return { campaigns: data, error: null }
  },

  // Create campaign
  async createCampaign(restaurantId: string, campaignData: any) {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from("marketing_campaigns")
      .insert({
        restaurant_id: restaurantId,
        ...campaignData,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      return { campaign: null, error: error.message }
    }

    return { campaign: data, error: null }
  },

  // Update campaign
  async updateCampaign(campaignId: string, campaignData: any) {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from("marketing_campaigns")
      .update(campaignData)
      .eq("id", campaignId)
      .select()
      .single()

    if (error) {
      return { campaign: null, error: error.message }
    }

    return { campaign: data, error: null }
  },

  // Delete campaign
  async deleteCampaign(campaignId: string) {
    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase.from("marketing_campaigns").delete().eq("id", campaignId)

    if (error) {
      return { error: error.message }
    }

    return { error: null }
  },

  // Get social media posts
  async getSocialMediaPosts(restaurantId: string) {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from("social_media_posts")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("created_at", { ascending: false })

    if (error) {
      return { posts: [], error: error.message }
    }

    return { posts: data, error: null }
  },

  // Create social media post
  async createSocialMediaPost(restaurantId: string, postData: any) {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from("social_media_posts")
      .insert({
        restaurant_id: restaurantId,
        ...postData,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      return { post: null, error: error.message }
    }

    return { post: data, error: null }
  },

  // Generate marketing content
  async generateMarketingContent(contentData: any) {
    const { text, error } = await generateMarketingContent({
      type: contentData.type,
      topic: contentData.topic,
      tone: contentData.tone,
      keywords: contentData.keywords || [],
      length: contentData.length || "medium",
      audience: contentData.audience || "general",
    })

    if (error) {
      return { content: null, error }
    }

    return { content: text, error: null }
  },

  // Generate social media post
  async generateSocialPost(postData: any) {
    const { text, error } = await generateSocialMediaPost({
      platform: postData.platform,
      topic: postData.topic,
      tone: postData.tone || "casual",
      includeHashtags: postData.includeHashtags || true,
      restaurantName: postData.restaurantName,
    })

    if (error) {
      return { content: null, error }
    }

    return { content: text, error: null }
  },

  // Generate marketing image
  async generateMarketingImage(imageData: any) {
    const { imageUrl, error } = await generateImage(imageData.prompt, {
      width: imageData.width || 1200,
      height: imageData.height || 628,
      style: imageData.style || "photographic",
    })

    if (error) {
      return { imageUrl: null, error }
    }

    return { imageUrl, error: null }
  },

  // Get marketing calendar events
  async getMarketingCalendar(restaurantId: string) {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from("marketing_calendar")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("event_date", { ascending: true })

    if (error) {
      return { events: [], error: error.message }
    }

    return { events: data, error: null }
  },

  // Create calendar event
  async createCalendarEvent(restaurantId: string, eventData: any) {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from("marketing_calendar")
      .insert({
        restaurant_id: restaurantId,
        ...eventData,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      return { event: null, error: error.message }
    }

    return { event: data, error: null }
  },
}

// Server-side marketing service
export const serverMarketingService = {
  // Get marketing performance metrics
  async getMarketingPerformance(restaurantId: string) {
    const supabase = getSupabaseServerClient()

    // Get campaign metrics
    const { data: campaignMetrics, error: campaignError } = await supabase
      .from("marketing_metrics")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("date", { ascending: false })
      .limit(30)

    if (campaignError) {
      return { metrics: null, error: campaignError.message }
    }

    // Get social media metrics
    const { data: socialMetrics, error: socialError } = await supabase
      .from("social_media_metrics")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("date", { ascending: false })
      .limit(30)

    if (socialError) {
      return { metrics: null, error: socialError.message }
    }

    // Combine metrics
    const metrics = {
      campaigns: campaignMetrics,
      social: socialMetrics,
    }

    return { metrics, error: null }
  },
}
