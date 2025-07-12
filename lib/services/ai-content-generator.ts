import { openai } from "@ai-sdk/openai"
import { generateText, generateObject } from "ai"
import { z } from "zod"
import type { Restaurant, MenuItem, Review, Customer } from "@/lib/types/core"

export class AIContentGenerator {
  private model = openai("gpt-4o")

  // Auto-fill restaurant basic info from description/website
  async generateRestaurantInfo(input: {
    description?: string
    website?: string
    existingData?: Partial<Restaurant>
  }) {
    const prompt = `
    Based on the following information, generate comprehensive restaurant details:
    Description: ${input.description || "Not provided"}
    Website: ${input.website || "Not provided"}
    Existing Data: ${JSON.stringify(input.existingData || {})}
    
    Generate missing information that would be typical for this type of restaurant.
    `

    const { object } = await generateObject({
      model: this.model,
      schema: z.object({
        tagline: z.string().describe("Catchy tagline for the restaurant"),
        cuisineTypes: z.array(z.string()).describe("Array of cuisine types"),
        restaurantType: z.string().describe("Type of restaurant (Fine Dining, Casual, etc.)"),
        priceRange: z.string().describe("Price range ($, $$, $$$, $$$$)"),
        story: z.string().describe("Restaurant story and background"),
        mission: z.string().describe("Restaurant mission statement"),
        values: z.array(z.string()).describe("Core values"),
        specialties: z.array(z.string()).describe("Restaurant specialties"),
        dietaryOptions: z.array(z.string()).describe("Dietary options available"),
        ambiance: z.array(z.string()).describe("Ambiance descriptors"),
        brandVoice: z.string().describe("Brand voice and personality"),
      }),
      prompt,
    })

    return object
  }

  // Generate menu item descriptions and tags
  async enhanceMenuItem(item: Partial<MenuItem>) {
    const prompt = `
    Enhance this menu item with compelling description and relevant tags:
    Name: ${item.name}
    Current Description: ${item.description || "None"}
    Ingredients: ${item.ingredients?.join(", ") || "Not specified"}
    Price: ${item.price}
    Category: ${item.categoryId}
    
    Generate an appetizing description and relevant tags.
    `

    const { object } = await generateObject({
      model: this.model,
      schema: z.object({
        enhancedDescription: z.string().describe("Appetizing menu item description"),
        aiGeneratedTags: z.array(z.string()).describe("Relevant tags for the item"),
        suggestedIngredients: z.array(z.string()).describe("Suggested ingredients if missing"),
        dietaryTags: z.array(z.string()).describe("Dietary tags (vegan, gluten-free, etc.)"),
        tasteTags: z.array(z.string()).describe("Taste profile tags (spicy, sweet, etc.)"),
      }),
      prompt,
    })

    return object
  }

  // Generate review responses
  async generateReviewResponse(review: Review, restaurantInfo: Partial<Restaurant>) {
    const prompt = `
    Generate a professional response to this customer review:
    
    Restaurant: ${restaurantInfo.basicInfo?.name}
    Brand Voice: ${restaurantInfo.details?.values?.join(", ")}
    
    Review Details:
    Rating: ${review.rating}/5 stars
    Title: ${review.title}
    Content: ${review.content}
    Customer: ${review.customerName}
    
    Generate a personalized, professional response that addresses their feedback.
    `

    const { text } = await generateText({
      model: this.model,
      prompt,
    })

    return text
  }

  // Analyze customer data and generate segments
  async generateCustomerInsights(customers: Customer[]) {
    const prompt = `
    Analyze this customer data and provide insights:
    ${JSON.stringify(customers.slice(0, 10))} // Sample for analysis
    
    Generate customer segments, behavior patterns, and recommendations.
    `

    const { object } = await generateObject({
      model: this.model,
      schema: z.object({
        segments: z.array(
          z.object({
            name: z.string(),
            description: z.string(),
            characteristics: z.array(z.string()),
            size: z.number(),
            recommendations: z.array(z.string()),
          }),
        ),
        insights: z.array(z.string()),
        recommendations: z.array(z.string()),
      }),
      prompt,
    })

    return object
  }

  // Generate marketing content
  async generateMarketingContent(type: string, context: any) {
    const prompt = `
    Generate ${type} marketing content for:
    Restaurant: ${context.restaurantName}
    Context: ${JSON.stringify(context)}
    
    Create engaging, brand-appropriate content.
    `

    const { text } = await generateText({
      model: this.model,
      prompt,
    })

    return text
  }

  // Auto-categorize media assets
  async categorizeMediaAsset(imageUrl: string, context: any) {
    const prompt = `
    Analyze this image and categorize it for a restaurant:
    Context: ${JSON.stringify(context)}
    
    Determine the category, subcategory, and relevant tags.
    `

    const { object } = await generateObject({
      model: this.model,
      schema: z.object({
        category: z.string().describe("Main category (food, interior, exterior, staff, events)"),
        subcategory: z.string().describe("Specific subcategory"),
        tags: z.array(z.string()).describe("Relevant tags"),
        title: z.string().describe("Suggested title"),
        description: z.string().describe("Description of the image"),
      }),
      prompt,
    })

    return object
  }
}
