"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  TrendingUp,
  Globe,
  Menu,
  ArrowLeft,
  Plus,
  Settings,
  CheckCircle,
  AlertCircle,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  Linkedin,
  Mail,
  Search,
  BarChart3,
  Zap,
  ExternalLink,
} from "lucide-react"

export default function MarketingIntegrationsPage() {
  const router = useRouter()

  const socialMediaIntegrations = [
    {
      id: "instagram",
      name: "Instagram",
      icon: Instagram,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      connected: true,
      status: "active",
      followers: "2.4K",
      engagement: "4.2%",
      lastSync: "2 hours ago",
      features: ["Posts", "Stories", "Reels", "Auto-publish", "Analytics"],
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: Facebook,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      connected: true,
      status: "active",
      followers: "1.8K",
      engagement: "3.1%",
      lastSync: "1 hour ago",
      features: ["Posts", "Events", "Ads", "Auto-publish", "Analytics"],
    },
    {
      id: "youtube",
      name: "YouTube",
      icon: Youtube,
      color: "text-red-600",
      bgColor: "bg-red-50",
      connected: false,
      status: "disconnected",
      followers: "0",
      engagement: "0%",
      lastSync: "Never",
      features: ["Videos", "Shorts", "Analytics", "Auto-upload"],
    },
    {
      id: "twitter",
      name: "Twitter/X",
      icon: Twitter,
      color: "text-sky-600",
      bgColor: "bg-sky-50",
      connected: true,
      status: "warning",
      followers: "892",
      engagement: "2.8%",
      lastSync: "6 hours ago",
      features: ["Tweets", "Threads", "Auto-publish", "Analytics"],
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: Linkedin,
      color: "text-blue-700",
      bgColor: "bg-blue-50",
      connected: false,
      status: "disconnected",
      followers: "0",
      engagement: "0%",
      lastSync: "Never",
      features: ["Posts", "Articles", "Company Page", "Analytics"],
    },
  ]

  const adPlatforms = [
    {
      id: "google-ads",
      name: "Google Ads",
      icon: Search,
      color: "text-green-600",
      bgColor: "bg-green-50",
      connected: true,
      status: "active",
      spend: "₹12.5K",
      conversions: "156",
      lastSync: "30 minutes ago",
      features: ["Search Ads", "Display Ads", "YouTube Ads", "Analytics"],
    },
    {
      id: "facebook-ads",
      name: "Facebook Ads",
      icon: Facebook,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      connected: true,
      status: "active",
      spend: "₹8.2K",
      conversions: "89",
      lastSync: "1 hour ago",
      features: ["Facebook Ads", "Instagram Ads", "Audience Network", "Analytics"],
    },
    {
      id: "instagram-ads",
      name: "Instagram Ads",
      icon: Instagram,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      connected: true,
      status: "active",
      spend: "₹6.1K",
      conversions: "67",
      lastSync: "1 hour ago",
      features: ["Feed Ads", "Stories Ads", "Reels Ads", "Analytics"],
    },
  ]

  const emailMarketingTools = [
    {
      id: "mailchimp",
      name: "Mailchimp",
      icon: Mail,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      connected: false,
      status: "disconnected",
      subscribers: "0",
      openRate: "0%",
      lastSync: "Never",
      features: ["Email Campaigns", "Automation", "Templates", "Analytics"],
    },
    {
      id: "sendgrid",
      name: "SendGrid",
      icon: Mail,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      connected: false,
      status: "disconnected",
      subscribers: "0",
      openRate: "0%",
      lastSync: "Never",
      features: ["Transactional Email", "Marketing Campaigns", "Analytics"],
    },
  ]

  const analyticsTools = [
    {
      id: "google-analytics",
      name: "Google Analytics",
      icon: BarChart3,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      connected: true,
      status: "active",
      sessions: "3.2K",
      bounceRate: "45%",
      lastSync: "15 minutes ago",
      features: ["Website Analytics", "E-commerce", "Goals", "Reports"],
    },
    {
      id: "facebook-pixel",
      name: "Facebook Pixel",
      icon: Facebook,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      connected: true,
      status: "active",
      events: "1.8K",
      conversions: "89",
      lastSync: "30 minutes ago",
      features: ["Event Tracking", "Conversion Tracking", "Audience Building"],
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
      case "disconnected":
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700"
      case "warning":
        return "bg-yellow-100 text-yellow-700"
      case "disconnected":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const IntegrationCard = ({ integration, type }: { integration: any; type: string }) => (
    <Card className="border-slate-200 hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 ${integration.bgColor} rounded-lg flex items-center justify-center`}>
              <integration.icon className={`w-6 h-6 ${integration.color}`} />
            </div>
            <div>
              <CardTitle className="text-lg">{integration.name}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                {getStatusIcon(integration.status)}
                <Badge className={getStatusColor(integration.status)} variant="secondary">
                  {integration.status}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch checked={integration.connected} />
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Integration Stats */}
        <div className="grid grid-cols-2 gap-4">
          {type === "social" && (
            <>
              <div>
                <span className="text-xs text-slate-500">Followers</span>
                <p className="font-medium">{integration.followers}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500">Engagement</span>
                <p className="font-medium">{integration.engagement}</p>
              </div>
            </>
          )}
          {type === "ads" && (
            <>
              <div>
                <span className="text-xs text-slate-500">Spend</span>
                <p className="font-medium">{integration.spend}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500">Conversions</span>
                <p className="font-medium">{integration.conversions}</p>
              </div>
            </>
          )}
          {type === "email" && (
            <>
              <div>
                <span className="text-xs text-slate-500">Subscribers</span>
                <p className="font-medium">{integration.subscribers}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500">Open Rate</span>
                <p className="font-medium">{integration.openRate}</p>
              </div>
            </>
          )}
          {type === "analytics" && (
            <>
              <div>
                <span className="text-xs text-slate-500">Sessions</span>
                <p className="font-medium">{integration.sessions}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500">Bounce Rate</span>
                <p className="font-medium">{integration.bounceRate}</p>
              </div>
            </>
          )}
        </div>

        {/* Features */}
        <div>
          <span className="text-sm font-medium text-slate-700">Features</span>
          <div className="flex flex-wrap gap-1 mt-2">
            {integration.features.map((feature: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs border-slate-200">
                {feature}
              </Badge>
            ))}
          </div>
        </div>

        {/* Last Sync */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-500">Last sync: {integration.lastSync}</span>
          <div className="flex items-center space-x-2">
            {integration.connected ? (
              <Button size="sm" variant="outline" className="rounded-md border-slate-200">
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </Button>
            ) : (
              <Button size="sm" className="bg-slate-900 hover:bg-slate-800 rounded-md">
                <Plus className="w-4 h-4 mr-2" />
                Connect
              </Button>
            )}
            <Button size="sm" variant="ghost" className="rounded-md">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-slate-900 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-semibold text-slate-900">TableSalt</span>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex space-x-8">
                <Button variant="ghost" className="text-slate-500 rounded-md" onClick={() => router.push("/profile")}>
                  <Users className="w-4 h-4 mr-2" />
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  className="text-slate-900 font-medium rounded-md"
                  onClick={() => router.push("/marketing")}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Marketing
                </Button>
                <Button variant="ghost" className="text-slate-500 rounded-md">
                  <Users className="w-4 h-4 mr-2" />
                  Customers
                </Button>
                <Button variant="ghost" className="text-slate-500 rounded-md">
                  <Globe className="w-4 h-4 mr-2" />
                  Integrations
                </Button>
              </nav>
              <Button variant="ghost" size="icon" className="md:hidden rounded-md">
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/marketing")} className="rounded-md">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketing Hub
            </Button>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold text-slate-900">Marketing Integrations</h1>
              <p className="text-slate-600 mt-2">Connect and manage all your marketing channels and platforms</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="flex items-center rounded-md border-slate-200">
                <Zap className="w-4 h-4 mr-2" />
                Auto-Setup
              </Button>
              <Button className="flex items-center bg-slate-900 hover:bg-slate-800 rounded-md">
                <Plus className="w-4 h-4 mr-2" />
                Add Integration
              </Button>
            </div>
          </div>
        </div>

        {/* Integration Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-slate-700">Connected</span>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold text-slate-900">8</div>
                <div className="text-sm text-slate-600">of 12 platforms</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-slate-700">Total Reach</span>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold text-slate-900">5.1K</div>
                <div className="text-sm text-green-600">+12% this month</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-slate-700">Avg Engagement</span>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold text-slate-900">3.4%</div>
                <div className="text-sm text-green-600">+0.8% improvement</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium text-slate-700">Issues</span>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold text-slate-900">1</div>
                <div className="text-sm text-yellow-600">Needs attention</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="social" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="ads">Ad Platforms</TabsTrigger>
            <TabsTrigger value="email">Email Marketing</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="social" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {socialMediaIntegrations.map((integration) => (
                <IntegrationCard key={integration.id} integration={integration} type="social" />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ads" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adPlatforms.map((integration) => (
                <IntegrationCard key={integration.id} integration={integration} type="ads" />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="email" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {emailMarketingTools.map((integration) => (
                <IntegrationCard key={integration.id} integration={integration} type="email" />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analyticsTools.map((integration) => (
                <IntegrationCard key={integration.id} integration={integration} type="analytics" />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
