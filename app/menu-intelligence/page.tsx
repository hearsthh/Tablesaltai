"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useMenuIntelligence } from "@/hooks/use-menu-intelligence"
import { MenuHealthScorecard } from "@/components/menu-intelligence/menu-health-scorecard"
import { MenuItemCard } from "@/components/menu-intelligence/menu-item-card"
import { ComboSuggestions } from "@/components/menu-intelligence/combo-suggestions"
import { OptimizationActions } from "@/components/menu-intelligence/optimization-actions"
import {
  Search,
  Filter,
  Grid3X3,
  List,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Star,
  AlertTriangle,
  Zap,
  BarChart3,
  Settings,
} from "lucide-react"

export default function MenuIntelligencePage() {
  const {
    data,
    loading,
    error,
    loadData,
    generateAIDescription,
    updateItemPrice,
    removeItem,
    createCombo,
    executeOptimizationAction,
  } = useMenuIntelligence()

  const [activeTab, setActiveTab] = useState("overview")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [performanceFilter, setPerformanceFilter] = useState("all")
  const [showOnlyActionable, setShowOnlyActionable] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-3 py-4 pb-20">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-3 py-4 pb-20">
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Menu Intelligence</h2>
            <p className="text-gray-600 mb-4">{error || "Something went wrong"}</p>
            <Button onClick={loadData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Filter items based on search and filters
  const filteredItems = data.items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter

    const matchesPerformance = performanceFilter === "all" || item.performanceTier === performanceFilter

    const matchesActionable =
      !showOnlyActionable ||
      item.missingDescription ||
      item.missingImage ||
      item.suggestRepricing ||
      item.suggestRemoval ||
      item.suggestCombo ||
      item.risingStar

    return matchesSearch && matchesCategory && matchesPerformance && matchesActionable
  })

  // Group items by performance tier
  const topPerformers = filteredItems.filter((item) => item.performanceTier === "top")
  const averagePerformers = filteredItems.filter((item) => item.performanceTier === "average")
  const underperformers = filteredItems.filter((item) => item.performanceTier === "low")
  const needsAttention = filteredItems.filter(
    (item) => item.missingDescription || item.missingImage || item.suggestRepricing || item.suggestRemoval,
  )

  // Get unique categories
  const categories = [...new Set(data.items.map((item) => item.category))]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-3 py-4 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              Menu Intelligence
            </h1>
            <p className="text-sm text-gray-600">AI-powered menu analysis and optimization</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={loadData}>
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </Button>
            <Button size="sm">
              <Settings className="w-4 h-4 mr-1" />
              Settings
            </Button>
          </div>
        </div>

        {/* Menu Health Scorecard */}
        <MenuHealthScorecard healthScore={data.healthScore} lastEvaluated={data.lastEvaluated} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">🧾 Overview</TabsTrigger>
            <TabsTrigger value="insights">📈 Item Insights</TabsTrigger>
            <TabsTrigger value="combos">🍱 Combos</TabsTrigger>
            <TabsTrigger value="actions">🔧 Actions</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Top Performers</p>
                      <p className="text-lg font-semibold text-green-600">{topPerformers.length}</p>
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Needs Attention</p>
                      <p className="text-lg font-semibold text-orange-600">{needsAttention.length}</p>
                    </div>
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Combo Opportunities</p>
                      <p className="text-lg font-semibold text-blue-600">{data.comboSuggestions.length}</p>
                    </div>
                    <Star className="w-5 h-5 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Optimization Actions</p>
                      <p className="text-lg font-semibold text-purple-600">{data.optimizationActions.length}</p>
                    </div>
                    <Zap className="w-5 h-5 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Actions Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <OptimizationActions
                actions={data.optimizationActions.slice(0, 3)}
                onExecuteAction={executeOptimizationAction}
              />
              <ComboSuggestions suggestions={data.comboSuggestions.slice(0, 2)} onCreateCombo={createCombo} />
            </div>
          </TabsContent>

          {/* Item Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search menu items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={performanceFilter} onValueChange={setPerformanceFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="All Performance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Performance</SelectItem>
                      <SelectItem value="top">Top Performers</SelectItem>
                      <SelectItem value="average">Average</SelectItem>
                      <SelectItem value="low">Underperforming</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant={showOnlyActionable ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowOnlyActionable(!showOnlyActionable)}
                    >
                      <Filter className="w-4 h-4 mr-1" />
                      Actionable Only
                    </Button>

                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Item Groups */}
            {topPerformers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-green-600" />✅ Top Performing Items
                    <Badge variant="outline" className="ml-2">
                      {topPerformers.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-3"}>
                    {topPerformers.map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        onGenerateDescription={generateAIDescription}
                        onUpdatePrice={updateItemPrice}
                        onRemoveItem={removeItem}
                        onCreateCombo={createCombo}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {needsAttention.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2 text-orange-600" />
                    ⚠️ Needs Attention
                    <Badge variant="outline" className="ml-2">
                      {needsAttention.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-3"}>
                    {needsAttention.map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        onGenerateDescription={generateAIDescription}
                        onUpdatePrice={updateItemPrice}
                        onRemoveItem={removeItem}
                        onCreateCombo={createCombo}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {underperformers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <TrendingDown className="w-4 h-4 mr-2 text-red-600" />🗑 Suggested for Review
                    <Badge variant="outline" className="ml-2">
                      {underperformers.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-3"}>
                    {underperformers.map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        onGenerateDescription={generateAIDescription}
                        onUpdatePrice={updateItemPrice}
                        onRemoveItem={removeItem}
                        onCreateCombo={createCombo}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {averagePerformers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <Star className="w-4 h-4 mr-2 text-yellow-600" />⭐ Average Performers
                    <Badge variant="outline" className="ml-2">
                      {averagePerformers.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-3"}>
                    {averagePerformers.map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        onGenerateDescription={generateAIDescription}
                        onUpdatePrice={updateItemPrice}
                        onRemoveItem={removeItem}
                        onCreateCombo={createCombo}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {filteredItems.length === 0 && (
              <Card>
                <CardContent className="p-8">
                  <div className="text-center">
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
                    <p className="text-gray-600">Try adjusting your search or filters</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Combos Tab */}
          <TabsContent value="combos" className="space-y-6">
            <ComboSuggestions suggestions={data.comboSuggestions} onCreateCombo={createCombo} />
          </TabsContent>

          {/* Actions Tab */}
          <TabsContent value="actions" className="space-y-6">
            <OptimizationActions actions={data.optimizationActions} onExecuteAction={executeOptimizationAction} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
