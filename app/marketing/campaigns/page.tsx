"use client"

import { useState } from "react"
import { useMarketingStore } from "@/lib/store/marketing-store"
import { CampaignForm } from "@/components/forms/campaign-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, ArrowLeft, Eye, Edit, Trash2, Play, Pause } from "lucide-react"

export default function CampaignsPage() {
  const router = useRouter()
  const [createCampaignOpen, setCreateCampaignOpen] = useState(false)

  // Get data from store
  const campaigns = useMarketingStore((state) => state.campaigns)
  const deleteCampaign = useMarketingStore((state) => state.deleteCampaign)
  const updateCampaign = useMarketingStore((state) => state.updateCampaign)
  const getTotalBudget = useMarketingStore((state) => state.getTotalBudget)
  const getTotalSpent = useMarketingStore((state) => state.getTotalSpent)
  const getActiveCampaigns = useMarketingStore((state) => state.getActiveCampaigns)

  // Calculate stats from real data
  const campaignStats = {
    total: campaigns.length,
    active: getActiveCampaigns().length,
    paused: campaigns.filter((c) => c.status === "paused").length,
    draft: campaigns.filter((c) => c.status === "draft").length,
    totalBudget: getTotalBudget(),
    totalSpent: getTotalSpent(),
  }

  const handleCampaignSuccess = () => {
    setCreateCampaignOpen(false)
  }

  const handleDeleteCampaign = (id: string) => {
    if (confirm("Are you sure you want to delete this campaign?")) {
      deleteCampaign(id)
    }
  }

  const handleToggleCampaign = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active"
    updateCampaign(id, { status: newStatus as any })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700"
      case "paused":
        return "bg-yellow-100 text-yellow-700"
      case "draft":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-slate-900 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-semibold text-slate-900">TableSalt</span>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex space-x-8">
                <Button variant="ghost" className="text-slate-500 rounded-md" onClick={() => router.push("/profile")}>
                  {/* Profile icon */}
                </Button>
                <Button
                  variant="ghost"
                  className="text-slate-900 font-medium rounded-md"
                  onClick={() => router.push("/marketing")}
                >
                  {/* Marketing icon */}
                </Button>
                <Button variant="ghost" className="text-slate-500 rounded-md">
                  {/* Customers icon */}
                </Button>
                <Button variant="ghost" className="text-slate-500 rounded-md">
                  {/* Integrations icon */}
                </Button>
              </nav>
              <Button variant="ghost" size="icon" className="md:hidden rounded-md">
                {/* Menu icon */}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/marketing")} className="rounded-md">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketing Hub
            </Button>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold text-slate-900">Campaign Management</h1>
              <p className="text-slate-600 mt-2">Create, manage, and optimize your marketing campaigns</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Dialog open={createCampaignOpen} onOpenChange={setCreateCampaignOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center bg-slate-900 hover:bg-slate-800 rounded-md">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Campaign
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Campaign</DialogTitle>
                    <DialogDescription>Set up a new marketing campaign</DialogDescription>
                  </DialogHeader>
                  <CampaignForm onSuccess={handleCampaignSuccess} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Campaign Stats - Now using real data */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-slate-200">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">{campaignStats.active}</div>
                <div className="text-sm text-slate-600">Active Campaigns</div>
                <div className="text-xs text-green-600 mt-1">of {campaignStats.total} total</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">
                  ₹{(campaignStats.totalSpent / 1000).toFixed(0)}K
                </div>
                <div className="text-sm text-slate-600">Total Spent</div>
                <div className="text-xs text-slate-500 mt-1">
                  of ₹{(campaignStats.totalBudget / 1000).toFixed(0)}K budget
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Add more stats cards */}
        </div>

        {/* Campaigns List - Now using real data */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>All Campaigns</CardTitle>
            <CardDescription>Manage and monitor your marketing campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            {campaigns.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-500 mb-4">No campaigns created yet</p>
                <Dialog open={createCampaignOpen} onOpenChange={setCreateCampaignOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Campaign
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create New Campaign</DialogTitle>
                      <DialogDescription>Set up a new marketing campaign</DialogDescription>
                    </DialogHeader>
                    <CampaignForm onSuccess={handleCampaignSuccess} />
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="p-6 border border-slate-200 rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-slate-900">{campaign.name}</h3>
                          <Badge className={getStatusColor(campaign.status)} variant="secondary">
                            {campaign.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {campaign.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">{campaign.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-slate-500">
                          <span>
                            {campaign.startDate} - {campaign.endDate}
                          </span>
                          <span>•</span>
                          <span>{campaign.objective}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleCampaign(campaign.id, campaign.status)}
                        >
                          {campaign.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteCampaign(campaign.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <span className="text-xs text-slate-500">Budget</span>
                        <p className="font-medium">₹{campaign.budget.toLocaleString()}</p>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">₹{campaign.spent.toLocaleString()} spent</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500">Reach</span>
                        <p className="font-medium">{campaign.reach}</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500">Engagement</span>
                        <p className="font-medium">{campaign.engagement}</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500">Platforms</span>
                        <div className="flex items-center space-x-1 mt-1">
                          {campaign.platforms.slice(0, 3).map((platform, index) => (
                            <span key={index} className="text-xs bg-slate-100 px-2 py-1 rounded">
                              {platform}
                            </span>
                          ))}
                          {campaign.platforms.length > 3 && (
                            <span className="text-xs text-slate-500">+{campaign.platforms.length - 3}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
