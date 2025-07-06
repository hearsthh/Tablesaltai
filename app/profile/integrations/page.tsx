"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { Navigation } from "@/components/navigation"
import {
  Globe,
  Star,
  CreditCard,
  BarChart3,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Settings,
  Zap,
  TrendingUp,
  Clock,
  Eye,
  MessageSquare,
  Phone,
  Mail,
  Camera,
} from "lucide-react"

interface Integration {
  id: string
  name: string
  description: string
  category: "reviews" | "pos" | "delivery" | "social" | "analytics" | "communication"
  icon: any
  isConnected: boolean
  isEnabled: boolean
  lastSync: string
  dataPoints: number
  status: "active" | "error" | "syncing" | "inactive"
  features: string[]
  metrics?: {
    label: string
    value: string | number
    change?: string
    color: string
  }[]
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "google-business",
      name: "Google My Business",
      description: "Manage your business profile, reviews, and customer interactions",
      category: "reviews",
      icon: Globe,
      isConnected: true,
      isEnabled: true,
      lastSync: "2 minutes ago",
      dataPoints: 1247,
      status: "active",
      features: ["Business Profile", "Customer Reviews", "Photos", "Posts", "Insights"],
      metrics: [
        { label: "Profile Views", value: "2.4K", change: "+12%", color: "text-blue-600" },
        { label: "Reviews", value: 89, change: "+5", color: "text-green-600" },
        { label: "Rating", value: "4.8", color: "text-yellow-600" },
        { label: "Photos", value: 156, change: "+8", color: "text-purple-600" },
      ],
    },
    {
      id: "zomato",
      name: "Zomato",
      description: "Food delivery platform with customer reviews and menu management",
      category: "delivery",
      icon: Star,
      isConnected: true,
      isEnabled: true,
      lastSync: "5 minutes ago",
      dataPoints: 892,
      status: "active",
      features: ["Menu Management", "Order Analytics", "Customer Reviews", "Promotions"],
      metrics: [
        { label: "Orders", value: "1.2K", change: "+18%", color: "text-green-600" },
        { label: "Revenue", value: "₹45K", change: "+22%", color: "text-blue-600" },
        { label: "Rating", value: "4.3", color: "text-yellow-600" },
        { label: "Reviews", value: 234, change: "+12", color: "text-purple-600" },
      ],
    },
    {
      id: "petpooja-pos",
      name: "PetPooja POS",
      description: "Point of sale system with inventory and sales analytics",
      category: "pos",
      icon: CreditCard,
      isConnected: true,
      isEnabled: true,
      lastSync: "1 minute ago",
      dataPoints: 2341,
      status: "active",
      features: ["Sales Analytics", "Inventory Management", "Customer Data", "Reports"],
      metrics: [
        { label: "Daily Sales", value: "₹12.5K", change: "+8%", color: "text-green-600" },
        { label: "Transactions", value: 156, change: "+15", color: "text-blue-600" },
        { label: "Avg Order", value: "₹380", change: "+5%", color: "text-purple-600" },
        { label: "Items Sold", value: 423, change: "+28", color: "text-orange-600" },
      ],
    },
    {
      id: "swiggy",
      name: "Swiggy",
      description: "Food delivery platform with order management and analytics",
      category: "delivery",
      icon: Zap,
      isConnected: false,
      isEnabled: false,
      lastSync: "Never",
      dataPoints: 0,
      status: "inactive",
      features: ["Order Management", "Delivery Analytics", "Customer Insights", "Promotions"],
    },
    {
      id: "instagram",
      name: "Instagram Business",
      description: "Social media platform for visual content and customer engagement",
      category: "social",
      icon: Camera,
      isConnected: false,
      isEnabled: false,
      lastSync: "Never",
      dataPoints: 0,
      status: "inactive",
      features: ["Content Management", "Story Analytics", "Customer Engagement", "Advertising"],
    },
    {
      id: "whatsapp",
      name: "WhatsApp Business",
      description: "Direct customer communication and order management",
      category: "communication",
      icon: MessageSquare,
      isConnected: false,
      isEnabled: false,
      lastSync: "Never",
      dataPoints: 0,
      status: "inactive",
      features: ["Customer Support", "Order Updates", "Broadcast Messages", "Automation"],
    },
  ])

  const [overallStats, setOverallStats] = useState({
    totalConnections: 3,
    totalPlatforms: 6,
    dataPoints: 4480,
    lastUpdate: "1 minute ago",
  })

  const handleToggleIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === id ? { ...integration, isEnabled: !integration.isEnabled } : integration,
      ),
    )
    toast({
      title: "Integration Updated",
      description: "Integration settings have been saved successfully.",
    })
  }

  const handleConnect = (id: string) => {
    // Simulate connection process
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === id
          ? {
              ...integration,
              status: "syncing" as const,
            }
          : integration,
      ),
    )

    setTimeout(() => {
      setIntegrations((prev) =>
        prev.map((integration) =>
          integration.id === id
            ? {
                ...integration,
                isConnected: true,
                isEnabled: true,
                status: "active" as const,
                lastSync: "Just now",
                dataPoints: Math.floor(Math.random() * 1000) + 500,
              }
            : integration,
        ),
      )
      toast({
        title: "Integration Connected",
        description: `Successfully connected to ${integrations.find((i) => i.id === id)?.name}`,
      })
    }, 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600"
      case "error":
        return "text-red-600"
      case "syncing":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />
      case "error":
        return <AlertCircle className="w-4 h-4" />
      case "syncing":
        return <div className="w-4 h-4 border border-blue-600 border-t-transparent rounded-full animate-spin" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const connectedIntegrations = integrations.filter((i) => i.isConnected)
  const connectionPercentage = Math.round((connectedIntegrations.length / integrations.length) * 100)

  return (
    <div className="min-h-screen bg-white">
      <Navigation variant="minimal" title="Integrations" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">Platform Integrations</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Connect your restaurant to popular platforms and manage all your data in one place
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-gray-200 bg-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Connected</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">{overallStats.totalConnections}</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Available</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">{overallStats.totalPlatforms}</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Data Points</p>
                  <p className="text-xl sm:text-2xl font-bold text-purple-600">
                    {overallStats.dataPoints.toLocaleString()}
                  </p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Sync Status</p>
                  <p className="text-xl sm:text-2xl font-bold text-orange-600">{connectionPercentage}%</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Connection Progress */}
        <Card className="border-gray-200 bg-white mb-8">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-black text-lg">Integration Progress</CardTitle>
                <CardDescription className="text-sm">
                  {connectedIntegrations.length} of {integrations.length} platforms connected
                </CardDescription>
              </div>
              <Badge className="bg-gray-100 text-gray-800 border-gray-200 w-fit">
                Last updated: {overallStats.lastUpdate}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Overall Progress</span>
                <span className="font-medium text-black">{connectionPercentage}%</span>
              </div>
              <Progress value={connectionPercentage} className="h-2 bg-gray-200" />
            </div>
          </CardContent>
        </Card>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {integrations.map((integration) => (
            <Card key={integration.id} className="border-gray-200 bg-white hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <integration.icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-black text-base sm:text-lg">{integration.name}</CardTitle>
                      <CardDescription className="text-xs sm:text-sm text-gray-600 mt-1">
                        {integration.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`flex items-center space-x-1 ${getStatusColor(integration.status)}`}>
                      {getStatusIcon(integration.status)}
                      <span className="text-xs font-medium capitalize">{integration.status}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Connection Status */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-black">
                      {integration.isConnected ? "Connected" : "Not Connected"}
                    </span>
                    {integration.isConnected && (
                      <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">Active</Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {integration.isConnected && (
                      <Switch
                        checked={integration.isEnabled}
                        onCheckedChange={() => handleToggleIntegration(integration.id)}
                      />
                    )}
                    {!integration.isConnected && (
                      <Button
                        onClick={() => handleConnect(integration.id)}
                        disabled={integration.status === "syncing"}
                        className="bg-black hover:bg-gray-800 text-white text-xs px-3 py-1 h-8"
                      >
                        {integration.status === "syncing" ? "Connecting..." : "Connect"}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Metrics */}
                {integration.metrics && integration.isConnected && (
                  <div className="grid grid-cols-2 gap-3">
                    {integration.metrics.map((metric, index) => (
                      <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className={`text-lg sm:text-xl font-bold ${metric.color}`}>{metric.value}</div>
                        <div className="text-xs text-gray-600">{metric.label}</div>
                        {metric.change && <div className="text-xs text-green-600 font-medium">{metric.change}</div>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Features */}
                <div>
                  <h4 className="text-sm font-medium text-black mb-2">Features</h4>
                  <div className="flex flex-wrap gap-1">
                    {integration.features.slice(0, 4).map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-white border-gray-300">
                        {feature}
                      </Badge>
                    ))}
                    {integration.features.length > 4 && (
                      <Badge variant="outline" className="text-xs bg-white border-gray-300">
                        +{integration.features.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Last Sync */}
                {integration.isConnected && (
                  <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t border-gray-200">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Last sync: {integration.lastSync}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BarChart3 className="w-3 h-3" />
                      <span>{integration.dataPoints.toLocaleString()} data points</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  {integration.isConnected && (
                    <>
                      <Button variant="outline" size="sm" className="flex-1 bg-white border-gray-300 text-xs">
                        <Settings className="w-3 h-3 mr-1" />
                        Settings
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-white border-gray-300 text-xs">
                        <Eye className="w-3 h-3 mr-1" />
                        View Data
                      </Button>
                    </>
                  )}
                  {!integration.isConnected && (
                    <Button variant="outline" size="sm" className="w-full bg-white border-gray-300 text-xs">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Learn More
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Help Section */}
        <Card className="border-gray-200 bg-gray-50 mt-8">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-black mb-2">Need Help with Integrations?</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Our support team can help you connect and configure your platforms for optimal performance.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" className="bg-white border-gray-300">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Live Chat
                </Button>
                <Button variant="outline" className="bg-white border-gray-300">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Support
                </Button>
                <Button variant="outline" className="bg-white border-gray-300">
                  <Phone className="w-4 h-4 mr-2" />
                  Schedule Call
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
