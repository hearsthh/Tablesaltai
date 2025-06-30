import * as fal from "@fal-ai/serverless-client"

// Configure Fal client
fal.config({
  credentials: process.env.FAL_KEY || process.env.FAL_API_KEY || "",
})

// Generate food images using Fal AI
export async function generateFoodImage({
  prompt,
  style = "realistic",
  aspectRatio = "1:1",
  numImages = 1,
}: {
  prompt: string
  style?: string
  aspectRatio?: string
  numImages?: number
}) {
  try {
    const result = await fal.subscribe("fal-ai/flux/schnell", {
      input: {
        prompt: `${prompt}, ${style} food photography, professional lighting, appetizing, high quality`,
        image_size: aspectRatio === "16:9" ? "landscape_16_9" : aspectRatio === "9:16" ? "portrait_9_16" : "square",
        num_inference_steps: 4,
        num_images: numImages,
      },
    })

    return {
      success: true,
      images: result.data.images || [],
      prompt,
      style,
      provider: "Fal AI",
    }
  } catch (error) {
    console.error("Fal AI Image Generation Error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate image",
      images: [],
      fallbackUrl: `/placeholder.svg?height=400&width=400&text=${encodeURIComponent(prompt)}`,
    }
  }
}

// Generate general images (alias for generateFoodImage for compatibility)
export async function generateImage({
  prompt,
  style = "realistic",
  aspectRatio = "1:1",
  numImages = 1,
}: {
  prompt: string
  style?: string
  aspectRatio?: string
  numImages?: number
}) {
  return generateFoodImage({ prompt, style, aspectRatio, numImages })
}

// Generate restaurant interior images
export async function generateRestaurantImage({
  restaurantType,
  ambiance,
  style = "modern",
}: {
  restaurantType: string
  ambiance: string
  style?: string
}) {
  const prompt = `${style} ${restaurantType} restaurant interior, ${ambiance} ambiance, professional photography, inviting atmosphere`

  return generateFoodImage({
    prompt,
    style: "realistic",
    aspectRatio: "16:9",
    numImages: 1,
  })
}

// Generate menu item images
export async function generateMenuItemImage({
  itemName,
  cuisine,
  ingredients,
  platingStyle = "elegant",
}: {
  itemName: string
  cuisine: string
  ingredients?: string[]
  platingStyle?: string
}) {
  const ingredientText = ingredients ? ` with ${ingredients.join(", ")}` : ""
  const prompt = `${itemName}, ${cuisine} cuisine${ingredientText}, ${platingStyle} plating, professional food photography, appetizing presentation`

  return generateFoodImage({
    prompt,
    style: "realistic",
    aspectRatio: "1:1",
    numImages: 1,
  })
}

// Generate social media images
export async function generateSocialMediaImage({
  content,
  platform = "instagram",
  style = "vibrant",
}: {
  content: string
  platform?: string
  style?: string
}) {
  const aspectRatio = platform === "instagram" ? "1:1" : platform === "facebook" ? "16:9" : "1:1"
  const prompt = `${content}, ${style} food photography, social media ready, eye-catching, professional quality`

  return generateFoodImage({
    prompt,
    style: "realistic",
    aspectRatio,
    numImages: 1,
  })
}

// Generate promotional images
export async function generatePromotionalImage({
  offer,
  restaurantName,
  cuisine,
  style = "appetizing",
}: {
  offer: string
  restaurantName: string
  cuisine: string
  style?: string
}) {
  const prompt = `${offer} at ${restaurantName}, ${cuisine} restaurant, ${style} food photography, promotional image, professional quality`

  return generateFoodImage({
    prompt,
    style: "realistic",
    aspectRatio: "16:9",
    numImages: 1,
  })
}

// Test Fal AI connection
export async function testFalConnection() {
  try {
    const result = await generateFoodImage({
      prompt: "delicious burger",
      style: "realistic",
      aspectRatio: "1:1",
      numImages: 1,
    })

    return {
      success: result.success,
      message: result.success ? "Fal AI connection successful" : "Fal AI connection failed",
      provider: "Fal AI",
      hasImages: result.images && result.images.length > 0,
    }
  } catch (error) {
    console.error("Fal AI Connection Test Failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Connection failed",
      message: "Fal AI connection failed",
    }
  }
}

// Batch generate images
export async function batchGenerateImages({
  prompts,
  style = "realistic",
  aspectRatio = "1:1",
}: {
  prompts: string[]
  style?: string
  aspectRatio?: string
}) {
  const results = []

  for (const prompt of prompts) {
    try {
      const result = await generateFoodImage({
        prompt,
        style,
        aspectRatio,
        numImages: 1,
      })
      results.push({ prompt, ...result })

      // Add delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (error) {
      results.push({
        prompt,
        success: false,
        error: error instanceof Error ? error.message : "Generation failed",
        images: [],
      })
    }
  }

  return {
    success: true,
    results,
    totalPrompts: prompts.length,
    successfulGenerations: results.filter((r) => r.success).length,
  }
}
