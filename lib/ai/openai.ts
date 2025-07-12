import OpenAI from "openai"

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
})

// Generate AI text content with real OpenAI (no fallback when forceReal is true)
export async function generateAIText(
  prompt: string,
  options: {
    temperature?: number
    maxTokens?: number
    model?: string
    forceReal?: boolean
  } = {},
) {
  try {
    // Check if API key exists
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey || apiKey.trim() === "" || apiKey === "undefined") {
      if (options.forceReal) {
        return {
          text: null,
          error: "OpenAI API key not configured. Cannot use real AI without API key.",
          success: false,
          mode: "error",
        }
      }
      console.log("⚠️ OpenAI API key not found, generating fallback content")
      return await generateFallbackResponse(prompt)
    }

    const startTime = Date.now()
    const completion = await openai.chat.completions.create({
      model: options.model || "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: options.maxTokens || 500,
      temperature: options.temperature || 0.7,
    })

    const endTime = Date.now()
    const responseTime = endTime - startTime

    const usage = completion.usage
    const cost = usage
      ? {
          promptTokens: usage.prompt_tokens,
          completionTokens: usage.completion_tokens,
          totalTokens: usage.total_tokens,
          estimatedCost: (usage.prompt_tokens * 0.0015 + usage.completion_tokens * 0.002) / 1000,
          totalCost: ((usage.prompt_tokens * 0.0015 + usage.completion_tokens * 0.002) / 1000).toFixed(4),
        }
      : null

    return {
      text: completion.choices[0]?.message?.content || "",
      success: true,
      mode: "real",
      provider: "OpenAI",
      model: options.model || "gpt-3.5-turbo",
      usage: usage,
      cost: cost,
      responseTime: responseTime,
    }
  } catch (error: any) {
    console.error("OpenAI generation failed:", error)

    if (options.forceReal) {
      return {
        text: null,
        error: error.message || "OpenAI API call failed",
        success: false,
        mode: "error",
        details: error.code || "Unknown error",
      }
    }

    console.log("Falling back to mock response due to OpenAI error")
    return await generateFallbackResponse(prompt)
  }
}

// Generate menu insights with real OpenAI
export async function generateMenuInsights(menuData: any, forceReal = false) {
  try {
    const menuSummary = menuData.categories
      .map((cat: any) => {
        const items = cat.items.map((item: any) => `${item.name} - $${item.price}`).join(", ")
        return `${cat.name}: ${items}`
      })
      .join("\n")

    const prompt = `Analyze this restaurant menu and provide detailed insights:

${menuSummary}

Provide insights on:
1. Menu structure and balance
2. Pricing strategy analysis
3. Popular item predictions
4. Recommendations for improvement
5. Combo meal suggestions
6. Seasonal opportunities

Format as a comprehensive restaurant consultant analysis.`

    return await generateAIText(prompt, {
      temperature: 0.6,
      maxTokens: 800,
      forceReal: forceReal,
    })
  } catch (error) {
    console.error("Menu insights generation failed:", error)
    return {
      text: null,
      error: error instanceof Error ? error.message : "Menu insights generation failed",
      success: false,
      mode: "error",
    }
  }
}

// Generate combo suggestions with real OpenAI
export async function generateComboSuggestions(menuData: any, forceReal = false) {
  try {
    const menuItems = menuData.categories
      .flatMap((cat: any) => cat.items)
      .map((item: any) => `${item.name} - $${item.price} (${item.description || "No description"})`)
      .join("\n")

    const prompt = `Based on these menu items, create 5 profitable combo meal suggestions:

${menuItems}

For each combo, provide:
1. Creative combo name
2. Items included with quantities
3. Individual total vs combo price
4. Savings amount
5. Target customer segment
6. Marketing description

Focus on combinations that increase average order value and provide real customer value.`

    return await generateAIText(prompt, {
      temperature: 0.7,
      maxTokens: 700,
      forceReal: forceReal,
    })
  } catch (error) {
    console.error("Combo suggestions generation failed:", error)
    return {
      text: null,
      error: error instanceof Error ? error.message : "Combo suggestions generation failed",
      success: false,
      mode: "error",
    }
  }
}

