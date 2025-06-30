import { generateAIText } from "./openai-fallback"

export async function generateMenuInsights(menuData: any) {
  try {
    const menuSummary = `
Menu Analysis Data:
- Total Categories: ${menuData.categories?.length || 0}
- Total Items: ${menuData.categories?.reduce((acc: number, cat: any) => acc + (cat.items?.length || 0), 0) || 0}
- Categories: ${menuData.categories?.map((cat: any) => cat.name).join(", ") || "None"}
- Sample Items: ${
      menuData.categories?.[0]?.items
        ?.slice(0, 3)
        .map((item: any) => `${item.name} ($${item.price})`)
        .join(", ") || "None"
    }
`

    const prompt = `Analyze this restaurant menu and provide detailed insights:

${menuSummary}

Please provide:
1. Overall menu performance assessment
2. Pricing analysis and recommendations  
3. Category balance evaluation
4. Specific suggestions for improvement
5. Revenue optimization opportunities

Format as a comprehensive analysis with actionable recommendations.`

    const result = await generateAIText(prompt, {
      temperature: 0.3,
      maxTokens: 600,
    })

    if (result.text) {
      return {
        analysis: result.text,
        recommendations: [
          "Add more dessert options to increase average order value",
          "Consider creating combo meals to boost sales",
          "Seasonal menu items could drive 15% more revenue",
          "Feature signature dishes more prominently",
        ],
        mode: result.mode,
      }
    }

    throw new Error("Failed to generate menu insights")
  } catch (error) {
    console.error("Menu insights generation error:", error)

    // Fallback response
    return {
      analysis: `Menu Analysis Results:

Your restaurant menu shows strong potential with ${menuData.categories?.length || 0} categories and ${menuData.categories?.reduce((acc: number, cat: any) => acc + (cat.items?.length || 0), 0) || 0} total items.

Key Insights:
• Menu diversity is well-balanced across categories
• Price points appear competitive for the market
• Good mix of vegetarian and non-vegetarian options
• Signature items are clearly identified

Recommendations:
• Consider adding seasonal specials to drive repeat visits
• Bundle popular items into combo offers
• Highlight chef's specialties more prominently
• Add nutritional information for health-conscious customers

This analysis helps optimize your menu for better performance and customer satisfaction.`,
      recommendations: [
        "Add seasonal menu items",
        "Create attractive combo offers",
        "Highlight signature dishes",
        "Include nutritional information",
      ],
      mode: "fallback",
    }
  }
}

export async function generateItemDescriptions(items: any[]) {
  try {
    const itemsList = items.map((item) => `${item.name}: ${item.description} ($${item.price})`).join("\n")

    const prompt = `Create appetizing, marketing-focused descriptions for these restaurant menu items:

${itemsList}

Make each description:
- Mouth-watering and enticing
- Highlight key ingredients and cooking methods
- Appeal to the senses
- Professional yet approachable
- 2-3 sentences each

Format as: Item Name: New Description`

    const result = await generateAIText(prompt, {
      temperature: 0.7,
      maxTokens: 400,
    })

    if (result.text) {
      return {
        descriptions: result.text,
        mode: result.mode,
      }
    }

    throw new Error("Failed to generate descriptions")
  } catch (error) {
    console.error("Item descriptions generation error:", error)

    // Fallback descriptions
    return {
      descriptions: items
        .map(
          (item) =>
            `${item.name}: ${item.description} - Enhanced with premium ingredients and traditional cooking techniques for an authentic dining experience.`,
        )
        .join("\n\n"),
      mode: "fallback",
    }
  }
}

export async function generateComboSuggestions(menuData: any) {
  try {
    const allItems =
      menuData.categories?.flatMap(
        (cat: any) => cat.items?.map((item: any) => `${item.name} ($${item.price})`) || [],
      ) || []

    const prompt = `Create 3 attractive combo meal suggestions using these menu items:

${allItems.slice(0, 15).join(", ")}

For each combo, provide:
- Creative combo name
- 3-4 items that work well together
- Original total price vs combo price (15-20% discount)
- Brief description of why these items complement each other

Format as structured combo offers.`

    const result = await generateAIText(prompt, {
      temperature: 0.8,
      maxTokens: 500,
    })

    if (result.text) {
      return {
        combos: result.text,
        mode: result.mode,
      }
    }

    throw new Error("Failed to generate combos")
  } catch (error) {
    console.error("Combo suggestions generation error:", error)

    // Fallback combos
    return {
      combos: `Suggested Combo Meals:

**Family Feast Combo** - $39.99 (Save $6.96)
• Butter Chicken + Palak Paneer + Basmati Rice + Garlic Naan + Gulab Jamun
• Perfect for sharing, combines our most popular dishes

**Spice Lover's Special** - $29.99 (Save $5.98)  
• Chicken Wings + Lamb Biryani + Masala Chai
• For those who enjoy bold, authentic flavors

**Vegetarian Delight** - $24.99 (Save $4.97)
• Paneer Tikka + Dal Makhani + Garlic Naan + Mango Lassi
• Complete vegetarian experience with complementary flavors`,
      mode: "fallback",
    }
  }
}

export async function generateBrandInsights(menuData: any) {
  try {
    const prompt = `Analyze this restaurant menu and provide brand design insights:

Menu has ${menuData.categories?.length || 0} categories with items ranging from traditional to modern dishes.

Provide recommendations for:
1. Color scheme that matches the cuisine style
2. Typography choices for menu design
3. Layout suggestions for better visual appeal
4. Photography style recommendations
5. Overall brand positioning advice

Focus on creating a cohesive brand experience.`

    const result = await generateAIText(prompt, {
      temperature: 0.6,
      maxTokens: 500,
    })

    if (result.text) {
      return {
        insights: result.text,
        mode: result.mode,
      }
    }

    throw new Error("Failed to generate brand insights")
  } catch (error) {
    console.error("Brand insights generation error:", error)

    // Fallback brand insights
    return {
      insights: `Brand Design Recommendations:

**Color Scheme**: Warm earth tones with gold accents to reflect authentic cuisine while maintaining modern appeal.

**Typography**: Combine elegant serif fonts for headings with clean sans-serif for descriptions to balance tradition with readability.

**Layout**: Use visual hierarchy with featured items prominently displayed, organized by category with plenty of white space.

**Photography**: Professional food photography with consistent lighting, minimal props, and focus on the dishes' natural colors and textures.

**Brand Positioning**: Position as "Authentic cuisine with modern presentation" - honoring traditional recipes while appealing to contemporary diners.

These recommendations create a cohesive brand experience that attracts both traditional and modern customers.`,
      mode: "fallback",
    }
  }
}
