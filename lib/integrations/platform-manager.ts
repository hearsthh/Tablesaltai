import { GoogleMyBusinessService } from "./google-my-business"
import { YelpFusionService } from "./yelp-fusion"
import { OpenTableService } from "./opentable"

interface PlatformCredentials {
  googleMyBusiness?: {
    apiKey: string
    clientId: string
    clientSecret: string
    refreshToken: string
  }
  yelp?: {
    apiKey: string
  }
  openTable?: {
    clientId: string
    clientSecret: string
    restaurantId: string
  }
}

export class PlatformManager {
  private credentials: PlatformCredentials
  private services: {
    googleMyBusiness?: GoogleMyBusinessService
    yelp?: YelpFusionService
    openTable?: OpenTableService
  } = {}

  constructor(credentials: PlatformCredentials) {
    this.credentials = credentials
    this.initializeServices()
  }

  private initializeServices() {
    if (this.credentials.googleMyBusiness) {
      this.services.googleMyBusiness = new GoogleMyBusinessService(this.credentials.googleMyBusiness)
    }

    if (this.credentials.yelp) {
      this.services.yelp = new YelpFusionService(this.credentials.yelp)
    }

    if (this.credentials.openTable) {
      this.services.openTable = new OpenTableService(this.credentials.openTable)
    }
  }

  async testConnections(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {}

    // Test Google My Business
    if (this.services.googleMyBusiness) {
      try {
        await this.services.googleMyBusiness.authenticate()
        const locations = await this.services.googleMyBusiness.getBusinessLocations()
        results.googleMyBusiness = Array.isArray(locations)
      } catch (error) {
        results.googleMyBusiness = false
      }
    }

    // Test Yelp
    if (this.services.yelp) {
      try {
        const categories = await this.services.yelp.getCategories()
        results.yelp = Array.isArray(categories)
      } catch (error) {
        results.yelp = false
      }
    }

    // Test OpenTable
    if (this.services.openTable) {
      try {
        await this.services.openTable.authenticate()
        results.openTable = true
      } catch (error) {
        results.openTable = false
      }
    }

    return results
  }

  async syncBusinessInfo(businessInfo: any): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {}

    // Sync to Google My Business
    if (this.services.googleMyBusiness) {
      try {
        const locations = await this.services.googleMyBusiness.getBusinessLocations()
        if (locations.length > 0) {
          const success = await this.services.googleMyBusiness.updateBusinessInfo(locations[0].name, businessInfo)
          results.googleMyBusiness = success
        }
      } catch (error) {
        results.googleMyBusiness = false
      }
    }

    return results
  }

  async aggregateReviews(): Promise<any[]> {
    const allReviews: any[] = []

    // Get Google My Business reviews
    if (this.services.googleMyBusiness) {
      try {
        const locations = await this.services.googleMyBusiness.getBusinessLocations()
        if (locations.length > 0) {
          const reviews = await this.services.googleMyBusiness.getReviews(locations[0].name)
          allReviews.push(
            ...reviews.map((review) => ({
              ...review,
              platform: "google",
            })),
          )
        }
      } catch (error) {
        console.error("Failed to fetch Google reviews:", error)
      }
    }

    // Get Yelp reviews
    if (this.services.yelp) {
      try {
        // You would need to store the Yelp business ID
        const businessId = "your-yelp-business-id"
        const reviews = await this.services.yelp.getBusinessReviews(businessId)
        allReviews.push(
          ...reviews.map((review) => ({
            ...review,
            platform: "yelp",
          })),
        )
      } catch (error) {
        console.error("Failed to fetch Yelp reviews:", error)
      }
    }

    return allReviews
  }

  getService(platform: "googleMyBusiness" | "yelp" | "openTable") {
    return this.services[platform]
  }
}
