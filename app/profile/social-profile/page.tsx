"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import {
  Upload,
  Camera,
  Star,
  Plus,
  X,
  Palette,
  Type,
  Volume2,
  Target,
  Award,
  ChefHat,
  Utensils,
  Coffee,
  Wifi,
  Car,
  CreditCard,
  Music,
  Baby,
  Dog,
  Accessibility,
  AirVent,
  Shield,
  CheckCircle,
  Globe,
  FolderSyncIcon as Sync,
  MessageSquare,
  RefreshCw,
  Gift,
  Calendar,
  Percent,
  Building,
  FileText,
  ExternalLink,
  Clock,
  Phone,
  Mail,
  MapPin,
  Trophy,
  Newspaper,
  User,
  BadgeIcon as Certificate,
  Loader2,
  Check,
  ChevronRight,
  Sparkles,
  Share2,
  ChevronLeft,
} from "lucide-react"

interface BrandAssets {
  logo: string | null
  primaryColor: string
  secondaryColor: string
  brandVoice: string
  brandPositioning: "casual" | "premium" | "family" | "trendy"
}

interface Details {
  legacy: {
    history: string
    story: string
  }
  highlights: {
    popularFor: string[]
    uniqueSellingPoints: string[]
  }
  recognition: {
    awards: string[]
    mediaCoverage: string[]
    rankings: string[]
  }
  chef: {
    name: string
    intro: string
    photo: string | null
  }
  certifications: {
    certificates: string[]
    licenses: string[]
    legalName: string
  }
}

interface MediaItem {
  id: string
  type: "image" | "video"
  url: string
  caption: string
  category: "food" | "restaurant" | "kitchen"
  isHero: boolean
}

interface Amenity {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  available: boolean
  isCustom: boolean
}

interface Tool {
  id: string
  name: string
  description: string
  enabled: boolean
  configured: boolean
  icon: React.ComponentType<{ className?: string }>
}

interface SyncSettings {
  menuManager: {
    enabled: boolean
    autoSync: boolean
    lastSync: string | null
  }
  reviewManager: {
    enabled: boolean
    autoSync: boolean
    lastSync: string | null
  }
}

interface ProfileState {
  isGenerated: boolean
  isSaved: boolean
  isPublished: boolean
  hasUnsavedChanges: boolean
  profileLink: string | null
  lastGenerated: string | null
  lastSaved: string | null
  lastPublished: string | null
  generatedWith: string | null
}

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

interface AIGenerationStep {
  id: string
  name: string
  description: string
  completed: boolean
  inProgress: boolean
  icon: React.ComponentType<{ className?: string }>
}

interface AIGenerationConfig {
  selectedPlatform: string
  sections: {
    basicInfo: { enabled: boolean; retainExisting: boolean }
    brandAssets: { enabled: boolean; retainExisting: boolean }
    details: { enabled: boolean; retainExisting: boolean }
    amenities: { enabled: boolean; retainExisting: boolean }
    media: { enabled: boolean; retainExisting: boolean }
  }
}

