import { useMockDatabase } from "./mock-database"

// Mock API delay to simulate real API calls
const mockDelay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

export class MockApiService {
  // Restaurant Profile API
  static async getRestaurantProfile(userId = "mock-user-id") {
    await mockDelay()
    const { restaurant } = useMockDatabase.getState()
    return {
      success: true,
      profile: restaurant,
      error: null,
    }
  }

  static async updateRestaurantProfile(userId: string, updates: any) {
    await mockDelay()
    const { updateRestaurant } = useMockDatabase.getState()
    updateRestaurant(updates)
    return {
      success: true,
      profile: useMockDatabase.getState().restaurant,
      error: null,
    }
  }

  // Menu API
  static async getMenuData() {
    await mockDelay()
    const { menu } = useMockDatabase.getState()
    return {
      success: true,
      data: menu,
      error: null,
    }
  }

  static async saveMenuData(menuData: any) {
    await mockDelay()
    const { updateMenu } = useMockDatabase.getState()
    updateMenu(menuData)
    return {
      success: true,
      data: menuData,
      error: null,
    }
  }

  static async getMenuItems(categoryId?: string) {
    await mockDelay()
    const { menu } = useMockDatabase.getState()

    if (categoryId) {
      const category = menu.categories.find((cat) => cat.id === categoryId)
      return { data: category?.items || [], error: null }
    }

    const allItems = menu.categories.flatMap((cat) => cat.items)
    return { data: allItems, error: null }
  }

  static async createMenuItem(categoryId: string, itemData: any) {
    await mockDelay()
    const { addMenuItem } = useMockDatabase.getState()
    addMenuItem(categoryId, itemData)
    return { data: itemData, error: null }
  }

  static async updateMenuItem(itemId: string, updates: any) {
    await mockDelay()
    const { updateMenuItem } = useMockDatabase.getState()
    updateMenuItem(itemId, updates)
    return { data: updates, error: null }
  }

  // Customer API
  static async getCustomers() {
    await mockDelay()
    const { customers } = useMockDatabase.getState()
    return { data: customers, error: null }
  }

  static async getCustomerById(customerId: string) {
    await mockDelay()
    const { customers } = useMockDatabase.getState()
    const customer = customers.find((c) => c.id === customerId)
    return { data: customer, error: customer ? null : "Customer not found" }
  }

  static async createCustomer(customerData: any) {
    await mockDelay()
    const { addCustomer } = useMockDatabase.getState()
    addCustomer(customerData)
    return { data: customerData, error: null }
  }

  // Reviews API
  static async getReviews() {
    await mockDelay()
    const { reviews } = useMockDatabase.getState()
    return { data: reviews, error: null }
  }

  static async getReviewSummary() {
    await mockDelay()
    const { analytics } = useMockDatabase.getState()
    return { data: analytics.reviews, error: null }
  }

  static async addReview(reviewData: any) {
    await mockDelay()
    const { addReview } = useMockDatabase.getState()
    addReview(reviewData)
    return { data: reviewData, error: null }
  }

  // Marketing API
  static async getCampaigns() {
    await mockDelay()
    const { campaigns } = useMockDatabase.getState()
    return { data: campaigns, error: null }
  }

  static async createCampaign(campaignData: any) {
    await mockDelay()
    const { addCampaign } = useMockDatabase.getState()
    addCampaign(campaignData)
    return { data: campaignData, error: null }
  }

  // Analytics API
  static async getAnalytics() {
    await mockDelay()
    const { analytics } = useMockDatabase.getState()
    return { data: analytics, error: null }
  }

  static async getCustomerAnalytics() {
    await mockDelay()
    const { analytics } = useMockDatabase.getState()
    return { data: analytics.customers, error: null }
  }

  static async getRevenueAnalytics() {
    await mockDelay()
    const { analytics } = useMockDatabase.getState()
    return { data: analytics.revenue, error: null }
  }

  // AI Content Generation API
  static async generateContent(contentType: string, params: any) {
    await mockDelay(2000) // Longer delay for AI generation

    const mockContent = {
      id: `content-${Date.now()}`,
      title: `AI Generated ${contentType}`,
      content_type: contentType,
      status: "generated",
      created_at: new Date().toISOString(),
      content_data: this.generateMockContentData(contentType, params),
    }

    const { addGeneratedContent } = useMockDatabase.getState()
    addGeneratedContent(mockContent)

    return { data: mockContent, error: null }
  }

  static async getGeneratedContent() {
    await mockDelay()
    const { generatedContent } = useMockDatabase.getState()
    return { data: generatedContent, error: null }
  }

  // Helper method to generate mock content data
  private static generateMockContentData(contentType: string, params: any) {
    switch (contentType) {
      case "combos":
        return [
          {
            name: "AI Suggested Combo",
            description: "Perfectly paired dishes for maximum satisfaction",
            items: ["Butter Chicken", "Garlic Naan", "Basmati Rice"],
            original_price: 33.97,
            combo_price: 28.99,
            savings: 4.98,
            serves: "2 people",
          },
        ]

      case "seasonal-menu":
        return [
          {
            name: "Spring Special Curry",
            description: "Fresh seasonal vegetables in aromatic spices",
            price: 14.99,
            category: "Main Course",
            seasonal_ingredients: ["spring onions", "fresh peas", "baby carrots"],
            availability: "March - May",
          },
        ]

      case "item-descriptions":
        return [
          {
            itemName: "Enhanced Description Item",
            description: "AI-enhanced description with sensory details and appeal",
            tasteTags: ["flavorful", "aromatic"],
            promoTags: ["ai-enhanced"],
          },
        ]

      default:
        return { message: "AI generated content for " + contentType }
    }
  }

  // Test Connection
  static async testConnection() {
    await mockDelay(1000)
    return {
      data: {
        status: "connected",
        message: "Mock database is working perfectly!",
        timestamp: new Date().toISOString(),
      },
      error: null,
    }
  }
}

// Export a default instance for easier importing
export const mockApiService = MockApiService
export default MockApiService
