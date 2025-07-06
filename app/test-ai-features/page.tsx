"use client"

import { Suspense } from "react"
import AITestSuite from "@/components/ai/ai-test-suite"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card>
        <CardContent className="p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading AI Test Suite...</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function TestAIFeaturesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<LoadingFallback />}>
        <AITestSuite />
      </Suspense>
    </div>
  )
}
