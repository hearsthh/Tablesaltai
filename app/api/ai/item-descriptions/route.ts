import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    console.log("=== Item Descriptions API Route ===")

    // Parse request body safely
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError)
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON in request body",
          mode: "error",
        },
        { status: 400 },
      )
    }

    const { items, tone = "casual", length = "medium", includeTags = false } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error("Invalid items data provided")
      return NextResponse.json(
        {
          success: false,
          error: "Items array is required and must not be empty",
          mode: "error",
        },
        { status: 400 },
      )
    }

    console.log("Processing", items.length, "items for description enhancement")

    // Try OpenAI first, then fallback
    try {
      const { generateItemDescriptions } = await import("@/lib/ai/openai")

      const result = await generateItemDescriptions(items, {
        tone,
        length,
        includeTags,
      })

      if (result.error) {
        console.error("OpenAI Error:", result.error)
        // Fall back to local generation
        return generateFallbackDescriptions(items, tone, length, includeTags)
      }

      console.log("✅ Item descriptions generated successfully via OpenAI")

      // Parse the descriptions from the response
      let descriptions = []

      try {
        if (result.text) {
          // Try to parse as JSON first
          const parsed = JSON.parse(result.text)
          if (parsed.descriptions) {
            descriptions = parsed.descriptions
          }
        }
      } catch (parseError) {
        console.log("Could not parse as JSON, generating from text response")
      }

      // If we couldn't parse JSON, generate descriptions manually
      if (descriptions.length === 0) {
        descriptions = items.map((item) => {
          const enhancedDesc = generateEnhancedDescription(item, tone, length)
          const tags = includeTags ? generateItemTags(item) : { tasteTags: [], promoTags: [] }

          return {
            item: item.name,
            original: item.description,
            generated: enhancedDesc,
            ...tags,
          }
        })
      }

      return NextResponse.json({
        success: true,
        descriptions: descriptions,
        fullResponse: result.text,
        mode: result.mode || "openai",
        usage: result.usage,
        cost: result.cost,
        responseTime: result.responseTime,
      })
    } catch (importError) {
      console.error("Failed to import OpenAI module:", importError)
      return generateFallbackDescriptions(items, tone, length, includeTags)
    }
  } catch (error) {
    console.error("❌ Item Descriptions API Error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        mode: "error",
      },
      { status: 500 },
    )
  }
}

function generateFallbackDescriptions(items: any[], tone: string, length: string, includeTags: boolean) {
  console.log("🔄 Generating fallback descriptions...")

  const descriptions = items.map((item) => {
    const enhancedDesc = generateEnhancedDescription(item, tone, length)
    const tags = includeTags ? generateItemTags(item) : { tasteTags: [], promoTags: [] }

    return {
      item: item.name,
      original: item.description,
      generated: enhancedDesc,
      ...tags,
    }
  })

  return NextResponse.json({
    success: true,
    descriptions: descriptions,
    fullResponse: "Enhanced descriptions generated using fallback system",
    mode: "fallback",
    note: "OpenAI unavailable, using intelligent fallback descriptions",
  })
}

