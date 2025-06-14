"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Navigation } from "@/components/navigation"
import {
  TrendingUp,
  Globe,
  ChefHat,
  MessageSquare,
  Star,
  Eye,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  Settings,
  Link,
  ExternalLink,
} from "lucide-react"

export default function ProfileDashboard() {
  const router = useRouter()
  const [completionPercentage] = useState(65)
  const [setupExpanded, setSetupExpanded] = useState(false)
  const [integrationsExpanded, setIntegrationsExpanded] = useState(false)
  const [integrationToggles, setIntegrationToggles] = useState({
    google: true,
    zomato: false,
    tripadvisor: true,
    swiggy: false,
  })

  const setupSteps = [
    {
      id: 1,
      title: "Restaurant Information",
      description: "Basic details about your restaurant",
      status: "completed",
      icon: MapPin,
      href: "/profile/smart-profile",
    },
    {
      id: 2,
      title: "Brand Assets",
      description: "Logo, colors, and brand voice",
      status: "completed",
      icon: Star,
      href: "/profile/smart-profile",
    },
    {
      id: 3,
      title: "Media Assets",
      description: "Photos and videos of your restaurant",
      status: "pending",
      icon: Eye,
      href: "/profile/smart-profile",
    },
  ]

  const profileAssets = [
    {
      title: "Smart Profile",
      description: "AI-generated restaurant website",
      status: "live",
      statusColor: "bg-emerald-100 text-emerald-700",
      metric: "2,847 views",
      icon: Globe,
      href: "/profile/smart-profile",
      color: "bg-blue-50 border-blue-200",
    },
    {
      title: "Menu Builder",
      description: "Digital menu management",
      status: "active",
      statusColor: "bg-blue-100 text-blue-700",
      metric: "24 items",
      icon: ChefHat,
      href: "/profile/menu-builder",
      color: "bg-orange-50 border-orange-200",
    },
    {
      title: "WhatsApp Card",
      description: "Business card for WhatsApp",
      status: "setup",
      statusColor: "bg-amber-100 text-amber-700",
      metric: "60% complete",
      icon: MessageSquare,
      href: "/profile/whatsapp-card",
      color: "bg-green-50 border-green-200",
    },
    {
      title: "Reviews Manager",
      description: "Manage reviews from all platforms",
      status: "active",
      statusColor: "bg-purple-100 text-purple-700",
      metric: "156 reviews",
      icon: Star,
      href: "/profile/reviews",
      color: "bg-purple-50 border-purple-200",
    },
  ]

  const quickStats = [
    {
      title: "Website Views",
      value: "2,847",
      change: "+12%",
      changeType: "positive",
      icon: Eye,
      color: "bg-blue-50 text-blue-700",
    },
    {
      title: "Menu Items",
      value: "24",
      change: "+3",
      changeType: "positive",
      icon: ChefHat,
      color: "bg-orange-50 text-orange-700",
    },
    {
      title: "Avg. Rating",
      value: "4.6",
      change: "+0.2",
      changeType: "positive",
      icon: Star,
      color: "bg-amber-50 text-amber-700",
    },
    {
      title: "Total Reviews",
      value: "156",
      change: "+8",
      changeType: "positive",
      icon: MessageSquare,
      color: "bg-purple-50 text-purple-700",
    },
  ]

  const recentActivity = [
    {
      action: "New review received",
      platform: "Google My Business",
      time: "2 hours ago",
      rating: 5,
      type: "review",
    },
    {
      action: "Menu item updated",
      platform: "Menu Builder",
      time: "5 hours ago",
      item: "Chicken Tikka",
      type: "menu",
    },
    {
      action: "Profile viewed",
      platform: "Smart Profile",
      time: "1 day ago",
      views: 23,
      type: "view",
    },
    {
      action: "WhatsApp card shared",
      platform: "WhatsApp Business",
      time: "2 days ago",
      shares: 5,
      type: "share",
    },
    {
      action: "Review responded",
      platform: "TripAdvisor",
      time: "3 days ago",
      type: "review",
    },
  ]

  const platformIntegrations = [
    {
      id: "google",
      name: "Google My Business",
      status: "connected",
      icon: "🏢",
      enabled: integrationToggles.google,
    },
    {
      id: "zomato",
      name: "Zomato",
      status: "disconnected",
      icon: "🍽️",
      enabled: integrationToggles.zomato,
    },
    {
      id: "tripadvisor",
      name: "TripAdvisor",
      status: "connected",
      icon: "✈️",
      enabled: integrationToggles.tripadvisor,
    },
    {
      id: "swiggy",
      name: "Swiggy",
      status: "disconnected",
      icon: "🛵",
      enabled: integrationToggles.swiggy,
    },
  ]

  const connectedCount = platformIntegrations.filter((p) => p.status === "connected").length

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-emerald-600" />
      case "pending":
        return <Clock className="w-5 h-5 text-amber-600" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "review":
        return <Star className="w-4 h-4 text-amber-500" />
      case "menu":
        return <ChefHat className="w-4 h-4 text-orange-500" />
      case "view":
        return <Eye className="w-4 h-4 text-blue-500" />
      case "share":
        return <MessageSquare className="w-4 h-4 text-green-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const handleIntegrationToggle = (integrationId: string) => {
    setIntegrationToggles((prev) => ({
      ...prev,
      [integrationId]: !prev[integrationId as keyof typeof prev],
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold text-slate-900">Restaurant Profile</h1>
              <p className="text-slate-600 mt-2">Manage your restaurant's digital presence</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="flex items-center rounded-md border-slate-200"
                onClick={() => router.push("/profile/smart-profile")}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Smart Profile
              </Button>
              <Button
                className="flex items-center bg-slate-900 hover:bg-slate-800 rounded-md"
                onClick={() => router.push("/marketing")}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Marketing Hub
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Performance Overview */}
            <Card className="border-slate-200">
              <CardHeader className="bg-slate-50 border-b border-slate-200">
                <CardTitle className="flex items-center text-slate-900">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Performance Overview
                </CardTitle>
                <CardDescription>Key metrics for your restaurant profile</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {quickStats.map((stat, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${stat.color}`}>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-8 h-8 rounded-md bg-white/50 flex items-center justify-center">
                          <stat.icon className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                      <div className="text-sm text-slate-600">{stat.title}</div>
                      <div className="text-xs text-emerald-600 font-medium">{stat.change} from last month</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 2. Profile Assets */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Profile Assets</CardTitle>
                <CardDescription>Manage different aspects of your restaurant profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profileAssets.map((asset, index) => (
                    <div
                      key={index}
                      className={`p-6 border rounded-lg hover:shadow-sm transition-all duration-200 cursor-pointer group ${asset.color}`}
                      onClick={() => router.push(asset.href)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-white/50 rounded-md flex items-center justify-center group-hover:bg-white/70 transition-colors">
                            <asset.icon className="w-5 h-5 text-slate-700" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900">{asset.title}</h3>
                            <p className="text-sm text-slate-600">{asset.description}</p>
                          </div>
                        </div>
                        <Badge className={asset.statusColor} variant="secondary">
                          {asset.status}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-600">{asset.metric}</div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 3. Recent Activities */}
            <Card className="border-slate-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Recent Activities
                    </CardTitle>
                    <CardDescription>Latest updates across your restaurant profile</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-md border-slate-200"
                    onClick={() => router.push("/profile/reviews")}
                  >
                    View All Activities
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                    <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                      <p className="text-xs text-slate-500">{activity.platform}</p>
                      <p className="text-xs text-slate-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 4. Collapsible Setup Section */}
            <Collapsible open={setupExpanded} onOpenChange={setSetupExpanded}>
              <Card className="border-slate-200">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          <Settings className="w-5 h-5 mr-2" />
                          Profile Setup
                        </CardTitle>
                        <CardDescription>Complete your profile setup ({completionPercentage}% done)</CardDescription>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Progress value={completionPercentage} className="w-24 h-2" />
                        {setupExpanded ? (
                          <ChevronUp className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {setupSteps.map((step) => (
                        <div
                          key={step.id}
                          className="flex items-center space-x-4 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                          onClick={() => router.push(step.href)}
                        >
                          <div className="flex-shrink-0">{getStatusIcon(step.status)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium text-slate-900">{step.title}</h4>
                              <Badge
                                variant={step.status === "completed" ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {step.status === "completed" ? "Completed" : "Required"}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-500">{step.description}</p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-slate-400" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* 5. Collapsible Platform Integrations */}
            <Collapsible open={integrationsExpanded} onOpenChange={setIntegrationsExpanded}>
              <Card className="border-slate-200">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          <Link className="w-5 h-5 mr-2" />
                          Platform Integrations
                        </CardTitle>
                        <CardDescription>
                          {connectedCount} of {platformIntegrations.length} platforms connected
                        </CardDescription>
                      </div>
                      {integrationsExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {platformIntegrations.map((platform) => (
                        <div
                          key={platform.id}
                          className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">{platform.icon}</span>
                            <div>
                              <span className="font-medium text-slate-900">{platform.name}</span>
                              <div className="flex items-center space-x-2 mt-1">
                                <div
                                  className={`w-2 h-2 rounded-full ${platform.status === "connected" ? "bg-emerald-500" : "bg-gray-300"}`}
                                ></div>
                                <span className="text-xs text-slate-500">
                                  {platform.status === "connected" ? "Connected" : "Not connected"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Switch
                              checked={platform.enabled}
                              onCheckedChange={() => handleIntegrationToggle(platform.id)}
                              disabled={platform.status !== "connected"}
                              className="data-[state=checked]:bg-slate-900"
                            />
                            {platform.status === "disconnected" && (
                              <Button size="sm" variant="outline" className="h-8 px-3 rounded-md border-slate-200">
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Connect
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* 6. Quick Actions */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button
                  variant="outline"
                  className="flex flex-col items-center p-4 h-auto rounded-md border-slate-200"
                  onClick={() => router.push("/profile/smart-profile")}
                >
                  <Eye className="w-5 h-5 mb-2" />
                  <span className="text-sm">Edit Profile</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center p-4 h-auto rounded-md border-slate-200"
                  onClick={() => router.push("/profile/menu-builder")}
                >
                  <ChefHat className="w-5 h-5 mb-2" />
                  <span className="text-sm">Manage Menu</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center p-4 h-auto rounded-md border-slate-200"
                  onClick={() => router.push("/profile/whatsapp-card")}
                >
                  <MessageSquare className="w-5 h-5 mb-2" />
                  <span className="text-sm">WhatsApp Card</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center p-4 h-auto rounded-md border-slate-200"
                  onClick={() => router.push("/profile/reviews")}
                >
                  <BarChart3 className="w-5 h-5 mb-2" />
                  <span className="text-sm">View Analytics</span>
                </Button>
              </CardContent>
            </Card>

            {/* 7. Footer */}
            <div className="text-center py-8 border-t border-slate-200">
              <p className="text-sm text-slate-500">© 2024 TableSalt. All rights reserved.</p>
              <div className="flex justify-center space-x-6 mt-2">
                <Button variant="link" size="sm" className="text-slate-500 p-0 h-auto">
                  Privacy Policy
                </Button>
                <Button variant="link" size="sm" className="text-slate-500 p-0 h-auto">
                  Terms of Service
                </Button>
                <Button variant="link" size="sm" className="text-slate-500 p-0 h-auto">
                  Support
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Restaurant Info */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Restaurant Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ChefHat className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900">Spice Garden</h3>
                  <p className="text-sm text-slate-500">Authentic Indian Cuisine with Modern Flair</p>
                </div>
                <div className="space-y-3 pt-4 border-t border-slate-200">
                  <div className="flex items-center space-x-3 text-sm">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">Mumbai, Maharashtra</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">+91 98765 43210</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">info@spicegarden.com</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
