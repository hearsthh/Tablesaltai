"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, ImageIcon, FileText, Users, TrendingUp } from "lucide-react"

export function AIFeatureTester() {
  const [loading, setLoading] = useState<string | null>(null)
  const [results, setResults] = useState<Record<string, any>>({})

  const testContentGeneration = async () => {
    setLoading("content")
    try {
      const response = await fetch("/api/ai/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "social_media",
          prompt: "Create a social media post for a new Italian restaurant opening",
          tone: "exciting",
        }),
      })
      const data = await response.json()
      setResults((prev) => ({ ...prev, content: data }))
    } catch (error) {
      setResults((prev) => ({ ...prev, content: { error: "Failed to generate content" } }))
    }
    setLoading(null)
  }

  const testImageGeneration = async () => {
    setLoading("image")
    try {
      const response = await fetch("/api/ai/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: "A delicious margherita pizza on a wooden table, restaurant photography",
          width: 1024,
          height: 768,
        }),
      })
      const data = await response.json()
      setResults((prev) => ({ ...prev, image: data }))
    } catch (error) {
      setResults((prev) => ({ ...prev, image: { error: "Failed to generate image" } }))
    }
    setLoading(null)
  }

  const testCustomerInsights = async () => {
    setLoading("insights")
    try {
      const response = await fetch("/api/ai/customer-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerData: [
            { visits: 5, avgSpend: 45, lastVisit: "2024-06-10" },
            { visits: 12, avgSpend: 65, lastVisit: "2024-06-12" },
          ],
        }),
      })
      const data = await response.json()
      setResults((prev) => ({ ...prev, insights: data }))
    } catch (error) {
      setResults((prev) => ({ ...prev, insights: { error: "Failed to analyze customers" } }))
    }
    setLoading(null)
  }

  const testCampaignOrchestration = async () => {
    setLoading("campaign")
    try {
      const response = await fetch("/api/ai/orchestrate-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantType: "Italian",
          goal: "increase_weekend_traffic",
          budget: 500,
          duration: 7,
        }),
      })
      const data = await response.json()
      setResults((prev) => ({ ...prev, campaign: data }))
    } catch (error) {
      setResults((prev) => ({ ...prev, campaign: { error: "Failed to create campaign" } }))
    }
    setLoading(null)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🤖 AI Feature Testing Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Content Generation Test */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Content Generation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={testContentGeneration} disabled={loading === "content"} className="w-full mb-3">
                  {loading === "content" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" /> Generating...
                    </>
                  ) : (
                    "Test Content Generation"
                  )}
                </Button>
                {results.content && (
                  <div className="p-3 bg-gray-50 rounded text-sm">
                    {results.content.error ? (
                      <Badge variant="destructive">{results.content.error}</Badge>
                    ) : (
                      <div>
                        <Badge variant="default" className="mb-2">
                          ✅ Success
                        </Badge>
                        <p className="text-xs">{results.content.content?.substring(0, 100)}...</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Image Generation Test */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Image Generation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={testImageGeneration} disabled={loading === "image"} className="w-full mb-3">
                  {loading === "image" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" /> Generating...
                    </>
                  ) : (
                    "Test Image Generation"
                  )}
                </Button>
                {results.image && (
                  <div className="p-3 bg-gray-50 rounded text-sm">
                    {results.image.error ? (
                      <Badge variant="destructive">{results.image.error}</Badge>
                    ) : (
                      <div>
                        <Badge variant="default" className="mb-2">
                          ✅ Success
                        </Badge>
                        {results.image.imageUrl && (
                          <img
                            src={results.image.imageUrl || "/placeholder.svg"}
                            alt="Generated"
                            className="w-full h-32 object-cover rounded mt-2"
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Customer Insights Test */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Customer Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={testCustomerInsights} disabled={loading === "insights"} className="w-full mb-3">
                  {loading === "insights" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" /> Analyzing...
                    </>
                  ) : (
                    "Test Customer Analysis"
                  )}
                </Button>
                {results.insights && (
                  <div className="p-3 bg-gray-50 rounded text-sm">
                    {results.insights.error ? (
                      <Badge variant="destructive">{results.insights.error}</Badge>
                    ) : (
                      <div>
                        <Badge variant="default" className="mb-2">
                          ✅ Success
                        </Badge>
                        <p className="text-xs">{JSON.stringify(results.insights).substring(0, 100)}...</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Campaign Orchestration Test */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Campaign Creation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={testCampaignOrchestration} disabled={loading === "campaign"} className="w-full mb-3">
                  {loading === "campaign" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" /> Creating...
                    </>
                  ) : (
                    "Test Campaign Creation"
                  )}
                </Button>
                {results.campaign && (
                  <div className="p-3 bg-gray-50 rounded text-sm">
                    {results.campaign.error ? (
                      <Badge variant="destructive">{results.campaign.error}</Badge>
                    ) : (
                      <div>
                        <Badge variant="default" className="mb-2">
                          ✅ Success
                        </Badge>
                        <p className="text-xs">{JSON.stringify(results.campaign).substring(0, 100)}...</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
