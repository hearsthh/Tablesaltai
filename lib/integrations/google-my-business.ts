interface GoogleMyBusinessConfig {
  apiKey: string
  clientId: string
  clientSecret: string
  refreshToken: string
}

interface BusinessLocation {
  name: string
  address: string
  phone: string
  website: string
  categories: string[]
  hours: Record<string, { open: string; close: string; closed: boolean }>
}

interface Review {
  reviewId: string
  reviewer: {
    displayName: string
    profilePhotoUrl?: string
  }
  starRating: number
  comment: string
  createTime: string
  updateTime: string
}

export class GoogleMyBusinessService {
  private config: GoogleMyBusinessConfig
  private accessToken: string | null = null

  constructor(config: GoogleMyBusinessConfig) {
    this.config = config
  }

  async authenticate(): Promise<string> {
    try {
      const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          refresh_token: this.config.refreshToken,
          grant_type: "refresh_token",
        }),
      })

      const data = await response.json()
      this.accessToken = data.access_token
      return this.accessToken
    } catch (error) {
      console.error("GMB Authentication failed:", error)
      throw new Error("Failed to authenticate with Google My Business")
    }
  }

  async getBusinessLocations(): Promise<any[]> {
    if (!this.accessToken) {
      await this.authenticate()
    }

    try {
      const response = await fetch("https://mybusinessbusinessinformation.googleapis.com/v1/accounts/me/locations", {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()
      return data.locations || []
    } catch (error) {
      console.error("Failed to fetch GMB locations:", error)
      throw new Error("Failed to fetch business locations")
    }
  }

  async updateBusinessInfo(locationId: string, businessInfo: Partial<BusinessLocation>): Promise<boolean> {
    if (!this.accessToken) {
      await this.authenticate()
    }

    try {
      const response = await fetch(`https://mybusinessbusinessinformation.googleapis.com/v1/locations/${locationId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: businessInfo.name,
          storefrontAddress: {
            addressLines: [businessInfo.address],
          },
          phoneNumbers: {
            primaryPhone: businessInfo.phone,
          },
          websiteUri: businessInfo.website,
          regularHours: {
            periods: Object.entries(businessInfo.hours || {}).map(([day, hours]) => ({
              openDay: day.toUpperCase(),
              openTime: hours.open,
              closeDay: day.toUpperCase(),
              closeTime: hours.close,
            })),
          },
        }),
      })

      return response.ok
    } catch (error) {
      console.error("Failed to update GMB business info:", error)
      return false
    }
  }

  async getReviews(locationId: string): Promise<Review[]> {
    if (!this.accessToken) {
      await this.authenticate()
    }

    try {
      const response = await fetch(`https://mybusiness.googleapis.com/v4/accounts/me/locations/${locationId}/reviews`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()
      return data.reviews || []
    } catch (error) {
      console.error("Failed to fetch GMB reviews:", error)
      return []
    }
  }

  async replyToReview(locationId: string, reviewId: string, reply: string): Promise<boolean> {
    if (!this.accessToken) {
      await this.authenticate()
    }

    try {
      const response = await fetch(
        `https://mybusiness.googleapis.com/v4/accounts/me/locations/${locationId}/reviews/${reviewId}/reply`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment: reply,
          }),
        },
      )

      return response.ok
    } catch (error) {
      console.error("Failed to reply to GMB review:", error)
      return false
    }
  }

  async createPost(
    locationId: string,
    post: {
      summary: string
      media?: { mediaFormat: string; sourceUrl: string }[]
      callToAction?: { actionType: string; url: string }
    },
  ): Promise<boolean> {
    if (!this.accessToken) {
      await this.authenticate()
    }

    try {
      const response = await fetch(
        `https://mybusiness.googleapis.com/v4/accounts/me/locations/${locationId}/localPosts`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            languageCode: "en",
            summary: post.summary,
            media: post.media,
            callToAction: post.callToAction,
          }),
        },
      )

      return response.ok
    } catch (error) {
      console.error("Failed to create GMB post:", error)
      return false
    }
  }

  async getInsights(locationId: string, startDate: string, endDate: string): Promise<any> {
    if (!this.accessToken) {
      await this.authenticate()
    }

    try {
      const response = await fetch(
        `https://mybusiness.googleapis.com/v4/accounts/me/locations/${locationId}/reportInsights`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            locationNames: [`accounts/me/locations/${locationId}`],
            basicRequest: {
              timeRange: {
                startTime: startDate,
                endTime: endDate,
              },
              metricRequests: [
                { metric: "QUERIES_DIRECT" },
                { metric: "QUERIES_INDIRECT" },
                { metric: "VIEWS_MAPS" },
                { metric: "VIEWS_SEARCH" },
                { metric: "ACTIONS_WEBSITE" },
                { metric: "ACTIONS_PHONE" },
                { metric: "ACTIONS_DRIVING_DIRECTIONS" },
              ],
            },
          }),
        },
      )

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Failed to fetch GMB insights:", error)
      return null
    }
  }
}
