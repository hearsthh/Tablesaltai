// Temporarily disabled to fix deployment
export async function generateImage(prompt: string, options?: { width?: number; height?: number; style?: string }) {
  console.log("Image generation temporarily disabled for deployment")
  return {
    imageUrl: null,
    error: "Image generation temporarily disabled. Will be re-enabled after successful deployment.",
  }
}

export async function generateFoodImage({
  dishName,
  cuisine,
  style,
}: {
  dishName: string
  cuisine: string
  style: "photographic" | "artistic" | "minimalist"
}) {
  console.log(`Food image generation requested for: ${dishName} (${cuisine} cuisine, ${style} style)`)
  return {
    imageUrl: null,
    error: "Image generation temporarily disabled. Will be re-enabled after successful deployment.",
  }
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
  console.log(`Restaurant image generation requested: ${style} ${ambiance} at ${time}`)
  return {
    imageUrl: null,
    error: "Image generation temporarily disabled. Will be re-enabled after successful deployment.",
  }
}

export const falClient = null
