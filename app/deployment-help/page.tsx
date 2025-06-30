"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  Database,
  Key,
  Palette,
  Zap,
} from "lucide-react"

interface SystemStatus {
  name: string
  status: "success" | "error" | "warning" | "pending"
  message: string
  details?: string
}

export default function DeploymentHelpPage() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  useEffect(() => {
    checkSystemStatus()
  }, [])

  const checkSystemStatus = async () => {
    setLoading(true)
    const status: SystemStatus[] = []

    try {
      // Check if we're on the live site
      const isLiveSite = window.location.hostname === "tablesalt.fyi"

      status.push({
        name: "Website Deployment",
        status: isLiveSite ? "success" : "warning",
        message: isLiveSite ? "Live site is accessible" : "Testing on development environment",
        details: isLiveSite ? "Your website is live at tablesalt.fyi" : "Deploy to see live version",
      })

      // Check API endpoints
      try {
        const response = await fetch("/api/test-openai")
        const data = await response.json()
        status.push({
          name: "OpenAI Integration",
          status: data.success ? "success" : "warning",
          message: data.success ? "AI features ready" : "API key needed for full functionality",
          details: data.message || "Configure OPENAI_API_KEY in environment variables",
        })
      } catch (error) {
        status.push({
          name: "OpenAI Integration",
          status: "error",
          message: "API endpoint not responding",
          details: "Check server configuration",
        })
      }

      // Check Supabase
      try {
        const response = await fetch("/api/debug-supabase")
        const data = await response.json()
        status.push({
          name: "Database Connection",
          status: data.success ? "success" : "warning",
          message: data.success ? "Database connected" : "Database configuration needed",
          details: data.message || "Configure Supabase environment variables",
        })
      } catch (error) {
        status.push({
          name: "Database Connection",
          status: "error",
          message: "Database endpoint not responding",
          details: "Check Supabase configuration",
        })
      }

      // Check payment configuration
      try {
        const response = await fetch("/api/payments/razorpay-config")
        const data = await response.json()
        status.push({
          name: "Payment System",
          status: data.success ? "success" : "warning",
          message: data.success ? "Payment system ready" : "Payment configuration needed",
          details: data.success ? "Razorpay integration active" : "Configure RAZORPAY_KEY_ID",
        })
      } catch (error) {
        status.push({
          name: "Payment System",
          status: "error",
          message: "Payment endpoint not responding",
          details: "Check Razorpay configuration",
        })
      }

      // Check image generation
      status.push({
        name: "Image Generation",
        status: "warning",
        message: "Fal AI integration pending",
        details: "Configure FAL_API_KEY for AI image generation",
      })
    } catch (error) {
      console.error("System check failed:", error)
    }

    setSystemStatus(status)
    setLastChecked(new Date())
    setLoading(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "pending":
        return <Clock className="h-5 w-5 text-blue-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Ready</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Setup Needed</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const successCount = systemStatus.filter((s) => s.status === "success").length
  const totalCount = systemStatus.length
  const progressPercentage = totalCount > 0 ? (successCount / totalCount) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Deployment Status</h1>
          <p className="text-xl text-gray-600 mb-6">Monitor your TableSalt AI platform setup and configuration</p>

          {/* Overall Progress */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Setup Progress
              </CardTitle>
              <CardDescription>
                {successCount} of {totalCount} components ready
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={progressPercentage} className="mb-4" />
              <div className="flex justify-between text-sm text-gray-600">
                <span>{Math.round(progressPercentage)}% Complete</span>
                <span>{totalCount - successCount} items need attention</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <ExternalLink className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <h3 className="font-semibold mb-2">Visit Live Site</h3>
              <Button variant="outline" size="sm" onClick={() => window.open("https://tablesalt.fyi", "_blank")}>
                Open tablesalt.fyi
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <RefreshCw className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <h3 className="font-semibold mb-2">Refresh Status</h3>
              <Button variant="outline" size="sm" onClick={checkSystemStatus} disabled={loading}>
                {loading ? "Checking..." : "Check Again"}
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Key className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <h3 className="font-semibold mb-2">Environment Setup</h3>
              <Button variant="outline" size="sm" onClick={() => window.open("https://vercel.com/dashboard", "_blank")}>
                Vercel Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">System Components</h2>

          {systemStatus.map((item, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getStatusIcon(item.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        {getStatusBadge(item.status)}
                      </div>
                      <p className="text-gray-600 mb-1">{item.message}</p>
                      {item.details && <p className="text-sm text-gray-500">{item.details}</p>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Setup Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Next Steps
            </CardTitle>
            <CardDescription>Complete these steps to unlock all features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                <Key className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Configure Environment Variables</h4>
                  <p className="text-blue-700 text-sm mb-2">
                    Add these keys in your Vercel dashboard under Settings → Environment Variables:
                  </p>
                  <ul className="text-sm text-blue-600 space-y-1">
                    <li>• OPENAI_API_KEY - For AI content generation</li>
                    <li>• FAL_API_KEY - For image generation</li>
                    <li>• SUPABASE_URL - For database connection</li>
                    <li>• SUPABASE_ANON_KEY - For database access</li>
                    <li>• RAZORPAY_KEY_ID - For payment processing</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                <Database className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900 mb-1">Set Up Database</h4>
                  <p className="text-green-700 text-sm">
                    Run the SQL scripts in the /scripts folder to create necessary database tables.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                <Palette className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-purple-900 mb-1">Test Features</h4>
                  <p className="text-purple-700 text-sm">
                    Once configured, test AI content generation, image creation, and payment flows.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p className="text-sm">Last checked: {lastChecked ? lastChecked.toLocaleTimeString() : "Never"}</p>
          <p className="text-xs mt-1">This page automatically monitors your TableSalt AI platform status</p>
        </div>
      </div>
    </div>
  )
}
