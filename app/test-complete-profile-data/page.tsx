"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle,
  Clock,
  Database,
  Users,
  Star,
  Award,
  ImageIcon,
  TrendingUp,
  AlertCircle,
  RefreshCw,
} from "lucide-react"

interface GenerationStats {
  restaurants: number
  totalStats: {
    menuItems: number
    customers: number
    reviews: number
    awards: number
    mediaAssets: number
    salesRecords: number
  }
  generationTime: string
  breakdown: {
    restaurantsGenerated: number
    menuItemsCreated: number
    customersGenerated: number
    reviewsCreated: number
    awardsCreated: number
    mediaAssetsCreated: number
    salesRecordsCreated: number
  }
}

export default function TestCompleteProfileData() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStats, setGenerationStats] = useState<GenerationStats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const generateCompleteData = async () => {
    setIsGenerating(true)
    setError(null)
    setProgress(0)

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90))
    }, 500)

    try {
      const response = await fetch("/api/generate-complete-mock-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurantCount: 10,
          includeMedia: true,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.details || result.error || "Failed to generate data")
      }

      setProgress(100)
      setGenerationStats(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      clearInterval(progressInterval)
      setIsGenerating(false)
    }
  }

  const StatCard = ({
    title,
    value,
    icon: Icon,
    description,
    color = "default",
  }: {
    title: string
    value: number | string
    icon: any
    description: string
    color?: "default" | "green" | "blue" | "purple" | "orange"
  }) => {
    const colorClasses = {
      default: "text-gray-600",
      green: "text-green-600",
      blue: "text-blue-600",
      purple: "text-purple-600",
      orange: "text-orange-600",
    }

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            </div>
            <Icon className={`h-8 w-8 ${colorClasses[color]}`} />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Complete Restaurant Profile Data Generator</h1>
        <p className="text-gray-600">Generate comprehensive mock data for testing all restaurant profile features</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Generation Control
          </CardTitle>
          <CardDescription>Generate complete restaurant profiles with all required fields for testing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isGenerating && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Generating complete restaurant data...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          <div className="flex gap-4">
            <Button onClick={generateCompleteData} disabled={isGenerating} className="flex items-center gap-2">
              {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
              {isGenerating ? "Generating..." : "Generate Complete Data"}
            </Button>

            {generationStats && (
              <Badge variant="outline" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Data Generated Successfully
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {generationStats && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Restaurants"
                value={generationStats.breakdown.restaurantsGenerated}
                icon={Database}
                description="Complete restaurant profiles"
                color="blue"
              />
              <StatCard
                title="Menu Items"
                value={generationStats.breakdown.menuItemsCreated}
                icon={TrendingUp}
                description="With pricing & sales data"
                color="green"
              />
              <StatCard
                title="Customers"
                value={generationStats.breakdown.customersGenerated}
                icon={Users}
                description="With behavioral patterns"
                color="purple"
              />
              <StatCard
                title="Reviews"
                value={generationStats.breakdown.reviewsCreated}
                icon={Star}
                description="Multi-platform reviews"
                color="orange"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                title="Awards & Certifications"
                value={generationStats.breakdown.awardsCreated}
                icon={Award}
                description="Recognition & credentials"
                color="purple"
              />
              <StatCard
                title="Media Assets"
                value={generationStats.breakdown.mediaAssetsCreated}
                icon={ImageIcon}
                description="Photos, logos, videos"
                color="blue"
              />
              <StatCard
                title="Sales Records"
                value={generationStats.breakdown.salesRecordsCreated}
                icon={TrendingUp}
                description="Daily sales data (45 days)"
                color="green"
              />
            </div>
          </TabsContent>

          <TabsContent value="restaurants" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Restaurant Profile Features</CardTitle>
                <CardDescription>Complete restaurant profiles with all required fields for testing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Basic Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Name, cuisine, location, contact details</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Operating hours, amenities, features</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Business metrics and ratings</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Chef Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Chef name, title, bio, experience</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Specialties, awards, social media</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Professional photos and credentials</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Brand Assets</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Logo, favicon, brand colors</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Hero images, cover photos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Brand voice and positioning</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Media Gallery</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Interior and exterior photos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Food photography and videos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Ambiance and event photos</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Menu Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Categories with descriptions and images</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Items with pricing, ingredients, nutrition</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Dietary tags, allergens, spice levels</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Performance metrics and AI insights</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Daily sales data for last 45 days</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Review Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Multi-platform reviews (Google, Zomato, TripAdvisor)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Detailed ratings and review content</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>AI sentiment analysis and topics</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Response management and automation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Review photos and engagement metrics</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recognition & Media</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Awards & Certifications</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Industry awards and recognition</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Food safety and quality certifications</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Customer choice awards</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Press Coverage</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Magazine features and reviews</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>News articles and interviews</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Social media engagement metrics</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Generation Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{generationStats.generationTime}</div>
                    <div className="text-sm text-gray-600">Total Generation Time</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round(
                        generationStats.totalStats.salesRecords / Number.parseInt(generationStats.generationTime),
                      )}
                    </div>
                    <div className="text-sm text-gray-600">Records per Second</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {(
                        generationStats.totalStats.menuItems +
                        generationStats.totalStats.customers +
                        generationStats.totalStats.reviews +
                        generationStats.totalStats.salesRecords
                      ).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Total Records Created</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Restaurant Profiles Completeness</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      100%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Menu Items with Sales Data</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      100%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Reviews with AI Analysis</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      100%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Platform Integration Coverage</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      100%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
