"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import {
  TestTube,
  Play,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Database,
  User,
  Sparkles,
  Settings,
  BarChart3,
  Globe,
  Clock,
} from "lucide-react"

interface TestResult {
  success: boolean
  message: string
  data?: any
  error?: string
  duration?: number
}

interface Restaurant {
  id: string
  name: string
  cuisine_type: string
  city: string
  state: string
}

export default function AITestSuite() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({})
  const [currentTest, setCurrentTest] = useState<string>("")
  const [testProgress, setTestProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("overview")

  // Test suites configuration
  const testSuites = [
    {
      id: "user-flow",
      name: "New User Flow",
      description: "Test complete new user onboarding journey",
      icon: User,
      tests: [
        { id: "signup", name: "User Signup", endpoint: "/api/test-user-flow/signup" },
        { id: "onboarding", name: "Onboarding Process", endpoint: "/api/test-user-flow/onboarding" },
        { id: "profile-setup", name: "Profile Setup", endpoint: "/api/test-user-flow/profile-setup" },
        { id: "data-generation", name: "AI Data Generation", endpoint: "/api/test-user-flow/data-generation" },
      ],
    },
    {
      id: "ai-features",
      name: "AI Features",
      description: "Test all AI-powered features",
      icon: Sparkles,
      tests: [
        {
          id: "menu-analysis",
          name: "Menu Analysis",
          endpoint: "/api/test-ai-features",
          params: { testSuite: "menu" },
        },
        {
          id: "review-analysis",
          name: "Review Analysis",
          endpoint: "/api/test-ai-features",
          params: { testSuite: "reviews" },
        },
        {
          id: "customer-insights",
          name: "Customer Insights",
          endpoint: "/api/test-ai-features",
          params: { testSuite: "customers" },
        },
        {
          id: "content-generation",
          name: "Content Generation",
          endpoint: "/api/test-ai-features",
          params: { testSuite: "content" },
        },
        {
          id: "social-profile",
          name: "Social Profile",
          endpoint: "/api/test-ai-features",
          params: { testSuite: "social" },
        },
        {
          id: "pricing-optimization",
          name: "Pricing Optimization",
          endpoint: "/api/test-ai-features",
          params: { testSuite: "pricing" },
        },
      ],
    },
    {
      id: "app-features",
      name: "App Features",
      description: "Test core application functionality",
      icon: Settings,
      tests: [
        { id: "menu-manager", name: "Menu Manager", endpoint: "/api/test-app-features/menu-manager" },
        { id: "review-manager", name: "Review Manager", endpoint: "/api/test-app-features/review-manager" },
        { id: "customer-manager", name: "Customer Manager", endpoint: "/api/test-app-features/customer-manager" },
        { id: "marketing-tools", name: "Marketing Tools", endpoint: "/api/test-app-features/marketing-tools" },
        { id: "analytics-dashboard", name: "Analytics Dashboard", endpoint: "/api/test-app-features/analytics" },
      ],
    },
    {
      id: "integrations",
      name: "Platform Integrations",
      description: "Test external platform integrations",
      icon: Globe,
      tests: [
        { id: "google-integration", name: "Google My Business", endpoint: "/api/test-integrations/google" },
        { id: "zomato-integration", name: "Zomato Integration", endpoint: "/api/test-integrations/zomato" },
        { id: "social-media", name: "Social Media APIs", endpoint: "/api/test-integrations/social-media" },
        { id: "payment-gateways", name: "Payment Gateways", endpoint: "/api/test-integrations/payments" },
      ],
    },
  ]

  // Load restaurants on component mount
  useEffect(() => {
    loadRestaurants()
  }, [])

  const loadRestaurants = async () => {
    try {
      const response = await fetch("/api/mock-restaurants")
      if (response.ok) {
        const data = await response.json()
        setRestaurants(data.restaurants || [])
      }
    } catch (error) {
      console.error("Failed to load restaurants:", error)
      toast({
        title: "Error",
        description: "Failed to load test restaurants",
        variant: "destructive",
      })
    }
  }

  const runSingleTest = async (test: any, restaurantId?: string) => {
    const testKey = test.id
    setCurrentTest(test.name)

    try {
      const requestBody = {
        restaurantId: restaurantId || selectedRestaurant,
        ...test.params,
      }

      const startTime = Date.now()
      const response = await fetch(test.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })

      const result = await response.json()
      const duration = Date.now() - startTime

      const testResult: TestResult = {
        success: response.ok && result.success,
        message: result.message || (response.ok ? "Test passed" : "Test failed"),
        data: result.data || result.results,
        error: result.error,
        duration,
      }

      setTestResults((prev) => ({ ...prev, [testKey]: testResult }))

      if (testResult.success) {
        toast({
          title: "✅ Test Passed",
          description: `${test.name} completed successfully`,
        })
      } else {
        toast({
          title: "❌ Test Failed",
          description: `${test.name}: ${testResult.error || "Unknown error"}`,
          variant: "destructive",
        })
      }

      return testResult
    } catch (error) {
      const testResult: TestResult = {
        success: false,
        message: "Test execution failed",
        error: error instanceof Error ? error.message : "Unknown error",
      }

      setTestResults((prev) => ({ ...prev, [testKey]: testResult }))

      toast({
        title: "❌ Test Error",
        description: `${test.name}: ${testResult.error}`,
        variant: "destructive",
      })

      return testResult
    }
  }

  const runTestSuite = async (suiteId: string) => {
    const suite = testSuites.find((s) => s.id === suiteId)
    if (!suite) return

    setIsLoading(true)
    setTestProgress(0)

    try {
      const totalTests = suite.tests.length

      for (let i = 0; i < suite.tests.length; i++) {
        const test = suite.tests[i]
        await runSingleTest(test)
        setTestProgress(((i + 1) / totalTests) * 100)

        // Small delay between tests
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      toast({
        title: "🎉 Test Suite Complete",
        description: `${suite.name} test suite finished`,
      })
    } catch (error) {
      toast({
        title: "❌ Test Suite Failed",
        description: "Test suite execution failed",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setCurrentTest("")
      setTestProgress(0)
    }
  }

  const runAllTests = async () => {
    if (!selectedRestaurant) {
      toast({
        title: "Select Restaurant",
        description: "Please select a restaurant to test with",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setTestProgress(0)
    setTestResults({})

    try {
      const allTests = testSuites.flatMap((suite) => suite.tests)
      const totalTests = allTests.length

      for (let i = 0; i < allTests.length; i++) {
        const test = allTests[i]
        await runSingleTest(test)
        setTestProgress(((i + 1) / totalTests) * 100)

        // Small delay between tests
        await new Promise((resolve) => setTimeout(resolve, 300))
      }

      toast({
        title: "🎉 All Tests Complete",
        description: "Comprehensive testing finished",
      })
    } catch (error) {
      toast({
        title: "❌ Testing Failed",
        description: "Comprehensive testing failed",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setCurrentTest("")
      setTestProgress(0)
    }
  }

  const generateMockData = async () => {
    setIsLoading(true)
    setCurrentTest("Generating comprehensive mock data...")

    try {
      const response = await fetch("/api/generate-complete-mock-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantCount: 5, includeMedia: true }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "✅ Mock Data Generated",
          description: `Generated ${result.data.restaurants} restaurants with complete profiles`,
        })
        await loadRestaurants() // Reload restaurants list
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "❌ Mock Data Generation Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setCurrentTest("")
    }
  }

  const getTestStatusIcon = (testId: string) => {
    const result = testResults[testId]
    if (!result) return <Clock className="w-4 h-4 text-gray-400" />
    if (result.success) return <CheckCircle className="w-4 h-4 text-green-600" />
    return <AlertCircle className="w-4 h-4 text-red-600" />
  }

  const getTestStatusColor = (testId: string) => {
    const result = testResults[testId]
    if (!result) return "border-gray-200"
    if (result.success) return "border-green-200 bg-green-50"
    return "border-red-200 bg-red-50"
  }

  const getOverallStats = () => {
    const totalTests = Object.keys(testResults).length
    const passedTests = Object.values(testResults).filter((r) => r.success).length
    const failedTests = totalTests - passedTests
    const successRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0

    return { totalTests, passedTests, failedTests, successRate }
  }

  const stats = getOverallStats()

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <TestTube className="w-8 h-8 mr-3 text-blue-600" />
            AI Feature Test Suite
          </h1>
          <p className="text-gray-600 mt-2">
            Comprehensive testing for new user flow, AI features, and app functionality
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={generateMockData} variant="outline" disabled={isLoading}>
            <Database className="w-4 h-4 mr-2" />
            Generate Mock Data
          </Button>
          <Button onClick={runAllTests} disabled={isLoading || !selectedRestaurant}>
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
            Run All Tests
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      {isLoading && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{currentTest}</span>
              <span className="text-sm text-gray-500">{Math.round(testProgress)}%</span>
            </div>
            <Progress value={testProgress} className="h-2" />
          </CardContent>
        </Card>
      )}

      {/* Restaurant Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Test Configuration</CardTitle>
          <CardDescription>Select a restaurant to test with mock data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Select value={selectedRestaurant} onValueChange={setSelectedRestaurant}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a restaurant for testing" />
                </SelectTrigger>
                <SelectContent>
                  {restaurants.map((restaurant) => (
                    <SelectItem key={restaurant.id} value={restaurant.id}>
                      {restaurant.name} - {restaurant.cuisine_type} ({restaurant.city})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={loadRestaurants} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Results Overview */}
      {stats.totalTests > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalTests}</div>
              <div className="text-sm text-gray-600">Total Tests</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.passedTests}</div>
              <div className="text-sm text-gray-600">Passed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.failedTests}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{Math.round(stats.successRate)}%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Test Suites */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="user-flow">User Flow</TabsTrigger>
          <TabsTrigger value="ai-features">AI Features</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {testSuites.map((suite) => {
              const Icon = suite.icon
              const suiteTests = suite.tests.map((t) => t.id)
              const suiteResults = suiteTests.map((id) => testResults[id]).filter(Boolean)
              const suitePassed = suiteResults.filter((r) => r.success).length
              const suiteTotal = suiteResults.length

              return (
                <Card key={suite.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Icon className="w-6 h-6 text-blue-600" />
                      {suiteTotal > 0 && (
                        <Badge variant={suitePassed === suiteTotal ? "default" : "secondary"}>
                          {suitePassed}/{suiteTotal}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-base">{suite.name}</CardTitle>
                    <CardDescription className="text-sm">{suite.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button
                      onClick={() => runTestSuite(suite.id)}
                      disabled={isLoading || !selectedRestaurant}
                      className="w-full"
                      size="sm"
                    >
                      <Play className="w-3 h-3 mr-2" />
                      Run Suite
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="user-flow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                New User Flow Testing
              </CardTitle>
              <CardDescription>
                Test the complete new user onboarding journey from signup to AI data generation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testSuites
                  .find((s) => s.id === "user-flow")
                  ?.tests.map((test) => (
                    <div
                      key={test.id}
                      className={`flex items-center justify-between p-3 border rounded-lg ${getTestStatusColor(test.id)}`}
                    >
                      <div className="flex items-center space-x-3">
                        {getTestStatusIcon(test.id)}
                        <div>
                          <div className="font-medium text-sm">{test.name}</div>
                          {testResults[test.id] && (
                            <div className="text-xs text-gray-600">{testResults[test.id].duration}ms</div>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => runSingleTest(test)}
                        disabled={isLoading || !selectedRestaurant}
                        size="sm"
                        variant="outline"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Test
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                AI Features Testing
              </CardTitle>
              <CardDescription>
                Test all AI-powered features including analysis, insights, and content generation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testSuites
                  .find((s) => s.id === "ai-features")
                  ?.tests.map((test) => (
                    <div
                      key={test.id}
                      className={`flex items-center justify-between p-3 border rounded-lg ${getTestStatusColor(test.id)}`}
                    >
                      <div className="flex items-center space-x-3">
                        {getTestStatusIcon(test.id)}
                        <div>
                          <div className="font-medium text-sm">{test.name}</div>
                          {testResults[test.id] && (
                            <div className="text-xs text-gray-600">{testResults[test.id].duration}ms</div>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => runSingleTest(test)}
                        disabled={isLoading || !selectedRestaurant}
                        size="sm"
                        variant="outline"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Test
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Detailed Test Results
              </CardTitle>
              <CardDescription>View detailed results and data from all executed tests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(testResults).map(([testId, result]) => (
                  <div key={testId} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {result.success ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span className="font-medium">{testId}</span>
                        <Badge variant={result.success ? "default" : "destructive"}>
                          {result.success ? "PASS" : "FAIL"}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-500">{result.duration}ms</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{result.message}</p>
                    {result.error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{result.error}</p>}
                    {result.data && (
                      <details className="mt-2">
                        <summary className="text-sm font-medium cursor-pointer">View Data</summary>
                        <pre className="text-xs bg-gray-50 p-2 rounded mt-2 overflow-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
