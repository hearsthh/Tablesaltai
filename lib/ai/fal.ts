import { fal } from "@fal-ai/client"

export async function generateImage(prompt: string, options?: { width?: number; height?: number; style?: string }) {
  try {
    const result = await fal.subscribe("fal-ai/flux/schnell", {
      input: {
        prompt,
        image_size: `${options?.width || 1024}x${options?.height || 1024}`,
        num_inference_steps: 4,
      },
    })

    return {
      imageUrl: result.images[0].url,
      error: null,
    }
  } catch (error) {
    return {
      imageUrl: null,
      error: "Image generation failed",
    }
  }
}

// Keep the other functions with similar updates
export async function generateFoodImage({
  dishName,
  cuisine,
  style,
}: {
  dishName: string
  cuisine: string
  style: "photographic" | "artistic" | "minimalist"
}) {
  const prompt = `A professional ${style} food photograph of ${dishName}, ${cuisine} cuisine, on a beautiful plate, restaurant presentation, soft lighting, high-end food photography, appetizing, mouth-watering, detailed textures, 8k, high resolution`

  return generateImage(prompt, { width: 1024, height: 768, style })
}

export async function generateRestaurantImage({
  style,
  ambiance,
  time,
}: {
  style: "interior" | "exterior" | "dining area"
  ambiance: string
  time: "day" | "night" | "evening"
}) {
  const prompt = `A professional photograph of a ${ambiance} restaurant ${style}, ${time} time, beautiful lighting, inviting atmosphere, high-end restaurant photography, detailed textures, 8k, high resolution`

  return generateImage(prompt, { width: 1200, height: 800 })
}
