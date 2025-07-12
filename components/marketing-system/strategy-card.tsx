"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight, Target, Calendar, Plus, Sparkles, MoreHorizontal } from "lucide-react"
import type { MarketingStrategy, MarketingCampaign } from "@/lib/types/marketing-system"
import { CampaignCard } from "./campaign-card"

interface StrategyCardProps {
  strategy: MarketingStrategy
  campaigns: MarketingCampaign[]
  progress: number
  onCreateCampaign: (strategyId: string) => void
  onGenerateAICampaigns: (strategyId: string, goal: string) => void
  onEditStrategy: (strategy: MarketingStrategy) => void
}

export function StrategyCard({
  strategy,
  campaigns,
  progress,
  onCreateCampaign,
  onGenerateAICampaigns,
  onEditStrategy,
}: StrategyCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "paused":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const totalBudget = campaigns.reduce((sum, campaign) => sum + (campaign.budget || 0), 0)
  const totalSpent = campaigns.reduce((sum, campaign) => sum + (campaign.spent || 0), 0)
  const totalReach = campaigns.reduce((sum, campaign) => sum + campaign.performanceMetrics.reach, 0)

  return (
    <Card className="border-gray-200 hover:shadow-md transition-all">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-lg font-semibold text-gray-900">{strategy.title}</CardTitle>
                  {strategy.isAiGenerated && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Generated
                    </Badge>
                  )}
                </div>

                <div className="flex items-center space-x-4 mb-3">
                  <Badge variant="outline" className={getStatusColor(strategy.status)}>
                    {strategy.status.charAt(0).toUpperCase() + strategy.status.slice(1)}
                  </Badge>
                  <span className="text-sm text-gray-600">{campaigns.length} campaigns</span>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(strategy.startDate).toLocaleDateString()} -{" "}
                      {new Date(strategy.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3">{strategy.goal}</p>

                {/* Objective Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {strategy.objectiveTags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Progress */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm text-gray-600">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">{totalReach.toLocaleString()}</div>
                    <div className="text-gray-500">Total Reach</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">
                      {campaigns.filter((c) => c.status === "live").length}
                    </div>
                    <div className="text-gray-500">Active</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">₹{totalSpent.toLocaleString()}</div>
                    <div className="text-gray-500">Spent</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEditStrategy(strategy)
                  }}
                  className="h-8 w-8 p-0"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            {/* Campaign Actions */}
            <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Campaigns ({campaigns.length})</h4>
                <p className="text-sm text-gray-600">Manage campaign execution for this strategy</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onGenerateAICampaigns(strategy.id, strategy.goal)}
                  className="bg-white"
                >
                  <Sparkles className="w-4 h-4 mr-1" />
                  AI Campaigns
                </Button>
                <Button
                  size="sm"
                  onClick={() => onCreateCampaign(strategy.id)}
                  className="bg-gray-900 hover:bg-gray-800 text-white"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Campaign
                </Button>
              </div>
            </div>

            {/* Campaigns List */}
            <div className="space-y-4">
              {campaigns.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Target className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No campaigns yet</p>
                  <p className="text-xs">Create your first campaign to start executing this strategy</p>
                </div>
              ) : (
                campaigns.map((campaign) => (
                  <CampaignCard
                    key={campaign.id}
                    campaign={campaign}
                    onEdit={() => {}}
                    onViewDetails={() => {}}
                    onAddChannel={() => {}}
                  />
                ))
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
