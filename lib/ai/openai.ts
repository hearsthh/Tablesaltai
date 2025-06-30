import OpenAI from "openai"

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
})

// Generate AI text content with intelligent fallbacks
export async function generateAIText(prompt: string, options: any = {}) {
  try {
    // Check if API key exists
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey || apiKey.trim() === "" || apiKey === "undefined") {
      console.log("⚠️ OpenAI API key not found, generating fallback content")
      return await generateFallbackResponse(prompt)
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: options.maxTokens || 500,
      temperature: options.temperature || 0.7,
    })

    return {
      text: completion.choices[0]?.message?.content || "",
      success: true,
      provider: "OpenAI",
    }
  } catch (error) {
    console.log("OpenAI generation failed, using fallback:", error)
    return await generateFallbackResponse(prompt)
  }
}

// Generate customer insights from customer data
export async function generateCustomerInsights(customers: any[]) {
  try {
    const customerSummary = customers
      .slice(0, 10)
      .map(
        (c) =>
          `Customer: ${c.name || "Unknown"}, Visits: ${c.visit_count || 0}, Preferences: ${c.preferences?.join(", ") || "None"}, Last Visit: ${c.last_visit || "Unknown"}`,
      )
      .join("\n")

    const prompt = `Analyze these restaurant customers and provide actionable insights:
${customerSummary}

Provide insights on:
1. Customer segments and demographics
2. Popular preferences and trends
3. Visit patterns and frequency
4. Marketing recommendations
5. Retention strategies

Format as a detailed analysis with specific recommendations.`

    const result = await generateAIText(prompt, { maxTokens: 800, temperature: 0.6 })

    return {
      insights: result.text,
      success: result.success,
      provider: result.provider,
      customerCount: customers.length,
      analysisDate: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Customer insights generation failed:", error)
    return {
      insights: generateFallbackCustomerInsights(customers),
      success: true,
      provider: "TableSalt AI Fallback",
      customerCount: customers.length,
      analysisDate: new Date().toISOString(),
    }
  }
}

// Generate combo meal suggestions from menu items
export async function generateComboSuggestions(menuItems: any[]) {
  try {
    const itemSummary = menuItems
      .slice(0, 20)
      .map((item) => `${item.name} - $${item.price || "N/A"} (${item.category || "Uncategorized"})`)
      .join("\n")

    const prompt = `Based on these menu items, suggest 5 profitable combo meals that would appeal to customers:

${itemSummary}

For each combo suggestion, provide:
1. Combo name
2. Items included
3. Suggested price
4. Target customer segment
5. Marketing description

Focus on combinations that:
- Offer good value to customers
- Increase average order value
- Use complementary items
- Appeal to different customer types (families, individuals, etc.)

Format as a structured list with clear pricing and descriptions.`

    const result = await generateAIText(prompt, { maxTokens: 700, temperature: 0.7 })

    return {
      combos: result.text,
      success: result.success,
      provider: result.provider,
      menuItemCount: menuItems.length,
      generatedDate: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Combo suggestions generation failed:", error)
    return {
      combos: generateFallbackComboSuggestions(menuItems),
      success: true,
      provider: "TableSalt AI Fallback",
      menuItemCount: menuItems.length,
      generatedDate: new Date().toISOString(),
    }
  }
}

// Generate social media post content
export async function generateSocialMediaPost({
  restaurantName,
  cuisine,
  specialOffer,
  tone = "friendly",
  platform = "instagram",
}: {
  restaurantName: string
  cuisine: string
  specialOffer?: string
  tone?: string
  platform?: string
}) {
  try {
    const prompt = `Create a ${tone} social media post for ${platform} for "${restaurantName}", a ${cuisine} restaurant. ${specialOffer ? `Include this special offer: ${specialOffer}` : ""} Make it engaging and include relevant hashtags.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a social media expert specializing in restaurant marketing. Create engaging, authentic posts that drive customer engagement.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 300,
      temperature: 0.7,
    })

    return {
      success: true,
      content: completion.choices[0]?.message?.content || "",
      platform,
      restaurantName,
    }
  } catch (error) {
    console.error("OpenAI Social Media Post Error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate social media post",
      content: "",
    }
  }
}

// Generate menu item descriptions
export async function generateMenuDescription({
  itemName,
  ingredients,
  cuisine,
  dietaryInfo,
  tone = "appetizing",
}: {
  itemName: string
  ingredients: string[]
  cuisine: string
  dietaryInfo?: string[]
  tone?: string
}) {
  try {
    const prompt = `Write a ${tone} menu description for "${itemName}", a ${cuisine} dish made with: ${ingredients.join(", ")}. ${dietaryInfo ? `Dietary info: ${dietaryInfo.join(", ")}` : ""} Keep it concise but mouth-watering.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a professional menu writer who creates appetizing descriptions that make customers want to order dishes.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 150,
      temperature: 0.8,
    })

    return {
      success: true,
      description: completion.choices[0]?.message?.content || "",
      itemName,
      cuisine,
    }
  } catch (error) {
    console.error("OpenAI Menu Description Error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate menu description",
      description: "",
    }
  }
}

