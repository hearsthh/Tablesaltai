"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { MobileResponsiveTabs } from "@/components/mobile-responsive-tabs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Users,
  TrendingUp,
  Globe,
  Menu,
  ArrowLeft,
  Eye,
  Edit,
  Trash2,
  Download,
  Share2,
  Calendar,
  Zap,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Copy,
  Heart,
  MessageSquare,
  Send,
  Clock,
  CheckCircle,
  ImageIcon,
  Video,
  FileText,
} from "lucide-react"

export default function SocialMediaContentPage() {
  const router = useRouter()
  const [createPostOpen, setCreatePostOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedPosts, setSelectedPosts] = useState<string[]>([])

  // Initialize with default data to prevent undefined errors during prerendering
  const socialMediaPosts = [
    {
      id: "1",
      title: "Diwali Special Menu Announcement",
      platform: "Instagram",
      type: "Image Post",
      status: "published",
      scheduledDate: "Nov 5, 2024 6:00 PM",
      content:
        "✨ Celebrate Diwali with our special festive menu! ✨\n\nIndulge in traditional flavors with a modern twist. Our chef's special Diwali thali includes:\n🪔 Paneer Makhani\n🪔 Lamb Biryani\n🪔 Gulab Jamun\n🪔 And much more!\n\nBook your table now! 📞 +91 98765 43210\n\n#Diwali2024 #FestiveMenu #IndianCuisine #SpiceGarden #DiwaliSpecial #TraditionalFlavors #BookNow",
      hashtags: ["#Diwali2024", "#FestiveMenu", "#IndianCuisine", "#SpiceGarden"],
      engagement: { likes: 245, comments: 18, shares: 12 },
      reach: "3.2K",
    },
    {
      id: "2",
      title: "Weekend Brunch Promotion",
      platform: "Facebook",
      type: "Video Post",
      status: "scheduled",
      scheduledDate: "Nov 8, 2024 10:00 AM",
      content:
        "🌅 Start your weekend right with our amazing brunch menu!\n\nJoin us every Saturday and Sunday from 10 AM to 3 PM for:\n🥞 Fluffy pancakes\n🍳 Farm-fresh eggs\n🥓 Crispy bacon\n☕ Freshly brewed coffee\n\nSpecial weekend pricing: Just ₹599 per person!\n\n#WeekendBrunch #SaturdayMorning #SundayBrunch #FreshFood #WeekendSpecial #BrunchMenu #SpiceGarden",
      hashtags: ["#WeekendBrunch", "#SaturdayMorning", "#SundayBrunch"],
      engagement: { likes: 0, comments: 0, shares: 0 },
      reach: "0",
    },
    {
      id: "3",
      title: "Chef's Special Behind the Scenes",
      platform: "Instagram",
      type: "Reel",
      status: "draft",
      scheduledDate: "Nov 10, 2024 7:00 PM",
      content:
        "👨‍🍳 Watch our head chef create magic in the kitchen!\n\nToday's special: Butter Chicken with handmade naan 🍛\n\nEvery dish is prepared with love and the finest ingredients. Come taste the difference!\n\n#ChefSpecial #BehindTheScenes #ButterChicken #HandmadeNaan #FreshIngredients #KitchenMagic #SpiceGarden #ChefLife",
      hashtags: ["#ChefSpecial", "#BehindTheScenes", "#ButterChicken"],
      engagement: { likes: 0, comments: 0, shares: 0 },
      reach: "0",
    },
    {
      id: "4",
      title: "Customer Review Highlight",
      platform: "Twitter",
      type: "Text Post",
      status: "published",
      scheduledDate: "Nov 3, 2024 2:00 PM",
      content:
        "🌟 'Amazing food and incredible service! The ambiance is perfect for family dining. Will definitely be back!' - Sarah M.\n\nThank you for the wonderful review, Sarah! We're thrilled you enjoyed your experience. 🙏\n\n#CustomerReview #HappyCustomers #FamilyDining #ThankYou #SpiceGarden #AmazingFood #IncredibleService",
      hashtags: ["#CustomerReview", "#HappyCustomers", "#FamilyDining"],
      engagement: { likes: 67, comments: 8, shares: 15 },
      reach: "1.8K",
    },
  ]

  const contentTemplates = [
    {
      name: "Menu Item Showcase",
      description: "Highlight a specific dish with appetizing description",
      platforms: ["Instagram", "Facebook"],
      type: "Image Post",
    },
    {
      name: "Behind the Scenes",
      description: "Show kitchen preparation or staff at work",
      platforms: ["Instagram", "TikTok"],
      type: "Video/Reel",
    },
    {
      name: "Customer Testimonial",
      description: "Share positive customer reviews and feedback",
      platforms: ["Facebook", "Twitter", "LinkedIn"],
      type: "Text/Image Post",
    },
    {
      name: "Special Offer",
      description: "Promote discounts, deals, or special events",
      platforms: ["Instagram", "Facebook", "Twitter"],
      type: "Image Post",
    },
    {
      name: "Chef's Tip",
      description: "Share cooking tips or ingredient information",
      platforms: ["Instagram", "YouTube", "TikTok"],
      type: "Video/Carousel",
    },
  ]

  const handleGeneratePost = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setCreatePostOpen(false)
    }, 3000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-700"
      case "scheduled":
        return "bg-blue-100 text-blue-700"
      case "draft":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "scheduled":
        return <Clock className="w-4 h-4 text-blue-600" />
      case "draft":
        return <Edit className="w-4 h-4 text-gray-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return <Instagram className="w-4 h-4 text-pink-600" />
      case "facebook":
        return <Facebook className="w-4 h-4 text-blue-600" />
      case "twitter":
        return <Twitter className="w-4 h-4 text-sky-600" />
      case "youtube":
        return <Youtube className="w-4 h-4 text-red-600" />
      default:
        return <Globe className="w-4 h-4 text-gray-600" />
    }
  }

  const getTypeIcon = (type: string) => {
    if (type.includes("Video") || type.includes("Reel")) {
      return <Video className="w-4 h-4 text-purple-600" />
    } else if (type.includes("Image")) {
      return <ImageIcon className="w-4 h-4 text-green-600" />
    } else {
      return <FileText className="w-4 h-4 text-blue-600" />
    }
  }

  const handlePostSelect = (postId: string) => {
    setSelectedPosts((prev) => (prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]))
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
                  <Users className="w-4 h-4 mr-2" />
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  className="text-slate-900 font-medium rounded-md"
                  onClick={() => router.push("/marketing")}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Marketing
                </Button>
                <Button variant="ghost" className="text-slate-500 rounded-md">
                  <Users className="w-4 h-4 mr-2" />
                  Customers
                </Button>
                <Button variant="ghost" className="text-slate-500 rounded-md">
                  <Globe className="w-4 h-4 mr-2" />
                  Integrations
                </Button>
              </nav>
              <Button variant="ghost" size="icon" className="md:hidden rounded-md">
                <Menu className="w-5 h-5" />
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
              <h1 className="text-3xl font-bold text-slate-900">Social Media Content</h1>
              <p className="text-slate-600 mt-2">Create and manage AI-generated social media posts</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="flex items-center rounded-md border-slate-200 bg-transparent">
                <Calendar className="w-4 h-4 mr-2" />
                Content Calendar
              </Button>
              <Dialog open={createPostOpen} onOpenChange={setCreatePostOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center bg-slate-900 hover:bg-slate-800 rounded-md">
                    <Zap className="w-4 h-4 mr-2" />
                    Generate Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center">
                      <Zap className="w-5 h-5 mr-2" />
                      Generate Social Media Post
                    </DialogTitle>
                    <DialogDescription>
                      AI will create engaging social media content with captions and hashtags
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="post-platform">Platform</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="facebook">Facebook</SelectItem>
                            <SelectItem value="twitter">Twitter</SelectItem>
                            <SelectItem value="linkedin">LinkedIn</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="post-type">Content Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="image">Image Post</SelectItem>
                            <SelectItem value="video">Video Post</SelectItem>
                            <SelectItem value="carousel">Carousel</SelectItem>
                            <SelectItem value="story">Story</SelectItem>
                            <SelectItem value="reel">Reel</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="post-topic">Topic/Theme</Label>
                      <Input
                        id="post-topic"
                        placeholder="e.g., New menu item, Special offer, Behind the scenes"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="post-description">Description (Optional)</Label>
                      <Textarea
                        id="post-description"
                        placeholder="Provide additional context or specific details you want to include..."
                        className="mt-1"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label>Tone & Style</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {["Professional", "Casual", "Friendly", "Exciting", "Elegant", "Playful"].map((tone) => (
                          <div key={tone} className="flex items-center space-x-2">
                            <Checkbox id={tone} />
                            <Label htmlFor={tone} className="text-sm">
                              {tone}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="target-audience">Target Audience</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select audience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="families">Families</SelectItem>
                          <SelectItem value="young-professionals">Young Professionals</SelectItem>
                          <SelectItem value="food-enthusiasts">Food Enthusiasts</SelectItem>
                          <SelectItem value="couples">Couples</SelectItem>
                          <SelectItem value="tourists">Tourists</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="schedule-date">Schedule Date</Label>
                        <Input id="schedule-date" type="datetime-local" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="hashtag-count">Number of Hashtags</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select count" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 hashtags</SelectItem>
                            <SelectItem value="10">10 hashtags</SelectItem>
                            <SelectItem value="15">15 hashtags</SelectItem>
                            <SelectItem value="20">20 hashtags</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" onClick={() => setCreatePostOpen(false)} className="rounded-md">
                      Cancel
                    </Button>
                    <Button
                      onClick={handleGeneratePost}
                      disabled={isGenerating}
                      className="bg-slate-900 hover:bg-slate-800 rounded-md"
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Generate Post
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <Tabs defaultValue="posts" className="space-y-6">
          <MobileResponsiveTabs>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="posts">All Posts</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
          </MobileResponsiveTabs>

          <TabsContent value="posts" className="space-y-6">
            {/* Bulk Actions */}
            {selectedPosts.length > 0 && (
              <Card className="border-slate-200">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <span className="text-sm text-slate-600">
                      {selectedPosts.length} post{selectedPosts.length > 1 ? "s" : ""} selected
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" className="rounded-md border-slate-200 bg-transparent">
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule
                      </Button>
                      <Button size="sm" variant="outline" className="rounded-md border-slate-200 bg-transparent">
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicate
                      </Button>
                      <Button size="sm" variant="outline" className="rounded-md border-slate-200 bg-transparent">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50 rounded-md bg-transparent"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Posts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {socialMediaPosts && socialMediaPosts.length > 0 ? (
                socialMediaPosts.map((post) => (
                  <Card key={post.id} className="border-slate-200 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            checked={selectedPosts.includes(post.id)}
                            onCheckedChange={() => handlePostSelect(post.id)}
                          />
                          <div>
                            <CardTitle className="text-lg">{post.title}</CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                              {getPlatformIcon(post.platform)}
                              <span className="text-sm text-slate-600">{post.platform}</span>
                              <span className="text-slate-400">•</span>
                              {getTypeIcon(post.type)}
                              <span className="text-sm text-slate-600">{post.type}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(post.status)}
                          <Badge className={getStatusColor(post.status)} variant="secondary">
                            {post.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <p className="text-sm text-slate-700 line-clamp-4">{post.content}</p>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {post.hashtags && post.hashtags.length > 0
                          ? post.hashtags.slice(0, 3).map((hashtag, index) => (
                              <Badge key={index} variant="outline" className="text-xs border-slate-200">
                                {hashtag}
                              </Badge>
                            ))
                          : null}
                        {post.hashtags && post.hashtags.length > 3 && (
                          <Badge variant="outline" className="text-xs border-slate-200">
                            +{post.hashtags.length - 3} more
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm text-slate-600">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>{post.engagement?.likes || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="w-4 h-4" />
                            <span>{post.engagement?.comments || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Share2 className="w-4 h-4" />
                            <span>{post.engagement?.shares || 0}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{post.reach || "0"}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <span className="text-xs text-slate-500">{post.scheduledDate}</span>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="ghost" className="rounded-md">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="rounded-md">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="rounded-md">
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50 rounded-md">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-slate-500">No social media posts found.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contentTemplates && contentTemplates.length > 0 ? (
                contentTemplates.map((template, index) => (
                  <Card key={index} className="border-slate-200 hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <span className="text-sm font-medium text-slate-700">Platforms:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {template.platforms && template.platforms.length > 0
                            ? template.platforms.map((platform, platformIndex) => (
                                <Badge key={platformIndex} variant="outline" className="text-xs border-slate-200">
                                  {platform}
                                </Badge>
                              ))
                            : null}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-slate-700">Type:</span>
                        <Badge className="ml-2 bg-blue-100 text-blue-700" variant="secondary">
                          {template.type}
                        </Badge>
                      </div>
                      <Button className="w-full bg-slate-900 hover:bg-slate-800 rounded-md">
                        <Zap className="w-4 h-4 mr-2" />
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-slate-500">No templates available.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-slate-700">Total Reach</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold text-slate-900">15.2K</div>
                    <div className="text-sm text-green-600">+18% from last month</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-pink-600" />
                    <span className="text-sm font-medium text-slate-700">Engagement</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold text-slate-900">4.2%</div>
                    <div className="text-sm text-green-600">+0.8% from last month</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Send className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-slate-700">Posts Published</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold text-slate-900">24</div>
                    <div className="text-sm text-green-600">+6 from last month</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-slate-700">Best Performing</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-lg font-bold text-slate-900">Instagram</div>
                    <div className="text-sm text-slate-600">6.8% avg engagement</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Platform Performance</CardTitle>
                <CardDescription>Engagement metrics across different social media platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { platform: "Instagram", posts: 12, reach: "8.5K", engagement: "6.8%", color: "bg-pink-500" },
                    { platform: "Facebook", posts: 8, reach: "4.2K", engagement: "3.1%", color: "bg-blue-500" },
                    { platform: "Twitter", posts: 4, reach: "2.5K", engagement: "2.3%", color: "bg-sky-500" },
                  ].map((platform, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${platform.color}`}></div>
                        <span className="font-medium text-slate-900">{platform.platform}</span>
                      </div>
                      <div className="flex items-center space-x-6 text-sm text-slate-600">
                        <div>
                          <span className="font-medium">{platform.posts}</span> posts
                        </div>
                        <div>
                          <span className="font-medium">{platform.reach}</span> reach
                        </div>
                        <div>
                          <span className="font-medium">{platform.engagement}</span> engagement
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
