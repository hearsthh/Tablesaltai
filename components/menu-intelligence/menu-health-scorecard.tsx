"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { MenuHealthScore } from "@/lib/types/menu-intelligence"
import { BarChart3, TrendingUp, ImageIcon, FileText, Grid3X3, DollarSign, Zap, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"

interface MenuHealthScorecardProps {
  healthScore: MenuHealthScore
  lastEvaluated: string
}

export function MenuHealthScorecard({ healthScore, lastEvaluated }: MenuHealthScorecardProps) {
  const router = useRouter()

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBackground = (score: number) => {
    if (score >= 80) return "bg-green-100"
    if (score >= 60) return "bg-yellow-100"
    return "bg-red-100"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleEditMenu = () => {
    router.push("/profile/menu-builder?from=intelligence")
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center">
              <BarChart3 className="w-4 h-4 mr-2 text-blue-600" />
              Menu Health Score
            </CardTitle>
            <p className="text-xs text-gray-600 mt-1">Last evaluated: {formatDate(lastEvaluated)}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleEditMenu}>
            <ExternalLink className="w-4 h-4 mr-1" />
            Edit Menu
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="text-center">
          <div
            className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${getScoreBackground(healthScore.overallScore)} mb-2`}
          >
            <span className={`text-2xl font-bold ${getScoreColor(healthScore.overallScore)}`}>
              {healthScore.overallScore}
            </span>
          </div>
          <p className="text-sm text-gray-600">Overall Menu Health</p>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Visual Quality */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Visual Quality</span>
              </div>
              <span className="text-sm text-gray-600">{Math.round(healthScore.visualCompletenessScore)}%</span>
            </div>
            <Progress value={healthScore.visualCompletenessScore} className="h-2" />
            <p className="text-xs text-gray-600">
              {healthScore.itemsWithImage}/{healthScore.totalItems} items have images
            </p>
          </div>

          {/* Text Completion */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">Text Quality</span>
              </div>
              <span className="text-sm text-gray-600">{Math.round(healthScore.textCompletionScore)}%</span>
            </div>
            <Progress value={healthScore.textCompletionScore} className="h-2" />
            <p className="text-xs text-gray-600">
              {healthScore.itemsWithDescription}/{healthScore.totalItems} items have descriptions
            </p>
          </div>

          {/* Category Balance */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Grid3X3 className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium">Category Balance</span>
              </div>
              <span className="text-sm text-gray-600">{Math.round(healthScore.categoryBalanceScore)}%</span>
            </div>
            <Progress value={healthScore.categoryBalanceScore} className="h-2" />
            <p className="text-xs text-gray-600">{healthScore.categoryCount} categories</p>
          </div>

          {/* Pricing Consistency */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium">Pricing</span>
              </div>
              <span className="text-sm text-gray-600">{Math.round(healthScore.pricingConsistencyScore)}%</span>
            </div>
            <Progress value={healthScore.pricingConsistencyScore} className="h-2" />
            <p className="text-xs text-gray-600">Consistency score</p>
          </div>

          {/* AI Enhancement */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium">AI Enhanced</span>
              </div>
              <span className="text-sm text-gray-600">{Math.round(healthScore.aiCompletenessScore)}%</span>
            </div>
            <Progress value={healthScore.aiCompletenessScore} className="h-2" />
            <p className="text-xs text-gray-600">AI optimization level</p>
          </div>

          {/* Performance Trend */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium">Performance</span>
              </div>
              <span className="text-sm text-green-600">+12%</span>
            </div>
            <Progress value={75} className="h-2" />
            <p className="text-xs text-gray-600">vs last month</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <Button variant="outline" size="sm" onClick={handleEditMenu}>
            <Grid3X3 className="w-4 h-4 mr-1" />
            Manage Items
          </Button>
          <Button variant="outline" size="sm">
            <ImageIcon className="w-4 h-4 mr-1" />
            Add Images
          </Button>
          <Button variant="outline" size="sm">
            <Zap className="w-4 h-4 mr-1" />
            AI Enhance
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
