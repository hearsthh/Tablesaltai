"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Navigation } from "@/components/navigation"

export default function CustomerIntegrationsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isOnboarding = searchParams.get("onboarding") === "true"

  const [connections, setConnections] = useState({
    pos: false,
    loyalty: false,
    ordering: false,
    crm: false,
    mobileApp: false,
    wifi: false,
  })

  const [loadingStates, setLoadingStates] = useState({
    pos: false,
    loyalty: false,
    ordering: false,
    crm: false,
    mobileApp: false,
    wifi: false,
  })

  const integrations = [
    {
      id: "pos",
      name: "POS System",
      description: "Connect your Point of Sale system for transaction data",
      icon: "💳",
      category: "Essential",
      benefits: ["Sales analytics", "Customer purchase history", "Revenue tracking"],
    },
    {
      id: "loyalty",
      name: "Loyalty Program",
      description: "Integrate customer loyalty and rewards data",
      icon: "🎁",
      category: "Essential",
      benefits: ["Customer retention", "Reward tracking", "Engagement metrics"],
    },
    {
      id: "ordering",
      name: "Online Ordering",
      description: "Connect online ordering platforms and delivery apps",
      icon: "📱",
      category: "Recommended",
      benefits: ["Order analytics", "Customer preferences", "Delivery insights"],
    },
    {
      id: "crm",
      name: "CRM System",
      description: "Sync customer relationship management data",
      icon: "👥",
      category: "Recommended",
      benefits: ["Customer profiles", "Communication history", "Segmentation"],
    },
    {
      id: "mobileApp",
      name: "Mobile App",
      description: "Connect your restaurant's mobile application",
      icon: "📲",
      category: "Optional",
      benefits: ["App usage data", "Push notification metrics", "User behavior"],
    },
    {
      id: "wifi",
      name: "WiFi Analytics",
      description: "Gather customer behavior data from WiFi usage",
      icon: "📶",
      category: "Optional",
      benefits: ["Visit duration", "Return frequency", "Peak hours"],
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
      router.push(`/customers/segmentation?${params.toString()}`)
    } else {
      router.push("/customers")
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation variant="minimal" title="Customer Data Integrations" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isOnboarding && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-blue-900">Customer Intelligence Setup - Step 1</h2>
                <p className="text-sm text-blue-700">
                  Connect your customer data sources to unlock powerful insights and analytics
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
          <h1 className="text-2xl font-bold text-black mb-2">Customer Data Integrations</h1>
          <p className="text-gray-600">
            Connect your customer data sources to gain insights into behavior, preferences, and engagement patterns.
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
                    <h4 className="text-sm font-medium text-black mb-2">Insights:</h4>
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
                          View Data
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
                You can connect more data sources later from your customer dashboard.
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
