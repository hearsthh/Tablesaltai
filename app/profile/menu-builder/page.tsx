"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import {
  Heart,
  Flame,
  Leaf,
  Coffee,
  Utensils,
  Upload,
  BarChart3,
  Sparkles,
  Eye,
  Plus,
  ArrowRight,
  ChefHat,
  Edit,
  Trash2,
  Search,
  Download,
  Copy,
  Globe,
  Grid3X3,
  TrendingUp,
  Target,
  DollarSign,
  Star,
  AlertTriangle,
  Save,
  ExternalLink,
  ArrowUpRight,
  Palette,
  Move,
  FileText,
} from "lucide-react"
import MenuExtractModal from "@/components/ai/menu-extract-modal"
import MenuContentGenerator from "@/components/ai/menu-content-generator"
import ContentHistoryTimeline from "@/components/ai/content-history-timeline"
import GeneratedContentViewer from "@/components/ai/generated-content-viewer"

// Empty state for new users
const emptyMenuData = {
  categories: [],
}

// Mock data for existing users
const mockMenuData = {
  categories: [
    {
      id: "1",
      name: "Appetizers",
      description: "Start your meal with our delicious appetizers",
      items: [
        {
          id: "1",
          name: "Samosa Chaat",
          description: "Crispy samosas topped with tangy chutneys and yogurt",
          price: 8.99,
          image: "/placeholder.svg?height=80&width=80",
          available: true,
          inStock: true,
          tasteTags: ["spicy", "vegetarian"],
          promoTags: ["popular", "signature"],
          insights: {
            sales: "high",
            pricing: "underpriced",
            trend: "increasing",
            suggestions: ["Consider raising price by $1", "Add to combo offers"],
          },
        },
        {
          id: "2",
          name: "Chicken Wings",
          description: "Spicy buffalo wings with blue cheese dip",
          price: 12.99,
          image: "/placeholder.svg?height=80&width=80",
          available: true,
          inStock: false,
          tasteTags: ["spicy", "non-vegetarian"],
          promoTags: ["popular"],
          insights: {
            sales: "low",
            pricing: "overpriced",
            trend: "declining",
          },
        },
      ],
    },
    {
      id: "2",
      name: "Main Course",
      description: "Our signature main dishes",
      items: [
        {
          id: "7",
          name: "Butter Chicken",
          description: "Tender chicken in rich tomato cream sauce",
          price: 16.99,
          image: "/placeholder.svg?height=80&width=80",
          available: true,
          inStock: true,
          tasteTags: ["mild", "non-vegetarian", "creamy"],
          promoTags: ["signature", "chef-special"],
          insights: {
            sales: "high",
            pricing: "optimal",
            trend: "stable",
          },
        },
        {
          id: "8",
          name: "Palak Paneer",
          description: "Cottage cheese in creamy spinach curry",
          price: 14.99,
          image: "/placeholder.svg?height=80&width=80",
          available: true,
          inStock: true,
          tasteTags: ["mild", "vegetarian", "healthy"],
          promoTags: ["popular"],
          insights: {
            sales: "medium",
            pricing: "optimal",
            trend: "increasing",
          },
        },
      ],
    },
  ],
}

const tasteTagsConfig = {
  spicy: { label: "Spicy", icon: Flame, color: "bg-red-50 text-red-600 border-red-200" },
  mild: { label: "Mild", icon: Coffee, color: "bg-yellow-50 text-yellow-600 border-yellow-200" },
  vegetarian: { label: "Veg", icon: Leaf, color: "bg-green-50 text-green-600 border-green-200" },
  vegan: { label: "Vegan", icon: Leaf, color: "bg-green-50 text-green-700 border-green-300" },
  "non-vegetarian": { label: "Non-Veg", icon: Utensils, color: "bg-orange-50 text-orange-600 border-orange-200" },
  healthy: { label: "Healthy", icon: Heart, color: "bg-pink-50 text-pink-600 border-pink-200" },
  creamy: { label: "Creamy", icon: Coffee, color: "bg-amber-50 text-amber-600 border-amber-200" },
}