export default function SocialProfilePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const chefPhotoRef = useRef<HTMLInputElement>(null)
  const [activeTab, setActiveTab] = useState("basic")
  const [showPublicPreview, setShowPublicPreview] = useState(false)
  const [showAIModal, setShowAIModal] = useState(false)
  const [aiModalStep, setAiModalStep] = useState<"platform" | "sections" | "generating">("platform")
  const [isGenerating, setIsGenerating] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [activeImageCategory, setActiveImageCategory] = useState<"food" | "restaurant" | "kitchen">("food")
  const [aiConfig, setAiConfig] = useState<AIGenerationConfig>({
    selectedPlatform: "",
    sections: {
      basicInfo: { enabled: true, retainExisting: false },
      brandAssets: { enabled: true, retainExisting: false },
      details: { enabled: true, retainExisting: false },
      amenities: { enabled: true, retainExisting: false },
      media: { enabled: false, retainExisting: true },
    },
  })
  const [generationSteps, setGenerationSteps] = useState<AIGenerationStep[]>([
    {
      id: "connect",
      name: "Connecting to Platform",
      description: "Establishing connection with selected platform",
      completed: false,
      inProgress: false,
      icon: Globe,
    },
    {
      id: "fetch",
      name: "Fetching Data",
      description: "Retrieving restaurant information and reviews",
      completed: false,
      inProgress: false,
      icon: RefreshCw,
    },
    {
      id: "analyze",
      name: "Analyzing Content",
      description: "Processing data with AI algorithms",
      completed: false,
      inProgress: false,
      icon: Star,
    },
    {
      id: "generate",
      name: "Generating Content",
      description: "Creating optimized profile content",
      completed: false,
      inProgress: false,
      icon: Type,
    },
    {
      id: "optimize",
      name: "Optimizing Profile",
      description: "Fine-tuning for better visibility",
      completed: false,
      inProgress: false,
      icon: Target,
    },
  ])

  // Profile State Management
  const [profileState, setProfileState] = useState<ProfileState>({
    isGenerated: false,
    isSaved: false,
    isPublished: false,
    hasUnsavedChanges: false,
    profileLink: null,
    lastGenerated: null,
    lastSaved: null,
    lastPublished: null,
    generatedWith: null,
  })

  // Connected Integrations
  const connectedPlatforms = [
    { id: "google", name: "Google My Business", connected: true, reviews: 89, rating: 4.3 },
    { id: "zomato", name: "Zomato", connected: true, reviews: 45, rating: 4.1 },
    { id: "swiggy", name: "Swiggy", connected: true, reviews: 22, rating: 4.0 },
    { id: "facebook", name: "Facebook", connected: true, reviews: 34, rating: 4.2 },
    { id: "instagram", name: "Instagram", connected: true, reviews: 0, rating: 0 },
    { id: "petpooja", name: "PetPooja POS", connected: true, reviews: 0, rating: 0 },
  ]

  // Form data
  const [basicInfo, setBasicInfo] = useState({
    name: "Bella Vista Restaurant",
    cuisine: "Italian, Mediterranean",
    description:
      "Authentic Italian cuisine with a modern twist, featuring fresh ingredients and traditional recipes passed down through generations.",
    priceRange: "$$",
    phone: "+91 98765 43210",
    email: "info@bellavista.com",
    website: "www.bellavista.com",
    address: "123 MG Road, Bangalore, Karnataka 560001",
    tagline: "Authentic Italian flavors in the heart of Bangalore",
  })

  const [brandAssets, setBrandAssets] = useState<BrandAssets>({
    logo: null,
    primaryColor: "#1f2937",
    secondaryColor: "#6b7280",
    brandVoice: "Warm, authentic, and passionate about Italian culinary traditions",
    brandPositioning: "casual",
  })

  const [details, setDetails] = useState<Details>({
    legacy: {
      history:
        "Founded in 1995 by Chef Marco Rossi, Bella Vista brings the authentic flavors of Tuscany to Bangalore. Our family recipes have been perfected over three generations.",
      story:
        "Born from a dream to bring authentic Italian flavors to India, Bella Vista Restaurant was established with recipes passed down through three generations of Italian culinary masters.",
    },
    highlights: {
      popularFor: ["Wood-fired Pizza", "Handmade Pasta", "Romantic Ambiance"],
      uniqueSellingPoints: [
        "Only restaurant in Bangalore using imported Italian ingredients",
        "Traditional wood-fired oven imported from Naples",
        "Family recipes from three generations",
      ],
    },
    recognition: {
      awards: ["Best Italian Restaurant 2023", "Excellence in Service Award 2022"],
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
      certificates: ["FSSAI License", "Fire Safety Certificate"],
      licenses: ["Liquor License", "Music License"],
      legalName: "Bella Vista Restaurant Private Limited",
    },
  })

  const [operatingHours, setOperatingHours] = useState({
    monday: { open: "11:00", close: "23:00", closed: false },
    tuesday: { open: "11:00", close: "23:00", closed: false },
    wednesday: { open: "11:00", close: "23:00", closed: false },
    thursday: { open: "11:00", close: "23:00", closed: false },
    friday: { open: "11:00", close: "24:00", closed: false },
    saturday: { open: "11:00", close: "24:00", closed: false },
    sunday: { open: "12:00", close: "22:00", closed: false },
  })

  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    {
      id: "1",
      type: "image",
      url: "/placeholder.svg?height=300&width=400&text=Cozy+Interior",
      caption: "Cozy dining atmosphere",
      category: "restaurant",
      isHero: true,
    },
    {
      id: "2",
      type: "image",
      url: "/placeholder.svg?height=300&width=400&text=Margherita+Pizza",
      caption: "Our signature Margherita pizza",
      category: "food",
      isHero: false,
    },
    {
      id: "3",
      type: "image",
      url: "/placeholder.svg?height=300&width=400&text=Kitchen+View",
      caption: "Our open kitchen",
      category: "kitchen",
      isHero: false,
    },
  ])

  const [amenities, setAmenities] = useState<Amenity[]>([
    { id: "1", name: "Free WiFi", icon: Wifi, available: true, isCustom: false },
    { id: "2", name: "Parking Available", icon: Car, available: true, isCustom: false },
    { id: "3", name: "Card Payments", icon: CreditCard, available: true, isCustom: false },
    { id: "4", name: "Live Music", icon: Music, available: false, isCustom: false },
    { id: "5", name: "Kid Friendly", icon: Baby, available: true, isCustom: false },
    { id: "6", name: "Pet Friendly", icon: Dog, available: false, isCustom: false },
    { id: "7", name: "Wheelchair Accessible", icon: Accessibility, available: true, isCustom: false },
    { id: "8", name: "Air Conditioned", icon: AirVent, available: true, isCustom: false },
    { id: "9", name: "Private Dining", icon: Shield, available: true, isCustom: false },
    { id: "10", name: "Outdoor Seating", icon: Coffee, available: false, isCustom: false },
  ])

  const [tools, setTools] = useState<Tool[]>([
    {
      id: "loyalty",
      name: "Loyalty Program",
      description: "Reward your regular customers with points and offers",
      enabled: false,
      configured: false,
      icon: Gift,
    },
    {
      id: "reservation",
      name: "Reservation System",
      description: "Allow customers to book tables online",
      enabled: false,
      configured: false,
      icon: Calendar,
    },
    {
      id: "offers",
      name: "Special Offers",
      description: "Create and manage promotional offers",
      enabled: true,
      configured: true,
      icon: Percent,
    },
  ])

  const [syncSettings, setSyncSettings] = useState<SyncSettings>({
    menuManager: {
      enabled: true,
      autoSync: true,
      lastSync: "2024-01-15T10:30:00Z",
    },
    reviewManager: {
      enabled: true,
      autoSync: false,
      lastSync: "2024-01-14T15:45:00Z",
    },
  })

  const [newAmenity, setNewAmenity] = useState("")
  const [newHighlight, setNewHighlight] = useState("")
  const [newUSP, setNewUSP] = useState("")
  const [newAward, setNewAward] = useState("")
  const [newMedia, setNewMedia] = useState("")
  const [newCertificate, setNewCertificate] = useState("")

  // Track changes to enable save button
  const markAsChanged = () => {
    if (!profileState.hasUnsavedChanges) {
      setProfileState((prev) => ({ ...prev, hasUnsavedChanges: true }))
    }
  }

  // Load saved profile state on component mount
  useEffect(() => {
    const savedState = localStorage.getItem("social-profile-state")
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState)
        setProfileState(parsed)
      } catch (error) {
        console.error("Failed to load profile state:", error)
      }
    }

    const savedProfile = localStorage.getItem("social-profile-data")
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile)
        if (parsed.basicInfo) setBasicInfo(parsed.basicInfo)
        if (parsed.brandAssets) setBrandAssets(parsed.brandAssets)
        if (parsed.details) setDetails(parsed.details)
        if (parsed.operatingHours) setOperatingHours(parsed.operatingHours)
        if (parsed.mediaItems) setMediaItems(parsed.mediaItems)
        if (parsed.amenities) setAmenities(parsed.amenities)
        if (parsed.tools) setTools(parsed.tools)
        if (parsed.syncSettings) setSyncSettings(parsed.syncSettings)
      } catch (error) {
        console.error("Failed to load profile data:", error)
      }
    }
  }, [])

  // Save profile data to localStorage
  const saveProfileData = () => {
    const profileData = {
      basicInfo,
      brandAssets,
      details,
      operatingHours,
      mediaItems,
      amenities,
      tools,
      syncSettings,
    }
    localStorage.setItem("social-profile-data", JSON.stringify(profileData))
  }

  // Save profile state to localStorage
  const saveProfileState = (newState: Partial<ProfileState>) => {
    const updatedState = { ...profileState, ...newState }
    setProfileState(updatedState)
    localStorage.setItem("social-profile-state", JSON.stringify(updatedState))
  }

  // Generate public profile data for preview
  const generatePublicProfileData = (): PublicProfileData => {
    const heroImage =
      mediaItems.find((item) => item.isHero)?.url ||
      mediaItems[0]?.url ||
      "/placeholder.svg?height=400&width=800&text=Restaurant+Hero"

    return {
      restaurantName: basicInfo.name,
      tagline: basicInfo.tagline,
      description: basicInfo.description,
      cuisine: basicInfo.cuisine,
      priceRange: basicInfo.priceRange,
      address: basicInfo.address,
      phone: basicInfo.phone,
      email: basicInfo.email,
      website: basicInfo.website,
      brandColors: {
        primary: brandAssets.primaryColor,
        secondary: brandAssets.secondaryColor,
      },
      hours: operatingHours,
      heroImage,
      mediaAssets: {
        foodPhotos: mediaItems.filter((item) => item.category === "food").map((item) => item.url),
        restaurantPhotos: mediaItems.filter((item) => item.category === "restaurant").map((item) => item.url),
        kitchenPhotos: mediaItems.filter((item) => item.category === "kitchen").map((item) => item.url),
      },
      highlights: details.highlights.popularFor,
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
        name: details.chef.name,
        intro: details.chef.intro,
        photo: details.chef.photo || "/placeholder.svg?height=200&width=200&text=Chef+Photo",
      },
      amenities: amenities.filter((a) => a.available).map((a) => a.name),
      legacy: {
        story: details.legacy.story,
        awards: details.recognition.awards,
        recognition: details.recognition.rankings,
        pressCoverage: details.recognition.mediaCoverage,
      },
      loyaltyProgram: {
        enabled: tools.find((t) => t.id === "loyalty")?.enabled || false,
        name: "Bella Vista Rewards",
        description: "Earn points with every visit and unlock exclusive rewards",
      },
      reservationEnabled: tools.find((t) => t.id === "reservation")?.enabled || false,
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
    }
  }

  // Mobile responsive tabs configuration
  const tabsConfig = [
    {
      id: "basic",
      label: "Basic Info",
      content: (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-black text-lg">
              <Building className="w-5 h-5 mr-2" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name" className="text-black text-sm font-medium">
                  Restaurant Name *
                </Label>
                <Input
                  id="name"
                  value={basicInfo.name}
                  onChange={(e) => {
                    setBasicInfo((prev) => ({ ...prev, name: e.target.value }))
                    markAsChanged()
                  }}
                  className="bg-white border-gray-300 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="cuisine" className="text-black text-sm font-medium">
                  Cuisine Type *
                </Label>
                <Input
                  id="cuisine"
                  value={basicInfo.cuisine}
                  onChange={(e) => {
                    setBasicInfo((prev) => ({ ...prev, cuisine: e.target.value }))
                    markAsChanged()
                  }}
                  className="bg-white border-gray-300 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="tagline" className="text-black text-sm font-medium">
                  Tagline
                </Label>
                <Input
                  id="tagline"
                  value={basicInfo.tagline}
                  onChange={(e) => {
                    setBasicInfo((prev) => ({ ...prev, tagline: e.target.value }))
                    markAsChanged()
                  }}
                  placeholder="A catchy tagline for your restaurant"
                  className="bg-white border-gray-300 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-black text-sm font-medium">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  value={basicInfo.description}
                  onChange={(e) => {
                    setBasicInfo((prev) => ({ ...prev, description: e.target.value }))
                    markAsChanged()
                  }}
                  rows={4}
                  className="bg-white border-gray-300 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-black text-sm font-medium">
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  value={basicInfo.phone}
                  onChange={(e) => {
                    setBasicInfo((prev) => ({ ...prev, phone: e.target.value }))
                    markAsChanged()
                  }}
                  className="bg-white border-gray-300 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-black text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={basicInfo.email}
                  onChange={(e) => {
                    setBasicInfo((prev) => ({ ...prev, email: e.target.value }))
                    markAsChanged()
                  }}
                  className="bg-white border-gray-300 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="address" className="text-black text-sm font-medium">
                  Address *
                </Label>
                <Textarea
                  id="address"
                  value={basicInfo.address}
                  onChange={(e) => {
                    setBasicInfo((prev) => ({ ...prev, address: e.target.value }))
                    markAsChanged()
                  }}
                  rows={2}
                  className="bg-white border-gray-300 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="website" className="text-black text-sm font-medium">
                  Website
                </Label>
                <Input
                  id="website"
                  value={basicInfo.website}
                  onChange={(e) => {
                    setBasicInfo((prev) => ({ ...prev, website: e.target.value }))
                    markAsChanged()
                  }}
                  className="bg-white border-gray-300 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="priceRange" className="text-black text-sm font-medium">
                  Price Range
                </Label>
                <Select
                  value={basicInfo.priceRange}
                  onValueChange={(value) => {
                    setBasicInfo((prev) => ({ ...prev, priceRange: value }))
                    markAsChanged()
                  }}
                >
                  <SelectTrigger className="bg-white border-gray-300 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="$">$ - Budget Friendly</SelectItem>
                    <SelectItem value="$$">$$ - Moderate</SelectItem>
                    <SelectItem value="$$$">$$$ - Expensive</SelectItem>
                    <SelectItem value="$$$$">$$$$ - Very Expensive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      id: "brand",
      label: "Brand Assets",
      content: (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-black text-lg">
              <Palette className="w-5 h-5 mr-2" />
              Brand Assets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Logo Upload */}
            <div>
              <Label className="text-black mb-2 block text-sm font-medium">Logo</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                {brandAssets.logo ? (
                  <div className="relative">
                    <img
                      src={brandAssets.logo || "/placeholder.svg"}
                      alt="Logo"
                      className="mx-auto h-16 object-contain"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setBrandAssets((prev) => ({ ...prev, logo: null }))
                        markAsChanged()
                      }}
                      className="mt-2 bg-white text-xs"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-2 text-sm">Upload your restaurant logo</p>
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white border-gray-300 text-sm"
                      size="sm"
                    >
                      Choose File
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Brand Colors */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="primaryColor" className="text-black text-sm font-medium">
                  Primary Color
                </Label>
                <div className="flex items-center space-x-2 mt-1">
                  <input
                    type="color"
                    id="primaryColor"
                    value={brandAssets.primaryColor}
                    onChange={(e) => {
                      setBrandAssets((prev) => ({ ...prev, primaryColor: e.target.value }))
                      markAsChanged()
                    }}
                    className="w-10 h-10 border border-gray-300 rounded"
                  />
                  <Input
                    value={brandAssets.primaryColor}
                    onChange={(e) => {
                      setBrandAssets((prev) => ({ ...prev, primaryColor: e.target.value }))
                      markAsChanged()
                    }}
                    className="bg-white border-gray-300 flex-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="secondaryColor" className="text-black text-sm font-medium">
                  Secondary Color
                </Label>
                <div className="flex items-center space-x-2 mt-1">
                  <input
                    type="color"
                    id="secondaryColor"
                    value={brandAssets.secondaryColor}
                    onChange={(e) => {
                      setBrandAssets((prev) => ({ ...prev, secondaryColor: e.target.value }))
                      markAsChanged()
                    }}
                    className="w-10 h-10 border border-gray-300 rounded"
                  />
                  <Input
                    value={brandAssets.secondaryColor}
                    onChange={(e) => {
                      setBrandAssets((prev) => ({ ...prev, secondaryColor: e.target.value }))
                      markAsChanged()
                    }}
                    className="bg-white border-gray-300 flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Brand Voice */}
            <div>
              <Label htmlFor="brandVoice" className="text-black flex items-center text-sm font-medium">
                <Volume2 className="w-4 h-4 mr-1" />
                Brand Voice
              </Label>
              <Textarea
                id="brandVoice"
                value={brandAssets.brandVoice}
                onChange={(e) => {
                  setBrandAssets((prev) => ({ ...prev, brandVoice: e.target.value }))
                  markAsChanged()
                }}
                placeholder="Describe your restaurant's personality and tone of communication"
                rows={3}
                className="bg-white border-gray-300 mt-1"
              />
            </div>

            {/* Brand Positioning */}
            <div>
              <Label className="text-black flex items-center text-sm font-medium mb-2">
                <Target className="w-4 h-4 mr-1" />
                Brand Positioning
              </Label>
              <Select
                value={brandAssets.brandPositioning}
                onValueChange={(value: "casual" | "premium" | "family" | "trendy") => {
                  setBrandAssets((prev) => ({ ...prev, brandPositioning: value }))
                  markAsChanged()
                }}
              >
                <SelectTrigger className="bg-white border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casual">Casual & Approachable</SelectItem>
                  <SelectItem value="premium">Premium & Upscale</SelectItem>
                  <SelectItem value="family">Family-Friendly</SelectItem>
                  <SelectItem value="trendy">Trendy & Modern</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      id: "details",
      label: "Details",
      content: (
        <div className="space-y-6">
          {/* Legacy Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-black text-lg">
                <Type className="w-5 h-5 mr-2" />
                Legacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="history" className="text-black text-sm font-medium">
                  History
                </Label>
                <Textarea
                  id="history"
                  value={details.legacy.history}
                  onChange={(e) => {
                    setDetails((prev) => ({
                      ...prev,
                      legacy: { ...prev.legacy, history: e.target.value },
                    }))
                    markAsChanged()
                  }}
                  placeholder="Tell the history of your restaurant"
                  rows={4}
                  className="bg-white border-gray-300 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="story" className="text-black text-sm font-medium">
                  Story
                </Label>
                <Textarea
                  id="story"
                  value={details.legacy.story}
                  onChange={(e) => {
                    setDetails((prev) => ({
                      ...prev,
                      legacy: { ...prev.legacy, story: e.target.value },
                    }))
                    markAsChanged()
                  }}
                  placeholder="Share your restaurant's story"
                  rows={4}
                  className="bg-white border-gray-300 mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Highlights Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-black text-lg">
                <Star className="w-5 h-5 mr-2" />
                Highlights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-black text-sm font-medium mb-2 block">Popular For</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {details.highlights.popularFor.map((item, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-50 border-gray-300 text-xs">
                      {item}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setDetails((prev) => ({
                            ...prev,
                            highlights: {
                              ...prev.highlights,
                              popularFor: prev.highlights.popularFor.filter((_, i) => i !== index),
                            },
                          }))
                          markAsChanged()
                        }}
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
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && newHighlight.trim()) {
                        setDetails((prev) => ({
                          ...prev,
                          highlights: {
                            ...prev.highlights,
                            popularFor: [...prev.highlights.popularFor, newHighlight.trim()],
                          },
                        }))
                        setNewHighlight("")
                        markAsChanged()
                      }
                    }}
                    className="bg-white border-gray-300 flex-1"
                  />
                  <Button
                    onClick={() => {
                      if (newHighlight.trim()) {
                        setDetails((prev) => ({
                          ...prev,
                          highlights: {
                            ...prev.highlights,
                            popularFor: [...prev.highlights.popularFor, newHighlight.trim()],
                          },
                        }))
                        setNewHighlight("")
                        markAsChanged()
                      }
                    }}
                    variant="outline"
                    className="bg-white border-gray-300"
                    size="sm"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-black text-sm font-medium mb-2 block">Unique Selling Points</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {details.highlights.uniqueSellingPoints.map((usp, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-50 border-gray-300 text-xs">
                      {usp}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setDetails((prev) => ({
                            ...prev,
                            highlights: {
                              ...prev.highlights,
                              uniqueSellingPoints: prev.highlights.uniqueSellingPoints.filter((_, i) => i !== index),
                            },
                          }))
                          markAsChanged()
                        }}
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
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && newUSP.trim()) {
                        setDetails((prev) => ({
                          ...prev,
                          highlights: {
                            ...prev.highlights,
                            uniqueSellingPoints: [...prev.highlights.uniqueSellingPoints, newUSP.trim()],
                          },
                        }))
                        setNewUSP("")
                        markAsChanged()
                      }
                    }}
                    className="bg-white border-gray-300 flex-1"
                  />
                  <Button
                    onClick={() => {
                      if (newUSP.trim()) {
                        setDetails((prev) => ({
                          ...prev,
                          highlights: {
                            ...prev.highlights,
                            uniqueSellingPoints: [...prev.highlights.uniqueSellingPoints, newUSP.trim()],
                          },
                        }))
                        setNewUSP("")
                        markAsChanged()
                      }
                    }}
                    variant="outline"
                    className="bg-white border-gray-300"
                    size="sm"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recognition Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-black text-lg">
                <Trophy className="w-5 h-5 mr-2" />
                Recognition
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-black text-sm font-medium mb-2 block">Awards</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {details.recognition.awards.map((award, index) => (
                    <Badge key={index} variant="outline" className="bg-yellow-50 border-yellow-300 text-xs">
                      <Award className="w-3 h-3 mr-1" />
                      {award}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setDetails((prev) => ({
                            ...prev,
                            recognition: {
                              ...prev.recognition,
                              awards: prev.recognition.awards.filter((_, i) => i !== index),
                            },
                          }))
                          markAsChanged()
                        }}
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
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && newAward.trim()) {
                        setDetails((prev) => ({
                          ...prev,
                          recognition: {
                            ...prev.recognition,
                            awards: [...prev.recognition.awards, newAward.trim()],
                          },
                        }))
                        setNewAward("")
                        markAsChanged()
                      }
                    }}
                    className="bg-white border-gray-300 flex-1"
                  />
                  <Button
                    onClick={() => {
                      if (newAward.trim()) {
                        setDetails((prev) => ({
                          ...prev,
                          recognition: {
                            ...prev.recognition,
                            awards: [...prev.recognition.awards, newAward.trim()],
                          },
                        }))
                        setNewAward("")
                        markAsChanged()
                      }
                    }}
                    variant="outline"
                    className="bg-white border-gray-300"
                    size="sm"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-black text-sm font-medium mb-2 block">Media Coverage</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {details.recognition.mediaCoverage.map((media, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-50 border-gray-300 text-xs">
                      <Newspaper className="w-3 h-3 mr-1" />
                      {media}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setDetails((prev) => ({
                            ...prev,
                            recognition: {
                              ...prev.recognition,
                              mediaCoverage: prev.recognition.mediaCoverage.filter((_, i) => i !== index),
                            },
                          }))
                          markAsChanged()
                        }}
                        className="ml-1 h-auto p-0 hover:bg-transparent"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    value={newMedia}
                    onChange={(e) => setNewMedia(e.target.value)}
                    placeholder="Add media coverage"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && newMedia.trim()) {
                        setDetails((prev) => ({
                          ...prev,
                          recognition: {
                            ...prev.recognition,
                            mediaCoverage: [...prev.recognition.mediaCoverage, newMedia.trim()],
                          },
                        }))
                        setNewMedia("")
                        markAsChanged()
                      }
                    }}
                    className="bg-white border-gray-300 flex-1"
                  />
                  <Button
                    onClick={() => {
                      if (newMedia.trim()) {
                        setDetails((prev) => ({
                          ...prev,
                          recognition: {
                            ...prev.recognition,
                            mediaCoverage: [...prev.recognition.mediaCoverage, newMedia.trim()],
                          },
                        }))
                        setNewMedia("")
                        markAsChanged()
                      }
                    }}
                    variant="outline"
                    className="bg-white border-gray-300"
                    size="sm"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-black text-sm font-medium mb-2 block">Rankings</Label>
                <div className="space-y-2">
                  {details.recognition.rankings.map((ranking, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                      <span className="text-sm">{ranking}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setDetails((prev) => ({
                            ...prev,
                            recognition: {
                              ...prev.recognition,
                              rankings: prev.recognition.rankings.filter((_, i) => i !== index),
                            },
                          }))
                          markAsChanged()
                        }}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chef Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-black text-lg">
                <ChefHat className="w-5 h-5 mr-2" />
                Chef
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="chefName" className="text-black text-sm font-medium">
                  Chef Name
                </Label>
                <Input
                  id="chefName"
                  value={details.chef.name}
                  onChange={(e) => {
                    setDetails((prev) => ({
                      ...prev,
                      chef: { ...prev.chef, name: e.target.value },
                    }))
                    markAsChanged()
                  }}
                  className="bg-white border-gray-300 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="chefIntro" className="text-black text-sm font-medium">
                  Chef Introduction
                </Label>
                <Textarea
                  id="chefIntro"
                  value={details.chef.intro}
                  onChange={(e) => {
                    setDetails((prev) => ({
                      ...prev,
                      chef: { ...prev.chef, intro: e.target.value },
                    }))
                    markAsChanged()
                  }}
                  placeholder="Brief introduction about the chef"
                  rows={4}
                  className="bg-white border-gray-300 mt-1"
                />
              </div>
              <div>
                <Label className="text-black mb-2 block text-sm font-medium">Chef Photo</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {details.chef.photo ? (
                    <div className="relative">
                      <img
                        src={details.chef.photo || "/placeholder.svg"}
                        alt="Chef"
                        className="mx-auto h-24 w-24 object-cover rounded-full"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setDetails((prev) => ({
                            ...prev,
                            chef: { ...prev.chef, photo: null },
                          }))
                          markAsChanged()
                        }}
                        className="mt-2 bg-white text-xs"
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <User className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 mb-2 text-sm">Upload chef photo</p>
                      <Button
                        variant="outline"
                        onClick={() => chefPhotoRef.current?.click()}
                        className="bg-white border-gray-300 text-sm"
                        size="sm"
                      >
                        Choose File
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certifications Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-black text-lg">
                <Certificate className="w-5 h-5 mr-2" />
                Certifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="legalName" className="text-black text-sm font-medium">
                  Legal Name
                </Label>
                <Input
                  id="legalName"
                  value={details.certifications.legalName}
                  onChange={(e) => {
                    setDetails((prev) => ({
                      ...prev,
                      certifications: { ...prev.certifications, legalName: e.target.value },
                    }))
                    markAsChanged()
                  }}
                  className="bg-white border-gray-300 mt-1"
                />
              </div>
              <div>
                <Label className="text-black text-sm font-medium mb-2 block">Certificates</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {details.certifications.certificates.map((cert, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-50 border-gray-300 text-xs">
                      <FileText className="w-3 h-3 mr-1" />
                      {cert}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setDetails((prev) => ({
                            ...prev,
                            certifications: {
                              ...prev.certifications,
                              certificates: prev.certifications.certificates.filter((_, i) => i !== index),
                            },
                          }))
                          markAsChanged()
                        }}
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
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && newCertificate.trim()) {
                        setDetails((prev) => ({
                          ...prev,
                          certifications: {
                            ...prev.certifications,
                            certificates: [...prev.certifications.certificates, newCertificate.trim()],
                          },
                        }))
                        setNewCertificate("")
                        markAsChanged()
                      }
                    }}
                    className="bg-white border-gray-300 flex-1"
                  />
                  <Button
                    onClick={() => {
                      if (newCertificate.trim()) {
                        setDetails((prev) => ({
                          ...prev,
                          certifications: {
                            ...prev.certifications,
                            certificates: [...prev.certifications.certificates, newCertificate.trim()],
                          },
                        }))
                        setNewCertificate("")
                        markAsChanged()
                      }
                    }}
                    variant="outline"
                    className="bg-white border-gray-300"
                    size="sm"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-black text-sm font-medium mb-2 block">Licenses</Label>
                <div className="space-y-2">
                  {details.certifications.licenses.map((license, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                      <span className="text-sm">{license}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setDetails((prev) => ({
                            ...prev,
                            certifications: {
                              ...prev.certifications,
                              licenses: prev.certifications.licenses.filter((_, i) => i !== index),
                            },
                          }))
                          markAsChanged()
                        }}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      id: "timing",
      label: "Timing",
      content: (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-black text-lg">
              <Clock className="w-5 h-5 mr-2" />
              Operating Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(operatingHours).map(([day, hours]) => (
                <div key={day} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-black capitalize text-sm">{day}</span>
                    <Checkbox
                      checked={!hours.closed}
                      onCheckedChange={(checked) => {
                        setOperatingHours((prev) => ({
                          ...prev,
                          [day]: { ...prev[day], closed: !checked },
                        }))
                        markAsChanged()
                      }}
                    />
                  </div>
                  {!hours.closed && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-gray-600">Open</Label>
                        <Input
                          type="time"
                          value={hours.open}
                          onChange={(e) => {
                            setOperatingHours((prev) => ({
                              ...prev,
                              [day]: { ...prev[day], open: e.target.value },
                            }))
                            markAsChanged()
                          }}
                          className="bg-white border-gray-300 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600">Close</Label>
                        <Input
                          type="time"
                          value={hours.close}
                          onChange={(e) => {
                            setOperatingHours((prev) => ({
                              ...prev,
                              [day]: { ...prev[day], close: e.target.value },
                            }))
                            markAsChanged()
                          }}
                          className="bg-white border-gray-300 text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      id: "amenities",
      label: "Amenities",
      content: (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-black text-lg">
                <Utensils className="w-5 h-5 mr-2" />
                Amenities & Features
              </CardTitle>
              <Button
                onClick={() => {
                  if (newAmenity.trim()) {
                    const newAmenityItem: Amenity = {
                      id: Date.now().toString(),
                      name: newAmenity.trim(),
                      icon: CheckCircle,
                      available: true,
                      isCustom: true,
                    }
                    setAmenities((prev) => [...prev, newAmenityItem])
                    setNewAmenity("")
                    markAsChanged()
                  }
                }}
                variant="outline"
                size="sm"
                className="bg-white border-gray-300"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Custom
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2 mb-4">
              <Input
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="Add custom amenity"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && newAmenity.trim()) {
                    const newAmenityItem: Amenity = {
                      id: Date.now().toString(),
                      name: newAmenity.trim(),
                      icon: CheckCircle,
                      available: true,
                      isCustom: true,
                    }
                    setAmenities((prev) => [...prev, newAmenityItem])
                    setNewAmenity("")
                    markAsChanged()
                  }
                }}
                className="bg-white border-gray-300 flex-1"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {amenities.map((amenity) => (
                <div
                  key={amenity.id}
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${
                    amenity.available ? "border-gray-400 bg-gray-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setAmenities((prev) =>
                      prev.map((a) => (a.id === amenity.id ? { ...a, available: !a.available } : a)),
                    )
                    markAsChanged()
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <amenity.icon className={`w-4 h-4 ${amenity.available ? "text-gray-700" : "text-gray-400"}`} />
                      <span className={`text-sm font-medium ${amenity.available ? "text-gray-900" : "text-gray-600"}`}>
                        {amenity.name}
                      </span>
                      {amenity.isCustom && (
                        <Badge variant="outline" className="text-xs">
                          Custom
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {amenity.available && <CheckCircle className="w-4 h-4 text-gray-700" />}
                      {amenity.isCustom && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setAmenities((prev) => prev.filter((a) => a.id !== amenity.id))
                            markAsChanged()
                          }}
                          className="text-red-600 hover:bg-red-50 p-1"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      id: "media",
      label: "Media",
      content: (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-black text-lg">
              <Camera className="w-5 h-5 mr-2" />
              Media Assets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-black hover:bg-gray-800 text-white w-full sm:w-auto"
                size="sm"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Photos
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onload = (e) => {
                      const newMedia: MediaItem = {
                        id: Date.now().toString(),
                        type: file.type.startsWith("video/") ? "video" : "image",
                        url: e.target?.result as string,
                        caption: "",
                        category: "food",
                        isHero: false,
                      }
                      setMediaItems((prev) => [...prev, newMedia])
                      markAsChanged()
                    }
                    reader.readAsDataURL(file)
                    toast({
                      title: "Media uploaded successfully",
                      description: "Your image has been added to the media gallery",
                    })
                  }
                }}
                className="hidden"
                multiple
              />
            </div>

            {/* Category Tabs */}
            <div className="flex space-x-2 mb-4">
              {["food", "restaurant", "kitchen"].map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  size="sm"
                  className={`capitalize ${
                    mediaItems.filter((item) => item.category === category).length > 0
                      ? "bg-gray-50 border-gray-400 text-gray-700"
                      : "bg-white border-gray-300"
                  }`}
                >
                  {category} ({mediaItems.filter((item) => item.category === category).length})
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {mediaItems.map((item) => (
                <div key={item.id} className="relative group">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={item.url || "/placeholder.svg"}
                      alt={item.caption}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setMediaItems((prev) =>
                            prev.map((m) => (m.id === item.id ? { ...m, isHero: !m.isHero } : { ...m, isHero: false })),
                          )
                          markAsChanged()
                        }}
                        className={`text-xs ${item.isHero ? "bg-yellow-500 text-white" : "bg-white"}`}
                      >
                        {item.isHero ? "Hero" : "Set Hero"}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setMediaItems((prev) => prev.filter((m) => m.id !== item.id))
                          markAsChanged()
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="absolute top-1 left-1 flex space-x-1">
                    <Badge className="bg-black text-white text-xs">{item.category}</Badge>
                    {item.isHero && <Badge className="bg-yellow-500 text-white text-xs">Hero</Badge>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      id: "sync",
      label: "Sync",
      content: (
        <div className="space-y-6">
          {/* Menu Manager Sync */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-black text-lg">
                <Utensils className="w-5 h-5 mr-2" />
                Menu Manager Sync
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-black">Sync Menu Data</h3>
                  <p className="text-sm text-gray-600">Import menu items from your menu manager</p>
                </div>
                <Switch
                  checked={syncSettings.menuManager.enabled}
                  onCheckedChange={(checked) => {
                    setSyncSettings((prev) => ({
                      ...prev,
                      menuManager: { ...prev.menuManager, enabled: checked },
                    }))
                    markAsChanged()
                  }}
                />
              </div>
              {syncSettings.menuManager.enabled && (
                <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Auto-sync when menu changes</span>
                    <Switch
                      checked={syncSettings.menuManager.autoSync}
                      onCheckedChange={(checked) => {
                        setSyncSettings((prev) => ({
                          ...prev,
                          menuManager: { ...prev.menuManager, autoSync: checked },
                        }))
                        markAsChanged()
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Last sync: {syncSettings.menuManager.lastSync ? "Jan 15, 2024 10:30 AM" : "Never"}
                    </span>
                    <Button variant="outline" size="sm" className="bg-white">
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Sync Now
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Review Manager Sync */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-black text-lg">
                <MessageSquare className="w-5 h-5 mr-2" />
                Review Manager Sync
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-black">Sync Review Data</h3>
                  <p className="text-sm text-gray-600">Import reviews from connected platforms</p>
                </div>
                <Switch
                  checked={syncSettings.reviewManager.enabled}
                  onCheckedChange={(checked) => {
                    setSyncSettings((prev) => ({
                      ...prev,
                      reviewManager: { ...prev.reviewManager, enabled: checked },
                    }))
                    markAsChanged()
                  }}
                />
              </div>
              {syncSettings.reviewManager.enabled && (
                <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Auto-sync when reviews change</span>
                    <Switch
                      checked={syncSettings.reviewManager.autoSync}
                      onCheckedChange={(checked) => {
                        setSyncSettings((prev) => ({
                          ...prev,
                          reviewManager: { ...prev.reviewManager, autoSync: checked },
                        }))
                        markAsChanged()
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Last sync: {syncSettings.reviewManager.lastSync ? "Jan 14, 2024 3:45 PM" : "Never"}
                    </span>
                    <Button variant="outline" size="sm" className="bg-white">
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Sync Now
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Connected Platforms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-black text-lg">
                <Globe className="w-5 h-5 mr-2" />
                Connected Platforms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {connectedPlatforms.map((platform) => (
                  <div key={platform.id} className="flex items-center justify-between p-2 bg-white rounded border">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-gray-700" />
                      <span className="text-sm font-medium">{platform.name}</span>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs bg-transparent">
                      <Sync className="w-3 h-3 mr-1" />
                      Sync
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      id: "tools",
      label: "Tools",
      content: (
        <div className="space-y-6">
          {tools.map((tool) => (
            <Card key={tool.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <tool.icon className="w-5 h-5 text-gray-700" />
                    <div>
                      <CardTitle className="text-black text-lg">{tool.name}</CardTitle>
                      <p className="text-sm text-gray-600">{tool.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {tool.configured && <Badge className="bg-gray-100 text-gray-800 text-xs">Configured</Badge>}
                    <Switch
                      checked={tool.enabled}
                      onCheckedChange={(checked) => {
                        setTools((prev) => prev.map((t) => (t.id === tool.id ? { ...t, enabled: checked } : t)))
                        markAsChanged()
                      }}
                    />
                  </div>
                </div>
              </CardHeader>
              {tool.enabled && (
                <CardContent>
                  {tool.id === "loyalty" && (
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Loyalty Program Settings</h4>
                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm font-medium text-gray-800">Program Name</Label>
                            <Input placeholder="e.g., Bella Vista Rewards" className="bg-white border-gray-300 mt-1" />
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-800">Points per ₹1 spent</Label>
                            <Input type="number" placeholder="1" className="bg-white border-gray-300 mt-1" />
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-800">Reward threshold</Label>
                            <Input type="number" placeholder="100 points" className="bg-white border-gray-300 mt-1" />
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          setTools((prev) => prev.map((t) => (t.id === tool.id ? { ...t, configured: true } : t)))
                          markAsChanged()
                        }}
                        className="bg-gray-800 hover:bg-gray-900 text-white"
                      >
                        Configure Loyalty Program
                      </Button>
                    </div>
                  )}
                  {tool.id === "reservation" && (
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Reservation System</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-800">Import from existing app</span>
                            <Button variant="outline" size="sm" className="bg-white border-gray-300 text-gray-700">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Connect App
                            </Button>
                          </div>
                          <div className="text-center text-sm text-gray-700">OR</div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-800">Create built-in system</span>
                            <Button variant="outline" size="sm" className="bg-white border-gray-300 text-gray-700">
                              <Plus className="w-3 h-3 mr-1" />
                              Setup System
                            </Button>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                            <span className="text-sm font-medium text-gray-800">Show on published profile</span>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {tool.id === "offers" && (
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-3">Current Offers</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                            <div>
                              <span className="text-sm font-medium text-gray-900">Happy Hour Special</span>
                              <p className="text-xs text-gray-700">20% off on all appetizers and drinks</p>
                            </div>
                            <Badge className="bg-gray-100 text-gray-800 text-xs">Active</Badge>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                            <div>
                              <span className="text-sm font-medium text-gray-900">Family Sunday</span>
                              <p className="text-xs text-gray-700">Kids eat free with adult meal purchase</p>
                            </div>
                            <Badge className="bg-gray-100 text-gray-800 text-xs">Active</Badge>
                          </div>
                        </div>
                      </div>
                      <Button className="bg-gray-800 hover:bg-gray-900 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Offer
                      </Button>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      ),
    },
  ]

  const handleAIGenerate = async () => {
    setIsGenerating(true)
    setAiModalStep("generating")

    // Reset generation steps
    setGenerationSteps((prev) => prev.map((step) => ({ ...step, completed: false, inProgress: false })))

    // Execute steps one by one
    for (let i = 0; i < generationSteps.length; i++) {
      // Mark current step as in progress
      setGenerationSteps((prev) =>
        prev.map((step, index) => ({
          ...step,
          inProgress: index === i,
          completed: index < i,
        })),
      )

      // Simulate step execution time
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mark current step as completed
      setGenerationSteps((prev) =>
        prev.map((step, index) => ({
          ...step,
          inProgress: false,
          completed: index <= i,
        })),
      )
    }

    // Update form data with AI-generated content based on selected sections
    if (aiConfig.sections.basicInfo.enabled) {
      if (!aiConfig.sections.basicInfo.retainExisting) {
        setBasicInfo((prev) => ({
          ...prev,
          description:
            "🍝 Experience authentic Italian cuisine crafted with passion and tradition. Our wood-fired pizzas, handmade pasta, and carefully curated wine selection create an unforgettable dining experience in the heart of Bangalore. From intimate dinners to family celebrations, we bring the warmth of Italy to every meal.",
          tagline: "Where Italian tradition meets Bangalore's heart ❤️",
        }))
      }
    }

    if (aiConfig.sections.details.enabled) {
      if (!aiConfig.sections.details.retainExisting) {
        setDetails((prev) => ({
          ...prev,
          legacy: {
            ...prev.legacy,
            story:
              "🇮🇹 Born from a dream to bring authentic Italian flavors to India, Bella Vista Restaurant was established in 1995 by Chef Marco Rossi. With recipes passed down through three generations of Italian culinary masters, we pride ourselves on using only the finest imported ingredients and traditional cooking methods.",
          },
        }))
      }
    }

    // Generate profile link
    const profileLink = `https://tablesalt.com/profile/${basicInfo.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`

    // Save the generated state
    saveProfileState({
      isGenerated: true,
      profileLink,
      hasUnsavedChanges: false,
      lastGenerated: new Date().toISOString(),
      generatedWith: aiConfig.selectedPlatform,
    })

    setIsGenerating(false)

    // Wait a moment to show completion
    setTimeout(() => {
      setShowAIModal(false)
      setAiModalStep("platform")
      toast({
        title: "🎉 Profile Generated Successfully!",
        description: "Your social profile has been enhanced with AI-generated content. Preview link created!",
      })
    }, 1000)
  }

  const handleSave = () => {
    saveProfileData()
    saveProfileState({
      isSaved: true,
      hasUnsavedChanges: false,
      lastSaved: new Date().toISOString(),
    })

    toast({
      title: "✅ Profile saved successfully",
      description: "Your social profile has been saved and will be available on your next login",
    })
  }

  const handlePublish = () => {
    saveProfileData()
    const profileLink =
      profileState.profileLink ||
      `https://tablesalt.com/profile/${basicInfo.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`

    saveProfileState({
      isSaved: true,
      isPublished: true,
      profileLink,
      hasUnsavedChanges: false,
      lastSaved: new Date().toISOString(),
      lastPublished: new Date().toISOString(),
    })

    toast({
      title: "🚀 Profile published successfully",
      description: "Your social profile is now live on TableSalt website",
    })
  }

  const handleShare = async () => {
    if (profileState.profileLink) {
      try {
        await navigator.clipboard.writeText(profileState.profileLink)
        setLinkCopied(true)
        setTimeout(() => setLinkCopied(false), 2000)
        toast({
          title: "Link copied!",
          description: "Profile link has been copied to clipboard",
        })
      } catch (err) {
        toast({
          title: "Share Profile",
          description: profileState.profileLink,
        })
      }
    }
  }

  const getProfileStatusBadge = () => {
    if (profileState.isPublished) {
      return <Badge className="bg-gray-100 text-gray-800 border-gray-300">Published</Badge>
    } else if (profileState.isSaved) {
      return <Badge className="bg-gray-100 text-gray-800 border-gray-300">Saved</Badge>
    } else if (profileState.isGenerated) {
      return <Badge className="bg-gray-100 text-gray-800 border-gray-300">Generated</Badge>
    }
    return <Badge variant="outline">Draft</Badge>
  }

  // Public Profile Preview Component
  const PublicProfilePreview = ({ profileData }: { profileData: PublicProfileData }) => {
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
      const hours = profileData.hours[todayName]

      if (!hours || hours.closed) return "Closed"
      return `${formatTime(hours.open)} - ${formatTime(hours.close)}`
    }

    const getOperatingStatus = () => {
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

    const operatingStatus = getOperatingStatus()

    // Enhanced use cases with percentages
    const enhancedUseCases = [
      { name: "Date Night", percentage: 45 },
      { name: "Family Dinner", percentage: 35 },
      { name: "Business Lunch", percentage: 20 },
    ]

    return (
      <div className="bg-white max-h-[80vh] overflow-y-auto">
        {/* Enhanced Hero Section */}
        <div className="relative">
          <div
            className="h-56 bg-cover bg-center relative"
            style={{
              backgroundImage: `linear-gradient(135deg, ${profileData.brandColors.primary}15, ${profileData.brandColors.secondary}15), linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${profileData.heroImage})`,
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4 max-w-sm">
                <div className="mb-3">
                  <Badge
                    className="text-xs font-medium px-3 py-1 mb-2"
                    style={{
                      backgroundColor: profileData.brandColors.primary + "20",
                      color: profileData.brandColors.primary,
                      border: `1px solid ${profileData.brandColors.primary}40`,
                    }}
                  >
                    {profileData.cuisine.split(",")[0].trim()} Restaurant
                  </Badge>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold mb-2 text-shadow-lg">{profileData.restaurantName}</h1>
                {profileData.tagline && (
                  <p className="text-xs sm:text-sm opacity-90 mb-3 text-shadow">{profileData.tagline}</p>
                )}
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <div className="flex items-center space-x-1 bg-white/90 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span>{profileData.reviews.averageRating}</span>
                    <span className="text-gray-600">({profileData.reviews.totalReviews})</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-white/90 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                    <Clock className="w-3 h-3" />
                    <span className={operatingStatus.color}>{operatingStatus.status}</span>
                  </div>
                  <Badge className="bg-white/90 text-gray-800 text-xs font-medium">{profileData.priceRange}</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Elegant overlay pattern */}
          <div
            className="absolute bottom-0 left-0 right-0 h-16 opacity-20"
            style={{
              background: `linear-gradient(45deg, ${profileData.brandColors.primary}, ${profileData.brandColors.secondary})`,
            }}
          />
        </div>

        <div className="px-4 py-6 space-y-8">
          {/* About Section with Enhanced Design */}
          <div className="relative">
            <div
              className="absolute top-0 left-0 w-1 h-full rounded-full"
              style={{ backgroundColor: profileData.brandColors.primary }}
            />
            <div className="pl-6">
              <h3 className="font-bold text-lg sm:text-xl mb-3 text-gray-900">About {profileData.restaurantName}</h3>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-4">{profileData.description}</p>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-gray-800 mb-3">What Makes Us Special</h4>
                {details.highlights.uniqueSellingPoints.map((usp, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: profileData.brandColors.primary }}
                    />
                    <p className="text-sm text-gray-700 leading-relaxed">{usp}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Reviews Section */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5">
            <h3 className="font-bold text-xl mb-4 text-gray-900 flex items-center">
              <div
                className="w-8 h-8 rounded-lg mr-3 flex items-center justify-center"
                style={{ backgroundColor: profileData.brandColors.primary + "20" }}
              >
                <Star className="w-4 h-4" style={{ color: profileData.brandColors.primary }} />
              </div>
              Reviews & Ratings
            </h3>

            {/* Overall Rating Card */}
            <div className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl font-bold text-gray-900">{profileData.reviews.averageRating}</div>
                  <div>
                    <div className="flex items-center space-x-1 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.floor(profileData.reviews.averageRating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-gray-600">{profileData.reviews.totalReviews} total reviews</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{profileData.reviews.platformBreakup.length}</div>
                  <div className="text-xs text-gray-600">Platforms</div>
                </div>
              </div>

              {/* Platform Ratings */}
              <div className="space-y-2">
                <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Platform Ratings</h5>
                {profileData.reviews.platformBreakup.map((platform, index) => (
                  <div key={index} className="flex items-center justify-between py-1">
                    <span className="text-sm font-medium text-gray-700">{platform.platform}</span>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{platform.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-xs text-gray-500">({platform.count})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Review Summary */}
            <div className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
              <div className="flex items-center mb-2">
                <Sparkles className="w-4 h-4 mr-2" style={{ color: profileData.brandColors.primary }} />
                <h5 className="font-semibold text-sm text-gray-800">AI Review Summary</h5>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">{profileData.reviews.summary}</p>
            </div>

            {/* Enhanced Use Cases with Percentages */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h5 className="font-semibold text-sm text-gray-800 mb-3">Popular Use Cases</h5>
              <div className="space-y-3">
                {enhancedUseCases.map((useCase, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{useCase.name}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${useCase.percentage}%`,
                            backgroundColor: profileData.brandColors.primary,
                          }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-600 w-8">{useCase.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Menu Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-xl text-gray-900 flex items-center">
                <div
                  className="w-8 h-8 rounded-lg mr-3 flex items-center justify-center"
                  style={{ backgroundColor: profileData.brandColors.secondary + "20" }}
                >
                  <Utensils className="w-4 h-4" style={{ color: profileData.brandColors.secondary }} />
                </div>
                Popular Menu Items
              </h3>
              <Button variant="outline" size="sm" className="text-xs bg-transparent border-gray-300">
                <ExternalLink className="w-3 h-3 mr-1" />
                Full Menu
              </Button>
            </div>
            <div className="space-y-3">
              {profileData.menuItems.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex space-x-4">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm text-gray-900 truncate">{item.name}</h4>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs font-medium text-gray-700">{item.rating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-lg" style={{ color: profileData.brandColors.primary }}>
                          ₹{item.price}
                        </span>
                        <Button
                          size="sm"
                          className="text-xs px-4"
                          style={{
                            backgroundColor: profileData.brandColors.primary,
                            color: "white",
                          }}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Chef Section */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-5">
            <h3 className="font-bold text-xl mb-4 text-gray-900 flex items-center">
              <div
                className="w-8 h-8 rounded-lg mr-3 flex items-center justify-center"
                style={{ backgroundColor: profileData.brandColors.primary + "20" }}
              >
                <ChefHat className="w-4 h-4" style={{ color: profileData.brandColors.primary }} />
              </div>
              Meet the Chef
            </h3>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex space-x-4">
                <img
                  src={profileData.chef.photo || "/placeholder.svg"}
                  alt={profileData.chef.name}
                  className="w-20 h-20 object-cover rounded-full flex-shrink-0 border-4 border-white shadow-md"
                />
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-gray-900 mb-1">{profileData.chef.name}</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{profileData.chef.intro}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Legacy Section */}
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-xl mb-4 text-gray-900 flex items-center">
                <div
                  className="w-8 h-8 rounded-lg mr-3 flex items-center justify-center"
                  style={{ backgroundColor: profileData.brandColors.secondary + "20" }}
                >
                  <Type className="w-4 h-4" style={{ color: profileData.brandColors.secondary }} />
                </div>
                Our Legacy
              </h3>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <p className="text-sm text-gray-700 leading-relaxed mb-4">{profileData.legacy.story}</p>

                {/* Awards */}
                {profileData.legacy.awards.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-semibold text-sm text-gray-800 mb-3 flex items-center">
                      <Trophy className="w-4 h-4 mr-2" style={{ color: profileData.brandColors.primary }} />
                      Awards & Recognition
                    </h5>
                    <div className="space-y-2">
                      {profileData.legacy.awards.map((award, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-2 bg-yellow-50 rounded-lg border border-yellow-200"
                        >
                          <Award className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                          <span className="text-sm font-medium text-yellow-800">{award}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Press Coverage */}
                {profileData.legacy.pressCoverage.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-semibold text-sm text-gray-800 mb-3 flex items-center">
                      <Newspaper className="w-4 h-4 mr-2" style={{ color: profileData.brandColors.secondary }} />
                      Press Coverage
                    </h5>
                    <div className="space-y-2">
                      {profileData.legacy.pressCoverage.map((coverage, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-2 bg-purple-50 rounded-lg border border-purple-200"
                        >
                          <Newspaper className="w-4 h-4 text-purple-600 flex-shrink-0" />
                          <span className="text-sm font-medium text-purple-800">{coverage}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rankings */}
                {profileData.legacy.recognition.length > 0 && (
                  <div>
                    <h5 className="font-semibold text-sm text-gray-800 mb-3 flex items-center">
                      <Star className="w-4 h-4 mr-2" style={{ color: profileData.brandColors.primary }} />
                      Rankings
                    </h5>
                    <div className="space-y-2">
                      {profileData.legacy.recognition.map((ranking, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-2 rounded-lg border"
                          style={{
                            backgroundColor: profileData.brandColors.primary + "10",
                            borderColor: profileData.brandColors.primary + "30",
                          }}
                        >
                          <Badge className="w-4 h-4 flex-shrink-0" style={{ color: profileData.brandColors.primary }} />
                          <span className="text-sm font-medium" style={{ color: profileData.brandColors.primary }}>
                            {ranking}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Media Gallery */}
          <div>
            <h3 className="font-bold text-xl mb-4 text-gray-900">Gallery</h3>
            <div className="flex space-x-2 mb-4">
              {(["food", "restaurant", "kitchen"] as const).map((category) => (
                <Button
                  key={category}
                  variant={activeImageCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveImageCategory(category)}
                  className="capitalize"
                  style={
                    activeImageCategory === category
                      ? {
                          backgroundColor: profileData.brandColors.primary,
                          color: "white",
                        }
                      : {}
                  }
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
          </div>

          {/* Amenities */}
          <div>
            <h3 className="font-bold text-xl mb-4 text-gray-900">Amenities & Features</h3>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="grid grid-cols-2 gap-3">
                {profileData.amenities.slice(0, 8).map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: profileData.brandColors.primary }} />
                    <span className="text-sm font-medium text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Current Offers */}
          {profileData.offers.length > 0 && (
            <div>
              <h3 className="font-bold text-xl mb-4 text-gray-900 flex items-center">
                <div
                  className="w-8 h-8 rounded-lg mr-3 flex items-center justify-center"
                  style={{ backgroundColor: profileData.brandColors.secondary + "20" }}
                >
                  <Percent className="w-4 h-4" style={{ color: profileData.brandColors.secondary }} />
                </div>
                Current Offers
              </h3>
              <div className="space-y-3">
                {profileData.offers.map((offer) => (
                  <div
                    key={offer.id}
                    className="border rounded-lg p-4"
                    style={{
                      backgroundColor: profileData.brandColors.secondary + "10",
                      borderColor: profileData.brandColors.secondary + "30",
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium mb-1" style={{ color: profileData.brandColors.secondary }}>
                          {offer.title}
                        </h4>
                        <p className="text-sm mb-2" style={{ color: profileData.brandColors.secondary }}>
                          {offer.description}
                        </p>
                        <p className="text-xs" style={{ color: profileData.brandColors.secondary }}>
                          {offer.validUntil}
                        </p>
                      </div>
                      <Gift className="w-6 h-6" style={{ color: profileData.brandColors.secondary }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loyalty Program */}
          {profileData.loyaltyProgram.enabled && (
            <div>
              <h3 className="font-bold text-xl mb-4 text-gray-900 flex items-center">
                <div
                  className="w-8 h-8 rounded-lg mr-3 flex items-center justify-center"
                  style={{ backgroundColor: profileData.brandColors.primary + "20" }}
                >
                  <Gift className="w-4 h-4" style={{ color: profileData.brandColors.primary }} />
                </div>
                {profileData.loyaltyProgram.name}
              </h3>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <p className="text-sm text-gray-700 mb-4">{profileData.loyaltyProgram.description}</p>
                <Button
                  className="text-white"
                  style={{
                    backgroundColor: profileData.brandColors.primary,
                  }}
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Join Rewards Program
                </Button>
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div>
            <h3 className="font-bold text-xl mb-4 text-gray-900">Contact & Hours</h3>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="space-y-3 mb-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700 leading-relaxed">{profileData.address}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-600 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-700">{profileData.phone}</span>
                </div>
                {profileData.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{profileData.email}</span>
                  </div>
                )}
                {profileData.website && (
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    <span className="text-sm" style={{ color: profileData.brandColors.primary }}>
                      {profileData.website}
                    </span>
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
                  <div
                    className="flex items-center justify-between p-3 rounded-lg"
                    style={{ backgroundColor: profileData.brandColors.primary + "10" }}
                  >
                    <span className="text-sm font-semibold text-gray-800">Today's Hours</span>
                    <span className={`text-sm font-bold ${operatingStatus.color}`}>{getTodayHours()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="flex items-center justify-center space-x-3">
            <Button
              className="flex-1 text-sm font-medium shadow-md"
              style={{
                backgroundColor: profileData.brandColors.primary,
                color: "white",
              }}
            >
              <Phone className="w-4 h-4 mr-2" />
              Call Now
            </Button>
            {profileData.reservationEnabled && (
              <Button
                className="flex-1 text-sm font-medium shadow-md"
                style={{
                  backgroundColor: profileData.brandColors.secondary,
                  color: "white",
                }}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Reserve Table
              </Button>
            )}
            {profileData.offers.length > 0 && (
              <Button
                variant="outline"
                className="flex-1 text-sm font-medium shadow-md bg-white"
                style={{
                  borderColor: profileData.brandColors.primary,
                  color: profileData.brandColors.primary,
                }}
              >
                <Percent className="w-4 h-4 mr-2" />
                View Offers
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // AI Generate Modal Component
  const AIGenerateModal = () => {
    if (aiModalStep === "platform") {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Choose Platform for AI Generation</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAIModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-6">
                Select a connected platform to use as the primary data source for AI content generation.
              </p>
              <div className="space-y-3">
                {connectedPlatforms
                  .filter((p) => p.connected)
                  .map((platform) => (
                    <div
                      key={platform.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        aiConfig.selectedPlatform === platform.id
                          ? "border-gray-800 bg-gray-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setAiConfig((prev) => ({ ...prev, selectedPlatform: platform.id }))}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-4 h-4 rounded-full border-2 ${
                              aiConfig.selectedPlatform === platform.id
                                ? "border-gray-800 bg-gray-800"
                                : "border-gray-300"
                            }`}
                          >
                            {aiConfig.selectedPlatform === platform.id && (
                              <div className="w-full h-full rounded-full bg-white scale-50"></div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{platform.name}</h4>
                            <p className="text-sm text-gray-600">
                              {platform.reviews > 0
                                ? `${platform.reviews} reviews • ${platform.rating} rating`
                                : "Connected"}
                            </p>
                          </div>
                        </div>
                        <CheckCircle className="w-5 h-5 text-gray-600" />
                      </div>
                    </div>
                  ))}
              </div>
              <div className="flex justify-between pt-6 border-t border-gray-200 mt-6">
                <Button variant="outline" onClick={() => setShowAIModal(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => setAiModalStep("sections")}
                  disabled={!aiConfig.selectedPlatform}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (aiModalStep === "sections") {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Select Sections to Generate</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAIModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-6">
                Choose which sections you want AI to generate content for. You can choose to retain existing data or
                replace it entirely.
              </p>
              <div className="space-y-4">
                {Object.entries(aiConfig.sections).map(([sectionKey, section]) => {
                  const sectionNames = {
                    basicInfo: "Basic Information",
                    brandAssets: "Brand Assets",
                    details: "Details & Legacy",
                    amenities: "Amenities",
                    media: "Media Assets",
                  }

                  return (
                    <div key={sectionKey} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            checked={section.enabled}
                            onCheckedChange={(checked) => {
                              setAiConfig((prev) => ({
                                ...prev,
                                sections: {
                                  ...prev.sections,
                                  [sectionKey]: { ...section, enabled: !!checked },
                                },
                              }))
                            }}
                          />
                          <h4 className="font-medium text-gray-900">
                            {sectionNames[sectionKey as keyof typeof sectionNames]}
                          </h4>
                        </div>
                      </div>
                      {section.enabled && (
                        <div className="ml-6 space-y-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id={`${sectionKey}-replace`}
                              name={sectionKey}
                              checked={!section.retainExisting}
                              onChange={() => {
                                setAiConfig((prev) => ({
                                  ...prev,
                                  sections: {
                                    ...prev.sections,
                                    [sectionKey]: { ...section, retainExisting: false },
                                  },
                                }))
                              }}
                              className="w-4 h-4"
                            />
                            <label htmlFor={`${sectionKey}-replace`} className="text-sm text-gray-700">
                              Replace existing content
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id={`${sectionKey}-retain`}
                              name={sectionKey}
                              checked={section.retainExisting}
                              onChange={() => {
                                setAiConfig((prev) => ({
                                  ...prev,
                                  sections: {
                                    ...prev.sections,
                                    [sectionKey]: { ...section, retainExisting: true },
                                  },
                                }))
                              }}
                              className="w-4 h-4"
                            />
                            <label htmlFor={`${sectionKey}-retain`} className="text-sm text-gray-700">
                              Enhance existing content
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              <div className="flex justify-between pt-6 border-t border-gray-200 mt-6">
                <Button variant="outline" onClick={() => setAiModalStep("platform")}>
                  Back
                </Button>
                <Button
                  onClick={handleAIGenerate}
                  disabled={!Object.values(aiConfig.sections).some((s) => s.enabled)}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  Generate Content
                  <Star className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (aiModalStep === "generating") {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Generating Your Profile</h3>
            </div>
            <div className="p-6">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600">
                  AI is analyzing data from {connectedPlatforms.find((p) => p.id === aiConfig.selectedPlatform)?.name}{" "}
                  and generating optimized content for your restaurant profile.
                </p>
              </div>

              <div className="space-y-4">
                {generationSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center space-x-4 p-3 rounded-lg border border-gray-200">
                    <div className="flex-shrink-0">
                      {step.completed ? (
                        <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      ) : step.inProgress ? (
                        <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                          <Loader2 className="w-4 h-4 text-white animate-spin" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <step.icon className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4
                        className={`font-medium ${
                          step.completed ? "text-gray-900" : step.inProgress ? "text-gray-900" : "text-gray-500"
                        }`}
                      >
                        {step.name}
                      </h4>
                      <p
                        className={`text-sm ${
                          step.completed ? "text-gray-600" : step.inProgress ? "text-gray-600" : "text-gray-400"
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                    {step.completed && <CheckCircle className="w-5 h-5 text-gray-700" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
              <Button variant="ghost" onClick={() => router.back()} className="text-gray-600 hover:text-gray-900">
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">Social Profile Builder</h1>
                <p className="text-xs sm:text-sm text-gray-600 truncate hidden sm:block">
                  Create your restaurant's social media presence
                </p>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              {getProfileStatusBadge()}
              {profileState.profileLink && (
                <Button variant="outline" size="sm" onClick={handleShare} className="bg-white border-gray-300">
                  <Share2 className="w-4 h-4 mr-1" />
                  {linkCopied ? "Copied!" : "Share"}
                </Button>
              )}
              <Button
                onClick={() => setShowPublicPreview(true)}
                variant="outline"
                size="sm"
                className="bg-white border-gray-300"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Preview
              </Button>
              <Button
                onClick={() => setShowAIModal(true)}
                disabled={isGenerating}
                className="bg-black hover:bg-gray-800 text-white"
                size="sm"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Star className="w-4 h-4 mr-1" />
                    AI Generate
                  </>
                )}
              </Button>
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center space-x-2">
              {getProfileStatusBadge()}
              <Button
                onClick={() => setShowAIModal(true)}
                disabled={isGenerating}
                className="bg-black hover:bg-gray-800 text-white"
                size="sm"
              >
                {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Mobile Secondary Actions */}
          <div className="lg:hidden pb-3 flex items-center justify-center space-x-2">
            {profileState.profileLink && (
              <Button variant="outline" size="sm" onClick={handleShare} className="bg-white border-gray-300 flex-1">
                <Share2 className="w-4 h-4 mr-1" />
                {linkCopied ? "Copied!" : "Share"}
              </Button>
            )}
            <Button
              onClick={() => setShowPublicPreview(true)}
              variant="outline"
              size="sm"
              className="bg-white border-gray-300 flex-1"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Preview
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Profile Completion</span>
            <span className="text-sm text-gray-600">75%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gray-800 h-2 rounded-full" style={{ width: "75%" }}></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {/* Mobile Tab Navigation */}
            <div className="lg:hidden mb-6">
              <div className="flex overflow-x-auto space-x-1 bg-gray-100 p-1 rounded-lg">
                {tabsConfig.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-shrink-0 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop Tab Navigation */}
            <div className="hidden lg:block mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  {tabsConfig.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? "border-gray-800 text-gray-900"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">{tabsConfig.find((tab) => tab.id === activeTab)?.content}</div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Preview Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-black text-lg">Profile Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                    {brandAssets.logo ? (
                      <img
                        src={brandAssets.logo || "/placeholder.svg"}
                        alt="Logo"
                        className="w-12 h-12 object-contain rounded-full"
                      />
                    ) : (
                      <Building className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{basicInfo.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{basicInfo.cuisine}</p>
                  <div className="flex items-center justify-center mb-4">
                    <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                    <span className="text-sm font-medium">4.2 (156 reviews)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Phone className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-700">{basicInfo.phone}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-700">{basicInfo.address.split(",")[0]}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-green-600 font-medium">Open Now</span>
                  </div>
                </div>

                <Button
                  onClick={() => setShowPublicPreview(true)}
                  className="w-full bg-black hover:bg-gray-800 text-white"
                  size="sm"
                >
                  View Full Preview
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-black text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handleSave}
                  disabled={!profileState.hasUnsavedChanges}
                  className="w-full bg-gray-800 hover:bg-gray-900 text-white"
                  size="sm"
                >
                  Save Changes
                </Button>
                <Button
                  onClick={handlePublish}
                  disabled={!profileState.isGenerated && !profileState.isSaved}
                  className="w-full bg-gray-800 hover:bg-gray-900 text-white"
                  size="sm"
                >
                  Publish Profile
                </Button>
                <Button
                  onClick={() => setShowAIModal(true)}
                  className="w-full bg-gray-800 hover:bg-gray-900 text-white"
                  size="sm"
                >
                  AI Enhance
                </Button>
              </CardContent>
            </Card>

            {/* Profile Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-black text-lg">Profile Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completion</span>
                  <span className="text-sm font-medium">75%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Connected Platforms</span>
                  <span className="text-sm font-medium">{connectedPlatforms.filter((p) => p.connected).length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Media Items</span>
                  <span className="text-sm font-medium">{mediaItems.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Amenities</span>
                  <span className="text-sm font-medium">{amenities.filter((a) => a.available).length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* AI Generate Modal */}
      {showAIModal && <AIGenerateModal />}

      {/* Public Preview Modal */}
      {showPublicPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Public Profile Preview</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPublicPreview(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <PublicProfilePreview profileData={generatePublicProfileData()} />
          </div>
        </div>
      )}

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
              setBrandAssets((prev) => ({ ...prev, logo: e.target?.result as string }))
              markAsChanged()
            }
            reader.readAsDataURL(file)
          }
        }}
        className="hidden"
      />
      <input
        ref={chefPhotoRef}
        type="file"
        accept="image/*"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
              setDetails((prev) => ({
                ...prev,
                chef: { ...prev.chef, photo: e.target?.result as string },
              }))
              markAsChanged()
            }
            reader.readAsDataURL(file)
          }
        }}
        className="hidden"
      />
    </div>
  )
}
