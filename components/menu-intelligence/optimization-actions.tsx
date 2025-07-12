"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { MenuOptimizationAction } from "@/lib/types/menu-intelligence"
import { Zap, TrendingUp, Clock, Target, FileText, ImageIcon, DollarSign, Trash2, Grid3X3, Star } from "lucide-react"

interface OptimizationActionsProps {
  actions: MenuOptimizationAction[]
  onExecuteAction: (actionId: string) => void
}

export function OptimizationActions({ actions, onExecuteAction }: OptimizationActionsProps) {
  const getActionIcon = (type: string) => {
    switch (type) {
      case "description":
        return <FileText className="w-4 h-4 text-blue-600" />
      case "visual":
        return <ImageIcon className="w-4 h-4 text-green-600" />
      case "pricing":
        return <DollarSign className="w-4 h-4 text-yellow-600" />
      case "removal":
        return <Trash2 className="w-4 h-4 text-red-600" />
      case "category":
        return <Grid3X3 className="w-4 h-4 text-purple-600" />
      case "promotion":
        return <Star className="w-4 h-4 text-orange-600" />
      default:
        return <Zap className="w-4 h-4 text-gray-600" />
    }
  }

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case "high":
        return <Badge className="bg-green-100 text-green-800 border-green-200">High Impact</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium Impact</Badge>
      case "low":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Low Impact</Badge>
      default:
        return null
    }
  }

  const getEffortBadge = (effort: string) => {
    switch (effort) {
      case "low":
        return (
          <Badge variant="outline" className="text-green-600 border-green-200">
            Low Effort
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-200">
            Medium Effort
          </Badge>
        )
      case "high":
        return (
          <Badge variant="outline" className="text-red-600 border-red-200">
            High Effort
          </Badge>
        )
      default:
        return null
    }
  }

  if (actions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <Zap className="w-4 h-4 mr-2 text-purple-600" />🔧 Optimization Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">All optimized!</h3>
            <p className="text-gray-600 text-sm">
              Your menu is performing well. Check back later for new optimization opportunities.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center">
          <Zap className="w-4 h-4 mr-2 text-purple-600" />🔧 Optimization Actions
          <Badge variant="outline" className="ml-2">
            {actions.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {actions.map((action) => (
          <div key={action.id} className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3 flex-1">
                <div className="mt-0.5">{getActionIcon(action.type)}</div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm mb-1">{action.title}</h4>
                  <p className="text-xs text-gray-600 mb-2">{action.description}</p>

                  <div className="flex items-center space-x-2 mb-2">
                    {getImpactBadge(action.impact)}
                    {getEffortBadge(action.effort)}
                  </div>

                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                    <div className="flex items-center">
                      <Target className="w-3 h-3 mr-1" />
                      {action.itemsAffected} items affected
                    </div>
                    {action.estimatedRevenue && (
                      <div className="flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +₹{action.estimatedRevenue}/month potential
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Button
                size="sm"
                onClick={() => onExecuteAction(action.id)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Zap className="w-4 h-4 mr-1" />
                Execute Action
              </Button>

              <div className="flex items-center space-x-2">
                <div className="flex items-center text-xs text-gray-600">
                  <Clock className="w-3 h-3 mr-1" />
                  {action.effort === "low" ? "< 5 min" : action.effort === "medium" ? "15-30 min" : "1+ hour"}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Bulk Actions */}
        {actions.length > 1 && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Execute multiple actions at once:</p>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    actions.filter((a) => a.effort === "low").forEach((a) => onExecuteAction(a.id))
                  }}
                  className="bg-transparent"
                >
                  Quick Fixes ({actions.filter((a) => a.effort === "low").length})
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    actions.filter((a) => a.impact === "high").forEach((a) => onExecuteAction(a.id))
                  }}
                  className="bg-transparent"
                >
                  High Impact ({actions.filter((a) => a.impact === "high").length})
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
