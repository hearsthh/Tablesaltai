"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Lightbulb, TrendingUp, Target, Users, ArrowRight, X } from "lucide-react"

interface AISuggestion {
  id: string
  type: "strategy" | "content" | "optimization" | "budget"
  title: string
  description: string
  impact: "high" | "medium" | "low"
  effort: "high" | "medium" | "low"
  expectedOutcome: string
  confidence: number
  category: string
}

interface AISuggestionCardProps {
  suggestion: AISuggestion
  onApply?: (suggestionId: string) => void
  onDismiss?: (suggestionId: string) => void
}

export function AISuggestionCard({ suggestion, onApply, onDismiss }: AISuggestionCardProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "strategy":
        return <Target className="w-4 h-4" />
      case "content":
        return <Lightbulb className="w-4 h-4" />
      case "optimization":
        return <TrendingUp className="w-4 h-4" />
      case "budget":
        return <Users className="w-4 h-4" />
      default:
        return <Lightbulb className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "strategy":
        return "bg-purple-100 text-purple-800"
      case "content":
        return "bg-blue-100 text-blue-800"
      case "optimization":
        return "bg-green-100 text-green-800"
      case "budget":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-white to-blue-50/30">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-lg ${getTypeColor(suggestion.type)}`}>{getTypeIcon(suggestion.type)}</div>
            <div className="flex-1">
              <CardTitle className="text-base font-semibold text-gray-900 mb-1">{suggestion.title}</CardTitle>
              <Badge variant="outline" className="bg-white">
                {suggestion.category}
              </Badge>
            </div>
          </div>
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDismiss(suggestion.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed">{suggestion.description}</p>

        {/* Expected Outcome */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-start space-x-2">
            <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-900">Expected Outcome:</p>
              <p className="text-sm text-blue-700">{suggestion.expectedOutcome}</p>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="text-center">
            <div className="text-gray-600 mb-1">Impact</div>
            <Badge className={getImpactColor(suggestion.impact)} variant="secondary">
              {suggestion.impact}
            </Badge>
          </div>
          <div className="text-center">
            <div className="text-gray-600 mb-1">Effort</div>
            <Badge className={getEffortColor(suggestion.effort)} variant="secondary">
              {suggestion.effort}
            </Badge>
          </div>
          <div className="text-center">
            <div className="text-gray-600 mb-1">Confidence</div>
            <Badge variant="outline" className="bg-white">
              {suggestion.confidence}%
            </Badge>
          </div>
        </div>

        {/* Action */}
        {onApply && (
          <div className="flex justify-end pt-2 border-t border-gray-100">
            <Button onClick={() => onApply(suggestion.id)} className="bg-blue-600 hover:bg-blue-700">
              Apply Suggestion
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
