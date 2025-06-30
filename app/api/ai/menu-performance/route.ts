import { type NextRequest, NextResponse } from "next/server"
import { generateAIText } from "@/lib/ai/openai"

export async function POST(request: NextRequest) {
  try {
    const { menuData } = await request.json()

    if (!menuData || !menuData.categories) {
      return NextResponse.json({ error: "Menu data is required" }, { status: 400 })
    }

    const totalItems = menuData.categories.reduce((acc: number, cat: any) => acc + (cat.items?.length || 0), 0)
    const categories = menuData.categories.map((cat: any) => ({
      name: cat.name,
      itemCount: cat.items?.length || 0,
      avgPrice: cat.items?.reduce((sum: number, item: any) => sum + (item.price || 0), 0) / (cat.items?.length || 1),
    }))

    const allItems = menuData.categories.flatMap(
      (cat: any) =>
        cat.items?.map((item: any) => ({
          ...item,
          category: cat.name,
        })) || [],
    )

    const priceRange = allItems.map((item) => item.price || 0)
    const avgPrice = priceRange.reduce((sum, price) => sum + price, 0) / priceRange.length
    const minPrice = Math.min(...priceRange)
    const maxPrice = Math.max(...priceRange)

    const prompt = `Analyze this restaurant menu and provide a comprehensive performance report:

MENU OVERVIEW:
- Total Categories: ${menuData.categories.length}
- Total Items: ${totalItems}
- Price Range: $${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}
- Average Price: $${avgPrice.toFixed(2)}

CATEGORY BREAKDOWN:
${categories.map((cat) => `- ${cat.name}: ${cat.itemCount} items, avg price $${cat.avgPrice.toFixed(2)}`).join("\n")}

SAMPLE ITEMS:
${allItems
  .slice(0, 10)
  .map((item) => `- ${item.name} (${item.category}): $${item.price || 0}`)
  .join("\n")}

Please provide:

1. **MENU SCORE (0-10):**
   - Overall menu effectiveness score
   - Justification for the score
   - Key strengths and weaknesses

2. **TOP PERFORMING ITEMS (Predicted):**
   - 5 items most likely to be popular
   - Reasons for high performance potential
   - Suggested promotional strategies

3. **UNDERPERFORMING ITEMS (Predicted):**
   - 3-5 items that may struggle
   - Specific issues (pricing, description, positioning)
   - Improvement recommendations

4. **MENU SPECIFICATIONS ANALYSIS:**
   - Menu length assessment (too long/short/optimal)
   - Category balance evaluation
   - Price distribution analysis
   - Menu spread and variety assessment

5. **OPTIMIZATION RECOMMENDATIONS:**
   - Specific items to promote heavily
   - Items to reposition or reprice
   - Menu structure improvements
   - Category organization suggestions
   - Pricing strategy adjustments

6. **COMPETITIVE POSITIONING:**
   - Market positioning assessment
   - Competitive advantages
   - Areas for differentiation
   - Value proposition analysis

Provide specific, actionable insights that can immediately improve menu performance and profitability.`

    console.log("📊 Generating menu performance analysis...")
    const result = await generateAIText(prompt, {
      temperature: 0.3,
      maxTokens: 1000,
    })

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    // Generate mock performance data for visualization
    const performanceData = {
      menuScore: Math.floor(Math.random() * 3) + 7, // 7-10 range
      topItems: allItems.slice(0, 5).map((item) => ({
        ...item,
        performanceScore: Math.floor(Math.random() * 20) + 80, // 80-100 range
        predictedPopularity: "High",
      })),
      underperformingItems: allItems.slice(-3).map((item) => ({
        ...item,
        performanceScore: Math.floor(Math.random() * 30) + 40, // 40-70 range
        issues: ["Pricing concerns", "Description needs improvement"],
      })),
      menuSpecs: {
        totalItems,
        totalCategories: menuData.categories.length,
        avgPrice,
        priceRange: { min: minPrice, max: maxPrice },
        categoryBalance: categories.map((cat) => ({
          name: cat.name,
          percentage: Math.round((cat.itemCount / totalItems) * 100),
        })),
      },
    }

    return NextResponse.json({
      success: true,
      analysis: result.text,
      performanceData,
      mode: result.mode,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Menu performance analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze menu performance" }, { status: 500 })
  }
}
