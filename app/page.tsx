"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Utensils, Star, TrendingUp, MessageSquare, BarChart3, Sparkles, ArrowRight, CheckCircle } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [restaurantData, setRestaurantData] = useState<any>(null)

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const supabase = createBrowserClient()

        // Check authentication
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()

        if (user) {
          setUser(user)

          // Fetch restaurant data
          const { data: restaurant } = await supabase
            .from("restaurant_profiles")
            .select("*")
            .eq("user_id", user.id)
            .single()

          setRestaurantData(restaurant)
        }
      } catch (error) {
        console.log("Using demo mode for preview")
        // Set demo data for preview
        setUser({ id: "demo-user", email: "demo@restaurant.com" })
        setRestaurantData({
          id: "demo-restaurant",
          name: "Spice Garden Mumbai",
          cuisine_type: "Indian",
          avg_rating: 4.3,
          total_reviews: 247,
          monthly_revenue: 450000,
          monthly_orders: 1250,
        })
      } finally {
        setLoading(false)
      }
    }

    initializeApp()
  }, [])

  useEffect(() => {
    // Redirect to dashboard on load
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Tablesalt</h1>
          <p className="text-gray-600">Loading your restaurant dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-black p-3 rounded-2xl">
                <Utensils className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Smart Restaurant
              <span className="text-black"> Marketing</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              AI-powered platform to grow your restaurant with intelligent marketing, menu optimization, and customer
              insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-black hover:bg-gray-800" onClick={() => router.push("/auth/signup")}>
                Start Free Trial
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => router.push("/dashboard")}>
                View Demo Dashboard
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="bg-gray-100 p-3 rounded-lg w-fit">
                  <BarChart3 className="w-6 h-6 text-gray-600" />
                </div>
                <CardTitle>Smart Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Real-time insights on menu performance, customer behavior, and revenue optimization.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="bg-gray-100 p-3 rounded-lg w-fit">
                  <Sparkles className="w-6 h-6 text-gray-600" />
                </div>
                <CardTitle>AI Marketing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Automated campaigns, content generation, and customer targeting powered by AI.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="bg-gray-100 p-3 rounded-lg w-fit">
                  <MessageSquare className="w-6 h-6 text-gray-600" />
                </div>
                <CardTitle>Review Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Auto-respond to reviews, track sentiment, and improve your online reputation.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Stats Section */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Growing Restaurants</h2>
              <p className="text-gray-600">Join thousands of restaurants already growing with our platform</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-black mb-2">2,500+</div>
                <div className="text-gray-600">Active Restaurants</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-700 mb-2">35%</div>
                <div className="text-gray-600">Avg Revenue Increase</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-700 mb-2">4.8★</div>
                <div className="text-gray-600">Customer Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-700 mb-2">24/7</div>
                <div className="text-gray-600">AI Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // User is logged in - show dashboard preview
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back! 👋</h1>
              <p className="text-gray-600">
                {restaurantData?.name || "Your Restaurant"} • {restaurantData?.cuisine_type || "Cuisine"}
              </p>
            </div>
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Active
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Rating</p>
                  <p className="text-2xl font-bold">{restaurantData?.avg_rating || "4.3"}</p>
                </div>
                <Star className="w-8 h-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Reviews</p>
                  <p className="text-2xl font-bold">{restaurantData?.total_reviews || "247"}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Orders</p>
                  <p className="text-2xl font-bold">{restaurantData?.monthly_orders || "1.2K"}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold">₹{(restaurantData?.monthly_revenue || 450000) / 1000}K</p>
                </div>
                <BarChart3 className="w-8 h-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full justify-start bg-transparent"
                variant="outline"
                onClick={() => router.push("/dashboard")}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                View Full Dashboard
              </Button>
              <Button
                className="w-full justify-start bg-transparent"
                variant="outline"
                onClick={() => router.push("/marketing")}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Create Marketing Campaign
              </Button>
              <Button
                className="w-full justify-start bg-transparent"
                variant="outline"
                onClick={() => router.push("/reviews")}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Manage Reviews
              </Button>
              <Button
                className="w-full justify-start bg-transparent"
                variant="outline"
                onClick={() => router.push("/menu")}
              >
                <Utensils className="w-4 h-4 mr-2" />
                Optimize Menu
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New 5-star review received</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Marketing campaign launched</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Menu item optimized</p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
