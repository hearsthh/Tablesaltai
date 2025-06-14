import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/client"
import { generateAIText } from "@/lib/ai/openai"

export async function POST(request: NextRequest) {
  try {
    const { customerId, restaurantId } = await request.json()

    if (!customerId || !restaurantId) {
      return NextResponse.json({ error: "Customer ID and Restaurant ID are required" }, { status: 400 })
    }

    // Check if OpenAI is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          insights: null,
          error: "OpenAI API key not configured. Please add OPENAI_API_KEY environment variable to enable AI insights.",
        },
        { status: 200 },
      )
    }

    try {
      // Get Supabase client
      const supabase = getSupabaseServerClient()

      // Fetch customer data
      const { data: customer, error: customerError } = await supabase
        .from("customers")
        .select("*")
        .eq("id", customerId)
        .eq("restaurant_id", restaurantId)
        .single()

      if (customerError) {
        console.error("Error fetching customer:", customerError)
        return NextResponse.json({ error: "Customer not found" }, { status: 404 })
      }

      // Generate AI insights
      const prompt = `Analyze this customer data and provide marketing insights:
      Name: ${customer.name}
      Email: ${customer.email}
      Visit frequency: ${customer.visit_frequency || "Unknown"}
      Preferences: ${customer.preferences?.join(", ") || "None specified"}
      Last visit: ${customer.last_visit || "Unknown"}
      
      Provide insights on:
      1. Customer segment
      2. Recommended marketing approach
      3. Personalization opportunities
      4. Retention strategies`

      const { text: insights } = await generateAIText(prompt)

      return NextResponse.json({
        insights,
        customer,
        error: null,
      })
    } catch (supabaseError) {
      console.error("Supabase error:", supabaseError)
      return NextResponse.json(
        {
          insights: null,
          error: "Database connection not available. Please configure Supabase integration.",
        },
        { status: 200 },
      )
    }
  } catch (error) {
    console.error("Error generating customer insights:", error)
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 })
  }
}
