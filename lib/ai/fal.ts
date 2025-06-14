import { fal } from "@fal-ai/client"

interface ImageGenerationOptions {
  width?: number
  height?: number
}

export async function generateImage(prompt: string, options: ImageGenerationOptions = {}) {
  try {
    const result = await fal.subscribe("fal-ai/flux/schnell", {
      input: {
        prompt,
        image_size: `${options.width || 1024}x${options.height || 1024}`,
        num_inference_steps: 4,
        enable_safety_checker: true,
      },
    })

    return {
      imageUrl: result.images[0].url,
      error: null,
    }
  } catch (error) {
    console.error("Fal AI error:", error)
    return {
      imageUrl: null,
      error: error instanceof Error ? error.message : "Image generation failed",
    }
  }
}
