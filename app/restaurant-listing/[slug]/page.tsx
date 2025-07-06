"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Star,
  MapPin,
  Clock,
  Phone,
  Mail,
  Globe,
  ChefHat,
  Utensils,
  Calendar,
  Gift,
  Percent,
  Share2,
  Heart,
  MessageCircle,
  ExternalLink,
  CheckCircle,
  Trophy,
  Newspaper,
} from "lucide-react"

interface PublicProfileData {
  restaurantName: string
  tagline: string
  description: string
  cuisine: string
  priceRange: string
  address: string
  phone: string
  email: string
  website: string
  brandColors: {
    primary: string
    secondary: string
  }
  hours: {
    [key: string]: {
      open: string
      close: string
      closed: boolean
    }
  }
  heroImage: string
  mediaAssets: {
    foodPhotos: string[]
    restaurantPhotos: string[]
    kitchenPhotos: string[]
  }
  highlights: string[]
  reviews: {
    averageRating: number
    totalReviews: number
    summary: string
    topUseCases: string[]
    platformBreakup: { platform: string; count: number; rating: number }[]
  }
  menuItems: {
    id: string
    name: string
    description: string
    price: number
    image: string
    rating: number
  }[]
  chef: {
    name: string
    intro: string
    photo: string
  }
  amenities: string[]
  legacy: {
    story: string
    awards: string[]
    recognition: string[]
    pressCoverage: string[]
  }
  loyaltyProgram: {
    enabled: boolean
    name: string
    description: string
  }
  reservationEnabled: boolean
  offers: {
    id: string
    title: string
    description: string
    validUntil: string
  }[]
}

