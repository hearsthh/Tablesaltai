"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"

export default function OnboardingPage() {
  const router = useRouter()
  const [connectedIntegrations, setConnectedIntegrations] = useState(0)
  const [totalIntegrations] = useState(8)

  const connectionPercentage = Math.round((connectedIntegrations / totalIntegrations) * 100)

  const modules = [
    {
      id: "profile",
      title: "Profile Management",
      description: "Build and manage your restaurant's digital identity across platforms",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
      route: "/profile?new=true",
      tools: [
        {
          name: "Platform Integrations",
          route: "/profile/integrations?new=true",
          description: "Connect business platforms",
        },
        {
          name: "Smart Profile",
          route: "/profile/smart-profile?new=true",
          description: "AI-powered restaurant profile creation",
        },
        {
          name: "Social Profile",
          route: "/profile/social-profile?new=true",
          description: "Social media presence management",
        },
        {
          name: "Menu Builder",
          route: "/profile/menu-builder?new=true",
          description: "Digital menu creation and optimization",
        },
        {
          name: "Review Manager",
          route: "/profile/reviews?new=true",
          description: "Review monitoring and response automation",
        },
      ],
    },
    {
      id: "marketing",
      title: "Marketing Hub",
      description: "Create and manage marketing campaigns with AI assistance",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      route: "/marketing?new=true",
      tools: [
        {
          name: "Marketing Integrations",
          route: "/marketing/integrations?new=true",
          description: "Connect marketing channels",
        },
        {
          name: "Campaign Manager",
          route: "/marketing/campaigns?new=true",
          description: "Create and track marketing campaigns",
        },
        {
          name: "Content Creator",
          route: "/marketing/content?new=true",
          description: "AI-powered content generation",
        },
        {
          name: "Calendar",
          route: "/marketing/calendar?new=true",
          description: "Schedule and plan marketing activities",
        },
        {
          name: "Analytics",
          route: "/marketing/analytics?new=true",
          description: "Track performance and ROI",
        },
      ],
    },
    {
      id: "customers",
      title: "Customer Intelligence",
      description: "Understand and engage your customers with data-driven insights",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      route: "/customers?new=true",
      tools: [
        {
          name: "Customer Integrations",
          route: "/customers/integrations?new=true",
          description: "Connect customer data sources",
        },
        {
          name: "Customer Profiles",
          route: "/customers/profiles?new=true",
          description: "Detailed customer analytics",
        },
        {
          name: "Segmentation",
          route: "/customers/segmentation?new=true",
          description: "AI-powered customer grouping",
        },
        {
          name: "Insights",
          route: "/customers/insights?new=true",
          description: "Behavioral analysis and predictions",
        },
        {
          name: "Churn Analysis",
          route: "/customers/churn?new=true",
          description: "Predict and prevent customer loss",
        },
      ],
    },
  ]

  const handleModuleClick = (route: string) => {
    router.push(route)
  }

  const handleToolClick = (route: string) => {
    router.push(route)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation variant="minimal" title="Setup Dashboard" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Section - More Subtle */}
        <div className="text-center mb-8">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Welcome to TableSalt AI</h1>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Your restaurant's AI-powered digital transformation platform
          </p>
        </div>

        {/* Connection Status */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-3 bg-white rounded-lg border border-gray-200 px-4 py-2">
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${connectionPercentage > 0 ? "bg-green-500" : "bg-gray-300"}`}
              ></div>
              <span className="text-sm text-gray-600">Platform Connections</span>
            </div>
            <Badge variant="outline" className="text-xs border-gray-300 text-gray-700">
              {connectionPercentage}%
            </Badge>
          </div>
        </div>

        {/* Main Modules Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {modules.map((module) => (
            <Card key={module.id} className="border border-gray-200 hover:border-gray-300 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-700">
                      {module.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{module.title}</h3>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleModuleClick(module.route)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </div>

                <p className="text-sm text-gray-600 mb-4">{module.description}</p>

                <div className="space-y-2">
                  {module.tools.map((tool, index) => (
                    <div
                      key={tool.name}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleToolClick(tool.route)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">{tool.name}</span>
                          {tool.name.includes("AI") ||
                          tool.name.includes("Smart") ||
                          tool.name.includes("Creator") ||
                          tool.name.includes("Insights") ? (
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                          ) : null}
                        </div>
                        <p className="text-xs text-gray-500">{tool.description}</p>
                      </div>
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Button
                    onClick={() => handleModuleClick(module.route)}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm"
                  >
                    Open {module.title}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Integration Guidance - Greyish Tone */}
        <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m0 0l4-4a4 4 0 105.656-5.656l-1.102 1.102m-1.102 1.102l-2.828 2.828"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-700 mb-1">Platform Integrations</h4>
              <p className="text-xs text-gray-600">
                Connect your existing platforms (Google My Business, Zomato, Swiggy, POS systems) to automatically sync
                data and unlock advanced features. Each module has its own integration settings.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => router.push("/dashboard")}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Go to Main Dashboard
          </Button>
          <Button
            onClick={() => router.push("/setup-guide")}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            Setup Guide & Benefits
          </Button>
        </div>
      </div>
    </div>
  )
}
