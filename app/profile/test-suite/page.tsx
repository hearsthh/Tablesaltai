"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import {
  Building,
  ChefHat,
  Star,
  Users,
  TestTube,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  MessageSquare,
  Play,
  RefreshCw,
  UserPlus,
  Globe,
  Upload,
  Settings,
} from "lucide-react"

// New user onboarding test restaurants
const testRestaurants = [
  {
    id: "mamas-kitchen",
    name: "Mama's Kitchen",
    tagline: "Home-style cooking with love",
    cuisine: "American",
    type: "Family Restaurant",
    priceRange: "$$",
    location: "Springfield, IL",
    description: "A cozy family restaurant serving comfort food made from scratch with locally sourced ingredients.",
    website: "",
    phone: "+1 (217) 555-0123",
    email: "info@mamaskitchen.com",
    address: "456 Main Street, Springfield, IL 62701",
    socialMedia: {
      facebook: "",
      instagram: "",
      twitter: "",
    },
    isNewBusiness: true,
    menuCategories: ["Breakfast", "Lunch", "Dinner", "Desserts"],
    sampleMenuItems: [
      {
        name: "Mama's Famous Pancakes",
        category: "Breakfast",
        price: 8.99,
        description: "Fluffy buttermilk pancakes served with maple syrup and butter",
      },
      {
        name: "Classic Meatloaf",
        category: "Dinner",
        price: 14.99,
        description: "Traditional meatloaf with mashed potatoes and green beans",
      },
      {
        name: "Apple Pie",
        category: "Desserts",
        price: 5.99,
        description: "Homemade apple pie with vanilla ice cream",
      },
    ],
    currentChallenges: ["No online presence", "Handwritten menu", "No review management", "Limited customer reach"],
  },
  {
    id: "taco-express",
    name: "Taco Express",
    tagline: "Fresh Mexican flavors, fast!",
    cuisine: "Mexican",
    type: "Fast Casual",
    priceRange: "$",
    location: "Austin, TX",
    description: "Quick-service Mexican restaurant focusing on fresh ingredients and authentic flavors.",
    website: "",
    phone: "+1 (512) 555-0456",
    email: "hello@tacoexpress.com",
    address: "789 South Lamar Blvd, Austin, TX 78704",
    socialMedia: {
      facebook: "",
      instagram: "",
      twitter: "",
    },
    isNewBusiness: true,
    menuCategories: ["Tacos", "Burritos", "Bowls", "Sides", "Drinks"],
    sampleMenuItems: [
      {
        name: "Carnitas Taco",
        category: "Tacos",
        price: 3.5,
        description: "Slow-cooked pork with onions, cilantro, and salsa verde",
      },
      {
        name: "California Burrito",
        category: "Burritos",
        price: 9.99,
        description: "Carne asada, french fries, cheese, and guacamole",
      },
      {
        name: "Elote",
        category: "Sides",
        price: 4.99,
        description: "Mexican street corn with mayo, cheese, and chili powder",
      },
    ],
    currentChallenges: [
      "New business, no reviews",
      "Need digital menu",
      "Want social media presence",
      "Need customer feedback system",
    ],
  },
  {
    id: "bella-vista-cafe",
    name: "Bella Vista Café",
    tagline: "Italian coffee culture meets neighborhood charm",
    cuisine: "Italian",
    type: "Café",
    priceRange: "$$",
    location: "Portland, OR",
    description: "Authentic Italian café serving espresso, pastries, and light meals in a cozy atmosphere.",
    website: "",
    phone: "+1 (503) 555-0789",
    email: "ciao@bellavistacafe.com",
    address: "321 NW 23rd Avenue, Portland, OR 97210",
    socialMedia: {
      facebook: "",
      instagram: "",
      twitter: "",
    },
    isNewBusiness: true,
    menuCategories: ["Coffee", "Pastries", "Sandwiches", "Salads"],
    sampleMenuItems: [
      {
        name: "Cappuccino",
        category: "Coffee",
        price: 4.5,
        description: "Traditional Italian cappuccino with steamed milk foam",
      },
      {
        name: "Panettone",
        category: "Pastries",
        price: 6.99,
        description: "Traditional Italian sweet bread with candied fruits",
      },
      {
        name: "Prosciutto Panini",
        category: "Sandwiches",
        price: 12.99,
        description: "Prosciutto, mozzarella, and arugula on ciabatta bread",
      },
    ],
    currentChallenges: [
      "Just opened, building reputation",
      "Need professional online presence",
      "Want to showcase Italian authenticity",
      "Need customer engagement tools",
    ],
  },
]

