"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  Megaphone,
  Users,
  Utensils,
  Star,
  Building,
  Store,
  Target,
  Sparkles,
  Clock,
  TrendingUp,
  Search,
  Plus,
  ImageIcon,
  Type,
  Wand2,
  Save,
  Calendar,
  Share2,
} from "lucide-react"
import { ContentBlock } from "@/components/ai-content-generator/content-block"
import {
  CONTENT_CATEGORIES,
  CONTENT_TONES,
  type ContentCategory,
  type GeneratedContent,
  type ContentTemplate,
  type ContentGenerationTrigger,
} from "@/lib/types/ai-content-generator"

const categoryIcons = {
  campaign: Megaphone,
  crm: Users,
  menu: Utensils,
  review: Star,
  profile: Building,
  in_store: Store,
  strategy: Target,
}

export default function AIContentGeneratorPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("generator")
  const [selectedCategory, setSelectedCategory] = useState<ContentCategory>("campaign")
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([])
  const [contentHistory, setContentHistory] = useState<GeneratedContent[]>([])
  const [templates, setTemplates] = useState<ContentTemplate[]>([])
  const [triggers, setTriggers] = useState<ContentGenerationTrigger[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [stats, setStats] = useState({
    totalGenerated: 0,
    approved: 0,
    used: 0,
    avgPerformance: 0,
  })

  useEffect(() => {
    loadContentHistory()
    loadTemplates()
    loadTriggers()
    loadStats()
  }, [])

  const loadContentHistory = async () => {
    try {
      const response = await fetch("/api/ai/content-generator/history")
      if (response.ok) {
        const data = await response.json()
        setContentHistory(data.content || [])
      }
    } catch (error) {
      console.error("Error loading content history:", error)
    }
  }

  const loadTemplates = async () => {
    try {
      const response = await fetch("/api/ai/content-generator/templates")
      if (response.ok) {
        const data = await response.json()
        setTemplates(data.templates || [])
      }
    } catch (error) {
      console.error("Error loading templates:", error)
    }
  }

  const loadTriggers = async () => {
    try {
      const response = await fetch("/api/ai/content-generator/triggers")
      if (response.ok) {
        const data = await response.json()
        setTriggers(data.triggers || [])
      }
    } catch (error) {
      console.error("Error loading triggers:", error)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch("/api/ai/content-generator/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats || stats)
      }
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }

  const handleContentGenerated = (content: GeneratedContent) => {
    setGeneratedContent((prev) => [content, ...prev])
    toast({
      title: "Content Generated!",
      description: `${content.contentType} has been generated successfully.`,
    })
  }

  const handleContentSaved = async (content: GeneratedContent) => {
    try {
      const response = await fetch("/api/ai/content-generator/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      })

      if (response.ok) {
        await loadContentHistory()
        await loadStats()
        toast({
          title: "Content Saved!",
          description: "Content has been saved to your library.",
        })
      }
    } catch (error) {
      console.error("Error saving content:", error)
      toast({
        title: "Error",
        description: "Failed to save content.",
        variant: "destructive",
      })
    }
  }

  const filteredHistory = contentHistory.filter((content) => {
    const matchesSearch =
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.outputText?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || content.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Wand2 className="h-8 w-8 text-purple-600" />
            AI Content Generator
          </h1>
          <p className="text-muted-foreground mt-2">Generate marketing, menu, review, and brand content with AI</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            {stats.totalGenerated} Generated
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {stats.avgPerformance}% Avg Performance
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="generator" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            Generator
          </TabsTrigger>
          <TabsTrigger value="library" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Library
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Automation
          </TabsTrigger>
        </TabsList>

        {/* Content Generator Tab */}
        <TabsContent value="generator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Category Selection */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Content Categories</CardTitle>
                  <CardDescription>Choose what type of content to generate</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.entries(CONTENT_CATEGORIES).map(([key, category]) => {
                    const Icon = categoryIcons[key as ContentCategory]
                    return (
                      <Button
                        key={key}
                        variant={selectedCategory === key ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setSelectedCategory(key as ContentCategory)}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {category.label}
                      </Button>
                    )
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Content Generation Area */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {(() => {
                      const Icon = categoryIcons[selectedCategory]
                      return <Icon className="h-5 w-5" />
                    })()}
                    {CONTENT_CATEGORIES[selectedCategory].label}
                  </CardTitle>
                  <CardDescription>{CONTENT_CATEGORIES[selectedCategory].description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {CONTENT_CATEGORIES[selectedCategory].contentTypes.map((contentType) => (
                    <ContentBlock
                      key={contentType}
                      category={selectedCategory}
                      contentType={contentType}
                      onContentGenerated={handleContentGenerated}
                      onContentSaved={handleContentSaved}
                    />
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Generated Content */}
          {generatedContent.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recently Generated</CardTitle>
                <CardDescription>Content generated in this session</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {generatedContent.slice(0, 5).map((content) => (
                    <div key={content.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{content.category}</Badge>
                          <Badge variant="secondary">{content.contentType}</Badge>
                          <Badge variant={content.status === "approved" ? "default" : "outline"}>
                            {content.status}
                          </Badge>
                        </div>
                        <h4 className="font-medium">{content.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{content.outputText?.substring(0, 150)}...</p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button size="sm" variant="outline">
                          <Share2 className="h-3 w-3 mr-1" />
                          Use
                        </Button>
                        <Button size="sm" variant="outline">
                          <Calendar className="h-3 w-3 mr-1" />
                          Schedule
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Content Library Tab */}
        <TabsContent value="library" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="used">Used</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{filteredHistory.length} items</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHistory.map((content) => (
              <Card key={content.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {content.category}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {content.contentType}
                      </Badge>
                    </div>
                    <Badge variant={content.status === "approved" ? "default" : "outline"} className="text-xs">
                      {content.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-base">{content.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{content.outputText}</p>
                  {content.outputMediaUrls.length > 0 && (
                    <div className="flex items-center gap-1 mb-4">
                      <ImageIcon className="h-3 w-3" />
                      <span className="text-xs text-muted-foreground">{content.outputMediaUrls.length} image(s)</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Used {content.usageCount} times</span>
                    <span>{new Date(content.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <Type className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <Share2 className="h-3 w-3 mr-1" />
                      Use
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredHistory.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No content found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? "Try adjusting your search terms" : "Generate some content to get started"}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Content Templates</h2>
              <p className="text-muted-foreground">Reusable templates for consistent content generation</p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{template.category}</Badge>
                    <Badge variant="secondary">Used {template.usageCount}x</Badge>
                  </div>
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Content Type</Label>
                      <p className="text-sm">{template.contentType}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Default Tone</Label>
                      <p className="text-sm">{CONTENT_TONES[template.defaultTone].label}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Success Rate</Label>
                      <p className="text-sm">{template.successRate}%</p>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        Use Template
                      </Button>
                      <Button size="sm" variant="ghost">
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Automation Tab */}
        <TabsContent value="automation" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Content Automation</h2>
              <p className="text-muted-foreground">Automatic content generation triggers and rules</p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Trigger
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {triggers.map((trigger) => (
              <Card key={trigger.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{trigger.name}</CardTitle>
                    <Switch checked={trigger.isActive} />
                  </div>
                  <CardDescription>{trigger.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Trigger Type</Label>
                      <p className="text-sm capitalize">{trigger.triggerType.replace("_", " ")}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Content Categories</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {trigger.contentCategories.map((category) => (
                          <Badge key={category} variant="outline" className="text-xs">
                            {CONTENT_CATEGORIES[category].label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Executed {trigger.totalExecutions} times</span>
                      <span>
                        Success: {trigger.successfulExecutions}/{trigger.totalExecutions}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        Configure
                      </Button>
                      <Button size="sm" variant="ghost">
                        Test
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
