import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { generateAIText } from "@/lib/ai/openai"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    console.log("🧪 Testing profile setup with AI content generation...")

    const body = await request.json()
    const { restaurantId, profileData } = body

    // Get restaurant data
    const { data: restaurant, error: restaurantError } = await supabase
      .from("mock_restaurants")
      .select("*")
      .eq("id", restaurantId)
      .single()

    if (restaurantError) throw restaurantError

    // Generate AI-enhanced profile content
    const profilePrompt = `Create compelling profile content for ${restaurant.name}:

Restaurant Details:
- Name: ${restaurant.name}
- Cuisine: ${restaurant.cuisine_type}
- Location: ${restaurant.city}, ${restaurant.state}
- Type: ${restaurant.restaurant_type}
- Description: ${restaurant.description}

Generate:
1. Enhanced "About Us" section (2-3 sentences)
2. Compelling tagline
3. Brand story (3-4 sentences)
4. Key highlights (3 bullet points)

Make it authentic, engaging, and professional.`

    const profileContent = await generateAIText(profilePrompt, { maxTokens: 500 })

    // Generate social media content suggestions
    const socialPrompt = `Create social media content suggestions for ${restaurant.name}:

Generate 3 different post ideas:
1. Welcome post for new followers
2. Signature dish highlight
3. Behind-the-scenes content

Each should be engaging and include relevant hashtags for ${restaurant.cuisine_type} cuisine.`

    const socialContent = await generateAIText(socialPrompt, { maxTokens: 400 })

    // Generate menu description enhancements
    const menuPrompt = `Suggest 5 signature menu items for ${restaurant.name}, a ${restaurant.cuisine_type} restaurant:

For each item provide:
- Item name
- Appetizing description (1-2 sentences)
- Suggested price range for ${restaurant.price_range} pricing

Focus on authentic ${restaurant.cuisine_type} dishes that would appeal to customers in ${restaurant.city}.`

    const menuSuggestions = await generateAIText(menuPrompt, { maxTokens: 600 })

    // Update restaurant with AI-generated content
    const enhancedProfile = {
      ...restaurant,
      ai_generated_content: {
        profile: profileContent.text,
        social_media: socialContent.text,
        menu_suggestions: menuSuggestions.text,
        generated_at: new Date().toISOString(),
      },
      onboarding_step: "data_generation",
      profile_completion: 75,
      updated_at: new Date().toISOString(),
    }

    const { error: updateError } = await supabase
      .from("mock_restaurants")
      .update(enhancedProfile)
      .eq("id", restaurantId)

    if (updateError) throw updateError

    console.log("✅ Profile setup with AI content generation completed")

    return NextResponse.json({
      success: true,
      message: "Profile setup completed with AI-generated content",
      data: {
        restaurant: enhancedProfile,
        aiContent: {
          profileContent: profileContent.text,
          socialContent: socialContent.text,
          menuSuggestions: menuSuggestions.text,
        },
        nextStep: "data_generation",
      },
    })
  } catch (error) {
    console.error("❌ Profile setup failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Profile setup failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
