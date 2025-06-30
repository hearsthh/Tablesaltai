"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { AlertTriangle, CheckCircle, XCircle, RefreshCw, Info, Lock } from "lucide-react"

export default function VercelEnvTroubleshootPage() {
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
          title: "🎉 Success! Connection Working",
          description: "Your environment variables are now working",
        })
      } else {
        toast({
          title: "Still Issues",
          description: "Check the troubleshooting steps below",
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <AlertTriangle className="w-8 h-8 mr-3 text-yellow-600" />
            Vercel Environment Issues
          </h1>
          <p className="text-gray-600 mt-2">Troubleshooting your Supabase environment variable setup</p>
        </div>

        {/* Issues Identified */}
        <div className="space-y-6">
          {/* Issue 1: Development Environment Restriction */}
          <Card>
            <CardHeader>
              <CardTitle className="text-yellow-600 flex items-center">
                <Lock className="w-5 h-5 mr-2" />
                Issue #1: Development Environment Restriction
              </CardTitle>
              <CardDescription>Sensitive variables can't be added to Development environment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Info className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">What's Happening:</h4>
                      <p className="text-yellow-700 text-sm mt-1">
                        Vercel restricts sensitive environment variables (like service role keys) from the Development
                        environment for security reasons.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-800">✅ Solution:</h4>
                      <p className="text-green-700 text-sm mt-1">
                        <strong>This is actually fine!</strong> Just enable <strong>Production and Preview</strong> for
                        sensitive variables. v0 runs in Preview environment, so you don't need Development.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">For Sensitive Variables (Service Role Key):</h4>
                  <div className="space-y-1 text-sm text-blue-700">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      <span>✅ Production</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      <span>✅ Preview (This is what v0 needs!)</span>
                    </div>
                    <div className="flex items-center">
                      <Lock className="w-4 h-4 text-gray-400 mr-2" />
                      <span>🔒 Development (Locked by Vercel - that's OK!)</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Issue 2: Duplicate Variable Error */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center">
                <XCircle className="w-5 h-5 mr-2" />
                Issue #2: Duplicate Variable Error
              </CardTitle>
              <CardDescription>Variable already exists with different environment settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <XCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-800">Error Message:</h4>
                      <p className="text-red-700 text-sm mt-1">
                        "An Environment Variable with the name 'SUPABASE_JWT_SECRET' and target
                        'production,preview,development' already exists."
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Info className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800">✅ Solution:</h4>
                      <ol className="text-blue-700 text-sm mt-1 space-y-1 list-decimal list-inside">
                        <li>Cancel this dialog</li>
                        <li>Find the existing SUPABASE_JWT_SECRET variable in your list</li>
                        <li>Edit that existing variable instead</li>
                        <li>Update its environment settings to include Preview</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Correct Setup Guide */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">✅ Correct Environment Variable Setup</CardTitle>
              <CardDescription>How each Supabase variable should be configured</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Public Variables */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-green-800 mb-3">🌐 Public Variables (Safe for all environments)</h4>
                    <div className="space-y-3">
                      {["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"].map((varName) => (
                        <div key={varName} className="bg-green-50 p-3 rounded">
                          <code className="text-sm font-mono">{varName}</code>
                          <div className="mt-2 space-y-1 text-xs">
                            <div className="flex items-center">
                              <CheckCircle className="w-3 h-3 text-green-600 mr-1" />
                              <span>Production</span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle className="w-3 h-3 text-green-600 mr-1" />
                              <span>Preview</span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle className="w-3 h-3 text-green-600 mr-1" />
                              <span>Development</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sensitive Variables */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-orange-800 mb-3">🔒 Sensitive Variables (Restricted)</h4>
                    <div className="space-y-3">
                      {["SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_JWT_SECRET"].map((varName) => (
                        <div key={varName} className="bg-orange-50 p-3 rounded">
                          <code className="text-sm font-mono">{varName}</code>
                          <div className="mt-2 space-y-1 text-xs">
                            <div className="flex items-center">
                              <CheckCircle className="w-3 h-3 text-green-600 mr-1" />
                              <span>Production</span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle className="w-3 h-3 text-green-600 mr-1" />
                              <span>Preview</span>
                            </div>
                            <div className="flex items-center">
                              <Lock className="w-3 h-3 text-gray-400 mr-1" />
                              <span>Development (Locked)</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step-by-Step Fix */}
          <Card>
            <CardHeader>
              <CardTitle>🔧 Step-by-Step Fix</CardTitle>
              <CardDescription>Complete these steps to resolve the issues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-3">📋 Action Items:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
                    <li>
                      <strong>Cancel</strong> any open dialogs in Vercel
                    </li>
                    <li>
                      <strong>Find existing variables</strong> in your environment variables list
                    </li>
                    <li>
                      <strong>Edit each variable</strong> to enable Preview environment
                    </li>
                    <li>
                      <strong>Don't worry</strong> about Development being locked for sensitive variables
                    </li>
                    <li>
                      <strong>Save all changes</strong>
                    </li>
                    <li>
                      <strong>Test connection</strong> using the button below
                    </li>
                  </ol>
                </div>

                <div className="flex justify-center">
                  <Button onClick={testConnection} disabled={isLoading} size="lg">
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    Test Connection After Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Results */}
          {testResult && (
            <Card>
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
                <CardDescription>Connection test results</CardDescription>
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
                      <XCircle className="w-5 h-5 text-red-600 mr-2" />
                    )}
                    <span className={`font-medium ${testResult.success ? "text-green-800" : "text-red-800"}`}>
                      {testResult.success ? "🎉 Perfect! Everything Working" : "❌ Still Some Issues"}
                    </span>
                  </div>

                  {testResult.success ? (
                    <div className="text-green-700 text-sm">
                      <p>Your Supabase connection is working perfectly! You can now use your database.</p>
                      {testResult.diagnosis && (
                        <p className="mt-1">
                          Database has {testResult.diagnosis.totalTables} tables, ready for your application.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-red-700 text-sm">
                      <p>{testResult.error}</p>
                      <p className="mt-1">Make sure you've enabled Preview environment for all Supabase variables.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
