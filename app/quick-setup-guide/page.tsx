"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Database, ExternalLink, Copy, CheckCircle, AlertTriangle, Plus, RefreshCw } from "lucide-react"

export default function QuickSetupGuidePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [testResult, setTestResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const testConnection = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/debug-database-schema")
      const data = await response.json()
      setTestResult(data)

      if (data.success) {
        toast({
          title: "Connection Successful! 🎉",
          description: "Your Supabase setup is working",
        })
        setCurrentStep(5) // Jump to success step
      } else {
        toast({
          title: "Still Not Working",
          description: "Environment variables still missing",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Could not test connection",
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
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Database className="w-8 h-8 mr-3 text-blue-600" />
            Supabase Setup Decision Guide
          </h1>
          <p className="text-gray-600 mt-2">Choose the best approach to fix your Supabase integration</p>
        </div>

        <Tabs defaultValue="fix-current" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="fix-current">Fix Current Project</TabsTrigger>
            <TabsTrigger value="create-fresh">Create Fresh Project</TabsTrigger>
          </TabsList>

          {/* Fix Current Project */}
          <TabsContent value="fix-current">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">🔧 Fix Current Project (Recommended)</CardTitle>
                  <CardDescription>
                    Try these steps first - usually faster and preserves any existing data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Step 1: Manual Environment Variables */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium flex items-center">
                          <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm mr-2">
                            1
                          </span>
                          Add Environment Variables Manually
                        </h3>
                        <Badge variant={currentStep >= 1 ? "default" : "secondary"}>
                          {currentStep > 1 ? "✓" : "Current"}
                        </Badge>
                      </div>

                      <div className="space-y-3 ml-8">
                        <p className="text-sm text-gray-600">
                          Go to your Supabase dashboard and copy these values to Vercel:
                        </p>

                        <div className="grid grid-cols-1 gap-3">
                          {[
                            {
                              name: "NEXT_PUBLIC_SUPABASE_URL",
                              location: "Settings → API → Project URL",
                            },
                            {
                              name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
                              location: "Settings → API → Project API keys → anon public",
                            },
                            {
                              name: "SUPABASE_SERVICE_ROLE_KEY",
                              location: "Settings → API → Project API keys → service_role",
                            },
                          ].map((env) => (
                            <div key={env.name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div>
                                <code className="text-sm font-mono">{env.name}</code>
                                <p className="text-xs text-gray-500">{env.location}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(env.name)}
                                className="h-6 w-6 p-0"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open("https://supabase.com/dashboard", "_blank")}
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Supabase Dashboard
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open("https://vercel.com/dashboard", "_blank")}
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Vercel Dashboard
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Step 2: Test Connection */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium flex items-center">
                          <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm mr-2">
                            2
                          </span>
                          Test Connection
                        </h3>
                        <Button onClick={testConnection} disabled={isLoading} size="sm">
                          {isLoading ? (
                            <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4 mr-1" />
                          )}
                          Test Now
                        </Button>
                      </div>

                      <div className="ml-8">
                        <p className="text-sm text-gray-600 mb-3">
                          After adding the environment variables, test if the connection works.
                        </p>

                        {testResult && (
                          <div
                            className={`p-3 rounded-lg ${
                              testResult.success
                                ? "bg-green-50 border border-green-200"
                                : "bg-red-50 border border-red-200"
                            }`}
                          >
                            <div className="flex items-center">
                              {testResult.success ? (
                                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                              ) : (
                                <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                              )}
                              <span className={`font-medium ${testResult.success ? "text-green-800" : "text-red-800"}`}>
                                {testResult.success ? "Connection Successful!" : "Connection Failed"}
                              </span>
                            </div>
                            {testResult.error && <p className="text-red-700 text-sm mt-1">{testResult.error}</p>}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Step 3: Success */}
                    {testResult?.success && (
                      <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                          <h3 className="font-medium text-green-800">Setup Complete! 🎉</h3>
                        </div>
                        <p className="text-green-700 text-sm">
                          Your Supabase connection is working. You can now proceed with your application development.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Create Fresh Project */}
          <TabsContent value="create-fresh">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-orange-600">🆕 Create Fresh Project</CardTitle>
                  <CardDescription>Start completely fresh - choose this if manual setup doesn't work</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-800">⚠️ Before You Delete</h4>
                          <p className="text-yellow-700 text-sm mt-1">
                            This will permanently delete all data, tables, and configurations in your current Supabase
                            project.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Fresh Setup Steps:</h4>
                      <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                        <li>Delete your current Supabase project</li>
                        <li>Create a new Supabase project</li>
                        <li>Set up the Vercel integration from scratch</li>
                        <li>Test the connection</li>
                        <li>Create your database schema</li>
                      </ol>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-green-800">✅ Benefits of Fresh Start</h4>
                          <ul className="text-green-700 text-sm mt-1 space-y-1">
                            <li>• Clean integration setup</li>
                            <li>• No configuration conflicts</li>
                            <li>• Latest Supabase features</li>
                            <li>• Guaranteed working environment variables</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button variant="outline" onClick={() => window.open("https://supabase.com/dashboard", "_blank")}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Supabase Dashboard
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => window.open("https://vercel.com/integrations/supabase", "_blank")}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Vercel Integration
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Decision Helper */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>🤔 Not Sure Which Option?</CardTitle>
            <CardDescription>Here's my recommendation based on your situation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">💡 My Recommendation:</h4>
              <p className="text-blue-700 text-sm mb-3">
                <strong>Try "Fix Current Project" first.</strong> It's usually faster and the environment variable issue
                is typically just a Vercel integration sync problem, not a Supabase project problem.
              </p>
              <p className="text-blue-700 text-sm">
                If manual setup doesn't work after 10 minutes, then go with "Create Fresh Project" for a guaranteed
                clean start.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
