import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import type { ReviewData, ChannelMetrics, ReviewContent, NewReviewSession } from "@/lib/types/review-data"

const DEMO_USER_ID = "550e8400-e29b-41d4-a716-446655440000"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get("restaurantId") || DEMO_USER_ID
    const includeContent = searchParams.get("includeContent") === "true"
    const sessionId = searchParams.get("sessionId")

    const supabase = getSupabaseServerClient()

    // Get review data
    const { data: reviewData, error } = await supabase
      .from("review_data")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .single()

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching review data:", error)
      return NextResponse.json(getDemoReviewData(restaurantId, includeContent, sessionId), { status: 200 })
    }

    if (!reviewData) {
      return NextResponse.json(getDemoReviewData(restaurantId, includeContent, sessionId), { status: 200 })
    }

    // Parse stored data
    const parsedData: ReviewData = {
      id: reviewData.id,
      restaurantId: reviewData.restaurant_id,
      channelMetrics: reviewData.channel_metrics || [],
      allReviews: includeContent ? reviewData.all_reviews || [] : [],
      newReviews: sessionId ? getNewReviewsForSession(reviewData.new_reviews || [], sessionId) : [],
      lastUpdated: reviewData.last_updated,
      totalChannels: reviewData.total_channels || 0,
      overallRating: reviewData.overall_rating || 0,
      totalReviewCount: reviewData.total_review_count || 0,
    }

    return NextResponse.json(parsedData)
  } catch (error) {
    console.error("Review data API error:", error)
    return NextResponse.json(getDemoReviewData(DEMO_USER_ID, false), { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reviewData, action = "save", channelId, sessionId } = body

    const supabase = getSupabaseServerClient()

    if (action === "sync_channel") {
      // Sync specific channel
      const syncResult = await syncChannelReviews(channelId, reviewData.restaurantId)
      return NextResponse.json(syncResult)
    }

    if (action === "sync_all") {
      // Sync all connected channels
      const syncResult = await syncAllChannels(reviewData.restaurantId)
      return NextResponse.json(syncResult)
    }

    if (action === "create_session") {
      // Create new review session
      const session = await createNewReviewSession(reviewData.restaurantId, sessionId)
      return NextResponse.json(session)
    }

    // Calculate completion status
    const completionStatus = calculateReviewCompletionStatus(reviewData)

    // Save review data
    const { data, error } = await supabase
      .from("review_data")
      .upsert({
        id: reviewData.id || `review_${Date.now()}`,
        restaurant_id: reviewData.restaurantId,
        channel_metrics: reviewData.channelMetrics,
        all_reviews: reviewData.allReviews,
        new_reviews: reviewData.newReviews,
        total_channels: reviewData.totalChannels,
        overall_rating: reviewData.overallRating,
        total_review_count: reviewData.totalReviewCount,
        completion_status: completionStatus,
        last_updated: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error saving review data:", error)
      throw new Error(`Failed to save review data: ${error.message}`)
    }

    return NextResponse.json({
      success: true,
      data: data,
      completionStatus,
      message: "Review data saved successfully",
    })
  } catch (error) {
    console.error("Review data save error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to save review data",
      },
      { status: 500 },
    )
  }
}

// Helper functions
function calculateReviewCompletionStatus(reviewData: Partial<ReviewData>) {
  const status = {
    channelConnections: 0,
    syncSettings: 0,
    responseTemplates: 0,
    testSync: 0,
    overall: 0,
  }

  // Channel connections (40% weight)
  const connectedChannels = reviewData.channelMetrics?.filter((c) => c.isConnected).length || 0
  status.channelConnections = Math.min(100, connectedChannels * 25) // 4 channels = 100%

  // Sync settings (20% weight)
  const hasValidSync = reviewData.channelMetrics?.some((c) => c.syncStatus === "success") || false
  status.syncSettings = hasValidSync ? 100 : 0

  // Response templates (20% weight)
  status.responseTemplates = 0 // Will be implemented with response management

  // Test sync (20% weight)
  const hasRecentSync =
    reviewData.lastUpdated && new Date(reviewData.lastUpdated) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  status.testSync = hasRecentSync ? 100 : 0

  // Overall calculation
  status.overall = Math.round(
    status.channelConnections * 0.4 +
      status.syncSettings * 0.2 +
      status.responseTemplates * 0.2 +
      status.testSync * 0.2,
  )

  return status
}

