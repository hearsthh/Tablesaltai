"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Copy, Eye, EyeOff, RefreshCw, Settings, CheckCircle, XCircle } from "lucide-react"

export default function DebugEnvironmentVarsPage() {
  const [envStatus, setEnvStatus] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showValues, setShowValues] = useState(false)

  const checkEnvironmentVars = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/debug-database-schema")
      const data = await response.json()
      setEnvStatus(data)

      if (data.success) {
        toast({
          title: "Environment Check Complete",
          description: "Successfully connected to Supabase",
        })
      } else {
        toast({
          title: "Environment Issues Found",
          description: data.error || "Check the details below",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Check Failed",
        description: "Failed to check environment variables",
        variant: "destructive",
      })
    }
    setIsLoading(false)
  }

  useEffect(() => {
    checkEnvironmentVars()
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "Environment variable name copied",
    })
  }

  const getStatusIcon = (status: string) => {
    return status.includes("✅") ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <XCircle className="w-4 h-4 text-red-600" />
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
                Environment Variables Debug
              </h1>
              <p className="text-gray-600 mt-2">Check and debug your Supabase environment variables</p>
            </div>
            <Button onClick={checkEnvironmentVars} disabled={isLoading} variant="outline">
              {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              Recheck
            </Button>
          </div>
        </div>

        {/* Environment Status */}
        {envStatus && (
          <div className="space-y-6">
            {/* Overall Status */}
            <Card>
              <CardHeader>
                <CardTitle>Connection Status</CardTitle>
                <CardDescription>
                  {envStatus.success ? "Successfully connected to Supabase" : "Connection failed"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  {envStatus.success ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                  <div>
                    <span className="font-medium">
                      {envStatus.success ? "Connection Working" : "Connection Failed"}
                    </span>
                    {envStatus.error && <p className="text-sm text-red-600 mt-1">{envStatus.error}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Environment Variables Check */}
            {envStatus.envCheck && (
              <Card>
                <CardHeader>
                  <CardTitle>Environment Variables Status</CardTitle>
                  <CardDescription>Status of required Supabase environment variables</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(envStatus.envCheck).map(([key, status]) => (
                      <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(status)}
                          <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{key}</code>
                          <Badge variant={status.includes("✅") ? "default" : "destructive"}>{status}</Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(key)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Environment Values (if available) */}
            {envStatus.envValues && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Environment Values (Partial)
                    <Button variant="ghost" size="sm" onClick={() => setShowValues(!showValues)}>
                      {showValues ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </CardTitle>
                  <CardDescription>Partial values of your environment variables for debugging</CardDescription>
                </CardHeader>
                <CardContent>
                  {showValues ? (
                    <div className="space-y-2">
                      {Object.entries(envStatus.envValues).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <code className="text-sm font-mono">{key}:</code>
                          <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{value}</code>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">Click the eye icon to show partial values</p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Available Supabase Variables */}
            {envStatus.availableVars && (
              <Card>
                <CardHeader>
                  <CardTitle>Available Supabase Variables</CardTitle>
                  <CardDescription>Environment variables containing 'supabase' found in your system</CardDescription>
                </CardHeader>
                <CardContent>
                  {envStatus.availableVars.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {envStatus.availableVars.map((varName) => (
                        <Badge key={varName} variant="outline">
                          {varName}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No Supabase-related environment variables found</p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Setup Instructions</CardTitle>
                <CardDescription>How to set up your Supabase environment variables</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Required Environment Variables:</h4>
                    <div className="space-y-2">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <code className="text-sm">NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co</code>
                        <p className="text-xs text-gray-600 mt-1">Your Supabase project URL</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <code className="text-sm">SUPABASE_SERVICE_ROLE_KEY=eyJ...</code>
                        <p className="text-xs text-gray-600 mt-1">Service role key (for admin operations)</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <code className="text-sm">NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...</code>
                        <p className="text-xs text-gray-600 mt-1">Anonymous key (for client operations)</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Where to find these values:</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                      <li>Go to your Supabase dashboard</li>
                      <li>Select your project</li>
                      <li>Go to Settings → API</li>
                      <li>Copy the URL and keys from the "Project API keys" section</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
