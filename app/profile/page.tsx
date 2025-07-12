"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Save,
  Upload,
  MapPin,
  Phone,
  Mail,
  Globe,
  Camera,
  Eye,
  ExternalLink,
  Star,
  Clock,
  Users,
  Utensils,
  Award,
  Calendar,
  Zap,
  X,
  Plus,
  Building,
  Palette,
  Type,
  ChefHat,
  Trophy,
  User,
  BadgeIcon as Certificate,
  FileText,
  CheckCircle,
  Wifi,
  Car,
  CreditCard,
  Music,
  Baby,
  Dog,
  Accessibility,
  AirVent,
  Shield,
  Coffee,
  MessageSquare,
  ThumbsUp,
  Share2,
  Navigation,
} from "lucide-react"

interface RestaurantProfile {
  id: string
  restaurantName: string
  tagline?: string
  email: string
  phone?: string
  address: string
  cuisineType: string
  restaurantType: string
  priceRange: string
  website?: string
  description?: string
  operatingHours: Record<string, any>
  socialMedia: Record<string, string>
  brandColors: { primary: string; secondary: string }
  brandVoice: string
  amenities: string[]
  logoUrl?: string
  coverImageUrl?: string
  galleryImages: string[]
  isActive: boolean
  setupCompleted: boolean
  legacy?: {
    history: string
    story: string
  }
  highlights?: {
    popularFor: string[]
    uniqueSellingPoints: string[]
  }
  recognition?: {
    awards: string[]
    mediaCoverage: string[]
    rankings: string[]
  }
  chef?: {
    name: string
    intro: string
    photo: string | null
  }
  certifications?: {
    certificates: string[]
    licenses: string[]
    legalName: string
  }
  specialOffers?: Array<{
    id: string
    title: string
    description: string
    validUntil: string
  }>
  loyaltyProgram?: {
    enabled: boolean
    name: string
    description: string
  }
  reservationEnabled?: boolean
}

const CUISINE_TYPES = [
  "Italian",
  "Chinese",
  "Indian",
  "Mexican",
  "Japanese",
  "Thai",
  "French",
  "American",
  "Mediterranean",
  "Korean",
  "Vietnamese",
  "Greek",
  "Spanish",
  "Lebanese",
  "Turkish",
  "Brazilian",
  "Fusion",
  "Other",
]

const RESTAURANT_TYPES = [
  "Fine Dining",
  "Casual Dining",
  "Fast Casual",
  "Quick Service",
  "Food Truck",
  "Cafe",
  "Bakery",
  "Bar & Grill",
  "Buffet",
  "Catering",
  "Other",
]

const PRICE_RANGES = ["$", "$$", "$$$", "$$$$"]

const AMENITIES = [
  { id: "wifi", name: "Free WiFi", icon: Wifi },
  { id: "parking", name: "Parking Available", icon: Car },
  { id: "cards", name: "Card Payments", icon: CreditCard },
  { id: "music", name: "Live Music", icon: Music },
  { id: "kids", name: "Kid Friendly", icon: Baby },
  { id: "pets", name: "Pet Friendly", icon: Dog },
  { id: "accessible", name: "Wheelchair Accessible", icon: Accessibility },
  { id: "ac", name: "Air Conditioned", icon: AirVent },
  { id: "private", name: "Private Dining", icon: Shield },
  { id: "outdoor", name: "Outdoor Seating", icon: Coffee },
]

const DAYS_OF_WEEK = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

// Mock reviews data
const MOCK_REVIEWS = [
  {
    id: "1",
    customerName: "Sarah Johnson",
    rating: 5,
    comment:
      "Amazing food and service! The pasta was incredible and the atmosphere was perfect for our anniversary dinner.",
    date: "2024-01-15",
    verified: true,
  },
  {
    id: "2",
    customerName: "Mike Chen",
    rating: 4,
    comment:
      "Great Italian food with authentic flavors. The pizza was excellent, though service was a bit slow during peak hours.",
    date: "2024-01-12",
    verified: true,
  },
  {
    id: "3",
    customerName: "Emily Davis",
    rating: 5,
    comment: "Best Italian restaurant in the city! Chef Marco's recommendations were spot on. Will definitely be back!",
    date: "2024-01-10",
    verified: true,
  },
  {
    id: "4",
    customerName: "David Wilson",
    rating: 4,
    comment: "Lovely ambiance and delicious food. The tiramisu was the highlight of our meal. Highly recommended!",
    date: "2024-01-08",
    verified: false,
  },
]