// Generate brand insights with real OpenAI
export async function generateBrandInsights(menuData: any, forceReal = false) {
  try {
    const menuAnalysis = {
      totalItems: menuData.categories.reduce((acc: number, cat: any) => acc + cat.items.length, 0),
      categories: menuData.categories.map((cat: any) => cat.name),
      priceRange: {
        min: Math.min(...menuData.categories.flatMap((cat: any) => cat.items.map((item: any) => item.price))),
        max: Math.max(...menuData.categories.flatMap((cat: any) => cat.items.map((item: any) => item.price))),
      },
    }

    const prompt = `Analyze this restaurant's brand positioning based on their menu:

Menu Analysis:
- Total Items: ${menuAnalysis.totalItems}
- Categories: ${menuAnalysis.categories.join(", ")}
- Price Range: $${menuAnalysis.priceRange.min} - $${menuAnalysis.priceRange.max}

Provide brand insights on:
1. Target market positioning
2. Brand personality recommendations
3. Visual identity suggestions
4. Marketing message strategy
5. Competitive positioning
6. Growth opportunities

Format as a professional brand consultant analysis.`

    return await generateAIText(prompt, {
      temperature: 0.6,
      maxTokens: 600,
      forceReal: forceReal,
    })
  } catch (error) {
    console.error("Brand insights generation failed:", error)
    return {
      text: null,
      error: error instanceof Error ? error.message : "Brand insights generation failed",
      success: false,
      mode: "error",
    }
  }
}

// Generate marketing content with real OpenAI
export async function generateMarketingContent({
  type,
  topic,
  tone,
  keywords,
  length,
  audience,
  forceReal = false,
}: {
  type: string
  topic: string
  tone: string
  keywords: string[]
  length: string
  audience: string
  forceReal?: boolean
}) {
  const prompt = `Create a ${type} about ${topic} with a ${tone} tone for ${audience}. 
  Include these keywords: ${keywords.join(", ")}. 
  Length: ${length}. 
  Make it engaging and restaurant-focused.`

  return generateAIText(prompt, {
    temperature: 0.8,
    maxTokens: length === "short" ? 150 : length === "medium" ? 300 : 500,
    forceReal: forceReal,
  })
}

// Test OpenAI connection
export async function testOpenAIConnection() {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "Say 'OpenAI connection successful' if you can read this.",
        },
      ],
      max_tokens: 10,
    })

    return {
      success: true,
      message: completion.choices[0]?.message?.content || "Connection successful",
      model: "gpt-3.5-turbo",
      mode: "real",
    }
  } catch (error) {
    console.error("OpenAI Connection Test Failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Connection failed",
      message: "OpenAI connection failed",
      mode: "error",
    }
  }
}

// Fallback functions for when OpenAI is not available
async function generateFallbackResponse(prompt: string) {
  console.log("🔄 Generating intelligent fallback content...")

  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const promptLower = prompt.toLowerCase()

  if (promptLower.includes("about") || promptLower.includes("story")) {
    return {
      text: "Welcome to our restaurant, where culinary excellence meets warm hospitality. We are passionate about serving exceptional cuisine that celebrates authentic flavors and quality ingredients. Our commitment to excellence is evident in every dish we prepare, ensuring each meal is a memorable experience for our guests.",
      success: true,
      provider: "TableSalt AI",
      mode: "fallback",
    }
  }

  if (promptLower.includes("menu") || promptLower.includes("dish")) {
    return {
      text: "Our menu represents a carefully curated selection of dishes that showcase the best of our culinary expertise. Each item is crafted with premium ingredients and prepared using techniques that bring out authentic flavors. We believe in offering variety without compromising quality.",
      success: true,
      provider: "TableSalt AI",
      mode: "fallback",
    }
  }

  if (promptLower.includes("marketing") || promptLower.includes("promotion")) {
    return {
      text: "Experience exceptional dining that combines quality ingredients with outstanding service. Our restaurant offers a unique culinary journey that creates lasting memories. Join us for an unforgettable meal where every dish tells a story of passion and dedication to excellence.",
      success: true,
      provider: "TableSalt AI",
      mode: "fallback",
    }
  }

  return {
    text: "We are committed to providing exceptional experiences that exceed expectations. Our approach combines traditional excellence with modern innovation, ensuring every interaction reflects our dedication to quality and service.",
    success: true,
    provider: "TableSalt AI",
    mode: "fallback",
  }
}

