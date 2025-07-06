import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    console.log("🎯 Starting onboarding test...")

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase configuration missing")
    }

    const { userId, restaurantData } = await request.json()

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Update restaurant profile with onboarding data
    const { data: updatedProfile, error: updateError } = await supabase
      .from("restaurant_profiles")
      .update({
        cuisine_type: restaurantData.cuisine,
        restaurant_type: restaurantData.type,
        price_range: restaurantData.priceRange,
        address: restaurantData.address,
        phone: restaurantData.phone,
        website: restaurantData.website,
        description: restaurantData.description,
        setup_completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select()
      .single()

    if (updateError) {
      throw new Error(`Profile update failed: ${updateError.message}`)
    }

    console.log("✅ Restaurant profile updated")

    // Generate AI business insights
    let businessInsights = "Your restaurant profile looks great! We'll help you optimize your operations."

    try {
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: `Analyze this restaurant profile and provide 3-5 specific business insights and recommendations:

Restaurant: ${restaurantData.restaurantName}
Cuisine: ${restaurantData.cuisine}
Type: ${restaurantData.type}
Price Range: ${restaurantData.priceRange}
Description: ${restaurantData.description}

Focus on:
1. Market positioning opportunities
2. Menu optimization suggestions
3. Customer targeting strategies
4. Pricing recommendations
5. Marketing opportunities

Keep it actionable and specific to their restaurant type and cuisine.`,
      })
      businessInsights = text
      console.log("✅ AI business insights generated")
    } catch (aiError) {
      console.warn("AI insights generation failed:", aiError)
    }

    // Generate onboarding checklist
    const onboardingTasks = [
      {
        id: "menu_upload",
        title: "Upload Your Menu",
        description: "Add your menu items for AI analysis and optimization",
        completed: false,
        priority: "high",
      },
      {
        id: "social_profiles",
        title: "Connect Social Media",
        description: "Link your social media accounts for unified management",
        completed: false,
        priority: "medium",
      },
      {
        id: "review_setup",
        title: "Set Up Review Management",
        description: "Configure automated review monitoring and responses",
        completed: false,
        priority: "high",
      },
      {
        id: "customer_data",
        title: "Import Customer Data",
        description: "Upload existing customer information for better insights",
        completed: false,
        priority: "low",
      },
    ]

    return NextResponse.json({
      success: true,
      message: "Onboarding completed successfully",
      data: {
        profile: updatedProfile,
        businessInsights,
        onboardingTasks,
        completionRate: 75, // Profile setup is 75% of onboarding
        nextStep: "data_generation",
      },
    })
  } catch (error) {
    console.error("❌ Onboarding test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Onboarding test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Restaurant Onboarding Test API",
    description: "Test the restaurant profile setup and AI insights generation",
    usage: {
      method: "POST",
      body: {
        userId: "User ID from signup",
        restaurantData: "Restaurant information object",
      },
    },
  })
}
