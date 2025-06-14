import { type NextRequest, NextResponse } from "next/server"
import { generateAIText } from "@/lib/ai/openai"

export async function POST(request: NextRequest) {
  try {
    const { customerId, restaurantId } = await request.json()

    // Mock customer data for demonstration
    const mockCustomer = {
      id: customerId || "demo-customer-123",
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      visit_frequency: "2-3 times per month",
      preferences: ["Vegetarian options", "Outdoor seating", "Wine pairings"],
      last_visit: "2024-01-10",
      total_visits: 15,
      average_spend: 85,
      favorite_dishes: ["Quinoa Salad", "Grilled Salmon", "Chocolate Tart"],
    }

    // Check if OpenAI is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        insights: `Customer Profile Analysis for ${mockCustomer.name}:

🎯 Customer Segment: Regular Visitor
• Visits 2-3 times monthly, showing strong loyalty
• Above-average spending at $85 per visit
• Health-conscious preferences (vegetarian options)

📈 Marketing Recommendations:
• Send personalized offers for vegetarian dishes
• Promote wine pairing events (matches preferences)
• Offer loyalty rewards after 20 visits
• Highlight outdoor seating in seasonal campaigns

🔄 Retention Strategy:
• Create a VIP program for frequent visitors
• Send birthday/anniversary special offers
• Recommend new vegetarian dishes based on favorites
• Invite to exclusive tasting events

💡 Personalization Opportunities:
• Reserve preferred outdoor tables
• Suggest wine pairings with favorite dishes
• Send seasonal vegetarian menu updates
• Offer cooking classes for healthy options

Note: Add OpenAI API key for AI-powered insights.`,
        customer: mockCustomer,
        error: null,
      })
    }

    try {
      // Generate AI insights with OpenAI
      const prompt = `Analyze this restaurant customer profile and provide detailed marketing insights:

Customer: ${mockCustomer.name}
Email: ${mockCustomer.email}
Visit Frequency: ${mockCustomer.visit_frequency}
Total Visits: ${mockCustomer.total_visits}
Average Spend: $${mockCustomer.average_spend}
Preferences: ${mockCustomer.preferences.join(", ")}
Favorite Dishes: ${mockCustomer.favorite_dishes.join(", ")}
Last Visit: ${mockCustomer.last_visit}

Provide detailed insights on:
1. Customer segment classification
2. Personalized marketing recommendations
3. Retention strategies
4. Upselling opportunities
5. Communication preferences
6. Seasonal campaign ideas

Format as a professional restaurant marketing analysis.`

      const { text: insights } = await generateAIText(prompt)

      return NextResponse.json({
        insights: insights || "AI insights generated successfully",
        customer: mockCustomer,
        error: null,
      })
    } catch (aiError) {
      console.error("AI generation error:", aiError)
      return NextResponse.json({
        insights: "AI insights temporarily unavailable. Please verify your OpenAI API key configuration.",
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
    message: "Customer Insights API is ready",
    usage: "Send POST request with customerId and restaurantId",
    status: "available",
    features: [
      "AI-powered customer analysis",
      "Marketing recommendations",
      "Retention strategies",
      "Personalization insights",
    ],
  })
}
