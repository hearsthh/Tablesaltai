import { type NextRequest, NextResponse } from "next/server"
import { generateAIText } from "@/lib/ai/openai"

export async function POST(request: NextRequest) {
  try {
    const { menuData, designStyle = "modern", colorScheme = "warm", restaurantType = "casual" } = await request.json()

    if (!menuData) {
      return NextResponse.json({ error: "Menu data is required" }, { status: 400 })
    }

    const totalItems = menuData.categories?.reduce((acc: number, cat: any) => acc + (cat.items?.length || 0), 0) || 0
    const categories = menuData.categories?.map((cat: any) => cat.name).join(", ") || "Various"
    const avgPrice =
      menuData.categories?.reduce((acc: number, cat: any) => {
        const catTotal = cat.items?.reduce((sum: number, item: any) => sum + (item.price || 0), 0) || 0
        return acc + catTotal
      }, 0) / totalItems || 0

    const cuisineType = detectCuisineType(menuData)
    const priceRange = getPriceRange(avgPrice)

    const prompt = `Create 3 unique, personalized menu design templates for this specific restaurant:

RESTAURANT ANALYSIS:
- Cuisine Type: ${cuisineType}
- Categories: ${categories}
- Total Items: ${totalItems}
- Average Price: $${avgPrice.toFixed(2)}
- Price Range: ${priceRange}
- Restaurant Type: ${restaurantType}
- Preferred Style: ${designStyle}
- Color Preference: ${colorScheme}

Generate 3 DISTINCT design templates that are specifically tailored to this restaurant's identity:

Template 1: Should reflect the cuisine type and price range
Template 2: Should emphasize the restaurant's unique selling points
Template 3: Should target the specific customer demographic

For each template, provide:
1. **Template Name** (creative, restaurant-specific)
2. **Design Philosophy** (why this works for this restaurant)
3. **Color Palette** (3-4 specific hex colors that match the cuisine/vibe)
4. **Typography Style** (specific font recommendations)
5. **Layout Structure** (how categories and items should be arranged)
6. **Visual Elements** (borders, icons, spacing that fits the theme)
7. **Target Customer** (who this design appeals to)

Make each template UNIQUE and PERSONALIZED - not generic. Consider:
- Cultural elements for ethnic cuisines
- Sophistication level matching price point
- Visual hierarchy for the specific menu structure
- Brand personality that matches the food style

Format as JSON:
{
  "templates": [
    {
      "id": "template1",
      "name": "Template Name",
      "philosophy": "Why this works...",
      "colors": ["#hex1", "#hex2", "#hex3", "#hex4"],
      "typography": {
        "header": "Font for restaurant name",
        "category": "Font for categories", 
        "item": "Font for items",
        "price": "Font for prices"
      },
      "layout": {
        "structure": "Layout description",
        "spacing": "Spacing guidelines",
        "hierarchy": "Visual hierarchy"
      },
      "elements": {
        "borders": "Border style",
        "icons": "Icon style",
        "accents": "Accent elements"
      },
      "target": "Target customer description"
    }
  ]
}`

    console.log("🎨 Generating personalized menu design templates...")
    const result = await generateAIText(prompt, {
      temperature: 0.8,
      maxTokens: 1200,
    })

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    // Try to parse the JSON response
    let templates = []
    const restaurantAnalysis = {
      cuisineType,
      priceRange,
      avgPrice,
      totalItems,
      categories: menuData.categories?.length || 0,
    }

    try {
      // Clean the response text before parsing
      let cleanedText = result.text || "{}"

      // Remove any markdown formatting
      cleanedText = cleanedText.replace(/```json\n?/g, "").replace(/```\n?/g, "")

      // Try to extract JSON if it's embedded in other text
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        cleanedText = jsonMatch[0]
      }

      console.log("Attempting to parse:", cleanedText)
      const parsed = JSON.parse(cleanedText)
      templates = parsed.templates || []

      // Validate templates structure
      templates = templates.filter((template: any) => template.id && template.name && template.colors)
    } catch (parseError) {
      console.log("Failed to parse JSON, using fallback templates:", parseError)
      templates = generateFallbackTemplates(menuData, cuisineType, priceRange)
    }

    // Ensure we always have templates
    if (!templates || templates.length === 0) {
      templates = generateFallbackTemplates(menuData, cuisineType, priceRange)
    }

    return NextResponse.json({
      success: true,
      templates,
      restaurantAnalysis,
      mode: result.mode,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Menu design generation error:", error)
    return NextResponse.json({ error: "Failed to generate menu design" }, { status: 500 })
  }
}

function detectCuisineType(menuData: any): string {
  const categories = menuData.categories?.map((cat: any) => cat.name.toLowerCase()).join(" ") || ""
  const items =
    menuData.categories
      ?.flatMap((cat: any) => cat.items?.map((item: any) => item.name.toLowerCase()) || [])
      .join(" ") || ""

  const text = (categories + " " + items).toLowerCase()

  if (text.includes("pizza") || text.includes("pasta") || text.includes("italian")) return "Italian"
  if (text.includes("sushi") || text.includes("ramen") || text.includes("japanese")) return "Japanese"
  if (text.includes("curry") || text.includes("naan") || text.includes("biryani") || text.includes("indian"))
    return "Indian"
  if (text.includes("taco") || text.includes("burrito") || text.includes("mexican")) return "Mexican"
  if (text.includes("burger") || text.includes("fries") || text.includes("american")) return "American"
  if (text.includes("dim sum") || text.includes("chinese") || text.includes("wok")) return "Chinese"
  if (text.includes("croissant") || text.includes("french") || text.includes("baguette")) return "French"

  return "International Fusion"
}

function getPriceRange(avgPrice: number): string {
  if (avgPrice < 10) return "Budget-Friendly"
  if (avgPrice < 20) return "Mid-Range"
  if (avgPrice < 35) return "Upscale Casual"
  return "Fine Dining"
}

function generateFallbackTemplates(menuData: any, cuisineType: string, priceRange: string) {
  return [
    {
      id: "personalized_1",
      name: `${cuisineType} Heritage`,
      philosophy: `Celebrates the authentic ${cuisineType} tradition with cultural elements`,
      colors: getCuisineColors(cuisineType)[0],
      typography: {
        header: "Playfair Display",
        category: "Lato Bold",
        item: "Lato Regular",
        price: "Lato Bold",
      },
      layout: {
        structure: "Traditional layout with cultural motifs",
        spacing: "Generous spacing for elegance",
        hierarchy: "Clear category separation",
      },
      elements: {
        borders: "Cultural pattern borders",
        icons: `${cuisineType}-inspired icons`,
        accents: "Traditional color accents",
      },
      target: `${cuisineType} food enthusiasts and cultural diners`,
    },
    {
      id: "personalized_2",
      name: `${priceRange} Elegance`,
      philosophy: `Designed for ${priceRange} dining experience`,
      colors: getPriceRangeColors(priceRange),
      typography: {
        header: "Montserrat Bold",
        category: "Montserrat SemiBold",
        item: "Open Sans Regular",
        price: "Open Sans Bold",
      },
      layout: {
        structure: `Layout optimized for ${priceRange} expectations`,
        spacing: "Balanced spacing for readability",
        hierarchy: "Price-appropriate visual weight",
      },
      elements: {
        borders: "Clean, modern borders",
        icons: "Minimalist food icons",
        accents: "Subtle premium touches",
      },
      target: `${priceRange} diners seeking quality`,
    },
    {
      id: "personalized_3",
      name: "Signature Style",
      philosophy: "Unique design reflecting restaurant's personality",
      colors: ["#2D3748", "#4A5568", "#E53E3E", "#F7FAFC"],
      typography: {
        header: "Roboto Slab Bold",
        category: "Roboto Medium",
        item: "Roboto Regular",
        price: "Roboto Bold",
      },
      layout: {
        structure: "Custom layout highlighting specialties",
        spacing: "Dynamic spacing for visual interest",
        hierarchy: "Emphasis on signature items",
      },
      elements: {
        borders: "Custom accent borders",
        icons: "Restaurant-specific icons",
        accents: "Brand personality elements",
      },
      target: "Customers seeking unique dining experience",
    },
  ]
}

function getCuisineColors(cuisine: string): string[][] {
  const colorMap: { [key: string]: string[][] } = {
    Italian: [
      ["#8B0000", "#228B22", "#FFD700", "#F5F5DC"], // Red, Green, Gold, Cream
      ["#800000", "#006400", "#FF6347", "#FFFAF0"], // Maroon, Dark Green, Tomato, Floral White
    ],
    Indian: [
      ["#FF6B35", "#F7931E", "#FFD23F", "#8B4513"], // Saffron, Orange, Turmeric, Brown
      ["#DC143C", "#FF8C00", "#DAA520", "#8B4513"], // Crimson, Dark Orange, Goldenrod, Saddle Brown
    ],
    Japanese: [
      ["#2F4F4F", "#B22222", "#000000", "#F5F5F5"], // Dark Slate Gray, Fire Brick, Black, White Smoke
      ["#8B4513", "#DC143C", "#2F4F4F", "#FFFAF0"], // Saddle Brown, Crimson, Dark Slate Gray, Floral White
    ],
    Mexican: [
      ["#FF4500", "#32CD32", "#FFD700", "#8B4513"], // Orange Red, Lime Green, Gold, Saddle Brown
      ["#DC143C", "#228B22", "#FF6347", "#F4A460"], // Crimson, Forest Green, Tomato, Sandy Brown
    ],
  }

  return colorMap[cuisine] || [["#2D3748", "#4A5568", "#E53E3E", "#F7FAFC"]]
}

function getPriceRangeColors(priceRange: string): string[] {
  const colorMap: { [key: string]: string[] } = {
    "Budget-Friendly": ["#FF6B35", "#FFA500", "#32CD32", "#F0F8FF"],
    "Mid-Range": ["#4682B4", "#20B2AA", "#FFD700", "#F5F5F5"],
    "Upscale Casual": ["#2F4F4F", "#B8860B", "#CD853F", "#FFF8DC"],
    "Fine Dining": ["#000000", "#8B0000", "#DAA520", "#FFFAF0"],
  }

  return colorMap[priceRange] || ["#2D3748", "#4A5568", "#E53E3E", "#F7FAFC"]
}