async function syncChannelReviews(channelId: string, restaurantId: string) {
  // Mock channel sync - in production, this would call actual APIs
  await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API call

  const mockReviews: ReviewContent[] = [
    {
      id: `review_${Date.now()}_1`,
      channelId,
      channelName: getChannelName(channelId),
      reviewId: `ext_${Date.now()}_1`,
      customerName: "Sarah Johnson",
      rating: 5,
      title: "Amazing experience!",
      content: "The food was absolutely delicious and the service was outstanding. Will definitely come back!",
      timestamp: new Date().toISOString(),
      reviewDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      isVerified: true,
      sentiment: "positive",
      sentimentScore: 0.9,
      keywords: ["delicious", "outstanding", "service"],
      topics: ["food quality", "service"],
      language: "en",
      metadata: {
        platform: getChannelName(channelId),
        source: "api",
        confidence: 0.95,
      },
    },
    {
      id: `review_${Date.now()}_2`,
      channelId,
      channelName: getChannelName(channelId),
      reviewId: `ext_${Date.now()}_2`,
      customerName: "Mike Chen",
      rating: 4,
      content: "Good food and nice atmosphere. The wait time was a bit long but worth it.",
      timestamp: new Date().toISOString(),
      reviewDate: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
      isVerified: true,
      sentiment: "positive",
      sentimentScore: 0.7,
      keywords: ["good", "atmosphere", "wait time"],
      topics: ["food quality", "ambiance", "service speed"],
      language: "en",
      metadata: {
        platform: getChannelName(channelId),
        source: "api",
        confidence: 0.88,
      },
    },
  ]

  return {
    success: true,
    channelId,
    newReviews: mockReviews,
    totalSynced: mockReviews.length,
    avgRating: mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length,
    lastSync: new Date().toISOString(),
  }
}

async function syncAllChannels(restaurantId: string) {
  // Mock sync all channels
  const channels = ["google", "yelp", "zomato", "facebook"]
  const results = []

  for (const channelId of channels) {
    const result = await syncChannelReviews(channelId, restaurantId)
    results.push(result)
  }

  return {
    success: true,
    channelResults: results,
    totalNewReviews: results.reduce((sum, r) => sum + r.totalSynced, 0),
    syncTime: new Date().toISOString(),
  }
}

async function createNewReviewSession(restaurantId: string, sessionId?: string): Promise<NewReviewSession> {
  const session: NewReviewSession = {
    sessionId: sessionId || `session_${Date.now()}`,
    loginTime: new Date().toISOString(),
    newReviews: [],
    channelUpdates: [],
    summary: {
      totalNewReviews: 0,
      averageRating: 0,
      positiveReviews: 0,
      negativeReviews: 0,
      neutralReviews: 0,
      channelsUpdated: 0,
      overallRatingChange: 0,
      requiresAttention: [],
      highlights: [],
    },
  }

  // In production, this would check for new reviews since last login
  // For demo, we'll simulate some new reviews
  const mockNewReviews: ReviewContent[] = [
    {
      id: `new_review_${Date.now()}`,
      channelId: "google",
      channelName: "Google My Business",
      reviewId: `google_${Date.now()}`,
      customerName: "Emma Wilson",
      rating: 5,
      title: "Perfect dinner!",
      content: "Had an amazing dinner here last night. The pasta was cooked to perfection!",
      timestamp: new Date().toISOString(),
      reviewDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      isVerified: true,
      sentiment: "positive",
      sentimentScore: 0.95,
      keywords: ["amazing", "perfect", "pasta"],
      topics: ["food quality"],
      language: "en",
      metadata: {
        platform: "Google My Business",
        source: "api",
        confidence: 0.92,
      },
    },
  ]

  session.newReviews = mockNewReviews
  session.summary.totalNewReviews = mockNewReviews.length
  session.summary.positiveReviews = mockNewReviews.filter((r) => r.sentiment === "positive").length
  session.summary.averageRating = mockNewReviews.reduce((sum, r) => sum + r.rating, 0) / mockNewReviews.length

  return session
}

