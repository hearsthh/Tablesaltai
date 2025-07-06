"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import {
  Database,
  TestTube,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  BarChart3,
  Users,
  MessageSquare,
  Utensils,
  Building,
  TrendingUp,
  Star,
  Clock,
  Zap,
  Target,
} from "lucide-react"

interface MockDataStatus {
  status: string
  dataHealth: any
  averages: any
  sampleRestaurants: any[]
  recommendations: string[]
}

interface TestResults {
  testType: string
  restaurant: any
  testResults: any
  overallStatus: any
}

export default function TestComprehensiveAIPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [isCheckingStatus, setIsCheckingStatus] = useState(false)
  const [mockDataStatus, setMockDataStatus] = useState<MockDataStatus | null>(null)
  const [testResults, setTestResults] = useState<TestResults | null>(null)
  const [activeTab, setActiveTab] = useState("setup")

  const handleGenerateMockData = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-mock-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantCount: 10,
          includeMedia: true,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "🎉 Mock Data Generated!",
          description: `Generated ${data.data.restaurantsGenerated} restaurants with comprehensive data`,
        })

        // Auto-check status after generation
        setTimeout(() => {
          handleCheckStatus()
        }, 1000)
      } else {
        throw new Error(data.details || "Generation failed")
      }
    } catch (error) {
      toast({
        title: "❌ Generation Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCheckStatus = async () => {
    setIsCheckingStatus(true)
    try {
      const response = await fetch("/api/mock-data-status")
      const data = await response.json()

      if (data.success) {
        setMockDataStatus(data)
        toast({
          title: "📊 Status Updated",
          description: `Found ${data.dataHealth.restaurants} restaurants with ${data.dataHealth.reviews} reviews`,
        })
      } else {
        throw new Error(data.details || "Status check failed")
      }
    } catch (error) {
      toast({
        title: "❌ Status Check Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      })
    } finally {
      setIsCheckingStatus(false)
    }
  }

  const handleTestFeatures = async (testType = "all") => {
    setIsTesting(true)
    try {
      const response = await fetch("/api/test-profile-features", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testType }),
      })

      const data = await response.json()

      if (data.success) {
        setTestResults(data)
        setActiveTab("results")
        toast({
          title: "🧪 Tests Completed!",
          description: `Profile features tested with ${data.overallStatus.completionRate}% success rate`,
        })
      } else {
        throw new Error(data.details || "Testing failed")
      }
    } catch (error) {
      toast({
        title: "❌ Testing Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      })
    } finally {
      setIsTesting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "complete":
        return "text-green-600"
      case "incomplete":
        return "text-yellow-600"
      default:
        return "text-gray-600"
    }
  }

  const getTestStatusIcon = (status: string) => {
    if (status?.includes("✅")) return <CheckCircle className="w-4 h-4 text-green-600" />
    if (status?.includes("❌")) return <AlertCircle className="w-4 h-4 text-red-600" />
    return <Clock className="w-4 h-4 text-gray-400" />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Comprehensive AI Testing Suite</h1>
          <p className="text-gray-600">
            Generate mock data and test all profile module features with realistic restaurant data
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="status">Data Status</TabsTrigger>
            <TabsTrigger value="testing">Testing</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          {/* Setup Tab */}
          <TabsContent value="setup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  Mock Data Generation
                </CardTitle>
                <CardDescription>
                  Generate comprehensive mock data for 10 restaurants with menus, customers, reviews, and analytics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Building className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-blue-900">10 Restaurants</h3>
                    <p className="text-sm text-blue-700">Different cuisines & types</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Utensils className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-green-900">Menu Data</h3>
                    <p className="text-sm text-green-700">Categories, items, pricing</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-purple-900">Customer Data</h3>
                    <p className="text-sm text-purple-700">Reviews, analytics, insights</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleGenerateMockData}
                    disabled={isGenerating}
                    className="flex-1 bg-black hover:bg-gray-800 text-white"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Database className="w-4 h-4 mr-2" />
                        Generate Mock Data
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleCheckStatus}
                    disabled={isCheckingStatus}
                    variant="outline"
                    className="flex-1 bg-transparent"
                  >
                    {isCheckingStatus ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Checking...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Check Status
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common testing workflows</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button
                    onClick={() => handleTestFeatures("social-profile")}
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center"
                  >
                    <Building className="w-6 h-6 mb-2" />
                    <span className="text-sm">Social Profile</span>
                  </Button>
                  <Button
                    onClick={() => handleTestFeatures("menu-manager")}
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center"
                  >
                    <Utensils className="w-6 h-6 mb-2" />
                    <span className="text-sm">Menu Manager</span>
                  </Button>
                  <Button
                    onClick={() => handleTestFeatures("reviews-manager")}
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center"
                  >
                    <MessageSquare className="w-6 h-6 mb-2" />
                    <span className="text-sm">Reviews</span>
                  </Button>
                  <Button
                    onClick={() => handleTestFeatures("all")}
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center border-blue-200 hover:bg-blue-50"
                  >
                    <TestTube className="w-6 h-6 mb-2 text-blue-600" />
                    <span className="text-sm text-blue-600">Test All</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Status Tab */}
          <TabsContent value="status" className="space-y-6">
            {mockDataStatus ? (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2" />
                        Data Health Overview
                      </CardTitle>
                      <Badge className={getStatusColor(mockDataStatus.status)}>
                        {mockDataStatus.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{mockDataStatus.dataHealth.restaurants}</div>
                        <div className="text-sm text-gray-600">Restaurants</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{mockDataStatus.dataHealth.menuItems}</div>
                        <div className="text-sm text-gray-600">Menu Items</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{mockDataStatus.dataHealth.customers}</div>
                        <div className="text-sm text-gray-600">Customers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{mockDataStatus.dataHealth.reviews}</div>
                        <div className="text-sm text-gray-600">Reviews</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Data Averages</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Menu Items per Restaurant</span>
                        <span className="font-semibold">{mockDataStatus.averages.menuItemsPerRestaurant}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Customers per Restaurant</span>
                        <span className="font-semibold">{mockDataStatus.averages.customersPerRestaurant}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Reviews per Restaurant</span>
                        <span className="font-semibold">{mockDataStatus.averages.reviewsPerRestaurant}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Sample Restaurants</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {mockDataStatus.sampleRestaurants.map((restaurant, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div>
                              <div className="font-medium text-sm">{restaurant.name}</div>
                              <div className="text-xs text-gray-600">
                                {restaurant.cuisine_type} • {restaurant.city}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Star className="w-3 h-3 text-yellow-500" />
                              <span className="text-sm">{restaurant.avg_rating}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {mockDataStatus.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                          <span className="text-sm">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Status Data</h3>
                  <p className="text-gray-600 mb-4">Check the status of your mock data</p>
                  <Button onClick={handleCheckStatus} disabled={isCheckingStatus}>
                    {isCheckingStatus ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Checking...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Check Status
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Testing Tab */}
          <TabsContent value="testing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TestTube className="w-5 h-5 mr-2" />
                  Profile Feature Testing
                </CardTitle>
                <CardDescription>
                  Test individual modules or run comprehensive tests across all profile features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button
                    onClick={() => handleTestFeatures("social-profile")}
                    disabled={isTesting}
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center"
                  >
                    <Building className="w-8 h-8 mb-2 text-blue-600" />
                    <span className="font-medium">Social Profile</span>
                    <span className="text-xs text-gray-600">Brand, hours, amenities</span>
                  </Button>

                  <Button
                    onClick={() => handleTestFeatures("menu-manager")}
                    disabled={isTesting}
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center"
                  >
                    <Utensils className="w-8 h-8 mb-2 text-green-600" />
                    <span className="font-medium">Menu Manager</span>
                    <span className="text-xs text-gray-600">Items, pricing, AI insights</span>
                  </Button>

                  <Button
                    onClick={() => handleTestFeatures("reviews-manager")}
                    disabled={isTesting}
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center"
                  >
                    <MessageSquare className="w-8 h-8 mb-2 text-purple-600" />
                    <span className="font-medium">Reviews Manager</span>
                    <span className="text-xs text-gray-600">Sentiment, responses, platforms</span>
                  </Button>

                  <Button
                    onClick={() => handleTestFeatures("customer-analytics")}
                    disabled={isTesting}
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center"
                  >
                    <Users className="w-8 h-8 mb-2 text-orange-600" />
                    <span className="font-medium">Customer Analytics</span>
                    <span className="text-xs text-gray-600">Segmentation, churn, loyalty</span>
                  </Button>

                  <Button
                    onClick={() => handleTestFeatures("marketing")}
                    disabled={isTesting}
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center"
                  >
                    <TrendingUp className="w-8 h-8 mb-2 text-pink-600" />
                    <span className="font-medium">Marketing</span>
                    <span className="text-xs text-gray-600">Campaigns, ROI, performance</span>
                  </Button>

                  <Button
                    onClick={() => handleTestFeatures("all")}
                    disabled={isTesting}
                    className="h-24 flex flex-col items-center justify-center bg-black hover:bg-gray-800 text-white"
                  >
                    {isTesting ? (
                      <>
                        <Loader2 className="w-8 h-8 mb-2 animate-spin" />
                        <span className="font-medium">Testing...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-8 h-8 mb-2" />
                        <span className="font-medium">Test All Features</span>
                        <span className="text-xs opacity-80">Comprehensive testing</span>
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            {testResults ? (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <Target className="w-5 h-5 mr-2" />
                        Test Results Overview
                      </CardTitle>
                      <Badge
                        className={
                          testResults.overallStatus.readyForTesting
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {testResults.overallStatus.completionRate}% Complete
                      </Badge>
                    </div>
                    <CardDescription>
                      Testing {testResults.restaurant.name} ({testResults.restaurant.cuisine} •{" "}
                      {testResults.restaurant.city})
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Overall Completion</span>
                          <span>{testResults.overallStatus.completionRate}%</span>
                        </div>
                        <Progress value={testResults.overallStatus.completionRate} className="h-2" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {testResults.overallStatus.recommendations.map((rec: string, index: number) => (
                          <div key={index} className="flex items-start space-x-2">
                            {rec.includes("✅") ? (
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                            )}
                            <span className="text-sm">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Test Results */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {Object.entries(testResults.testResults).map(([testName, testData]: [string, any]) => (
                    <Card key={testName}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base capitalize">
                            {testName.replace(/([A-Z])/g, " $1").trim()}
                          </CardTitle>
                          {getTestStatusIcon(testData.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {Object.entries(testData).map(([key, value]: [string, any]) => {
                            if (key === "status") return null

                            return (
                              <div key={key} className="text-sm">
                                <span className="font-medium capitalize text-gray-700">
                                  {key.replace(/([A-Z])/g, " $1").trim()}:
                                </span>
                                <div className="mt-1">
                                  {typeof value === "object" ? (
                                    <div className="pl-2 space-y-1">
                                      {Object.entries(value).map(([subKey, subValue]: [string, any]) => (
                                        <div key={subKey} className="flex justify-between">
                                          <span className="text-gray-600 capitalize">
                                            {subKey.replace(/([A-Z])/g, " $1").trim()}
                                          </span>
                                          <span className="font-medium">
                                            {typeof subValue === "number"
                                              ? subValue.toLocaleString()
                                              : String(subValue)}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-gray-900 font-medium">
                                      {typeof value === "number" ? value.toLocaleString() : String(value)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <TestTube className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Test Results</h3>
                  <p className="text-gray-600 mb-4">Run tests to see detailed results</p>
                  <Button onClick={() => setActiveTab("testing")}>
                    <TestTube className="w-4 h-4 mr-2" />
                    Go to Testing
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
