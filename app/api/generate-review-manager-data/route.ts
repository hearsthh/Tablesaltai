import { type NextRequest, NextResponse } from "next/server"
import { generateReviewManagerMockData } from "@/lib/mock-data/review-manager-mock-generator"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { restaurantId, cuisine = "Indian" } = body

    if (!restaurantId) {
      return NextResponse.json({ error: "Restaurant ID is required" }, { status: 400 })
    }

    // Verify restaurant exists
    const supabase = getSupabaseServerClient()
    const { data: restaurant, error: restaurantError } = await supabase
      .from("restaurant_profiles")
      .select("id, restaurant_name, cuisine_type")
      .eq("id", restaurantId)
      .single()

    if (restaurantError || !restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
    }

    // Generate review manager mock data
    const result = await generateReviewManagerMockData(restaurantId, cuisine || restaurant.cuisine_type)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Review manager mock data generated successfully",
      restaurant: {
        id: restaurant.id,
        name: restaurant.restaurant_name,
        cuisine: restaurant.cuisine_type,
      },
      generated: result.generated,
    })
  } catch (error) {
    console.error("Error in generate review manager data API:", error)
    return NextResponse.json(
      {
        error: "Failed to generate review manager data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// Get review manager data for a restaurant
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get("restaurantId")

    if (!restaurantId) {
      return NextResponse.json({ error: "Restaurant ID is required" }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()

    // Get all review manager data
    const [reviewsResult, templatesResult, categoriesResult, tagsResult, analyticsResult, settingsResult] =
      await Promise.all([
        supabase
          .from("reviews")
          .select("*")
          .eq("restaurant_id", restaurantId)
          .order("review_date", { ascending: false })
          .limit(100),

        supabase.from("response_templates").select("*").eq("restaurant_id", restaurantId).eq("is_active", true),

        supabase.from("review_categories").select("*").eq("restaurant_id", restaurantId).eq("is_active", true),

        supabase.from("review_tags").select("*").eq("restaurant_id", restaurantId).eq("is_active", true),

        supabase
          .from("review_analytics")
          .select("*")
          .eq("restaurant_id", restaurantId)
          .order("analysis_date", { ascending: false })
          .limit(30),

        supabase.from("review_notification_settings").select("*").eq("restaurant_id", restaurantId).single(),
      ])

    // Calculate summary statistics
    const reviews = reviewsResult.data || []
    const totalReviews = reviews.length
    const avgRating = totalReviews > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0
    const responseRate = totalReviews > 0 ? (reviews.filter((r) => r.has_response).length / totalReviews) * 100 : 0

    const sentimentDistribution = {
      positive: reviews.filter((r) => r.sentiment === "positive").length,
      negative: reviews.filter((r) => r.sentiment === "negative").length,
      neutral: reviews.filter((r) => r.sentiment === "neutral").length,
    }

    const platformBreakdown = reviews.reduce(
      (acc, review) => {
        acc[review.platform] = (acc[review.platform] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Monthly trends (last 6 months)
    const monthlyTrends = []
    for (let i = 0; i < 6; i++) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)

      const monthReviews = reviews.filter((r) => {
        const reviewDate = new Date(r.review_date)
        return reviewDate >= monthStart && reviewDate <= monthEnd
      })

      monthlyTrends.unshift({
        month: date.toLocaleDateString("en-US", { year: "numeric", month: "short" }),
        reviews: monthReviews.length,
        avg_rating:
          monthReviews.length > 0 ? monthReviews.reduce((sum, r) => sum + r.rating, 0) / monthReviews.length : 0,
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        reviews: reviewsResult.data || [],
        response_templates: templatesResult.data || [],
        categories: categoriesResult.data || [],
        tags: tagsResult.data || [],
        analytics: analyticsResult.data || [],
        notification_settings: settingsResult.data,
        summary: {
          total_reviews: totalReviews,
          avg_rating: Math.round(avgRating * 10) / 10,
          response_rate: Math.round(responseRate * 10) / 10,
          sentiment_distribution: sentimentDistribution,
          platform_breakdown: platformBreakdown,
          monthly_trends: monthlyTrends,
        },
      },
    })
  } catch (error) {
    console.error("Error getting review manager data:", error)
    return NextResponse.json(
      {
        error: "Failed to get review manager data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
