// Completely disabled for deployment
console.log("Fal AI disabled for deployment")

export async function generateImage() {
  return {
    imageUrl: null,
    error: "Image generation disabled for deployment",
  }
}

export async function generateFoodImage() {
  return {
    imageUrl: null,
    error: "Image generation disabled for deployment",
  }
}

export async function generateRestaurantImage() {
  return {
    imageUrl: null,
    error: "Image generation disabled for deployment",
  }
}

export const falClient = null
