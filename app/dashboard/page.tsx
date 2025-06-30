"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useRouter, useSearchParams } from "next/navigation"
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  BarChart3,
  Target,
  Zap,
  Brain,
  Building,
  Users,
  MenuIcon,
  LinkIcon,
} from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isNewUser, setIsNewUser] = useState(false)
  const [connectedIntegrations, setConnectedIntegrations] = useState(0)
  const [totalIntegrations] = useState(8)

  useEffect(() => {
    const onboarding = searchParams.get("onboarding")
    const newUser = searchParams.get("new")
    const isNew = onboarding === "true" || newUser === "true"
    setIsNewUser(isNew)

    // For new users, start with 0% integrations
    setConnectedIntegrations(isNew ? 0 : 3)
  }, [searchParams])

  const integrationPercentage = Math.round((connectedIntegrations / totalIntegrations) * 100)

  const getIntegrationColor = (percentage: number) => {
    if (percentage === 0) return "text-gray-400"
    if (percentage < 40) return "text-red-500"
    if (percentage < 70) return "text-yellow-500"
    return "text-green-500"
  }

  const dashboardModules = [
    {
      id: "profile-manager",
      title: "Profile Manager",
      description: "Restaurant setup and platform integrations",
      icon: Building,
      status: "ready",
      completion: isNewUser ? 0 : 85,
      color: "bg-white border-gray-200",
      route: "/profile",
      priority: 1,
    },
    {
      id: "marketing",
      title: "Marketing Hub",
      description: "Campaigns and content creation",
      icon: TrendingUp,
      status: "available",
      completion: isNewUser ? 0 : 40,
      color: "bg-white border-gray-200",
      route: "/marketing",
      priority: 2,
    },
    {
      id: "customers",
      title: "Customer Intelligence",
      description: "Analytics and insights",
      icon: Target,
      status: "available",
      completion: isNewUser ? 0 : 30,
      color: "bg-white border-gray-200",
      route: "/customers",
      priority: 3,
    },
    {
      id: "analytics",
      title: "Business Analytics",
      description: "Performance metrics and reporting",
      icon: BarChart3,
      status: "available",
      completion: isNewUser ? 0 : 50,
      color: "bg-white border-gray-200",
      route: "/analytics",
      priority: 4,
    },
  ]

  const aiFeatures = [
    {
      title: "Smart Analysis",
      description: "AI analyzes your data to provide actionable insights",
      icon: Brain,
      gradient: "from-cyan-500 to-blue-600",
      features: ["Data Analysis", "Pattern Recognition", "Predictive Insights", "Performance Metrics"],
    },
    {
      title: "Content Generation",
      description: "Generate marketing content, descriptions, and social posts",
      icon: Sparkles,
      gradient: "from-purple-500 to-pink-600",
      features: ["Marketing Copy", "Menu Descriptions", "Social Posts", "Email Campaigns"],
    },
    {
      title: "Process Automation",
      description: "Automate routine tasks and optimize operations",
      icon: Zap,
      gradient: "from-orange-500 to-red-600",
      features: ["Review Responses", "Social Posting", "Inventory Updates", "Customer Outreach"],
    },
  ]

  const handleModuleClick = (module: any) => {
    const params = new URLSearchParams()
    if (isNewUser) {
      params.set("onboarding", "true")
      params.set("new", "true")
    }

    const url = `${module.route}${params.toString() ? "?" + params.toString() : ""}`
    router.push(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">TableSalt</span>
            </div>

            <nav className="hidden sm:flex space-x-8">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => router.push("/profile")}
              >
                <Building className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => router.push("/marketing")}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Marketing
              </Button>
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => router.push("/customers")}
              >
                <Users className="w-4 h-4 mr-2" />
                Customers
              </Button>
            </nav>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <LinkIcon className="w-4 h-4 text-gray-400" />
                <span className={`text-sm font-medium ${getIntegrationColor(integrationPercentage)}`}>
                  {integrationPercentage}%
                </span>
              </div>
              <Button variant="ghost" size="sm" className="sm:hidden">
                <MenuIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* New User Welcome */}
        {isNewUser && (
          <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-gray-900">Welcome to TableSalt! 🎉</h3>
                <p className="text-gray-600 mt-1">
                  Let's set up your restaurant's digital foundation. Start with Profile Manager to connect your
                  platforms and build your presence.
                </p>
                <div className="mt-4">
                  <Button
                    onClick={() => handleModuleClick(dashboardModules[0])}
                    className="bg-gray-900 hover:bg-gray-800 text-white"
                  >
                    Start Setup
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your restaurant's digital presence</p>
          </div>
        </div>

        {/* Dashboard Modules */}
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          {dashboardModules.map((module) => (
            <Card
              key={module.id}
              className={`${module.color} cursor-pointer transition-all duration-200 hover:shadow-md`}
              onClick={() => handleModuleClick(module)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-3">
                  <module.icon className="w-6 h-6 text-gray-600" />
                  <CardTitle className="text-lg text-gray-900">{module.title}</CardTitle>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 mb-4">{module.description}</CardDescription>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Progress</span>
                  <span className="text-sm text-gray-600">{module.completion}%</span>
                </div>
                <Progress value={module.completion} className="h-2 bg-gray-200 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Features */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">AI-Powered Features</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {aiFeatures.map((feature) => (
              <Card key={feature.title} className="bg-white border-gray-200 relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feature.gradient}`}></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center`}
                    >
                      <feature.icon className="w-4 h-4 text-white" />
                    </div>
                    <CardTitle className="text-lg text-gray-900">{feature.title}</CardTitle>
                  </div>
                  <Badge variant="outline" className="border-gray-300 text-gray-700">
                    Available
                  </Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 mb-4">{feature.description}</CardDescription>
                  <div className="flex flex-wrap gap-2">
                    {feature.features.map((featureName) => (
                      <Badge key={featureName} variant="outline" className="text-xs border-gray-300 text-gray-700">
                        {featureName}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
