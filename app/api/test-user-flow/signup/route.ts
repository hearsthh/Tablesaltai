import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 Starting signup test...")

    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase environment variables:", {
        url: !!supabaseUrl,
        key: !!supabaseServiceKey,
      })
      return NextResponse.json(
        {
          success: false,
          error: "Supabase configuration missing",
          details: "Environment variables NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required",
        },
        { status: 500 },
      )
    }

    const { testUserEmail = "test@restaurant.com", restaurantName = "Test Restaurant" } = await request.json()

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    console.log("✅ Supabase client created successfully")

    // Test database connection first
    const { data: testConnection, error: connectionError } = await supabase
      .from("restaurant_profiles")
      .select("id")
      .limit(1)

    if (connectionError) {
      console.error("Database connection test failed:", connectionError)
      return NextResponse.json(
        {
          success: false,
          error: "Database connection failed",
          details: connectionError.message,
        },
        { status: 500 },
      )
    }

    console.log("✅ Database connection successful")

    // Create test user profile directly (bypassing auth for testing)
    const userId = `test_user_${Date.now()}`
    const testUser = {
      id: userId,
      email: testUserEmail,
      name: "Test Restaurant Owner",
      created_at: new Date().toISOString(),
    }

    // Create restaurant profile
    const restaurantData = {
      id: `restaurant_${Date.now()}`,
      user_id: userId,
      restaurant_name: restaurantName,
      email: testUserEmail,
      cuisine_type: "Italian",
      restaurant_type: "Casual Dining",
      price_range: "$$",
      address: "123 Test Street, Test City, TC 12345",
      phone: "+1-555-0123",
      description: "A test restaurant for feature validation and AI testing",
      status: "active",
      setup_completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data: profile, error: profileError } = await supabase
      .from("restaurant_profiles")
      .insert(restaurantData)
      .select()
      .single()

    if (profileError) {
      console.error("Profile creation error:", profileError)
      return NextResponse.json(
        {
          success: false,
          error: "Profile creation failed",
          details: profileError.message,
        },
        { status: 500 },
      )
    }

    console.log("✅ Restaurant profile created:", profile.restaurant_name)

    // Generate AI welcome message
    let welcomeMessage = "Welcome to TableSalt AI! We're excited to help you grow your restaurant business."

    try {
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: `Generate a personalized welcome message for a new restaurant owner who just signed up for TableSalt AI. Their restaurant is called "${restaurantName}". Make it warm, professional, and highlight the key benefits they'll get from our AI-powered restaurant management platform. Include specific features like menu optimization, review management, and customer insights. Keep it under 200 words.`,
      })
      welcomeMessage = text
      console.log("✅ AI welcome message generated")
    } catch (aiError) {
      console.warn("AI welcome message generation failed, using default:", aiError)
    }

    return NextResponse.json({
      success: true,
      message: "Test user signup completed successfully",
      data: {
        userId,
        profile,
        welcomeContent: welcomeMessage,
        user: testUser,
        nextSteps: [
          "Complete restaurant profile setup",
          "Generate AI-powered menu insights",
          "Set up review management",
          "Connect social media accounts",
        ],
      },
    })
  } catch (error) {
    console.error("❌ Signup test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Signup test failed",
        details: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "New User Signup Flow Test API",
    description: "Test the complete new user signup and onboarding process",
    usage: {
      method: "POST",
      body: {
        testUserEmail: "Optional test email (default: test@restaurant.com)",
        restaurantName: "Optional restaurant name (default: Test Restaurant)",
      },
    },
    environment: {
      supabaseConfigured: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
      openaiConfigured: !!process.env.OPENAI_API_KEY,
    },
  })
}
