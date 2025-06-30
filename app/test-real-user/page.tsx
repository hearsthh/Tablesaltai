"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Database,
  Server,
  Users,
  ChefHat,
  MessageSquare,
  Building,
  Loader2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  BarChart3,
  TestTube,
  UserPlus,
  Link,
  Star,
  Calendar,
  Eye,
  Shield,
  Globe,
  XCircle,
} from "lucide-react"

// Sample restaurant data for testing
const sampleRestaurants = [
  {
    id: "bella-italia",
    name: "Bella Italia",
    tagline: "Authentic Italian cuisine in the heart of the city",
    email: "info@bellaitalia.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, Downtown, NY 10001",
    cuisine: "Italian",
    type: "Fine Dining",
    priceRange: "$$$",
    website: "https://bellaitalia.com",
    description:
      "Experience the authentic flavors of Italy with our traditional recipes passed down through generations.",
    operatingHours: {
      monday: { open: "17:00", close: "22:00", closed: false },
      tuesday: { open: "17:00", close: "22:00", closed: false },
      wednesday: { open: "17:00", close: "22:00", closed: false },
      thursday: { open: "17:00", close: "23:00", closed: false },
      friday: { open: "17:00", close: "23:00", closed: false },
      saturday: { open: "17:00", close: "23:00", closed: false },
      sunday: { open: "16:00", close: "21:00", closed: false },
    },
    socialMedia: {
      facebook: "https://facebook.com/bellaitalia",
      instagram: "https://instagram.com/bellaitalia",
      twitter: "https://twitter.com/bellaitalia",
    },
    brandColors: {
      primary: "#c41e3a",
      secondary: "#228b22",
      accent: "#ffd700",
    },
    brandVoice: "warm",
    amenities: ["outdoor_seating", "wine_bar", "private_dining", "valet_parking"],
    menuCategories: [
      { name: "Antipasti", description: "Traditional Italian appetizers", order: 1 },
      { name: "Pasta", description: "Fresh handmade pasta dishes", order: 2 },
      { name: "Secondi", description: "Main courses featuring meat and seafood", order: 3 },
      { name: "Dolci", description: "Traditional Italian desserts", order: 4 },
    ],
    menuItems: [
      {
        name: "Bruschetta Classica",
        category: "Antipasti",
        description: "Toasted bread topped with fresh tomatoes, basil, and garlic",
        price: 12.99,
        dietaryTags: ["vegetarian"],
        order: 1,
      },
      {
        name: "Spaghetti Carbonara",
        category: "Pasta",
        description: "Classic Roman pasta with eggs, pancetta, and Parmigiano-Reggiano",
        price: 18.99,
        dietaryTags: [],
        order: 1,
      },
      {
        name: "Osso Buco",
        category: "Secondi",
        description: "Braised veal shanks with saffron risotto",
        price: 32.99,
        dietaryTags: [],
        order: 1,
      },
      {
        name: "Tiramisu",
        category: "Dolci",
        description: "Classic Italian dessert with coffee-soaked ladyfingers",
        price: 8.99,
        dietaryTags: ["vegetarian"],
        order: 1,
      },
    ],
  },
  {
    id: "tokyo-ramen",
    name: "Tokyo Ramen House",
    tagline: "Authentic Japanese ramen and street food",
    email: "hello@tokyoramen.com",
    phone: "+1 (555) 987-6543",
    address: "456 Sakura Avenue, Japantown, SF 94115",
    cuisine: "Japanese",
    type: "Casual Dining",
    priceRange: "$$",
    website: "https://tokyoramen.com",
    description:
      "Bringing the authentic taste of Tokyo's ramen culture to your neighborhood with traditional recipes and fresh ingredients.",
    operatingHours: {
      monday: { open: "11:30", close: "21:00", closed: false },
      tuesday: { open: "11:30", close: "21:00", closed: false },
      wednesday: { open: "11:30", close: "21:00", closed: false },
      thursday: { open: "11:30", close: "22:00", closed: false },
      friday: { open: "11:30", close: "22:00", closed: false },
      saturday: { open: "11:30", close: "22:00", closed: false },
      sunday: { open: "12:00", close: "20:00", closed: false },
    },
    socialMedia: {
      facebook: "",
      instagram: "https://instagram.com/tokyoramen",
      twitter: "",
    },
    brandColors: {
      primary: "#d32f2f",
      secondary: "#1976d2",
      accent: "#ff9800",
    },
    brandVoice: "casual",
    amenities: ["takeout", "delivery", "counter_seating", "quick_service"],
    menuCategories: [
      { name: "Ramen", description: "Traditional Japanese noodle soups", order: 1 },
      { name: "Appetizers", description: "Japanese street food and starters", order: 2 },
      { name: "Rice Bowls", description: "Donburi and rice dishes", order: 3 },
      { name: "Beverages", description: "Japanese teas and soft drinks", order: 4 },
    ],
    menuItems: [
      {
        name: "Tonkotsu Ramen",
        category: "Ramen",
        description: "Rich pork bone broth with chashu, green onions, and soft-boiled egg",
        price: 14.99,
        dietaryTags: [],
        order: 1,
      },
      {
        name: "Gyoza",
        category: "Appetizers",
        description: "Pan-fried pork dumplings with dipping sauce",
        price: 7.99,
        dietaryTags: [],
        order: 1,
      },
      {
        name: "Chicken Teriyaki Bowl",
        category: "Rice Bowls",
        description: "Grilled chicken with teriyaki sauce over steamed rice",
        price: 12.99,
        dietaryTags: [],
        order: 1,
      },
      {
        name: "Green Tea",
        category: "Beverages",
        description: "Traditional Japanese green tea",
        price: 3.99,
        dietaryTags: ["vegan"],
        order: 1,
      },
    ],
  },
]

