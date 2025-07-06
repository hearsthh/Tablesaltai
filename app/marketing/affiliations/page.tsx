"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import {
  ArrowLeft,
  Search,
  MapPin,
  Users,
  Mail,
  Phone,
  Globe,
  Instagram,
  Star,
  Heart,
  MessageCircle,
  ExternalLink,
  RefreshCw,
} from "lucide-react"
import { Navigation } from "@/components/navigation"

interface Affiliation {
  id: string
  name: string
  type: "influencer_group" | "business_group" | "social_community" | "event_organizer"
  category: string
  location: string
  pincode: string
  relevance_score: number
  contact_info: {
    email?: string
    phone?: string
    website?: string
    instagram?: string
    followers?: number
  }
  engagement_potential: "high" | "medium" | "low"
  collaboration_type: string[]
  estimated_reach: number
  avg_engagement_rate: number
  description: string
  saved?: boolean
  contacted?: boolean
}

export default function AffiliationsPage() {
  const router = useRouter()
  const [affiliations, setAffiliations] = useState<Affiliation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchLocation, setSearchLocation] = useState("")
  const [pincode, setPincode] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [sortBy, setSortBy] = useState("relevance")

  useEffect(() => {
    fetchAffiliations()
  }, [])

  const fetchAffiliations = async (location?: string, pin?: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (location) params.append("city", location)
      if (pin) params.append("pincode", pin)

      const response = await fetch(`/api/marketing/affiliations?${params.toString()}`)
      const data = await response.json()

      if (data.affiliations) {
        setAffiliations(data.affiliations)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load affiliations",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    fetchAffiliations(searchLocation, pincode)
  }

  const handleContact = async (affiliationId: string) => {
    try {
      const response = await fetch("/api/marketing/affiliations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ affiliationId, action: "contact" }),
      })

      const data = await response.json()

      if (data.success) {
        setAffiliations((prev) => prev.map((aff) => (aff.id === affiliationId ? { ...aff, contacted: true } : aff)))
        toast({
          title: "Contact Request Sent",
          description: "Your collaboration request has been sent successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send contact request",
        variant: "destructive",
      })
    }
  }

  const handleSave = async (affiliationId: string) => {
    try {
      const response = await fetch("/api/marketing/affiliations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ affiliationId, action: "save" }),
      })

      const data = await response.json()

      if (data.success) {
        setAffiliations((prev) => prev.map((aff) => (aff.id === affiliationId ? { ...aff, saved: !aff.saved } : aff)))
        toast({
          title: "Affiliation Saved",
          description: "Added to your saved affiliations list",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save affiliation",
        variant: "destructive",
      })
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "influencer_group":
        return "bg-pink-100 text-pink-700"
      case "business_group":
        return "bg-blue-100 text-blue-700"
      case "social_community":
        return "bg-green-100 text-green-700"
      case "event_organizer":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getEngagementColor = (potential: string) => {
    switch (potential) {
      case "high":
        return "bg-green-100 text-green-700"
      case "medium":
        return "bg-yellow-100 text-yellow-700"
      case "low":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const filteredAffiliations = affiliations
    .filter((aff) => filterType === "all" || aff.type === filterType)
    .sort((a, b) => {
      switch (sortBy) {
        case "relevance":
          return b.relevance_score - a.relevance_score
        case "reach":
          return b.estimated_reach - a.estimated_reach
        case "engagement":
          return b.avg_engagement_rate - a.avg_engagement_rate
        default:
          return 0
      }
    })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/marketing")}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketing Hub
            </Button>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Marketing Affiliations</h1>
            <p className="text-gray-600 mt-2">
              Discover local influencers, communities, and partners for collaboration
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <Card className="border-0 shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Find Local Affiliations
            </CardTitle>
            <CardDescription>Search for marketing partners in your area</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="location">City/Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., Delhi, Mumbai"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  placeholder="e.g., 110001"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                />
              </div>
              <div>
                <Label>Filter by Type</Label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Types</option>
                  <option value="influencer_group">Influencer Groups</option>
                  <option value="business_group">Business Groups</option>
                  <option value="social_community">Social Communities</option>
                  <option value="event_organizer">Event Organizers</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleSearch} className="w-full bg-blue-600 hover:bg-blue-700">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4">
                <Label>Sort by:</Label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="p-1 border border-gray-300 rounded text-sm"
                >
                  <option value="relevance">Relevance Score</option>
                  <option value="reach">Estimated Reach</option>
                  <option value="engagement">Engagement Rate</option>
                </select>
              </div>
              <Button variant="outline" size="sm" onClick={() => fetchAffiliations()} className="bg-white">
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Found {filteredAffiliations.length} Affiliations</h2>
              <div className="text-sm text-gray-500">Showing results for {searchLocation || "Delhi"} area</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredAffiliations.map((affiliation) => (
                <Card key={affiliation.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <CardTitle className="text-lg">{affiliation.name}</CardTitle>
                          <Badge className={getTypeColor(affiliation.type)} variant="secondary">
                            {affiliation.type.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{affiliation.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4" />
                            <span>{affiliation.relevance_score}% match</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSave(affiliation.id)}
                        className={affiliation.saved ? "text-red-600" : "text-gray-400"}
                      >
                        <Heart className={`w-4 h-4 ${affiliation.saved ? "fill-current" : ""}`} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{affiliation.description}</p>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-2 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-900">
                          {affiliation.estimated_reach > 1000
                            ? `${(affiliation.estimated_reach / 1000).toFixed(1)}K`
                            : affiliation.estimated_reach}
                        </div>
                        <div className="text-xs text-blue-700">Reach</div>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-900">{affiliation.avg_engagement_rate}%</div>
                        <div className="text-xs text-green-700">Engagement</div>
                      </div>
                      <div className="text-center p-2 bg-purple-50 rounded-lg">
                        <Badge className={getEngagementColor(affiliation.engagement_potential)} variant="secondary">
                          {affiliation.engagement_potential}
                        </Badge>
                        <div className="text-xs text-purple-700 mt-1">Potential</div>
                      </div>
                    </div>

                    {/* Collaboration Types */}
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Collaboration Types:</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {affiliation.collaboration_type.map((type, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {type.replace("_", " ")}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center space-x-3">
                        {affiliation.contact_info.email && (
                          <Button variant="ghost" size="sm" className="p-1">
                            <Mail className="w-4 h-4 text-gray-500" />
                          </Button>
                        )}
                        {affiliation.contact_info.phone && (
                          <Button variant="ghost" size="sm" className="p-1">
                            <Phone className="w-4 h-4 text-gray-500" />
                          </Button>
                        )}
                        {affiliation.contact_info.website && (
                          <Button variant="ghost" size="sm" className="p-1">
                            <Globe className="w-4 h-4 text-gray-500" />
                          </Button>
                        )}
                        {affiliation.contact_info.instagram && (
                          <Button variant="ghost" size="sm" className="p-1">
                            <Instagram className="w-4 h-4 text-gray-500" />
                          </Button>
                        )}
                        {affiliation.contact_info.followers && (
                          <div className="text-xs text-gray-500">
                            {affiliation.contact_info.followers.toLocaleString()} followers
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white"
                          onClick={() => window.open(affiliation.contact_info.website || "#", "_blank")}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleContact(affiliation.id)}
                          disabled={affiliation.contacted}
                          className={
                            affiliation.contacted ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
                          }
                        >
                          {affiliation.contacted ? (
                            <>
                              <MessageCircle className="w-3 h-3 mr-1" />
                              Contacted
                            </>
                          ) : (
                            <>
                              <MessageCircle className="w-3 h-3 mr-1" />
                              Contact
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredAffiliations.length === 0 && (
              <Card className="border-0 shadow-sm border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Users className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Affiliations Found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search criteria or location to find more marketing partners
                  </p>
                  <Button
                    onClick={() => fetchAffiliations("Delhi", "110001")}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Search Delhi Area
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
