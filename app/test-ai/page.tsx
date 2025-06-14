"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

export default function TestAIPage() {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState("")

  const testOpenAI = async () => {
    setLoading(true)
    setResult("Testing OpenAI connection...")

    try {
      const response = await fetch("/api/ai/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "social media post",
          topic: "new seasonal menu",
          tone: "exciting and appetizing",
          keywords: ["fresh", "seasonal", "delicious", "restaurant"],
          length: "short",
          audience: "food enthusiasts",
        }),
      })

      const data = await response.json()

      if (data.error) {
        setResult(
          `❌ Error: ${data.error}\n\nThis usually means:\n1. OpenAI API key is missing\n2. API key is invalid\n3. OpenAI service is down`,
        )
      } else {
        setResult(`✅ Success! OpenAI is working!\n\n📝 Generated Content:\n${data.content}`)
      }
    } catch (error) {
      setResult(`❌ Network Error: ${error}\n\nCheck your internet connection and try again.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>🤖 OpenAI Integration Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Status:</strong> {process.env.OPENAI_API_KEY ? "✅ API Key Configured" : "❌ API Key Missing"}
            </p>
          </div>

          <div>
            <Button onClick={testOpenAI} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Content...
                </>
              ) : (
                "Test OpenAI Content Generation"
              )}
            </Button>
          </div>

          {result && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Result:</h3>
              <Textarea
                value={result}
                readOnly
                className="min-h-[200px]"
                placeholder="AI-generated content will appear here..."
              />
            </div>
          )}

          <div className="text-sm text-gray-600">
            <p>
              <strong>What this tests:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>OpenAI API key configuration</li>
              <li>AI content generation for restaurants</li>
              <li>Social media post creation</li>
              <li>Error handling</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