// Default values with complete data
const DEFAULT_RESTAURANT: RestaurantProfile = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  restaurantName: "Bella Vista Restaurant",
  tagline: "Authentic Italian flavors in the heart of the city",
  email: "info@bellavista.com",
  phone: "+91 98765 43210",
  address: "123 MG Road, Bangalore, Karnataka 560001",
  cuisineType: "Italian",
  restaurantType: "Casual Dining",
  priceRange: "$$",
  website: "www.bellavista.com",
  description:
    "Authentic Italian cuisine with a modern twist, featuring fresh ingredients and traditional recipes passed down through generations. Our wood-fired oven and handmade pasta create an unforgettable dining experience.",
  operatingHours: {
    monday: { open: "11:00", close: "23:00", closed: false },
    tuesday: { open: "11:00", close: "23:00", closed: false },
    wednesday: { open: "11:00", close: "23:00", closed: false },
    thursday: { open: "11:00", close: "23:00", closed: false },
    friday: { open: "11:00", close: "24:00", closed: false },
    saturday: { open: "11:00", close: "24:00", closed: false },
    sunday: { open: "12:00", close: "22:00", closed: false },
  },
  socialMedia: {
    facebook: "https://facebook.com/bellavista",
    instagram: "https://instagram.com/bellavista",
    twitter: "https://twitter.com/bellavista",
    linkedin: "",
  },
  brandColors: { primary: "#1f2937", secondary: "#6b7280" },
  brandVoice: "Warm, authentic, and passionate about Italian culinary traditions",
  amenities: ["wifi", "parking", "cards", "kids", "accessible", "ac", "private"],
  logoUrl: "",
  coverImageUrl: "",
  galleryImages: [],
  isActive: true,
  setupCompleted: true,
  legacy: {
    history:
      "Founded in 1995 by Chef Marco Rossi, Bella Vista brings the authentic flavors of Tuscany to Bangalore. Our family recipes have been perfected over three generations.",
    story:
      "Born from a dream to bring authentic Italian flavors to India, Bella Vista Restaurant was established with recipes passed down through three generations of Italian culinary masters.",
  },
  highlights: {
    popularFor: ["Wood-fired Pizza", "Handmade Pasta", "Romantic Ambiance", "Wine Selection"],
    uniqueSellingPoints: [
      "Only restaurant in Bangalore using imported Italian ingredients",
      "Traditional wood-fired oven imported from Naples",
      "Family recipes from three generations",
    ],
  },
  recognition: {
    awards: ["Best Italian Restaurant 2023", "Excellence in Service Award 2022", "Top Chef Award 2021"],
    mediaCoverage: ["Featured in Times Food Guide", "Bangalore Mirror Restaurant Review"],
    rankings: ["#1 Italian Restaurant on Zomato", "Top 10 Romantic Restaurants"],
  },
  chef: {
    name: "Chef Marco Rossi",
    intro:
      "With over 20 years of culinary experience, Chef Marco brings authentic Italian flavors to Bangalore. Trained in traditional Italian cooking methods in Tuscany.",
    photo: null,
  },
  certifications: {
    certificates: ["FSSAI License", "Fire Safety Certificate", "ISO 22000 Certification"],
    licenses: ["Liquor License", "Music License"],
    legalName: "Bella Vista Restaurant Private Limited",
  },
  specialOffers: [
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
  loyaltyProgram: {
    enabled: true,
    name: "Bella Vista Rewards",
    description: "Earn points with every visit and unlock exclusive rewards",
  },
  reservationEnabled: true,
}

