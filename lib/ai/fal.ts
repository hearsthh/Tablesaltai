// Temporarily disabled - remove @fal-ai/serverless dependency issue
export async function generateImage(prompt: string, options?: { width?: number; height?: number; style?: string }) {
  console.log("Image generation temporarily disabled")
  return {
    imageUrl: null,
    error: "Image generation temporarily disabled. Please configure Fal AI.",
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
  console.log(`Food image generation requested for: ${dishName}`)
  return {
    imageUrl: null,
    error: "Image generation temporarily disabled. Please configure Fal AI.",
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
  console.log(`Restaurant image generation requested: ${style} ${ambiance}`)
  return {
    imageUrl: null,
    error: "Image generation temporarily disabled. Please configure Fal AI.",
  }
}
