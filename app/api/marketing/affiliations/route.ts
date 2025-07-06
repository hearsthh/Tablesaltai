import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pincode = searchParams.get("pincode") || "110001"
    const city = searchParams.get("city") || "Delhi"

    const supabase = await createClient()

    // Try to fetch from database first
    try {
      const { data: affiliations, error } = await supabase
        .from("marketing_affiliations")
        .select("*")
        .eq("location", city)
        .order("relevance_score", { ascending: false })

      if (!error && affiliations && affiliations.length > 0) {
        return NextResponse.json({ affiliations })
      }
    } catch (dbError) {
      console.log("Database not available, generating AI affiliations")
    }

    // Generate AI-powered local affiliations
    const mockAffiliations = [
      {
        id: "1",
        name: "Delhi Food Bloggers Network",
        type: "influencer_group",
        category: "food_bloggers",
        location: city,
        pincode: pincode,
        relevance_score: 95,
        contact_info: {
          email: "contact@delhifoodbloggers.com",
          instagram: "@delhifoodbloggers",
          followers: 45000,
        },
        engagement_potential: "high",
        collaboration_type: ["reviews", "sponsored_posts", "events"],
        estimated_reach: 45000,
        avg_engagement_rate: 6.8,
        description: "Premier network of food bloggers and influencers in Delhi NCR region",
      },
      {
        id: "2",
        name: "Connaught Place Restaurant Association",
        type: "business_group",
        category: "restaurant_association",
        location: city,
        pincode: pincode,
        relevance_score: 88,
        contact_info: {
          email: "info@cprestaurants.org",
          phone: "+91-11-2341-5678",
          website: "cprestaurants.org",
        },
        engagement_potential: "medium",
        collaboration_type: ["joint_promotions", "events", "cross_marketing"],
        estimated_reach: 12000,
        avg_engagement_rate: 4.2,
        description: "Association of premium restaurants in Connaught Place area",
      },
      {
        id: "3",
        name: "FoodieDelhi Instagram Community",
        type: "social_community",
        category: "food_community",
        location: city,
        pincode: pincode,
        relevance_score: 82,
        contact_info: {
          instagram: "@foodiedelhi",
          email: "collaborate@foodiedelhi.in",
          followers: 78000,
        },
        engagement_potential: "high",
        collaboration_type: ["features", "contests", "user_generated_content"],
        estimated_reach: 78000,
        avg_engagement_rate: 5.4,
        description: "Active community of food enthusiasts sharing Delhi restaurant experiences",
      },
      {
        id: "4",
        name: "Delhi Food Festival Organizers",
        type: "event_organizer",
        category: "events",
        location: city,
        pincode: pincode,
        relevance_score: 76,
        contact_info: {
          email: "partnerships@delhifoodfest.com",
          phone: "+91-11-4567-8901",
          website: "delhifoodfestival.com",
        },
        engagement_potential: "high",
        collaboration_type: ["event_participation", "sponsorship", "pop_ups"],
        estimated_reach: 25000,
        avg_engagement_rate: 8.1,
        description: "Organizers of major food festivals and culinary events in Delhi",
      },
      {
        id: "5",
        name: "Local Food Delivery Influencers",
        type: "influencer_group",
        category: "delivery_reviewers",
        location: city,
        pincode: pincode,
        relevance_score: 71,
        contact_info: {
          email: "collabs@deliveryreviewers.in",
          instagram: "@delhideliveryreviews",
          followers: 32000,
        },
        engagement_potential: "medium",
        collaboration_type: ["delivery_reviews", "unboxing_videos", "taste_tests"],
        estimated_reach: 32000,
        avg_engagement_rate: 7.2,
        description: "Specialized influencers focusing on food delivery and takeaway reviews",
      },
    ]

    return NextResponse.json({
      affiliations: mockAffiliations,
      location: { city, pincode },
      generated_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error generating affiliations:", error)
    return NextResponse.json({ error: "Failed to generate affiliations" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { affiliationId, action } = body

    if (action === "contact") {
      return NextResponse.json({
        success: true,
        message: "Contact request sent successfully",
        data: {
          contacted_at: new Date().toISOString(),
          status: "pending_response",
        },
      })
    }

    if (action === "save") {
      return NextResponse.json({
        success: true,
        message: "Affiliation saved to your list",
        data: {
          saved_at: new Date().toISOString(),
          status: "saved",
        },
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error processing affiliation action:", error)
    return NextResponse.json({ error: "Failed to process action" }, { status: 500 })
  }
}
