"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Users, TrendingUp, Globe, Menu, ArrowLeft, FileText, Eye, Edit, Trash2, Zap, Search } from "lucide-react"

export default function BlogContentPage() {
  const router = useRouter()
  const [createArticleOpen, setCreateArticleOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const blogArticles = [
    {
      id: "1",
      title: "10 Health Benefits of Indian Spices",
      status: "published",
      publishDate: "Nov 1, 2024",
      readTime: "5 min read",
      views: 1250,
      excerpt: "Discover the amazing health benefits of traditional Indian spices used in our authentic dishes...",
    },
    {
      id: "2",
      title: "The Art of Making Perfect Biryani",
      status: "draft",
      publishDate: "Nov 8, 2024",
      readTime: "7 min read",
      views: 0,
      excerpt: "Learn the secrets behind our chef's award-winning biryani recipe and cooking techniques...",
    },
    {
      id: "3",
      title: "Vegetarian Delights: Plant-Based Indian Cuisine",
      status: "scheduled",
      publishDate: "Nov 15, 2024",
      readTime: "6 min read",
      views: 0,
      excerpt: "Explore our extensive vegetarian menu and the rich tradition of plant-based Indian cooking...",
    },
  ]

  const handleGenerateArticle = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setCreateArticleOpen(false)
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
              <h1 className="text-3xl font-bold text-slate-900">Blog Articles</h1>
              <p className="text-slate-600 mt-2">Create SEO-optimized blog content for your restaurant</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Dialog open={createArticleOpen} onOpenChange={setCreateArticleOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center bg-slate-900 hover:bg-slate-800 rounded-md">
                    <Zap className="w-4 h-4 mr-2" />
                    Generate Article
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Generate Blog Article
                    </DialogTitle>
                    <DialogDescription>AI will create SEO-optimized blog content for your restaurant</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="article-topic">Article Topic</Label>
                      <Input id="article-topic" placeholder="e.g., Health benefits of Indian spices" />
                    </div>
                    <div>
                      <Label htmlFor="article-keywords">Target Keywords</Label>
                      <Input id="article-keywords" placeholder="e.g., Indian spices, healthy food, turmeric" />
                    </div>
                    <div>
                      <Label htmlFor="article-outline">Article Outline (Optional)</Label>
                      <Textarea id="article-outline" placeholder="Provide key points you want to cover..." rows={4} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCreateArticleOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleGenerateArticle} disabled={isGenerating}>
                      {isGenerating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Generate Article
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Articles List */}
        <Card className="border-slate-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Blog Articles</CardTitle>
                <CardDescription>Manage your restaurant's blog content</CardDescription>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <Input placeholder="Search articles..." className="pl-10 w-64" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {blogArticles.map((article) => (
                <div key={article.id} className="p-6 border border-slate-200 rounded-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-slate-900">{article.title}</h3>
                        <Badge className={getStatusColor(article.status)} variant="secondary">
                          {article.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{article.excerpt}</p>
                      <div className="flex items-center space-x-4 text-sm text-slate-500">
                        <span>{article.publishDate}</span>
                        <span>•</span>
                        <span>{article.readTime}</span>
                        {article.status === "published" && (
                          <>
                            <span>•</span>
                            <span>{article.views} views</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