// Generate restaurant marketing content
export async function generateMarketingContent({
  restaurantName,
  cuisine,
  targetAudience,
  contentType = "email",
  occasion,
}: {
  restaurantName: string
  cuisine: string
  targetAudience: string
  contentType?: string
  occasion?: string
}) {
  try {
    const prompt = `Create ${contentType} marketing content for "${restaurantName}", a ${cuisine} restaurant targeting ${targetAudience}. ${occasion ? `This is for: ${occasion}` : ""} Make it compelling and action-oriented.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a marketing expert specializing in restaurant promotion. Create compelling content that drives customer action.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 400,
      temperature: 0.7,
    })

    return {
      success: true,
      content: completion.choices[0]?.message?.content || "",
      contentType,
      restaurantName,
    }
  } catch (error) {
    console.error("OpenAI Marketing Content Error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate marketing content",
      content: "",
    }
  }
}

// Generate customer review responses
export async function generateReviewResponse({
  reviewText,
  rating,
  restaurantName,
  tone = "professional",
}: {
  reviewText: string
  rating: number
  restaurantName: string
  tone?: string
}) {
  try {
    const prompt = `Write a ${tone} response to this ${rating}-star review for "${restaurantName}": "${reviewText}". Be appropriate to the rating and show genuine care for customer feedback.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a restaurant manager responding to customer reviews. Be authentic, professional, and show genuine care for customer experience.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 200,
      temperature: 0.6,
    })

    return {
      success: true,
      response: completion.choices[0]?.message?.content || "",
      originalRating: rating,
      restaurantName,
    }
  } catch (error) {
    console.error("OpenAI Review Response Error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate review response",
      response: "",
    }
  }
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
    }
  } catch (error) {
    console.error("OpenAI Connection Test Failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Connection failed",
      message: "OpenAI connection failed",
    }
  }
}

// Generate menu insights
export async function generateMenuInsights({
  menuItems,
  restaurantType,
  targetMarket,
}: {
  menuItems: string[]
  restaurantType: string
  targetMarket: string
}) {
  try {
    const prompt = `Analyze this ${restaurantType} menu for ${targetMarket} market: ${menuItems.join(", ")}. Provide insights on pricing strategy, popular items, and recommendations for improvement.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a restaurant consultant providing menu analysis and strategic recommendations.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 500,
      temperature: 0.5,
    })

    return {
      success: true,
      insights: completion.choices[0]?.message?.content || "",
      restaurantType,
      itemCount: menuItems.length,
    }
  } catch (error) {
    console.error("OpenAI Menu Insights Error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate menu insights",
      insights: "",
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

function generateFallbackCustomerInsights(customers: any[]) {
  const totalCustomers = customers.length
  const avgVisits = customers.reduce((acc, c) => acc + (c.visit_count || 0), 0) / totalCustomers || 0

  return `# Customer Analysis Report

## Overview
Analysis of ${totalCustomers} customers shows an average of ${avgVisits.toFixed(1)} visits per customer.

## Key Insights
- **Customer Loyalty**: ${avgVisits > 3 ? "Strong" : avgVisits > 1.5 ? "Moderate" : "Developing"} customer loyalty patterns
- **Visit Frequency**: Customers visit approximately ${avgVisits.toFixed(1)} times on average
- **Engagement Level**: ${totalCustomers > 50 ? "High" : totalCustomers > 20 ? "Moderate" : "Growing"} customer base

## Recommendations
1. **Loyalty Program**: Implement rewards for frequent visitors
2. **Personalization**: Use preference data to customize experiences
3. **Re-engagement**: Target customers who haven't visited recently
4. **Referral Program**: Encourage satisfied customers to bring friends

## Next Steps
- Segment customers by visit frequency
- Create targeted marketing campaigns
- Implement feedback collection system
- Track customer lifetime value

This analysis provides a foundation for improving customer retention and satisfaction.`
}

function generateFallbackComboSuggestions(menuItems: any[]) {
  const categories = [...new Set(menuItems.map((item) => item.category || "Main"))]

  return `# Combo Meal Suggestions

## Family Feast Combo - $24.99 (Save $5.00)
**Items:** Main dish, rice, bread, dessert
**Target:** Families and groups
**Description:** Perfect for sharing! This combo brings together our most popular items for a complete family meal experience.

## Quick Lunch Combo - $12.99 (Save $3.00)
**Items:** Curry, rice, drink
**Target:** Working professionals
**Description:** Ideal for busy professionals who want a satisfying, complete meal without the wait.

## Vegetarian Delight Combo - $16.99 (Save $4.00)
**Items:** Paneer dish, vegetable curry, rice, bread
**Target:** Vegetarian customers
**Description:** A perfect combination for vegetarian food lovers, featuring our signature preparations.

## Spice Lover's Combo - $19.99 (Save $4.50)
**Items:** Spicy curry, rice, cooling lassi, dessert
**Target:** Adventure eaters
**Description:** For those who love bold flavors! Includes a cooling lassi to balance the heat.

## Date Night Special - $32.99 (Save $7.00)
**Items:** Two appetizers, two main courses, dessert to share
**Target:** Couples
**Description:** Romantic dining experience with carefully selected dishes perfect for sharing.

These combos are designed to provide value while showcasing your menu's variety and encouraging higher order values.`
}
