// No Fal integration - not installed in v0
export async function generateImage() {
  return {
    imageUrl: null,
    error: "Fal AI not configured. Please install Fal integration first.",
  }
}

export async function generateFoodImage() {
  return {
    imageUrl: null,
    error: "Fal AI not configured. Please install Fal integration first.",
  }
}

export async function generateRestaurantImage() {
  return {
    imageUrl: null,
    error: "Fal AI not configured. Please install Fal integration first.",
  }
}

export const falClient = null