export default function PublicRestaurantProfile() {
  const params = useParams()
  const [profileData, setProfileData] = useState<PublicProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImageCategory, setActiveImageCategory] = useState<"food" | "restaurant" | "kitchen">("food")

  useEffect(() => {
    // Simulate loading profile data
    setTimeout(() => {
      setProfileData({
        restaurantName: "Bella Vista Restaurant",
        tagline: "Where Italian tradition meets Bangalore's heart ❤️",
        description:
          "🍝 Experience authentic Italian cuisine crafted with passion and tradition. Our wood-fired pizzas, handmade pasta, and carefully curated wine selection create an unforgettable dining experience in the heart of Bangalore. From intimate dinners to family celebrations, we bring the warmth of Italy to every meal.",
        cuisine: "Italian, Mediterranean",
        priceRange: "$$",
        address: "123 MG Road, Bangalore, Karnataka 560001",
        phone: "+91 98765 43210",
        email: "info@bellavista.com",
        website: "www.bellavista.com",
        brandColors: {
          primary: "#8B4513",
          secondary: "#D2691E",
        },
        hours: {
          monday: { open: "11:00", close: "23:00", closed: false },
          tuesday: { open: "11:00", close: "23:00", closed: false },
          wednesday: { open: "11:00", close: "23:00", closed: false },
          thursday: { open: "11:00", close: "23:00", closed: false },
          friday: { open: "11:00", close: "24:00", closed: false },
          saturday: { open: "11:00", close: "24:00", closed: false },
          sunday: { open: "12:00", close: "22:00", closed: false },
        },
        heroImage: "/placeholder.svg?height=400&width=800&text=Bella+Vista+Restaurant",
        mediaAssets: {
          foodPhotos: [
            "/placeholder.svg?height=300&width=400&text=Margherita+Pizza",
            "/placeholder.svg?height=300&width=400&text=Pasta+Carbonara",
            "/placeholder.svg?height=300&width=400&text=Tiramisu",
            "/placeholder.svg?height=300&width=400&text=Bruschetta",
          ],
          restaurantPhotos: [
            "/placeholder.svg?height=300&width=400&text=Dining+Area",
            "/placeholder.svg?height=300&width=400&text=Outdoor+Seating",
            "/placeholder.svg?height=300&width=400&text=Bar+Area",
          ],
          kitchenPhotos: [
            "/placeholder.svg?height=300&width=400&text=Wood+Fired+Oven",
            "/placeholder.svg?height=300&width=400&text=Open+Kitchen",
          ],
        },
        highlights: ["Wood-fired Pizza", "Handmade Pasta", "Romantic Ambiance"],
        reviews: {
          averageRating: 4.2,
          totalReviews: 156,
          summary:
            "Customers love our authentic Italian flavors, cozy atmosphere, and excellent service. Most praised for romantic dining and family-friendly environment.",
          topUseCases: ["Date Night", "Family Dinner", "Business Lunch"],
          platformBreakup: [
            { platform: "Google", count: 89, rating: 4.3 },
            { platform: "Zomato", count: 45, rating: 4.1 },
            { platform: "Swiggy", count: 22, rating: 4.0 },
          ],
        },
        menuItems: [
          {
            id: "1",
            name: "Margherita Pizza",
            description: "Classic pizza with fresh mozzarella, tomatoes, and basil",
            price: 450,
            image: "/placeholder.svg?height=200&width=300&text=Margherita+Pizza",
            rating: 4.5,
          },
          {
            id: "2",
            name: "Pasta Carbonara",
            description: "Creamy pasta with pancetta, eggs, and parmesan cheese",
            price: 380,
            image: "/placeholder.svg?height=200&width=300&text=Pasta+Carbonara",
            rating: 4.3,
          },
          {
            id: "3",
            name: "Risotto ai Funghi",
            description: "Creamy mushroom risotto with truffle oil",
            price: 420,
            image: "/placeholder.svg?height=200&width=300&text=Mushroom+Risotto",
            rating: 4.4,
          },
        ],
        chef: {
          name: "Chef Marco Rossi",
          intro:
            "With over 20 years of culinary experience, Chef Marco brings authentic Italian flavors to Bangalore. Trained in traditional Italian cooking methods in Tuscany.",
          photo: "/placeholder.svg?height=200&width=200&text=Chef+Marco",
        },
        amenities: [
          "Free WiFi",
          "Parking Available",
          "Card Payments",
          "Kid Friendly",
          "Wheelchair Accessible",
          "Air Conditioned",
          "Private Dining",
        ],
        legacy: {
          story:
            "🇮🇹 Born from a dream to bring authentic Italian flavors to India, Bella Vista Restaurant was established in 1995 by Chef Marco Rossi. With recipes passed down through three generations of Italian culinary masters, we pride ourselves on using only the finest imported ingredients and traditional cooking methods.",
          awards: ["Best Italian Restaurant 2023", "Excellence in Service Award 2022"],
          recognition: ["#1 Italian Restaurant on Zomato", "Top 10 Romantic Restaurants"],
          pressCoverage: ["Featured in Times Food Guide", "Bangalore Mirror Restaurant Review"],
        },
        loyaltyProgram: {
          enabled: true,
          name: "Bella Vista Rewards",
          description: "Earn points with every visit and unlock exclusive rewards",
        },
        reservationEnabled: true,
        offers: [
          {
            id: "1",
            title: "Happy Hour Special",
            description: "20% off on all appetizers and drinks",
            validUntil: "Every weekday 4-7 PM",
          },
          {
            id: "2",
            title: "Family Sunday",
            description: "Kids eat free with adult meal purchase",
            validUntil: "Every Sunday",
          },
        ],
      })
      setLoading(false)
    }, 1000)
  }, [params.slug])

  const formatTime = (time: string) => {
    if (!time) return ""
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getTodayHours = () => {
    if (!profileData) return "Closed"
    const today = new Date()
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const todayName = dayNames[today.getDay()]
    const hours = profileData.hours[todayName]

    if (!hours || hours.closed) return "Closed"
    return `${formatTime(hours.open)} - ${formatTime(hours.close)}`
  }

  const getOperatingStatus = () => {
    if (!profileData) return { status: "Closed", color: "text-red-600" }
    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const todayName = dayNames[now.getDay()]
    const hours = profileData.hours[todayName]

    if (!hours || hours.closed) return { status: "Closed", color: "text-red-600" }

    const openTime = Number.parseInt(hours.open.split(":")[0]) * 60 + Number.parseInt(hours.open.split(":")[1])
    const closeTime = Number.parseInt(hours.close.split(":")[0]) * 60 + Number.parseInt(hours.close.split(":")[1])

    if (currentTime >= openTime && currentTime <= closeTime) {
      return { status: "Open Now", color: "text-green-600" }
    }

    return { status: "Closed", color: "text-red-600" }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading restaurant profile...</p>
        </div>
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Restaurant Not Found</h1>
          <p className="text-gray-600">The restaurant profile you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const operatingStatus = getOperatingStatus()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative">
        <div
          className="h-64 sm:h-80 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${profileData.heroImage})`,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-3xl sm:text-5xl font-bold mb-2">{profileData.restaurantName}</h1>
              {profileData.tagline && <p className="text-lg sm:text-xl opacity-90">{profileData.tagline}</p>}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                <Badge className="bg-white text-black">{profileData.cuisine}</Badge>
                <Badge className="bg-white text-black">{profileData.priceRange}</Badge>
                <div className="flex items-center space-x-1 bg-white text-black px-2 py-1 rounded">
                  <Clock className="w-3 h-3" />
                  <span className={`text-xs font-medium ${operatingStatus.color}`}>{operatingStatus.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Info Bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="font-medium">{profileData.reviews.averageRating}</span>
                <span className="text-gray-600">({profileData.reviews.totalReviews} reviews)</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">MG Road, Bangalore</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4 mr-1" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Concept Section */}
            <Card>
              <CardHeader>
                <CardTitle>About {profileData.restaurantName}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">{profileData.description}</p>
                <div className="flex flex-wrap gap-2">
                  {profileData.highlights.map((highlight, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 border-blue-300 text-blue-700">
                      {highlight}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Reviews & Ratings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-800">{profileData.reviews.averageRating}</div>
                    <div className="text-sm text-green-600">Average Rating</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-800">{profileData.reviews.totalReviews}</div>
                    <div className="text-sm text-blue-600">Total Reviews</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-800">
                      {profileData.reviews.platformBreakup.length}
                    </div>
                    <div className="text-sm text-purple-600">Platforms</div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2">AI Review Summary</h4>
                  <p className="text-sm text-gray-700">{profileData.reviews.summary}</p>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2">Popular Use Cases</h4>
                  <div className="flex flex-wrap gap-2">
                    {profileData.reviews.topUseCases.map((useCase, index) => (
                      <Badge key={index} variant="outline" className="bg-yellow-50 border-yellow-300 text-yellow-700">
                        {useCase}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Platform Breakdown</h4>
                  <div className="space-y-2">
                    {profileData.reviews.platformBreakup.map((platform, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="font-medium">{platform.platform}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">{platform.count} reviews</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{platform.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Menu Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Utensils className="w-5 h-5 mr-2" />
                    Popular Menu Items
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Full Menu
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profileData.menuItems.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex space-x-3">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-sm truncate">{item.name}</h4>
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span className="text-xs font-medium">{item.rating}</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">₹{item.price}</span>
                            <Button size="sm" variant="outline" className="text-xs bg-transparent">
                              Add
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Chef Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ChefHat className="w-5 h-5 mr-2" />
                  Meet the Chef
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <img
                    src={profileData.chef.photo || "/placeholder.svg"}
                    alt={profileData.chef.name}
                    className="w-20 h-20 object-cover rounded-full flex-shrink-0"
                  />
                  <div>
                    <h4 className="font-medium text-lg mb-1">{profileData.chef.name}</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{profileData.chef.intro}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Media Gallery */}
            <Card>
              <CardHeader>
                <CardTitle>Gallery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2 mb-4">
                  {(["food", "restaurant", "kitchen"] as const).map((category) => (
                    <Button
                      key={category}
                      variant={activeImageCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveImageCategory(category)}
                      className="capitalize"
                    >
                      {category} ({profileData.mediaAssets[`${category}Photos`].length})
                    </Button>
                  ))}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {profileData.mediaAssets[`${activeImageCategory}Photos`].map((photo, index) => (
                    <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={photo || "/placeholder.svg"}
                        alt={`${activeImageCategory} photo`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* More About Section */}
            <Card>
              <CardHeader>
                <CardTitle>More About {profileData.restaurantName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Our Story</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{profileData.legacy.story}</p>
                </div>

                {profileData.legacy.awards.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <Trophy className="w-4 h-4 mr-1" />
                      Awards & Recognition
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {profileData.legacy.awards.map((award, index) => (
                        <Badge key={index} variant="outline" className="bg-yellow-50 border-yellow-300 text-yellow-700">
                          {award}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {profileData.legacy.recognition.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Rankings</h4>
                    <div className="space-y-1">
                      {profileData.legacy.recognition.map((recognition, index) => (
                        <div key={index} className="text-sm text-gray-700">
                          • {recognition}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {profileData.legacy.pressCoverage.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <Newspaper className="w-4 h-4 mr-1" />
                      Press Coverage
                    </h4>
                    <div className="space-y-1">
                      {profileData.legacy.pressCoverage.map((coverage, index) => (
                        <div key={index} className="text-sm text-gray-700">
                          • {coverage}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Loyalty Program */}
            {profileData.loyaltyProgram.enabled && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Gift className="w-5 h-5 mr-2" />
                    {profileData.loyaltyProgram.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 mb-4">{profileData.loyaltyProgram.description}</p>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    <Gift className="w-4 h-4 mr-2" />
                    Join Rewards Program
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact & Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{profileData.address}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{profileData.phone}</span>
                  </div>
                  {profileData.email && (
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-gray-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{profileData.email}</span>
                    </div>
                  )}
                  {profileData.website && (
                    <div className="flex items-center space-x-3">
                      <Globe className="w-4 h-4 text-gray-600 flex-shrink-0" />
                      <span className="text-sm text-blue-600">{profileData.website}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-medium mb-3">Operating Hours</h4>
                  <div className="space-y-2">
                    {Object.entries(profileData.hours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between items-center text-sm">
                        <span className="capitalize font-medium">{day}</span>
                        <span className="text-gray-600">
                          {hours.closed ? "Closed" : `${formatTime(hours.open)} - ${formatTime(hours.close)}`}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Today</span>
                      <span className={`text-sm font-medium ${operatingStatus.color}`}>{getTodayHours()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle>Amenities & Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {profileData.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Current Offers */}
            {profileData.offers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Percent className="w-5 h-5 mr-2" />
                    Current Offers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {profileData.offers.map((offer) => (
                      <div key={offer.id} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <h4 className="font-medium text-orange-900 text-sm">{offer.title}</h4>
                        <p className="text-sm text-orange-700 mb-1">{offer.description}</p>
                        <p className="text-xs text-orange-600">{offer.validUntil}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Floating Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-center space-x-4">
          <Button className="flex-1 max-w-xs bg-blue-600 hover:bg-blue-700 text-white">
            <Phone className="w-4 h-4 mr-2" />
            Call Now
          </Button>
          {profileData.reservationEnabled && (
            <Button className="flex-1 max-w-xs bg-green-600 hover:bg-green-700 text-white">
              <Calendar className="w-4 h-4 mr-2" />
              Reserve Table
            </Button>
          )}
          {profileData.offers.length > 0 && (
            <Button
              variant="outline"
              className="flex-1 max-w-xs border-orange-300 text-orange-700 hover:bg-orange-50 bg-transparent"
            >
              <Percent className="w-4 h-4 mr-2" />
              View Offers
            </Button>
          )}
        </div>
      </div>

      {/* Bottom padding to account for floating footer */}
      <div className="h-20"></div>
    </div>
  )
}
