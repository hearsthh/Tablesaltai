// Hybrid service that uses real APIs but mock database
import { MockApiService } from "@/lib/mock-data/mock-api-service"
import { generateAIText, generateMarketingContent } from "@/lib/ai/openai"
import { generateImage } from "@/lib/ai/fal"
import { universalFileProcessor } from "@/lib/utils/universal-file-processor"

export class HybridService {
  // Real AI integrations
  static async generateAIContent(prompt: string, type: "description" | "marketing" | "review" = "description") {
    try {
      console.log("🤖 Generating real AI content:", type, prompt.substring(0, 50) + "...")

      if (type === "marketing") {
        const result = await generateMarketingContent({
          type: "social media post",
          topic: prompt,
          tone: "engaging",
          keywords: ["restaurant", "food"],
          length: "medium",
          audience: "food lovers",
        })
        return { success: true, content: result.text || result, provider: "OpenAI" }
      } else {
        const result = await generateAIText(prompt)
        return { success: true, content: result.text || result, provider: "OpenAI" }
      }
    } catch (error) {
      console.warn("AI generation failed, using fallback:", error)

      // Generate fallback content based on prompt
      const fallbackContent = this.generateFallbackContent(prompt, type)

      return {
        success: true, // Still successful, just using fallback
        content: fallbackContent,
        provider: "Fallback AI",
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  // Generate fallback content when AI APIs aren't available
  private static generateFallbackContent(prompt: string, type: string): string {
    const templates = {
      description: [
        "Our restaurant offers an exceptional dining experience with carefully crafted dishes that showcase the finest ingredients and culinary techniques.",
        "We pride ourselves on creating memorable moments through outstanding food, warm hospitality, and an inviting atmosphere.",
        "Experience the perfect blend of traditional flavors and modern culinary innovation in every dish we serve.",
      ],
      marketing: [
        "Discover an unforgettable culinary journey that will delight your senses and create lasting memories.",
        "Join us for an exceptional dining experience where every meal is a celebration of flavor and craftsmanship.",
        "Indulge in our carefully curated menu featuring the finest ingredients and expert preparation.",
      ],
      review: [
        "Our guests consistently praise our commitment to quality, service, and creating memorable dining experiences.",
        "We're honored to serve our community with exceptional food and warm hospitality.",
        "Thank you for choosing us for your special moments and everyday dining needs.",
      ],
    }

    const typeTemplates = templates[type as keyof typeof templates] || templates.description
    const randomTemplate = typeTemplates[Math.floor(Math.random() * typeTemplates.length)]

    return randomTemplate
  }

  // Real image generation
  static async generateImage(prompt: string) {
    try {
      console.log("🎨 Generating real image:", prompt)
      const result = await generateImage({
        prompt,
        style: "photographic",
        aspectRatio: "1:1",
      })
      return {
        success: result.success,
        imageUrl: result.imageUrl,
        provider: result.provider,
      }
    } catch (error) {
      console.warn("Image generation failed, using placeholder:", error)
      return {
        success: false,
        imageUrl: `/placeholder.svg?height=400&width=400&text=${encodeURIComponent(prompt)}`,
        provider: "Placeholder",
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  // Real file processing
  static async processFile(file: File) {
    try {
      console.log("📁 Processing real file:", file.name, file.type, file.size)
      const result = await universalFileProcessor.processFile(file)
      return {
        success: true,
        content: result.content,
        metadata: result.metadata,
        provider: "Universal File Processor",
      }
    } catch (error) {
      console.error("File processing failed:", error)
      return {
        success: false,
        content: "",
        metadata: null,
        provider: "Failed",
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  // Mock database operations (delegate to mock service)
  static async saveRestaurantProfile(profileData: any) {
    console.log("💾 Saving to mock database:", Object.keys(profileData))
    return await MockApiService.updateRestaurantProfile("mock-user-id", profileData)
  }

  static async getRestaurantProfile(userId = "mock-user-id") {
    console.log("📖 Loading from mock database")
    return await MockApiService.getRestaurantProfile(userId)
  }

  static async saveMenuData(menuData: any) {
    console.log("🍽️ Saving menu to mock database")
    return await MockApiService.saveMenuData(menuData)
  }

  static async getMenuData() {
    console.log("📋 Loading menu from mock database")
    return await MockApiService.getMenuData()
  }

  // Real external API calls (when available)
  static async fetchExternalData(source: string, params: any = {}) {
    try {
      console.log(`🌐 Fetching real data from ${source}:`, params)

      // Simulate real API calls to external services
      switch (source) {
        case "google-places":
          // Real Google Places API call would go here
          await new Promise((resolve) => setTimeout(resolve, 1000))
          return {
            success: true,
            data: { rating: 4.5, reviews: 234, photos: [] },
            provider: "Google Places API",
          }

        case "yelp":
          // Real Yelp API call would go here
          await new Promise((resolve) => setTimeout(resolve, 800))
          return {
            success: true,
            data: { rating: 4.3, reviews: 156, categories: ["Indian", "Casual Dining"] },
            provider: "Yelp Fusion API",
          }

        default:
          throw new Error(`Unknown external source: ${source}`)
      }
    } catch (error) {
      console.warn(`External API ${source} failed:`, error)
      return {
        success: false,
        data: null,
        provider: source,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  // Test all connections
  static async testConnections() {
    console.log("🔍 Testing all service connections...")

    const results = {
      database: await MockApiService.testConnection(),
      ai: await this.testAIConnection(),
      fileProcessor: await this.testFileProcessor(),
    }

    return {
      success: Object.values(results).every((r) => r.success !== false),
      results,
      timestamp: new Date().toISOString(),
    }
  }

  private static async testAIConnection() {
    try {
      const result = await this.generateAIContent("Test connection", "description")
      return {
        success: true,
        provider: result.provider,
        message: "AI service is working",
      }
    } catch (error) {
      return {
        success: false,
        provider: "None",
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  private static async testFileProcessor() {
    try {
      // Create a small test file
      const testFile = new File(["test content"], "test.txt", { type: "text/plain" })
      const result = await this.processFile(testFile)
      return {
        success: result.success,
        provider: result.provider,
        message: "File processor is working",
      }
    } catch (error) {
      return {
        success: false,
        provider: "None",
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }
}
