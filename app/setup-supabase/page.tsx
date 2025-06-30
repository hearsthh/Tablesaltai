"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Database,
  ExternalLink,
  Copy,
  CheckCircle,
  AlertTriangle,
  FileText,
  Settings,
  Key,
  Server,
  RefreshCw,
} from "lucide-react"

interface SetupData {
  instructions: any
  quickSetup: any
}

export default function SetupSupabasePage() {
  const [setupData, setSetupData] = useState<SetupData | null>(null)
  const [envTemplate, setEnvTemplate] = useState<string>("")
  const [copiedTemplate, setCopiedTemplate] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchSetupData()
  }, [])

  const fetchSetupData = async () => {
    try {
      const response = await fetch("/api/setup-supabase")
      const data = await response.json()
      setSetupData(data)
    } catch (error) {
      console.error("Failed to fetch setup data:", error)
    }
  }

  const generateEnvTemplate = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/setup-supabase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create-env-template" }),
      })
      const data = await response.json()
      setEnvTemplate(data.template)
    } catch (error) {
      console.error("Failed to generate template:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyTemplate = async () => {
    if (envTemplate) {
      await navigator.clipboard.writeText(envTemplate)
      setCopiedTemplate(true)
      setTimeout(() => setCopiedTemplate(false), 2000)
    }
  }

  if (!setupData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Database className="w-12 h-12 mx-auto text-blue-600 animate-pulse" />
          <p className="mt-4 text-gray-600">Loading setup instructions...</p>
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
                <Database className="w-8 h-8 mr-3 text-blue-600" />
                Supabase Setup Guide
              </h1>
              <p className="text-gray-600 mt-2">Configure Supabase environment variables for your project</p>
            </div>
            <Button
              onClick={() => window.open("/debug-supabase", "_blank")}
              variant="outline"
              className="flex items-center"
            >
              <Settings className="w-4 h-4 mr-2" />
              Debug Console
            </Button>
          </div>
        </div>

        {/* Alert */}
        <Card className="mb-6 border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-900">Environment Variables Missing</h3>
                <p className="text-yellow-800 mt-1">
                  Your Supabase environment variables are not configured. Follow the steps below to set them up.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="quick-setup" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="quick-setup">Quick Setup</TabsTrigger>
            <TabsTrigger value="detailed-steps">Detailed Steps</TabsTrigger>
            <TabsTrigger value="env-template">Environment Template</TabsTrigger>
          </TabsList>

          {/* Quick Setup */}
          <TabsContent value="quick-setup">
            <Card>
              <CardHeader>
                <CardTitle>Quick Setup Checklist</CardTitle>
                <CardDescription>Follow these steps to configure Supabase in your project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {setupData.quickSetup.steps.map((step: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-gray-900 flex-1">{step}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex space-x-4">
                  <Button
                    onClick={() => window.open("https://supabase.com/dashboard", "_blank")}
                    className="flex items-center"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Supabase Dashboard
                  </Button>
                  <Button onClick={generateEnvTemplate} variant="outline" disabled={isLoading}>
                    <FileText className="w-4 h-4 mr-2" />
                    Generate .env Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Detailed Steps */}
          <TabsContent value="detailed-steps">
            <div className="space-y-6">
              {Object.entries(setupData.instructions).map(([key, step]: [string, any]) => (
                <Card key={key}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      {key === "step1" && <FileText className="w-5 h-5 mr-2" />}
                      {key === "step2" && <Key className="w-5 h-5 mr-2" />}
                      {key === "step3" && <Settings className="w-5 h-5 mr-2" />}
                      {key === "step4" && <RefreshCw className="w-5 h-5 mr-2" />}
                      {key === "step5" && <CheckCircle className="w-5 h-5 mr-2" />}
                      {step.title}
                    </CardTitle>
                    <CardDescription>{step.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {step.location && (
                      <div className="mb-4">
                        <Badge variant="outline" className="mb-2">
                          Location: {step.location}
                        </Badge>
                      </div>
                    )}

                    {step.credentials && (
                      <div className="space-y-4">
                        {step.credentials.map((cred: any, index: number) => (
                          <div key={index} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{cred.name}</h4>
                              <Badge variant="secondary" className="font-mono text-xs">
                                {cred.envVar}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{cred.location}</p>
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">{cred.example}</code>
                            {cred.warning && (
                              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                                <p className="text-red-700 text-sm">⚠️ {cred.warning}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {step.template && (
                      <div className="mt-4">
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                          {step.template}
                        </pre>
                      </div>
                    )}

                    {step.commands && (
                      <div className="mt-4">
                        <div className="space-y-2">
                          {step.commands.map((cmd: string, index: number) => (
                            <Badge key={index} variant="outline" className="font-mono">
                              {cmd}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {step.url && (
                      <div className="mt-4">
                        <Button onClick={() => window.open(step.url, "_blank")} variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open Link
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Environment Template */}
          <TabsContent value="env-template">
            <Card>
              <CardHeader>
                <CardTitle>Environment Variables Template</CardTitle>
                <CardDescription>Copy this template to create your .env.local file</CardDescription>
              </CardHeader>
              <CardContent>
                {!envTemplate ? (
                  <div className="text-center py-8">
                    <Button onClick={generateEnvTemplate} disabled={isLoading}>
                      {isLoading ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <FileText className="w-4 h-4 mr-2" />
                      )}
                      Generate Template
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">File: .env.local</Badge>
                      <Button onClick={copyTemplate} variant="outline" size="sm">
                        {copiedTemplate ? (
                          <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 mr-2" />
                        )}
                        {copiedTemplate ? "Copied!" : "Copy Template"}
                      </Button>
                    </div>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">
                      {envTemplate}
                    </pre>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Next Steps:</h4>
                      <ol className="text-blue-800 text-sm space-y-1">
                        <li>1. Create a file named ".env.local" in your project root directory</li>
                        <li>2. Copy the template above into the file</li>
                        <li>3. Replace all placeholder values with your actual Supabase credentials</li>
                        <li>4. Save the file</li>
                        <li>5. Restart your development server (Ctrl+C, then npm run dev)</li>
                        <li>6. Test the setup using the Debug Console</li>
                      </ol>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => window.open("https://supabase.com/dashboard", "_blank")}
                variant="outline"
                className="justify-start"
              >
                <Database className="w-4 h-4 mr-2" />
                Supabase Dashboard
              </Button>
              <Button
                onClick={() => window.open("/debug-supabase", "_blank")}
                variant="outline"
                className="justify-start"
              >
                <Settings className="w-4 h-4 mr-2" />
                Debug Console
              </Button>
              <Button
                onClick={() => window.open("/test-real-user", "_blank")}
                variant="outline"
                className="justify-start"
              >
                <Server className="w-4 h-4 mr-2" />
                Test Setup
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
