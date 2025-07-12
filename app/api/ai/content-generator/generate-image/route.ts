import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@/lib/ai/openai"

export async function POST(request: NextRequest) {
  try {
    const { prompt, size = "1024x1024", quality = "standard", style = "vivid" } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Check if OpenAI is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "AI service not configured" }, { status: 503 })
    }

    console.log("🎨 Generating image with DALL-E:", { prompt, size, quality, style })

    // Generate image using DALL-E
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: enhanceImagePrompt(prompt),
      n: 1,
      size: size as "1024x1024" | "1792x1024" | "1024x1792",
      quality: quality as "standard" | "hd",
      style: style as "vivid" | "natural",
    })

    const imageUrl = response.data[0]?.url

    if (!imageUrl) {
      throw new Error("No image generated")
    }

    return NextResponse.json({
      success: true,
      imageUrl,
      prompt: response.data[0]?.revised_prompt || prompt,
      metadata: {
        model: "dall-e-3",
        size,
        quality,
        style,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error: any) {
    console.error("Image generation error:", error)

    // Handle specific OpenAI errors
    if (error.code === "content_policy_violation") {
      return NextResponse.json(
        {
          error: "Content policy violation",
          message: "The image prompt violates OpenAI's content policy. Please try a different prompt.",
        },
        { status: 400 },
      )
    }

    if (error.code === "rate_limit_exceeded") {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: "Too many requests. Please try again later.",
        },
        { status: 429 },
      )
    }

    return NextResponse.json(
      {
        error: "Failed to generate image",
        details: error.message || "Unknown error",
      },
      { status: 500 },
    )
  }
}

function enhanceImagePrompt(originalPrompt: string): string {
  // Enhance the prompt for better restaurant/food imagery
  const restaurantKeywords = [
    "food",
    "dish",
    "meal",
    "restaurant",
    "kitchen",
    "chef",
    "cooking",
    "dining",
    "menu",
    "plate",
    "bowl",
    "cuisine",
    "recipe",
    "ingredient",
  ]

  const hasRestaurantContext = restaurantKeywords.some((keyword) => originalPrompt.toLowerCase().includes(keyword))

  if (hasRestaurantContext) {
    return `Professional food photography: ${originalPrompt}. High-quality, appetizing, well-lit, restaurant-style presentation, clean background, vibrant colors, detailed textures.`
  }

  // For non-food content (posters, designs, etc.)
  return `Professional marketing design: ${originalPrompt}. Clean, modern, eye-catching, high-quality, suitable for restaurant marketing materials.`
}

// Helper function to validate image generation requests
function validateImageRequest(prompt: string, contentType: string): { valid: boolean; error?: string } {
  // Check for inappropriate content
  const inappropriateTerms = ["violence", "explicit", "harmful", "illegal"]
  const hasInappropriate = inappropriateTerms.some((term) => prompt.toLowerCase().includes(term))

  if (hasInappropriate) {
    return { valid: false, error: "Prompt contains inappropriate content" }
  }

  // Check prompt length
  if (prompt.length > 1000) {
    return { valid: false, error: "Prompt is too long (max 1000 characters)" }
  }

  if (prompt.length < 10) {
    return { valid: false, error: "Prompt is too short (min 10 characters)" }
  }

  return { valid: true }
}
