"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Navigation } from "@/components/navigation"
import {
  Globe,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowRight,
  Star,
  MapPin,
  Users,
  LinkIcon,
  CreditCard,
} from "lucide-react"

interface Integration {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  category: "business" | "reviews" | "pos"
  isConnected: boolean
  isLoading: boolean
  priority: "high" | "medium" | "low"
}

export default function ProfileIntegrationsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isOnboarding = searchParams.get("onboarding") === "true"
  const isNew = searchParams.get("new") === "true"

  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "google-my-business",
      name: "Google My Business",
      description: "Manage your Google listing and reviews",
      icon: Globe,
      category: "business",
      isConnected: false,
      isLoading: false,
      priority: "high",
    },
    {
      id: "zomato",
      name: "Zomato",
      description: "Sync menu and reviews from Zomato",
      icon: Star,
      category: "reviews",
      isConnected: false,
      isLoading: false,
      priority: "high",
    },
    {
      id: "swiggy",
      name: "Swiggy",
      description: "Connect your Swiggy restaurant profile",
      icon: MapPin,
      category: "business",
      isConnected: false,
      isLoading: false,
      priority: "high",
    },
    {
      id: "website",
      name: "Website",
      description: "Connect your restaurant website",
      icon: Globe,
      category: "business",
      isConnected: false,
      isLoading: false,
      priority: "medium",
    },
    {
      id: "tripadvisor",
      name: "TripAdvisor",
      description: "Monitor TripAdvisor reviews",
      icon: Users,
      category: "reviews",
      isConnected: false,
      isLoading: false,
      priority: "medium",
    },
    {
      id: "petpooja",
      name: "PetPooja POS",
      description: "Connect PetPooja for sales data",
      icon: CreditCard,
      category: "pos",
      isConnected: false,
      isLoading: false,
      priority: "medium",
    },
    {
      id: "ezetap",
      name: "Ezetap POS",
      description: "Connect Ezetap for sales data",
      icon: CreditCard,
      category: "pos",
      isConnected: false,
      isLoading: false,
      priority: "medium",
    },
    {
      id: "square",
      name: "Square POS",
      description: "Connect Square for sales data",
      icon: CreditCard,
      category: "pos",
      isConnected: false,
      isLoading: false,
      priority: "low",
    },
  ])

  const handleToggleIntegration = async (integrationId: string) => {
    const integration = integrations.find((i) => i.id === integrationId)
    if (!integration) return

    if (integration.category === "pos" && !integration.isConnected) {
      const connectedPOS = integrations.find((i) => i.category === "pos" && i.isConnected)
      if (connectedPOS) {
        alert("Only one POS system can be connected at a time. Please disconnect the current POS first.")
        return
      }
    }

    setIntegrations((prev) =>
      prev.map((integration) => (integration.id === integrationId ? { ...integration, isLoading: true } : integration)),
    )

    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === integrationId
          ? {
              ...integration,
              isConnected: !integration.isConnected,
              isLoading: false,
            }
          : integration,
      ),
    )
  }

  const connectedCount = integrations.filter((i) => i.isConnected).length
  const totalCount = integrations.length
  const connectionPercentage = (connectedCount / totalCount) * 100

  const businessIntegrations = integrations.filter((i) => i.category === "business")
  const reviewIntegrations = integrations.filter((i) => i.category === "reviews")
  const posIntegrations = integrations.filter((i) => i.category === "pos")

  const handleContinue = () => {
    if (isNew) {
      router.push("/profile/social-profile?new=true")
    } else {
      router.push("/profile")
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation variant="minimal" title="Platform Integrations" />

      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-3 sm:mb-0">
              <h1 className="text-xl sm:text-2xl font-bold text-black">Platform Integrations</h1>
              <p className="text-sm text-gray-600 mt-1">Connect your platforms to sync data automatically</p>
            </div>
            <div className="flex items-center space-x-2">
              <LinkIcon className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">
                {connectedCount}/{totalCount} ({Math.round(connectionPercentage)}%)
              </span>
            </div>
          </div>
          <div className="mt-3">
            <Progress value={connectionPercentage} className="h-2" />
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-black mb-3 flex items-center">
            <Globe className="w-5 h-5 mr-2 text-gray-600" />
            Business Platforms
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {businessIntegrations.map((integration) => (
              <Card key={integration.id} className="border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <integration.icon className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-black truncate">{integration.name}</h3>
                        <p className="text-xs text-gray-500 truncate">{integration.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-2">
                      {integration.isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                      ) : integration.isConnected ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleIntegration(integration.id)}
                          className="text-xs px-2 py-1"
                        >
                          Connect
                        </Button>
                      )}
                      {integration.isConnected && (
                        <Switch
                          checked={integration.isConnected}
                          onCheckedChange={() => handleToggleIntegration(integration.id)}
                          disabled={integration.isLoading}
                        />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-black mb-3 flex items-center">
            <Star className="w-5 h-5 mr-2 text-gray-600" />
            Review Platforms
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {reviewIntegrations.map((integration) => (
              <Card key={integration.id} className="border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <integration.icon className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-black truncate">{integration.name}</h3>
                        <p className="text-xs text-gray-500 truncate">{integration.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-2">
                      {integration.isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                      ) : integration.isConnected ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleIntegration(integration.id)}
                          className="text-xs px-2 py-1"
                        >
                          Connect
                        </Button>
                      )}
                      {integration.isConnected && (
                        <Switch
                          checked={integration.isConnected}
                          onCheckedChange={() => handleToggleIntegration(integration.id)}
                          disabled={integration.isLoading}
                        />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-black mb-3 flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-gray-600" />
            POS Systems
            <Badge variant="outline" className="ml-2 text-xs">
              Only one can be connected
            </Badge>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {posIntegrations.map((integration) => (
              <Card key={integration.id} className="border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <integration.icon className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-black truncate">{integration.name}</h3>
                        <p className="text-xs text-gray-500 truncate">{integration.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-2">
                      {integration.isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                      ) : integration.isConnected ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleIntegration(integration.id)}
                          className="text-xs px-2 py-1"
                        >
                          Connect
                        </Button>
                      )}
                      {integration.isConnected && (
                        <Switch
                          checked={integration.isConnected}
                          onCheckedChange={() => handleToggleIntegration(integration.id)}
                          disabled={integration.isLoading}
                        />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-900 mb-1">Data Sync Information</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Business info, menu, and reviews will be fetched from connected platforms</li>
                  <li>• Sales data and item performance will come from your connected POS system</li>
                  <li>• Reviews will be aggregated from all connected review platforms</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {isNew ? (
            <>
              <Button
                variant="outline"
                onClick={() => router.push("/onboarding")}
                className="border-gray-300 text-gray-700"
              >
                Back to Overview
              </Button>
              <Button onClick={handleContinue} className="bg-black hover:bg-gray-800 text-white">
                Continue Setup
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </>
          ) : (
            <Button onClick={() => router.push("/profile")} className="bg-black hover:bg-gray-800 text-white">
              Back to Profile
            </Button>
          )}
        </div>

        {isNew && (
          <div className="text-center mt-4">
            <Button variant="ghost" onClick={handleContinue} className="text-gray-500 hover:text-gray-700 text-sm">
              Skip for now - I'll connect later
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
