import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { userId, activityType } = await request.json()

    console.log(`🎯 Generating REAL ${activityType} activity for user ${userId}`)

    const supabase = getSupabaseServerClient()

    // Verify user exists
    const { data: userCheck, error: userError } = await supabase
      .from("restaurant_profiles")
      .select("id, restaurant_name")
      .eq("user_id", userId)
      .single()

    if (userError || !userCheck) {
      throw new Error("User not found in database")
    }

    console.log(`📍 Generating activity for: ${userCheck.restaurant_name}`)

    let activityData = null

    switch (activityType) {
      case "profile_views":
        activityData = await generateProfileViews(supabase, userId)
        break

      case "menu_interactions":
        activityData = await generateMenuInteractions(supabase, userId)
        break

      case "reviews":
        activityData = await generateReviews(supabase, userId)
        break

      case "social_engagement":
        activityData = await generateSocialEngagement(supabase, userId)
        break

      case "reservations":
        activityData = await generateReservations(supabase, userId)
        break

      default:
        throw new Error(`Unknown activity type: ${activityType}`)
    }

    // Update analytics
    await updateAnalytics(supabase, userId)

    console.log(`✅ REAL ${activityType} activity generated successfully`)

    return NextResponse.json({
      success: true,
      activity: activityData,
      message: `${activityType} activity added to production database`,
      environment: "production",
    })
  } catch (error) {
    console.error("💥 Real activity simulation error:", error)
    return NextResponse.json(
      {
        error: "Failed to simulate real activity",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

async function generateProfileViews(supabase: any, userId: string) {
  console.log("👀 Generating real profile views...")

  const views = []
  const viewCount = Math.floor(Math.random() * 15) + 10 // 10-25 views

  for (let i = 0; i < viewCount; i++) {
    const { data: viewData, error: viewError } = await supabase
      .from("profile_views")
      .insert([
        {
          restaurant_id: userId,
          ip_address: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          user_agent: "Mozilla/5.0 (Real Browser Test)",
          referrer: Math.random() > 0.5 ? "google.com" : "direct",
          device_type: Math.random() > 0.7 ? "mobile" : "desktop",
          location: ["New York", "Los Angeles", "Chicago", "Houston"][Math.floor(Math.random() * 4)],
          viewed_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ])
      .select()
      .single()

    if (!viewError) {
      views.push(viewData)
    }
  }

  console.log(`✅ Generated ${views.length} real profile views`)
  return { views: views.length, data: views }
}

async function generateMenuInteractions(supabase: any, userId: string) {
  console.log("🍽️ Generating real menu interactions...")

  // Get menu items for this restaurant
  const { data: menuItems, error: menuError } = await supabase
    .from("menu_items")
    .select("id, name")
    .eq("restaurant_id", userId)

  if (menuError || !menuItems?.length) {
    console.warn("⚠️ No menu items found for interactions")
    return { interactions: 0, data: [] }
  }

  const interactions = []
  const interactionCount = Math.floor(Math.random() * 20) + 10

  for (let i = 0; i < interactionCount; i++) {
    const randomItem = menuItems[Math.floor(Math.random() * menuItems.length)]

    const { data: interactionData, error: interactionError } = await supabase
      .from("menu_interactions")
      .insert([
        {
          restaurant_id: userId,
          item_id: randomItem.id,
          interaction_type: Math.random() > 0.7 ? "click" : "view",
          session_id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          device_type: Math.random() > 0.6 ? "mobile" : "desktop",
          created_at: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ])
      .select()
      .single()

    if (!interactionError) {
      interactions.push(interactionData)
    }
  }

  console.log(`✅ Generated ${interactions.length} real menu interactions`)
  return { interactions: interactions.length, data: interactions }
}

async function generateReviews(supabase: any, userId: string) {
  console.log("⭐ Generating real reviews...")

  const sampleReviews = [
    {
      rating: 5,
      title: "Outstanding dining experience!",
      content: "The food was absolutely incredible and the service was top-notch. Will definitely be coming back!",
      author_name: "Sarah Johnson",
      author_email: "sarah.j@email.com",
      platform: "google",
    },
    {
      rating: 4,
      title: "Great atmosphere and food",
      content: "Loved the ambiance and the menu has great variety. The staff was very attentive.",
      author_name: "Mike Chen",
      author_email: "mike.c@email.com",
      platform: "yelp",
    },
    {
      rating: 5,
      title: "Best restaurant in the area",
      content: "Exceptional quality in every dish. The chef really knows what they're doing.",
      author_name: "Emily Rodriguez",
      author_email: "emily.r@email.com",
      platform: "tripadvisor",
    },
    {
      rating: 4,
      title: "Solid choice for dinner",
      content: "Good food at reasonable prices. The service was efficient and friendly.",
      author_name: "David Kim",
      author_email: "david.k@email.com",
      platform: "google",
    },
  ]

  const reviews = []
  for (const review of sampleReviews) {
    const { data: reviewData, error: reviewError } = await supabase
      .from("reviews")
      .insert([
        {
          restaurant_id: userId,
          ...review,
          sentiment: review.rating >= 4 ? "positive" : review.rating >= 3 ? "neutral" : "negative",
          is_verified: true,
          is_published: true,
          created_at: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ])
      .select()
      .single()

    if (!reviewError) {
      reviews.push(reviewData)
    }
  }

  console.log(`✅ Generated ${reviews.length} real reviews`)
  return { reviews: reviews.length, data: reviews }
}

async function generateSocialEngagement(supabase: any, userId: string) {
  console.log("📱 Generating real social engagement...")

  const engagements = []
  const platforms = ["instagram", "facebook", "twitter"]

  for (const platform of platforms) {
    const { data: engagementData, error: engagementError } = await supabase
      .from("social_engagement")
      .insert([
        {
          restaurant_id: userId,
          platform: platform,
          engagement_type: "like",
          count: Math.floor(Math.random() * 100) + 20,
          date: new Date().toISOString().split("T")[0],
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (!engagementError) {
      engagements.push(engagementData)
    }
  }

  console.log(`✅ Generated ${engagements.length} real social engagements`)
  return { engagements: engagements.length, data: engagements }
}

async function generateReservations(supabase: any, userId: string) {
  console.log("📅 Generating real reservations...")

  const reservations = []
  const reservationCount = Math.floor(Math.random() * 8) + 5

  for (let i = 0; i < reservationCount; i++) {
    const reservationDate = new Date()
    reservationDate.setDate(reservationDate.getDate() + Math.floor(Math.random() * 14))

    const { data: reservationData, error: reservationError } = await supabase
      .from("reservations")
      .insert([
        {
          restaurant_id: userId,
          customer_name: `Customer ${i + 1}`,
          customer_email: `customer${i + 1}@email.com`,
          customer_phone: `+1-555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
          party_size: Math.floor(Math.random() * 6) + 2,
          reservation_date: reservationDate.toISOString().split("T")[0],
          reservation_time: `${Math.floor(Math.random() * 4) + 17}:${Math.random() > 0.5 ? "00" : "30"}`,
          status: Math.random() > 0.8 ? "cancelled" : "confirmed",
          special_requests: Math.random() > 0.7 ? "Window table preferred" : null,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (!reservationError) {
      reservations.push(reservationData)
    }
  }

  console.log(`✅ Generated ${reservations.length} real reservations`)
  return { reservations: reservations.length, data: reservations }
}

async function updateAnalytics(supabase: any, userId: string) {
  console.log("📊 Updating real analytics...")

  // Get current counts from database
  const { data: profileViews } = await supabase.from("profile_views").select("id").eq("restaurant_id", userId)

  const { data: reviews } = await supabase.from("reviews").select("rating").eq("restaurant_id", userId)

  const { data: menuInteractions } = await supabase.from("menu_interactions").select("id").eq("restaurant_id", userId)

  const { data: reservations } = await supabase.from("reservations").select("id").eq("restaurant_id", userId)

  const averageRating =
    reviews && reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0

  // Update analytics table
  const { error: analyticsError } = await supabase
    .from("restaurant_analytics")
    .update({
      profile_views: profileViews?.length || 0,
      menu_views: menuInteractions?.length || 0,
      review_count: reviews?.length || 0,
      average_rating: Math.round(averageRating * 10) / 10,
      total_reservations: reservations?.length || 0,
      last_updated: new Date().toISOString(),
    })
    .eq("restaurant_id", userId)

  if (analyticsError) {
    console.error("❌ Analytics update error:", analyticsError)
  } else {
    console.log("✅ Analytics updated successfully")
  }
}
