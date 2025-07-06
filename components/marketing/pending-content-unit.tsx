"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Clock, AlertCircle, Play } from "lucide-react"
import { useRouter } from "next/navigation"
import type { ContentUnit } from "@/types/marketing"

interface PendingContentUnitProps {
  contentUnit: Partial<ContentUnit>
  onContinue?: (id: string) => void
}

export function PendingContentUnit({ contentUnit, onContinue }: PendingContentUnitProps) {
  const router = useRouter()

  const getProgressPercentage = () => {
    const current = contentUnit.currentStep || 0
    const total = contentUnit.totalSteps || 1
    return Math.round((current / total) * 100)
  }

  const getNextStepMessage = () => {
    const current = contentUnit.currentStep || 0
    const steps = [
      "Set up basic information",
      "Create content text",
      "Add media files",
      "Review and schedule",
      "Ready to publish",
    ]
    return steps[current] || "Complete setup"
  }

  const handleContinue = () => {
    if (onContinue && contentUnit.id) {
      onContinue(contentUnit.id)
    } else {
      router.push(`/marketing/content-units/${contentUnit.id}/edit`)
    }
  }

  return (
    <Card className="border-l-4 border-l-orange-400 bg-orange-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-4 h-4 text-orange-600" />
              <CardTitle className="text-base font-semibold text-gray-900">
                {contentUnit.title || "Untitled Content"}
              </CardTitle>
            </div>
            <p className="text-sm text-gray-600">{contentUnit.description || "No description available"}</p>
          </div>
          <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
            In Progress
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">{getProgressPercentage()}%</span>
          </div>
          <Progress value={getProgressPercentage()} className="h-2" />
        </div>

        {/* Next Step */}
        <div className="flex items-start space-x-2 p-3 bg-white rounded-lg border border-orange-200">
          <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Next Step:</p>
            <p className="text-sm text-gray-600">{getNextStepMessage()}</p>
          </div>
        </div>

        {/* Channel and Type */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Channel:</span>
          <Badge variant="outline" className="bg-gray-50">
            {contentUnit.channel || "Not set"}
          </Badge>
          <span>•</span>
          <span>Type:</span>
          <Badge variant="outline" className="bg-gray-50">
            {contentUnit.contentType || "Not set"}
          </Badge>
        </div>

        {/* Action */}
        <div className="flex justify-end pt-2 border-t border-orange-200">
          <Button onClick={handleContinue} className="bg-orange-600 hover:bg-orange-700">
            <Play className="w-3 h-3 mr-1" />
            Continue Setup
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
