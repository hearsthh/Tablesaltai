"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Brain, CheckCircle, XCircle, AlertTriangle, Key, Settings } from "lucide-react"

interface TestResult {
  feature: string
  status: "success" | "error" | "warning"
  message: string
  response?: string
  timestamp: Date
  mode?: string
  usage?: any
  cost?: any
}

export default function TestAIPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [customPrompt, setCustomPrompt] = useState("")
  const [apiKeyStatus, setApiKeyStatus] = useState<"unknown" | "configured" | "missing">("unknown")
  const [forceReal, setForceReal] = useState(false)

  const addTestResult = (result: TestResult) => {
    setTestResults((prev) => [result, ...prev])
  }

  const checkApiKeyStatus = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/debug-openai", {
        method: "GET",
      })
      const data = await response.json()

      if (data.hasApiKey) {
        setApiKeyStatus("configured")
        addTestResult({
          feature: "API Key Check",
          status: "success",
          message: "OpenAI API key is configured",
          response: `Key length: ${data.keyLength} characters`,
          timestamp: new Date(),
        })
      } else {
        setApiKeyStatus("missing")
        addTestResult({
          feature: "API Key Check",
          status: "error",
          message: "OpenAI API key is not configured",
          response: "Add OPENAI_API_KEY to environment variables",
          timestamp: new Date(),
        })
      }
    } catch (error) {
      addTestResult({
        feature: "API Key Check",
        status: "error",
        message: "Failed to check API key status",
        timestamp: new Date(),
      })
    }
    setIsLoading(false)
  }

  const testRealOpenAI = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/test-openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          forceReal: true,
          prompt: "Say 'Real OpenAI connection successful' if you can read this.",
        }),
      })
      const data = await response.json()

      if (response.ok && data.success && data.mode === "real") {
        addTestResult({
          feature: "Real OpenAI Test",
          status: "success",
          message: "Real OpenAI API connection successful",
          response: data.message,
          mode: data.mode,
          usage: data.usage,
          cost: data.cost,
          timestamp: new Date(),
        })
      } else if (data.mode === "fallback") {
        addTestResult({
          feature: "Real OpenAI Test",
          status: "warning",
          message: "Fallback mode activated - API key missing or invalid",
          response: data.message,
          mode: data.mode,
          timestamp: new Date(),
        })
      } else {
        addTestResult({
          feature: "Real OpenAI Test",
          status: "error",
          message: data.error || "Real OpenAI connection failed",
          response: data.note || "Check API key configuration",
          timestamp: new Date(),
        })
      }
    } catch (error) {
      addTestResult({
        feature: "Real OpenAI Test",
        status: "error",
        message: "Network error or API unavailable",
        timestamp: new Date(),
      })
    }
    setIsLoading(false)
  }

  const testRealContentGeneration = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/ai/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "social_media",
          topic: "New seasonal menu with fresh ingredients",
          tone: "exciting",
          keywords: ["delicious", "fresh", "authentic", "seasonal"],
          length: "medium",
          audience: "food lovers",
          forceReal: true,
        }),
      })
      const data = await response.json()

      if (response.ok && data.content) {
        addTestResult({
          feature: "Real Content Generation",
          status: "success",
          message: "Real OpenAI content generated successfully",
          response: data.content,
          mode: data.mode || "real",
          usage: data.usage,
          cost: data.cost,
          timestamp: new Date(),
        })
      } else {
        addTestResult({
          feature: "Real Content Generation",
          status: "error",
          message: data.error || "Real content generation failed",
          response: "Check OpenAI API key and quota",
          timestamp: new Date(),
        })
      }
    } catch (error) {
      addTestResult({
        feature: "Real Content Generation",
        status: "error",
        message: "API request failed",
        timestamp: new Date(),
      })
    }
    setIsLoading(false)
  }

  const testRealMenuInsights = async () => {
    setIsLoading(true)
    try {
      const mockMenuData = {
        categories: [
          {
            name: "Appetizers",
            items: [
              { name: "Samosa Chaat", price: 8.99, description: "Crispy samosas with chutneys" },
              { name: "Paneer Tikka", price: 12.99, description: "Grilled cottage cheese cubes" },
            ],
          },
          {
            name: "Main Courses",
            items: [
              { name: "Butter Chicken", price: 16.99, description: "Creamy tomato curry with chicken" },
              { name: "Dal Makhani", price: 14.99, description: "Rich black lentil curry" },
            ],
          },
        ],
      }

      const response = await fetch("/api/ai/menu-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          menuData: mockMenuData,
          forceReal: true,
        }),
      })
      const data = await response.json()

      if (response.ok && data.success) {
        addTestResult({
          feature: "Real Menu Insights",
          status: "success",
          message: "Real AI menu analysis completed",
          response: data.analysis,
          mode: data.mode,
          usage: data.usage,
          cost: data.cost,
          timestamp: new Date(),
        })
      } else {
        addTestResult({
          feature: "Real Menu Insights",
          status: "error",
          message: data.error || "Menu insights generation failed",
          timestamp: new Date(),
        })
      }
    } catch (error) {
      addTestResult({
        feature: "Real Menu Insights",
        status: "error",
        message: "API request failed",
        timestamp: new Date(),
      })
    }
    setIsLoading(false)
  }

  const testCustomRealPrompt = async () => {
    if (!customPrompt.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/ai/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "custom",
          topic: customPrompt,
          tone: "professional",
          length: "medium",
          forceReal: true,
        }),
      })
      const data = await response.json()

      if (response.ok && data.content) {
        addTestResult({
          feature: "Real Custom Prompt",
          status: "success",
          message: `Real AI response to: "${customPrompt.substring(0, 50)}..."`,
          response: data.content,
          mode: data.mode || "real",
          usage: data.usage,
          cost: data.cost,
          timestamp: new Date(),
        })
      } else {
        addTestResult({
          feature: "Real Custom Prompt",
          status: "error",
          message: data.error || "Custom prompt failed",
          response: "Check OpenAI API configuration",
          timestamp: new Date(),
        })
      }
    } catch (error) {
      addTestResult({
        feature: "Real Custom Prompt",
        status: "error",
        message: "Failed to process custom prompt",
        timestamp: new Date(),
      })
    }
    setIsLoading(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      default:
        return <Brain className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800"
      case "error":
        return "bg-red-100 text-red-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getModeColor = (mode: string) => {
    switch (mode) {
      case "real":
        return "bg-green-100 text-green-800"
      case "fallback":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Real AI Features Test</h1>
          <p className="text-sm text-gray-600">Test real OpenAI integration without fallback</p>
        </div>

        {/* API Key Status */}
        <Card className="border-gray-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Key className="h-4 w-4 text-gray-600" />
              OpenAI Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-3">
            <Button
              onClick={checkApiKeyStatus}
              disabled={isLoading}
              className="w-full h-8 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Settings className="h-4 w-4 mr-2" />}
              Check API Key Status
            </Button>

            {apiKeyStatus !== "unknown" && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API Key Status:</span>
                  <Badge
                    className={
                      apiKeyStatus === "configured" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }
                  >
                    {apiKeyStatus === "configured" ? "Configured" : "Missing"}
                  </Badge>
                </div>
                {apiKeyStatus === "missing" && (
                  <div className="mt-2 p-2 bg-yellow-50 rounded text-xs text-yellow-700">
                    <strong>To enable real AI:</strong> Add OPENAI_API_KEY to your environment variables
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Real AI Tests */}
        <Card className="border-gray-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Brain className="h-4 w-4 text-gray-600" />
              Real AI Tests (No Fallback)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-3">
            <div className="grid grid-cols-1 gap-3">
              <Button
                onClick={testRealOpenAI}
                disabled={isLoading}
                className="h-10 justify-start bg-white border border-gray-200 text-gray-900 hover:bg-gray-50"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Brain className="h-4 w-4 mr-2" />}
                Test Real OpenAI Connection
              </Button>

              <Button
                onClick={testRealContentGeneration}
                disabled={isLoading}
                className="h-10 justify-start bg-white border border-gray-200 text-gray-900 hover:bg-gray-50"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Brain className="h-4 w-4 mr-2" />}
                Test Real Content Generation
              </Button>

              <Button
                onClick={testRealMenuInsights}
                disabled={isLoading}
                className="h-10 justify-start bg-white border border-gray-200 text-gray-900 hover:bg-gray-50"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Brain className="h-4 w-4 mr-2" />}
                Test Real Menu Insights
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Custom Real Prompt Test */}
        <Card className="border-gray-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Real Custom Prompt Test</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-3">
            <div>
              <Label htmlFor="prompt" className="text-sm">
                Enter your prompt for real OpenAI:
              </Label>
              <Textarea
                id="prompt"
                placeholder="Ask real OpenAI anything about your restaurant..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>
            <Button
              onClick={testCustomRealPrompt}
              disabled={isLoading || !customPrompt.trim()}
              className="w-full h-8 bg-gray-900 hover:bg-gray-800"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Brain className="h-4 w-4 mr-2" />}
              Test Real Custom Prompt
            </Button>
          </CardContent>
        </Card>

        {/* Test Results */}
        <Card className="border-gray-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Real AI Test Results</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            {testResults.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Brain className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No real AI tests run yet. Check API key status first.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div key={index} className="border border-gray-100 rounded-lg p-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{getStatusIcon(result.status)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="text-sm font-medium text-gray-900">{result.feature}</h4>
                          <Badge className={`text-xs ${getStatusColor(result.status)}`}>{result.status}</Badge>
                          {result.mode && (
                            <Badge className={`text-xs ${getModeColor(result.mode)}`}>{result.mode}</Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{result.message}</p>
                        {result.response && (
                          <div className="bg-gray-50 rounded p-2 mt-2">
                            <p className="text-xs text-gray-700 whitespace-pre-wrap">{result.response}</p>
                          </div>
                        )}
                        {result.usage && (
                          <div className="mt-2 text-xs text-gray-500">
                            <span>Tokens: {result.usage.total_tokens || 0}</span>
                            {result.cost && <span className="ml-2">Cost: ${result.cost.totalCost || "0.00"}</span>}
                          </div>
                        )}
                        <p className="text-xs text-gray-400 mt-2">{result.timestamp.toLocaleTimeString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Setup Instructions */}
        <Card className="border-gray-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Setup Real OpenAI</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">To enable real AI features:</h4>
                <ol className="list-decimal list-inside space-y-1 text-blue-800">
                  <li>Get an OpenAI API key from platform.openai.com</li>
                  <li>Add OPENAI_API_KEY to your .env.local file</li>
                  <li>Restart your development server</li>
                  <li>Click "Check API Key Status" above</li>
                  <li>Run real AI tests</li>
                </ol>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-yellow-800">
                  <strong>Note:</strong> Real OpenAI API calls will consume tokens and incur costs. Monitor your usage
                  at platform.openai.com
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