export default function ProfilePage() {
  const [restaurant, setRestaurant] = useState<RestaurantProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("basic")
  const [showPreview, setShowPreview] = useState(false)
  const [newHighlight, setNewHighlight] = useState("")
  const [newUSP, setNewUSP] = useState("")
  const [newAward, setNewAward] = useState("")
  const [newCertificate, setNewCertificate] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchRestaurant()
  }, [])

  const fetchRestaurant = async () => {
    try {
      setLoading(true)
      setError(null)

      // Use default data for demo
      setRestaurant(DEFAULT_RESTAURANT)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setRestaurant(DEFAULT_RESTAURANT)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!restaurant) return

    try {
      setSaving(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Profile Updated",
        description: "Your restaurant profile has been successfully updated.",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to save changes",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!restaurant) return

    try {
      setSaving(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Profile Published",
        description: "Your restaurant profile is now live and visible to customers.",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to publish profile",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const updateRestaurant = (updates: Partial<RestaurantProfile>) => {
    if (restaurant) {
      setRestaurant({ ...restaurant, ...updates })
    }
  }

  const updateOperatingHours = (day: string, field: string, value: string | boolean) => {
    if (!restaurant) return
    const currentHours = restaurant.operatingHours || {}
    const dayData = currentHours[day] || { open: "09:00", close: "21:00", closed: false }
    const newHours = {
      ...currentHours,
      [day]: { ...dayData, [field]: value },
    }
    updateRestaurant({ operatingHours: newHours })
  }

  const updateSocialMedia = (platform: string, url: string) => {
    if (!restaurant) return
    const newSocialMedia = { ...(restaurant.socialMedia || {}), [platform]: url }
    updateRestaurant({ socialMedia: newSocialMedia })
  }

  const toggleAmenity = (amenityId: string) => {
    if (!restaurant) return
    const currentAmenities = restaurant.amenities || []
    const newAmenities = currentAmenities.includes(amenityId)
      ? currentAmenities.filter((a) => a !== amenityId)
      : [...currentAmenities, amenityId]
    updateRestaurant({ amenities: newAmenities })
  }

  const addHighlight = () => {
    if (!restaurant || !newHighlight.trim()) return
    const currentHighlights = restaurant.highlights?.popularFor || []
    updateRestaurant({
      highlights: {
        ...restaurant.highlights,
        popularFor: [...currentHighlights, newHighlight.trim()],
      },
    })
    setNewHighlight("")
  }

  const removeHighlight = (index: number) => {
    if (!restaurant) return
    const currentHighlights = restaurant.highlights?.popularFor || []
    updateRestaurant({
      highlights: {
        ...restaurant.highlights,
        popularFor: currentHighlights.filter((_, i) => i !== index),
      },
    })
  }

  const addUSP = () => {
    if (!restaurant || !newUSP.trim()) return
    const currentUSPs = restaurant.highlights?.uniqueSellingPoints || []
    updateRestaurant({
      highlights: {
        ...restaurant.highlights,
        uniqueSellingPoints: [...currentUSPs, newUSP.trim()],
      },
    })
    setNewUSP("")
  }

  const removeUSP = (index: number) => {
    if (!restaurant) return
    const currentUSPs = restaurant.highlights?.uniqueSellingPoints || []
    updateRestaurant({
      highlights: {
        ...restaurant.highlights,
        uniqueSellingPoints: currentUSPs.filter((_, i) => i !== index),
      },
    })
  }

  const addAward = () => {
    if (!restaurant || !newAward.trim()) return
    const currentAwards = restaurant.recognition?.awards || []
    updateRestaurant({
      recognition: {
        ...restaurant.recognition,
        awards: [...currentAwards, newAward.trim()],
      },
    })
    setNewAward("")
  }

  const removeAward = (index: number) => {
    if (!restaurant) return
    const currentAwards = restaurant.recognition?.awards || []
    updateRestaurant({
      recognition: {
        ...restaurant.recognition,
        awards: currentAwards.filter((_, i) => i !== index),
      },
    })
  }

  const addCertificate = () => {
    if (!restaurant || !newCertificate.trim()) return
    const currentCerts = restaurant.certifications?.certificates || []
    updateRestaurant({
      certifications: {
        ...restaurant.certifications,
        certificates: [...currentCerts, newCertificate.trim()],
      },
    })
    setNewCertificate("")
  }

  const removeCertificate = (index: number) => {
    if (!restaurant) return
    const currentCerts = restaurant.certifications?.certificates || []
    updateRestaurant({
      certifications: {
        ...restaurant.certifications,
        certificates: currentCerts.filter((_, i) => i !== index),
      },
    })
  }

  // Mobile-First Preview Component
  const ProfilePreview = () => {
    if (!restaurant) return null

    const formatTime = (time: string) => {
      if (!time) return ""
      const [hours, minutes] = time.split(":")
      const hour = Number.parseInt(hours)
      const ampm = hour >= 12 ? "PM" : "AM"
      const displayHour = hour % 12 || 12
      return `${displayHour}:${minutes} ${ampm}`
    }

    const getTodayHours = () => {
      const today = new Date()
      const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
      const todayName = dayNames[today.getDay()]
      const hours = restaurant.operatingHours[todayName]
      if (!hours || hours.closed) return "Closed"
      return `${formatTime(hours.open)} - ${formatTime(hours.close)}`
    }

    const getOperatingStatus = () => {
      const now = new Date()
      const currentTime = now.getHours() * 60 + now.getMinutes()
      const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
      const today = new Date()
      const todayName = dayNames[today.getDay()]
      const hours = restaurant.operatingHours[todayName]

      if (!hours || hours.closed) return { status: "Closed", color: "text-red-600" }

      const openTime = Number.parseInt(hours.open.split(":")[0]) * 60 + Number.parseInt(hours.open.split(":")[1])
      const closeTime = Number.parseInt(hours.close.split(":")[0]) * 60 + Number.parseInt(hours.close.split(":")[1])

      if (currentTime >= openTime && currentTime <= closeTime) {
        return { status: "Open Now", color: "text-green-600" }
      }

      return { status: "Closed", color: "text-red-600" }
    }

    const operatingStatus = getOperatingStatus()
    const avgRating = 4.3
    const totalReviews = MOCK_REVIEWS.length

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-50">
        <div className="bg-white rounded-lg w-full max-w-sm max-h-[95vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
            <h3 className="text-lg font-semibold">Profile Preview</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <ScrollArea className="h-[calc(95vh-120px)]">
            {/* Hero Section */}
            <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900">
              <div className="absolute inset-0 flex items-center justify-center text-white text-center p-4">
                <div>
                  <h1 className="text-xl font-bold mb-1">{restaurant.restaurantName}</h1>
                  {restaurant.tagline && <p className="text-sm opacity-90 mb-2">{restaurant.tagline}</p>}
                  <div className="flex items-center justify-center space-x-3 text-sm">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>
                        {avgRating} ({totalReviews})
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {restaurant.priceRange}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {restaurant.cuisineType}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* Quick Info */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className={`font-medium ${operatingStatus.color}`}>{operatingStatus.status}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Navigation className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">2.3 km away</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Button className="w-full text-sm" style={{ backgroundColor: restaurant.brandColors.primary }}>
                  <Phone className="w-4 h-4 mr-1" />
                  Call
                </Button>
                {restaurant.reservationEnabled && (
                  <Button variant="outline" className="w-full text-sm bg-transparent">
                    <Calendar className="w-4 h-4 mr-1" />
                    Reserve
                  </Button>
                )}
              </div>

              {/* About */}
              <div>
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{restaurant.description}</p>
              </div>

              {/* Popular For */}
              {restaurant.highlights?.popularFor && restaurant.highlights.popularFor.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Popular For</h3>
                  <div className="flex flex-wrap gap-1">
                    {restaurant.highlights.popularFor.map((item, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Info */}
              <div>
                <h3 className="font-semibold mb-2">Contact & Location</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{restaurant.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{restaurant.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Today: {getTodayHours()}</span>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              {restaurant.amenities && restaurant.amenities.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Amenities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {restaurant.amenities.slice(0, 6).map((amenityId) => {
                      const amenity = AMENITIES.find((a) => a.id === amenityId)
                      if (!amenity) return null
                      return (
                        <div key={amenityId} className="flex items-center space-x-2 text-sm">
                          <amenity.icon className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-600">{amenity.name}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Reviews Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Reviews</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{avgRating}</span>
                    <span className="text-sm text-gray-500">({totalReviews} reviews)</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {MOCK_REVIEWS.slice(0, 3).map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="w-3 h-3 text-gray-400" />
                          </div>
                          <span className="text-sm font-medium">{review.customerName}</span>
                          {review.verified && <CheckCircle className="w-3 h-3 text-green-500" />}
                        </div>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{review.comment}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">{review.date}</span>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            Helpful
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="w-full mt-3 text-sm bg-transparent">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  View All Reviews
                </Button>
              </div>

              {/* Chef Section */}
              {restaurant.chef?.name && (
                <div>
                  <h3 className="font-semibold mb-2">Meet the Chef</h3>
                  <div className="flex space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{restaurant.chef.name}</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">{restaurant.chef.intro}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Awards */}
              {restaurant.recognition?.awards && restaurant.recognition.awards.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Awards & Recognition</h3>
                  <div className="space-y-2">
                    {restaurant.recognition.awards.slice(0, 3).map((award, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <Trophy className="w-4 h-4 text-yellow-600" />
                        <span className="text-gray-600">{award}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Special Offers */}
              {restaurant.specialOffers && restaurant.specialOffers.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Special Offers</h3>
                  <div className="space-y-2">
                    {restaurant.specialOffers.map((offer) => (
                      <div key={offer.id} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-medium text-sm text-green-800">{offer.title}</h4>
                        <p className="text-xs text-green-600">{offer.description}</p>
                        <p className="text-xs text-green-500 mt-1">{offer.validUntil}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Share Section */}
              <div className="pt-2 border-t">
                <Button variant="outline" className="w-full text-sm bg-transparent">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Restaurant
                </Button>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded animate-pulse" />
          <div className="h-96 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Error Loading Profile</CardTitle>
            <CardDescription className="text-red-600">{error || "Failed to load restaurant profile"}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={fetchRestaurant} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-First Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Profile</h1>
              <p className="text-sm text-gray-600">Manage your restaurant information and settings</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setShowPreview(true)} className="flex-1 sm:flex-none">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving} className="flex-1 sm:flex-none">
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button size="sm" onClick={handlePublish} disabled={saving} className="hidden sm:flex">
                <ExternalLink className="w-4 h-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          {/* Mobile-First Tab Navigation */}
          <div className="overflow-x-auto">
            <TabsList className="grid grid-cols-7 w-max min-w-full">
              <TabsTrigger value="basic" className="text-xs">
                Basic
              </TabsTrigger>
              <TabsTrigger value="contact" className="text-xs">
                Contact
              </TabsTrigger>
              <TabsTrigger value="hours" className="text-xs">
                Hours
              </TabsTrigger>
              <TabsTrigger value="branding" className="text-xs">
                Brand
              </TabsTrigger>
              <TabsTrigger value="details" className="text-xs">
                Details
              </TabsTrigger>
              <TabsTrigger value="amenities" className="text-xs">
                Features
              </TabsTrigger>
              <TabsTrigger value="advanced" className="text-xs">
                Advanced
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Building className="w-5 h-5 mr-2" />
                  Basic Information
                </CardTitle>
                <CardDescription>Essential details about your restaurant</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="restaurantName">Restaurant Name *</Label>
                    <Input
                      id="restaurantName"
                      value={restaurant.restaurantName || ""}
                      onChange={(e) => updateRestaurant({ restaurantName: e.target.value })}
                      placeholder="Enter restaurant name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                      id="tagline"
                      value={restaurant.tagline || ""}
                      onChange={(e) => updateRestaurant({ tagline: e.target.value })}
                      placeholder="A catchy tagline"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={restaurant.description || ""}
                    onChange={(e) => updateRestaurant({ description: e.target.value })}
                    placeholder="Describe your restaurant..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="cuisineType">Cuisine Type *</Label>
                    <Select
                      value={restaurant.cuisineType || ""}
                      onValueChange={(value) => updateRestaurant({ cuisineType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select cuisine" />
                      </SelectTrigger>
                      <SelectContent>
                        {CUISINE_TYPES.map((cuisine) => (
                          <SelectItem key={cuisine} value={cuisine}>
                            {cuisine}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="restaurantType">Restaurant Type *</Label>
                    <Select
                      value={restaurant.restaurantType || ""}
                      onValueChange={(value) => updateRestaurant({ restaurantType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {RESTAURANT_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priceRange">Price Range *</Label>
                    <Select
                      value={restaurant.priceRange || ""}
                      onValueChange={(value) => updateRestaurant({ priceRange: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRICE_RANGES.map((range) => (
                          <SelectItem key={range} value={range}>
                            {range}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={restaurant.isActive || false}
                    onCheckedChange={(checked) => updateRestaurant({ isActive: checked })}
                  />
                  <Label htmlFor="isActive">Restaurant is currently active</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Phone className="w-5 h-5 mr-2" />
                  Contact Information
                </CardTitle>
                <CardDescription>How customers can reach and find you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        className="pl-10"
                        value={restaurant.email || ""}
                        onChange={(e) => updateRestaurant({ email: e.target.value })}
                        placeholder="restaurant@example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        className="pl-10"
                        value={restaurant.phone || ""}
                        onChange={(e) => updateRestaurant({ phone: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address"
                      className="pl-10"
                      value={restaurant.address || ""}
                      onChange={(e) => updateRestaurant({ address: e.target.value })}
                      placeholder="123 Main St, City, State 12345"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="website"
                      type="url"
                      className="pl-10"
                      value={restaurant.website || ""}
                      onChange={(e) => updateRestaurant({ website: e.target.value })}
                      placeholder="https://yourrestaurant.com"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Social Media</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="facebook">Facebook</Label>
                      <Input
                        id="facebook"
                        value={(restaurant.socialMedia && restaurant.socialMedia.facebook) || ""}
                        onChange={(e) => updateSocialMedia("facebook", e.target.value)}
                        placeholder="https://facebook.com/yourrestaurant"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        value={(restaurant.socialMedia && restaurant.socialMedia.instagram) || ""}
                        onChange={(e) => updateSocialMedia("instagram", e.target.value)}
                        placeholder="https://instagram.com/yourrestaurant"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twitter">Twitter</Label>
                      <Input
                        id="twitter"
                        value={(restaurant.socialMedia && restaurant.socialMedia.twitter) || ""}
                        onChange={(e) => updateSocialMedia("twitter", e.target.value)}
                        placeholder="https://twitter.com/yourrestaurant"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={(restaurant.socialMedia && restaurant.socialMedia.linkedin) || ""}
                        onChange={(e) => updateSocialMedia("linkedin", e.target.value)}
                        placeholder="https://linkedin.com/company/yourrestaurant"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hours" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Clock className="w-5 h-5 mr-2" />
                  Operating Hours
                </CardTitle>
                <CardDescription>Set your restaurant's operating schedule</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {DAYS_OF_WEEK.map((day) => {
                  const operatingHours = restaurant.operatingHours || {}
                  const dayData = operatingHours[day] || { open: "09:00", close: "21:00", closed: false }
                  const dayName = day.charAt(0).toUpperCase() + day.slice(1)

                  return (
                    <div key={day} className="flex flex-col gap-3 p-4 border rounded-lg sm:flex-row sm:items-center">
                      <div className="w-full sm:w-20">
                        <Label className="font-medium">{dayName}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={!dayData.closed}
                          onCheckedChange={(checked) => updateOperatingHours(day, "closed", !checked)}
                        />
                        <Label className="text-sm">Open</Label>
                      </div>
                      {!dayData.closed && (
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                          <div className="flex items-center gap-2">
                            <Label className="text-sm">From:</Label>
                            <Input
                              type="time"
                              value={dayData.open || "09:00"}
                              onChange={(e) => updateOperatingHours(day, "open", e.target.value)}
                              className="w-32"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-sm">To:</Label>
                            <Input
                              type="time"
                              value={dayData.close || "21:00"}
                              onChange={(e) => updateOperatingHours(day, "close", e.target.value)}
                              className="w-32"
                            />
                          </div>
                        </div>
                      )}
                      {dayData.closed && <Badge variant="secondary">Closed</Badge>}
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branding" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Palette className="w-5 h-5 mr-2" />
                  Branding & Visual Identity
                </CardTitle>
                <CardDescription>Customize your restaurant's visual appearance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Brand Colors</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Label htmlFor="primaryColor" className="w-20">
                          Primary:
                        </Label>
                        <div className="flex items-center gap-2 flex-1">
                          <Input
                            id="primaryColor"
                            type="color"
                            value={(restaurant.brandColors && restaurant.brandColors.primary) || "#000000"}
                            onChange={(e) =>
                              updateRestaurant({
                                brandColors: {
                                  ...(restaurant.brandColors || { primary: "#000000", secondary: "#666666" }),
                                  primary: e.target.value,
                                },
                              })
                            }
                            className="w-16 h-10 p-1 border rounded"
                          />
                          <Input
                            value={(restaurant.brandColors && restaurant.brandColors.primary) || "#000000"}
                            onChange={(e) =>
                              updateRestaurant({
                                brandColors: {
                                  ...(restaurant.brandColors || { primary: "#000000", secondary: "#666666" }),
                                  primary: e.target.value,
                                },
                              })
                            }
                            className="flex-1"
                            placeholder="#000000"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Label htmlFor="secondaryColor" className="w-20">
                          Secondary:
                        </Label>
                        <div className="flex items-center gap-2 flex-1">
                          <Input
                            id="secondaryColor"
                            type="color"
                            value={(restaurant.brandColors && restaurant.brandColors.secondary) || "#666666"}
                            onChange={(e) =>
                              updateRestaurant({
                                brandColors: {
                                  ...(restaurant.brandColors || { primary: "#000000", secondary: "#666666" }),
                                  secondary: e.target.value,
                                },
                              })
                            }
                            className="w-16 h-10 p-1 border rounded"
                          />
                          <Input
                            value={(restaurant.brandColors && restaurant.brandColors.secondary) || "#666666"}
                            onChange={(e) =>
                              updateRestaurant({
                                brandColors: {
                                  ...(restaurant.brandColors || { primary: "#000000", secondary: "#666666" }),
                                  secondary: e.target.value,
                                },
                              })
                            }
                            className="flex-1"
                            placeholder="#666666"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Brand Voice</h3>
                    <Textarea
                      value={restaurant.brandVoice || ""}
                      onChange={(e) => updateRestaurant({ brandVoice: e.target.value })}
                      placeholder="Describe your restaurant's personality and tone..."
                      rows={4}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Images</h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-3">
                      <Label>Logo</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        {restaurant.logoUrl ? (
                          <img
                            src={restaurant.logoUrl || "/placeholder.svg"}
                            alt="Logo"
                            className="mx-auto h-20 w-20 object-cover rounded"
                          />
                        ) : (
                          <div className="space-y-2">
                            <Camera className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="text-sm text-gray-500">Upload your logo</p>
                          </div>
                        )}
                        <Button variant="outline" size="sm" className="mt-3 bg-transparent">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Logo
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label>Cover Image</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        {restaurant.coverImageUrl ? (
                          <img
                            src={restaurant.coverImageUrl || "/placeholder.svg"}
                            alt="Cover"
                            className="mx-auto h-20 w-32 object-cover rounded"
                          />
                        ) : (
                          <div className="space-y-2">
                            <Camera className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="text-sm text-gray-500">Upload cover image</p>
                          </div>
                        )}
                        <Button variant="outline" size="sm" className="mt-3 bg-transparent">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Cover
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            {/* Legacy Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Type className="w-5 h-5 mr-2" />
                  Legacy & Story
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="history">History</Label>
                  <Textarea
                    id="history"
                    value={restaurant.legacy?.history || ""}
                    onChange={(e) =>
                      updateRestaurant({
                        legacy: { ...restaurant.legacy, history: e.target.value },
                      })
                    }
                    placeholder="Tell the history of your restaurant"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="story">Story</Label>
                  <Textarea
                    id="story"
                    value={restaurant.legacy?.story || ""}
                    onChange={(e) =>
                      updateRestaurant({
                        legacy: { ...restaurant.legacy, story: e.target.value },
                      })
                    }
                    placeholder="Share your restaurant's story"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Highlights Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Star className="w-5 h-5 mr-2" />
                  Highlights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="mb-2 block">Popular For</Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {restaurant.highlights?.popularFor?.map((item, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {item}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeHighlight(index)}
                          className="ml-1 h-auto p-0 hover:bg-transparent"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      value={newHighlight}
                      onChange={(e) => setNewHighlight(e.target.value)}
                      placeholder="Add what you're popular for"
                      onKeyPress={(e) => e.key === "Enter" && addHighlight()}
                    />
                    <Button onClick={addHighlight} variant="outline" size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block">Unique Selling Points</Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {restaurant.highlights?.uniqueSellingPoints?.map((usp, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {usp}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeUSP(index)}
                          className="ml-1 h-auto p-0 hover:bg-transparent"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      value={newUSP}
                      onChange={(e) => setNewUSP(e.target.value)}
                      placeholder="Add unique selling point"
                      onKeyPress={(e) => e.key === "Enter" && addUSP()}
                    />
                    <Button onClick={addUSP} variant="outline" size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recognition Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Trophy className="w-5 h-5 mr-2" />
                  Recognition
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="mb-2 block">Awards</Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {restaurant.recognition?.awards?.map((award, index) => (
                      <Badge key={index} variant="outline" className="bg-yellow-50 border-yellow-300 text-xs">
                        <Award className="w-3 h-3 mr-1" />
                        {award}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAward(index)}
                          className="ml-1 h-auto p-0 hover:bg-transparent"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      value={newAward}
                      onChange={(e) => setNewAward(e.target.value)}
                      placeholder="Add award or recognition"
                      onKeyPress={(e) => e.key === "Enter" && addAward()}
                    />
                    <Button onClick={addAward} variant="outline" size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chef Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <ChefHat className="w-5 h-5 mr-2" />
                  Chef Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="chefName">Chef Name</Label>
                  <Input
                    id="chefName"
                    value={restaurant.chef?.name || ""}
                    onChange={(e) =>
                      updateRestaurant({
                        chef: { ...restaurant.chef, name: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chefIntro">Chef Introduction</Label>
                  <Textarea
                    id="chefIntro"
                    value={restaurant.chef?.intro || ""}
                    onChange={(e) =>
                      updateRestaurant({
                        chef: { ...restaurant.chef, intro: e.target.value },
                      })
                    }
                    placeholder="Brief introduction about the chef"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Certifications Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Certificate className="w-5 h-5 mr-2" />
                  Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="legalName">Legal Name</Label>
                  <Input
                    id="legalName"
                    value={restaurant.certifications?.legalName || ""}
                    onChange={(e) =>
                      updateRestaurant({
                        certifications: { ...restaurant.certifications, legalName: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Certificates</Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {restaurant.certifications?.certificates?.map((cert, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <FileText className="w-3 h-3 mr-1" />
                        {cert}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCertificate(index)}
                          className="ml-1 h-auto p-0 hover:bg-transparent"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      value={newCertificate}
                      onChange={(e) => setNewCertificate(e.target.value)}
                      placeholder="Add certificate"
                      onKeyPress={(e) => e.key === "Enter" && addCertificate()}
                    />
                    <Button onClick={addCertificate} variant="outline" size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="amenities" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Utensils className="w-5 h-5 mr-2" />
                  Amenities & Features
                </CardTitle>
                <CardDescription>Select the amenities and features your restaurant offers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {AMENITIES.map((amenity) => {
                    const currentAmenities = restaurant.amenities || []
                    const isSelected = currentAmenities.includes(amenity.id)

                    return (
                      <div
                        key={amenity.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          isSelected ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => toggleAmenity(amenity.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <amenity.icon className={`w-5 h-5 ${isSelected ? "text-primary" : "text-gray-400"}`} />
                          <div className="flex-1">
                            <Label className="text-sm cursor-pointer font-medium">{amenity.name}</Label>
                          </div>
                          {isSelected && <CheckCircle className="w-5 h-5 text-primary" />}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            {/* Special Offers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Zap className="w-5 h-5 mr-2" />
                  Special Offers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {restaurant.specialOffers?.map((offer, index) => (
                  <div key={offer.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{offer.title}</h4>
                        <p className="text-sm text-gray-600">{offer.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{offer.validUntil}</p>
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Loyalty Program */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Users className="w-5 h-5 mr-2" />
                  Loyalty Program
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Enable Loyalty Program</h3>
                    <p className="text-sm text-gray-600">Reward your regular customers</p>
                  </div>
                  <Switch
                    checked={restaurant.loyaltyProgram?.enabled || false}
                    onCheckedChange={(checked) =>
                      updateRestaurant({
                        loyaltyProgram: { ...restaurant.loyaltyProgram, enabled: checked },
                      })
                    }
                  />
                </div>
                {restaurant.loyaltyProgram?.enabled && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor="loyaltyName">Program Name</Label>
                      <Input
                        id="loyaltyName"
                        value={restaurant.loyaltyProgram?.name || ""}
                        onChange={(e) =>
                          updateRestaurant({
                            loyaltyProgram: { ...restaurant.loyaltyProgram, name: e.target.value },
                          })
                        }
                        placeholder="e.g., Bella Vista Rewards"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="loyaltyDescription">Description</Label>
                      <Textarea
                        id="loyaltyDescription"
                        value={restaurant.loyaltyProgram?.description || ""}
                        onChange={(e) =>
                          updateRestaurant({
                            loyaltyProgram: { ...restaurant.loyaltyProgram, description: e.target.value },
                          })
                        }
                        placeholder="Describe your loyalty program"
                        rows={3}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Reservation System */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Calendar className="w-5 h-5 mr-2" />
                  Reservation System
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Enable Reservations</h3>
                    <p className="text-sm text-gray-600">Allow customers to book tables</p>
                  </div>
                  <Switch
                    checked={restaurant.reservationEnabled || false}
                    onCheckedChange={(checked) => updateRestaurant({ reservationEnabled: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Mobile Publish Button */}
      <div className="sticky bottom-0 bg-white border-t p-4 sm:hidden">
        <Button onClick={handlePublish} disabled={saving} className="w-full">
          <ExternalLink className="w-4 h-4 mr-2" />
          {saving ? "Publishing..." : "Publish Profile"}
        </Button>
      </div>

      {/* Preview Modal */}
      {showPreview && <ProfilePreview />}
    </div>
  )
}
