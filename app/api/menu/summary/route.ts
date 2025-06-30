import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // In a real implementation, this would fetch from your menu database
    // For now, return mock data that matches the expected structure
    const menuSummary = {
      totalItems: 28,
      categories: ["Appetizers", "Main Course", "Desserts", "Beverages", "Specials"],
      featured: ["Butter Chicken", "Chicken Biryani", "Garlic Naan", "Mango Lassi", "Gulab Jamun"],
      popularItems: [
        { name: "Butter Chicken", orders: 245, rating: 4.8 },
        { name: "Chicken Biryani", orders: 198, rating: 4.7 },
        { name: "Palak Paneer", orders: 156, rating: 4.6 },
        { name: "Garlic Naan", orders: 312, rating: 4.9 },
      ],
      menuStats: {
        vegetarian: 12,
        vegan: 8,
        glutenFree: 6,
        spicyItems: 15,
      },
      priceRange: {
        min: 8.99,
        max: 24.99,
        average: 16.5,
      },
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json(menuSummary)
  } catch (error) {
    console.error("Error fetching menu summary:", error)
    return NextResponse.json({ error: "Failed to fetch menu summary" }, { status: 500 })
  }
}
