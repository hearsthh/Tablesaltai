import { generateAIText } from "./openai"

export async function generateMenuInsights(menuData: any) {
  try {
    console.log("Generating menu insights for:", menuData.categories?.length, "categories")

    const menuSummary = menuData.categories.map((cat: any) => `${cat.name}: ${cat.items?.length || 0} items`).join(", ")

    const totalItems = menuData.categories.reduce((acc: number, cat: any) => acc + (cat.items?.length || 0), 0)

    const prompt = `Analyze this restaurant menu and provide insights:

Menu Summary: ${menuSummary}
Total Items: ${totalItems}

Please provide:
1. Overall menu score (1-10)
2. Top 3 recommendations for improvement
3. Pricing analysis
4. Category balance assessment

Keep the response concise and actionable for restaurant owners.`

    console.log("Sending prompt to OpenAI:", prompt.substring(0, 100) + "...")

    const result = await generateAIText(prompt, {
      temperature: 0.7,
      maxTokens: 400,
      model: "gpt-3.5-turbo",
    })

    if (result.error) {
      throw new Error(result.error)
    }

    console.log("Menu insights generated successfully")

    return {
      analysis: result.text,
      menuScore: 8.5, // Could parse from AI response
      totalItems,
      categories: menuData.categories?.length || 0,
      recommendations:
        result.text
          ?.split("\n")
          .filter((line: string) => line.includes("recommendation") || line.includes("suggest")) || [],
    }
  } catch (error) {
    console.error("Menu insights generation failed:", error)
    throw error
  }
}

export async function generateItemDescriptions(items: any[]) {
  try {
    console.log("Generating descriptions for", items.length, "items")

    const itemsList = items.map((item) => `${item.name}: ${item.description}`).join("\n")

    const prompt = `Rewrite these menu item descriptions to be more appetizing and engaging:

${itemsList}

Make each description:
- More vivid and sensory
- Highlight key ingredients
- Create appetite appeal
- Keep under 25 words each

Format as: "Item Name: New Description"`

    const result = await generateAIText(prompt, {
      temperature: 0.8,
      maxTokens: 300,
    })

    if (result.error) {
      throw new Error(result.error)
    }

    console.log("Item descriptions generated successfully")

    // Parse the response into structured data
    const descriptions = items.map((item, index) => ({
      item: item.name,
      original: item.description,
      generated: result.text?.split("\n")[index] || `Enhanced description for ${item.name}`,
    }))

    return descriptions
  } catch (error) {
    console.error("Item descriptions generation failed:", error)
    throw error
  }
}

export async function generateComboSuggestions(menuData: any) {
  try {
    console.log("Generating combo suggestions")

    const popularItems = menuData.categories
      .flatMap((cat: any) => cat.items || [])
      .filter((item: any) => item.promoTags?.includes("popular") || item.promoTags?.includes("signature"))
      .map((item: any) => `${item.name} ($${item.price})`)
      .slice(0, 10)

    const prompt = `Create 3 attractive combo meal suggestions using these popular items:

${popularItems.join("\n")}

For each combo, provide:
- Creative combo name
- 3-4 items included
- Original total price
- Combo price (15-20% discount)
- Brief description of why items work together

Format as structured suggestions.`

    const result = await generateAIText(prompt, {
      temperature: 0.8,
      maxTokens: 400,
    })

    if (result.error) {
      throw new Error(result.error)
    }

    console.log("Combo suggestions generated successfully")

    // Return structured combo data (simplified for demo)
    return [
      {
        name: "AI Suggested Combo 1",
        description: "Generated based on your popular items",
        items: popularItems.slice(0, 3),
        originalPrice: 25.99,
        comboPrice: 21.99,
        savings: 4.0,
        aiGenerated: true,
        fullDescription: result.text,
      },
      {
        name: "AI Suggested Combo 2",
        description: "Smart pairing for maximum appeal",
        items: popularItems.slice(2, 5),
        originalPrice: 28.99,
        comboPrice: 23.99,
        savings: 5.0,
        aiGenerated: true,
        fullDescription: result.text,
      },
    ]
  } catch (error) {
    console.error("Combo suggestions generation failed:", error)
    throw error
  }
}

export async function generateBrandInsights(menuData: any) {
  try {
    console.log("Generating brand insights")

    const cuisineTypes = menuData.categories.map((cat: any) => cat.name).join(", ")
    const totalItems = menuData.categories.reduce((acc: number, cat: any) => acc + (cat.items?.length || 0), 0)

    const prompt = `Analyze this restaurant's brand positioning based on their menu:

Menu Categories: ${cuisineTypes}
Total Items: ${totalItems}

Provide brand insights on:
1. Cuisine identity and positioning
2. Target customer demographic
3. Pricing strategy assessment
4. Brand personality recommendations
5. Visual design suggestions (colors, fonts, style)

Keep recommendations practical and actionable.`

    const result = await generateAIText(prompt, {
      temperature: 0.7,
      maxTokens: 500,
    })

    if (result.error) {
      throw new Error(result.error)
    }

    console.log("Brand insights generated successfully")

    return {
      analysis: result.text,
      recommendations: {
        colorScheme: "Warm, inviting tones based on cuisine type",
        typography: "Modern, readable fonts that reflect brand personality",
        positioning: "AI-analyzed market positioning",
        targetAudience: "Identified from menu analysis",
      },
      fullAnalysis: result.text,
    }
  } catch (error) {
    console.error("Brand insights generation failed:", error)
    throw error
  }
}
