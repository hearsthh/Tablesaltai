"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Bug, Database, RefreshCwIcon as Refresh, TestTube } from "lucide-react"

export default function ContentDebugPanel() {
  const [isLoading, setIsLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const testContentSave = async () => {
    setIsLoading(true)
    try {
      // Test saving content
      const testContent = {
        contentType: "test-debug",
        title: "Debug Test Content",
        contentData: {
          message: "This is a test content generated at " + new Date().toISOString(),
          items: ["Test Item 1", "Test Item 2"],
        },
        metadata: {
          source: "debug-panel",
          timestamp: Date.now(),
        },
        aiMode: "debug",
        generationCost: 0.001,
        tokensUsed: 50,
        restaurantId: "debug-restaurant",
      }

      console.log("🧪 Testing content save:", testContent)

      const response = await fetch("/api/generated-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testContent),
      })

      const result = await response.json()
      console.log("📝 Save result:", result)

      if (response.ok) {
        setDebugInfo({ success: true, data: result })
        toast({
          title: "✅ Test Content Saved",
          description: "Debug content was successfully saved to database",
        })
      } else {
        setDebugInfo({ success: false, error: result })
        toast({
          title: "❌ Save Failed",
          description: result.error || "Failed to save test content",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("🚨 Debug test error:", error)
      setDebugInfo({ success: false, error: error })
      toast({
        title: "❌ Test Error",
        description: "Debug test encountered an error",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testContentFetch = async () => {
    setIsLoading(true)
    try {
      console.log("🔍 Testing content fetch...")

      const response = await fetch("/api/generated-content")
      const result = await response.json()

      console.log("📋 Fetch result:", result)

      if (response.ok) {
        setDebugInfo({ success: true, data: result, count: result.content?.length || 0 })
        toast({
          title: "✅ Content Fetched",
          description: `Found ${result.content?.length || 0} items in history`,
        })
      } else {
        setDebugInfo({ success: false, error: result })
        toast({
          title: "❌ Fetch Failed",
          description: result.error || "Failed to fetch content",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("🚨 Fetch test error:", error)
      setDebugInfo({ success: false, error: error })
      toast({
        title: "❌ Fetch Error",
        description: "Failed to fetch content history",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testDatabaseConnection = async () => {
    setIsLoading(true)
    try {
      console.log("🔌 Testing database connection...")

      // Test with a simple query
      const response = await fetch("/api/generated-content?limit=1")
      const result = await response.json()

      console.log("🗄️ Database test result:", result)

      if (response.ok) {
        setDebugInfo({ success: true, database: "connected", data: result })
        toast({
          title: "✅ Database Connected",
          description: "Database connection is working properly",
        })
      } else {
        setDebugInfo({ success: false, database: "error", error: result })
        toast({
          title: "❌ Database Error",
          description: result.error || "Database connection failed",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("🚨 Database test error:", error)
      setDebugInfo({ success: false, database: "error", error: error })
      toast({
        title: "❌ Database Error",
        description: "Failed to connect to database",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bug className="w-5 h-5" />
          <span>Content System Debug Panel</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button onClick={testDatabaseConnection} disabled={isLoading} variant="outline" className="w-full">
            <Database className="w-4 h-4 mr-2" />
            Test Database
          </Button>
          <Button onClick={testContentSave} disabled={isLoading} variant="outline" className="w-full">
            <TestTube className="w-4 h-4 mr-2" />
            Test Save
          </Button>
          <Button onClick={testContentFetch} disabled={isLoading} variant="outline" className="w-full">
            <Refresh className="w-4 h-4 mr-2" />
            Test Fetch
          </Button>
        </div>

        {debugInfo && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Badge variant={debugInfo.success ? "default" : "destructive"}>
                  {debugInfo.success ? "SUCCESS" : "ERROR"}
                </Badge>
                <span>Debug Results</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-gray-100 p-4 rounded-lg overflow-auto max-h-64">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        <div className="text-sm text-gray-600 space-y-2">
          <p>
            <strong>Instructions:</strong>
          </p>
          <ol className="list-decimal list-inside space-y-1">
            <li>First, click "Test Database" to verify connection</li>
            <li>Then click "Test Save" to save a test content item</li>
            <li>Finally, click "Test Fetch" to verify content appears in history</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}
