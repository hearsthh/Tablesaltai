import { type NextRequest, NextResponse } from "next/server"
import { generateAIText } from "@/lib/ai/openai"

export async function POST(request: NextRequest) {
  try {
    const { menuData, season = "current", occasion = "general" } = await request.json()

    if (!menuData) {
      return NextResponse.json({ error: "Menu data is required" }, { status: 400 })
    }

    const currentMonth = new Date().getMonth()
    const seasons = {
      spring: "Spring (March-May)",
      summer: "Summer (June-August)",
      fall: "Fall (September-November)",
      winter: "Winter (December-February)",
    }

    const currentSeason =
      season === "current"
        ? currentMonth >= 2 && currentMonth <= 4
          ? "spring"
          : currentMonth >= 5 && currentMonth <= 7
            ? "summer"
            : currentMonth >= 8 && currentMonth <= 10
              ? "fall"
              : "winter"
        : season

    const existingCategories = menuData.categories?.map((cat: any) => cat.name).join(", ") || ""
    const sampleItems =
      menuData.categories
        ?.flatMap((cat: any) => cat.items?.slice(0, 2).map((item: any) => `${item.name} ($${item.price})`) || [])
        .slice(0, 8)
        .join(", ") || ""

    const prompt = `Create a seasonal menu variation for ${seasons[currentSeason as keyof typeof seasons]} with occasion: ${occasion}

Current Menu Context:
- Existing categories: ${existingCategories}
- Sample current items: ${sampleItems}

Please create:

1. **Seasonal Menu Theme:**
   - Overall concept and story
   - Seasonal ingredient focus
   - Cultural or holiday connections
   - Pricing strategy for seasonal items

2. **New Seasonal Items (6-8 items):**
   For each item provide:
   - Item name with seasonal flair
   - Detailed appetizing description
   - Key seasonal ingredients highlighted
   - Suggested price point
   - Category placement

3. **Limited-Time Offers:**
   - 2-3 special promotional items
   - Urgency-driven descriptions
   - Bundle or combo opportunities
   - Social media worthy presentations

4. **Seasonal Modifications:**
   - How to adapt existing popular items
   - Seasonal garnishes and presentations
   - Temperature-appropriate variations
   - Ingredient substitutions for seasonality

5. **Marketing Angles:**
   - Seasonal storytelling opportunities
   - Instagram-worthy presentation ideas
   - Customer engagement strategies
   - Cross-selling opportunities

6. **Operational Considerations:**
   - Ingredient sourcing recommendations
   - Prep time and complexity notes
   - Staff training requirements
   - Menu integration suggestions

Focus on items that celebrate ${currentSeason} flavors while complementing your existing menu structure.`

    console.log(`📅 Generating ${currentSeason} seasonal menu...`)
    const result = await generateAIText(prompt, {
      temperature: 0.8,
      maxTokens: 900,
    })

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      content: result.text,
      mode: result.mode,
      season: currentSeason,
      occasion,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Seasonal menu generation error:", error)
    return NextResponse.json({ error: "Failed to generate seasonal menu" }, { status: 500 })
  }
}