const promoTagsConfig = {
  popular: { label: "Popular", color: "bg-blue-50 text-blue-600 border-blue-200" },
  "top-rated": { label: "Top Rated", color: "bg-purple-50 text-purple-600 border-purple-200" },
  signature: { label: "Signature", color: "bg-indigo-50 text-indigo-600 border-indigo-200" },
  "must-try": { label: "Must Try", color: "bg-pink-50 text-pink-600 border-pink-200" },
  "kids-special": { label: "Kids", color: "bg-cyan-50 text-cyan-600 border-cyan-200" },
  "chef-special": { label: "Chef's", color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
}

const connectedPlatforms = [
  { id: "google", name: "Google My Business", connected: true, icon: Globe },
  { id: "zomato", name: "Zomato", connected: true, icon: Utensils },
  { id: "swiggy", name: "Swiggy", connected: true, icon: Utensils },
  { id: "facebook", name: "Facebook", connected: true, icon: Globe },
  { id: "petpooja", name: "PetPooja POS", connected: true, icon: BarChart3 },
]

export default function MenuBuilderPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isOnboarding = searchParams.get("onboarding") === "true"
  const isNewUser = searchParams.get("new") === "true" || isOnboarding

  // Use empty data for new users, mock data for existing users
  const [menuData, setMenuData] = useState(isNewUser ? emptyMenuData : mockMenuData)
  const [showExtractModal, setShowExtractModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showEditCategory, setShowEditCategory] = useState(false)
  const [showEditItem, setShowEditItem] = useState(false)
  const [activeTab, setActiveTab] = useState("menu")
  const [insightsTab, setInsightsTab] = useState("insights")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterAvailable, setFilterAvailable] = useState<boolean | null>(null)
  const [refreshHistory, setRefreshHistory] = useState(0)
  const [showPreview, setShowPreview] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<any>(null)
  const [showGeneratedContent, setShowGeneratedContent] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [newCategory, setNewCategory] = useState({ name: "", description: "" })
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    available: true,
    inStock: true,
    tasteTags: [],
    promoTags: [],
  })
  const [insightsData, setInsightsData] = useState<any>(null)
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false)

  const handleContentApplied = (content: any, appliedData: any) => {
    switch (content.content_type) {
      case "combos":
        const comboCategory = {
          id: `combo_${Date.now()}`,
          name: "Combo Meals",
          description: "Value combo meals with great savings",
          items: appliedData.map((combo: any, index: number) => ({
            id: `combo_item_${Date.now()}_${index}`,
            name: combo.name,
            description: combo.description,
            price: combo.price,
            available: true,
            inStock: true,
            tasteTags: ["combo"],
            promoTags: ["value", "popular"],
            comboItems: combo.items,
          })),
        }

        setMenuData((prevData) => ({
          ...prevData,
          categories: [...prevData.categories, comboCategory],
        }))

        toast({
          title: "🍽️ Combos Added!",
          description: `${appliedData.length} combo meals have been added to your menu`,
        })
        break

      case "seasonal-menu":
        const seasonalCategory = {
          id: `seasonal_${Date.now()}`,
          name: "Seasonal Specials",
          description: "Limited-time seasonal offerings",
          items: appliedData.map((item: any, index: number) => ({
            id: `seasonal_item_${Date.now()}_${index}`,
            name: item.name,
            description: item.description,
            price: item.price,
            available: true,
            inStock: true,
            tasteTags: item.tags || ["seasonal"],
            promoTags: ["limited-time", "seasonal"],
          })),
        }

        setMenuData((prevData) => ({
          ...prevData,
          categories: [...prevData.categories, seasonalCategory],
        }))

        toast({
          title: "🌱 Seasonal Items Added!",
          description: `${appliedData.length} seasonal items have been added to your menu`,
        })
        break

      case "item-descriptions":
        // Update existing items with enhanced descriptions
        if (typeof appliedData === "object" && appliedData.items) {
          setMenuData((prevData) => ({
            ...prevData,
            categories: prevData.categories.map((category) => ({
              ...category,
              items: category.items.map((item) => {
                const enhancedItem = appliedData.items.find((enhanced: any) => enhanced.id === item.id)
                return enhancedItem ? { ...item, description: enhancedItem.description } : item
              }),
            })),
          }))

          toast({
            title: "✨ Descriptions Enhanced!",
            description: "Menu item descriptions have been improved with AI",
          })
        }
        break

      default:
        toast({
          title: "✅ Content Applied!",
          description: "Content has been applied to your menu",
        })
    }
  }

  const handleMenuExtracted = (extractedMenuData: any) => {
    const newCategories = extractedMenuData.categories.map((category: any) => ({
      ...category,
      id: `extracted_${Date.now()}_${category.id}`,
      items: category.items.map((item: any) => ({
        ...item,
        id: `extracted_${Date.now()}_${item.id}`,
        inStock: true,
      })),
    }))

    setMenuData((prevData) => ({
      ...prevData,
      categories: [...prevData.categories, ...newCategories],
    }))

    toast({
      title: "✅ Menu Imported Successfully!",
      description: `Added ${newCategories.length} categories and ${newCategories.reduce((total: number, cat: any) => total + cat.items.length, 0)} items to your menu.`,
    })
  }

  const handleContentGenerated = (content: any) => {
    console.log("🎉 New content generated:", content)
    setRefreshHistory((prev) => prev + 1)
    setGeneratedContent(content)
    setShowGeneratedContent(true)

    toast({
      title: "✅ Content Generated!",
      description: `${content.title} has been created and is ready for review`,
    })
  }

  const handleContinueOnboarding = () => {
    router.push("/profile/reviews?onboarding=true&new=true")
  }

  const handleDeleteItem = (categoryId: string, itemId: string) => {
    setMenuData((prevData) => ({
      ...prevData,
      categories: prevData.categories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              items: category.items.filter((item) => item.id !== itemId),
            }
          : category,
      ),
    }))

    toast({
      title: "🗑️ Item Deleted",
      description: "Menu item has been removed",
    })
  }

  const handleDeleteCategory = (categoryId: string) => {
    setMenuData((prevData) => ({
      ...prevData,
      categories: prevData.categories.filter((category) => category.id !== categoryId),
    }))

    toast({
      title: "🗑️ Category Deleted",
      description: "Category and all its items have been removed",
    })
  }

  const handleToggleAvailability = (categoryId: string, itemId: string) => {
    setMenuData((prevData) => ({
      ...prevData,
      categories: prevData.categories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              items: category.items.map((item) =>
                item.id === itemId ? { ...item, available: !item.available } : item,
              ),
            }
          : category,
      ),
    }))

    toast({
      title: "✅ Availability Updated",
      description: "Item availability has been changed",
    })
  }

  const handleToggleStock = (categoryId: string, itemId: string) => {
    setMenuData((prevData) => ({
      ...prevData,
      categories: prevData.categories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              items: category.items.map((item) => (item.id === itemId ? { ...item, inStock: !item.inStock } : item)),
            }
          : category,
      ),
    }))

    toast({
      title: "📦 Stock Status Updated",
      description: "Item stock status has been changed",
    })
  }

  const handleSaveCategory = () => {
    if (editingCategory) {
      // Edit existing category
      setMenuData((prevData) => ({
        ...prevData,
        categories: prevData.categories.map((category) =>
          category.id === editingCategory.id
            ? { ...category, name: newCategory.name, description: newCategory.description }
            : category,
        ),
      }))
      toast({
        title: "✅ Category Updated",
        description: "Category has been updated successfully",
      })
    } else {
      // Add new category
      const category = {
        id: `category_${Date.now()}`,
        name: newCategory.name,
        description: newCategory.description,
        items: [],
      }
      setMenuData((prevData) => ({
        ...prevData,
        categories: [...prevData.categories, category],
      }))
      toast({
        title: "✅ Category Added",
        description: "New category has been created",
      })
    }

    setShowEditCategory(false)
    setEditingCategory(null)
    setNewCategory({ name: "", description: "" })
  }

  const handleSaveItem = () => {
    const item = {
      id: editingItem ? editingItem.id : `item_${Date.now()}`,
      name: newItem.name,
      description: newItem.description,
      price: Number.parseFloat(newItem.price),
      available: newItem.available,
      inStock: newItem.inStock,
      tasteTags: newItem.tasteTags,
      promoTags: newItem.promoTags,
      image: "/placeholder.svg?height=80&width=80",
    }

    if (editingItem) {
      // Edit existing item
      setMenuData((prevData) => ({
        ...prevData,
        categories: prevData.categories.map((category) => ({
          ...category,
          items: category.items.map((existingItem) => (existingItem.id === editingItem.id ? item : existingItem)),
        })),
      }))
      toast({
        title: "✅ Item Updated",
        description: "Menu item has been updated successfully",
      })
    } else {
      // Add new item to first category (or create one if none exists)
      if (menuData.categories.length === 0) {
        const defaultCategory = {
          id: `category_${Date.now()}`,
          name: "Main Menu",
          description: "Our delicious offerings",
          items: [item],
        }
        setMenuData({ categories: [defaultCategory] })
      } else {
        setMenuData((prevData) => ({
          ...prevData,
          categories: prevData.categories.map((category, index) =>
            index === 0 ? { ...category, items: [...category.items, item] } : category,
          ),
        }))
      }
      toast({
        title: "✅ Item Added",
        description: "New menu item has been created",
      })
    }

    setShowEditItem(false)
    setEditingItem(null)
    setNewItem({
      name: "",
      description: "",
      price: "",
      available: true,
      inStock: true,
      tasteTags: [],
      promoTags: [],
    })
  }

  const handleGenerateInsights = async () => {
    setIsGeneratingInsights(true)
    try {
      // Mock insights generation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockInsights = {
        insights: [
          {
            id: "1",
            type: "pricing",
            title: "Underpriced Items",
            description: "Samosa Chaat is priced 15% below market rate",
            impact: "high",
            items: ["Samosa Chaat"],
            recommendation: "Increase price from $8.99 to $10.99",
            potentialRevenue: 250,
            cta: {
              type: "price-change",
              label: "Apply Price Change",
              data: { itemId: "1", newPrice: 10.99 },
            },
          },
          {
            id: "2",
            type: "pricing",
            title: "Overpriced Items",
            description: "Chicken Wings are priced 20% above market rate",
            impact: "medium",
            items: ["Chicken Wings"],
            recommendation: "Reduce price from $12.99 to $10.99",
            potentialRevenue: -50,
            cta: {
              type: "price-change",
              label: "Apply Price Change",
              data: { itemId: "2", newPrice: 10.99 },
            },
          },
          {
            id: "3",
            type: "menu-balance",
            title: "Category Imbalance",
            description: "Desserts category is missing from your menu",
            impact: "medium",
            recommendation: "Add a Desserts category with 3-4 items",
            cta: {
              type: "add-category",
              label: "Add Desserts Category",
              data: { categoryName: "Desserts", categoryDescription: "Sweet endings to your meal" },
            },
          },
          {
            id: "4",
            type: "menu-balance",
            title: "Low Performing Item",
            description: "Chicken Wings has low sales and should be considered for removal",
            impact: "low",
            recommendation: "Remove Chicken Wings or improve recipe",
            cta: {
              type: "remove-item",
              label: "Remove Item",
              data: { itemId: "2", categoryId: "1" },
            },
          },
          {
            id: "5",
            type: "opportunities",
            title: "Combo Opportunity",
            description: "High-performing items can be bundled for better value",
            impact: "high",
            recommendation: "Create combo with Butter Chicken + Naan + Rice",
            potentialRevenue: 180,
            cta: {
              type: "add-combos",
              label: "Create Combos",
              data: { items: ["Butter Chicken", "Naan", "Rice"] },
            },
          },
          {
            id: "6",
            type: "opportunities",
            title: "Seasonal Menu",
            description: "Winter specials can boost sales by 25%",
            impact: "high",
            recommendation: "Add winter comfort foods and warm beverages",
            potentialRevenue: 300,
            cta: {
              type: "add-seasonal-menu",
              label: "Create Seasonal Menu",
              data: { season: "winter" },
            },
          },
          {
            id: "7",
            type: "opportunities",
            title: "Missing Item Tags",
            description: "Items lack descriptive tags for better discoverability",
            impact: "medium",
            recommendation: "Add taste and dietary tags to all items",
            cta: {
              type: "add-item-tags",
              label: "Add Tags",
              data: { items: ["all"] },
            },
          },
          {
            id: "8",
            type: "opportunities",
            title: "Recipe Exploration",
            description: "Explore trending Indian fusion recipes",
            impact: "medium",
            recommendation: "Research popular fusion dishes in your area",
            cta: {
              type: "explore-ideas",
              label: "Explore Ideas",
              data: { query: "Indian fusion recipes trending 2024" },
            },
          },
        ],
        performance: {
          menuScore: 7.8,
          scoreBreakdown: {
            pricing: 6.5,
            balance: 8.2,
            variety: 7.9,
            profitability: 8.1,
            trends: 7.5,
          },
          topPerforming: [
            {
              id: "7",
              name: "Butter Chicken",
              sales: 89,
              revenue: 1512.11,
              rating: 4.8,
              trend: "increasing",
              cta: {
                type: "promote",
                label: "Promote More",
                data: { itemId: "7" },
              },
            },
            {
              id: "1",
              name: "Samosa Chaat",
              sales: 76,
              revenue: 683.24,
              rating: 4.6,
              trend: "stable",
              cta: {
                type: "create-offer",
                label: "Create Offer",
                data: { itemId: "1" },
              },
            },
          ],
          underPerforming: [
            {
              id: "2",
              name: "Chicken Wings",
              sales: 23,
              revenue: 298.77,
              rating: 4.1,
              trend: "declining",
              issues: ["Out of stock frequently", "Price point too high"],
              cta: {
                type: "remove-item",
                label: "Remove Item",
                data: { itemId: "2", categoryId: "1" },
              },
            },
          ],
          recommendations: [
            {
              id: "r1",
              title: "Reorder Categories",
              description: "Move Main Course to top for better visibility",
              cta: {
                type: "reorder-category",
                label: "Reorder",
                data: { categoryId: "2", newPosition: 0 },
              },
            },
            {
              id: "r2",
              title: "Improve Descriptions",
              description: "Enhance item descriptions for better appeal",
              cta: {
                type: "add-item-description",
                label: "Enhance Descriptions",
                data: { items: ["all"] },
              },
            },
            {
              id: "r3",
              title: "Menu Design",
              description: "Update fonts and colors for modern look",
              cta: {
                type: "change-design",
                label: "Update Design",
                data: { type: "modern" },
              },
            },
          ],
        },
      }

      setInsightsData(mockInsights)
      toast({
        title: "📊 Insights Generated!",
        description: "AI has analyzed your menu and generated insights",
      })
    } catch (error) {
      toast({
        title: "❌ Generation Failed",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingInsights(false)
    }
  }

  const handleInsightCTA = (cta: any) => {
    switch (cta.type) {
      case "price-change":
        // Implement price change in menu
        setMenuData((prevData) => ({
          ...prevData,
          categories: prevData.categories.map((category) => ({
            ...category,
            items: category.items.map((item) =>
              item.id === cta.data.itemId ? { ...item, price: cta.data.newPrice } : item,
            ),
          })),
        }))
        toast({
          title: "💰 Price Updated",
          description: `Item price has been changed to $${cta.data.newPrice}`,
        })
        break

      case "add-category":
        // Add new category
        const newCat = {
          id: `category_${Date.now()}`,
          name: cta.data.categoryName,
          description: cta.data.categoryDescription,
          items: [],
        }
        setMenuData((prevData) => ({
          ...prevData,
          categories: [...prevData.categories, newCat],
        }))
        toast({
          title: "📁 Category Added",
          description: `${cta.data.categoryName} category has been created`,
        })
        break

      case "remove-item":
        // Remove item
        handleDeleteItem(cta.data.categoryId, cta.data.itemId)
        break

      case "add-combos":
        // Navigate to AI tools tab
        setActiveTab("ai-tools")
        toast({
          title: "🍽️ Combo Creation",
          description: "Navigate to AI Tools to create combos",
        })
        break

      case "add-seasonal-menu":
        // Navigate to AI tools tab
        setActiveTab("ai-tools")
        toast({
          title: "🌱 Seasonal Menu",
          description: "Navigate to AI Tools to create seasonal menu",
        })
        break

      case "add-item-tags":
        // Navigate to AI tools tab
        setActiveTab("ai-tools")
        toast({
          title: "🏷️ Item Tags",
          description: "Navigate to AI Tools to add item tags",
        })
        break

      case "explore-ideas":
        // Open search results
        window.open(`https://www.google.com/search?q=${encodeURIComponent(cta.data.query)}`, "_blank")
        toast({
          title: "🔍 Exploring Ideas",
          description: "Opening search results in new tab",
        })
        break

      case "add-item-description":
        // Navigate to AI tools tab
        setActiveTab("ai-tools")
        toast({
          title: "📝 Item Descriptions",
          description: "Navigate to AI Tools to enhance descriptions",
        })
        break

      case "promote":
        // Navigate to marketing manager (placeholder)
        toast({
          title: "📢 Promotion",
          description: "Marketing manager integration coming soon",
        })
        break

      case "create-offer":
        // Navigate to marketing manager (placeholder)
        toast({
          title: "🎁 Create Offer",
          description: "Marketing manager integration coming soon",
        })
        break

      case "reorder-category":
        // Implement category reordering
        setMenuData((prevData) => {
          const categories = [...prevData.categories]
          const categoryIndex = categories.findIndex((cat) => cat.id === cta.data.categoryId)
          if (categoryIndex !== -1) {
            const [category] = categories.splice(categoryIndex, 1)
            categories.splice(cta.data.newPosition, 0, category)
          }
          return { ...prevData, categories }
        })
        toast({
          title: "🔄 Category Reordered",
          description: "Category order has been updated",
        })
        break

      case "change-design":
        // Navigate to menu tab for design changes
        setActiveTab("menu")
        toast({
          title: "🎨 Design Update",
          description: "Design customization coming soon",
        })
        break

      default:
        toast({
          title: "🚀 Action Triggered",
          description: cta.label,
        })
    }
  }

  const handlePlatformImport = (platformId: string) => {
    setShowImportModal(false)
    toast({
      title: "🤖 AI Import Started",
      description: `Importing menu from ${connectedPlatforms.find((p) => p.id === platformId)?.name}...`,
    })
    // Simulate import process
    setTimeout(() => {
      toast({
        title: "✅ Import Complete",
        description: "Menu has been successfully imported and processed",
      })
    }, 3000)
  }

  const handleSaveMenu = () => {
    toast({
      title: "💾 Menu Saved",
      description: "Your menu has been saved successfully",
    })
  }

  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(`category-${categoryId}`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const filteredCategories = menuData.categories
    .map((category) => ({
      ...category,
      items: category.items.filter((item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilter = filterAvailable === null || item.available === filterAvailable
        return matchesSearch && matchesFilter
      }),
    }))
    .filter((category) => category.items.length > 0 || searchQuery === "")

  // Empty state component for new users
  const EmptyMenuState = () => (
    <div className="text-center py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ChefHat className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Build Your Menu</h3>
        <p className="text-gray-600 mb-6 text-sm">
          Start building your restaurant menu by importing from platforms, uploading files, or creating manually.
        </p>

        <div className="space-y-3">
          <Button onClick={() => setShowImportModal(true)} className="w-full bg-black hover:bg-gray-800 text-white">
            <Download className="w-4 h-4 mr-2" />
            Import Menu
          </Button>

          <Button onClick={() => setActiveTab("ai-tools")} variant="outline" className="w-full">
            <Sparkles className="w-4 h-4 mr-2" />
            Generate with AI
          </Button>

          <Button
            variant="outline"
            className="w-full bg-transparent"
            onClick={() => {
              setNewCategory({ name: "Main Menu", description: "Our delicious offerings" })
              setEditingCategory(null)
              setShowEditCategory(true)
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Manually
          </Button>
        </div>
      </div>
    </div>
  )

  // Import Modal Component
  const ImportModal = () => (
    <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Import Menu</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-3">Connected Platforms</h4>
            <div className="space-y-2">
              {connectedPlatforms.map((platform) => {
                const Icon = platform.icon
                return (
                  <Button
                    key={platform.id}
                    variant="outline"
                    className="w-full justify-start bg-transparent hover:bg-gray-50"
                    onClick={() => handlePlatformImport(platform.id)}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    <span className="flex-1 text-left">{platform.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      AI Import
                    </Badge>
                  </Button>
                )
              })}
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Manual Import</h4>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent hover:bg-gray-50"
                onClick={() => {
                  setShowImportModal(false)
                  setShowExtractModal(true)
                }}
              >
                <Upload className="w-4 h-4 mr-3" />
                <span className="flex-1 text-left">Upload File</span>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent hover:bg-gray-50"
                onClick={() => {
                  setShowImportModal(false)
                  // Open manual text input
                }}
              >
                <Copy className="w-4 h-4 mr-3" />
                <span className="flex-1 text-left">Copy & Paste</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  // Menu Summary Navigation
  const MenuSummaryNav = () => (
    <div className="bg-white border rounded-lg p-4 mb-6">
      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
        <Grid3X3 className="w-4 h-4 mr-2" />
        Quick Navigation
      </h4>
      <div className="flex flex-wrap gap-2">
        {menuData.categories.map((category) => (
          <Button
            key={category.id}
            variant="outline"
            size="sm"
            onClick={() => scrollToCategory(category.id)}
            className="text-xs"
          >
            {category.name}
            <Badge variant="secondary" className="ml-2 text-xs">
              {category.items.length}
            </Badge>
          </Button>
        ))}
      </div>
    </div>
  )

  // Edit Category Modal
  const EditCategoryModal = () => (
    <Dialog open={showEditCategory} onOpenChange={setShowEditCategory}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editingCategory ? "Edit Category" : "Add Category"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="categoryName">Category Name</Label>
            <Input
              id="categoryName"
              value={newCategory.name}
              onChange={(e) => setNewCategory((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Appetizers"
            />
          </div>
          <div>
            <Label htmlFor="categoryDescription">Description</Label>
            <Textarea
              id="categoryDescription"
              value={newCategory.description}
              onChange={(e) => setNewCategory((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of this category"
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowEditCategory(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCategory} disabled={!newCategory.name.trim()}>
              {editingCategory ? "Update" : "Add"} Category
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  // Edit Item Modal
  const EditItemModal = () => (
    <Dialog open={showEditItem} onOpenChange={setShowEditItem}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editingItem ? "Edit Item" : "Add Item"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="itemName">Item Name</Label>
            <Input
              id="itemName"
              value={newItem.name}
              onChange={(e) => setNewItem((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Butter Chicken"
            />
          </div>
          <div>
            <Label htmlFor="itemDescription">Description</Label>
            <Textarea
              id="itemDescription"
              value={newItem.description}
              onChange={(e) => setNewItem((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the dish"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="itemPrice">Price ($)</Label>
            <Input
              id="itemPrice"
              type="number"
              step="0.01"
              value={newItem.price}
              onChange={(e) => setNewItem((prev) => ({ ...prev, price: e.target.value }))}
              placeholder="0.00"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="itemAvailable">Available</Label>
            <Switch
              id="itemAvailable"
              checked={newItem.available}
              onCheckedChange={(checked) => setNewItem((prev) => ({ ...prev, available: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="itemInStock">In Stock</Label>
            <Switch
              id="itemInStock"
              checked={newItem.inStock}
              onCheckedChange={(checked) => setNewItem((prev) => ({ ...prev, inStock: checked }))}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowEditItem(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveItem} disabled={!newItem.name.trim() || !newItem.price}>
              {editingItem ? "Update" : "Add"} Item
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Menu Manager</h1>
              <p className="text-sm text-gray-600 mt-1">
                {isNewUser ? "Build your restaurant menu" : "Manage and optimize your menu"}
              </p>
            </div>

            <div className="flex gap-2">
              {menuData.categories.length > 0 && (
                <>
                  <Button onClick={() => setShowPreview(true)} variant="outline" size="sm" className="hidden sm:flex">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    onClick={handleSaveMenu}
                    variant="outline"
                    size="sm"
                    className="hidden sm:flex bg-transparent"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  {/* Mobile Icons */}
                  <Button onClick={() => setShowPreview(true)} variant="outline" size="sm" className="sm:hidden">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button onClick={handleSaveMenu} variant="outline" size="sm" className="sm:hidden bg-transparent">
                    <Save className="w-4 h-4" />
                  </Button>
                </>
              )}
              <Button
                onClick={() => setShowImportModal(true)}
                className="bg-black hover:bg-gray-800 text-white"
                size="sm"
              >
                <Download className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Import</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="menu" className="flex items-center space-x-2">
              <Utensils className="w-4 h-4" />
              <span>Menu</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Insights</span>
            </TabsTrigger>
            <TabsTrigger value="ai-tools" className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>AI Tools</span>
            </TabsTrigger>
          </TabsList>

          {/* Menu Tab */}
          <TabsContent value="menu">
            {menuData.categories.length === 0 ? (
              <EmptyMenuState />
            ) : (
              <div className="space-y-6">
                {/* Menu Summary Navigation */}
                <MenuSummaryNav />

                {/* Search & Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search menu items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={filterAvailable === true ? "default" : "outline"}
                      onClick={() => setFilterAvailable(filterAvailable === true ? null : true)}
                      size="sm"
                    >
                      Available
                    </Button>
                    <Button
                      variant={filterAvailable === false ? "default" : "outline"}
                      onClick={() => setFilterAvailable(filterAvailable === false ? null : false)}
                      size="sm"
                    >
                      Unavailable
                    </Button>
                    <Button
                      onClick={() => {
                        setNewCategory({ name: "", description: "" })
                        setEditingCategory(null)
                        setShowEditCategory(true)
                      }}
                      size="sm"
                      className="bg-black hover:bg-gray-800 text-white"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Category
                    </Button>
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-6">
                  {filteredCategories.map((category) => (
                    <Card key={category.id} className="overflow-hidden" id={`category-${category.id}`}>
                      <CardHeader className="pb-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-lg">{category.name}</CardTitle>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingCategory(category)
                                  setNewCategory({ name: category.name, description: category.description })
                                  setShowEditCategory(true)
                                }}
                                className="h-6 w-6 p-0"
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteCategory(category.id)}
                                className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                            <CardDescription className="text-sm">{category.description}</CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {category.items.length} items
                            </Badge>
                            <Button
                              size="sm"
                              onClick={() => {
                                setNewItem({
                                  name: "",
                                  description: "",
                                  price: "",
                                  available: true,
                                  inStock: true,
                                  tasteTags: [],
                                  promoTags: [],
                                })
                                setEditingItem(null)
                                setShowEditItem(true)
                              }}
                              className="bg-black hover:bg-gray-800 text-white"
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Add Item
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {category.items.map((item) => (
                            <div key={item.id} className="bg-white border rounded-lg p-4 relative">
                              {/* Item Actions */}
                              <div className="absolute top-2 right-2 flex gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setEditingItem(item)
                                    setNewItem({
                                      name: item.name,
                                      description: item.description,
                                      price: item.price.toString(),
                                      available: item.available,
                                      inStock: item.inStock,
                                      tasteTags: item.tasteTags || [],
                                      promoTags: item.promoTags || [],
                                    })
                                    setShowEditItem(true)
                                  }}
                                  className="h-6 w-6 p-0"
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteItem(category.id, item.id)}
                                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>

                              <div className="pr-12 mb-3">
                                <h4 className="font-medium text-gray-900 text-sm mb-1">{item.name}</h4>
                                <p className="text-xs text-gray-600 line-clamp-2">{item.description}</p>
                              </div>

                              <div className="flex items-center justify-between mb-3">
                                <div className="text-lg font-semibold text-gray-900">${item.price.toFixed(2)}</div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handleToggleAvailability(category.id, item.id)}
                                    className={`w-3 h-3 rounded-full ${item.available ? "bg-green-500" : "bg-gray-400"}`}
                                    title={item.available ? "Available" : "Unavailable"}
                                  />
                                  <button
                                    onClick={() => handleToggleStock(category.id, item.id)}
                                    className="text-xs px-2 py-1 rounded border"
                                    style={{
                                      backgroundColor: item.inStock ? "#f0f9ff" : "#fef2f2",
                                      borderColor: item.inStock ? "#0ea5e9" : "#ef4444",
                                      color: item.inStock ? "#0ea5e9" : "#ef4444",
                                    }}
                                  >
                                    {item.inStock ? "In Stock" : "Out of Stock"}
                                  </button>
                                </div>
                              </div>

                              {/* Tags */}
                              <div className="flex flex-wrap gap-1">
                                {item.tasteTags?.slice(0, 2).map((tag) => {
                                  const config = tasteTagsConfig[tag as keyof typeof tasteTagsConfig]
                                  if (!config) return null
                                  const Icon = config.icon
                                  return (
                                    <Badge key={tag} variant="outline" className={`text-xs ${config.color}`}>
                                      <Icon className="w-2.5 h-2.5 mr-1" />
                                      {config.label}
                                    </Badge>
                                  )
                                })}
                                {item.promoTags?.slice(0, 1).map((tag) => {
                                  const config = promoTagsConfig[tag as keyof typeof promoTagsConfig]
                                  if (!config) return null
                                  return (
                                    <Badge key={tag} variant="outline" className={`text-xs ${config.color}`}>
                                      {config.label}
                                    </Badge>
                                  )
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights">
            {menuData.categories.length === 0 ? (
              <div className="text-center py-12">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Insights Yet</h3>
                <p className="text-gray-600 text-sm mb-4">Add menu items to generate insights and analytics</p>
                <Button onClick={() => setActiveTab("menu")} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Menu Items
                </Button>
              </div>
            ) : !insightsData ? (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Generate Menu Insights</h3>
                  <p className="text-gray-600 mb-6">
                    Get AI-powered insights about your menu performance, pricing optimization, and growth opportunities.
                  </p>
                  <Button
                    onClick={handleGenerateInsights}
                    disabled={isGeneratingInsights}
                    className="bg-black hover:bg-gray-800 text-white"
                  >
                    {isGeneratingInsights ? (
                      <>
                        <BarChart3 className="w-4 h-4 mr-2 animate-spin" />
                        Generating Insights...
                      </>
                    ) : (
                      <>
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Generate Insights
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <Tabs value={insightsTab} onValueChange={setInsightsTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="insights">Insights</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                  </TabsList>

                  <TabsContent value="insights">
                    <div className="space-y-6">
                      {/* Pricing Insights */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                          Pricing Insights
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2">
                          {insightsData.insights
                            .filter((insight: any) => insight.type === "pricing")
                            .map((insight: any) => (
                              <Card key={insight.id}>
                                <CardHeader className="pb-3">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <CardTitle className="text-base">{insight.title}</CardTitle>
                                      <CardDescription className="text-sm">{insight.description}</CardDescription>
                                    </div>
                                    <Badge
                                      variant={
                                        insight.impact === "high"
                                          ? "destructive"
                                          : insight.impact === "medium"
                                            ? "default"
                                            : "secondary"
                                      }
                                      className="text-xs"
                                    >
                                      {insight.impact}
                                    </Badge>
                                  </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                  <p className="text-sm text-gray-700 mb-3">{insight.recommendation}</p>
                                  {insight.potentialRevenue && (
                                    <div className="mb-3">
                                      <Badge
                                        variant="outline"
                                        className={`text-xs ${
                                          insight.potentialRevenue > 0
                                            ? "bg-green-50 text-green-700 border-green-200"
                                            : "bg-red-50 text-red-700 border-red-200"
                                        }`}
                                      >
                                        {insight.potentialRevenue > 0 ? "+" : ""}${insight.potentialRevenue}/month
                                      </Badge>
                                    </div>
                                  )}
                                  <Button
                                    onClick={() => handleInsightCTA(insight.cta)}
                                    size="sm"
                                    className="w-full bg-black hover:bg-gray-800 text-white"
                                  >
                                    {insight.cta.label}
                                  </Button>
                                </CardContent>
                              </Card>
                            ))}
                        </div>
                      </div>

                      {/* Menu Balance Insights */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <Target className="w-5 h-5 mr-2 text-blue-600" />
                          Menu Balance
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2">
                          {insightsData.insights
                            .filter((insight: any) => insight.type === "menu-balance")
                            .map((insight: any) => (
                              <Card key={insight.id}>
                                <CardHeader className="pb-3">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <CardTitle className="text-base">{insight.title}</CardTitle>
                                      <CardDescription className="text-sm">{insight.description}</CardDescription>
                                    </div>
                                    <Badge
                                      variant={
                                        insight.impact === "high"
                                          ? "destructive"
                                          : insight.impact === "medium"
                                            ? "default"
                                            : "secondary"
                                      }
                                      className="text-xs"
                                    >
                                      {insight.impact}
                                    </Badge>
                                  </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                  <p className="text-sm text-gray-700 mb-3">{insight.recommendation}</p>
                                  <Button
                                    onClick={() => handleInsightCTA(insight.cta)}
                                    size="sm"
                                    className="w-full bg-black hover:bg-gray-800 text-white"
                                  >
                                    {insight.cta.label}
                                  </Button>
                                </CardContent>
                              </Card>
                            ))}
                        </div>
                      </div>

                      {/* Opportunities */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                          Opportunities
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2">
                          {insightsData.insights
                            .filter((insight: any) => insight.type === "opportunities")
                            .map((insight: any) => (
                              <Card key={insight.id}>
                                <CardHeader className="pb-3">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <CardTitle className="text-base">{insight.title}</CardTitle>
                                      <CardDescription className="text-sm">{insight.description}</CardDescription>
                                    </div>
                                    <Badge
                                      variant={
                                        insight.impact === "high"
                                          ? "destructive"
                                          : insight.impact === "medium"
                                            ? "default"
                                            : "secondary"
                                      }
                                      className="text-xs"
                                    >
                                      {insight.impact}
                                    </Badge>
                                  </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                  <p className="text-sm text-gray-700 mb-3">{insight.recommendation}</p>
                                  {insight.potentialRevenue && (
                                    <div className="mb-3">
                                      <Badge
                                        variant="outline"
                                        className="text-xs bg-green-50 text-green-700 border-green-200"
                                      >
                                        +${insight.potentialRevenue}/month potential
                                      </Badge>
                                    </div>
                                  )}
                                  <Button
                                    onClick={() => handleInsightCTA(insight.cta)}
                                    size="sm"
                                    className="w-full bg-black hover:bg-gray-800 text-white"
                                  >
                                    {insight.cta.type === "explore-ideas" && <ExternalLink className="w-3 h-3 mr-1" />}
                                    {insight.cta.label}
                                  </Button>
                                </CardContent>
                              </Card>
                            ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="performance">
                    <div className="space-y-6">
                      {/* Menu Score */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Star className="w-5 h-5 text-yellow-500" />
                            <span>Menu Score</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center space-x-6 mb-6">
                            <div className="text-4xl font-bold text-gray-900">{insightsData.performance.menuScore}</div>
                            <div className="text-sm text-gray-600">/10</div>
                          </div>

                          <div className="space-y-3">
                            <h4 className="font-medium text-gray-900">Score Breakdown</h4>
                            {Object.entries(insightsData.performance.scoreBreakdown).map(([key, value]) => (
                              <div key={key} className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 capitalize">
                                  {key.replace(/([A-Z])/g, " $1")}
                                </span>
                                <div className="flex items-center space-x-2">
                                  <Progress value={(value as number) * 10} className="w-20 h-2" />
                                  <span className="text-sm font-medium w-8">{value}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Top Performing Items */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                          Top Performing Items
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2">
                          {insightsData.performance.topPerforming.map((item: any) => (
                            <Card key={item.id}>
                              <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <CardTitle className="text-base">{item.name}</CardTitle>
                                    <div className="flex items-center space-x-4 mt-1">
                                      <span className="text-sm text-gray-600">{item.sales} orders</span>
                                      <span className="text-sm text-gray-600">${item.revenue}</span>
                                      <div className="flex items-center">
                                        <Star className="w-3 h-3 text-yellow-500 mr-1" />
                                        <span className="text-sm">{item.rating}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${
                                      item.trend === "increasing"
                                        ? "bg-green-50 text-green-700 border-green-200"
                                        : "bg-blue-50 text-blue-700 border-blue-200"
                                    }`}
                                  >
                                    {item.trend}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="pt-0">
                                <Button
                                  onClick={() => handleInsightCTA(item.cta)}
                                  size="sm"
                                  className="w-full bg-black hover:bg-gray-800 text-white"
                                >
                                  {item.cta.label}
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>

                      {/* Under Performing Items */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                          Under Performing Items
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2">
                          {insightsData.performance.underPerforming.map((item: any) => (
                            <Card key={item.id}>
                              <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <CardTitle className="text-base">{item.name}</CardTitle>
                                    <div className="flex items-center space-x-4 mt-1">
                                      <span className="text-sm text-gray-600">{item.sales} orders</span>
                                      <span className="text-sm text-gray-600">${item.revenue}</span>
                                      <div className="flex items-center">
                                        <Star className="w-3 h-3 text-yellow-500 mr-1" />
                                        <span className="text-sm">{item.rating}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                                    {item.trend}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="pt-0">
                                <div className="mb-3">
                                  <h5 className="text-sm font-medium text-gray-900 mb-1">Issues:</h5>
                                  <ul className="text-xs text-gray-600 space-y-1">
                                    {item.issues.map((issue: string, index: number) => (
                                      <li key={index}>• {issue}</li>
                                    ))}
                                  </ul>
                                </div>
                                <Button
                                  onClick={() => handleInsightCTA(item.cta)}
                                  size="sm"
                                  className="w-full bg-black hover:bg-gray-800 text-white"
                                >
                                  {item.cta.label}
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>

                      {/* Performance Recommendations */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <ArrowUpRight className="w-5 h-5 mr-2 text-blue-600" />
                          Recommendations
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {insightsData.performance.recommendations.map((rec: any) => (
                            <Card key={rec.id}>
                              <CardHeader className="pb-3">
                                <CardTitle className="text-base">{rec.title}</CardTitle>
                                <CardDescription className="text-sm">{rec.description}</CardDescription>
                              </CardHeader>
                              <CardContent className="pt-0">
                                <Button
                                  onClick={() => handleInsightCTA(rec.cta)}
                                  size="sm"
                                  className="w-full bg-black hover:bg-gray-800 text-white"
                                >
                                  {rec.cta.type === "change-design" && <Palette className="w-3 h-3 mr-1" />}
                                  {rec.cta.type === "reorder-category" && <Move className="w-3 h-3 mr-1" />}
                                  {rec.cta.type === "add-item-description" && <FileText className="w-3 h-3 mr-1" />}
                                  {rec.cta.label}
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </TabsContent>

          {/* AI Tools Tab */}
          <TabsContent value="ai-tools">
            <div className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <MenuContentGenerator
                    onContentGenerated={handleContentGenerated}
                    existingMenuData={menuData}
                    className="h-full"
                  />
                </div>
                <div>
                  <ContentHistoryTimeline
                    key={refreshHistory}
                    onContentApplied={handleContentApplied}
                    className="h-full"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <ImportModal />
        <EditCategoryModal />
        <EditItemModal />

        {showExtractModal && (
          <MenuExtractModal
            isOpen={showExtractModal}
            onClose={() => setShowExtractModal(false)}
            onMenuExtracted={handleMenuExtracted}
          />
        )}

        {showGeneratedContent && generatedContent && (
          <GeneratedContentViewer
            isOpen={showGeneratedContent}
            onClose={() => setShowGeneratedContent(false)}
            content={generatedContent}
            onApply={(appliedData) => handleContentApplied(generatedContent, appliedData)}
          />
        )}

        {/* Menu Preview Modal */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Menu Preview</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {menuData.categories
                .filter((category) => category.items.some((item) => item.available && item.inStock))
                .map((category) => (
                  <div key={category.id}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{category.name}</h3>
                    <div className="space-y-3">
                      {category.items
                        .filter((item) => item.available && item.inStock)
                        .map((item) => (
                          <div key={item.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{item.name}</h4>
                              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {item.tasteTags?.map((tag) => {
                                  const config = tasteTagsConfig[tag as keyof typeof tasteTagsConfig]
                                  if (!config) return null
                                  const Icon = config.icon
                                  return (
                                    <Badge key={tag} variant="outline" className={`text-xs ${config.color}`}>
                                      <Icon className="w-2.5 h-2.5 mr-1" />
                                      {config.label}
                                    </Badge>
                                  )
                                })}
                                {item.promoTags?.map((tag) => {
                                  const config = promoTagsConfig[tag as keyof typeof promoTagsConfig]
                                  if (!config) return null
                                  return (
                                    <Badge key={tag} variant="outline" className={`text-xs ${config.color}`}>
                                      {config.label}
                                    </Badge>
                                  )
                                })}
                              </div>
                            </div>
                            <div className="text-lg font-semibold text-gray-900 ml-4">${item.price.toFixed(2)}</div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Onboarding Continue Button */}
        {isOnboarding && (
          <div className="fixed bottom-6 right-6">
            <Button onClick={handleContinueOnboarding} className="bg-black hover:bg-gray-800 text-white shadow-lg">
              Continue Setup
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
