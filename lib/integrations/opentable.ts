interface OpenTableConfig {
  clientId: string
  clientSecret: string
  restaurantId: string
}

interface Reservation {
  id: string
  partySize: number
  dateTime: string
  customerName: string
  customerEmail: string
  customerPhone: string
  specialRequests?: string
  status: "confirmed" | "pending" | "cancelled"
}

interface TimeSlot {
  time: string
  available: boolean
  partySize: number
}

export class OpenTableService {
  private config: OpenTableConfig
  private accessToken: string | null = null

  constructor(config: OpenTableConfig) {
    this.config = config
  }

  async authenticate(): Promise<string> {
    try {
      const response = await fetch("https://oauth.opentable.com/api/v1/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
        }),
      })

      const data = await response.json()
      this.accessToken = data.access_token
      return this.accessToken
    } catch (error) {
      console.error("OpenTable authentication failed:", error)
      throw new Error("Failed to authenticate with OpenTable")
    }
  }

  async getAvailability(date: string, partySize: number): Promise<TimeSlot[]> {
    if (!this.accessToken) {
      await this.authenticate()
    }

    try {
      const response = await fetch(
        `https://platform.otrest.com/booking/availability?restaurant_id=${this.config.restaurantId}&party_size=${partySize}&date=${date}`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
        },
      )

      const data = await response.json()
      return data.times || []
    } catch (error) {
      console.error("Failed to fetch OpenTable availability:", error)
      return []
    }
  }

  async createReservation(reservation: Omit<Reservation, "id" | "status">): Promise<string | null> {
    if (!this.accessToken) {
      await this.authenticate()
    }

    try {
      const response = await fetch("https://platform.otrest.com/booking/reserve", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurant_id: this.config.restaurantId,
          party_size: reservation.partySize,
          date_time: reservation.dateTime,
          customer: {
            first_name: reservation.customerName.split(" ")[0],
            last_name: reservation.customerName.split(" ").slice(1).join(" "),
            email: reservation.customerEmail,
            phone: reservation.customerPhone,
          },
          special_requests: reservation.specialRequests,
        }),
      })

      const data = await response.json()
      return data.reservation_id || null
    } catch (error) {
      console.error("Failed to create OpenTable reservation:", error)
      return null
    }
  }

  async getReservations(startDate: string, endDate: string): Promise<Reservation[]> {
    if (!this.accessToken) {
      await this.authenticate()
    }

    try {
      const response = await fetch(
        `https://platform.otrest.com/booking/reservations?restaurant_id=${this.config.restaurantId}&start_date=${startDate}&end_date=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
        },
      )

      const data = await response.json()
      return data.reservations || []
    } catch (error) {
      console.error("Failed to fetch OpenTable reservations:", error)
      return []
    }
  }

  async updateReservation(reservationId: string, updates: Partial<Reservation>): Promise<boolean> {
    if (!this.accessToken) {
      await this.authenticate()
    }

    try {
      const response = await fetch(`https://platform.otrest.com/booking/reservations/${reservationId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })

      return response.ok
    } catch (error) {
      console.error("Failed to update OpenTable reservation:", error)
      return false
    }
  }

  async cancelReservation(reservationId: string): Promise<boolean> {
    if (!this.accessToken) {
      await this.authenticate()
    }

    try {
      const response = await fetch(`https://platform.otrest.com/booking/reservations/${reservationId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
      })

      return response.ok
    } catch (error) {
      console.error("Failed to cancel OpenTable reservation:", error)
      return false
    }
  }
}
