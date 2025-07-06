"use client"

import { useState, useEffect } from "react"

interface RestaurantData {
  profile: {
    name: string
    cuisine: string
    rating: number
    totalReviews: number
    monthlyRevenue: number
    revenueChange: number
  }
  menu: {
    totalItems: number
    categories: number
    avgPrice: number
    topPerformer: string
  }
  performance: {
    ordersToday: number
    ordersChange: number
    avgOrderValue: number
    avgOrderValueChange: number
  }
}

export function useRestaurantData() {
  const [data, setData] = useState<RestaurantData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      try {
        // Mock data - replace with actual API call
        const mockData: RestaurantData = {
          profile: {
            name: "Spice Garden",
            cuisine: "Indian",
            rating: 4.6,
            totalReviews: 1247,
            monthlyRevenue: 125000,
            revenueChange: 12.5,
          },
          menu: {
            totalItems: 85,
            categories: 8,
            avgPrice: 280,
            topPerformer: "Butter Chicken",
          },
          performance: {
            ordersToday: 47,
            ordersChange: 8.3,
            avgOrderValue: 450,
            avgOrderValueChange: -2.1,
          },
        }

        setData(mockData)
      } catch (err) {
        setError("Failed to fetch restaurant data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}
