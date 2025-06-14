import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { analyzeReviewSentiment } from "@/lib/ai/deepinfra"

export const reviewService = {
  // Get reviews
  async getReviews(restaurantId: string, platform?: string) {
    const supabase = getSupabaseBrowserClient()
    let query = supabase
      .from("reviews")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("date", { ascending: false })

    if (platform) {
      query = query.eq("platform", platform)
    }

    const { data, error } = await query

    if (error) {
      return { reviews: [], error: error.message }
    }

    return { reviews: data, error: null }
  },

  // Add review
  async addReview(restaurantId: string, reviewData: any) {
    const supabase = getSupabaseBrowserClient()

    // Analyze sentiment
    const { sentiment } = await analyzeReviewSentiment(reviewData.text)

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        restaurant_id: restaurantId,
        ...reviewData,
        sentiment: sentiment || "neutral",
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      return { review: null, error: error.message }
    }

    return { review: data, error: null }
  },

  // Update review response
  async updateReviewResponse(reviewId: string, response: string) {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from("reviews")
      .update({
        response,
        responded_at: new Date().toISOString(),
      })
      .eq("id", reviewId)
      .select()
      .single()

    if (error) {
      return { review: null, error: error.message }
    }

    return { review: data, error: null }
  },

  // Get review metrics
  async getReviewMetrics(restaurantId: string) {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from("review_metrics")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("date", { ascending: false })
      .limit(30)

    if (error) {
      return { metrics: [], error: error.message }
    }

    return { metrics: data, error: null }
  },
}

// Server-side review service
export const serverReviewService = {
  // Get review analytics
  async getReviewAnalytics(restaurantId: string) {
    const supabase = getSupabaseServerClient()

    // Get average ratings by platform
    const { data: platformRatings, error: platformError } = await supabase
      .from("reviews")
      .select("platform, avg(rating)")
      .eq("restaurant_id", restaurantId)
      .group("platform")

    if (platformError) {
      return { analytics: null, error: platformError.message }
    }

    // Get sentiment distribution
    const { data: sentimentDistribution, error: sentimentError } = await supabase
      .from("reviews")
      .select("sentiment, count(*)")
      .eq("restaurant_id", restaurantId)
      .group("sentiment")

    if (sentimentError) {
      return { analytics: null, error: sentimentError.message }
    }

    // Get rating trends
    const { data: ratingTrends, error: trendsError } = await supabase
      .from("review_metrics")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("date", { ascending: true })
      .limit(12)

    if (trendsError) {
      return { analytics: null, error: trendsError.message }
    }

    // Combine analytics
    const analytics = {
      platformRatings,
      sentimentDistribution,
      ratingTrends,
    }

    return { analytics, error: null }
  },
}
