"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  Users,
  Plus,
  Edit,
  Eye,
  Instagram,
  MessageCircle,
  Mail,
  Smartphone,
  QrCode,
  Facebook,
  Globe,
} from "lucide-react"
import type { MarketingCampaign } from "@/lib/types/marketing-system"

interface CampaignCardProps {
  campaign: MarketingCampaign
  onEdit: (campaign: MarketingCampaign) => void
  onViewDetails: (campaign: MarketingCampaign) => void
  onAddChannel: (campaignId: string) => void
}

export function CampaignCard({ campaign, onEdit, onViewDetails, onAddChannel }: CampaignCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-green-100 text-green-800 border-green-200"
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "paused":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "draft":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getChannelIcon = (channelType: string) => {
    switch (channelType) {
      case "instagram":
        return <Instagram className="w-4 h-4 text-pink-600" />
      case "whatsapp":
        return <MessageCircle className="w-4 h-4 text-green-600" />
      case "email":
        return <Mail className="w-4 h-4 text-blue-600" />
      case "sms":
        return <Smartphone className="w-4 h-4 text-purple-600" />
      case "qr_code":
        return <QrCode className="w-4 h-4 text-gray-600" />
      case "facebook":
        return <Facebook className="w-4 h-4 text-blue-700" />
      case "website":
        return <Globe className="w-4 h-4 text-green-600" />
      default:
        return <Globe className="w-4 h-4 text-gray-600" />
    }
  }

  const budgetUsed = campaign.budget ? ((campaign.spent || 0) / campaign.budget) * 100 : 0
  const daysRemaining = Math.ceil((new Date(campaign.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  return (
    <Card className="border-gray-200 hover:shadow-sm transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <CardTitle className="text-base font-semibold text-gray-900">{campaign.title}</CardTitle>
              <Badge variant="outline" className={getStatusColor(campaign.status)}>
                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-3">{campaign.summary}</p>

            {/* Target Audience */}
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{campaign.targetAudience.segment.replace("_", " ")}</span>
                <span className="text-gray-400">({campaign.targetAudience.size})</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{daysRemaining > 0 ? `${daysRemaining} days left` : "Ended"}</span>
              </div>
            </div>

            {/* Linked Entity */}
            {campaign.linkedEntity && (
              <div className="mb-3">
                <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                  {campaign.linkedEntity.type}: {campaign.linkedEntity.name}
                </Badge>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" onClick={() => onEdit(campaign)} className="h-8 w-8 p-0">
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onViewDetails(campaign)} className="h-8 w-8 p-0">
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Performance Metrics */}
        <div className="grid grid-cols-4 gap-3 text-center">
          <div>
            <div className="text-sm font-semibold text-gray-900">
              {campaign.performanceMetrics.reach.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">Reach</div>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">
              {campaign.performanceMetrics.clicks.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">Clicks</div>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">{campaign.performanceMetrics.conversions}</div>
            <div className="text-xs text-gray-500">Conversions</div>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">
              ₹{campaign.performanceMetrics.revenue.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">Revenue</div>
          </div>
        </div>

        {/* Budget Progress */}
        {campaign.budget && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Budget</span>
              <span className="text-sm text-gray-600">
                ₹{campaign.spent?.toLocaleString()} / ₹{campaign.budget.toLocaleString()}
              </span>
            </div>
            <Progress value={budgetUsed} className="h-2" />
          </div>
        )}

        {/* Channels */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Channels ({campaign.channels.length})</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddChannel(campaign.id)}
              className="h-6 text-xs bg-white"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add
            </Button>
          </div>

          {campaign.channels.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {campaign.channels.map((channelId, index) => (
                <div key={index} className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded text-xs">
                  {getChannelIcon(channelId)}
                  <span className="capitalize">{channelId.replace("_", " ")}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-2 text-gray-500 text-xs">No channels added yet</div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(campaign)}
            className="flex-1 bg-white text-xs"
          >
            <Eye className="w-3 h-3 mr-1" />
            View Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddChannel(campaign.id)}
            className="flex-1 bg-white text-xs"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Content
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
