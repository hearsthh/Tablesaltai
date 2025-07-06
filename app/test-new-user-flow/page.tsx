"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import {
  UserPlus,
  Settings,
  Database,
  TestTube,
  CheckCircle,
  AlertCircle,
  Loader2,
  Play,
  BarChart3,
  MessageSquare,
  Utensils,
  Star,
  Clock,
  Zap,
} from "lucide-react"

interface TestStep {
  id: string
  name: string
  status: "pending" | "running" | "completed" | "failed"
  data?: any
  error?: string
}

export default function TestNewUserFlowPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [testSteps, setTestSteps] = useState<TestStep[]>([
    { id: "signup", name: "User Signup", status: "pending" },
    { id: "onboarding", name: "Restaurant Onboarding", status: "pending" },
    { id: "data-generation", name: "AI Data Generation", status: "pending" },
    { id: "menu-manager", name: "Menu Manager Test", status: "pending" },
    { id: "review-manager", name: "Review Manager Test", status: "pending" },
  ])

  const [testData, setTestData] = useState({
    email: "test@newrestaurant.com",
    restaurantName: "Bella Vista Italiana",
    cuisine: "Italian",
    type: "Fine Dining",
    priceRange: "$$$",
    address: "123 Main Street, Downtown, City 12345",
    phone: "+1-555-0199",
    website: "www.bellavista.com",
    description: "Authentic Italian cuisine with a modern twist, featuring fresh ingredients and traditional recipes.",
    tagline: "Where tradition meets innovation",
  })

  const [userId, setUserId] = useState<string>("")
  const [restaurantId, setRestaurantId] = useState<string>("")

  const updateStepStatus = (stepId: string, status: TestStep["status"], data?: any, error?: string) => {
    setTestSteps((prev) => prev.map((step) => (step.id === stepId ? { ...step, status, data, error } : step)))
  }

  const runCompleteTest = async () => {
    setIsRunning(true)
    setCurrentStep(0)

    try {
      // Step 1: Test User Signup
      setCurrentStep(1)
      updateStepStatus("signup", "running")

      const signupResponse = await fetch("/api/test-user-flow/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testUserEmail: testData.email,
          restaurantName: testData.restaurantName,
        }),
      })

      const signupData = await signupResponse.json()

      if (signupData.success) {
        updateStepStatus("signup", "completed", signupData.data)
        setUserId(signupData.data.userId)
        setRestaurantId(signupData.data.profile.id)
        toast({
          title: "✅ Signup Successful",
          description: `User created with AI welcome message`,
        })
      } else {
        throw new Error(signupData.details || "Signup failed")
      }

      // Step 2: Test Onboarding
      setCurrentStep(2)
      updateStepStatus("onboarding", "running")

      const onboardingResponse = await fetch("/api/test-user-flow/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: signupData.data.userId,
          restaurantData: testData,
        }),
      })

      const onboardingData = await onboardingResponse.json()

      if (onboardingData.success) {
        updateStepStatus("onboarding", "completed", onboardingData.data)
        toast({
          title: "✅ Onboarding Complete",
          description: "Profile setup with AI business insights",
        })
      } else {
        throw new Error(onboardingData.details || "Onboarding failed")
      }

      // Step 3: Test AI Data Generation
      setCurrentStep(3)
      updateStepStatus("data-generation", "running")

      const dataGenResponse = await fetch("/api/test-user-flow/data-generation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: signupData.data.userId,
          restaurantId: signupData.data.profile.id,
        }),
      })

      const dataGenData = await dataGenResponse.json()

      if (dataGenData.success) {
        updateStepStatus("data-generation", "completed", dataGenData.data)
        toast({
          title: "✅ AI Data Generated",
          description: `Created ${dataGenData.data.generated.menuItems} menu items and ${dataGenData.data.generated.reviews} reviews`,
        })
      } else {
        throw new Error(dataGenData.details || "Data generation failed")
      }

      // Step 4: Test Menu Manager
      setCurrentStep(4)
      updateStepStatus("menu-manager", "running")

      const menuTestResponse = await fetch("/api/test-app-features/menu-manager", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: signupData.data.profile.id,
        }),
      })

      const menuTestData = await menuTestResponse.json()

      if (menuTestData.success) {
        updateStepStatus("menu-manager", "completed", menuTestData.data)
        toast({
          title: "✅ Menu Manager Tested",
          description: "All AI menu features working correctly",
        })
      } else {
        throw new Error(menuTestData.details || "Menu manager test failed")
      }

      // Step 5: Test Review Manager
      setCurrentStep(5)
      updateStepStatus("review-manager", "running")

      const reviewTestResponse = await fetch("/api/test-app-features/review-manager", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: signupData.data.profile.id,
        }),
      })

      const reviewTestData = await reviewTestResponse.json()

      if (reviewTestData.success) {
        updateStepStatus("review-manager", "completed", reviewTestData.data)
        toast({
          title: "🎉 All Tests Completed!",
          description: "New user flow and all features tested successfully",
        })
      } else {
        throw new Error(reviewTestData.details || "Review manager test failed")
      }
    } catch (error) {
      const failedStep = testSteps[currentStep - 1]
      if (failedStep) {
        updateStepStatus(failedStep.id, "failed", null, error instanceof Error ? error.message : "Unknown error")
      }

      toast({
        title: "❌ Test Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      })
    } finally {
      setIsRunning(false)
      setCurrentStep(0)
    }
  }

  const getStepIcon = (status: TestStep["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "running":
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
      case "failed":
        return <AlertCircle className="w-5 h-5 text-red-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStepColor = (status: TestStep["status"]) => {
    switch (status) {
      case "completed":
        return "border-green-200 bg-green-50"
      case "running":
        return "border-blue-200 bg-blue-50"
      case "failed":
        return "border-red-200 bg-red-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const completedSteps = testSteps.filter((step) => step.status === "completed").length
  const progressPercentage = (completedSteps / testSteps.length) * 100

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">New User Flow Testing</h1>
          <p className="text-gray-600">
            Complete end-to-end testing of new user signup, onboarding, and AI feature functionality
          </p>
        </div>

        <Tabs defaultValue="setup" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="testing">Testing</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          {/* Setup Tab */}
          <TabsContent value="setup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Test Configuration
                </CardTitle>
                <CardDescription>Configure the test restaurant data for comprehensive testing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Test Email</Label>
                    <Input
                      id="email"
                      value={testData.email}
                      onChange={(e) => setTestData((prev) => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="restaurantName">Restaurant Name</Label>
                    <Input
                      id="restaurantName"
                      value={testData.restaurantName}
                      onChange={(e) => setTestData((prev) => ({ ...prev, restaurantName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cuisine">Cuisine Type</Label>
                    <Input
                      id="cuisine"
                      value={testData.cuisine}
                      onChange={(e) => setTestData((prev) => ({ ...prev, cuisine: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Restaurant Type</Label>
                    <Input
                      id="type"
                      value={testData.type}
                      onChange={(e) => setTestData((prev) => ({ ...prev, type: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="priceRange">Price Range</Label>
                    <Input
                      id="priceRange"
                      value={testData.priceRange}
                      onChange={(e) => setTestData((prev) => ({ ...prev, priceRange: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={testData.phone}
                      onChange={(e) => setTestData((prev) => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={testData.address}
                    onChange={(e) => setTestData((prev) => ({ ...prev, address: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={testData.description}
                    onChange={(e) => setTestData((prev) => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Test Overview</CardTitle>
                <CardDescription>What will be tested in this flow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <UserPlus className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-blue-900">User Signup</h3>
                    <p className="text-sm text-blue-700">Account creation & AI welcome</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Settings className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-green-900">Onboarding</h3>
                    <p className="text-sm text-green-700">Profile setup & AI insights</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Database className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-purple-900">Data Generation</h3>
                    <p className="text-sm text-purple-700">AI-powered mock data</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <Utensils className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-orange-900">Menu Manager</h3>
                    <p className="text-sm text-orange-700">AI menu analysis & optimization</p>
                  </div>
                  <div className="text-center p-4 bg-pink-50 rounded-lg">
                    <MessageSquare className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-pink-900">Review Manager</h3>
                    <p className="text-sm text-pink-700">AI sentiment & response generation</p>
                  </div>
                  <div className="text-center p-4 bg-indigo-50 rounded-lg">
                    <BarChart3 className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-indigo-900">Analytics</h3>
                    <p className="text-sm text-indigo-700">Performance metrics & insights</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testing Tab */}
          <TabsContent value="testing" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <TestTube className="w-5 h-5 mr-2" />
                      Test Execution
                    </CardTitle>
                    <CardDescription>Running comprehensive new user flow testing</CardDescription>
                  </div>
                  <Button
                    onClick={runCompleteTest}
                    disabled={isRunning}
                    className="bg-black hover:bg-gray-800 text-white"
                  >
                    {isRunning ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Run Complete Test
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Overall Progress</span>
                      <span>
                        {completedSteps}/{testSteps.length} completed
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    {testSteps.map((step, index) => (
                      <div key={step.id} className={`p-4 rounded-lg border-2 ${getStepColor(step.status)}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getStepIcon(step.status)}
                            <div>
                              <h3 className="font-medium">{step.name}</h3>
                              {step.status === "running" && <p className="text-sm text-blue-600">Processing...</p>}
                              {step.status === "completed" && (
                                <p className="text-sm text-green-600">Completed successfully</p>
                              )}
                              {step.status === "failed" && <p className="text-sm text-red-600">{step.error}</p>}
                            </div>
                          </div>
                          <Badge
                            variant={
                              step.status === "completed"
                                ? "default"
                                : step.status === "running"
                                  ? "secondary"
                                  : step.status === "failed"
                                    ? "destructive"
                                    : "outline"
                            }
                          >
                            {step.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            {testSteps.some((step) => step.status === "completed") ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {testSteps
                  .filter((step) => step.status === "completed" && step.data)
                  .map((step) => (
                    <Card key={step.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                          {step.name} Results
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {step.id === "signup" && step.data && (
                            <>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">User ID</span>
                                <span className="font-mono text-sm">{step.data.userId}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Restaurant</span>
                                <span className="font-medium">{step.data.profile.restaurant_name}</span>
                              </div>
                              <div className="p-3 bg-blue-50 rounded">
                                <p className="text-sm font-medium text-blue-900 mb-1">AI Welcome Message:</p>
                                <p className="text-sm text-blue-800">
                                  {step.data.welcomeContent?.substring(0, 200)}...
                                </p>
                              </div>
                            </>
                          )}

                          {step.id === "data-generation" && step.data && (
                            <>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-green-600">
                                    {step.data.generated.menuItems}
                                  </div>
                                  <div className="text-sm text-gray-600">Menu Items</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-blue-600">{step.data.generated.reviews}</div>
                                  <div className="text-sm text-gray-600">Reviews</div>
                                </div>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Average Rating</span>
                                <div className="flex items-center">
                                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                                  <span className="font-medium">{step.data.generated.averageRating?.toFixed(1)}</span>
                                </div>
                              </div>
                            </>
                          )}

                          {step.id === "menu-manager" && step.data && (
                            <>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-purple-600">
                                    {step.data.menuMetrics.totalItems}
                                  </div>
                                  <div className="text-sm text-gray-600">Total Items</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-orange-600">
                                    ${step.data.menuMetrics.averagePrice?.toFixed(2)}
                                  </div>
                                  <div className="text-sm text-gray-600">Avg Price</div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                {Object.entries(step.data.testResults).map(([key, value]) => (
                                  <div key={key} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 capitalize">
                                      {key.replace(/([A-Z])/g, " $1").trim()}
                                    </span>
                                    {value ? (
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                    ) : (
                                      <AlertCircle className="w-4 h-4 text-red-600" />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </>
                          )}

                          {step.id === "review-manager" && step.data && (
                            <>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-blue-600">
                                    {step.data.reviewMetrics.totalReviews}
                                  </div>
                                  <div className="text-sm text-gray-600">Total Reviews</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-yellow-600">
                                    {step.data.reviewMetrics.averageRating?.toFixed(1)}
                                  </div>
                                  <div className="text-sm text-gray-600">Avg Rating</div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                {Object.entries(step.data.testResults).map(([key, value]) => (
                                  <div key={key} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 capitalize">
                                      {key.replace(/([A-Z])/g, " $1").trim()}
                                    </span>
                                    {value ? (
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                    ) : (
                                      <AlertCircle className="w-4 h-4 text-red-600" />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <TestTube className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Yet</h3>
                  <p className="text-gray-600 mb-4">Run the complete test to see detailed results</p>
                  <Button onClick={() => document.querySelector('[value="testing"]')?.click()}>
                    <Play className="w-4 h-4 mr-2" />
                    Go to Testing
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            {testSteps.some((step) => step.data?.aiAnalysis || step.data?.aiInsights) ? (
              <div className="space-y-6">
                {testSteps
                  .filter((step) => step.data?.aiAnalysis || step.data?.aiInsights)
                  .map((step) => (
                    <Card key={step.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Zap className="w-5 h-5 mr-2 text-purple-600" />
                          {step.name} - AI Insights
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {step.data.aiAnalysis && (
                            <>
                              {step.data.aiAnalysis.menuAnalysis && (
                                <div className="p-4 bg-blue-50 rounded-lg">
                                  <h4 className="font-medium text-blue-900 mb-2">Menu Analysis</h4>
                                  <p className="text-sm text-blue-800">
                                    {step.data.aiAnalysis.menuAnalysis.substring(0, 300)}...
                                  </p>
                                </div>
                              )}

                              {step.data.aiAnalysis.topicAnalysis && (
                                <div className="p-4 bg-green-50 rounded-lg">
                                  <h4 className="font-medium text-green-900 mb-2">Review Topic Analysis</h4>
                                  <p className="text-sm text-green-800">
                                    {step.data.aiAnalysis.topicAnalysis.substring(0, 300)}...
                                  </p>
                                </div>
                              )}

                              {step.data.aiAnalysis.improvementRecommendations && (
                                <div className="p-4 bg-orange-50 rounded-lg">
                                  <h4 className="font-medium text-orange-900 mb-2">Improvement Recommendations</h4>
                                  <p className="text-sm text-orange-800">
                                    {step.data.aiAnalysis.improvementRecommendations.substring(0, 300)}...
                                  </p>
                                </div>
                              )}
                            </>
                          )}

                          {step.data.aiInsights && (
                            <div className="p-4 bg-purple-50 rounded-lg">
                              <h4 className="font-medium text-purple-900 mb-2">Customer Insights</h4>
                              <p className="text-sm text-purple-800">
                                {JSON.stringify(step.data.aiInsights).substring(0, 300)}...
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No AI Insights Yet</h3>
                  <p className="text-gray-600 mb-4">Run the complete test to see AI-generated insights and analysis</p>
                  <Button onClick={() => document.querySelector('[value="testing"]')?.click()}>
                    <Play className="w-4 h-4 mr-2" />
                    Start Testing
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
