"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Building,
  ArrowRight,
  CheckCircle,
  Clock,
  MessageSquare,
  MenuIcon,
  Sparkles,
  Users,
  TrendingUp,
  Settings,
  Wifi,
} from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isOnboarding = searchParams.get("onboarding") === "true"
  const isNewUser = searchParams.get("new") === "true"

  const [overallProgress, setOverallProgress] = useState(0)
  const [integrationProgress] = useState(65) // Mock integration percentage

  // Profile modules with clear user flow
  const profileModules = [
    {
      id: "social-profile",
      title: "Social Profile",
      description: "Create your restaurant's brand identity and social presence",
      icon: Building,
      status: "available",
      progress: isNewUser ? 0 : 85,
      route: "/profile/social-profile",
      priority: 1,
      estimatedTime: "20-30 min",
      features: ["Basic Info", "Brand Assets", "Profile Content", "Features"],
      isRequired: true,
      userFlowStep: 1,
    },
    {
      id: "menu-builder",
      title: "Menu Manager",
      description: "Build and manage your digital menu with AI-powered insights",
      icon: MenuIcon,
      status: "available",
      progress: isNewUser ? 0 : 60,
      route: "/profile/menu-builder",
      priority: 2,
      estimatedTime: "15-25 min",
      features: ["Menu Items", "Categories", "Pricing", "AI Descriptions"],
      isRequired: true,
      userFlowStep: 2,
    },
    {
      id: "reviews",
      title: "Review Manager",
      description: "Monitor and manage customer reviews with AI automation",
      icon: MessageSquare,
      status: "available",
      progress: isNewUser ? 0 : 40,
      route: "/profile/reviews",
      priority: 3,
      estimatedTime: "10-15 min",
      features: ["Review Sync", "AI Responses", "Sentiment Analysis", "Insights"],
      isRequired: false,
      userFlowStep: 3,
    },
  ]

  // Calculate overall progress
  useEffect(() => {
    if (isNewUser) {
      setOverallProgress(0)
    } else {
      const totalProgress = profileModules.reduce((acc, module) => acc + module.progress, 0)
      const averageProgress = Math.round(totalProgress / profileModules.length)
      setOverallProgress(averageProgress)
    }
  }, [isNewUser])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "in-progress":
        return <Clock className="w-4 h-4 text-blue-600" />
      case "ready":
        return <Sparkles className="w-4 h-4 text-purple-600" />
      case "locked":
        return <Clock className="w-4 h-4 text-gray-400" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-700 border-green-200"
      case "in-progress":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "ready":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "locked":
        return "bg-gray-50 text-gray-500 border-gray-200"
      default:
        return "bg-gray-50 text-gray-500 border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed"
      case "in-progress":
        return "In Progress"
      case "ready":
        return "Ready to Start"
      case "locked":
        return "Locked"
      default:
        return "Available"
    }
  }

  const handleModuleClick = (module: any) => {
    const params = new URLSearchParams()
    if (isOnboarding) params.set("onboarding", "true")
    if (isNewUser) params.set("new", "true")

    const url = `${module.route}${params.toString() ? "?" + params.toString() : ""}`
    router.push(url)
  }

  const handleIntegrationsClick = () => {
    const params = new URLSearchParams()
    if (isOnboarding) params.set("onboarding", "true")
    if (isNewUser) params.set("new", "true")

    router.push(`/profile/integrations${params.toString() ? "?" + params.toString() : ""}`)
  }

  const getNextAvailableModule = () => {
    return profileModules.find((module) => module.status === "ready" || module.status === "in-progress")
  }

  const nextModule = getNextAvailableModule()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
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
                onClick={() => router.push("/dashboard")}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => router.push("/marketing")}
              >
                <Users className="w-4 h-4 mr-2" />
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

            <Button variant="ghost" size="sm" className="sm:hidden">
              <MenuIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          {/* Onboarding Header */}
          {isOnboarding && (
            <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Profile Manager Setup</h1>
                  <p className="text-gray-600 mt-1">
                    Complete these modules to set up your restaurant's digital foundation
                  </p>
                </div>
                <Badge className="bg-gray-900 text-white">Profile Module</Badge>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">Overall Progress</span>
                  <span className="text-sm text-gray-600">{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} className="h-2 bg-gray-200" />
              </div>

              {nextModule && (
                <div className="flex items-center justify-between p-4 bg-white rounded border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <nextModule.icon className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Next: {nextModule.title}</p>
                      <p className="text-sm text-gray-600">{nextModule.estimatedTime}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleModuleClick(nextModule)}
                    className="bg-gray-900 hover:bg-gray-800 text-white"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Regular Header */}
          {!isOnboarding && (
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Profile Manager</h1>
                  <p className="text-gray-600 mt-1">Manage your restaurant's digital presence</p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-4 sm:w-64">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">Overall Progress</span>
                    <span className="text-sm text-gray-600">{overallProgress}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-2 bg-gray-200" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Module Cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Integration Status Card */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Wifi className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-blue-900">Platform Integrations</CardTitle>
                      <CardDescription className="text-blue-700">
                        Connect to Google My Business, Zomato, Swiggy and other platforms
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-900">{integrationProgress}%</div>
                      <div className="text-xs text-blue-700">Connected</div>
                    </div>
                    <Button
                      onClick={handleIntegrationsClick}
                      variant="outline"
                      size="sm"
                      className="border-blue-300 text-blue-700 hover:bg-blue-100 bg-transparent"
                    >
                      <Settings className="w-4 h-4 mr-1" />
                      Manage
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Progress value={integrationProgress} className="h-2 bg-blue-200" />
                  <p className="text-xs text-blue-700">
                    {integrationProgress >= 50 ? "Good progress! " : ""}
                    Connect more platforms to sync data automatically and improve your online presence.
                  </p>
                </div>
              </CardContent>
            </Card>

            {profileModules.map((module, index) => {
              const canAccess = true // Always allow access

              return (
                <Card
                  key={module.id}
                  className={`border-gray-200 transition-all duration-200 hover:shadow-md cursor-pointer`}
                  onClick={() => canAccess && handleModuleClick(module)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <module.icon className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-gray-900 flex items-center">
                            {module.title}
                            {module.isRequired && <span className="text-red-500 ml-1">*</span>}
                          </CardTitle>
                          <CardDescription className="text-gray-600 mt-1">{module.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(module.status)}
                        <Badge className={`${getStatusColor(module.status)}`}>{getStatusText(module.status)}</Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">Progress</span>
                        <span className="text-sm text-gray-600">{module.progress}%</span>
                      </div>
                      <Progress value={module.progress} className="h-2 bg-gray-200" />
                    </div>

                    {/* Features */}
                    <div className="space-y-2">
                      <span className="text-sm font-medium text-gray-900">Features</span>
                      <div className="flex flex-wrap gap-2">
                        {module.features.map((feature, featureIndex) => (
                          <Badge key={featureIndex} variant="outline" className="text-xs border-gray-300 text-gray-700">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      {module.status === "completed" ? "View & Edit" : "Get Started"}
                    </Button>

                    {/* Estimated Time */}
                    <div className="text-center">
                      <span className="text-sm text-gray-500">Estimated time: {module.estimatedTime}</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="text-2xl font-bold text-gray-900">
                      {profileModules.filter((m) => m.status === "completed").length}
                    </div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="text-2xl font-bold text-gray-900">
                      {profileModules.filter((m) => m.status === "in-progress" || m.status === "ready").length}
                    </div>
                    <div className="text-sm text-gray-600">Remaining</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Setup Guide */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Setup Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {profileModules.map((module, index) => (
                    <div key={module.id} className="flex items-center space-x-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          module.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : module.status === "ready" || module.status === "in-progress"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {module.status === "completed" ? <CheckCircle className="w-4 h-4" /> : <span>{index + 1}</span>}
                      </div>
                      <span className={`text-sm ${module.status === "completed" ? "text-green-700" : "text-gray-600"}`}>
                        {module.title}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">💡 Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Connect platforms first to sync your data automatically</p>
                  <p>• Use AI features to generate content automatically</p>
                  <p>• Complete all required modules for best results</p>
                  <p>• Review and update your profile regularly</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
