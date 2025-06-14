import { generateAIText, generateMarketingContent } from "./openai"
import { generateImage } from "./fal"
import { generateFoodPhotography, generateMarketingGraphic } from "./replicate"
import { generateCustomerResponse, generatePersonalizedEmail } from "./anthropic"
import { classifyCustomerFeedback, semanticSearch } from "./cohere"
import { transcribeVoiceReview } from "./assemblyai"
import { sendSMSCampaign } from "./twilio"

// Orchestrate multiple AI services for comprehensive marketing automation
export class AIOrchestrator {
  // Generate complete marketing campaign
  static async generateCompleteCampaign({
    campaignType,
    target,
    restaurantContext,
    customerSegment,
  }: {
    campaignType: "promotion" | "seasonal" | "loyalty" | "acquisition"
    target: "email" | "sms" | "social" | "all"
    restaurantContext: any
    customerSegment: any[]
  }) {
    try {
      const results: any = {}

      // Generate content for different channels
      if (target === "email" || target === "all") {
        const emailPromises = customerSegment.map((customer) =>
          generatePersonalizedEmail({
            customerData: customer,
            campaignType: campaignType as any,
            restaurantContext,
          }),
        )
        results.emails = await Promise.all(emailPromises)
      }

      if (target === "social" || target === "all") {
        const { text: socialContent } = await generateMarketingContent({
          type: "social media post",
          topic: `${campaignType} campaign`,
          tone: "engaging",
          keywords: [restaurantContext.cuisine, campaignType],
          length: "short",
          audience: "food lovers",
        })

        // Generate accompanying image
        const { imageUrl } = await generateMarketingGraphic({
          type: "social_post",
          text: socialContent || "",
          style: "modern",
          colors: ["#FF6B35", "#F7931E"],
        })

        results.social = {
          content: socialContent,
          image: imageUrl,
        }
      }

      if (target === "sms" || target === "all") {
        const smsContent = `🍽️ Special ${campaignType} offer at ${restaurantContext.name}! Limited time only. Visit us today!`
        results.sms = { content: smsContent }
      }

      return {
        campaign: results,
        error: null,
      }
    } catch (error) {
      console.error("Error generating complete campaign:", error)
      return {
        campaign: null,
        error: "Failed to generate campaign",
      }
    }
  }

  // Process customer feedback comprehensively
  static async processCustomerFeedback({
    feedback,
    restaurantContext,
  }: {
    feedback: { text: string; source: string; customerId?: string }[]
    restaurantContext: any
  }) {
    try {
      const results = await Promise.all(
        feedback.map(async (item) => {
          // Classify sentiment and categories
          const classification = await classifyCustomerFeedback(item.text)

          // Generate appropriate response
          const response = await generateCustomerResponse({
            customerMessage: item.text,
            restaurantContext,
            tone: classification.sentiment === "negative" ? "empathetic" : "friendly",
          })

          return {
            original: item,
            classification,
            suggestedResponse: response.response,
          }
        }),
      )

      return {
        processedFeedback: results,
        error: null,
      }
    } catch (error) {
      console.error("Error processing feedback:", error)
      return {
        processedFeedback: null,
        error: "Failed to process feedback",
      }
    }
  }

  // Generate menu with AI-powered descriptions and images
  static async generateMenuContent({
    menuItems,
    restaurantStyle,
  }: {
    menuItems: any[]
    restaurantStyle: string
  }) {
    try {
      const enhancedItems = await Promise.all(
        menuItems.map(async (item) => {
          // Generate description
          const { text: description } = await generateAIText(
            `Create an appetizing menu description for "${item.name}". Ingredients: ${item.ingredients?.join(", ") || "N/A"}. Style: ${restaurantStyle}`,
          )

          // Generate food image
          const { imageUrl } = await generateFoodPhotography({
            dishName: item.name,
            description: description || item.description || "",
            style: "professional",
            lighting: "natural",
          })

          return {
            ...item,
            aiDescription: description,
            aiImage: imageUrl,
          }
        }),
      )

      return {
        menuItems: enhancedItems,
        error: null,
      }
    } catch (error) {
      console.error("Error generating menu content:", error)
      return {
        menuItems: null,
        error: "Failed to generate menu content",
      }
    }
  }

  // Smart customer search and recommendations
  static async smartCustomerSearch({
    query,
    customers,
    restaurantId,
  }: {
    query: string
    customers: any[]
    restaurantId: string
  }) {
    try {
      // Prepare documents for semantic search
      const documents = customers.map((customer) => ({
        id: customer.id,
        text: `${customer.name} ${customer.email} ${customer.preferences?.join(" ") || ""} ${customer.notes || ""}`,
      }))

      // Perform semantic search
      const { results } = await semanticSearch({
        query,
        documents,
        topK: 10,
      })

      // Get full customer data for results
      const matchedCustomers = results.map((result) => {
        const customer = customers.find((c) => c.id === result.id)
        return {
          ...customer,
          relevanceScore: result.similarity,
        }
      })

      return {
        customers: matchedCustomers,
        error: null,
      }
    } catch (error) {
      console.error("Error in smart customer search:", error)
      return {
        customers: [],
        error: "Failed to search customers",
      }
    }
  }
}

// Export individual AI service functions for direct use
export {
  generateAIText,
  generateMarketingContent,
  generateImage,
  generateFoodPhotography,
  generateCustomerResponse,
  classifyCustomerFeedback,
  transcribeVoiceReview,
  sendSMSCampaign,
}
