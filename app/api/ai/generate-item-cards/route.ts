import { type NextRequest, NextResponse } from "next/server"
import { generateAIText } from "@/lib/ai/openai"

export async function POST(request: NextRequest) {
  try {
    const { menuData, cardType = "promotional", targetPlatform = "social" } = await request.json()

    if (!menuData || !menuData.categories) {
      return NextResponse.json({ error: "Menu data is required" }, { status: 400 })
    }

    // Get top items from each category
    const featuredItems = menuData.categories
      .flatMap(
        (cat: any) =>
          cat.items?.slice(0, 2).map((item: any) => ({
            ...item,
            category: cat.name,
          })) || [],
      )
      .slice(0, 6)

    const prompt = `Create promotional item cards for these featured menu items:

${featuredItems
  .map(
    (item, index) =>
      `${index + 1}. ${item.name} (${item.category}) - $${item.price}
     Description: ${item.description || "Delicious menu item"}`,
  )
  .join("\n")}

Card Specifications:
- Type: ${cardType}
- Platform: ${targetPlatform}
- Format: Social media ready (1080x1080 for Instagram, 1200x630 for Facebook)

For each item, provide:

1. **Headline Text:**
   - Catchy, attention-grabbing title
   - Maximum 6-8 words
   - Action-oriented language

2. **Description Copy:**
   - 2-3 sentences highlighting key features
   - Appetizing language that drives desire
   - Include price and value proposition

3. **Visual Recommendations:**
   - Photography style and composition
   - Background colors and textures
   - Text overlay placement
   - Logo and branding integration

4. **Call-to-Action:**
   - Specific action phrases
   - Urgency or scarcity elements
   - Contact information placement

5. **Hashtag Suggestions:**
   - Relevant food and restaurant hashtags
   - Local area hashtags
   - Trending food hashtags

6. **Design Elements:**
   - Border and frame suggestions
   - Icon usage recommendations
   - Color scheme alignment
   - Typography hierarchy

Create cards that are visually appealing, brand-consistent, and optimized for ${targetPlatform} engagement.`

    console.log("🃏 Generating item cards...")
    const result = await generateAIText(prompt, {
      temperature: 0.8,
      maxTokens: 700,
    })

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      content: result.text,
      mode: result.mode,
      cardType,
      targetPlatform,
      itemCount: featuredItems.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Item cards generation error:", error)
    return NextResponse.json({ error: "Failed to generate item cards" }, { status: 500 })
  }
}
