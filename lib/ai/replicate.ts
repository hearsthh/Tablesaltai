import Replicate from "replicate"

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

// Generate high-quality food photography
export async function generateFoodPhotography({
  dishName,
  description,
  style = "professional",
  lighting = "natural",
}: {
  dishName: string
  description: string
  style?: "professional" | "rustic" | "modern" | "artistic"
  lighting?: "natural" | "studio" | "moody" | "bright"
}) {
  try {
    const prompt = `Professional food photography of ${dishName}, ${description}, ${style} style, ${lighting} lighting, high-end restaurant presentation, appetizing, detailed textures, 8k resolution, commercial quality`

    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: prompt,
          negative_prompt: "blurry, low quality, amateur, bad lighting, unappetizing",
          width: 1024,
          height: 768,
          num_outputs: 1,
          scheduler: "K_EULER",
          num_inference_steps: 50,
          guidance_scale: 7.5,
        },
      },
    )

    return {
      imageUrl: Array.isArray(output) ? output[0] : output,
      error: null,
    }
  } catch (error) {
    console.error("Error generating food photography:", error)
    return {
      imageUrl: null,
      error: "Failed to generate image. Please try again.",
    }
  }
}

// Generate restaurant interior/exterior images
export async function generateRestaurantVisuals({
  type,
  style,
  ambiance,
  description,
}: {
  type: "interior" | "exterior" | "dining_area" | "kitchen"
  style: string
  ambiance: string
  description: string
}) {
  try {
    const prompt = `Professional architectural photography of restaurant ${type}, ${style} design, ${ambiance} ambiance, ${description}, high-end commercial photography, perfect lighting, 8k resolution`

    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: prompt,
          negative_prompt: "blurry, low quality, amateur, bad composition, poor lighting",
          width: 1200,
          height: 800,
          num_outputs: 1,
          scheduler: "K_EULER",
          num_inference_steps: 50,
          guidance_scale: 7.5,
        },
      },
    )

    return {
      imageUrl: Array.isArray(output) ? output[0] : output,
      error: null,
    }
  } catch (error) {
    console.error("Error generating restaurant visuals:", error)
    return {
      imageUrl: null,
      error: "Failed to generate image. Please try again.",
    }
  }
}

// Generate marketing graphics with text overlay
export async function generateMarketingGraphic({
  type,
  text,
  style,
  colors,
}: {
  type: "social_post" | "banner" | "flyer" | "menu_header"
  text: string
  style: string
  colors: string[]
}) {
  try {
    const prompt = `Professional marketing graphic for restaurant, ${type}, "${text}", ${style} design, color scheme: ${colors.join(", ")}, modern typography, high-quality commercial design`

    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: prompt,
          negative_prompt: "low quality, amateur design, poor typography, cluttered",
          width: type === "social_post" ? 1080 : type === "banner" ? 1200 : 800,
          height: type === "social_post" ? 1080 : type === "banner" ? 400 : 600,
          num_outputs: 1,
          scheduler: "K_EULER",
          num_inference_steps: 40,
          guidance_scale: 7,
        },
      },
    )

    return {
      imageUrl: Array.isArray(output) ? output[0] : output,
      error: null,
    }
  } catch (error) {
    console.error("Error generating marketing graphic:", error)
    return {
      imageUrl: null,
      error: "Failed to generate graphic. Please try again.",
    }
  }
}

// Disabled for deployment
export async function generateWithReplicate() {
  return {
    output: null,
    error: "Replicate disabled for deployment",
  }
}

export { replicate }
