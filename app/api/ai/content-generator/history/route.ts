import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const DEMO_USER_ID = "550e8400-e29b-41d4-a716-446655440000"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get("restaurantId") || DEMO_USER_ID
    const category = searchParams.get("category")
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const supabase = createClient()

    // Build query
    let query = supabase
      .from("generated_content")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("created_at", { ascending: false })

    // Apply filters
    if (category) {
      query = query.eq("category", category)
    }

    if (status) {
      query = query.eq("status", status)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,output_text.ilike.%${search}%`)
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: content, error, count } = await query

    if (error) {
      console.error("Error fetching content history:", error)
      return NextResponse.json(getDemoContentHistory(limit, offset), { status: 200 })
    }

    if (!content || content.length === 0) {
      return NextResponse.json(getDemoContentHistory(limit, offset), { status: 200 })
    }

    // Transform data to match interface
    const transformedContent = content.map((item) => ({
      id: item.id,
      restaurantId: item.restaurant_id,
      userId: item.user_id,
      title: item.title,
      category: item.category,
      contentType: item.content_type,
      channel: item.channel,
      promptInput: item.prompt_input,
      tone: item.tone,
      aiModel: item.ai_model,
      outputText: item.output_text,
      outputMediaUrls: item.output_media_urls || [],
      isApproved: item.is_approved,
      status: item.status,
      generatedBy: item.generated_by,
      version: item.version,
      linkedEntityId: item.linked_entity_id,
      linkedEntityType: item.linked_entity_type,
      usedInCampaignId: item.used_in_campaign_id,
      usedInContentUnitId: item.used_in_content_unit_id,
      usageCount: item.usage_count || 0,
      performanceScore: item.performance_score || 0,
      engagementMetrics: item.engagement_metrics || {},
      tags: item.tags || [],
      isFavorite: item.is_favorite || false,
      isTemplate: item.is_template || false,
      templateCategory: item.template_category,
      triggerSource: item.trigger_source,
      triggerMetadata: item.trigger_metadata || {},
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      approvedAt: item.approved_at,
      usedAt: item.used_at,
    }))

    return NextResponse.json({
      success: true,
      content: transformedContent,
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit,
      },
    })
  } catch (error) {
    console.error("Content history API error:", error)
    return NextResponse.json(getDemoContentHistory(50, 0), { status: 200 })
  }
}

function getDemoContentHistory(limit: number, offset: number) {
  const demoContent = [
    {
      id: "content_1",
      restaurantId: DEMO_USER_ID,
      userId: DEMO_USER_ID,
      title: "Weekend Special Instagram Caption",
      category: "campaign",
      contentType: "instagram_caption",
      channel: "instagram",
      promptInput: "Weekend special promotion for butter chicken combo",
      tone: "friendly",
      aiModel: "gpt-4",
      outputText:
        "🍛 Weekend Special Alert! 🌟\n\nIndulge in our signature Butter Chicken Combo this weekend! Creamy, rich, and absolutely delicious - served with basmati rice and fresh naan. \n\n✨ Only $18.99 (reg. $22.99)\n📅 This weekend only!\n\n#WeekendSpecial #ButterChicken #IndianCuisine #FoodieHeaven",
      outputMediaUrls: [],
      isApproved: true,
      status: "used",
      generatedBy: "ai",
      version: 1,
      usageCount: 3,
      performanceScore: 85,
      engagementMetrics: { likes: 124, comments: 18, shares: 7 },
      tags: ["weekend", "special", "butter chicken", "promotion"],
      isFavorite: true,
      isTemplate: false,
      triggerSource: "campaign_launched",
      triggerMetadata: { campaignId: "camp_1" },
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      approvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      usedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "content_2",
      restaurantId: DEMO_USER_ID,
      userId: DEMO_USER_ID,
      title: "Paneer Tikka Menu Description",
      category: "menu",
      contentType: "item_description",
      channel: null,
      promptInput: "Paneer Tikka - grilled cottage cheese with spices",
      tone: "gourmet",
      aiModel: "gpt-4",
      outputText:
        "Tender cubes of cottage cheese marinated in aromatic spices and yogurt, grilled to perfection in our traditional tandoor. Served with mint chutney and sliced onions. A vegetarian delight that's both flavorful and satisfying.",
      outputMediaUrls: [],
      isApproved: true,
      status: "approved",
      generatedBy: "user",
      version: 2,
      usageCount: 1,
      performanceScore: 78,
      engagementMetrics: {},
      tags: ["vegetarian", "tandoor", "paneer", "appetizer"],
      isFavorite: false,
      isTemplate: true,
      templateCategory: "appetizer_descriptions",
      triggerSource: "menu_item_added",
      triggerMetadata: { menuItemId: "item_123" },
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      approvedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "content_3",
      restaurantId: DEMO_USER_ID,
      userId: DEMO_USER_ID,
      title: "Customer Thank You WhatsApp Message",
      category: "crm",
      contentType: "post_visit_message",
      channel: "whatsapp",
      promptInput: "Thank you message for customer after dining",
      tone: "friendly",
      aiModel: "gpt-3.5-turbo",
      outputText:
        "Hi [Customer Name]! 🙏\n\nThank you for dining with us today! We hope you enjoyed your meal and had a wonderful experience. \n\nYour feedback means the world to us. If you have a moment, we'd love to hear about your visit!\n\nSee you again soon! 😊\n\n- The [Restaurant Name] Team",
      outputMediaUrls: [],
      isApproved: false,
      status: "draft",
      generatedBy: "ai",
      version: 1,
      usageCount: 0,
      performanceScore: 0,
      engagementMetrics: {},
      tags: ["thank you", "post visit", "feedback"],
      isFavorite: false,
      isTemplate: true,
      templateCategory: "customer_engagement",
      triggerSource: "post_visit_automation",
      triggerMetadata: { visitId: "visit_456" },
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "content_4",
      restaurantId: DEMO_USER_ID,
      userId: DEMO_USER_ID,
      title: "Positive Review Response",
      category: "review",
      contentType: "review_reply",
      channel: null,
      promptInput: "Response to 5-star review praising food quality and service",
      tone: "professional",
      aiModel: "gpt-4",
      outputText:
        "Thank you so much for your wonderful 5-star review! We're thrilled to hear that you enjoyed both our food quality and service. Our team works hard to provide exceptional dining experiences, and your kind words truly motivate us. We look forward to welcoming you back soon!",
      outputMediaUrls: [],
      isApproved: true,
      status: "used",
      generatedBy: "ai",
      version: 1,
      linkedEntityId: "review_789",
      linkedEntityType: "review",
      usageCount: 1,
      performanceScore: 92,
      engagementMetrics: { helpful_votes: 5 },
      tags: ["review response", "positive", "thank you"],
      isFavorite: false,
      isTemplate: false,
      triggerSource: "review_received",
      triggerMetadata: { reviewId: "review_789", sentiment: "positive", rating: 5 },
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      approvedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      usedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "content_5",
      restaurantId: DEMO_USER_ID,
      userId: DEMO_USER_ID,
      title: "Restaurant About Us Section",
      category: "profile",
      contentType: "about_us",
      channel: null,
      promptInput: "About us section for family-owned Indian restaurant, 15 years experience",
      tone: "emotional",
      aiModel: "gpt-4",
      outputText:
        "For over 15 years, our family has been sharing the authentic flavors of India with our community. What started as a dream in our grandmother's kitchen has grown into a beloved neighborhood restaurant where every dish tells a story of tradition, love, and culinary heritage. We believe that food brings people together, and every meal we serve is prepared with the same care and passion as if we were cooking for our own family.",
      outputMediaUrls: [],
      isApproved: true,
      status: "approved",
      generatedBy: "hybrid",
      version: 3,
      usageCount: 2,
      performanceScore: 88,
      engagementMetrics: {},
      tags: ["about us", "family", "tradition", "heritage"],
      isFavorite: true,
      isTemplate: false,
      triggerSource: "manual",
      triggerMetadata: {},
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      approvedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  // Simulate pagination
  const paginatedContent = demoContent.slice(offset, offset + limit)

  return {
    success: true,
    content: paginatedContent,
    pagination: {
      total: demoContent.length,
      limit,
      offset,
      hasMore: demoContent.length > offset + limit,
    },
  }
}
