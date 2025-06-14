import Anthropic from "@anthropic-ai/sdk"

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Generate nuanced customer communication
export async function generateCustomerResponse({
  customerMessage,
  customerHistory,
  restaurantContext,
  tone = "professional",
}: {
  customerMessage: string
  customerHistory?: any[]
  restaurantContext: any
  tone?: "professional" | "friendly" | "casual" | "formal"
}) {
  try {
    const systemPrompt = `You are a customer service representative for ${restaurantContext.name}, a ${restaurantContext.cuisine} restaurant. 
    
Restaurant Details:
- Name: ${restaurantContext.name}
- Cuisine: ${restaurantContext.cuisine}
- Location: ${restaurantContext.location}
- Specialties: ${restaurantContext.specialties?.join(", ") || "N/A"}
- Tone: ${tone}

Customer History: ${customerHistory ? JSON.stringify(customerHistory.slice(-3)) : "No previous interactions"}

Respond to customer inquiries with empathy, accuracy, and helpfulness. Always maintain the restaurant's brand voice.`

    const message = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 500,
      temperature: 0.3,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: customerMessage,
        },
      ],
    })

    return {
      response: message.content[0].type === "text" ? message.content[0].text : "",
      error: null,
    }
  } catch (error) {
    console.error("Error generating customer response:", error)
    return {
      response: null,
      error: "Failed to generate response. Please try again.",
    }
  }
}

// Generate personalized email campaigns
export async function generatePersonalizedEmail({
  customerData,
  campaignType,
  restaurantContext,
}: {
  customerData: any
  campaignType: "welcome" | "birthday" | "winback" | "promotion" | "loyalty"
  restaurantContext: any
}) {
  try {
    const systemPrompt = `Create a personalized email for ${restaurantContext.name} restaurant.

Customer Profile:
- Name: ${customerData.name}
- Visit Frequency: ${customerData.visitFrequency || "Unknown"}
- Favorite Items: ${customerData.favoriteItems?.join(", ") || "Unknown"}
- Last Visit: ${customerData.lastVisit || "Unknown"}
- Preferences: ${customerData.preferences?.join(", ") || "Unknown"}

Campaign Type: ${campaignType}
Restaurant: ${restaurantContext.name} (${restaurantContext.cuisine})

Create an engaging, personalized email that feels authentic and drives action.`

    const message = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 800,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Generate a ${campaignType} email for this customer.`,
        },
      ],
    })

    return {
      email: message.content[0].type === "text" ? message.content[0].text : "",
      error: null,
    }
  } catch (error) {
    console.error("Error generating personalized email:", error)
    return {
      email: null,
      error: "Failed to generate email. Please try again.",
    }
  }
}

// Analyze customer feedback for insights
export async function analyzeCustomerFeedback(feedbackData: any[]) {
  try {
    const systemPrompt = `Analyze customer feedback for a restaurant and provide actionable insights.

Focus on:
1. Common themes and patterns
2. Operational improvements needed
3. Menu optimization opportunities
4. Service enhancement suggestions
5. Marketing opportunities

Provide structured, actionable recommendations.`

    const message = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      temperature: 0.2,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Analyze this customer feedback: ${JSON.stringify(feedbackData)}`,
        },
      ],
    })

    const analysis = message.content[0].type === "text" ? message.content[0].text : ""

    return {
      analysis,
      error: null,
    }
  } catch (error) {
    console.error("Error analyzing feedback:", error)
    return {
      analysis: null,
      error: "Failed to analyze feedback. Please try again.",
    }
  }
}

export { anthropic }
