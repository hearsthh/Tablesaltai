"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Star,
  MapPin,
  Phone,
  Globe,
  Wifi,
  Car,
  CreditCard,
  Users,
  Calendar,
  Share2,
  ChefHat,
  Award,
  Utensils,
  Gift,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  MessageCircle,
  ThumbsUp,
  Sparkles,
  Shield,
} from "lucide-react"

interface RestaurantListingPageProps {
  restaurantData: any
  className?: string
}

export default function RestaurantListingPage({ restaurantData, className = "" }: RestaurantListingPageProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // Mock data for demonstration
  const mockData = {
    name: restaurantData?.restaurantName || "Spice Garden Restaurant",
    tagline: restaurantData?.tagline || "Authentic Indian cuisine with modern flair",
    rating: 4.6,
    reviewCount: 1247,
    priceRange: restaurantData?.priceRange || "₹₹",
    cuisine: restaurantData?.cuisine || "Indian",
    address: restaurantData?.address || "123 Food Street, Gourmet District, Mumbai, Maharashtra 400001",
    phone: restaurantData?.phone || "+91 98765 43210",
    website: restaurantData?.website || "www.spicegarden.com",
    images: [
      "/placeholder.svg?height=400&width=600&text=Restaurant+Interior",
      "/placeholder.svg?height=400&width=600&text=Dining+Area",
      "/placeholder.svg?height=400&width=600&text=Food+Spread",
      "/placeholder.svg?height=400&width=600&text=Kitchen+View",
    ],
    about:
      restaurantData?.about ||
      "Experience the finest Indian culinary traditions with a contemporary twist. Our restaurant combines authentic spices and traditional cooking methods with modern presentation and service.",
    concept:
      restaurantData?.concept ||
      "A modern Indian restaurant that honors traditional flavors while embracing contemporary dining experiences.",
    highlights: ["Authentic Spices", "Traditional Recipes", "Modern Presentation", "Warm Hospitality"],
    awards: ["Best Indian Restaurant 2023", "Excellence in Service Award", "Top Rated on Zomato"],
    menuHighlights: [
      {
        name: "Butter Chicken",
        description: "Tender chicken in rich tomato-based curry",
        price: "₹450",
        image: "/placeholder.svg?height=100&width=100&text=Butter+Chicken",
        rating: 4.8,
      },
      {
        name: "Biryani Special",
        description: "Aromatic basmati rice with spiced meat",
        price: "₹520",
        image: "/placeholder.svg?height=100&width=100&text=Biryani",
        rating: 4.7,
      },
      {
        name: "Paneer Tikka",
        description: "Grilled cottage cheese with Indian spices",
        price: "₹380",
        image: "/placeholder.svg?height=100&width=100&text=Paneer+Tikka",
        rating: 4.6,
      },
    ],
    amenities: [
      { name: "Free WiFi", icon: Wifi },
      { name: "Parking Available", icon: Car },
      { name: "Card Payments", icon: CreditCard },
      { name: "Family Friendly", icon: Users },
      { name: "Reservations", icon: Calendar },
    ],
    offers: [
      {
        title: "Weekend Special",
        description: "20% off on all main courses",
        validity: "Valid till Sunday",
        code: "WEEKEND20",
      },
      {
        title: "Family Combo",
        description: "Special family meal for 4 people",
        validity: "Available all days",
        code: "FAMILY4",
      },
    ],
    loyaltyProgram: {
      name: "Spice Club",
      description: "Earn points on every visit and get exclusive rewards",
      benefits: ["10% off on birthdays", "Free appetizer on 5th visit", "Priority reservations"],
    },
    hours: {
      monday: "11:00 AM - 10:00 PM",
      tuesday: "11:00 AM - 10:00 PM",
      wednesday: "11:00 AM - 10:00 PM",
      thursday: "11:00 AM - 11:00 PM",
      friday: "11:00 AM - 11:00 PM",
      saturday: "11:00 AM - 11:00 PM",
      sunday: "12:00 PM - 9:00 PM",
    },
    chefProfile: {
      name: "Chef Rajesh Kumar",
      experience: "15+ years",
      background: "Trained in traditional Indian cooking with modern culinary techniques",
      specialties: ["North Indian Cuisine", "Tandoor Cooking", "Spice Blending"],
    },
    history:
      "Founded in 2010 with a vision to bring authentic Indian flavors to the modern dining scene. Our journey began with traditional family recipes passed down through generations.",
    philosophy:
      "We believe in using the finest ingredients and traditional cooking methods while embracing innovation in presentation and service.",
    pressFeatures: [
      "Featured in Times Food Guide 2023",
      "Best Indian Restaurant - City Awards 2022",
      "Chef's Special featured in Food & Wine Magazine",
    ],
    fssaiLicense: "12345678901234",
    socialMedia: {
      facebook: "facebook.com/spicegarden",
      instagram: "instagram.com/spicegarden",
      twitter: "twitter.com/spicegarden",
      youtube: "youtube.com/spicegarden",
    },
  }

  // AI-powered review summary
  const reviewSummary = {
    sentiment: "Positive",
    keyPoints: [
      "Excellent authentic flavors",
      "Great service and ambiance",
      "Good value for money",
      "Fresh ingredients",
    ],
    commonPhrases: ["delicious food", "friendly staff", "cozy atmosphere", "highly recommended"],
    overallScore: 4.6,
    breakdown: {
      food: 4.7,
      service: 4.5,
      ambiance: 4.6,
      value: 4.4,
    },
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Hero Section */}
      <div className="relative">
        <div className="h-64 sm:h-80 lg:h-96 overflow-hidden">
          <img
            src={mockData.images[selectedImageIndex] || "/placeholder.svg"}
            alt={mockData.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
        </div>

        {/* Image Thumbnails */}
        <div className="absolute bottom-4 left-4 flex space-x-2">
          {mockData.images.slice(0, 4).map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                selectedImageIndex === index ? "border-white" : "border-transparent opacity-70"
              }`}
            >
              <img src={image || "/placeholder.svg"} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        {/* Restaurant Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
              <div className="text-white">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">{mockData.name}</h1>
                <p className="text-lg sm:text-xl opacity-90 mb-3">{mockData.tagline}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{mockData.rating}</span>
                    <span className="opacity-75">({mockData.reviewCount} reviews)</span>
                  </div>
                  <Badge className="bg-white text-black">{mockData.priceRange}</Badge>
                  <Badge variant="outline" className="border-white text-white">
                    {mockData.cuisine}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Calendar className="w-4 h-4 mr-2" />
                  Reserve Table
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-black bg-transparent"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-black mb-4">About {mockData.name}</h2>
                <p className="text-gray-700 mb-4">{mockData.about}</p>
                <p className="text-gray-700 mb-4">{mockData.concept}</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {mockData.highlights.map((highlight, index) => (
                    <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Star className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-xs font-medium text-gray-700">{highlight}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {mockData.awards.map((award, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      <Award className="w-3 h-3 mr-1" />
                      {award}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI-Powered Review Summary */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-black">Customer Reviews</h2>
                  <Badge className="bg-blue-100 text-blue-800">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI Summary
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center space-x-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-2xl font-bold text-black">{reviewSummary.overallScore}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div
                          className={`font-medium ${reviewSummary.sentiment === "Positive" ? "text-green-600" : "text-red-600"}`}
                        >
                          {reviewSummary.sentiment} Sentiment
                        </div>
                        <div>{mockData.reviewCount} reviews analyzed</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {Object.entries(reviewSummary.breakdown).map(([category, score]) => (
                        <div key={category} className="flex items-center justify-between text-sm">
                          <span className="capitalize text-gray-700">{category}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-yellow-400 rounded-full"
                                style={{ width: `${(score / 5) * 100}%` }}
                              />
                            </div>
                            <span className="font-medium text-black">{score}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-black mb-3">What customers love:</h4>
                    <div className="space-y-2">
                      {reviewSummary.keyPoints.map((point, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <ThumbsUp className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-700">{point}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-black mb-2">Common phrases:</h5>
                      <div className="flex flex-wrap gap-1">
                        {reviewSummary.commonPhrases.map((phrase, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            "{phrase}"
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50 bg-transparent">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  <span className="text-black">Write a Review</span>
                </Button>
              </CardContent>
            </Card>

            {/* Menu Highlights */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-black mb-4">Menu Highlights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockData.menuHighlights.map((item, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-24 object-cover rounded mb-3"
                      />
                      <h4 className="font-medium text-black mb-1">{item.name}</h4>
                      <p className="text-xs text-gray-600 mb-2">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-600">{item.price}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-medium">{item.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4 border-gray-300 hover:bg-gray-50 bg-transparent">
                  <Utensils className="w-4 h-4 mr-2" />
                  <span className="text-black">View Full Menu</span>
                </Button>
              </CardContent>
            </Card>

            {/* Features & Amenities */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-black mb-4">Features & Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {mockData.amenities.map((amenity, index) => (
                    <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                      <amenity.icon className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                      <span className="text-xs font-medium text-gray-700">{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Current Offers */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-black mb-4">Current Offers</h2>
                <div className="space-y-3">
                  {mockData.offers.map((offer, index) => (
                    <div key={index} className="border border-emerald-200 bg-emerald-50 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-emerald-900 mb-1">{offer.title}</h4>
                          <p className="text-sm text-emerald-700 mb-2">{offer.description}</p>
                          <div className="flex items-center space-x-4 text-xs">
                            <span className="text-emerald-600">Code: {offer.code}</span>
                            <span className="text-emerald-600">{offer.validity}</span>
                          </div>
                        </div>
                        <Gift className="w-6 h-6 text-emerald-600" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Chef Profile */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-black mb-4">Meet Our Chef</h2>
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <ChefHat className="w-8 h-8 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-black mb-1">{mockData.chefProfile.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{mockData.chefProfile.experience} Experience</p>
                    <p className="text-sm text-gray-700 mb-3">{mockData.chefProfile.background}</p>
                    <div className="flex flex-wrap gap-1">
                      {mockData.chefProfile.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-black mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-700">{mockData.address}</p>
                      <Button variant="link" className="p-0 h-auto text-xs text-blue-600">
                        Get Directions
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-600" />
                    <a href={`tel:${mockData.phone}`} className="text-sm text-blue-600 hover:underline">
                      {mockData.phone}
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="w-4 h-4 text-gray-600" />
                    <a href={`https://${mockData.website}`} className="text-sm text-blue-600 hover:underline">
                      {mockData.website}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Opening Hours */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-black mb-4">Opening Hours</h3>
                <div className="space-y-2">
                  {Object.entries(mockData.hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between text-sm">
                      <span className="capitalize text-gray-700">{day}</span>
                      <span className="text-black">{hours}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Loyalty Program */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-black mb-4">{mockData.loyaltyProgram.name}</h3>
                <p className="text-sm text-gray-700 mb-3">{mockData.loyaltyProgram.description}</p>
                <div className="space-y-2 mb-4">
                  {mockData.loyaltyProgram.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Gift className="w-3 h-3 text-emerald-600" />
                      <span className="text-xs text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">Join Now</Button>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-black mb-4">Follow Us</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50 bg-transparent">
                    <Facebook className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-black">Facebook</span>
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50 bg-transparent">
                    <Instagram className="w-4 h-4 mr-2 text-pink-600" />
                    <span className="text-black">Instagram</span>
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50 bg-transparent">
                    <Twitter className="w-4 h-4 mr-2 text-blue-400" />
                    <span className="text-black">Twitter</span>
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50 bg-transparent">
                    <Youtube className="w-4 h-4 mr-2 text-red-600" />
                    <span className="text-black">YouTube</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-black mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Calendar className="w-4 h-4 mr-2" />
                    Make Reservation
                  </Button>
                  <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50 bg-transparent">
                    <Utensils className="w-4 h-4 mr-2" />
                    <span className="text-black">Order Online</span>
                  </Button>
                  <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50 bg-transparent">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    <span className="text-black">Write Review</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-black mb-4">Certifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-black">FSSAI Licensed</p>
                      <p className="text-xs text-gray-600">License: {mockData.fssaiLicense}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
