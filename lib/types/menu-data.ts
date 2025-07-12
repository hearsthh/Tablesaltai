// Menu Data Types - Corrected for food preparation and dietary details

export interface MenuCategory {
  id: string
  name: string
  description?: string
  displayOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface MenuItem {
  id: string
  categoryId: string
  name: string
  price: number
  description: string
  status: "available" | "oos" // Available or Out of Stock
  category: string // Category selection

  // Food preparation and dietary details
  itemType: string[] // Vegan, Gluten-Free, Non-Veg, Jain, Dairy-Free, etc.
  spiceLevel: "none" | "mild" | "medium" | "hot" | "very_hot" | "extremely_hot"
  preparationType: string[] // Grilled, Fried, Baked, Steamed, Raw, Boiled, etc.

  // Taste and promotion tags
  tagTaste: string[] // Spicy, Sweet, Sour, Tangy, Bitter, Salty, etc.
  tagPromote: string[] // Chef's Special, Popular, New, Bestseller, etc.

  // Additional details
  ingredients: string[]
  allergens: string[]
  preparationTime: number // in minutes
  calories?: number
  servingSize?: string

  images: string[]
  isActive: boolean
  displayOrder: number
  createdAt: string
  updatedAt: string
}

export interface MenuData {
  id: string
  userId: string
  restaurantId: string
  categories: MenuCategory[]
  items: MenuItem[]
  lastSyncAt?: string
  completionStatus: {
    categories: boolean
    items: boolean
    overall: number
  }
  createdAt: string
  updatedAt: string
}

// Menu-specific constants
export const MENU_ITEM_STATUS_OPTIONS = [
  { value: "available", label: "Available" },
  { value: "oos", label: "Out of Stock" },
]

export const ITEM_TYPES = [
  "Vegan",
  "Vegetarian",
  "Non-Vegetarian",
  "Jain",
  "Gluten-Free",
  "Dairy-Free",
  "Nut-Free",
  "Keto",
  "Low-Carb",
  "High-Protein",
  "Organic",
  "Halal",
  "Kosher",
  "Sugar-Free",
  "Low-Sodium",
]

export const SPICE_LEVELS = [
  { value: "none", label: "No Spice" },
  { value: "mild", label: "Mild" },
  { value: "medium", label: "Medium" },
  { value: "hot", label: "Hot" },
  { value: "very_hot", label: "Very Hot" },
  { value: "extremely_hot", label: "Extremely Hot" },
]

export const PREPARATION_TYPES = [
  "Grilled",
  "Fried",
  "Deep-Fried",
  "Baked",
  "Steamed",
  "Raw",
  "Boiled",
  "Roasted",
  "Sautéed",
  "Smoked",
  "Braised",
  "Stir-Fried",
  "Pan-Fried",
  "Tandoor",
  "BBQ",
]

export const TASTE_TAGS = [
  "Spicy",
  "Sweet",
  "Sour",
  "Tangy",
  "Bitter",
  "Salty",
  "Mild",
  "Rich",
  "Creamy",
  "Crispy",
  "Juicy",
  "Smoky",
  "Fresh",
  "Aromatic",
]

export const PROMOTION_TAGS = [
  "Chef's Special",
  "Popular",
  "New",
  "Bestseller",
  "Recommended",
  "Limited Time",
  "Seasonal",
  "House Special",
  "Customer Favorite",
  "Award Winner",
  "Signature Dish",
  "Must Try",
]

export const COMMON_ALLERGENS = [
  "Nuts",
  "Peanuts",
  "Dairy",
  "Eggs",
  "Gluten",
  "Soy",
  "Shellfish",
  "Fish",
  "Sesame",
  "Mustard",
  "Celery",
  "Sulphites",
]
