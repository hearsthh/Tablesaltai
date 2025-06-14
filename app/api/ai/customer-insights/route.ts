import { type NextRequest, NextResponse } from "next/server"
import { generateCustomerInsights } from "@/lib/ai/openai"
import { serverAuthService } from "@/lib/auth/auth-service"
import { getSupabaseServerClient } from "@/lib/supabase/client"

export async function GET(request: NextRequest) {
  try {
    // Check if OpenAI is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: "OpenAI API key not configured. Please add OPENAI_API_KEY environment variable.",
          insights: "AI customer insights require OpenAI configuration.",
        },
        { status: 503 },
      )
    }

    // Verify authentication
    const { user, error: authError } = await serverAuthService.getCurrentUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get restaurant profile
    const { profile, error: profileError } = await serverAuthService.getUserProfile(user.id)

    if (profileError || !profile) {
      return NextResponse.json({ error: "Restaurant profile not found" }, { status: 404 })
    }

    // Get customer data
    const supabase = getSupabaseServerClient()
    const { data: customers, error: customersError } = await supabase
      .from("customers")
      .select("*")
      .eq("restaurant_id", profile.id)

    if (customersError) {
      return NextResponse.json({ error: customersError.message }, { status: 500 })
    }

    // Generate insights
    const { insights, error } = await generateCustomerInsights(customers || [])

    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ insights })
  } catch (error) {
    console.error("Customer insights error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      error: "AI customer insights not configured. Please add OpenAI API key.",
    },
    { status: 503 },
  )
}