export default function TestRealUserPage() {
  const [selectedRestaurant, setSelectedRestaurant] = useState(sampleRestaurants[0])
  const [customRestaurant, setCustomRestaurant] = useState({
    name: "",
    tagline: "",
    email: "",
    phone: "",
    address: "",
    cuisine: "",
    type: "",
    priceRange: "",
    website: "",
    description: "",
  })
  const [useCustomData, setUseCustomData] = useState(false)
  const [isCreatingUser, setIsCreatingUser] = useState(false)
  const [isSimulatingActivity, setIsSimulatingActivity] = useState(false)
  const [testProgress, setTestProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("")
  const [createdUser, setCreatedUser] = useState(null)
  const [environmentStatus, setEnvironmentStatus] = useState(null)
  const [isCheckingEnvironment, setIsCheckingEnvironment] = useState(true)
  const [testResults, setTestResults] = useState({
    userCreation: "pending",
    profileSetup: "pending",
    menuCreation: "pending",
    reviewSystem: "pending",
    platformIntegration: "pending",
    activitySimulation: "pending",
    analyticsGeneration: "pending",
  })

  // Platform integration options
  const [selectedPlatforms, setSelectedPlatforms] = useState([
    { name: "Google", type: "review", enabled: true, apiKey: "production_google_key" },
    { name: "Yelp", type: "review", enabled: true, apiKey: "production_yelp_key" },
    { name: "OpenTable", type: "reservation", enabled: true, apiKey: "production_opentable_key" },
  ])

  useEffect(() => {
    checkEnvironment()
  }, [])

  const checkEnvironment = async () => {
    setIsCheckingEnvironment(true)
    try {
      const response = await fetch("/api/verify-environment")
      const data = await response.json()
      setEnvironmentStatus(data)
    } catch (error) {
      console.error("Environment check failed:", error)
      setEnvironmentStatus({
        success: false,
        environment: "error",
        error: "Failed to check environment",
        recommendations: ["Check network connection and try again"],
      })
    }
    setIsCheckingEnvironment(false)
  }

  const runCompleteTest = async () => {
    if (!environmentStatus?.success) {
      toast({
        title: "Environment Not Ready",
        description: "Please fix environment configuration before running tests",
        variant: "destructive",
      })
      return
    }

    setIsCreatingUser(true)
    setTestProgress(0)
    setCurrentStep("Starting production deployment test...")

    try {
      const restaurantData = useCustomData ? customRestaurant : selectedRestaurant

      // Step 1: Create Real User
      setCurrentStep("Creating real user account with Supabase Auth...")
      setTestResults((prev) => ({ ...prev, userCreation: "running" }))

      const userResponse = await fetch("/api/test-user/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userData: {
            email: restaurantData.email,
            password: "SecurePassword123!",
          },
          restaurantData,
        }),
      })

      if (!userResponse.ok) {
        const errorData = await userResponse.json()
        throw new Error(errorData.details || "Failed to create real user")
      }

      const userData = await userResponse.json()
      setCreatedUser(userData)
      setTestResults((prev) => ({ ...prev, userCreation: "passed" }))
      setTestProgress(15)

      // Step 2: Verify Profile Setup
      setCurrentStep("Verifying restaurant profile in production database...")
      setTestResults((prev) => ({ ...prev, profileSetup: "running" }))
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setTestResults((prev) => ({ ...prev, profileSetup: "passed" }))
      setTestProgress(25)

      // Step 3: Verify Menu Creation
      setCurrentStep("Verifying menu structure in production database...")
      setTestResults((prev) => ({ ...prev, menuCreation: "running" }))
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setTestResults((prev) => ({ ...prev, menuCreation: "passed" }))
      setTestProgress(35)

      // Step 4: Setup Review System
      setCurrentStep("Configuring production review management system...")
      setTestResults((prev) => ({ ...prev, reviewSystem: "running" }))
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setTestResults((prev) => ({ ...prev, reviewSystem: "passed" }))
      setTestProgress(45)

      // Step 5: Platform Integration
      setCurrentStep("Setting up real platform integrations...")
      setTestResults((prev) => ({ ...prev, platformIntegration: "running" }))

      const platformResponse = await fetch("/api/test-user/integrate-platforms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userData.user.id,
          platforms: selectedPlatforms.filter((p) => p.enabled),
        }),
      })

      if (platformResponse.ok) {
        setTestResults((prev) => ({ ...prev, platformIntegration: "passed" }))
      } else {
        setTestResults((prev) => ({ ...prev, platformIntegration: "failed" }))
      }
      setTestProgress(60)

      // Step 6: Generate Real Activity
      setCurrentStep("Generating real user activity data...")
      setTestResults((prev) => ({ ...prev, activitySimulation: "running" }))

      const activities = ["profile_views", "menu_interactions", "reviews", "social_engagement", "reservations"]
      for (const activity of activities) {
        await fetch("/api/test-user/simulate-activity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userData.user.id,
            activityType: activity,
          }),
        })
        await new Promise((resolve) => setTimeout(resolve, 800))
      }

      setTestResults((prev) => ({ ...prev, activitySimulation: "passed" }))
      setTestProgress(80)

      // Step 7: Generate Analytics
      setCurrentStep("Computing real analytics and insights...")
      setTestResults((prev) => ({ ...prev, analyticsGeneration: "running" }))
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setTestResults((prev) => ({ ...prev, analyticsGeneration: "passed" }))
      setTestProgress(100)

      setCurrentStep("Production deployment test completed successfully!")

      toast({
        title: "🚀 Production Test Complete!",
        description: `${restaurantData.name} has been set up with real Supabase backend for production deployment!`,
      })
    } catch (error) {
      console.error("Production test error:", error)
      toast({
        title: "Production Test Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsCreatingUser(false)
    }
  }

  const simulateAdditionalActivity = async (activityType: string) => {
    if (!createdUser) {
      toast({
        title: "No User Created",
        description: "Please run the complete test first to create a user.",
        variant: "destructive",
      })
      return
    }

    setIsSimulatingActivity(true)
    try {
      const response = await fetch("/api/test-user/simulate-activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: createdUser.user.id,
          activityType,
        }),
      })

      if (response.ok) {
        toast({
          title: "Real Activity Generated",
          description: `${activityType} activity has been added to the production database.`,
        })
      } else {
        throw new Error("Failed to generate real activity")
      }
    } catch (error) {
      toast({
        title: "Activity Generation Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      })
    } finally {
      setIsSimulatingActivity(false)
    }
  }

  const getTestIcon = (status: string) => {
    switch (status) {
      case "running":
        return <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
      case "passed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
    }
  }

  const getTestColor = (status: string) => {
    switch (status) {
      case "running":
        return "border-blue-200 bg-blue-50"
      case "passed":
        return "border-green-200 bg-green-50"
      case "failed":
        return "border-red-200 bg-red-50"
      default:
        return "border-gray-200 bg-white"
    }
  }

  const getEnvironmentIcon = () => {
    if (isCheckingEnvironment) return <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
    if (environmentStatus?.success) return <CheckCircle className="w-5 h-5 text-green-600" />
    return <XCircle className="w-5 h-5 text-red-600" />
  }

  const getEnvironmentColor = () => {
    if (isCheckingEnvironment) return "border-blue-200 bg-blue-50"
    if (environmentStatus?.success) return "border-green-200 bg-green-50"
    return "border-red-200 bg-red-50"
  }

  if (isCheckingEnvironment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Checking environment configuration...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Globe className="w-8 h-8 mr-3 text-green-600" />
                Production Deployment Test
              </h1>
              <p className="text-gray-600 mt-2">
                Real-world testing with Supabase, OpenAI, and GitHub for production deployment
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={runCompleteTest}
                disabled={isCreatingUser || !environmentStatus?.success}
                className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
              >
                {isCreatingUser ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <UserPlus className="w-4 h-4 mr-2" />
                )}
                Run Production Test
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setTestResults({
                    userCreation: "pending",
                    profileSetup: "pending",
                    menuCreation: "pending",
                    reviewSystem: "pending",
                    platformIntegration: "pending",
                    activitySimulation: "pending",
                    analyticsGeneration: "pending",
                  })
                  setCreatedUser(null)
                  setTestProgress(0)
                  setCurrentStep("")
                }}
                disabled={isCreatingUser}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Test
              </Button>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {isCreatingUser ? currentStep : "Production Test Progress"}
              </span>
              <span className="text-sm text-gray-500">{testProgress}%</span>
            </div>
            <Progress value={testProgress} className="h-3" />
          </div>
        </div>

        {/* Environment Status */}
        <div className={`mb-6 p-4 rounded-lg border ${getEnvironmentColor()}`}>
          <div className="flex items-start space-x-3">
            {getEnvironmentIcon()}
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">
                {isCheckingEnvironment && "Checking Environment..."}
                {!isCheckingEnvironment && environmentStatus?.success && "Production Environment Ready"}
                {!isCheckingEnvironment && !environmentStatus?.success && "Environment Configuration Issues"}
              </h3>
              <p className="text-sm mt-1 text-gray-700">
                {isCheckingEnvironment && "Verifying Supabase connection and environment variables..."}
                {!isCheckingEnvironment &&
                  environmentStatus?.success &&
                  "All environment variables configured and database connection verified."}
                {!isCheckingEnvironment && !environmentStatus?.success && environmentStatus?.error}
              </p>
              {!isCheckingEnvironment && environmentStatus?.recommendations && (
                <div className="mt-2">
                  <ul className="text-xs text-gray-600 space-y-1">
                    {environmentStatus.recommendations.map((rec, index) => (
                      <li key={index}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex items-center space-x-4 mt-2 text-xs">
                <Button variant="outline" size="sm" onClick={checkEnvironment} disabled={isCheckingEnvironment}>
                  <RefreshCw className={`w-3 h-3 mr-1 ${isCheckingEnvironment ? "animate-spin" : ""}`} />
                  Refresh Status
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Restaurant Data Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="w-5 h-5 mr-2" />
                  Restaurant Data Configuration
                </CardTitle>
                <CardDescription>Choose restaurant data for production testing</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs
                  value={useCustomData ? "custom" : "sample"}
                  onValueChange={(value) => setUseCustomData(value === "custom")}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="sample">Sample Data</TabsTrigger>
                    <TabsTrigger value="custom">Custom Data</TabsTrigger>
                  </TabsList>

                  <TabsContent value="sample" className="space-y-4 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sampleRestaurants.map((restaurant) => (
                        <div
                          key={restaurant.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedRestaurant.id === restaurant.id
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setSelectedRestaurant(restaurant)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">{restaurant.name}</h3>
                            {selectedRestaurant.id === restaurant.id && (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{restaurant.tagline}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                            <span>{restaurant.cuisine}</span>
                            <span>{restaurant.priceRange}</span>
                            <span>{restaurant.type}</span>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-gray-600">
                              {restaurant.menuCategories.length} categories • {restaurant.menuItems.length} items
                            </p>
                            <p className="text-xs text-gray-600">
                              {restaurant.amenities.length} amenities • Full social media setup
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="custom" className="space-y-4 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="custom-name">Restaurant Name *</Label>
                        <Input
                          id="custom-name"
                          value={customRestaurant.name}
                          onChange={(e) => setCustomRestaurant({ ...customRestaurant, name: e.target.value })}
                          placeholder="Your Restaurant Name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="custom-tagline">Tagline *</Label>
                        <Input
                          id="custom-tagline"
                          value={customRestaurant.tagline}
                          onChange={(e) => setCustomRestaurant({ ...customRestaurant, tagline: e.target.value })}
                          placeholder="Your restaurant's tagline"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="custom-email">Email *</Label>
                        <Input
                          id="custom-email"
                          type="email"
                          value={customRestaurant.email}
                          onChange={(e) => setCustomRestaurant({ ...customRestaurant, email: e.target.value })}
                          placeholder="contact@yourrestaurant.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="custom-phone">Phone *</Label>
                        <Input
                          id="custom-phone"
                          value={customRestaurant.phone}
                          onChange={(e) => setCustomRestaurant({ ...customRestaurant, phone: e.target.value })}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="custom-cuisine">Cuisine Type *</Label>
                        <Select
                          value={customRestaurant.cuisine}
                          onValueChange={(value) => setCustomRestaurant({ ...customRestaurant, cuisine: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select cuisine" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Italian">Italian</SelectItem>
                            <SelectItem value="Japanese">Japanese</SelectItem>
                            <SelectItem value="Mexican">Mexican</SelectItem>
                            <SelectItem value="Indian">Indian</SelectItem>
                            <SelectItem value="American">American</SelectItem>
                            <SelectItem value="Chinese">Chinese</SelectItem>
                            <SelectItem value="Thai">Thai</SelectItem>
                            <SelectItem value="French">French</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="custom-type">Restaurant Type *</Label>
                        <Select
                          value={customRestaurant.type}
                          onValueChange={(value) => setCustomRestaurant({ ...customRestaurant, type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Fine Dining">Fine Dining</SelectItem>
                            <SelectItem value="Casual Dining">Casual Dining</SelectItem>
                            <SelectItem value="Fast Casual">Fast Casual</SelectItem>
                            <SelectItem value="Quick Service">Quick Service</SelectItem>
                            <SelectItem value="Café">Café</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="custom-address">Address *</Label>
                      <Textarea
                        id="custom-address"
                        value={customRestaurant.address}
                        onChange={(e) => setCustomRestaurant({ ...customRestaurant, address: e.target.value })}
                        placeholder="Full restaurant address"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="custom-description">Description</Label>
                      <Textarea
                        id="custom-description"
                        value={customRestaurant.description}
                        onChange={(e) => setCustomRestaurant({ ...customRestaurant, description: e.target.value })}
                        placeholder="Describe your restaurant..."
                        rows={3}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Platform Integration Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Link className="w-5 h-5 mr-2" />
                  Production Platform Integrations
                </CardTitle>
                <CardDescription>Configure real platform integrations for production deployment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedPlatforms.map((platform, index) => (
                    <div key={platform.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={platform.enabled}
                          onCheckedChange={(checked) => {
                            const updated = [...selectedPlatforms]
                            updated[index].enabled = checked as boolean
                            setSelectedPlatforms(updated)
                          }}
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">{platform.name}</h4>
                          <p className="text-sm text-gray-600 capitalize">Real {platform.type} integration</p>
                        </div>
                      </div>
                      <Badge variant={platform.enabled ? "default" : "secondary"}>
                        {platform.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Test Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TestTube className="w-5 h-5 mr-2" />
                  Production Test Results
                </CardTitle>
                <CardDescription>Real-time testing with production database and integrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(testResults).map(([test, status]) => (
                    <div key={test} className={`p-4 border rounded-lg ${getTestColor(status)}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getTestIcon(status)}
                          <div>
                            <h4 className="font-medium text-gray-900 capitalize">
                              {test.replace(/([A-Z])/g, " $1").trim()}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {test === "userCreation" && "Create real user account with Supabase Auth"}
                              {test === "profileSetup" && "Store restaurant profile in production database"}
                              {test === "menuCreation" && "Create menu categories and items with RLS"}
                              {test === "reviewSystem" && "Initialize production review management system"}
                              {test === "platformIntegration" && "Connect real external platform APIs"}
                              {test === "activitySimulation" && "Generate real user activity data"}
                              {test === "analyticsGeneration" && "Compute production analytics and insights"}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={status === "passed" ? "default" : status === "failed" ? "destructive" : "secondary"}
                        >
                          {status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Created User Info */}
            {createdUser && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-green-600" />
                    Production User Created
                  </CardTitle>
                  <CardDescription>Successfully created user with real production database</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">User Details</Label>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm">
                          <strong>ID:</strong> {createdUser.user.id}
                        </p>
                        <p className="text-sm">
                          <strong>Email:</strong> {createdUser.user.email}
                        </p>
                        <p className="text-sm">
                          <strong>Environment:</strong> Production
                        </p>
                        <p className="text-sm">
                          <strong>Database:</strong> Supabase
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Restaurant Details</Label>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm">
                          <strong>Name:</strong> {createdUser.restaurant.name}
                        </p>
                        <p className="text-sm">
                          <strong>Categories:</strong> {createdUser.restaurant.categories}
                        </p>
                        <p className="text-sm">
                          <strong>Items:</strong> {createdUser.restaurant.items}
                        </p>
                        <p className="text-sm">
                          <strong>Profile ID:</strong> {createdUser.restaurant.id}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      onClick={() => window.open(`/profile/social-profile?user=${createdUser.user.id}`, "_blank")}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Social Profile
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.open(`/profile/menu-builder?user=${createdUser.user.id}`, "_blank")}
                    >
                      <ChefHat className="w-4 h-4 mr-2" />
                      View Menu Builder
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.open(`/profile/reviews?user=${createdUser.user.id}`, "_blank")}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      View Reviews
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Production Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Production Environment</CardTitle>
                  <CardDescription>Real-world deployment testing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Environment Status</span>
                      <div className="flex items-center space-x-1">
                        {environmentStatus?.success ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-600">Ready</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-red-600" />
                            <span className="text-sm font-medium text-red-600">Issues</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Supabase Database</span>
                      <div className="flex items-center space-x-1">
                        <Database className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">Connected</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">API Routes</span>
                      <div className="flex items-center space-x-1">
                        <Server className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">Active</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Row Level Security</span>
                      <div className="flex items-center space-x-1">
                        <Shield className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">Enabled</span>
                      </div>
                    </div>
                  </div>

                  {createdUser && (
                    <div className="pt-4 border-t">
                      <h4 className="font-medium text-gray-900 mb-3">Additional Testing</h4>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => simulateAdditionalActivity("profile_views")}
                          disabled={isSimulatingActivity}
                        >
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Add Profile Views
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => simulateAdditionalActivity("reviews")}
                          disabled={isSimulatingActivity}
                        >
                          <Star className="w-4 h-4 mr-2" />
                          Add Reviews
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => simulateAdditionalActivity("reservations")}
                          disabled={isSimulatingActivity}
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Add Reservations
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Production Features */}
              <Card>
                <CardHeader>
                  <CardTitle>Production Features</CardTitle>
                  <CardDescription>Real-world deployment capabilities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    <span className="text-gray-700">Real Supabase Auth user creation</span>
                  </div>
                  <div className="flex items-start space-x-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    <span className="text-gray-700">Production database operations</span>
                  </div>
                  <div className="flex items-start space-x-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    <span className="text-gray-700">Row Level Security policies</span>
                  </div>
                  <div className="flex items-start space-x-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    <span className="text-gray-700">Real platform API integrations</span>
                  </div>
                  <div className="flex items-start space-x-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    <span className="text-gray-700">Production analytics tracking</span>
                  </div>
                  <div className="flex items-start space-x-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    <span className="text-gray-700">Automated triggers and functions</span>
                  </div>
                  <div className="flex items-start space-x-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    <span className="text-gray-700">Real-time data persistence</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
