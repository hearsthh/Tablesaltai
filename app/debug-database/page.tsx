"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Database, RefreshCw, CheckCircle, XCircle, AlertTriangle, Trash2, Plus, TestTube, Shield } from "lucide-react"

export default function DebugDatabasePage() {
  const [diagnosis, setDiagnosis] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFixing, setIsFixing] = useState(false)

  const runDiagnosis = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/debug-database-schema")
      const data = await response.json()
      setDiagnosis(data)

      if (data.success) {
        toast({
          title: "Diagnosis Complete",
          description: "Database analysis completed successfully",
        })
      } else {
        toast({
          title: "Issues Found",
          description: data.error || "Check the details below",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Diagnosis Failed",
        description: "Failed to analyze database",
        variant: "destructive",
      })
    }
    setIsLoading(false)
  }

  const executeAction = async (action: string) => {
    setIsFixing(true)
    try {
      const response = await fetch("/api/fix-database-schema", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Action Completed",
          description: data.message || `${action} completed successfully`,
        })
        // Re-run diagnosis after successful action
        setTimeout(runDiagnosis, 1000)
      } else {
        toast({
          title: "Action Failed",
          description: data.error || "Action failed",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Action Failed",
        description: "Failed to execute action",
        variant: "destructive",
      })
    }
    setIsFixing(false)
  }

  useEffect(() => {
    runDiagnosis()
  }, [])

  const getStatusIcon = (status: string) => {
    if (status === "success" || status === "passed") return <CheckCircle className="w-4 h-4 text-green-600" />
    if (status === "warning") return <AlertTriangle className="w-4 h-4 text-yellow-600" />
    return <XCircle className="w-4 h-4 text-red-600" />
  }

  const getStatusColor = (status: string) => {
    if (status === "success" || status === "passed") return "text-green-600"
    if (status === "warning") return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Database className="w-8 h-8 mr-3 text-blue-600" />
                Database Debug Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Diagnose and fix your Supabase database issues</p>
            </div>
            <Button onClick={runDiagnosis} disabled={isLoading} variant="outline">
              {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              Run Diagnosis
            </Button>
          </div>
        </div>

        {diagnosis && (
          <div className="space-y-6">
            {/* Overall Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {diagnosis.success ? (
                    <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600 mr-2" />
                  )}
                  Connection Status
                </CardTitle>
                <CardDescription>
                  {diagnosis.success ? "Database connection is working" : "Database connection failed"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {diagnosis.error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-800 font-medium">Error:</p>
                    <p className="text-red-700">{diagnosis.error}</p>
                  </div>
                )}

                {diagnosis.recommendation && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 font-medium">Recommendation:</p>
                    <p className="text-blue-700">{diagnosis.recommendation}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Environment Variables Status */}
            {diagnosis.envCheck && (
              <Card>
                <CardHeader>
                  <CardTitle>Environment Variables</CardTitle>
                  <CardDescription>Status of required Supabase environment variables</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(diagnosis.envCheck).map(([key, status]) => (
                      <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {status.includes("✅") ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                          <code className="text-sm font-mono">{key}</code>
                        </div>
                        <Badge variant={status.includes("✅") ? "default" : "destructive"}>{status}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Database Schema Status */}
            {diagnosis.success && diagnosis.diagnosis && (
              <Card>
                <CardHeader>
                  <CardTitle>Database Schema Status</CardTitle>
                  <CardDescription>Analysis of your database tables and structure</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{diagnosis.diagnosis.totalTables}</div>
                      <div className="text-sm text-gray-600">Total Tables</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{diagnosis.diagnosis.presentTables}</div>
                      <div className="text-sm text-gray-600">Present Tables</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{diagnosis.diagnosis.missingTables}</div>
                      <div className="text-sm text-gray-600">Missing Tables</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{diagnosis.diagnosis.expectedTables}</div>
                      <div className="text-sm text-gray-600">Expected Tables</div>
                    </div>
                  </div>

                  {diagnosis.diagnosis.keyType && (
                    <div className="mb-4">
                      <Badge variant={diagnosis.diagnosis.keyType === "service_role" ? "default" : "secondary"}>
                        Using {diagnosis.diagnosis.keyType} key
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Table Details */}
            {diagnosis.details && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Present Tables */}
                {diagnosis.details.presentTables && diagnosis.details.presentTables.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-green-600">Present Tables</CardTitle>
                      <CardDescription>Tables that exist in your database</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {diagnosis.details.presentTables.map((table) => (
                          <div key={table} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <code className="text-sm">{table}</code>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Missing Tables */}
                {diagnosis.details.missingTables && diagnosis.details.missingTables.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-red-600">Missing Tables</CardTitle>
                      <CardDescription>Tables that need to be created</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {diagnosis.details.missingTables.map((table) => (
                          <div key={table} className="flex items-center space-x-2">
                            <XCircle className="w-4 h-4 text-red-600" />
                            <code className="text-sm">{table}</code>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Recommendations */}
            {diagnosis.recommendations && (
              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                  <CardDescription>Suggested actions to fix your database</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {diagnosis.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                        {getStatusIcon(rec.type)}
                        <div className="flex-1">
                          <p className={`font-medium ${getStatusColor(rec.type)}`}>{rec.message}</p>
                          <p className="text-sm text-gray-600 mt-1">{rec.action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            {diagnosis.success && (
              <Card>
                <CardHeader>
                  <CardTitle>Database Actions</CardTitle>
                  <CardDescription>Actions you can take to fix or test your database</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Button
                      onClick={() => executeAction("check_permissions")}
                      disabled={isFixing}
                      variant="outline"
                      className="flex items-center justify-center"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Check Permissions
                    </Button>

                    <Button
                      onClick={() => executeAction("test_basic_operations")}
                      disabled={isFixing}
                      variant="outline"
                      className="flex items-center justify-center"
                    >
                      <TestTube className="w-4 h-4 mr-2" />
                      Test Operations
                    </Button>

                    <Button
                      onClick={() => executeAction("create_minimal_schema")}
                      disabled={isFixing}
                      variant="default"
                      className="flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Schema
                    </Button>

                    <Button
                      onClick={() => executeAction("drop_all_tables")}
                      disabled={isFixing}
                      variant="destructive"
                      className="flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Drop All Tables
                    </Button>
                  </div>

                  {isFixing && (
                    <div className="mt-4 flex items-center justify-center text-blue-600">
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Executing action...
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
