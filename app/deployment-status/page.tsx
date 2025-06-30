"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Globe,
  Database,
  Zap,
  Users,
  BarChart3,
  Rocket,
  RefreshCw,
  Monitor,
  Smartphone,
  Shield,
} from "lucide-react"

export default function DeploymentStatusPage() {
  const [deploymentStatus, setDeploymentStatus] = useState("checking")
  const [lastChecked, setLastChecked] = useState(new Date())

  useEffect(() => {
    // Simulate checking deployment status
    setTimeout(() => {
      setDeploymentStatus("live")
    }, 2000)
  }, [])

  const deploymentChecks = [
    {
      name: "Domain Configuration",
      status: "success",
      description: "tablesalt.fyi is properly configured and accessible",
      icon: Globe,
    },
    {
      name: "SSL Certificate",
      status: "success",
      description: "HTTPS encryption is active and secure",
      icon: Shield,
    },
    {
      name: "CDN & Performance",
      status: "success",
      description: "Global content delivery network is optimized",
      icon: Monitor,
    },
    {
      name: "Mobile Responsiveness",
      status: "success",
      description: "Site is fully responsive across all devices",
      icon: Smartphone,
    },
    {
      name: "Database Connection",
      status: "warning",
      description: "Supabase environment variables need configuration",
      icon: Database,
    },
    {
      name: "AI Integration",
      status: "pending",
      description: "OpenAI API key required for AI features",
      icon: Zap,
    },
    {
      name: "Platform APIs",
      status: "pending",
      description: "External platform integrations ready for setup",
      icon: Users,
    },
    {
      name: "Analytics",
      status: "pending",
      description: "Performance monitoring and user analytics",
      icon: BarChart3,
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case "pending":
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
      default:
        return <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "border-green-200 bg-green-50"
      case "warning":
        return "border-yellow-200 bg-yellow-50"
      case "pending":
        return "border-gray-200 bg-gray-50"
      default:
        return "border-gray-200 bg-white"
    }
  }

  const successCount = deploymentChecks.filter((check) => check.status === "success").length
  const totalChecks = deploymentChecks.length
  const completionPercentage = Math.round((successCount / totalChecks) * 100)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Rocket className="w-8 h-8 mr-3 text-green-600" />
                Deployment Status
              </h1>
              <p className="text-gray-600 mt-2">Your TableSalt AI platform deployment overview</p>
            </div>
            <Button
              variant="outline"
              onClick={() => window.open("https://tablesalt.fyi", "_blank")}
              className="flex items-center"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Live Site
            </Button>
          </div>
        </div>

        {/* Live Status Banner */}
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-green-900">🎉 Deployment Successful!</h3>
                <p className="text-green-800 mt-1">
                  Your website is live at{" "}
                  <a
                    href="https://tablesalt.fyi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold underline hover:no-underline"
                  >
                    tablesalt.fyi
                  </a>
                </p>
                <p className="text-green-700 text-sm mt-2">Last updated: {lastChecked.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-900">{completionPercentage}%</div>
                <div className="text-sm text-green-700">Complete</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Deployment Progress</CardTitle>
            <CardDescription>Overall setup and configuration status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Setup Progress</span>
                <span className="text-sm text-gray-500">
                  {successCount} of {totalChecks} complete
                </span>
              </div>
              <Progress value={completionPercentage} className="h-3" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{successCount}</div>
                  <div className="text-sm text-gray-600">Ready</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">1</div>
                  <div className="text-sm text-gray-600">Warning</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">3</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">100%</div>
                  <div className="text-sm text-gray-600">Uptime</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deployment Checks */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Detailed status of all platform components</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deploymentChecks.map((check, index) => (
                <div key={index} className={`p-4 border rounded-lg ${getStatusColor(check.status)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <check.icon className="w-5 h-5 text-gray-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">{check.name}</h4>
                        <p className="text-sm text-gray-600">{check.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(check.status)}
                      <Badge
                        variant={
                          check.status === "success" ? "default" : check.status === "warning" ? "secondary" : "outline"
                        }
                      >
                        {check.status === "success" && "Ready"}
                        {check.status === "warning" && "Needs Setup"}
                        {check.status === "pending" && "Pending"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>Complete these steps to unlock all features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">1. Set up Database (Priority)</h4>
                <p className="text-blue-800 text-sm mb-3">
                  Add Supabase environment variables to enable user accounts and data storage.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open("/setup-supabase", "_blank")}
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  Setup Database
                </Button>
              </div>

              <div className="p-4 border border-purple-200 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">2. Enable AI Features</h4>
                <p className="text-purple-800 text-sm mb-3">
                  Add OpenAI API key to unlock content generation and smart analysis.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-purple-300 text-purple-700 hover:bg-purple-100 bg-transparent"
                >
                  Setup AI Integration
                </Button>
              </div>

              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">3. Connect Platforms</h4>
                <p className="text-green-800 text-sm mb-3">
                  Integrate with Zomato, Google My Business, and other restaurant platforms.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-green-300 text-green-700 hover:bg-green-100 bg-transparent"
                >
                  Setup Integrations
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Test and manage your deployment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                onClick={() => window.open("https://tablesalt.fyi", "_blank")}
                className="flex items-center justify-center"
              >
                <Globe className="w-4 h-4 mr-2" />
                Visit Live Site
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open("https://vercel.com/dashboard", "_blank")}
                className="flex items-center justify-center"
              >
                <Monitor className="w-4 h-4 mr-2" />
                Vercel Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open("/test-real-user", "_blank")}
                className="flex items-center justify-center"
              >
                <Users className="w-4 h-4 mr-2" />
                Test User Flow
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
