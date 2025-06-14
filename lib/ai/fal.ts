import { fal } from "@fal-ai/serverless"

// Initialize Fal client
const falClient = fal(process.env.FAL_API_KEY || "")

// Generate image using text prompt
export async function generateImage(prompt: string, options?: { width?: number; height?: number; style?: string }) {
  try {
    const width = options?.width || 1024
    const height = options?.height || 1024
    const style = options?.style || "photographic"

    const result = await falClient.run({
      model: "fal-ai/fast-sdxl",
      input: {
        prompt: prompt,
        width: width,
        height: height,
        style_preset: style,
      },
    })

    return { imageUrl: result.images[0].url, error: null }
  } catch (error) {
    console.error("Error generating image:", error)
    return { imageUrl: null, error: "Failed to generate image. Please try again." }
  }
}

// Generate food image
export async function generateFoodImage({
  dishName,
  cuisine,
  style,
}: {
  dishName: string
  cuisine: string
  style: "photographic" | "artistic" | "minimalist"
}) {
  const prompt = `
    A professional ${style} food photograph of ${dishName}, ${cuisine} cuisine, 
    on a beautiful plate, restaurant presentation, soft lighting, high-end food photography,
    appetizing, mouth-watering, detailed textures, 8k, high resolution
  `

  return generateImage(prompt, { width: 1024, height: 768, style })
}

// Generate restaurant ambiance image
export async function generateRestaurantImage({
  style,
  ambiance,
  time,
}: {
  style: "interior" | "exterior" | "dining area"
  ambiance: string
  time: "day" | "night" | "evening"
}) {
  const prompt = `
    A professional photograph of a ${ambiance} restaurant ${style}, ${time} time,
    beautiful lighting, inviting atmosphere, high-end restaurant photography,
    detailed textures, 8k, high resolution
  `

  return generateImage(prompt, { width: 1200, height: 800 })
}

// Export the Fal client for direct use when needed
export { falClient }
