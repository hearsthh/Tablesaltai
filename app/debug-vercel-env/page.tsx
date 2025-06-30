"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Copy, ExternalLink, RefreshCw, AlertTriangle, CheckCircle } from "lucide-react"

export default function DebugVercelEnvPage() {
  const [envStatus, setEnvStatus] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const checkEnvironment = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/debug-vercel-environment")
      const data = await response.json()
      setEnvStatus(data)

      toast({
        title: "Environment Check Complete",
        description: `Found ${data.totalEnvVars} environment variables`,
      })
    } catch (error) {
      toast({
        title: "Check Failed",
        description: "Failed to check environment variables",
        variant: "destructive",
      })
    }
    setIsLoading(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <AlertTriangle className="w-8 h-8 mr-3 text-yellow-600" />
                Vercel Environment Debug
              </h1>
              <p className="text-gray-600 mt-2">Debug Vercel deployment environment variables</p>
            </div>
            <Button onClick={checkEnvironment} disabled={isLoading} variant="outline">
              {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              Check Environment
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-yellow-600">Environment Variables Missing</CardTitle>
            <CardDescription>Your Supabase integration sync didn't work. Here's how to fix it:</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">🔧 Quick Fix Options:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-700">
                  <li>
                    <strong>Manual Setup:</strong> Add environment variables directly in Vercel dashboard
                  </li>
                  <li>
                    <strong>Re-sync Integration:</strong> Delete and recreate the Supabase integration
                  </li>
                  <li>
                    <strong>Local Development:</strong> Create a .env.local file for testing
                  </li>
                </ol>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  onClick={() => window.open("https://vercel.com/dashboard", "_blank")}
                  className="flex items-center justify-center"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Vercel Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open("https://supabase.com/dashboard", "_blank")}
                  className="flex items-center justify-center"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Supabase Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open("https://vercel.com/docs/projects/environment-variables", "_blank")}
                  className="flex items-center justify-center"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Vercel Docs
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Environment Status */}
        {envStatus && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Environment Analysis</CardTitle>
                <CardDescription>Current state of your deployment environment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{envStatus.totalEnvVars}</div>
                    <div className="text-sm text-gray-600">Total Env Vars</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{envStatus.supabaseVars}</div>
                    <div className="text-sm text-gray-600">Supabase Vars</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{envStatus.vercelVars}</div>
                    <div className="text-sm text-gray-600">Vercel Vars</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{envStatus.nextVars}</div>
                    <div className="text-sm text-gray-600">Next.js Vars</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">Environment Type:</h4>
                    <Badge variant={envStatus.isProduction ? "default" : "secondary"}>
                      {envStatus.isProduction ? "Production" : "Development"}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Deployment Info:</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Node Version: {envStatus.nodeVersion}</p>
                      <p>Platform: {envStatus.platform}</p>
                      <p>Vercel Region: {envStatus.vercelRegion || "Not detected"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Available Environment Variables */}
            <Card>
              <CardHeader>
                <CardTitle>Available Environment Variables</CardTitle>
                <CardDescription>All environment variables currently available in your deployment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {envStatus.categorizedVars.supabase.length > 0 && (
                    <div>
                      <h4 className="font-medium text-green-600 mb-2">Supabase Variables:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {envStatus.categorizedVars.supabase.map((varName) => (
                          <div key={varName} className="flex items-center justify-between p-2 bg-green-50 rounded">
                            <code className="text-sm">{varName}</code>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {envStatus.categorizedVars.vercel.length > 0 && (
                    <div>
                      <h4 className="font-medium text-blue-600 mb-2">Vercel Variables:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {envStatus.categorizedVars.vercel.map((varName) => (
                          <div key={varName} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                            <code className="text-sm">{varName}</code>
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {envStatus.categorizedVars.next.length > 0 && (
                    <div>
                      <h4 className="font-medium text-purple-600 mb-2">Next.js Variables:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {envStatus.categorizedVars.next.map((varName) => (
                          <div key={varName} className="flex items-center justify-between p-2 bg-purple-50 rounded">
                            <code className="text-sm">{varName}</code>
                            <CheckCircle className="w-4 h-4 text-purple-600" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {envStatus.categorizedVars.other.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-600 mb-2">Other Variables:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {envStatus.categorizedVars.other.slice(0, 12).map((varName) => (
                          <div key={varName} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <code className="text-sm text-xs">{varName}</code>
                          </div>
                        ))}
                        {envStatus.categorizedVars.other.length > 12 && (
                          <div className="p-2 bg-gray-50 rounded text-center text-sm text-gray-500">
                            +{envStatus.categorizedVars.other.length - 12} more...
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Manual Setup Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Manual Environment Variable Setup</CardTitle>
            <CardDescription>Copy these values from your Supabase dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-3">Required Supabase Environment Variables:</h4>
                <div className="space-y-3">
                  {[
                    {
                      name: "NEXT_PUBLIC_SUPABASE_URL",
                      description: "Your Supabase project URL",
                      example: "https://your-project.supabase.co",
                    },
                    {
                      name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
                      description: "Anonymous/public key for client-side operations",
                      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                    },
                    {
                      name: "SUPABASE_SERVICE_ROLE_KEY",
                      description: "Service role key for server-side admin operations",
                      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                    },
                  ].map((envVar) => (
                    <div key={envVar.name} className="p-3 bg-white border rounded">
                      <div className="flex items-center justify-between mb-1">
                        <code className="font-mono text-sm font-medium">{envVar.name}</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(envVar.name)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{envVar.description}</p>
                      <code className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{envVar.example}</code>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">📍 Where to find these values:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-700">
                  <li>Go to your Supabase dashboard</li>
                  <li>Select your project</li>
                  <li>Navigate to Settings → API</li>
                  <li>Copy the values from the "Project API keys" section</li>
                  <li>Add them to your Vercel project environment variables</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
