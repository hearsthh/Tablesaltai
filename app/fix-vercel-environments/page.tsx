"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { ExternalLink, Settings, CheckCircle, AlertTriangle, Copy, RefreshCw } from "lucide-react"

export default function FixVercelEnvironmentsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState(null)

  const testConnection = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/debug-database-schema")
      const data = await response.json()
      setTestResult(data)

      if (data.success) {
        toast({
          title: "🎉 Fixed! Connection Working",
          description: "Your environment variables are now accessible",
        })
      } else {
        toast({
          title: "Still Not Working",
          description: "Check if you saved the changes in Vercel",
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
      description: "Variable name copied to clipboard",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Settings className="w-8 h-8 mr-3 text-green-600" />
            Fix Vercel Environment Scopes
          </h1>
          <p className="text-gray-600 mt-2">Enable your Supabase variables for Preview and Development environments</p>
        </div>

        {/* Problem Identified */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-green-600">✅ Problem Identified!</CardTitle>
            <CardDescription>Your Supabase variables exist but are only enabled for Production</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">What's Happening:</h4>
                  <ul className="text-green-700 text-sm mt-1 space-y-1">
                    <li>• Your Supabase environment variables exist in Vercel</li>
                    <li>
                      • They're configured for <strong>Production</strong> environment only
                    </li>
                    <li>
                      • v0 runs in <strong>Preview</strong> environment
                    </li>
                    <li>• Preview environment can't access Production-only variables</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step-by-Step Fix */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>🔧 Quick Fix Steps</CardTitle>
            <CardDescription>Enable your existing variables for all environments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm mr-3">
                    1
                  </span>
                  <h3 className="font-medium">Open Vercel Environment Variables</h3>
                </div>
                <div className="ml-9 space-y-3">
                  <p className="text-sm text-gray-600">
                    Go to your Vercel project settings and find the environment variables section.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => window.open("https://vercel.com/dashboard", "_blank")}
                    className="flex items-center"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Vercel Dashboard
                  </Button>
                </div>
              </div>

              {/* Step 2 */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm mr-3">
                    2
                  </span>
                  <h3 className="font-medium">Edit Each Supabase Variable</h3>
                </div>
                <div className="ml-9 space-y-3">
                  <p className="text-sm text-gray-600">
                    For each of these variables, click the "Edit" button and enable all environments:
                  </p>
                  <div className="space-y-2">
                    {[
                      "NEXT_PUBLIC_SUPABASE_URL",
                      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
                      "SUPABASE_SERVICE_ROLE_KEY",
                      "SUPABASE_JWT_SECRET",
                    ].map((varName) => (
                      <div key={varName} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <code className="text-sm font-mono">{varName}</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(varName)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm mr-3">
                    3
                  </span>
                  <h3 className="font-medium">Enable All Environments</h3>
                </div>
                <div className="ml-9 space-y-3">
                  <p className="text-sm text-gray-600">
                    In the edit dialog, make sure all three checkboxes are checked:
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        <span className="text-sm">✅ Production</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-sm">✅ Preview (This is what v0 needs!)</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-purple-600 mr-2" />
                        <span className="text-sm">✅ Development</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm mr-3">
                    4
                  </span>
                  <h3 className="font-medium">Save & Test</h3>
                </div>
                <div className="ml-9 space-y-3">
                  <p className="text-sm text-gray-600">After saving all variables, test the connection here:</p>
                  <Button onClick={testConnection} disabled={isLoading} className="flex items-center">
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    Test Connection Now
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        {testResult && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>Connection test after environment variable changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`p-4 rounded-lg ${
                  testResult.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                }`}
              >
                <div className="flex items-center mb-2">
                  {testResult.success ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                  )}
                  <span className={`font-medium ${testResult.success ? "text-green-800" : "text-red-800"}`}>
                    {testResult.success ? "🎉 Success! Connection Working" : "❌ Still Not Working"}
                  </span>
                </div>

                {testResult.success ? (
                  <div className="text-green-700 text-sm">
                    <p>Your Supabase connection is now working! You can proceed with your application.</p>
                    {testResult.diagnosis && (
                      <p className="mt-1">
                        Found {testResult.diagnosis.totalTables} tables, {testResult.diagnosis.presentTables} expected
                        tables present.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-red-700 text-sm">
                    <p>{testResult.error}</p>
                    <p className="mt-1">Make sure you saved the changes in Vercel and try again in a minute.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Visual Guide */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>📸 Visual Guide</CardTitle>
            <CardDescription>What to look for in Vercel dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">🔍 In Vercel Dashboard:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-700">
                  <li>Go to your project → Settings → Environment Variables</li>
                  <li>Find your Supabase variables (they should exist)</li>
                  <li>Click the "..." menu → Edit for each variable</li>
                  <li>Check all three environment boxes: Production, Preview, Development</li>
                  <li>Click Save for each variable</li>
                </ol>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">✅ After the fix:</h4>
                <p className="text-green-700 text-sm">
                  Your variables will be available in all environments, and v0 will be able to access your Supabase
                  database immediately!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
