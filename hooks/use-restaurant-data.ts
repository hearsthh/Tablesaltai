"use client"

import { useState, useEffect } from "react"

interface RestaurantData {
  name: string
  cuisine: string
  location: string
  avgRating: number
  topDishes: Array<{
    id: string
    name: string
    sales: number
    revenue: number
    rating: number
  }>
  tagline: string
  phone: string
  email: string
  website: string
  establishedYear: number
  totalOrders: number
  totalRevenue: number
  growthScore: number
}

export function useRestaurantData() {
  const [data, setData] = useState<RestaurantData>({
    name: "Tasty Biryani",
    cuisine: "Indian",
    location: "Mumbai, Maharashtra",
    avgRating: 4.7,
    topDishes: [
      {
        id: "1",
        name: "Butter Chicken",
        sales: 156,
        revenue: 26520,
        rating: 4.8,
      },
      {
        id: "2",
        name: "Chicken Biryani",
        sales: 134,
        revenue: 20100,
        rating: 4.6,
      },
      {
        id: "3",
        name: "Paneer Tikka",
        sales: 89,
        revenue: 13350,
        rating: 4.5,
      },
    ],
    tagline: "Hyderabadi Flavours Since 2002",
    phone: "+91 98765 43210",
    email: "contact@tastybiryani.com",
    website: "www.tastybiryani.com",
    establishedYear: 2002,
    totalOrders: 2847,
    totalRevenue: 425600,
    growthScore: 87,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refreshData = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // In real app, fetch from API
      setError(null)
    } catch (err) {
      setError("Failed to fetch restaurant data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshData()
  }, [])

  return {
    data,
    loading,
    error,
    refreshData,
  }
}
