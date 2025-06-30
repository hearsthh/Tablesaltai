interface YelpConfig {
  apiKey: string
}

interface YelpBusiness {
  id: string
  name: string
  rating: number
  review_count: number
  categories: Array<{ alias: string; title: string }>
  location: {
    address1: string
    city: string
    state: string
    zip_code: string
  }
  phone: string
  display_phone: string
  photos: string[]
}

interface YelpReview {
  id: string
  rating: number
  text: string
  time_created: string
  user: {
    id: string
    name: string
    image_url: string
  }
}

export class YelpFusionService {
  private config: YelpConfig

  constructor(config: YelpConfig) {
    this.config = config
  }

  async searchBusinesses(term: string, location: string, limit = 20): Promise<YelpBusiness[]> {
    try {
      const params = new URLSearchParams({
        term,
        location,
        limit: limit.toString(),
      })

      const response = await fetch(`https://api.yelp.com/v3/businesses/search?${params}`, {
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()
      return data.businesses || []
    } catch (error) {
      console.error("Failed to search Yelp businesses:", error)
      return []
    }
  }

  async getBusinessDetails(businessId: string): Promise<YelpBusiness | null> {
    try {
      const response = await fetch(`https://api.yelp.com/v3/businesses/${businessId}`, {
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Failed to fetch Yelp business details:", error)
      return null
    }
  }

  async getBusinessReviews(businessId: string): Promise<YelpReview[]> {
    try {
      const response = await fetch(`https://api.yelp.com/v3/businesses/${businessId}/reviews`, {
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.reviews || []
    } catch (error) {
      console.error("Failed to fetch Yelp reviews:", error)
      return []
    }
  }

  async getBusinessPhotos(businessId: string): Promise<string[]> {
    try {
      const business = await this.getBusinessDetails(businessId)
      return business?.photos || []
    } catch (error) {
      console.error("Failed to fetch Yelp photos:", error)
      return []
    }
  }

  async getCategories(): Promise<Array<{ alias: string; title: string }>> {
    try {
      const response = await fetch("https://api.yelp.com/v3/categories", {
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()
      return data.categories || []
    } catch (error) {
      console.error("Failed to fetch Yelp categories:", error)
      return []
    }
  }
}
