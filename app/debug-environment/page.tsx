"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Database,
  Key,
  Globe,
  Shield,
  Settings,
  Info,
  Zap,
} from "lucide-react"

interface DebugResult {
  success: boolean
  environment: string
  hasRequiredVars: boolean
  envStatus: Array<{
    name: string
    exists: boolean
    length: number
    preview: string
  }>
  connectionTest: {
    status: string
    message: string
    error: string | null
  }
  recommendations: Array<{
    type: string
    message: string
    action: string
  }>
}

export default function DebugEnvironmentPage() {
  const [debugResult, setDebugResult] = useState<DebugResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkEnvironment()
  }, [])

  const checkEnvironment = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/debug-supabase")
      const data = await response.json()
      setDebugResult(data)
    } catch (error) {
      console.error("Debug check failed:", error)
      toast({
        title: "Debug check failed",
        description: "Could not check environment configuration",
        variant: "destructive",
      })
    }
    setIsLoading(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "failed":
        return <XCircle className="w-5 h-5 text-red-600" />
      case "skipped":
        return <Info className="w-5 h-5 text-blue-600" />
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "border-green-200 bg-green-50"
      case "failed":
        return "border-red-200 bg-red-50"
      case "skipped":
        return "border-blue-200 bg-blue-50"
      default:
        return "border-yellow-200 bg-yellow-50"
    }
  }

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "error":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
      case "info":
        return <Info className="w-4 h-4 text-blue-600" />
      default:
        return <Info className="w-4 h-4 text-gray-600" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Checking environment configuration...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Settings className="w-8 h-8 mr-3 text-blue-600" />
                Environment Debug Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Check your environment configuration and database connectivity</p>
            </div>
            <Button onClick={checkEnvironment} disabled={isLoading} variant="outline">
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {debugResult && (
          <div className="space-y-6">
            {/* Environment Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Environment Status
                </CardTitle>
                <CardDescription>Current environment configuration and readiness</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                  <div>
                    <h3 className="font-medium text-gray-900">Environment Type</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {debugResult.environment === "production-ready"
                        ? "Production-ready with real database"
                        : "Development environment with mock data"}
                    </p>
                  </div>
                  <Badge
                    variant={debugResult.environment === "production-ready" ? "default" : "secondary"}
                    className="ml-4"
                  >
                    {debugResult.environment === "production-ready" ? "Production Ready" : "Development Mode"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Connection Test */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  Database Connection Test
                </CardTitle>
                <CardDescription>Test database connectivity and configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`p-4 border rounded-lg ${getStatusColor(debugResult.connectionTest.status)}`}>
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(debugResult.connectionTest.status)}
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {debugResult.connectionTest.status === "success" && "Connection Successful"}
                        {debugResult.connectionTest.status === "failed" && "Connection Failed"}
                        {debugResult.connectionTest.status === "skipped" && "Development Mode"}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">{debugResult.connectionTest.message}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Environment Variables */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="w-5 h-5 mr-2" />
                  Environment Variables
                </CardTitle>
                <CardDescription>Status of required environment variables</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {debugResult.envStatus.map((env) => (
                    <div
                      key={env.name}
                      className={`p-3 border rounded-lg ${env.exists ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {env.exists ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-gray-400" />
                          )}
                          <div>
                            <h4 className="font-medium text-gray-900">{env.name}</h4>
                            {env.exists && (
                              <p className="text-xs text-gray-500 mt-1">
                                Length: {env.length} characters - {env.preview}
                              </p>
                            )}
                          </div>
                        </div>
                        <Badge variant={env.exists ? "default" : "secondary"}>{env.exists ? "Set" : "Not Set"}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
                <CardDescription>Actions to optimize your setup</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {debugResult.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg bg-gray-50">
                      {getRecommendationIcon(rec.type)}
                      <div>
                        <h4 className="font-medium text-gray-900">{rec.message}</h4>
                        <p className="text-sm text-gray-600 mt-1">{rec.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Test your restaurant management platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => (window.location.href = "/test-real-user")} className="flex items-center">
                    <Database className="w-4 h-4 mr-2" />
                    Test User Creation
                  </Button>
                  <Button
                    onClick={() => (window.location.href = "/profile/smart-profile")}
                    variant="outline"
                    className="flex items-center"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Smart Profile
                  </Button>
                  <Button
                    onClick={() => (window.location.href = "/marketing")}
                    variant="outline"
                    className="flex items-center"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Marketing Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
