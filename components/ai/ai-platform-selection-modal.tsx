"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { X, CheckCircle, AlertTriangle, Star, Users, Globe, Zap } from "lucide-react"

interface AIPlatformSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onPlatformSelected: (platform: string) => void
  connectedPlatforms: string[]
}

export default function AIPlatformSelectionModal({
  isOpen,
  onClose,
  onPlatformSelected,
  connectedPlatforms,
}: AIPlatformSelectionModalProps) {
  const [selectedPlatform, setSelectedPlatform] = useState("")

  const platformData = [
    {
      id: "google-my-business",
      name: "Google My Business",
      icon: Globe,
      connected: connectedPlatforms.includes("Google My Business"),
      dataQuality: 92,
      features: {
        reviews: 1247,
        photos: 89,
        businessInfo: "Complete",
        hours: "Updated",
        posts: 23,
      },
      benefits: [
        "Complete business information",
        "1,200+ customer reviews",
        "High-quality photos",
        "Regular business updates",
      ],
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "zomato",
      name: "Zomato",
      icon: Star,
      connected: connectedPlatforms.includes("Zomato"),
      dataQuality: 88,
      features: {
        reviews: 892,
        photos: 156,
        menu: "Complete",
        ratings: "4.3/5",
        orders: 2341,
      },
      benefits: ["Detailed menu information", "Food-focused reviews", "High-quality food photos", "Order analytics"],
      color: "from-red-500 to-red-600",
    },
    {
      id: "swiggy",
      name: "Swiggy",
      icon: Zap,
      connected: connectedPlatforms.includes("Swiggy"),
      dataQuality: 85,
      features: {
        reviews: 634,
        photos: 67,
        menu: "Complete",
        ratings: "4.2/5",
        orders: 1876,
      },
      benefits: ["Delivery-focused insights", "Customer preferences", "Menu performance data", "Order patterns"],
      color: "from-orange-500 to-orange-600",
    },
    {
      id: "multiple",
      name: "All Connected Platforms",
      icon: Users,
      connected: connectedPlatforms.length >= 2,
      dataQuality: 95,
      features: {
        reviews: 2773,
        photos: 312,
        coverage: "Complete",
        insights: "Advanced",
        accuracy: "High",
      },
      benefits: [
        "Comprehensive data analysis",
        "Cross-platform insights",
        "Maximum accuracy",
        "Complete profile coverage",
      ],
      color: "from-purple-500 to-purple-600",
    },
  ]

  const handlePlatformSelect = (platformId: string) => {
    setSelectedPlatform(platformId)
  }

  const handleContinue = () => {
    if (selectedPlatform) {
      const platform = platformData.find((p) => p.id === selectedPlatform)
      onPlatformSelected(platform?.name || selectedPlatform)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] w-[95vw] flex flex-col bg-white overflow-hidden">
        <DialogHeader className="border-b border-gray-200 pb-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold text-black">Select Data Source</DialogTitle>
              <DialogDescription className="text-sm text-gray-600 mt-1">
                Choose which platform data to use for AI profile generation
              </DialogDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-100">
              <X className="w-4 h-4 text-gray-600" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {platformData.map((platform) => (
              <div
                key={platform.id}
                onClick={() => platform.connected && handlePlatformSelect(platform.id)}
                className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  !platform.connected
                    ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                    : selectedPlatform === platform.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {!platform.connected && (
                  <div className="absolute top-2 right-2">
                    <AlertTriangle className="w-4 h-4 text-gray-400" />
                  </div>
                )}

                {platform.connected && selectedPlatform === platform.id && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                )}

                <div className="flex items-start space-x-3 mb-3">
                  <div
                    className={`w-10 h-10 bg-gradient-to-r ${platform.color} rounded-lg flex items-center justify-center`}
                  >
                    <platform.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-black">{platform.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-600">Data Quality:</span>
                      <Progress value={platform.dataQuality} className="h-1.5 w-16 bg-gray-200" />
                      <span className="text-xs font-medium text-gray-900">{platform.dataQuality}%</span>
                    </div>
                  </div>
                </div>

                {platform.connected ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(platform.features).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-600 capitalize">{key}:</span>
                          <span className="font-medium text-gray-900">{value}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-medium text-black">Benefits:</h4>
                      <ul className="space-y-1">
                        {platform.benefits.map((benefit, index) => (
                          <li key={index} className="text-xs text-gray-600 flex items-center">
                            <CheckCircle className="w-3 h-3 text-green-500 mr-1 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-xs text-gray-500 mb-2">Platform not connected</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs border-gray-300 hover:bg-gray-100 bg-transparent"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Handle platform connection
                      }}
                    >
                      Connect Platform
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {selectedPlatform && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-medium text-blue-900">Selected Data Source</h4>
              </div>
              <p className="text-xs text-blue-700">
                {selectedPlatform === "multiple"
                  ? "AI will analyze data from all connected platforms for maximum accuracy and comprehensive insights."
                  : `AI will use ${platformData.find((p) => p.id === selectedPlatform)?.name} data to generate your social profile.`}
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {connectedPlatforms.length} platform{connectedPlatforms.length !== 1 ? "s" : ""} connected
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={onClose} className="text-black border-gray-300 bg-transparent">
                Cancel
              </Button>
              <Button
                onClick={handleContinue}
                disabled={!selectedPlatform}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Continue with Selected Source
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