function generateEnhancedDescription(item: any, tone: string, length: string): string {
  const name = item.name.toLowerCase()
  const originalDesc = item.description || ""

  // Enhanced description based on tone and length
  if (length === "short") {
    if (tone === "exotic") {
      if (name.includes("chicken")) return "Mystical tandoor-kissed poultry"
      if (name.includes("paneer")) return "Sacred cottage cheese delight"
      if (name.includes("samosa")) return "Golden spiced parcels"
      return "Enigmatic culinary treasure"
    } else if (tone === "formal") {
      if (name.includes("chicken")) return "Premium grilled chicken breast"
      if (name.includes("paneer")) return "Artisanal cottage cheese"
      if (name.includes("samosa")) return "Hand-crafted spiced pastries"
      return "Expertly prepared delicacy"
    } else if (tone === "young") {
      if (name.includes("chicken")) return "Fire-grilled chicken perfection"
      if (name.includes("paneer")) return "Fresh cottage cheese magic"
      if (name.includes("samosa")) return "Crispy flavor bombs"
      return "Absolutely delicious vibes"
    } else {
      if (name.includes("chicken")) return "Tender grilled chicken"
      if (name.includes("paneer")) return "Grilled cottage cheese"
      if (name.includes("samosa")) return "Crispy spiced pastries"
      return "Deliciously prepared dish"
    }
  } else if (length === "medium") {
    if (tone === "exotic") {
      if (name.includes("chicken")) return "Tender poultry blessed by tandoor flames with exotic forbidden spices"
      if (name.includes("paneer")) return "Artisanal cottage cheese infused with rare herbs from mystical valleys"
      if (name.includes("samosa")) return "Hand-crafted golden triangles harboring secrets of ancient spice routes"
      return "Carefully guarded recipe passed down through generations of master chefs"
    } else if (tone === "formal") {
      if (name.includes("chicken"))
        return "Premium chicken breast marinated in traditional spices and grilled to perfection"
      if (name.includes("paneer"))
        return "Artisanal cottage cheese prepared in-house, delicately seasoned and grilled with herbs"
      if (name.includes("samosa"))
        return "Meticulously hand-folded pastries filled with seasoned potatoes, served with mint accompaniment"
      return "Carefully prepared using traditional culinary techniques and premium ingredients from trusted suppliers"
    } else if (tone === "young") {
      if (name.includes("chicken"))
        return "Juicy chicken kissed by tandoor flames and loaded with incredible spice blends"
      if (name.includes("paneer")) return "Fresh cottage cheese grilled to perfection with herbs that'll blow your mind"
      if (name.includes("samosa"))
        return "Crispy golden triangles absolutely loaded with spiced potato goodness and mint sauce"
      return "This dish is seriously next-level with flavors that'll have you coming back"
    } else {
      if (name.includes("chicken")) return "Juicy chicken marinated in traditional spices and grilled to perfection"
      if (name.includes("paneer")) return "House-made cottage cheese grilled with aromatic herbs and spices"
      if (name.includes("samosa"))
        return "Hand-folded pastries filled with spiced potatoes, served with cooling mint chutney"
      return "Carefully prepared using traditional techniques and fresh, quality ingredients"
    }
  } else {
    // long
    if (tone === "exotic") {
      if (name.includes("chicken"))
        return "Succulent poultry marinated overnight in mystical blend of rare spices sourced from remote mountain villages, blessed by sacred flames of traditional tandoor oven until perfectly charred"
      if (name.includes("paneer"))
        return "House-crafted cottage cheese cubes bathed in yogurt infused with exotic spices from ancient spice markets, grilled over glowing coals until golden and aromatic with fresh herbs"
      if (name.includes("samosa"))
        return "Golden triangular treasures hand-folded by skilled artisans, filled with aromatic potatoes kissed by ancient spices from the legendary Silk Road, served with cooling mint chutney"
      return "Extraordinary culinary journey crafted using time-honored techniques and rare ingredients sourced from remote corners of the subcontinent, prepared with reverence for ancient culinary traditions"
    } else if (tone === "formal") {
      if (name.includes("chicken"))
        return "Premium chicken breast, carefully marinated for optimal flavor development in signature blend of traditional spices, grilled to perfection in authentic tandoor oven to achieve ideal balance of tenderness"
      if (name.includes("paneer"))
        return "House-made cottage cheese of exceptional quality, carefully prepared using traditional methods, marinated in aromatic spices and yogurt, grilled to achieve perfect texture while maintaining delicate flavor profile"
      if (name.includes("samosa"))
        return "Exquisitely crafted triangular pastries, hand-folded using traditional techniques and filled with perfectly seasoned potatoes, delicately fried to achieve optimal crispness and served with signature mint chutney"
      return "Meticulously prepared using time-honored culinary techniques passed down through generations, featuring only finest premium ingredients carefully sourced from trusted suppliers to ensure exceptional quality and authentic flavors"
    } else if (tone === "young") {
      if (name.includes("chicken"))
        return "This chicken is marinated overnight in most incredible spice blend you've ever tasted, thrown into blazing tandoor until perfectly charred and smoky with flavors that'll absolutely blow your mind"
      if (name.includes("paneer"))
        return "We make this cottage cheese fresh in-house every day, marinate it in yogurt and spices that are totally next-level, grill it until golden and perfect with herbs"
      if (name.includes("samosa"))
        return "These golden crispy triangles are absolutely packed with perfectly spiced potato filling that's been seasoned to perfection, fried until super crispy and served with most refreshing mint chutney"
      return "This dish is crafted using traditional techniques that have been perfected over generations, but with modern twist that makes every single bite an incredible flavor explosion you'll crave"
    } else {
      if (name.includes("chicken"))
        return "Succulent chicken pieces marinated overnight in aromatic spices and yogurt, then grilled in our traditional tandoor oven until perfectly tender and smoky with incredible depth of flavor"
      if (name.includes("paneer"))
        return "Fresh cottage cheese made in-house daily, marinated in yogurt and spices, then grilled to golden perfection and served with fresh herbs that enhance the creamy texture"
      if (name.includes("samosa"))
        return "Golden, hand-folded pastry triangles filled with perfectly spiced potatoes, fried until crispy and served with our refreshing house-made mint chutney that perfectly complements the warm spices"
      return "Expertly crafted using time-honored traditional techniques and finest fresh ingredients, prepared with care to bring you authentic flavors that celebrate the rich culinary heritage of the region"
    }
  }
}

function generateItemTags(item: any): { tasteTags: string[]; promoTags: string[] } {
  const name = item.name.toLowerCase()
  const desc = (item.description || "").toLowerCase()

  const tasteTags = []
  const promoTags = []

  // Generate taste tags based on item name and description
  if (name.includes("spicy") || desc.includes("spicy") || name.includes("hot")) {
    tasteTags.push("spicy")
  }
  if (name.includes("mild") || desc.includes("mild")) {
    tasteTags.push("mild")
  }
  if (name.includes("sweet") || desc.includes("sweet")) {
    tasteTags.push("sweet")
  }
  if (name.includes("paneer") || name.includes("vegetable") || desc.includes("vegetarian")) {
    tasteTags.push("vegetarian")
  }
  if (name.includes("chicken") || name.includes("meat") || name.includes("lamb")) {
    tasteTags.push("non-vegetarian")
  }
  if (name.includes("creamy") || desc.includes("cream") || desc.includes("yogurt")) {
    tasteTags.push("creamy")
  }
  if (name.includes("crispy") || desc.includes("fried") || desc.includes("crispy")) {
    tasteTags.push("crispy")
  }

  // Add default taste tag if none found
  if (tasteTags.length === 0) {
    tasteTags.push("savory")
  }

  // Generate promo tags
  if (Math.random() > 0.7) promoTags.push("popular")
  if (Math.random() > 0.8) promoTags.push("chef-special")
  if (name.includes("special") || desc.includes("signature")) {
    promoTags.push("signature")
  }

  return { tasteTags, promoTags }
}
