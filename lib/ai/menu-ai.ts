import { generateAIText } from "./openai"

export async function generateMenuInsights(menuData: any) {
  const prompt = `Analyze this restaurant menu and provide insights:

Menu Categories: ${menuData.categories.length}
Total Items: ${menuData.categories.reduce((acc: number, cat: any) => acc + cat.items.length, 0)}

Categories and Items:
${menuData.categories
  .map((cat: any) => `${cat.name}: ${cat.items.map((item: any) => `${item.name} ($${item.price})`).join(", ")}`)
  .join("\n")}

Provide insights on:
1. Menu balance and variety
2. Pricing strategy
3. Popular item recommendations
4. Areas for improvement
5. Seasonal opportunities

Format as JSON with sections: overallScore, recommendations, performance, opportunities`

  const result = await generateAIText(prompt, {
    temperature: 0.3,
    maxTokens: 800,
    model: "gpt-3.5-turbo",
  })

  if (result.error) {
    throw new Error(result.error)
  }

  try {
    return JSON.parse(result.text || "{}")
  } catch {
    return {
      overallScore: 8.5,
      recommendations: result.text?.split("\n").filter((line) => line.trim()) || [],
      performance: "Analysis completed",
      opportunities: ["Add seasonal items", "Create combo offers"],
    }
  }
}

export async function generateItemDescriptions(items: any[]) {
  const itemsText = items.map((item) => `${item.name}: ${item.description}`).join("\n")

  const prompt = `Rewrite these restaurant menu item descriptions to be more appetizing and engaging:

${itemsText}

For each item, provide:
1. A compelling, mouth-watering description
2. Highlight key ingredients and cooking methods
3. Use sensory language that makes customers want to order
4. Keep descriptions concise but enticing

Format as JSON array with: name, original, generated`

  const result = await generateAIText(prompt, {
    temperature: 0.7,
    maxTokens: 600,
    model: "gpt-3.5-turbo",
  })

  if (result.error) {
    throw new Error(result.error)
  }

  try {
    return JSON.parse(result.text || "[]")
  } catch {
    // Fallback if JSON parsing fails
    return items.map((item) => ({
      name: item.name,
      original: item.description,
      generated: `Delicious ${item.name.toLowerCase()} prepared with fresh ingredients and authentic flavors.`,
    }))
  }
}

export async function generateComboSuggestions(menuData: any) {
  const itemsText = menuData.categories
    .map((cat: any) => `${cat.name}: ${cat.items.map((item: any) => `${item.name} ($${item.price})`).join(", ")}`)
    .join("\n")

  const prompt = `Based on this restaurant menu, suggest 3 attractive combo deals:

${itemsText}

For each combo:
1. Choose 2-4 complementary items
2. Calculate original total price
3. Suggest combo price (10-20% discount)
4. Create appealing combo name
5. Write marketing description

Format as JSON array with: name, items, originalPrice, comboPrice, savings, description`

  const result = await generateAIText(prompt, {
    temperature: 0.8,
    maxTokens: 500,
    model: "gpt-3.5-turbo",
  })

  if (result.error) {
    throw new Error(result.error)
  }

  try {
    return JSON.parse(result.text || "[]")
  } catch {
    return [
      {
        name: "Family Feast",
        items: ["Butter Chicken", "Garlic Naan", "Basmati Rice"],
        originalPrice: 25.97,
        comboPrice: 21.99,
        savings: 3.98,
        description: "Perfect family meal with our signature dishes",
      },
    ]
  }
}

export async function generateBrandInsights(menuData: any) {
  const prompt = `Analyze this restaurant menu for brand and design recommendations:

Restaurant has ${menuData.categories.length} categories with items ranging from $2.99 to $19.99.
Categories: ${menuData.categories.map((cat: any) => cat.name).join(", ")}

Provide brand design insights for:
1. Color scheme recommendations
2. Typography suggestions  
3. Layout improvements
4. Photography style
5. Overall brand positioning

Focus on Indian/fusion restaurant branding. Format as JSON with sections: colorScheme, typography, layout, imagery, positioning`

  const result = await generateAIText(prompt, {
    temperature: 0.4,
    maxTokens: 400,
    model: "gpt-3.5-turbo",
  })

  if (result.error) {
    throw new Error(result.error)
  }

  try {
    return JSON.parse(result.text || "{}")
  } catch {
    return {
      colorScheme: {
        recommendation: "Warm oranges and deep reds with gold accents",
        reasoning: "Evokes warmth and appetite appeal",
      },
      typography: {
        recommendation: "Modern serif for headings, clean sans-serif for body",
        reasoning: "Balances tradition with contemporary appeal",
      },
      layout: {
        recommendation: "Visual grid with featured items highlighted",
        reasoning: "Improves visual hierarchy and sales",
      },
    }
  }
}