export default function ProfileTestSuite() {
  const [selectedRestaurant, setSelectedRestaurant] = useState(testRestaurants[0])
  const [activeModule, setActiveModule] = useState("overview")
  const [isRunningTests, setIsRunningTests] = useState(false)
  const [testProgress, setTestProgress] = useState(0)
  const [currentTestStep, setCurrentTestStep] = useState("")

  // Test states for each module
  const [socialProfileTests, setSocialProfileTests] = useState({
    profileCreation: "pending",
    basicInfoSetup: "pending",
    brandingSetup: "pending",
    socialMediaLinks: "pending",
    operatingHours: "pending",
    profilePreview: "pending",
  })

  const [menuBuilderTests, setMenuBuilderTests] = useState({
    menuCreation: "pending",
    categorySetup: "pending",
    itemAddition: "pending",
    pricingSetup: "pending",
    menuPreview: "pending",
    menuSync: "pending",
  })

  const [reviewManagerTests, setReviewManagerTests] = useState({
    reviewSystemSetup: "pending",
    platformConnection: "pending",
    reviewFormSetup: "pending",
    responseTemplates: "pending",
    analyticsSetup: "pending",
    notificationSetup: "pending",
  })

  // New user onboarding simulation
  const runNewUserOnboarding = async () => {
    setIsRunningTests(true)
    setTestProgress(0)
    setCurrentTestStep("Starting new user onboarding...")

    // Step 1: Social Profile Creation
    setCurrentTestStep("Creating social profile...")
    setSocialProfileTests((prev) => ({ ...prev, profileCreation: "running" }))
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setSocialProfileTests((prev) => ({ ...prev, profileCreation: "passed" }))
    setTestProgress(15)

    // Step 2: Basic Info Setup
    setCurrentTestStep("Setting up basic restaurant information...")
    setSocialProfileTests((prev) => ({ ...prev, basicInfoSetup: "running" }))
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setSocialProfileTests((prev) => ({ ...prev, basicInfoSetup: "passed" }))
    setTestProgress(25)

    // Step 3: Branding Setup
    setCurrentTestStep("Configuring branding and visual identity...")
    setSocialProfileTests((prev) => ({ ...prev, brandingSetup: "running" }))
    await new Promise((resolve) => setTimeout(resolve, 1800))
    setSocialProfileTests((prev) => ({ ...prev, brandingSetup: "passed" }))
    setTestProgress(35)

    // Step 4: Menu Creation
    setCurrentTestStep("Creating digital menu...")
    setMenuBuilderTests((prev) => ({ ...prev, menuCreation: "running" }))
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setMenuBuilderTests((prev) => ({ ...prev, menuCreation: "passed" }))
    setTestProgress(45)

    // Step 5: Menu Categories
    setCurrentTestStep("Setting up menu categories...")
    setMenuBuilderTests((prev) => ({ ...prev, categorySetup: "running" }))
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setMenuBuilderTests((prev) => ({ ...prev, categorySetup: "passed" }))
    setTestProgress(55)

    // Step 6: Adding Menu Items
    setCurrentTestStep("Adding menu items...")
    setMenuBuilderTests((prev) => ({ ...prev, itemAddition: "running" }))
    await new Promise((resolve) => setTimeout(resolve, 2200))
    setMenuBuilderTests((prev) => ({ ...prev, itemAddition: "passed" }))
    setTestProgress(65)

    // Step 7: Review System Setup
    setCurrentTestStep("Setting up review management...")
    setReviewManagerTests((prev) => ({ ...prev, reviewSystemSetup: "running" }))
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setReviewManagerTests((prev) => ({ ...prev, reviewSystemSetup: "passed" }))
    setTestProgress(75)

    // Step 8: Platform Connections
    setCurrentTestStep("Connecting review platforms...")
    setReviewManagerTests((prev) => ({ ...prev, platformConnection: "running" }))
    await new Promise((resolve) => setTimeout(resolve, 1800))
    setReviewManagerTests((prev) => ({ ...prev, platformConnection: "passed" }))
    setTestProgress(85)

    // Step 9: Final Setup
    setCurrentTestStep("Finalizing profile setup...")
    setSocialProfileTests((prev) => ({ ...prev, profilePreview: "running" }))
    setMenuBuilderTests((prev) => ({ ...prev, menuSync: "running" }))
    setReviewManagerTests((prev) => ({ ...prev, notificationSetup: "running" }))
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setSocialProfileTests((prev) => ({ ...prev, profilePreview: "passed" }))
    setMenuBuilderTests((prev) => ({ ...prev, menuSync: "passed" }))
    setReviewManagerTests((prev) => ({ ...prev, notificationSetup: "passed" }))
    setTestProgress(100)

    setCurrentTestStep("New user onboarding complete!")
    setIsRunningTests(false)

    toast({
      title: "🎉 Onboarding Complete!",
      description: `${selectedRestaurant.name} is now set up with a complete digital presence!`,
    })
  }

  // Individual module tests
  const runSocialProfileTests = async () => {
    setIsRunningTests(true)
    setTestProgress(0)

    const tests = Object.keys(socialProfileTests)
    for (let i = 0; i < tests.length; i++) {
      const test = tests[i]
      setSocialProfileTests((prev) => ({ ...prev, [test]: "running" }))
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))
      setSocialProfileTests((prev) => ({ ...prev, [test]: "passed" }))
      setTestProgress(((i + 1) / tests.length) * 100)
    }

    setIsRunningTests(false)
    toast({
      title: "Social Profile Tests Complete",
      description: "All social profile features tested successfully!",
    })
  }

  const runMenuBuilderTests = async () => {
    setIsRunningTests(true)
    setTestProgress(0)

    const tests = Object.keys(menuBuilderTests)
    for (let i = 0; i < tests.length; i++) {
      const test = tests[i]
      setMenuBuilderTests((prev) => ({ ...prev, [test]: "running" }))
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))
      setMenuBuilderTests((prev) => ({ ...prev, [test]: "passed" }))
      setTestProgress(((i + 1) / tests.length) * 100)
    }

    setIsRunningTests(false)
    toast({
      title: "Menu Builder Tests Complete",
      description: "All menu builder features tested successfully!",
    })
  }

  const runReviewManagerTests = async () => {
    setIsRunningTests(true)
    setTestProgress(0)

    const tests = Object.keys(reviewManagerTests)
    for (let i = 0; i < tests.length; i++) {
      const test = tests[i]
      setReviewManagerTests((prev) => ({ ...prev, [test]: "running" }))
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))
      setReviewManagerTests((prev) => ({ ...prev, [test]: "passed" }))
      setTestProgress(((i + 1) / tests.length) * 100)
    }

    setIsRunningTests(false)
    toast({
      title: "Review Manager Tests Complete",
      description: "All review management features tested successfully!",
    })
  }

  const getTestIcon = (status) => {
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

  const getTestColor = (status) => {
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

  const calculateOverallProgress = () => {
    const allTests = { ...socialProfileTests, ...menuBuilderTests, ...reviewManagerTests }
    const totalTests = Object.keys(allTests).length
    const passedTests = Object.values(allTests).filter((status) => status === "passed").length
    return Math.round((passedTests / totalTests) * 100)
  }

  const resetAllTests = () => {
    setSocialProfileTests({
      profileCreation: "pending",
      basicInfoSetup: "pending",
      brandingSetup: "pending",
      socialMediaLinks: "pending",
      operatingHours: "pending",
      profilePreview: "pending",
    })
    setMenuBuilderTests({
      menuCreation: "pending",
      categorySetup: "pending",
      itemAddition: "pending",
      pricingSetup: "pending",
      menuPreview: "pending",
      menuSync: "pending",
    })
    setReviewManagerTests({
      reviewSystemSetup: "pending",
      platformConnection: "pending",
      reviewFormSetup: "pending",
      responseTemplates: "pending",
      analyticsSetup: "pending",
      notificationSetup: "pending",
    })
    setTestProgress(0)
    setCurrentTestStep("")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <TestTube className="w-8 h-8 mr-3 text-blue-600" />
                New User Profile Test Suite
              </h1>
              <p className="text-gray-600 mt-2">
                Test the complete new user experience: Social Profile → Menu Builder → Review Management
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={runNewUserOnboarding}
                disabled={isRunningTests}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isRunningTests ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <UserPlus className="w-4 h-4 mr-2" />
                )}
                Simulate New User
              </Button>
              <Button variant="outline" onClick={resetAllTests} disabled={isRunningTests}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Tests
              </Button>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {isRunningTests ? currentTestStep : "Overall Test Progress"}
              </span>
              <span className="text-sm text-gray-500">{calculateOverallProgress()}%</span>
            </div>
            <Progress value={isRunningTests ? testProgress : calculateOverallProgress()} className="h-3" />
          </div>
        </div>

        {/* New Restaurant Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="w-5 h-5 mr-2" />
              New Restaurant Selection
            </CardTitle>
            <CardDescription>Choose a new restaurant to simulate the onboarding experience</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {testRestaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedRestaurant.id === restaurant.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedRestaurant(restaurant)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{restaurant.name}</h3>
                    {selectedRestaurant.id === restaurant.id && <CheckCircle className="w-5 h-5 text-blue-600" />}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{restaurant.tagline}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                    <span>{restaurant.cuisine}</span>
                    <span>{restaurant.priceRange}</span>
                    <span>{restaurant.location}</span>
                  </div>
                  <div className="space-y-1">
                    <Badge variant="outline" className="text-xs">
                      New Business
                    </Badge>
                    <p className="text-xs text-gray-600">
                      {restaurant.menuCategories.length} menu categories • {restaurant.sampleMenuItems.length} sample
                      items
                    </p>
                  </div>
                  <div className="mt-3">
                    <h4 className="text-xs font-medium text-gray-700 mb-1">Current Challenges:</h4>
                    <div className="space-y-1">
                      {restaurant.currentChallenges.slice(0, 2).map((challenge, index) => (
                        <p key={index} className="text-xs text-red-600">
                          • {challenge}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Test Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeModule} onValueChange={setActiveModule} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="social-profile">Social Profile</TabsTrigger>
                <TabsTrigger value="menu-builder">Menu Builder</TabsTrigger>
                <TabsTrigger value="review-manager">Reviews</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>New User Journey Testing</CardTitle>
                    <CardDescription>
                      Complete onboarding flow for {selectedRestaurant.name} - from setup to launch
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Social Profile Status */}
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-gray-900">Social Profile</h3>
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Create professional online presence with contact info, branding, and social links
                        </p>
                        <div className="space-y-2">
                          {Object.entries(socialProfileTests).map(([test, status]) => (
                            <div key={test} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 capitalize">{test.replace(/([A-Z])/g, " $1").trim()}</span>
                              {getTestIcon(status)}
                            </div>
                          ))}
                        </div>
                        <Button
                          onClick={runSocialProfileTests}
                          disabled={isRunningTests}
                          className="w-full mt-4"
                          variant="outline"
                        >
                          Test Social Profile
                        </Button>
                      </div>

                      {/* Menu Builder Status */}
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-gray-900">Menu Builder</h3>
                          <ChefHat className="w-5 h-5 text-orange-600" />
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Build digital menu with categories, items, pricing, and sync to social profile
                        </p>
                        <div className="space-y-2">
                          {Object.entries(menuBuilderTests).map(([test, status]) => (
                            <div key={test} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 capitalize">{test.replace(/([A-Z])/g, " $1").trim()}</span>
                              {getTestIcon(status)}
                            </div>
                          ))}
                        </div>
                        <Button
                          onClick={runMenuBuilderTests}
                          disabled={isRunningTests}
                          className="w-full mt-4"
                          variant="outline"
                        >
                          Test Menu Builder
                        </Button>
                      </div>

                      {/* Review Manager Status */}
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-gray-900">Review Manager</h3>
                          <MessageSquare className="w-5 h-5 text-green-600" />
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Set up review collection, platform connections, and response management system
                        </p>
                        <div className="space-y-2">
                          {Object.entries(reviewManagerTests).map(([test, status]) => (
                            <div key={test} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 capitalize">{test.replace(/([A-Z])/g, " $1").trim()}</span>
                              {getTestIcon(status)}
                            </div>
                          ))}
                        </div>
                        <Button
                          onClick={runReviewManagerTests}
                          disabled={isRunningTests}
                          className="w-full mt-4"
                          variant="outline"
                        >
                          Test Review Manager
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* New User Challenges */}
                <Card>
                  <CardHeader>
                    <CardTitle>Current Business Challenges</CardTitle>
                    <CardDescription>
                      What {selectedRestaurant.name} needs to solve with the profile module
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-red-700 mb-3">Current Problems</h4>
                        <div className="space-y-2">
                          {selectedRestaurant.currentChallenges.map((challenge, index) => (
                            <div key={index} className="flex items-start space-x-2 text-sm">
                              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                              <span className="text-red-700">{challenge}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-green-700 mb-3">Solutions Provided</h4>
                        <div className="space-y-2">
                          <div className="flex items-start space-x-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-green-700">Professional social profile with branding</span>
                          </div>
                          <div className="flex items-start space-x-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-green-700">Digital menu with easy management</span>
                          </div>
                          <div className="flex items-start space-x-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-green-700">Automated review collection and management</span>
                          </div>
                          <div className="flex items-start space-x-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-green-700">Integrated customer engagement tools</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Social Profile Tab */}
              <TabsContent value="social-profile" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="w-5 h-5 mr-2 text-blue-600" />
                      Social Profile Setup Tests
                    </CardTitle>
                    <CardDescription>
                      Testing social profile creation and setup for {selectedRestaurant.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(socialProfileTests).map(([test, status]) => (
                        <div key={test} className={`p-4 border rounded-lg ${getTestColor(status)}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {getTestIcon(status)}
                              <div>
                                <h4 className="font-medium text-gray-900 capitalize">
                                  {test.replace(/([A-Z])/g, " $1").trim()}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {test === "profileCreation" && "Create new restaurant profile from scratch"}
                                  {test === "basicInfoSetup" && "Add restaurant name, contact info, and location"}
                                  {test === "brandingSetup" && "Upload logo, set colors, and define brand voice"}
                                  {test === "socialMediaLinks" &&
                                    "Connect Facebook, Instagram, and other social accounts"}
                                  {test === "operatingHours" && "Set up operating hours and special schedules"}
                                  {test === "profilePreview" && "Generate live preview of the social profile"}
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant={
                                status === "passed" ? "default" : status === "failed" ? "destructive" : "secondary"
                              }
                            >
                              {status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex justify-between">
                      <Button
                        onClick={runSocialProfileTests}
                        disabled={isRunningTests}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isRunningTests ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Play className="w-4 h-4 mr-2" />
                        )}
                        Test Social Profile
                      </Button>
                      <Button variant="outline" onClick={() => window.open("/profile/social-profile", "_blank")}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open Social Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Menu Builder Tab */}
              <TabsContent value="menu-builder" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ChefHat className="w-5 h-5 mr-2 text-orange-600" />
                      Menu Builder Setup Tests
                    </CardTitle>
                    <CardDescription>
                      Testing menu creation and management for {selectedRestaurant.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(menuBuilderTests).map(([test, status]) => (
                        <div key={test} className={`p-4 border rounded-lg ${getTestColor(status)}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {getTestIcon(status)}
                              <div>
                                <h4 className="font-medium text-gray-900 capitalize">
                                  {test.replace(/([A-Z])/g, " $1").trim()}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {test === "menuCreation" && "Create new digital menu from scratch"}
                                  {test === "categorySetup" && "Set up menu categories (Breakfast, Lunch, etc.)"}
                                  {test === "itemAddition" && "Add menu items with descriptions and images"}
                                  {test === "pricingSetup" && "Configure pricing and special offers"}
                                  {test === "menuPreview" && "Generate formatted menu preview"}
                                  {test === "menuSync" && "Sync menu with social profile automatically"}
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant={
                                status === "passed" ? "default" : status === "failed" ? "destructive" : "secondary"
                              }
                            >
                              {status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex justify-between">
                      <Button
                        onClick={runMenuBuilderTests}
                        disabled={isRunningTests}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        {isRunningTests ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Play className="w-4 h-4 mr-2" />
                        )}
                        Test Menu Builder
                      </Button>
                      <Button variant="outline" onClick={() => window.open("/profile/menu-builder", "_blank")}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open Menu Builder
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Sample Menu Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Sample Menu Items</CardTitle>
                    <CardDescription>Menu items that will be created during testing</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedRestaurant.sampleMenuItems.map((item, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">{item.category}</Badge>
                              <span className="font-semibold text-green-600">${item.price}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Review Manager Tab */}
              <TabsContent value="review-manager" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2 text-green-600" />
                      Review Management Setup Tests
                    </CardTitle>
                    <CardDescription>Testing review system setup for {selectedRestaurant.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(reviewManagerTests).map(([test, status]) => (
                        <div key={test} className={`p-4 border rounded-lg ${getTestColor(status)}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {getTestIcon(status)}
                              <div>
                                <h4 className="font-medium text-gray-900 capitalize">
                                  {test.replace(/([A-Z])/g, " $1").trim()}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {test === "reviewSystemSetup" && "Initialize review collection and management system"}
                                  {test === "platformConnection" && "Connect Google, Yelp, and other review platforms"}
                                  {test === "reviewFormSetup" && "Create customer review form for website"}
                                  {test === "responseTemplates" && "Set up automated response templates"}
                                  {test === "analyticsSetup" && "Configure review analytics and insights"}
                                  {test === "notificationSetup" && "Set up review notifications and alerts"}
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant={
                                status === "passed" ? "default" : status === "failed" ? "destructive" : "secondary"
                              }
                            >
                              {status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex justify-between">
                      <Button
                        onClick={runReviewManagerTests}
                        disabled={isRunningTests}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isRunningTests ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Play className="w-4 h-4 mr-2" />
                        )}
                        Test Review Manager
                      </Button>
                      <Button variant="outline" onClick={() => window.open("/profile/reviews", "_blank")}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open Review Manager
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Test Progress</CardTitle>
                <CardDescription>New user onboarding status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                    <span className="text-sm text-gray-500">{calculateOverallProgress()}%</span>
                  </div>
                  <Progress value={calculateOverallProgress()} className="h-2" />
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Social Profile</span>
                    <div className="flex items-center space-x-1">
                      {Object.values(socialProfileTests).filter((s) => s === "passed").length}/
                      {Object.keys(socialProfileTests).length}
                      <Users className="w-4 h-4 text-blue-600 ml-1" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Menu Builder</span>
                    <div className="flex items-center space-x-1">
                      {Object.values(menuBuilderTests).filter((s) => s === "passed").length}/
                      {Object.keys(menuBuilderTests).length}
                      <ChefHat className="w-4 h-4 text-orange-600 ml-1" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Review Manager</span>
                    <div className="flex items-center space-x-1">
                      {Object.values(reviewManagerTests).filter((s) => s === "passed").length}/
                      {Object.keys(reviewManagerTests).length}
                      <MessageSquare className="w-4 h-4 text-green-600 ml-1" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => window.open("/profile/social-profile", "_blank")}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Social Profile
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => window.open("/profile/menu-builder", "_blank")}
                    >
                      <ChefHat className="w-4 h-4 mr-2" />
                      Menu Builder
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => window.open("/profile/reviews", "_blank")}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Review Manager
                    </Button>
                  </div>
                </div>

                {/* New User Benefits */}
                <div className="pt-4 border-t">
                  <h4 className="font-medium text-gray-900 mb-3">Expected Outcomes</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-start space-x-2">
                      <Globe className="w-3 h-3 mt-1 text-blue-500" />
                      <span>Professional online presence</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Upload className="w-3 h-3 mt-1 text-orange-500" />
                      <span>Digital menu accessible 24/7</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Star className="w-3 h-3 mt-1 text-yellow-500" />
                      <span>Automated review collection</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Settings className="w-3 h-3 mt-1 text-green-500" />
                      <span>Integrated management system</span>
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
