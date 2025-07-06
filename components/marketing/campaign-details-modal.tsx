"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import {
  Play,
  Pause,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Target,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Bot,
  User,
} from "lucide-react"

interface Campaign {
  id: string
  name: string
  type: string
  status: string
  progress: number
  channels: string[]
  next_activity: string
  budget?: number
  spent?: number
  duration: string
  frequency: string
  activities: Array<{
    name: string
    status: string
    progress: number
    scheduled_date: string
    assigned_to: "ai" | "user"
  }>
  analytics: {
    reach: string
    engagement: string
    clicks: string
    conversions: string
  }
  timeline: {
    start_date: string
    end_date: string
    total_activities: number
    completed_activities: number
  }
}

interface CampaignDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  campaign: Campaign | null
}

export default function CampaignDetailsModal({ isOpen, onClose, campaign }: CampaignDetailsModalProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  if (!campaign) return null

  const handleCampaignAction = async (action: string) => {
    setActionLoading(action)
    try {
      const response = await fetch("/api/marketing/campaigns/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId: campaign.id, action }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: data.message,
        })
        // Refresh campaign data or close modal
        if (action === "delete") {
          onClose()
        }
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} campaign`,
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700"
      case "paused":
        return "bg-yellow-100 text-yellow-700"
      case "completed":
        return "bg-blue-100 text-blue-700"
      case "scheduled":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getActivityStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700"
      case "in_progress":
        return "bg-blue-100 text-blue-700"
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      case "overdue":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl mb-2">{campaign.name}</DialogTitle>
              <DialogDescription className="flex items-center space-x-4">
                <Badge className={getStatusColor(campaign.status)} variant="secondary">
                  {campaign.status}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {campaign.type}
                </Badge>
                <span className="text-sm text-slate-600">{campaign.duration}</span>
              </DialogDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCampaignAction("view_analytics")}
                disabled={actionLoading === "view_analytics"}
              >
                <Eye className="w-4 h-4 mr-1" />
                Analytics
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCampaignAction("edit")}
                disabled={actionLoading === "edit"}
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCampaignAction(campaign.status === "active" ? "pause" : "resume")}
                disabled={actionLoading === "pause" || actionLoading === "resume"}
              >
                {campaign.status === "active" ? (
                  <>
                    <Pause className="w-4 h-4 mr-1" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-1" />
                    Resume
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:bg-red-50 bg-transparent"
                onClick={() => handleCampaignAction("delete")}
                disabled={actionLoading === "delete"}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Campaign Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Progress</span>
              </div>
              <div className="text-2xl font-bold text-blue-900">{campaign.progress}%</div>
              <Progress value={campaign.progress} className="h-2 mt-2" />
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-900">Reach</span>
              </div>
              <div className="text-2xl font-bold text-green-900">{campaign.analytics.reach}</div>
              <div className="text-xs text-green-700">Total reach</div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Engagement</span>
              </div>
              <div className="text-2xl font-bold text-purple-900">{campaign.analytics.engagement}</div>
              <div className="text-xs text-purple-700">Engagement rate</div>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-900">Conversions</span>
              </div>
              <div className="text-2xl font-bold text-orange-900">{campaign.analytics.conversions}</div>
              <div className="text-xs text-orange-700">Total conversions</div>
            </div>
          </div>

          {/* Budget Information */}
          {campaign.budget && (
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Budget & Spend
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-slate-600">Total Budget</div>
                  <div className="text-lg font-bold text-slate-900">₹{campaign.budget.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Amount Spent</div>
                  <div className="text-lg font-bold text-slate-900">₹{(campaign.spent || 0).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Remaining</div>
                  <div className="text-lg font-bold text-slate-900">
                    ₹{(campaign.budget - (campaign.spent || 0)).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Spend Rate</div>
                  <div className="text-lg font-bold text-slate-900">
                    {Math.round(((campaign.spent || 0) / campaign.budget) * 100)}%
                  </div>
                </div>
              </div>
              <Progress value={((campaign.spent || 0) / campaign.budget) * 100} className="h-3 mt-3" />
            </div>
          )}

          {/* Timeline */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Campaign Timeline
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-slate-600">Start Date</div>
                <div className="font-medium text-slate-900">{formatDate(campaign.timeline.start_date)}</div>
              </div>
              <div>
                <div className="text-sm text-slate-600">End Date</div>
                <div className="font-medium text-slate-900">{formatDate(campaign.timeline.end_date)}</div>
              </div>
              <div>
                <div className="text-sm text-slate-600">Total Activities</div>
                <div className="font-medium text-slate-900">{campaign.timeline.total_activities}</div>
              </div>
              <div>
                <div className="text-sm text-slate-600">Completed</div>
                <div className="font-medium text-slate-900">{campaign.timeline.completed_activities}</div>
              </div>
            </div>
          </div>

          {/* Channels */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Active Channels</h3>
            <div className="flex flex-wrap gap-2">
              {campaign.channels.map((channel, index) => (
                <Badge key={index} variant="outline" className="px-3 py-1">
                  {channel}
                </Badge>
              ))}
            </div>
          </div>

          {/* Activities */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Campaign Activities
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {campaign.activities.map((activity, index) => (
                <div key={index} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900">{activity.name}</h4>
                      <div className="text-sm text-slate-600 mt-1">
                        Scheduled: {formatDate(activity.scheduled_date)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getActivityStatusColor(activity.status)} variant="secondary">
                        {activity.status.replace("_", " ")}
                      </Badge>
                      {activity.assigned_to === "ai" ? (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          <Bot className="w-3 h-3 mr-1" />
                          AI
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                          <User className="w-3 h-3 mr-1" />
                          User
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <span>Progress: {activity.progress}%</span>
                    </div>
                    <Progress value={activity.progress} className="h-2 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Activity */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Next Activity
            </h3>
            <p className="text-blue-800">{campaign.next_activity}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
