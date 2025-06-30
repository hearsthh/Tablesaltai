"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Database,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Settings,
  Key,
  Server,
  Table,
  Loader2,
} from "lucide-react"

interface DebugData {
  environmentVariables: Record<string, any>
  clientCreation: {
    browserClient: boolean
    serverClient: boolean
    error: string | null
  }
  connectionTest: {
    canConnect: boolean
    error: string | null
    tables: string[]
  }
  tablesTest: {
    tablesExist: boolean
    missingTables: string[]
    error: string | null
  }
  recommendations: Array<{
    type: "success" | "warning" | "error"
    message: string
    action: string
  }>
}

export default function DebugSupabasePage() {
  const [debugData, setDebugData] = useState<DebugData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runDebug = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/debug-supabase")
      const data = await response.json()

      if (data.success) {
        setDebugData(data.debug)
      } else {
        setError(data.error || "Debug failed")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    runDebug()
  }, [])

  const getStatusIcon = (status: boolean | null) => {
    if (status === true) return <CheckCircle className="w-4 h-4 text-green-600" />
    if (status === false) return <XCircle className="w-4 h-4 text-red-600" />
    return <AlertCircle className="w-4 h-4 text-yellow-600" />
  }

  const getStatusColor = (status: boolean | null) => {
    if (status === true) return "text-green-600"
    if (status === false) return "text-red-600"
    return "text-yellow-600"
  }

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "success":
        return "default"
      case "warning":
        return "secondary"
      case "error":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Database className="w-8 h-8 mr-3 text-blue-600" />
                Supabase Debug Console
              </h1>
              <p className="text-gray-600 mt-2">Diagnose Supabase configuration and connection issues</p>
            </div>
            <Button onClick={runDebug} disabled={isLoading} variant="outline">
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              Refresh Debug
            </Button>
          </div>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-900 font-medium">Debug Error</span>
              </div>
              <p className="text-red-700 mt-2">{error}</p>
            </CardContent>
          </Card>
        )}

        {debugData && (
          <div className="space-y-6">
            {/* Environment Variables */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="w-5 h-5 mr-2" />
                  Environment Variables
                </CardTitle>
                <CardDescription>Check if all required Supabase environment variables are set</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(debugData.environmentVariables).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(value.isSet)}
                        <div>
                          <span className="font-mono text-sm font-medium">{key}</span>
                          {value.isSet && (
                            <p className="text-xs text-gray-600">
                              Length: {value.length} • Preview: {value.prefix}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge variant={value.isSet ? "default" : "destructive"}>{value.isSet ? "Set" : "Missing"}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Client Creation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Client Creation
                </CardTitle>
                <CardDescription>Test if Supabase clients can be created successfully</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(debugData.clientCreation.browserClient)}
                      <span className="font-medium">Browser Client</span>
                    </div>
                    <Badge variant={debugData.clientCreation.browserClient ? "default" : "destructive"}>
                      {debugData.clientCreation.browserClient ? "Success" : "Failed"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(debugData.clientCreation.serverClient)}
                      <span className="font-medium">Server Client</span>
                    </div>
                    <Badge variant={debugData.clientCreation.serverClient ? "default" : "destructive"}>
                      {debugData.clientCreation.serverClient ? "Success" : "Failed"}
                    </Badge>
                  </div>
                  {debugData.clientCreation.error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700 text-sm">{debugData.clientCreation.error}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Connection Test */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Server className="w-5 h-5 mr-2" />
                  Database Connection
                </CardTitle>
                <CardDescription>Test actual connection to Supabase database</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(debugData.connectionTest.canConnect)}
                      <span className="font-medium">Database Connection</span>
                    </div>
                    <Badge variant={debugData.connectionTest.canConnect ? "default" : "destructive"}>
                      {debugData.connectionTest.canConnect ? "Connected" : "Failed"}
                    </Badge>
                  </div>
                  {debugData.connectionTest.error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700 text-sm">{debugData.connectionTest.error}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tables Test */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Table className="w-5 h-5 mr-2" />
                  Database Tables
                </CardTitle>
                <CardDescription>Check if required database tables exist</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(debugData.tablesTest.tablesExist)}
                      <span className="font-medium">Required Tables</span>
                    </div>
                    <Badge variant={debugData.tablesTest.tablesExist ? "default" : "destructive"}>
                      {debugData.tablesTest.tablesExist ? "All Present" : "Missing Tables"}
                    </Badge>
                  </div>
                  {debugData.tablesTest.missingTables.length > 0 && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-yellow-800 text-sm font-medium mb-2">Missing Tables:</p>
                      <div className="flex flex-wrap gap-2">
                        {debugData.tablesTest.missingTables.map((table) => (
                          <Badge key={table} variant="outline" className="font-mono text-xs">
                            {table}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {debugData.tablesTest.error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700 text-sm">{debugData.tablesTest.error}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
                <CardDescription>Steps to fix any issues found</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {debugData.recommendations.map((rec, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Badge variant={getBadgeVariant(rec.type)} className="mt-0.5">
                          {rec.type}
                        </Badge>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{rec.message}</p>
                          <p className="text-sm text-gray-600 mt-1">{rec.action}</p>
                        </div>
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
                <CardDescription>Common fixes and next steps</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    onClick={() => window.open("/test-real-user", "_blank")}
                    className="justify-start"
                  >
                    <Database className="w-4 h-4 mr-2" />
                    Test User Creation
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open("https://supabase.com/dashboard", "_blank")}
                    className="justify-start"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Open Supabase Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {isLoading && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Running Supabase diagnostics...</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
