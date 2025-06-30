"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import {
  CheckCircle,
  XCircle,
  Loader2,
  Database,
  Users,
  ChefHat,
  MessageSquare,
  TrendingUp,
  BarChart3,
  Sparkles,
  Settings,
  Play,
  RefreshCw,
} from "lucide-react"
import { MockApiService } from "@/lib/mock-data/mock-api-service"
import { mockAuthService } from "@/lib/mock-data/mock-auth-service"
import { useMockDatabase } from "@/lib/mock-data/mock-database"

interface TestResult {
  name: string
  status: "pending" | "running" | "success" | "error"
  message: string
  duration?: number
}

export default function TestMockFeaturesPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [overallProgress, setOverallProgress] = useState(0)
  const mockData = useMockDatabase()

  const featureTests = [
    {
      name: "Mock Database Connection",
      test: async () => {
        const result = await MockApiService.testConnection()
        if (result.error) throw new Error(result.error)
        return "Mock database connected successfully"
      },
    },
    {
      name: "Restaurant Profile Management",
      test: async () => {
        const profile = await MockApiService.getRestaurantProfile()
        if (profile.error) throw new Error(profile.error)

        // Test update
        await MockApiService.updateRestaurantProfile({ name: "Updated Restaurant Name" })
        return `Profile loaded: ${profile.data.name}`
      },
    },
    {
      name: "Menu Management System",
      test: async () => {
        const menu = await MockApiService.getMenu()
        if (menu.error) throw new Error(menu.error)

        const totalItems = menu.data.categories.reduce((sum, cat) => sum + cat.items.length, 0)
        return `Menu loaded: ${menu.data.categories.length} categories, ${totalItems} items`
      },
    },
    {
      name: "Customer Management",
      test: async () => {
        const customers = await MockApiService.getCustomers()
        if (customers.error) throw new Error(customers.error)

        // Test customer creation
        await MockApiService.createCustomer({
          name: "Test Customer",
          email: "test@example.com",
          phone: "+1234567890",
        })

        return `Customer system working: ${customers.data.length} customers loaded`
      },
    },
    {
      name: "Review System",
      test: async () => {
        const reviews = await MockApiService.getReviews()
        if (reviews.error) throw new Error(reviews.error)

        const summary = await MockApiService.getReviewSummary()
        if (summary.error) throw new Error(summary.error)

        return `Reviews loaded: ${reviews.data.length} reviews, avg rating ${summary.data.average_rating}`
      },
    },
    {
      name: "Marketing Campaigns",
      test: async () => {
        const campaigns = await MockApiService.getCampaigns()
        if (campaigns.error) throw new Error(campaigns.error)

        // Test campaign creation
        await MockApiService.createCampaign({
          name: "Test Campaign",
          type: "promotion",
          status: "draft",
          budget: 1000,
        })

        return `Marketing system working: ${campaigns.data.length} campaigns`
      },
    },
    {
      name: "Analytics Dashboard",
      test: async () => {
        const analytics = await MockApiService.getAnalytics()
        if (analytics.error) throw new Error(analytics.error)

        const revenue = await MockApiService.getRevenueAnalytics()
        if (revenue.error) throw new Error(revenue.error)

        return `Analytics loaded: $${analytics.data.revenue.total} total revenue`
      },
    },
    {
      name: "AI Content Generation",
      test: async () => {
        const content = await MockApiService.generateContent("combos", { menuItems: ["item1", "item2"] })
        if (content.error) throw new Error(content.error)

        const allContent = await MockApiService.getGeneratedContent()
        if (allContent.error) throw new Error(allContent.error)

        return `AI content generation working: ${allContent.data.length} items generated`
      },
    },
    {
      name: "Authentication System",
      test: async () => {
        const user = await mockAuthService.getCurrentUser()
        if (user.error) throw new Error(user.error)

        const profile = await mockAuthService.getUserProfile(user.user.id)
        if (profile.error) throw new Error(profile.error)

        return `Auth working: User ${user.user.name} authenticated`
      },
    },
    {
      name: "Data Store Integration",
      test: async () => {
        // Test Zustand store
        const storeData = useMockDatabase.getState()

        // Test store updates
        storeData.updateRestaurant({ name: "Store Test Restaurant" })

        return `Data store working: ${storeData.customers.length} customers in store`
      },
    },
  ]

  const runAllTests = async () => {
    setIsRunning(true)
    setTestResults([])
    setOverallProgress(0)

    const results: TestResult[] = featureTests.map((test) => ({
      name: test.name,
      status: "pending",
      message: "Waiting to run...",
    }))
    setTestResults([...results])

    for (let i = 0; i < featureTests.length; i++) {
      const test = featureTests[i]
      const startTime = Date.now()

      // Update status to running
      results[i] = { ...results[i], status: "running", message: "Running test..." }
      setTestResults([...results])

      try {
        const message = await test.test()
        const duration = Date.now() - startTime

        results[i] = {
          ...results[i],
          status: "success",
          message,
          duration,
        }

        toast({
          title: "Test Passed",
          description: `${test.name}: ${message}`,
        })
      } catch (error) {
        const duration = Date.now() - startTime

        results[i] = {
          ...results[i],
          status: "error",
          message: error instanceof Error ? error.message : "Test failed",
          duration,
        }

        toast({
          title: "Test Failed",
          description: `${test.name}: ${error instanceof Error ? error.message : "Unknown error"}`,
          variant: "destructive",
        })
      }

      setTestResults([...results])
      setOverallProgress(((i + 1) / featureTests.length) * 100)
    }

    setIsRunning(false)

    const successCount = results.filter((r) => r.status === "success").length
    const totalTests = results.length

    toast({
      title: "Testing Complete",
      description: `${successCount}/${totalTests} tests passed`,
      variant: successCount === totalTests ? "default" : "destructive",
    })
  }

  const runSingleTest = async (testIndex: number) => {
    const test = featureTests[testIndex]
    const startTime = Date.now()

    const newResults = [...testResults]
    newResults[testIndex] = { ...newResults[testIndex], status: "running", message: "Running test..." }
    setTestResults(newResults)

    try {
      const message = await test.test()
      const duration = Date.now() - startTime

      newResults[testIndex] = {
        ...newResults[testIndex],
        status: "success",
        message,
        duration,
      }

      toast({
        title: "Test Passed",
        description: `${test.name}: ${message}`,
      })
    } catch (error) {
      const duration = Date.now() - startTime

      newResults[testIndex] = {
        ...newResults[testIndex],
        status: "error",
        message: error instanceof Error ? error.message : "Test failed",
        duration,
      }

      toast({
        title: "Test Failed",
        description: `${test.name}: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    }

    setTestResults(newResults)
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-600" />
      case "running":
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
      default:
        return <div className="w-5 h-5 rounded-full bg-gray-300" />
    }
  }

  const getFeatureIcon = (testName: string) => {
    if (testName.includes("Database")) return <Database className="w-5 h-5" />
    if (testName.includes("Profile") || testName.includes("Restaurant")) return <Settings className="w-5 h-5" />
    if (testName.includes("Menu")) return <ChefHat className="w-5 h-5" />
    if (testName.includes("Customer")) return <Users className="w-5 h-5" />
    if (testName.includes("Review")) return <MessageSquare className="w-5 h-5" />
    if (testName.includes("Marketing")) return <TrendingUp className="w-5 h-5" />
    if (testName.includes("Analytics")) return <BarChart3 className="w-5 h-5" />
    if (testName.includes("AI")) return <Sparkles className="w-5 h-5" />
    return <Settings className="w-5 h-5" />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mock Features Testing</h1>
          <p className="text-gray-600">
            Test all restaurant management features using mock data - no database required!
          </p>
        </div>

        {/* Test Controls */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Play className="w-5 h-5 mr-2" />
                Test Controls
              </CardTitle>
              <CardDescription>Run comprehensive tests of all features using mock data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                    <span className="text-sm text-gray-500">{Math.round(overallProgress)}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-2" />
                </div>
                <div className="flex gap-2">
                  <Button onClick={runAllTests} disabled={isRunning} className="bg-blue-600 hover:bg-blue-700">
                    {isRunning ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                    Run All Tests
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setTestResults([])
                      setOverallProgress(0)
                    }}
                    disabled={isRunning}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {featureTests.map((test, index) => {
            const result = testResults[index] || { name: test.name, status: "pending", message: "Ready to test" }

            return (
              <Card key={index} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getFeatureIcon(test.name)}
                      <div>
                        <CardTitle className="text-lg">{test.name}</CardTitle>
                        <CardDescription className="text-sm">{result.message}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {result.duration && (
                        <Badge variant="outline" className="text-xs">
                          {result.duration}ms
                        </Badge>
                      )}
                      {getStatusIcon(result.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Badge
                      variant={
                        result.status === "success"
                          ? "default"
                          : result.status === "error"
                            ? "destructive"
                            : result.status === "running"
                              ? "secondary"
                              : "outline"
                      }
                    >
                      {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => runSingleTest(index)} disabled={isRunning}>
                      {result.status === "running" ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Mock Data Summary */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Mock Data Summary</CardTitle>
              <CardDescription>Overview of available mock data for testing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{mockData.customers.length}</div>
                  <div className="text-sm text-blue-800">Mock Customers</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {mockData.menu.categories.reduce((sum, cat) => sum + cat.items.length, 0)}
                  </div>
                  <div className="text-sm text-green-800">Menu Items</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{mockData.reviews.length}</div>
                  <div className="text-sm text-purple-800">Customer Reviews</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{mockData.campaigns.length}</div>
                  <div className="text-sm text-orange-800">Marketing Campaigns</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