function getNewReviewsForSession(allSessions: NewReviewSession[], sessionId: string): NewReviewSession[] {
  return allSessions.filter((session) => session.sessionId === sessionId)
}

function getChannelName(channelId: string): string {
  const channelNames: { [key: string]: string } = {
    google: "Google My Business",
    yelp: "Yelp",
    zomato: "Zomato",
    tripadvisor: "TripAdvisor",
    facebook: "Facebook",
    direct: "Direct Reviews",
  }
  return channelNames[channelId] || channelId
}

function getDemoReviewData(restaurantId: string, includeContent = false, sessionId?: string): ReviewData {
  const channelMetrics: ChannelMetrics[] = [
    {
      channelId: "google",
      channelName: "Google My Business",
      channelType: "google",
      isConnected: true,
      avgRating: 4.3,
      ratingCount: 127,
      lastSyncTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min ago
      syncStatus: "success",
      channelUrl: "https://business.google.com",
      channelLogo: "/logos/google.png",
    },
    {
      channelId: "yelp",
      channelName: "Yelp",
      channelType: "yelp",
      isConnected: true,
      avgRating: 4.1,
      ratingCount: 89,
      lastSyncTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 min ago
      syncStatus: "success",
      channelUrl: "https://business.yelp.com",
      channelLogo: "/logos/yelp.png",
    },
    {
      channelId: "zomato",
      channelName: "Zomato",
      channelType: "zomato",
      isConnected: true,
      avgRating: 4.2,
      ratingCount: 156,
      lastSyncTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
      syncStatus: "success",
      channelUrl: "https://business.zomato.com",
      channelLogo: "/logos/zomato.png",
    },
    {
      channelId: "tripadvisor",
      channelName: "TripAdvisor",
      channelType: "tripadvisor",
      isConnected: false,
      avgRating: 0,
      ratingCount: 0,
      lastSyncTime: "",
      syncStatus: "never",
      channelUrl: "https://business.tripadvisor.com",
      channelLogo: "/logos/tripadvisor.png",
    },
    {
      channelId: "facebook",
      channelName: "Facebook",
      channelType: "facebook",
      isConnected: true,
      avgRating: 4.4,
      ratingCount: 73,
      lastSyncTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      syncStatus: "success",
      channelUrl: "https://business.facebook.com",
      channelLogo: "/logos/facebook.png",
    },
  ]

  const allReviews: ReviewContent[] = includeContent
    ? [
        {
          id: "review_1",
          channelId: "google",
          channelName: "Google My Business",
          reviewId: "google_review_1",
          customerName: "Sarah Johnson",
          customerAvatar: "/placeholder.svg?height=40&width=40",
          rating: 5,
          title: "Amazing experience!",
          content:
            "The food was absolutely delicious and the service was outstanding. The ambiance was perfect for our anniversary dinner. Will definitely come back!",
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          reviewDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          isVerified: true,
          helpfulCount: 12,
          sentiment: "positive",
          sentimentScore: 0.92,
          keywords: ["delicious", "outstanding", "perfect", "anniversary"],
          topics: ["food quality", "service", "ambiance"],
          language: "en",
          originalUrl: "https://maps.google.com/review/123",
          metadata: {
            platform: "Google My Business",
            deviceType: "mobile",
            orderType: "dine-in",
            visitType: "special occasion",
            partySize: 2,
            source: "api",
            confidence: 0.95,
          },
        },
        {
          id: "review_2",
          channelId: "yelp",
          channelName: "Yelp",
          reviewId: "yelp_review_1",
          customerName: "Mike Chen",
          customerAvatar: "/placeholder.svg?height=40&width=40",
          rating: 4,
          content:
            "Good food and nice atmosphere. The pasta was excellent, though the wait time was a bit long. Staff was friendly and accommodating.",
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          reviewDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          isVerified: true,
          helpfulCount: 8,
          sentiment: "positive",
          sentimentScore: 0.75,
          keywords: ["good", "excellent", "friendly", "wait time"],
          topics: ["food quality", "service speed", "staff"],
          language: "en",
          originalUrl: "https://yelp.com/review/456",
          responseFromOwner: {
            id: "response_1",
            content:
              "Thank you for your feedback, Mike! We're glad you enjoyed the pasta. We're working on reducing wait times during peak hours. Hope to see you again soon!",
            timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            respondedBy: "Restaurant Owner",
            isAiGenerated: false,
          },
          metadata: {
            platform: "Yelp",
            deviceType: "desktop",
            orderType: "dine-in",
            visitType: "casual",
            partySize: 3,
            source: "api",
            confidence: 0.88,
          },
        },
        {
          id: "review_3",
          channelId: "zomato",
          channelName: "Zomato",
          reviewId: "zomato_review_1",
          customerName: "Priya Sharma",
          customerAvatar: "/placeholder.svg?height=40&width=40",
          rating: 5,
          title: "Best Indian food in the city!",
          content:
            "Authentic flavors, generous portions, and excellent service. The butter chicken and naan were phenomenal. Highly recommend!",
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          reviewDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          isVerified: true,
          helpfulCount: 15,
          sentiment: "positive",
          sentimentScore: 0.96,
          keywords: ["authentic", "generous", "excellent", "phenomenal"],
          topics: ["food quality", "service", "authenticity"],
          language: "en",
          originalUrl: "https://zomato.com/review/789",
          metadata: {
            platform: "Zomato",
            deviceType: "mobile",
            orderType: "delivery",
            visitType: "first-time",
            source: "api",
            confidence: 0.93,
          },
        },
      ]
    : []

  const newReviews: NewReviewSession[] = sessionId
    ? [
        {
          sessionId,
          loginTime: new Date().toISOString(),
          newReviews: [
            {
              id: "new_review_1",
              channelId: "google",
              channelName: "Google My Business",
              reviewId: "google_new_1",
              customerName: "Emma Wilson",
              rating: 5,
              title: "Perfect dinner!",
              content: "Had an amazing dinner here last night. Everything was perfect!",
              timestamp: new Date().toISOString(),
              reviewDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              isVerified: true,
              sentiment: "positive",
              sentimentScore: 0.95,
              keywords: ["amazing", "perfect"],
              topics: ["food quality"],
              language: "en",
              metadata: {
                platform: "Google My Business",
                source: "api",
                confidence: 0.92,
              },
            },
          ],
          channelUpdates: [
            {
              channelId: "google",
              channelName: "Google My Business",
              previousRating: 4.2,
              currentRating: 4.3,
              previousCount: 126,
              currentCount: 127,
              newReviewsCount: 1,
              ratingChange: 0.1,
              countChange: 1,
            },
          ],
          summary: {
            totalNewReviews: 1,
            averageRating: 5.0,
            positiveReviews: 1,
            negativeReviews: 0,
            neutralReviews: 0,
            channelsUpdated: 1,
            overallRatingChange: 0.1,
            requiresAttention: [],
            highlights: ["New 5-star review on Google!"],
          },
        },
      ]
    : []

  const connectedChannels = channelMetrics.filter((c) => c.isConnected)
  const totalReviewCount = connectedChannels.reduce((sum, c) => sum + c.ratingCount, 0)
  const overallRating =
    totalReviewCount > 0
      ? connectedChannels.reduce((sum, c) => sum + c.avgRating * c.ratingCount, 0) / totalReviewCount
      : 0

  return {
    id: `review_data_${restaurantId}`,
    restaurantId,
    channelMetrics,
    allReviews,
    newReviews,
    lastUpdated: new Date().toISOString(),
    totalChannels: channelMetrics.length,
    overallRating: Number(overallRating.toFixed(1)),
    totalReviewCount,
  }
}
