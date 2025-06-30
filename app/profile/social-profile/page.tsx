"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { MobileResponsiveTabs } from "@/components/mobile-responsive-tabs"
import { AIProfileConfigModal, type ProfileConfig } from "@/components/ai/ai-profile-config-modal"
import { AISimplePreviewModal } from "@/components/ai/ai-simple-preview-modal"
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Eye,
  Sparkles,
  Upload,
  Palette,
  FolderSyncIcon as Sync,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

interface HoursData {
  open: string
  close: string
  closed: boolean
}

interface FormData {
  restaurantName: string
  tagline: string
  description: string
  cuisine: string
  priceRange: string
  address: string
  phone: string
  email: string
  website: string
  logo: File | null
  coverImage: File | null
  brandColors: {
    primary: string
    secondary: string
  }
  features: string[]
  amenities: string[]
  socialMedia: {
    instagram: string
    facebook: string
    twitter: string
    youtube: string
  }
  hours: {
    monday: HoursData
    tuesday: HoursData
    wednesday: HoursData
    thursday: HoursData
    friday: HoursData
    saturday: HoursData
    sunday: HoursData
  }
  story: string
  values: string
  awards: string
}

export default function SocialProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isOnboarding = searchParams.get("onboarding") === "true"
  const isNewUser = searchParams.get("new") === "true"

  const [showConfigModal, setShowConfigModal] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [completionProgress, setCompletionProgress] = useState(0)
  const [integrationProgress, setIntegrationProgress] = useState(65)

  // Form state
  const [formData, setFormData] = useState<FormData>({
    // Basic Info
    restaurantName: "",
    tagline: "",
    description: "",
    cuisine: "",
    priceRange: "",

    // Contact & Location
    address: "",
    phone: "",
    email: "",
    website: "",

    // Brand Assets
    logo: null,
    coverImage: null,
    brandColors: {
      primary: "#000000",
      secondary: "#666666",
    },

    // Features & Amenities
    features: [],
    amenities: [],

    // Social Media
    socialMedia: {
      instagram: "",
      facebook: "",
      twitter: "",
      youtube: "",
    },

    // Operating Hours
    hours: {
      monday: { open: "09:00", close: "22:00", closed: false },
      tuesday: { open: "09:00", close: "22:00", closed: false },
      wednesday: { open: "09:00", close: "22:00", closed: false },
      thursday: { open: "09:00", close: "22:00", closed: false },
      friday: { open: "09:00", close: "22:00", closed: false },
      saturday: { open: "09:00", close: "23:00", closed: false },
      sunday: { open: "09:00", close: "23:00", closed: false },
    },

    // Story & Values
    story: "",
    values: "",
    awards: "",
  })

  const availableFeatures = [
    "Family Friendly",
    "Outdoor Seating",
    "Home Delivery",
    "Takeaway",
    "Live Music",
    "Private Dining",
    "Catering",
    "Bar Available",
    "Veg Options",
    "Vegan Options",
    "Gluten Free",
    "Halal",
  ]

  const availableAmenities = [
    "WiFi",
    "Parking",
    "AC",
    "Card Payment",
    "UPI Payment",
    "Wheelchair Accessible",
    "Pet Friendly",
    "Smoking Area",
    "TV Screens",
  ]

  // Calculate completion progress
  useEffect(() => {
    const fields = [
      formData.restaurantName,
      formData.tagline,
      formData.description,
      formData.cuisine,
      formData.address,
      formData.phone,
    ]
    const completed = fields.filter((field) => field && field.trim() !== "").length
    const progress = Math.round((completed / fields.length) * 100)
    setCompletionProgress(progress)
  }, [formData])

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNestedInputChange = (parent: keyof FormData, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: { ...(prev[parent] as any), [field]: value },
    }))
  }

  const handleFeatureToggle = (feature: string, type: "features" | "amenities") => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].includes(feature) ? prev[type].filter((f) => f !== feature) : [...prev[type], feature],
    }))
  }

  const handleHoursChange = (day: keyof FormData["hours"], field: keyof HoursData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      hours: {
        ...prev.hours,
        [day]: {
          ...prev.hours[day],
          [field]: value,
        },
      },
    }))
  }

  const handleGenerateProfile = (config: ProfileConfig) => {
    setIsGenerating(true)
    setShowConfigModal(false)

    // Simulate AI generation
    setTimeout(() => {
      const generatedContent = {
        restaurantName: "Spice Garden Restaurant",
        tagline:
          config.brandPositioning === "premium"
            ? "Exquisite Indian Cuisine Experience"
            : "Authentic Flavors, Warm Hospitality",
        description:
          config.contentStyle === "storytelling"
            ? "Born from a passion for authentic Indian flavors, Spice Garden has been serving the community for over two decades. Our journey began with traditional family recipes passed down through generations, each dish crafted with love and the finest spices sourced directly from India."
            : "Experience authentic Indian cuisine at Spice Garden Restaurant. Our expert chefs prepare traditional dishes using fresh ingredients and aromatic spices, offering a perfect blend of taste and quality in every meal.",
        cuisine: "North Indian, South Indian, Chinese",
        story: config.includeHistory
          ? "Established in 1998 by Chef Rajesh Kumar, Spice Garden started as a small family restaurant with a dream to share authentic Indian flavors with the world."
          : "",
        values:
          "Quality ingredients, traditional recipes, exceptional service, and creating memorable dining experiences for our guests.",
      }

      setFormData((prev) => ({ ...prev, ...generatedContent }))
      setIsGenerating(false)
    }, 3000)
  }

  const handleSave = async () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
    }, 1000)
  }

  const handlePreview = () => {
    setShowPreviewModal(true)
  }

  const handlePublish = () => {
    console.log("Publishing profile...")
  }

  const handleContinue = () => {
    const params = new URLSearchParams()
    if (isOnboarding) params.set("onboarding", "true")
    if (isNewUser) params.set("new", "true")

    router.push(`/profile/menu-builder${params.toString() ? "?" + params.toString() : ""}`)
  }

  const handleBack = () => {
    if (isOnboarding) {
      router.push("/onboarding")
    } else {
      router.push("/profile")
    }
  }

  const tabs = [
    {
      id: "basic",
      label: "Basic Info",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="restaurantName">Restaurant Name *</Label>
              <Input
                id="restaurantName"
                value={formData.restaurantName}
                onChange={(e) => handleInputChange("restaurantName", e.target.value)}
                placeholder="Enter restaurant name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cuisine">Cuisine Type *</Label>
              <Input
                id="cuisine"
                value={formData.cuisine}
                onChange={(e) => handleInputChange("cuisine", e.target.value)}
                placeholder="e.g., North Indian, Chinese"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              value={formData.tagline}
              onChange={(e) => handleInputChange("tagline", e.target.value)}
              placeholder="A catchy tagline for your restaurant"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe your restaurant, cuisine, and what makes it special"
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priceRange">Price Range</Label>
            <Input
              id="priceRange"
              value={formData.priceRange}
              onChange={(e) => handleInputChange("priceRange", e.target.value)}
              placeholder="e.g., ₹500-₹1000 for two"
            />
          </div>
        </div>
      ),
    },
    {
      id: "contact",
      label: "Contact & Location",
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Complete address with landmark"
              className="min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="restaurant@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
              placeholder="www.yourrestaurant.com"
            />
          </div>
        </div>
      ),
    },
    {
      id: "brand",
      label: "Brand Assets",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label>Restaurant Logo</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Upload your restaurant logo</p>
                <Button variant="outline" size="sm">
                  Choose File
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Cover Image</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Upload cover image</p>
                <Button variant="outline" size="sm">
                  Choose File
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="flex items-center space-x-2">
              <Palette className="w-4 h-4" />
              <span>Brand Colors</span>
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    id="primaryColor"
                    value={formData.brandColors.primary}
                    onChange={(e) => handleNestedInputChange("brandColors", "primary", e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded"
                  />
                  <Input
                    value={formData.brandColors.primary}
                    onChange={(e) => handleNestedInputChange("brandColors", "primary", e.target.value)}
                    placeholder="#000000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    id="secondaryColor"
                    value={formData.brandColors.secondary}
                    onChange={(e) => handleNestedInputChange("brandColors", "secondary", e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded"
                  />
                  <Input
                    value={formData.brandColors.secondary}
                    onChange={(e) => handleNestedInputChange("brandColors", "secondary", e.target.value)}
                    placeholder="#666666"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "features",
      label: "Features & Amenities",
      content: (
        <div className="space-y-6">
          <div className="space-y-3">
            <Label>Restaurant Features</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {availableFeatures.map((feature) => (
                <div
                  key={feature}
                  className={`p-2 border rounded-lg cursor-pointer transition-colors text-center ${
                    formData.features.includes(feature)
                      ? "border-black bg-black text-white"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onClick={() => handleFeatureToggle(feature, "features")}
                >
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Amenities</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {availableAmenities.map((amenity) => (
                <div
                  key={amenity}
                  className={`p-2 border rounded-lg cursor-pointer transition-colors text-center ${
                    formData.amenities.includes(amenity)
                      ? "border-black bg-black text-white"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onClick={() => handleFeatureToggle(amenity, "amenities")}
                >
                  <span className="text-sm">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "social",
      label: "Social Media",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={formData.socialMedia.instagram}
                onChange={(e) => handleNestedInputChange("socialMedia", "instagram", e.target.value)}
                placeholder="@yourrestaurant"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                value={formData.socialMedia.facebook}
                onChange={(e) => handleNestedInputChange("socialMedia", "facebook", e.target.value)}
                placeholder="facebook.com/yourrestaurant"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                value={formData.socialMedia.twitter}
                onChange={(e) => handleNestedInputChange("socialMedia", "twitter", e.target.value)}
                placeholder="@yourrestaurant"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtube">YouTube</Label>
              <Input
                id="youtube"
                value={formData.socialMedia.youtube}
                onChange={(e) => handleNestedInputChange("socialMedia", "youtube", e.target.value)}
                placeholder="youtube.com/c/yourrestaurant"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "hours",
      label: "Operating Hours",
      content: (
        <div className="space-y-4">
          {Object.entries(formData.hours).map(([day, hours]) => (
            <div key={day} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
              <div className="w-20">
                <span className="font-medium capitalize">{day}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={!hours.closed}
                  onCheckedChange={(checked) => handleHoursChange(day as keyof FormData["hours"], "closed", !checked)}
                />
                <span className="text-sm text-gray-600">Open</span>
              </div>
              {!hours.closed && (
                <>
                  <Input
                    type="time"
                    value={hours.open}
                    onChange={(e) => handleHoursChange(day as keyof FormData["hours"], "open", e.target.value)}
                    className="w-32"
                  />
                  <span className="text-gray-600">to</span>
                  <Input
                    type="time"
                    value={hours.close}
                    onChange={(e) => handleHoursChange(day as keyof FormData["hours"], "close", e.target.value)}
                    className="w-32"
                  />
                </>
              )}
              {hours.closed && <span className="text-gray-500 italic">Closed</span>}
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "story",
      label: "Story & Values",
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="story">Restaurant Story</Label>
            <Textarea
              id="story"
              value={formData.story}
              onChange={(e) => handleInputChange("story", e.target.value)}
              placeholder="Tell the story of your restaurant - how it started, your inspiration, journey..."
              className="min-h-[120px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="values">Values & Philosophy</Label>
            <Textarea
              id="values"
              value={formData.values}
              onChange={(e) => handleInputChange("values", e.target.value)}
              placeholder="What values drive your restaurant? Your cooking philosophy, commitment to quality..."
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="awards">Awards & Recognition</Label>
            <Textarea
              id="awards"
              value={formData.awards}
              onChange={(e) => handleInputChange("awards", e.target.value)}
              placeholder="Any awards, certifications, or recognition your restaurant has received..."
              className="min-h-[80px]"
            />
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Left Section */}
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <Button variant="ghost" size="sm" onClick={handleBack} className="p-1 sm:p-2 hover:bg-gray-100">
                <ArrowLeft className="w-4 h-4 text-black" />
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-sm sm:text-lg font-bold text-black truncate">Social Profile</h1>
                <p className="text-xs text-gray-600 hidden sm:block">Create your restaurant's digital identity</p>
              </div>
            </div>

            {/* Right Section - Responsive Button Layout */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Integration Status - Always visible */}
              <div className="flex items-center space-x-1 px-2 py-1 bg-blue-50 rounded-md border border-blue-200">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-blue-700 font-medium">{integrationProgress}%</span>
              </div>

              {/* Mobile: Stack buttons vertically in dropdown */}
              <div className="sm:hidden">
                <Button
                  onClick={() => setShowConfigModal(true)}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs px-2 py-1 h-8"
                >
                  {isGenerating ? (
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3" />
                  )}
                </Button>
              </div>

              {/* Desktop: Show all buttons */}
              <div className="hidden sm:flex items-center space-x-2">
                <Button
                  onClick={() => setShowConfigModal(true)}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-1" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3 mr-1" />
                      Generate Profile
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  variant="outline"
                  className="text-xs border-gray-300 bg-transparent"
                >
                  {isSaving ? (
                    <div className="w-3 h-3 border border-gray-600 border-t-transparent rounded-full animate-spin mr-1" />
                  ) : (
                    <Save className="w-3 h-3 mr-1" />
                  )}
                  Save
                </Button>

                <Button onClick={handlePreview} variant="outline" className="text-xs border-gray-300 bg-transparent">
                  <Eye className="w-3 h-3 mr-1" />
                  Preview
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Action Buttons Row */}
          <div className="sm:hidden pb-2">
            <div className="flex space-x-2">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                variant="outline"
                size="sm"
                className="flex-1 text-xs border-gray-300 bg-transparent"
              >
                {isSaving ? (
                  <div className="w-3 h-3 border border-gray-600 border-t-transparent rounded-full animate-spin mr-1" />
                ) : (
                  <Save className="w-3 h-3 mr-1" />
                )}
                Save
              </Button>

              <Button
                onClick={handlePreview}
                variant="outline"
                size="sm"
                className="flex-1 text-xs border-gray-300 bg-transparent"
              >
                <Eye className="w-3 h-3 mr-1" />
                Preview
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="pb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-black">Profile Completion</span>
              <span className="text-xs text-gray-600">{completionProgress}%</span>
            </div>
            <Progress value={completionProgress} className="h-1.5 bg-gray-200" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4">
        {/* Sync Data Section */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <Sync className="w-4 h-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base">Sync Menu and Reviews</CardTitle>
                  <CardDescription className="text-sm">
                    Automatically sync your menu items and customer reviews from connected platforms
                  </CardDescription>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-xs">
                <Sync className="w-3 h-3 mr-1" />
                Sync Now
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-blue-200">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Menu Items</p>
                  <p className="text-xs text-gray-600">Last synced: 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-blue-200">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-sm font-medium">Customer Reviews</p>
                  <p className="text-xs text-gray-600">3 new reviews pending</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="border-gray-200">
          <CardContent className="p-0">
            <MobileResponsiveTabs tabs={tabs} defaultTab="basic" />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={handleBack} className="border-gray-300 hover:bg-gray-50 bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {isOnboarding ? "Back to Setup" : "Back to Profile"}
          </Button>

          {isOnboarding && (
            <Button onClick={handleContinue} className="bg-black hover:bg-gray-800 text-white">
              Continue to Menu Manager
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      {/* Modals */}
      <AIProfileConfigModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        onGenerate={handleGenerateProfile}
        isGenerating={isGenerating}
      />

      <AISimplePreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        profileData={formData}
        onPublish={handlePublish}
      />
    </div>
  )
}
