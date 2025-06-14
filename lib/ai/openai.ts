import OpenAI from "openai"

// Lazy initialization - only create client when needed
let openaiClient: OpenAI | null = null

function getOpenAIClient() {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error("OpenAI API key not configured")
    }
    openaiClient = new OpenAI({ apiKey })
  }
  return openaiClient
}

// Update all functions to use the lazy client
export async function generateAIText(
  prompt: string,
  options: {
    temperature?: number
    maxTokens?: number
    model?: string
  } = {},
) {
  try {
    const client = getOpenAIClient()

    const completion = await client.chat.completions.create({
      model: options.model || "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 500,
    })

    return {
      text: completion.choices[0]?.message?.content || "",
      error: null,
    }
  } catch (error) {
    console.error("OpenAI generation error:", error)
    return {
      text: null,
      error: error instanceof Error ? error.message : "Failed to generate text",
    }
  }
}

export async function generateMarketingContent({
  type,
  topic,
  tone,
  keywords,
  length,
  audience,
}: {
  type: string
  topic: string
  tone: string
  keywords: string[]
  length: string
  audience: string
}) {
  try {
    const client = getOpenAIClient()

    const prompt = `Create a ${type} about ${topic} with a ${tone} tone for ${audience}. 
    Include these keywords: ${keywords.join(", ")}. 
    Length: ${length}. 
    Make it engaging and restaurant-focused.`

    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: length === "short" ? 150 : length === "medium" ? 300 : 500,
    })

    return {
      text: completion.choices[0]?.message?.content || "",
      error: null,
    }
  } catch (error) {
    console.error("Marketing content generation error:", error)
    return {
      text: null,
      error: error instanceof Error ? error.message : "Failed to generate marketing content",
    }
  }
}

export async function generateCustomerInsights(customers: any[]) {
  try {
    const client = getOpenAIClient()

    const customerSummary = customers
      .slice(0, 10)
      .map(
        (c) =>
          `Customer: ${c.name}, Visits: ${c.visit_count || 0}, Preferences: ${c.preferences?.join(", ") || "None"}`,
      )
      .join("\n")

    const prompt = `Analyze these restaurant customers and provide insights:
    ${customerSummary}
    
    Provide insights on:
    1. Customer segments
    2. Popular preferences
    3. Visit patterns
    4. Marketing recommendations`

    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 600,
    })

    return {
      insights: completion.choices[0]?.message?.content || "",
      error: null,
    }
  } catch (error) {
    console.error("Customer insights generation error:", error)
    return {
      insights: null,
      error: error instanceof Error ? error.message : "Failed to generate customer insights",
    }
  }
}
