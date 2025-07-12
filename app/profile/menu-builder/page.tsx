"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Grid3X3,
  List,
  Download,
  Upload,
  Zap,
  DollarSign,
  Eye,
  Star,
  Clock,
  ChefHat,
  Utensils,
  Leaf,
  Flame,
  Snowflake,
  ImageIcon,
  Save,
  Share,
  Printer,
  Smartphone,
  Monitor,
  Layout,
  RefreshCw,
  Lightbulb,
  BarChart3,
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category_id: string
  is_available: boolean
  dietary_info?: string[]
  prep_time?: number
  calories?: number
  image_url?: string
  popularity_score?: number
  profit_margin?: number
}

interface MenuCategory {
  id: string
  name: string
  description: string
  display_order: number
  items: MenuItem[]
}

interface MenuAnalytics {
  totalItems: number
  totalCategories: number
  averagePrice: number
  popularItems: MenuItem[]
  revenueByCategory: { [key: string]: number }
  profitMargins: { [key: string]: number }
}

export default function MenuBuilderPage() {
  const [activeTab, setActiveTab] = useState("menu")
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [analytics, setAnalytics] = useState<MenuAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [showItemDialog, setShowItemDialog] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast: useToastHook } = useToast()
  const isOnboarding = searchParams.get("onboarding") === "true"

  // State management
  // const [activeTab, setActiveTab] = useState("builder")
  // const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  // const [selectedCategory, setSelectedCategory] = useState<string>("all")
  // const [searchQuery, setSearchQuery] = useState("")
  const [isGeneratingMenu, setIsGeneratingMenu] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showAddItemDialog, setShowAddItemDialog] = useState(false)
  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false)
  // const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null)
  const [hasMenuData, setHasMenuData] = useState(false)
  const [showAIFeatures, setShowAIFeatures] = useState(false)

  // Form states
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: "",
    description: "",
    price: 0,
    category_id: "",
    is_available: true,
  })

  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    displayOrder: 0,
    isActive: true,
  })

  // Mock data
  // const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([
  //   {
  //     id: "appetizers",
  //     name: "Appetizers",
  //     description: "Start your meal with our delicious appetizers",
  //     displayOrder: 1,
  //     isActive: true,
  //     items: [
  //       {
  //         id: "bruschetta",
  //         name: "Classic Bruschetta",
  //         description: "Toasted bread topped with fresh tomatoes, basil, and garlic",
  //         price: 12.99,
  //         category: "appetizers",
  //         image: "/placeholder.svg?height=200&width=300",
  //         isVegetarian: true,
  //         isPopular: true,
  //         availability: "available",
  //         preparationTime: 10,
  //         nutritionInfo: { calories: 180, protein: 6, carbs: 25, fat: 8 },
  //         tags: ["fresh", "italian", "classic"],
  //       },
  //       {
  //         id: "calamari",
  //         name: "Crispy Calamari",
  //         description: "Golden fried squid rings served with marinara sauce",
  //         price: 15.99,
  //         category: "appetizers",
  //         image: "/placeholder.svg?height=200&width=300",
  //         availability: "available",
  //         preparationTime: 12,
  //         nutritionInfo: { calories: 320, protein: 18, carbs: 22, fat: 18 },
  //         tags: ["seafood", "crispy", "popular"],
  //       },
  //     ],
  //   },
  //   {
  //     id: "mains",
  //     name: "Main Courses",
  //     description: "Our signature main dishes",
  //     displayOrder: 2,
  //     isActive: true,
  //     items: [
  //       {
  //         id: "pasta-carbonara",
  //         name: "Pasta Carbonara",
  //         description: "Creamy pasta with pancetta, eggs, and parmesan cheese",
  //         price: 18.99,
  //         category: "mains",
  //         image: "/placeholder.svg?height=200&width=300",
  //         isPopular: true,
  //         availability: "available",
  //         preparationTime: 15,
  //         nutritionInfo: { calories: 580, protein: 24, carbs: 65, fat: 28 },
  //         tags: ["pasta", "creamy", "italian"],
  //       },
  //       {
  //         id: "grilled-salmon",
  //         name: "Grilled Atlantic Salmon",
  //         description: "Fresh salmon fillet with lemon herb butter and seasonal vegetables",
  //         price: 26.99,
  //         category: "mains",
  //         image: "/placeholder.svg?height=200&width=300",
  //         isGlutenFree: true,
  //         availability: "available",
  //         preparationTime: 20,
  //         nutritionInfo: { calories: 420, protein: 35, carbs: 12, fat: 26 },
  //         tags: ["seafood", "healthy", "grilled"],
  //       },
  //     ],
  //   },
  //   {
  //     id: "desserts",
  //     name: "Desserts",
  //     description: "Sweet endings to your meal",
  //     displayOrder: 3,
  //     isActive: true,
  //     items: [
  //       {
  //         id: "tiramisu",
  //         name: "Classic Tiramisu",
  //         description: "Traditional Italian dessert with coffee-soaked ladyfingers and mascarpone",
  //         price: 8.99,
  //         category: "desserts",
  //         image: "/placeholder.svg?height=200&width=300",
  //         isVegetarian: true,
  //         isPopular: true,
  //         availability: "available",
  //         preparationTime: 5,
  //         nutritionInfo: { calories: 380, protein: 8, carbs: 35, fat: 22 },
  //         tags: ["italian", "coffee", "classic"],
  //       },
  //     ],
  //   },
  // ])

  // const [menuAnalytics] = useState<MenuAnalytics>({
  //   totalItems: 5,
  //   totalCategories: 3,
  //   popularItems: [
  //     {
  //       id: "pasta-carbonara",
  //       name: "Pasta Carbonara",
  //       description: "Creamy pasta with pancetta, eggs, and parmesan cheese",
  //       price: 18.99,
  //       category: "mains",
  //       isPopular: true,
  //       availability: "available",
  //     },
  //     {
  //       id: "bruschetta",
  //       name: "Classic Bruschetta",
  //       description: "Toasted bread topped with fresh tomatoes, basil, and garlic",
  //       price: 12.99,
  //       category: "appetizers",
  //       isVegetarian: true,
  //       isPopular: true,
  //       availability: "available",
  //     },
  //   ],
  //   revenueByCategory: [
  //     { category: "Main Courses", revenue: 15420, percentage: 65 },
  //     { category: "Appetizers", revenue: 5680, percentage: 24 },
  //     { category: "Desserts", revenue: 2600, percentage: 11 },
  //   ],
  //   performanceMetrics: {
  //     avgRating: 4.6,
  //     totalOrders: 1247,
  //     revenueGrowth: 12.5,
  //     customerFavorites: 8,
  //   },
  //   recommendations: [
  //     {
  //       id: "rec-1",
  //       type: "pricing",
  //       title: "Optimize Appetizer Pricing",
  //       description: "Consider increasing appetizer prices by 8-12% based on demand analysis",
  //       impact: "Medium",
  //       effort: "Low",
  //     },
  //     {
  //       id: "rec-2",
  //       type: "description",
  //       title: "Enhance Item Descriptions",
  //       description: "Add more sensory details to main course descriptions to increase appeal",
  //       impact: "High",
  //       effort: "Low",
  //     },
  //     {
  //       id: "rec-3",
  //       type: "category",
  //       title: "Add Beverage Category",
  //       description: "Create a dedicated beverage section to increase average order value",
  //       impact: "High",
  //       effort: "Medium",
  //     },
  //   ],
  // })

  const restaurantId = "550e8400-e29b-41d4-a716-446655440000"

  useEffect(() => {
    loadMenuData()
  }, [])

  const loadMenuData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/menu/dashboard?restaurantId=${restaurantId}`)
      const menuItems = await response.json()

      // Group items by category (mock categories for demo)
      const mockCategories: MenuCategory[] = [
        {
          id: "cat-1",
          name: "Appetizers",
          description: "Start your meal with our delicious appetizers",
          display_order: 1,
          items: menuItems.filter((item: MenuItem) => item.category_id === "cat-1"),
        },
        {
          id: "cat-2",
          name: "Main Course",
          description: "Our signature main dishes",
          display_order: 2,
          items: menuItems.filter((item: MenuItem) => item.category_id === "cat-2"),
        },
        {
          id: "cat-3",
          name: "Desserts",
          description: "Sweet endings to your meal",
          display_order: 3,
          items: menuItems.filter((item: MenuItem) => item.category_id === "cat-3") || [],
        },
      ]

      setCategories(mockCategories)
      generateAnalytics(mockCategories)
    } catch (error) {
      console.error("Error loading menu:", error)
      toast({
        title: "Error",
        description: "Failed to load menu data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generateAnalytics = (categoriesData: MenuCategory[]) => {
    const allItems = categoriesData.flatMap((cat) => cat.items)
    const totalItems = allItems.length
    const totalCategories = categoriesData.length
    const averagePrice = totalItems > 0 ? allItems.reduce((sum, item) => sum + item.price, 0) / totalItems : 0

    const popularItems = allItems.sort((a, b) => (b.popularity_score || 0) - (a.popularity_score || 0)).slice(0, 5)

    const revenueByCategory = categoriesData.reduce(
      (acc, category) => {
        acc[category.name] = category.items.reduce((sum, item) => sum + item.price * (item.popularity_score || 1), 0)
        return acc
      },
      {} as { [key: string]: number },
    )

    const profitMargins = categoriesData.reduce(
      (acc, category) => {
        const avgMargin =
          category.items.reduce((sum, item) => sum + (item.profit_margin || 0.3), 0) / (category.items.length || 1)
        acc[category.name] = avgMargin * 100
        return acc
      },
      {} as { [key: string]: number },
    )

    setAnalytics({
      totalItems,
      totalCategories,
      averagePrice: Number(averagePrice.toFixed(2)),
      popularItems,
      revenueByCategory,
      profitMargins,
    })
  }

  useEffect(() => {
    if (categories.length > 0) {
      setHasMenuData(true)
      setShowAIFeatures(true)
    }
  }, [categories])

  // Handler functions
  const handleContinueOnboarding = () => {
    router.push("/dashboard?onboarding=complete")
  }

  // const handleAddItem = () => {
  //   if (!newItem.name || !newItem.description || !newItem.price || !newItem.category) {
  //     toast({
  //       title: "Missing Information",
  //       description: "Please fill in all required fields",
  //       variant: "destructive",
  //     })
  //     return
  //   }

  //   const item: MenuItem = {
  //     id: `item-${Date.now()}`,
  //     name: newItem.name!,
  //     description: newItem.description!,
  //     price: newItem.price!,
  //     category: newItem.category!,
  //     availability: newItem.availability || "available",
  //     isVegetarian: newItem.isVegetarian || false,
  //     isVegan: newItem.isVegan || false,
  //     isGlutenFree: newItem.isGlutenFree || false,
  //     isSpicy: newItem.isSpicy || false,
  //     isPopular: newItem.isPopular || false,
  //     isNew: newItem.isNew || false,
  //     allergens: newItem.allergens || [],
  //     tags: newItem.tags || [],
  //   }

  //   setMenuCategories((prev) =>
  //     prev.map((cat) => (cat.id === newItem.category ? { ...cat, items: [...cat.items, item] } : cat)),
  //   )

  //   setNewItem({
  //     name: "",
  //     description: "",
  //     price: 0,
  //     category: "",
  //     availability: "available",
  //     isVegetarian: false,
  //     isVegan: false,
  //     isGlutenFree: false,
  //     isSpicy: false,
  //     isPopular: false,
  //     isNew: false,
  //     allergens: [],
  //     tags: [],
  //   })

  //   setShowAddItemDialog(false)

  //   toast({
  //     title: "Item Added",
  //     description: `${item.name} has been added to your menu`,
  //   })
  // }

  const handleSaveItem = async (itemData: Partial<MenuItem>) => {
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (editingItem) {
        // Update existing item
        setCategories((prev) =>
          prev.map((category) => ({
            ...category,
            items: category.items.map((item) => (item.id === editingItem.id ? { ...item, ...itemData } : item)),
          })),
        )
      } else {
        // Add new item
        const newItem: MenuItem = {
          id: `item-${Date.now()}`,
          category_id: itemData.category_id || categories[0]?.id || "",
          name: itemData.name || "",
          description: itemData.description || "",
          price: itemData.price || 0,
          is_available: itemData.is_available ?? true,
          dietary_info: itemData.dietary_info || [],
          prep_time: itemData.prep_time,
          calories: itemData.calories,
          popularity_score: Math.random() * 100,
          profit_margin: 0.3,
        }

        setCategories((prev) =>
          prev.map((category) =>
            category.id === newItem.category_id ? { ...category, items: [...category.items, newItem] } : category,
          ),
        )
      }

      setShowItemDialog(false)
      setEditingItem(null)
      toast({
        title: "Success",
        description: editingItem ? "Item updated successfully" : "Item added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save item",
        variant: "destructive",
      })
    }
  }

  const handleAddCategory = () => {
    if (!newCategory.name) {
      toast({
        title: "Missing Information",
        description: "Please enter a category name",
        variant: "destructive",
      })
      return
    }

    const category: MenuCategory = {
      id: `category-${Date.now()}`,
      name: newCategory.name,
      description: newCategory.description,
      display_order: categories.length + 1,
      items: [],
    }

    setCategories((prev) => [...prev, category])

    setNewCategory({
      name: "",
      description: "",
      displayOrder: 0,
      isActive: true,
    })

    setShowAddCategoryDialog(false)

    toast({
      title: "Category Added",
      description: `${category.name} category has been created`,
    })
  }

  // const handleDeleteItem = (itemId: string, categoryId: string) => {
  //   setMenuCategories((prev) =>
  //     prev.map((cat) =>
  //       cat.id === categoryId ? { ...cat, items: cat.items.filter((item) => item.id !== itemId) } : cat,
  //     ),
  //   )

  //   toast({
  //     title: "Item Deleted",
  //     description: "Menu item has been removed",
  //   })
  // }

  const handleDeleteItem = async (itemId: string) => {
    try {
      setCategories((prev) =>
        prev.map((category) => ({
          ...category,
          items: category.items.filter((item) => item.id !== itemId),
        })),
      )

      toast({
        title: "Success",
        description: "Item deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== categoryId))

    toast({
      title: "Category Deleted",
      description: "Category and all its items have been removed",
    })
  }

  const handleGenerateAIMenu = async () => {
    setIsGeneratingMenu(true)

    setTimeout(() => {
      const aiGeneratedItems: MenuItem[] = [
        {
          id: "ai-item-1",
          name: "Mediterranean Quinoa Bowl",
          description: "Nutritious quinoa with roasted vegetables, feta cheese, and tahini dressing",
          price: 16.99,
          category_id: "mains",
          is_available: true,
          prep_time: 12,
          calories: 420,
          popularity_score: 0,
          profit_margin: 0,
          dietary_info: ["vegetarian", "gluten-free"],
          image_url: "",
        },
        {
          id: "ai-item-2",
          name: "Truffle Mushroom Risotto",
          description: "Creamy arborio rice with wild mushrooms and truffle oil",
          price: 22.99,
          category_id: "mains",
          is_available: true,
          prep_time: 25,
          calories: 520,
          popularity_score: 0,
          profit_margin: 0,
          dietary_info: ["vegetarian"],
          image_url: "",
        },
      ]

      setCategories((prev) =>
        prev.map((cat) => (cat.id === "mains" ? { ...cat, items: [...cat.items, ...aiGeneratedItems] } : cat)),
      )

      setIsGeneratingMenu(false)

      toast({
        title: "AI Menu Generated",
        description: "Added 2 new AI-suggested items to your menu",
      })
    }, 3000)
  }

  const handleRunAnalytics = async () => {
    setIsAnalyzing(true)

    setTimeout(() => {
      setIsAnalyzing(false)
      toast({
        title: "Analytics Updated",
        description: "Menu performance analysis has been refreshed",
      })
    }, 2000)
  }

  const handleExportMenu = () => {
    toast({
      title: "Export Started",
      description: "Your menu is being prepared for download",
    })

    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Menu has been downloaded successfully",
      })
    }, 2000)
  }

  const filteredCategories = categories
    .map((category) => ({
      ...category,
      items: category.items.filter((item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === "all" || category.id === selectedCategory
        return matchesSearch && matchesCategory
      }),
    }))
    .filter((category) => selectedCategory === "all" || category.id === selectedCategory)

  // const filteredCategories = menuCategories.filter((category) => {
  //   if (selectedCategory === "all") return true
  //   return category.id === selectedCategory
  // })

  // const filteredItems = filteredCategories.flatMap((category) =>
  //   category.items.filter(
  //     (item) =>
  //       item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       item.description.toLowerCase().includes(searchQuery.toLowerCase()),
  //   ),
  // )

  const aiSuggestions = [
    {
      type: "pricing",
      title: "Optimize Pricing",
      content: "Increase Butter Chicken price by ₹50 to improve profit margin by 15%",
      action: "Apply Suggestion",
    },
    {
      type: "menu",
      title: "Add Seasonal Item",
      content: "Add 'Mango Kulfi' to desserts - trending 40% higher this season",
      action: "Generate Item",
    },
    {
      type: "performance",
      title: "Remove Low Performer",
      content: "Consider removing 'Paneer Kofta' - only 2% of orders in last month",
      action: "Review Item",
    },
  ]

  // Empty state for new users
  const EmptyMenuState = () => (
    <div className="text-center py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ChefHat className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Build Your Menu</h3>
        <p className="text-gray-600 mb-6 text-sm">
          Start creating your restaurant menu by adding categories and items, or let AI help you generate one.
        </p>

        <div className="space-y-3">
          <Button
            onClick={() => setShowAddCategoryDialog(true)}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add First Category
          </Button>

          <Button
            onClick={handleGenerateAIMenu}
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
            disabled={isGeneratingMenu}
          >
            {isGeneratingMenu ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Generate with AI
              </>
            )}
          </Button>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start space-x-3">
            <Lightbulb className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <h4 className="font-medium text-gray-900 text-sm">Pro Tip</h4>
              <p className="text-gray-600 text-xs mt-1">
                Start with main categories like Appetizers, Main Courses, and Desserts. You can always reorganize later.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-3 py-4 pb-20">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-3 py-4 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Menu Builder</h1>
            <p className="text-sm text-gray-600">Create and manage your restaurant menu</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => router.push("/menu-intelligence")}>
              <BarChart3 className="w-4 h-4 mr-1" />
              View Intelligence
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-1" />
              Import
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setEditingItem(null)
                setShowItemDialog(true)
              }}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Item
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="menu">Menu Items</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="publish">Publish</TabsTrigger>
          </TabsList>

          {/* Menu Items Tab */}
          <TabsContent value="menu" className="space-y-6">
            {/* Quick Stats */}
            {analytics && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Total Items</p>
                        <p className="text-lg font-semibold">{analytics.totalItems}</p>
                      </div>
                      <Utensils className="w-5 h-5 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Categories</p>
                        <p className="text-lg font-semibold">{analytics.totalCategories}</p>
                      </div>
                      <Grid3X3 className="w-5 h-5 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Avg Price</p>
                        <p className="text-lg font-semibold">₹{analytics.averagePrice}</p>
                      </div>
                      <DollarSign className="w-5 h-5 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Popular Items</p>
                        <p className="text-lg font-semibold">{analytics.popularItems.length}</p>
                      </div>
                      <Star className="w-5 h-5 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* AI Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-yellow-600" />
                  AI Menu Suggestions
                </CardTitle>
                <CardDescription>Smart recommendations to optimize your menu</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {aiSuggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-1">{suggestion.title}</h4>
                      <p className="text-sm text-gray-700">{suggestion.content}</p>
                    </div>
                    <Button size="sm" variant="outline" className="ml-3 bg-transparent">
                      {suggestion.action}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Filters and Controls */}
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
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center space-x-2">
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

            {/* Menu Categories and Items */}
            <div className="space-y-6">
              {filteredCategories.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">{category.name}</CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                      </div>
                      <Badge variant="outline">{category.items.length} items</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {viewMode === "grid" ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {category.items.map((item) => (
                          <div key={item.id} className="border rounded-lg p-4 bg-white">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm mb-1">{item.name}</h4>
                                <p className="text-xs text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="font-semibold text-sm">₹{item.price}</span>
                                  {item.prep_time && (
                                    <Badge variant="outline" className="text-xs">
                                      <Clock className="w-3 h-3 mr-1" />
                                      {item.prep_time}min
                                    </Badge>
                                  )}
                                </div>
                                {item.dietary_info && item.dietary_info.length > 0 && (
                                  <div className="flex items-center space-x-1 mb-2">
                                    {item.dietary_info.includes("vegetarian") && (
                                      <Leaf className="w-3 h-3 text-green-600" />
                                    )}
                                    {item.dietary_info.includes("spicy") && <Flame className="w-3 h-3 text-red-600" />}
                                    {item.dietary_info.includes("cold") && (
                                      <Snowflake className="w-3 h-3 text-blue-600" />
                                    )}
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center space-x-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setEditingItem(item)
                                    setShowItemDialog(true)
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => handleDeleteItem(item.id)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <Switch
                                checked={item.is_available}
                                onCheckedChange={(checked) => {
                                  setCategories((prev) =>
                                    prev.map((cat) => ({
                                      ...cat,
                                      items: cat.items.map((i) =>
                                        i.id === item.id ? { ...i, is_available: checked } : i,
                                      ),
                                    })),
                                  )
                                }}
                              />
                              <span className="text-xs text-gray-500">
                                {item.is_available ? "Available" : "Unavailable"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {category.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-3 border rounded-lg bg-white"
                          >
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <div>
                                  <h4 className="font-medium text-sm">{item.name}</h4>
                                  <p className="text-xs text-gray-600">{item.description}</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className="font-semibold text-sm">₹{item.price}</span>
                              <Switch
                                checked={item.is_available}
                                onCheckedChange={(checked) => {
                                  setCategories((prev) =>
                                    prev.map((cat) => ({
                                      ...cat,
                                      items: cat.items.map((i) =>
                                        i.id === item.id ? { ...i, is_available: checked } : i,
                                      ),
                                    })),
                                  )
                                }}
                              />
                              <div className="flex items-center space-x-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setEditingItem(item)
                                    setShowItemDialog(true)
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => handleDeleteItem(item.id)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {category.items.length === 0 && (
                      <div className="text-center py-8">
                        <ChefHat className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">No items in this category yet</p>
                        <Button
                          onClick={() => {
                            setEditingItem(null)
                            setShowItemDialog(true)
                          }}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add First Item
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {analytics && (
              <>
                {/* Revenue by Category */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Revenue by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(analytics.revenueByCategory).map(([category, revenue]) => (
                        <div key={category} className="flex items-center justify-between">
                          <span className="text-sm">{category}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{
                                  width: `${(revenue / Math.max(...Object.values(analytics.revenueByCategory))) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-sm font-medium w-20 text-right">₹{revenue.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Popular Items */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Top Performing Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics.popularItems.map((item, index) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Badge
                              variant="outline"
                              className="w-6 h-6 rounded-full p-0 flex items-center justify-center"
                            >
                              {index + 1}
                            </Badge>
                            <div>
                              <h4 className="font-medium text-sm">{item.name}</h4>
                              <p className="text-xs text-gray-600">₹{item.price}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{Math.round(item.popularity_score || 0)}% popularity</p>
                            <p className="text-xs text-gray-600">
                              {Math.round((item.profit_margin || 0.3) * 100)}% margin
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Profit Margins */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Profit Margins by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(analytics.profitMargins).map(([category, margin]) => (
                        <div key={category} className="flex items-center justify-between">
                          <span className="text-sm">{category}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  margin > 40 ? "bg-green-500" : margin > 25 ? "bg-yellow-500" : "bg-red-500"
                                }`}
                                style={{ width: `${margin}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium w-12 text-right">{margin.toFixed(1)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Design Tab */}
          <TabsContent value="design" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Menu Design Customization</CardTitle>
                <CardDescription>Customize the look and feel of your menu</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Color Theme</Label>
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {[
                          "bg-red-500",
                          "bg-blue-500",
                          "bg-green-500",
                          "bg-purple-500",
                          "bg-yellow-500",
                          "bg-pink-500",
                          "bg-indigo-500",
                          "bg-gray-500",
                        ].map((color) => (
                          <div
                            key={color}
                            className={`w-8 h-8 rounded-lg cursor-pointer border-2 border-gray-200 ${color}`}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Typography</Label>
                      <Select defaultValue="modern">
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="modern">Modern Sans</SelectItem>
                          <SelectItem value="classic">Classic Serif</SelectItem>
                          <SelectItem value="elegant">Elegant Script</SelectItem>
                          <SelectItem value="bold">Bold Display</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Layout Style</Label>
                      <Select defaultValue="grid">
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="grid">Grid Layout</SelectItem>
                          <SelectItem value="list">List Layout</SelectItem>
                          <SelectItem value="magazine">Magazine Style</SelectItem>
                          <SelectItem value="minimal">Minimal Design</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Menu Header</Label>
                      <Input placeholder="Restaurant Name" className="mt-2" defaultValue="Demo Restaurant" />
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Tagline</Label>
                      <Input
                        placeholder="Your restaurant tagline"
                        className="mt-2"
                        defaultValue="Authentic flavors, modern experience"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Logo Upload</Label>
                      <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Click to upload logo</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <Button variant="outline">
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  <div className="space-x-2">
                    <Button variant="outline">Reset</Button>
                    <Button>
                      <Save className="w-4 h-4 mr-1" />
                      Save Design
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Publish Tab */}
          <TabsContent value="publish" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Publishing Options</CardTitle>
                <CardDescription>Share your menu across different platforms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-sm">Digital Formats</h3>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Smartphone className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium">Mobile Menu</p>
                            <p className="text-xs text-gray-600">QR code accessible menu</p>
                          </div>
                        </div>
                        <Button size="sm">Generate QR</Button>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Monitor className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="text-sm font-medium">Web Menu</p>
                            <p className="text-xs text-gray-600">Embeddable web version</p>
                          </div>
                        </div>
                        <Button size="sm">Get Code</Button>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Share className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="text-sm font-medium">Social Media</p>
                            <p className="text-xs text-gray-600">Instagram, Facebook posts</p>
                          </div>
                        </div>
                        <Button size="sm">Share</Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-sm">Print Formats</h3>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Printer className="w-5 h-5 text-red-600" />
                          <div>
                            <p className="text-sm font-medium">Table Menu</p>
                            <p className="text-xs text-gray-600">A4 printable format</p>
                          </div>
                        </div>
                        <Button size="sm">Download PDF</Button>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Layout className="w-5 h-5 text-yellow-600" />
                          <div>
                            <p className="text-sm font-medium">Board Menu</p>
                            <p className="text-xs text-gray-600">Large display format</p>
                          </div>
                        </div>
                        <Button size="sm">Download PDF</Button>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Download className="w-5 h-5 text-gray-600" />
                          <div>
                            <p className="text-sm font-medium">Flyer Menu</p>
                            <p className="text-xs text-gray-600">Takeaway format</p>
                          </div>
                        </div>
                        <Button size="sm">Download PDF</Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium text-sm">Platform Integration</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: "Zomato", status: "connected" },
                      { name: "Swiggy", status: "disconnected" },
                      { name: "Uber Eats", status: "connected" },
                      { name: "Google My Business", status: "connected" },
                    ].map((platform) => (
                      <div key={platform.name} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              platform.status === "connected" ? "bg-green-500" : "bg-gray-400"
                            }`}
                          />
                          <span className="text-sm font-medium">{platform.name}</span>
                        </div>
                        <Button size="sm" variant={platform.status === "connected" ? "outline" : "default"}>
                          {platform.status === "connected" ? "Sync" : "Connect"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Item Edit Dialog */}
        <Dialog open={showItemDialog} onOpenChange={setShowItemDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Menu Item" : "Add New Menu Item"}</DialogTitle>
              <DialogDescription>
                {editingItem ? "Update the details of your menu item" : "Add a new item to your menu"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Item Name</Label>
                  <Input placeholder="e.g., Butter Chicken" defaultValue={editingItem?.name || ""} className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Price (₹)</Label>
                  <Input type="number" placeholder="0.00" defaultValue={editingItem?.price || ""} className="mt-1" />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Description</Label>
                <Textarea
                  placeholder="Describe your dish..."
                  defaultValue={editingItem?.description || ""}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <Select defaultValue={editingItem?.category_id || categories[0]?.id}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Prep Time (minutes)</Label>
                  <Input type="number" placeholder="15" defaultValue={editingItem?.prep_time || ""} className="mt-1" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Calories</Label>
                  <Input type="number" placeholder="350" defaultValue={editingItem?.calories || ""} className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Dietary Info</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="vegetarian" className="rounded" />
                      <Label htmlFor="vegetarian" className="text-sm">
                        Vegetarian
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="spicy" className="rounded" />
                      <Label htmlFor="spicy" className="text-sm">
                        Spicy
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="cold" className="rounded" />
                      <Label htmlFor="cold" className="text-sm">
                        Cold
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="available" defaultChecked={editingItem?.is_available ?? true} />
                <Label htmlFor="available" className="text-sm">
                  Available for ordering
                </Label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowItemDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => handleSaveItem({})}>{editingItem ? "Update Item" : "Add Item"}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
