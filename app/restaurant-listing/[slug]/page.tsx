"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import RestaurantListingPage from "@/components/restaurant-listing-page"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function PublicRestaurantListingPage() {
  const params = useParams()
  const slug = params.slug as string
  const [restaurantData, setRestaurantData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading restaurant data based on slug
    const loadRestaurantData = async () => {
      try {
        // In a real app, this would fetch from an API
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data based on slug
        const mockData = {
          restaurantName: slug
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
          tagline: "Authentic cuisine with modern flair",
          email: "contact@restaurant.com",
          phone: "+91 98765 43210",
          website: "https://restaurant.com",
          address: "123 Food Street, Gourmet District, Mumbai, Maharashtra 400001",
          cuisine: "Indian",
          restaurantType: "Casual Dining",
          priceRange: "₹₹",
          socialMedia: {
            facebook: "https://facebook.com/restaurant",
            instagram: "https://instagram.com/restaurant",
            twitter: "https://twitter.com/restaurant",
          },
          about:
            "Experience the finest culinary traditions with a contemporary twist. Our restaurant combines authentic spices and traditional cooking methods with modern presentation and service.",
          concept:
            "A modern restaurant that honors traditional flavors while embracing contemporary dining experiences.",
          history:
            "Founded with a passion for authentic cuisine, we bring together traditional recipes passed down through generations with modern culinary techniques.",
          philosophy: "We believe in using only the freshest ingredients, prepared with care and attention to detail.",
          chefProfile: {
            name: "Chef Rajesh Kumar",
            experience: "15+ years",
            background: "Trained in traditional cooking methods and modern culinary techniques.",
          },
          amenities: ["Free WiFi", "Parking", "Air Conditioning", "Live Music", "Kid-Friendly"],
        }

        setRestaurantData(mockData)
      } catch (error) {
        console.error("Failed to load restaurant data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadRestaurantData()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading restaurant...</p>
        </div>
      </div>
    )
  }

  if (!restaurantData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-4">Restaurant Not Found</h1>
          <p className="text-gray-600 mb-6">The restaurant you're looking for doesn't exist.</p>
          <Link href="/">
            <Button className="bg-black hover:bg-gray-800 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with TableSalt branding */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">TS</span>
                </div>
                <span className="font-bold text-black">TableSalt AI</span>
              </Link>
              <div className="hidden sm:block text-sm text-gray-600">Restaurant Listing</div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" className="text-black border-gray-300 bg-transparent">
                <ExternalLink className="w-4 h-4 mr-2" />
                Claim This Listing
              </Button>
              <Link href="/auth/signup">
                <Button size="sm" className="bg-black hover:bg-gray-800 text-white">
                  Create Your Listing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Listing */}
      <RestaurantListingPage restaurantData={restaurantData} />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">TS</span>
              </div>
              <span className="font-bold text-black">TableSalt AI</span>
            </div>
            <p className="text-gray-600 mb-4">AI-powered restaurant management platform</p>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <Link href="/about" className="text-gray-600 hover:text-black">
                About
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-black">
                Pricing
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-black">
                Contact
              </Link>
              <Link href="/privacy" className="text-gray-600 hover:text-black">
                Privacy
              </Link>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
              © 2024 TableSalt AI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
