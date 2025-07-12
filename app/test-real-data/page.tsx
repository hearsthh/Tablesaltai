"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Navigation } from "@/components/navigation"
import {
  Database,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Loader2,
  Play,
  BarChart3,
  Users,
  Utensils,
  MessageSquare,
} from "lucide-react"

export default function TestRealDataPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [dataGenerated, setDataGenerated] = useState(false)
  const [aiResults, setAiResults] = useState<any[]>([])

  const generateTestData = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/test-data/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurantId: "550e8400-e29b-41d4-a716-446655440000",
        }),
      })

      const result = await response.json()

      if (result.success) {
        setDataGenerated(true)
        toast({
          title: "Success!",
          description: "Test data has been generated successfully in Supabase.",
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Generate data error:", error)
      toast({
        title: "Error",
        description: "Failed to generate test data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const testAIGeneration = async () => {
    setAiLoading(true)
    const contentTypes = ["menu_description", "social_post", "review_response", "marketing_copy"]
    const results = []

    try {
      for (const contentType of contentTypes) {
        const response = await fetch("/api/test-data/ai-generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            restaurantId: "550e8400-e29b-41d4-a716-446655440000",
            contentType,
          }),
        })

        const result = await response.json()
        if (result.success) {
          results.push({
            type: contentType,
            content: result.content,
          })
        }
      }

      setAiResults(results)
      toast({
        title: "AI Test Complete!",
        description: `Generated ${results.length} different types of content.`,
      })
    } catch (error) {
      console.error("AI generation error:", error)
      toast({
        title: "AI Test Failed",
        description: "Failed to generate AI content. Check your OpenAI API key.",
        variant: "destructive",
      })
    } finally {
      setAiLoading(false)
    }
  }

  const formatContentType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Real Data Testing Suite</h1>
          <p className="text-lg text-gray-600">
            Generate realistic restaurant data in Supabase and test AI integrations
          </p>
        </div>

        <div className="grid gap-6 mb-8">
          {/* Step 1: Generate Database Data */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Database className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>Step 1: Generate Test Data</CardTitle>
                  </div>
                  <div>
                    <CardTitle>Step 1: Generate Test Data</CardTitle>
                    <p className="text-sm text-gray-600">Create realistic restaurant data in Supabase database</p>
                  </div>
                </div>
                {dataGenerated && (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Generated
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Utensils className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    <p className="text-sm font-medium">Menu Items</p>
                    <p className="text-xs text-gray-500">4 items</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <MessageSquare className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    <p className="text-sm font-medium">Reviews</p>
                    <p className="text-xs text-gray-500">3 reviews</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <BarChart3 className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    <p className="text-sm font-medium">Analytics</p>
                    <p className="text-xs text-gray-500">Revenue data</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Users className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    <p className="text-sm font-medium">Campaigns</p>
                    <p className="text-xs text-gray-500">2 campaigns</p>
                  </div>
                </div>
                <Button onClick={generateTestData} disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Data...
                    </>
                  ) : (
                    <>
                      <Database className="w-4 h-4 mr-2" />
                      Generate Test Data in Supabase
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Test AI Integration */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle>Step 2: Test AI Integration</CardTitle>
                    <p className="text-sm text-gray-600">Generate content using OpenAI API</p>
                  </div>
                </div>
                {aiResults.length > 0 && (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {aiResults.length} Generated
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button
                  onClick={testAIGeneration}
                  disabled={aiLoading || !dataGenerated}
                  className="w-full"
                  variant={dataGenerated ? "default" : "secondary"}
                >
                  {aiLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Testing AI Generation...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Test AI Content Generation
                    </>
                  )}
                </Button>

                {!dataGenerated && (
                  <div className="flex items-center space-x-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    <span>Generate test data first before testing AI</span>
                  </div>
                )}

                {aiResults.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">AI Generated Content:</h4>
                    {aiResults.map((result, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{formatContentType(result.type)}</Badge>
                        </div>
                        <p className="text-sm text-gray-700">{result.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Test Dashboard */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Play className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <CardTitle>Step 3: Test Dashboard</CardTitle>
                  <p className="text-sm text-gray-600">View the dashboard with real data</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Once you've generated test data, visit the dashboard to see it in action with real restaurant data.
                </p>
                <Button
                  onClick={() => window.open("/new-dashboard", "_blank")}
                  disabled={!dataGenerated}
                  className="w-full"
                  variant={dataGenerated ? "default" : "secondary"}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Open Dashboard with Real Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Generate Test Data</h4>
                    <p className="text-sm text-gray-600">
                      Creates a complete restaurant profile with menu items, reviews, analytics, and campaigns in your
                      Supabase database.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Test AI Integration</h4>
                    <p className="text-sm text-gray-600">
                      Tests OpenAI API integration by generating different types of restaurant content (menu
                      descriptions, social posts, etc.).
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Test Dashboard</h4>
                    <p className="text-sm text-gray-600">
                      View the dashboard populated with real data to test all UI components, KPIs, tasks, and insights.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">What gets tested:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Supabase database integration and data fetching</li>
                  <li>• OpenAI API calls for content generation</li>
                  <li>• Dashboard UI with real KPIs and metrics</li>
                  <li>• Task management and completion</li>
                  <li>• AI insights and recommendations</li>
                  <li>• Platform integration status</li>
                  <li>• Mobile responsive design</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