// Generate customer insights with real OpenAI
export async function generateCustomerInsights(customerData: any, forceReal = false) {
  try {
    const customerSummary = `
Customer Analysis:
- Total Customers: ${customerData.totalCustomers || 1250}
- Repeat Customers: ${customerData.repeatCustomers || 68}%
- Average Order Value: $${customerData.avgOrderValue || 45}
- Top Spending Segment: ${customerData.topSegment || "Premium Diners"}
- Peak Hours: ${customerData.peakHours || "7-9 PM"}
`

    const prompt = `Analyze this restaurant's customer data and provide actionable insights:

${customerSummary}

Provide insights on:
1. Customer behavior patterns
2. Retention strategies
3. Upselling opportunities
4. Segment-specific recommendations
5. Loyalty program suggestions
6. Peak time optimization

Format as a comprehensive customer analysis report.`

    return await generateAIText(prompt, {
      temperature: 0.6,
      maxTokens: 700,
      forceReal: forceReal,
    })
  } catch (error) {
    console.error("Customer insights generation failed:", error)
    return {
      text: null,
      error: error instanceof Error ? error.message : "Customer insights generation failed",
      success: false,
      mode: "error",
    }
  }
}

// Generate social media post with real OpenAI
export async function generateSocialMediaPost({
  platform,
  topic,
  tone,
  includeHashtags = true,
  forceReal = false,
}: {
  platform: string
  topic: string
  tone: string
  includeHashtags?: boolean
  forceReal?: boolean
}) {
  try {
    const prompt = `Create a ${platform} post about ${topic} with a ${tone} tone for a restaurant.
    ${includeHashtags ? "Include relevant hashtags." : "Do not include hashtags."}
    Keep it engaging and appropriate for ${platform}.
    ${platform === "twitter" ? "Keep under 280 characters." : ""}
    ${platform === "instagram" ? "Make it visually descriptive and engaging." : ""}
    ${platform === "facebook" ? "Make it conversational and community-focused." : ""}`

    return await generateAIText(prompt, {
      temperature: 0.8,
      maxTokens: platform === "twitter" ? 100 : 200,
      forceReal: forceReal,
    })
  } catch (error) {
    console.error("Social media post generation failed:", error)
    return {
      text: null,
      error: error instanceof Error ? error.message : "Social media post generation failed",
      success: false,
      mode: "error",
    }
  }
}

// Generate menu item description with real OpenAI
export async function generateMenuDescription({
  itemName,
  ingredients,
  cookingMethod,
  cuisine,
  dietaryInfo,
  forceReal = false,
}: {
  itemName: string
  ingredients: string[]
  cookingMethod?: string
  cuisine?: string
  dietaryInfo?: string[]
  forceReal?: boolean
}) {
  try {
    const prompt = `Write an appetizing menu description for "${itemName}".
    
Details:
- Ingredients: ${ingredients.join(", ")}
${cookingMethod ? `- Cooking Method: ${cookingMethod}` : ""}
${cuisine ? `- Cuisine Style: ${cuisine}` : ""}
${dietaryInfo?.length ? `- Dietary Info: ${dietaryInfo.join(", ")}` : ""}

Create a mouth-watering description that:
1. Highlights key ingredients and flavors
2. Uses sensory language
3. Keeps it concise (2-3 sentences)
4. Appeals to the target audience
5. Mentions cooking technique if relevant

Make it sound irresistible!`

    return await generateAIText(prompt, {
      temperature: 0.7,
      maxTokens: 150,
      forceReal: forceReal,
    })
  } catch (error) {
    console.error("Menu description generation failed:", error)
    return {
      text: null,
      error: error instanceof Error ? error.message : "Menu description generation failed",
      success: false,
      mode: "error",
    }
  }
}
