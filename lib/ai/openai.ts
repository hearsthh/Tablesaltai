import { OpenAI } from "openai"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Initialize OpenAI client
const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Generate text using AI SDK
export async function generateAIText(prompt: string, options?: { temperature?: number; maxTokens?: number }) {
  if (!process.env.OPENAI_API_KEY) {
    return {
      text: null,
      error: "OpenAI not configured. Please add OPENAI_API_KEY to environment variables.",
    }
  }

  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      temperature: options?.temperature || 0.7,
      maxTokens: options?.maxTokens || 500,
    })

    return { text, error: null }
  } catch (error) {
    console.error("Error generating text:", error)
    return { text: null, error: "Failed to generate text. Please try again." }
  }
}

// Generate content for marketing
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
  length: "short" | "medium" | "long"
  audience: string
}) {
  const prompt = `
    Create ${type} content about "${topic}".
    Tone: ${tone}
    Target audience: ${audience}
    Keywords to include: ${keywords.join(", ")}
    Length: ${length}
    
    The content should be engaging, SEO-friendly, and tailored for a restaurant marketing context.
  `

  return generateAIText(prompt, { temperature: 0.8 })
}

// Generate social media post
export async function generateSocialMediaPost({
  platform,
  topic,
  tone,
  includeHashtags,
  restaurantName,
}: {
  platform: string
  topic: string
  tone: string
  includeHashtags: boolean
  restaurantName: string
}) {
  const prompt = `
    Create a ${platform} post about "${topic}" for restaurant "${restaurantName}".
    Tone: ${tone}
    ${includeHashtags ? "Include relevant hashtags at the end." : ""}
    
    The post should be engaging and formatted appropriately for ${platform}.
  `

  return generateAIText(prompt, { temperature: 0.8 })
}

// Generate customer insights
export async function generateCustomerInsights(customerData: any) {
  if (!process.env.OPENAI_API_KEY) {
    return {
      insights: null,
      error: "OpenAI not configured. Please add OPENAI_API_KEY to environment variables.",
    }
  }

  const prompt = `
    Analyze the following customer data and provide actionable insights:
    ${JSON.stringify(customerData)}
    
    Focus on:
    1. Segmentation opportunities
    2. Churn risk factors
    3. Upselling opportunities
    4. Personalization recommendations
    
    Format the response as JSON with the following structure:
    {
      "segments": [],
      "churnRisks": [],
      "upsellOpportunities": [],
      "personalizationIdeas": []
    }
  `

  const { text, error } = await generateAIText(prompt, { temperature: 0.2 })

  if (error || !text) {
    return { insights: null, error: error || "Failed to generate insights" }
  }

  try {
    const insights = JSON.parse(text)
    return { insights, error: null }
  } catch (e) {
    return { insights: null, error: "Failed to parse insights" }
  }
}

// Generate menu descriptions
export async function generateMenuDescription({
  dishName,
  ingredients,
  cuisine,
  isSignature,
  isVegetarian,
}: {
  dishName: string
  ingredients: string[]
  cuisine: string
  isSignature: boolean
  isVegetarian: boolean
}) {
  const prompt = `
    Create an appetizing menu description for "${dishName}".
    Ingredients: ${ingredients.join(", ")}
    Cuisine type: ${cuisine}
    ${isSignature ? "This is a signature dish of the restaurant." : ""}
    ${isVegetarian ? "This is a vegetarian dish." : ""}
    
    The description should be mouth-watering, concise, and highlight the key flavors and preparation methods.
  `

  return generateAIText(prompt, { temperature: 0.7, maxTokens: 100 })
}

// Export the OpenAI client for direct use when needed
export { openaiClient }
