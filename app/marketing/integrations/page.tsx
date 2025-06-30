"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Navigation } from "@/components/navigation"

export default function MarketingIntegrationsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isOnboarding = searchParams.get("onboarding") === "true"

  const [connections, setConnections] = useState({
    facebook: false,
    instagram: false,
    googleAds: false,
    whatsapp: false,
    mailchimp: false,
    twitter: false,
  })

  const [loadingStates, setLoadingStates] = useState({
    facebook: false,
    instagram: false,
    googleAds: false,
    whatsapp: false,
    mailchimp: false,
    twitter: false,
  })

  const integrations = [
    {
      id: "facebook",
      name: "Facebook Business",
      description: "Manage Facebook page, ads, and customer interactions",
      icon: "📘",
      category: "Essential",
      benefits: ["Post scheduling", "Ad management", "Customer messaging"],
    },
    {
      id: "instagram",
      name: "Instagram Business",
      description: "Share photos, stories, and engage with customers",
      icon: "📸",
      category: "Essential",
      benefits: ["Content scheduling", "Story management", "Direct messages"],
    },
    {
      id: "googleAds",
      name: "Google Ads",
      description: "Create and manage Google advertising campaigns",
      icon: "🎯",
      category: "Recommended",
      benefits: ["Search ads", "Display campaigns", "Performance tracking"],
    },
    {
      id: "whatsapp",
      name: "WhatsApp Business",
      description: "Connect with customers via WhatsApp messaging",
      icon: "💬",
      category: "Essential",
      benefits: ["Customer support", "Order updates", "Promotional messages"],
    },
    {
      id: "mailchimp",
      name: "Email Marketing",
      description: "Send newsletters and promotional emails",
      icon: "📧",
      category: "Recommended",
      benefits: ["Email campaigns", "Customer segmentation", "Analytics"],
    },
    {
      id: "twitter",
      name: "Twitter",
      description: "Share updates and engage with customers on Twitter",
      icon: "🐦",
      category: "Optional",
      benefits: ["Tweet scheduling", "Customer engagement", "Brand awareness"],
    },
  ]

  const handleConnect = async (integrationId: string) => {
    setLoadingStates((prev) => ({ ...prev, [integrationId]: true }))
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setConnections((prev) => ({ ...prev, [integrationId]: true }))
    setLoadingStates((prev) => ({ ...prev, [integrationId]: false }))
  }

  const handleDisconnect = async (integrationId: string) => {
    setLoadingStates((prev) => ({ ...prev, [integrationId]: true }))
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setConnections((prev) => ({ ...prev, [integrationId]: false }))
    setLoadingStates((prev) => ({ ...prev, [integrationId]: false }))
  }

  const connectedCount = Object.values(connections).filter(Boolean).length
  const totalCount = integrations.length
  const connectionPercentage = (connectedCount / totalCount) * 100

  const handleContinue = () => {
    if (isOnboarding) {
      const params = new URLSearchParams()
      params.set("onboarding", "true")
      params.set("new", "true")
      router.push(`/marketing/campaigns?${params.toString()}`)
    } else {
      router.push("/marketing")
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation variant="minimal" title="Marketing Integrations" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isOnboarding && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-blue-900">Marketing Setup - Step 1</h2>
                <p className="text-sm text-blue-700">
                  Connect your marketing channels to manage campaigns from one dashboard
                </p>
              </div>
              <Badge className="bg-blue-600 text-white">
                {connectedCount}/{totalCount} Connected
              </Badge>
            </div>
            <div className="mt-3">
              <Progress value={connectionPercentage} className="h-2" />
            </div>
          </div>
        )}

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-black mb-2">Marketing Integrations</h1>
          <p className="text-gray-600">
            Connect your marketing channels to create unified campaigns and track performance across all platforms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {integrations.map((integration) => {
            const isConnected = connections[integration.id as keyof typeof connections]
            const isLoading = loadingStates[integration.id as keyof typeof loadingStates]

            return (
              <Card key={integration.id} className="border-gray-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-lg">{integration.icon}</span>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <Badge
                          variant={integration.category === "Essential" ? "default" : "outline"}
                          className="text-xs mt-1"
                        >
                          {integration.category}
                        </Badge>
                      </div>
                    </div>
                    {isConnected && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <span className="mr-1">✓</span>
                        Connected
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">{integration.description}</p>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-black mb-2">Features:</h4>
                    <ul className="space-y-1">
                      {integration.benefits.map((benefit, index) => (
                        <li key={index} className="text-xs text-gray-600 flex items-center">
                          <span className="mr-2">•</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex space-x-2">
                    {isConnected ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDisconnect(integration.id)}
                          disabled={isLoading}
                          className="flex-1"
                        >
                          {isLoading ? "Disconnecting..." : "Disconnect"}
                        </Button>
                        <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                          Manage
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleConnect(integration.id)}
                        disabled={isLoading}
                        className="flex-1 bg-black hover:bg-gray-800 text-white"
                      >
                        {isLoading ? "Connecting..." : "Connect"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {isOnboarding && (
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-black">Ready to continue?</h3>
              <p className="text-sm text-gray-600">
                You can connect more marketing channels later from your marketing dashboard.
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => router.push("/onboarding")}>
                Back to Setup
              </Button>
              <Button onClick={handleContinue} className="bg-black hover:bg-gray-800 text-white">
                Continue Setup
                <span className="ml-1">→</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
