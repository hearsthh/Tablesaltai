import { type NextRequest, NextResponse } from "next/server"
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
          insights:
            "OpenAI API key not configured. Please add OPENAI_API_KEY environment variable to enable AI insights.",
          customer: null,
          error: null,
        },
        { status: 200 },
      )
    }

    // Mock customer data for now
    const mockCustomer = {
      id: customerId,
      name: "John Doe",
      email: "john@example.com",
      visit_frequency: "Weekly",
      preferences: ["Italian", "Vegetarian"],
      last_visit: "2024-01-15",
    }

    try {
      // Generate AI insights
      const prompt = `Analyze this customer data and provide marketing insights:
      Name: ${mockCustomer.name}
      Email: ${mockCustomer.email}
      Visit frequency: ${mockCustomer.visit_frequency}
      Preferences: ${mockCustomer.preferences.join(", ")}
      Last visit: ${mockCustomer.last_visit}
      
      Provide insights on:
      1. Customer segment
      2. Recommended marketing approach
      3. Personalization opportunities
      4. Retention strategies`

      const { text: insights } = await generateAIText(prompt)

      return NextResponse.json({
        insights,
        customer: mockCustomer,
        error: null,
      })
    } catch (aiError) {
      console.error("AI generation error:", aiError)
      return NextResponse.json({
        insights: "AI insights temporarily unavailable. Please check your OpenAI API key configuration.",
        customer: mockCustomer,
        error: null,
      })
    }
  } catch (error) {
    console.error("Error generating customer insights:", error)
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: "Customer insights API ready. Use POST method with customerId and restaurantId.",
    status: "available",
  })
}
