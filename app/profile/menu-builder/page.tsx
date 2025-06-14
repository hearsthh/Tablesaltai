"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Upload,
  ImageIcon,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Share2,
  Zap,
  TrendingUp,
  CheckCircle,
  XCircle,
  Tag,
  Palette,
  BarChart3,
  DollarSign,
  Users,
  Search,
  Filter,
  MoreHorizontal,
  Sparkles,
  Award,
  Heart,
  Flame,
  Leaf,
  Coffee,
  Utensils,
  ChevronRight,
  Target,
  Activity,
  MenuIcon,
  X,
  Calendar,
  FileText,
  Loader2,
} from "lucide-react"

// Expanded mock data with 25 items across 6 categories
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
          tasteTags: ["spicy", "vegetarian"],
          promoTags: ["popular", "signature"],
          insights: {
            sales: "high",
            pricing: "optimal",
            trend: "increasing",
            suggestions: ["Consider raising price by $1", "Add to combo offers"],
          },
        },
        {
          id: "2",
          name: "Chicken Wings",
          description: "Spicy buffalo wings with ranch dip",
          price: 12.99,
          image: "/placeholder.svg?height=80&width=80",
          available: false,
          tasteTags: ["spicy", "non-vegetarian"],
          promoTags: ["must-try"],
          insights: {
            sales: "medium",
            pricing: "underpriced",
            trend: "stable",
            suggestions: ["Increase price to $15.99", "Promote more actively"],
          },
        },
        {
          id: "3",
          name: "Paneer Tikka",
          description: "Grilled cottage cheese marinated in aromatic spices",
          price: 10.99,
          image: "/placeholder.svg?height=80&width=80",
          available: true,
          tasteTags: ["mild", "vegetarian"],
          promoTags: ["chef-special"],
          insights: {
            sales: "high",
            pricing: "optimal",
            trend: "increasing",
            suggestions: ["Feature in vegetarian combo", "Add seasonal variant"],
          },
        },
        {
          id: "4",
          name: "Fish Pakora",
          description: "Crispy fish fritters with mint chutney",
          price: 11.99,
          image: "/placeholder.svg?height=80&width=80",
          available: true,
          tasteTags: ["spicy", "non-vegetarian"],
          promoTags: ["popular"],
          insights: {
            sales: "medium",
            pricing: "optimal",
            trend: "stable",
            suggestions: ["Promote during monsoon", "Bundle with drinks"],
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
          id: "5",
          name: "Butter Chicken",
          description: "Tender chicken in rich tomato-based curry",
          price: 16.99,
          image: "/placeholder.svg?height=80&width=80",
          available: true,
          tasteTags: ["mild", "non-vegetarian", "creamy"],
          promoTags: ["signature", "top-rated"],
          insights: {
            sales: "very-high",
            pricing: "optimal",
            trend: "increasing",
            suggestions: ["Create combo with rice", "Feature in seasonal menu"],
          },
        },
        {
          id: "6",
          name: "Dal Makhani",
          description: "Slow-cooked black lentils in creamy tomato gravy",
          price: 13.99,
          image: "/placeholder.svg?height=80&width=80",
          available: true,
          tasteTags: ["mild", "vegetarian", "creamy"],
          promoTags: ["signature"],
          insights: {
            sales: "high",
            pricing: "optimal",
            trend: "stable",
            suggestions: ["Pair with bread combo", "Highlight protein content"],
          },
        },
        {
          id: "7",
          name: "Lamb Biryani",
          description: "Fragrant basmati rice with tender lamb and aromatic spices",
          price: 19.99,
          image: "/placeholder.svg?height=80&width=80",
          available: true,
          tasteTags: ["spicy", "non-vegetarian"],
          promoTags: ["chef-special", "must-try"],
          insights: {
            sales: "high",
            pricing: "underpriced",
            trend: "increasing",
            suggestions: ["Increase price to $22.99", "Add raita combo"],
          },
        },
        {
          id: "8",
          name: "Palak Paneer",
          description: "Cottage cheese in creamy spinach gravy",
          price: 14.99,
          image: "/placeholder.svg?height=80&width=80",
          available: true,
          tasteTags: ["mild", "vegetarian", "healthy"],
          promoTags: ["popular"],
          insights: {
            sales: "medium",
            pricing: "optimal",
            trend: "stable",
            suggestions: ["Promote health benefits", "Add to lunch specials"],
          },
        },
        {
          id: "9",
          name: "Fish Curry",
          description: "Fresh fish in coconut-based curry sauce",
          price: 17.99,
          image: "/placeholder.svg?height=80&width=80",
          available: true,
          tasteTags: ["spicy", "non-vegetarian"],
          promoTags: [],
          insights: {
            sales: "low",
            pricing: "overpriced",
            trend: "declining",
            suggestions: ["Reduce price to $15.99", "Consider seasonal promotion"],
          },
        },
        {
          id: "10",
          name: "Chicken Tikka Masala",
          description: "Grilled chicken in creamy tomato sauce",
          price: 15.99,
          image: "/placeholder.svg?height=80&width=80",
          available: true,
          tasteTags: ["mild", "non-vegetarian", "creamy"],
          promoTags: ["popular"],
          insights: {
            sales: "high",
            pricing: "optimal",
            trend: "stable",
            suggestions: ["Bundle with naan", "Feature in dinner specials"],
          },
        },
      ],
    },
    {
      id: "3",
      name: "Breads & Rice",
      description: "Freshly baked breads and aromatic rice dishes",
      items: [
        {
          id: "11",
          name: "Garlic Naan",
          description: "Soft bread topped with fresh garlic and herbs",
          price: 3.99,
          image: "/placeholder.svg?height=80&width=80",
          available: true,
          tasteTags: ["mild", "vegetarian"],
          promoTags: ["popular"],
          insights: {
            sales: "very-high",
            pricing: "optimal",
            trend: "stable",
            suggestions: ["Bundle with curries", "Offer family pack"],
          },
        },
        {
          id: "12",
          name: "Basmati Rice",
          description: "Fragrant long-grain rice, perfectly steamed",
          price: 4.99,
          image: "/placeholder.svg?height=80&width=80",
          available: true,
          tasteTags: ["mild", "vegetarian", "vegan"],
          promoTags: [],
          insights: {
            sales: "high",
            pricing: "optimal",
            trend: "stable",
            suggestions: ["Bundle with curries", "Offer saffron variant"],
          },
        },
        {
          id: "13",
          name: "Cheese Naan",
          description: "Bread stuffed with melted cheese",
          price: 5.99,
          image: "/placeholder.svg?height=80&width=80",
          available: true,
          tasteTags: ["mild", "vegetarian"],
          promoTags: ["kids-special"],
          insights: {
            sales: "medium",
            pricing: "optimal",
            trend: "increasing",
            suggestions: ["Promote to families", "Add to kids menu"],
          },
        },
        {
          id: "14",
          name: "Jeera Rice",
          description: "Cumin-flavored basmati rice",
          price: 5.99,
          image: "/placeholder.svg?height=80&width=80",
          available: true,
          tasteTags: ["mild", "vegetarian", "vegan"],
          promoTags: [],
          insights: {
            sales: "medium",
            pricing: "optimal",
            trend: "stable",
            suggestions: ["Pair with dal dishes", "Highlight aromatic qualities"],
          },
        },
      ],
    },
    {
      id: "4",
      name: "Beverages",
      description: "Refreshing drinks and traditional beverages",
      items: [
        {
          id: "15",
          name: "Mango Lassi",
          description: "Creamy yogurt drink with fresh mango",
          price: 4.99,
          image: "/placeholder.svg?height=80&width=80",
          available: true,
          tasteTags: ["mild", "vegetarian"],
          promoTags: ["popular", "signature"],
          insights: {
            sales: "high",
            pricing: "optimal",
            trend: "seasonal",
            suggestions: ["Promote in summer", "Add seasonal fruit variants"],
          },
        },
        {
          id: "16",
          name: "Masala Chai",
          description: "Traditional spiced tea with milk",
          price: 2.99,
          image: "/placeholder.svg?height=80&width=80",
          available: true,
          tasteTags: ["spicy", "vegetarian"],
          promoTags: ["signature"],
          insights: {
            sales: "very-high",
            pricing: "optimal",
            trend: "stable",
            suggestions: ["Offer refills", "Bundle with snacks"],
          },
        },
        {
          id: "17",
          name: "Fresh Lime Soda",
          description: "Refreshing lime drink with soda water",
          price: 3.99,
          image: "/placeholder.svg?height=80&width=80",
          available: true,
          tasteTags: ["mild", "vegan"],
          promoTags: [],
          insights: {
            sales: "medium",
            pricing: "optimal",
            trend: "seasonal",
            suggestions: ["Promote in summer", "Add mint variant"],
          },
        },
        {
          id: "18",
          name: "Rose Milk",
          description: "Chilled milk flavored with rose syrup",
          price: 4.49,
          image: "/placeholder.svg?height=80&width=80",
          available: true,
          tasteTags: ["mild", "vegetarian"],
          promoTags: ["kids-special"],
          insights: {
            sales: "low",
            pricing: "optimal",
            trend: "declining",
            suggestions: ["Target kids menu", "Add colorful presentation"],
          },
        },
      ],
    },
    {
      id: "5",
      name: "Desserts",
      description: "Sweet endings to your perfect meal",
      items: [
        {
          id: "19",
          name: "Gulab Jamun",
          description: "Soft milk dumplings in sweet syrup",
          price: 5.99,
          image: "/placeholder.svg?height=80&width=80",
          available: true,
          tasteTags: ["mild", "vegetarian"],
          promoTags: ["signature", "popular"],
          insights: {
            sales: "high",
            pricing: "optimal",
            trend: "stable",
            suggestions: ["Offer warm serving", "Bundle with meals"],
          },
        },
        {
          id: "20",
          name: "Kulfi",
          description: "Traditional Indian ice cream with cardamom",
          price: 4.99,
          image: "/placeholder.svg?height=80&width=80",
          available: true,
          tasteTags: ["mild", "vegetarian"],
          promoTags: ["must-try"],
          insights: {
            sales: "medium",
            pricing: "optimal",
            trend: "seasonal",
            suggestions: ["Promote in summer", "Add pistachio variant"],
          },
        },
        {
          id: "21",
          name: "Ras Malai",
          description: "Cottage cheese dumplings in sweetened milk",
          price: 6.99,
          image: "/placeholder.svg?height=80&width=80",
          available: true,
          tasteTags: ["mild", "vegetarian"],
          promoTags: ["chef-special"],
          insights: {
            sales: "medium",
            pricing: "optimal",
            trend: "stable",
            suggestions: ["Highlight homemade quality", "Feature in festivals"],
          },
        },
      ],
    },
    {
      id: "6",
      name: "Snacks",
      description: "Light bites and street food favorites",
      items: [
        {
          id: "22",
          name: "Pani Puri",
          description: "Crispy shells with spiced water and chutneys",
          price: 6.99,
          image: "/placeholder.svg?height=80&width=80",
          available: true,
          tasteTags: ["spicy", "vegetarian"],
          promoTags: ["popular", "must-try"],
          insights: {
            sales: "high",
            pricing: "optimal",
            trend: "increasing",
            suggestions: ["Offer different spice levels", "Add to sharing menu"],
          },
        },
        {
          id: "23",
          name: "Bhel Puri",
          description: "Puffed rice salad with tangy chutneys",
          price: 5.99,
          image: "/placeholder.svg?height=80&width=80",
          available: true,
          tasteTags: ["spicy", "vegetarian", "vegan"],
          promoTags: ["popular"],
          insights: {
            sales: "medium",
            pricing: "optimal",
            trend: "stable",
            suggestions: ["Promote as healthy snack", "Add to evening menu"],
          },
        },
        {
          id: "24",
          name: "Aloo Tikki",
          description: "Crispy potato patties with chutneys",
          price: 4.99,
          image: "/placeholder.svg?height=80&width=80",
          available: true,
          tasteTags: ["spicy", "vegetarian", "vegan"],
          promoTags: [],
          insights: {
            sales: "low",
            pricing: "optimal",
            trend: "stable",
            suggestions: ["Bundle with beverages", "Add cheese variant"],
          },
        },
        {
          id: "25",
          name: "Dahi Vada",
          description: "Lentil dumplings in spiced yogurt",
          price: 5.49,
          image: "/placeholder.svg?height=80&width=80",
          available: true,
          tasteTags: ["mild", "vegetarian"],
          promoTags: [],
          insights: {
            sales: "low",
            pricing: "optimal",
            trend: "declining",
            suggestions: ["Promote cooling properties", "Feature in summer menu"],
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

const aiGenerationOptions = {
  insights: [
    { id: "menu-insights", name: "Menu Level Insights", description: "Overall menu performance and optimization" },
    { id: "item-insights", name: "Item Level Insights", description: "Individual item analysis and recommendations" },
    { id: "brand-insights", name: "Brand Design Insights", description: "Font, color, and styling recommendations" },
    { id: "pricing-insights", name: "Pricing Analysis", description: "Price optimization suggestions" },
    { id: "trend-insights", name: "Trend Analysis", description: "Market trends and opportunities" },
  ],
  content: [
    { id: "item-descriptions", name: "Item Descriptions", description: "Generate appetizing descriptions for items" },
    { id: "menu-preview", name: "Full Menu Preview", description: "Complete styled menu with descriptions" },
    { id: "item-cards", name: "Item Display Cards", description: "Individual item showcase cards" },
    { id: "menu-profile", name: "Menu Profile Card", description: "Restaurant menu summary card" },
    { id: "combos", name: "Combo Suggestions", description: "Create attractive combo offers" },
    { id: "seasonal-menu", name: "Seasonal Menu", description: "Event and season-based menus" },
    { id: "menu-templates", name: "Menu Templates", description: "Professional menu layouts" },
    { id: "item-tags", name: "Item Tags", description: "Auto-assign relevant tags to items" },
  ],
}

const mockLogs = [
  { id: 1, time: "2 mins ago", action: "Generated descriptions for 5 items", type: "ai", user: "AI Assistant" },
  { id: 2, time: "5 mins ago", action: "Updated price for Samosa Chaat", type: "user", user: "You" },
  { id: 3, time: "10 mins ago", action: "Added new item: Chicken Wings", type: "user", user: "You" },
  { id: 4, time: "15 mins ago", action: "Generated menu insights", type: "ai", user: "AI Assistant" },
  { id: 5, time: "1 hour ago", action: "Imported menu from Zomato", type: "system", user: "System" },
  { id: 6, time: "2 hours ago", action: "Generated seasonal menu for winter", type: "ai", user: "AI Assistant" },
  { id: 7, time: "3 hours ago", action: "Created combo suggestions", type: "ai", user: "AI Assistant" },
  { id: 8, time: "4 hours ago", action: "Updated brand design insights", type: "ai", user: "AI Assistant" },
]

// Mock AI generation results
const mockAIResults = {
  // ... existing results ...
  "menu-insights": {
    title: "Menu Level Insights",
    data: {
      overallScore: 8.5,
      categories: 6,
      totalItems: 25,
      averagePrice: 9.87,
      recommendations: [
        "Add more dessert options to increase average order value",
        "Consider creating combo meals to boost sales",
        "Seasonal menu items could drive 15% more revenue",
        "Vegetarian options are well-balanced at 52% of menu",
      ],
      performance: {
        topCategory: "Main Course (68% of sales)",
        underperforming: "Snacks (12% of sales)",
        priceRange: "Well distributed across $2.99-$19.99",
        menuLength: "Optimal at 25 items",
      },
    },
  },
  "item-insights": {
    title: "Item Level Insights",
    data: [
      {
        item: "Butter Chicken",
        insights: ["Top performer with 87% satisfaction", "Consider premium variant", "Perfect for combo meals"],
        actions: ["Create family size option", "Feature in marketing"],
      },
      {
        item: "Fish Curry",
        insights: ["Underperforming at current price", "Limited appeal", "Seasonal demand"],
        actions: ["Reduce price to $15.99", "Add to lunch specials", "Consider removal"],
      },
      {
        item: "Lamb Biryani",
        insights: ["High demand, underpriced", "Premium positioning opportunity", "Signature dish potential"],
        actions: ["Increase price to $22.99", "Feature prominently", "Add premium garnish"],
      },
    ],
  },
  "brand-insights": {
    title: "Brand Design Insights",
    data: {
      colorScheme: {
        current: "Traditional red and gold",
        recommendation: "Modern warm tones with green accents",
        reasoning: "Appeals to health-conscious diners while maintaining warmth",
      },
      typography: {
        current: "Mixed fonts",
        recommendation: "Consistent modern serif for headings, clean sans-serif for body",
        reasoning: "Improves readability and creates premium feel",
      },
      layout: {
        current: "Category-based listing",
        recommendation: "Visual grid with hero items featured",
        reasoning: "Increases visual appeal and highlights bestsellers",
      },
      imagery: {
        recommendation: "Professional food photography with consistent lighting",
        style: "Clean, appetizing shots with minimal props",
      },
    },
  },
  "item-descriptions": {
    title: "Generated Item Descriptions",
    data: [
      {
        item: "Samosa Chaat",
        original: "Crispy samosas topped with tangy chutneys and yogurt",
        generated:
          "Golden, flaky samosas burst with spiced potato filling, artfully topped with cooling yogurt, tangy tamarind chutney, and fresh mint. A symphony of textures and flavors that dance on your palate.",
      },
      {
        item: "Butter Chicken",
        original: "Tender chicken in rich tomato-based curry",
        generated:
          "Succulent pieces of tandoor-grilled chicken swimming in our signature velvety tomato curry, enriched with cream and aromatic spices. A timeless classic that embodies comfort in every bite.",
      },
      {
        item: "Mango Lassi",
        original: "Creamy yogurt drink with fresh mango",
        generated:
          "A tropical paradise in a glass - thick, creamy yogurt blended with the sweetest Alphonso mangoes, creating a refreshing escape that perfectly balances richness with fruity brightness.",
      },
    ],
  },
  combos: {
    title: "AI-Generated Combo Suggestions",
    data: [
      {
        name: "Spice Lover's Feast",
        items: ["Chicken Wings", "Lamb Biryani", "Masala Chai"],
        originalPrice: 35.97,
        comboPrice: 29.99,
        savings: 5.98,
        description: "For those who love bold flavors and heat",
      },
      {
        name: "Vegetarian Delight",
        items: ["Paneer Tikka", "Dal Makhani", "Garlic Naan", "Mango Lassi"],
        originalPrice: 29.96,
        comboPrice: 24.99,
        savings: 4.97,
        description: "A complete vegetarian experience",
      },
      {
        name: "Family Dinner Special",
        items: ["Butter Chicken", "Palak Paneer", "Basmati Rice", "Garlic Naan", "Gulab Jamun"],
        originalPrice: 46.95,
        comboPrice: 39.99,
        savings: 6.96,
        description: "Perfect for sharing with loved ones",
      },
    ],
  },
  "seasonal-menu": {
    title: "Winter Special Menu",
    data: {
      theme: "Warm & Comforting Winter Delights",
      duration: "December - February",
      items: [
        {
          name: "Hot Chocolate Kulfi",
          description: "Traditional kulfi infused with rich hot chocolate flavors",
          price: 6.99,
          category: "Desserts",
        },
        {
          name: "Winter Spice Chai",
          description: "Extra warming blend with cinnamon, cardamom, and ginger",
          price: 3.49,
          category: "Beverages",
        },
        {
          name: "Hearty Lentil Soup",
          description: "Warming mixed lentil soup with winter vegetables",
          price: 7.99,
          category: "Appetizers",
        },
      ],
      marketing: "Embrace the warmth of winter with our specially crafted seasonal menu",
    },
  },
  "trend-insights": {
    title: "Market Trends Analysis",
    data: {
      trending: [
        {
          trend: "Plant-Based Options",
          growth: "+23%",
          impact: "High",
          description: "Increasing demand for vegan alternatives",
        },
        {
          trend: "Fusion Cuisine",
          growth: "+18%",
          impact: "Medium",
          description: "Creative combinations gaining popularity",
        },
        {
          trend: "Healthy Bowls",
          growth: "+15%",
          impact: "High",
          description: "Nutritious, Instagram-worthy presentations",
        },
        {
          trend: "Comfort Food Revival",
          growth: "+12%",
          impact: "Medium",
          description: "Traditional dishes with modern twists",
        },
      ],
      declining: [
        {
          trend: "Heavy Fried Items",
          decline: "-8%",
          impact: "Medium",
          description: "Health-conscious consumers avoiding",
        },
        {
          trend: "Large Portions",
          decline: "-5%",
          impact: "Low",
          description: "Preference for smaller, quality portions",
        },
      ],
      opportunities: [
        "Add quinoa and superfood bowls",
        "Create Instagram-worthy plating",
        "Introduce seasonal limited-time offers",
        "Develop signature fusion dishes",
      ],
    },
  },
  "item-cards": {
    title: "Generated Item Display Cards",
    data: [
      {
        id: "card-1",
        itemName: "Butter Chicken",
        design: "premium",
        layout: "hero-style",
        features: ["High-quality image", "Nutritional info", "Allergen badges", "Chef's note"],
        preview: "/placeholder.svg?height=300&width=400&text=Butter+Chicken+Card",
      },
      {
        id: "card-2",
        itemName: "Mango Lassi",
        design: "fresh",
        layout: "minimal",
        features: ["Seasonal badge", "Ingredient highlights", "Refreshing theme", "Summer colors"],
        preview: "/placeholder.svg?height=300&width=400&text=Mango+Lassi+Card",
      },
      {
        id: "card-3",
        itemName: "Lamb Biryani",
        design: "traditional",
        layout: "detailed",
        features: ["Heritage story", "Spice level indicator", "Cooking method", "Pairing suggestions"],
        preview: "/placeholder.svg?height=300&width=400&text=Lamb+Biryani+Card",
      },
    ],
  },
  "menu-profile": {
    title: "Restaurant Menu Profile Card",
    data: {
      restaurantName: "Spice Garden",
      tagline: "Authentic Indian Cuisine with Modern Flair",
      highlights: ["25 Signature Dishes", "6 Diverse Categories", "Vegetarian Friendly (52%)", "Award-Winning Recipes"],
      stats: {
        avgRating: 4.8,
        totalReviews: 1247,
        priceRange: "$8.99 - $19.99",
        cuisineType: "Indian Fusion",
      },
      specialties: ["Butter Chicken", "Lamb Biryani", "Mango Lassi"],
      preview: "/placeholder.svg?height=400&width=600&text=Menu+Profile+Card",
    },
  },
  "menu-templates": {
    title: "Professional Menu Templates",
    data: [
      {
        id: "template-1",
        name: "Modern Minimalist",
        style: "Clean lines, plenty of white space, modern typography",
        preview: "/placeholder.svg?height=400&width=300&text=Modern+Template",
        features: ["Responsive design", "Easy customization", "Print-ready", "Digital optimized"],
      },
      {
        id: "template-2",
        name: "Traditional Elegant",
        style: "Classic borders, traditional fonts, warm colors",
        preview: "/placeholder.svg?height=400&width=300&text=Traditional+Template",
        features: ["Heritage feel", "Premium look", "Gold accents", "Formal layout"],
      },
      {
        id: "template-3",
        name: "Instagram Ready",
        style: "Visual-first, photo-centric, social media optimized",
        preview: "/placeholder.svg?height=400&width=300&text=Instagram+Template",
        features: ["Photo-focused", "Social sharing", "Mobile-first", "Trendy design"],
      },
    ],
  },
}

export default function MenuBuilderPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const [menuData, setMenuData] = useState(mockMenuData)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [isExtracting, setIsExtracting] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showItemDialog, setShowItemDialog] = useState(false)
  const [showCategoryDialog, setShowCategoryDialog] = useState(false)
  const [showAIGenerationDialog, setShowAIGenerationDialog] = useState(false)
  const [showExtractDialog, setShowExtractDialog] = useState(false)
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)
  const [showInsightDetail, setShowInsightDetail] = useState<any>(null)
  const [showAIResultDialog, setShowAIResultDialog] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("manage")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterAvailable, setFilterAvailable] = useState<boolean | null>(null)
  const [selectedAIOptions, setSelectedAIOptions] = useState<string[]>([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: "", description: "" })
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    tasteTags: [] as string[],
    promoTags: [] as string[],
    image: null as string | null,
  })

  const [generatedMenuCards, setGeneratedMenuCards] = useState<any[]>([])
  const [generatedMenuProfile, setGeneratedMenuProfile] = useState<any>(null)
  const [generatedMenuTemplates, setGeneratedMenuTemplates] = useState<any[]>([])
  const [brandSettings, setBrandSettings] = useState({
    colorScheme: "traditional",
    typography: "mixed",
    layout: "category-based",
  })

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setIsExtracting(true)
    setShowExtractDialog(false)

    // Simulate AI extraction
    setTimeout(() => {
      setIsExtracting(false)
      toast({
        title: "Menu Extracted Successfully",
        description: `Found ${Math.floor(Math.random() * 20) + 10} items across ${Math.floor(Math.random() * 5) + 3} categories.`,
      })
    }, 3000)
  }

  const handleImageUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string
      setNewItem((prev) => ({ ...prev, image: imageUrl }))
      toast({
        title: "Image Uploaded",
        description: "Item image has been uploaded successfully.",
      })
    }
    reader.readAsDataURL(file)
  }

  const handleAIGeneration = async () => {
    if (selectedAIOptions.length === 0) {
      toast({
        title: "No options selected",
        description: "Please select at least one generation option.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setShowAIGenerationDialog(false)

    // Simulate AI generation with realistic delay
    setTimeout(() => {
      setIsGenerating(false)

      // Show results for the first selected option
      const firstOption = selectedAIOptions[0]
      if (mockAIResults[firstOption as keyof typeof mockAIResults]) {
        setShowAIResultDialog({
          type: firstOption,
          data: mockAIResults[firstOption as keyof typeof mockAIResults],
        })
      }

      toast({
        title: "AI Generation Complete",
        description: `Generated ${selectedAIOptions.length} items successfully.`,
      })
      setSelectedAIOptions([])

      // Add to logs
      const newLog = {
        id: Date.now(),
        time: "Just now",
        action: `Generated ${selectedAIOptions.join(", ")}`,
        type: "ai" as const,
        user: "AI Assistant",
      }
      mockLogs.unshift(newLog)
    }, 4000)
  }

  const handleApplyBrandSettings = (setting: string, value: string) => {
    setBrandSettings((prev) => ({ ...prev, [setting]: value }))
    toast({
      title: "Brand Setting Applied",
      description: `${setting} has been updated to ${value}`,
    })
  }

  const handleApplyTemplate = (templateId: string) => {
    toast({
      title: "Template Applied",
      description: "Menu template has been applied successfully. Preview updated.",
    })
  }

  const handleGenerateItemCard = (itemId: string) => {
    // Simulate generating an item card
    const newCard = {
      id: `card-${Date.now()}`,
      itemId,
      generated: true,
      timestamp: new Date().toISOString(),
    }
    setGeneratedMenuCards((prev) => [...prev, newCard])
    toast({
      title: "Item Card Generated",
      description: "New display card created successfully.",
    })
  }

  const handleSingleAIGeneration = async (optionId: string) => {
    setIsGenerating(true)

    setTimeout(() => {
      setIsGenerating(false)

      if (mockAIResults[optionId as keyof typeof mockAIResults]) {
        setShowAIResultDialog({
          type: optionId,
          data: mockAIResults[optionId as keyof typeof mockAIResults],
        })
      }

      // Handle specific generation types
      if (optionId === "item-cards") {
        setGeneratedMenuCards(mockAIResults["item-cards"].data)
      } else if (optionId === "menu-profile") {
        setGeneratedMenuProfile(mockAIResults["menu-profile"].data)
      } else if (optionId === "menu-templates") {
        setGeneratedMenuTemplates(mockAIResults["menu-templates"].data)
      }

      toast({
        title: "AI Generation Complete",
        description: `Generated ${optionId.replace("-", " ")} successfully.`,
      })

      // Add to logs
      const newLog = {
        id: Date.now(),
        time: "Just now",
        action: `Generated ${optionId.replace("-", " ")}`,
        type: "ai" as const,
        user: "AI Assistant",
      }
      mockLogs.unshift(newLog)
    }, 2000)
  }

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      toast({
        title: "Category name required",
        description: "Please enter a category name.",
        variant: "destructive",
      })
      return
    }

    const category = {
      id: Date.now().toString(),
      name: newCategory.name,
      description: newCategory.description,
      items: [],
    }

    setMenuData((prev) => ({
      ...prev,
      categories: [...prev.categories, category],
    }))

    setNewCategory({ name: "", description: "" })
    setShowCategoryDialog(false)

    toast({
      title: "Category Added",
      description: `${newCategory.name} has been added to your menu.`,
    })
  }

  const handleAddItem = () => {
    if (!newItem.name.trim() || !newItem.price || !newItem.categoryId) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const item = {
      id: Date.now().toString(),
      name: newItem.name,
      description: newItem.description,
      price: Number.parseFloat(newItem.price),
      image: newItem.image,
      available: true,
      tasteTags: newItem.tasteTags,
      promoTags: newItem.promoTags,
      insights: {
        sales: "new",
        pricing: "optimal",
        trend: "stable",
        suggestions: ["Monitor initial performance", "Consider promotional pricing"],
      },
    }

    setMenuData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id === newItem.categoryId ? { ...cat, items: [...cat.items, item] } : cat,
      ),
    }))

    setNewItem({
      name: "",
      description: "",
      price: "",
      categoryId: "",
      tasteTags: [],
      promoTags: [],
      image: null,
    })
    setShowItemDialog(false)

    toast({
      title: "Item Added",
      description: `${item.name} has been added to your menu.`,
    })
  }

  const handleToggleAvailability = (itemId: string) => {
    setMenuData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) => ({
        ...cat,
        items: cat.items.map((item) => (item.id === itemId ? { ...item, available: !item.available } : item)),
      })),
    }))

    toast({
      title: "Item Updated",
      description: "Item availability has been updated.",
    })
  }

  const filteredCategories = menuData.categories
    .map((category) => ({
      ...category,
      items: category.items.filter((item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesAvailability = filterAvailable === null || item.available === filterAvailable
        const matchesCategory = selectedCategory === null || category.id === selectedCategory
        return matchesSearch && matchesAvailability && matchesCategory
      }),
    }))
    .filter((category) => selectedCategory === null || category.id === selectedCategory || category.items.length > 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs sm:text-sm">T</span>
              </div>
              <span className="text-lg sm:text-xl font-semibold">Menu Builder</span>
            </div>

            <div className="flex items-center space-x-2">
              {/* Extract Menu Button */}
              <Button size="sm" variant="outline" onClick={() => setShowExtractDialog(true)} className="hidden sm:flex">
                <Upload className="w-4 h-4 mr-2" />
                Extract
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowExtractDialog(true)} className="sm:hidden">
                <Upload className="w-4 h-4" />
              </Button>

              {/* AI Generate Button */}
              <Button
                size="sm"
                onClick={() => setShowAIGenerationDialog(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                disabled={isGenerating}
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                <span className="hidden sm:inline ml-2">Generate</span>
              </Button>

              {/* Mobile Menu Toggle */}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="sm:hidden"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <MenuIcon className="w-4 h-4" />}
              </Button>

              {/* Desktop Actions */}
              <div className="hidden sm:flex items-center space-x-2">
                <Button size="sm" variant="outline" onClick={() => setShowPreviewDialog(true)}>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button size="sm" variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden border-t bg-white py-2 space-y-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setShowPreviewDialog(true)
                  setMobileMenuOpen(false)
                }}
                className="w-full justify-start"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview Menu
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full justify-start"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Menu
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full justify-start"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Menu
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="manage" className="text-xs sm:text-sm">
              <Edit className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Manage</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="text-xs sm:text-sm">
              <BarChart3 className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Insights</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="text-xs sm:text-sm">
              <Sparkles className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Content</span>
            </TabsTrigger>
            <TabsTrigger value="logs" className="text-xs sm:text-sm">
              <Activity className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Logs</span>
            </TabsTrigger>
          </TabsList>

          {/* Manage Menu Tab */}
          <TabsContent value="manage" className="space-y-4 sm:space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search menu items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-9"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={filterAvailable?.toString() || "all"}
                      onValueChange={(value) => setFilterAvailable(value === "all" ? null : value === "true")}
                    >
                      <SelectTrigger className="w-32 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Items</SelectItem>
                        <SelectItem value="true">Available</SelectItem>
                        <SelectItem value="false">Sold Out</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" className="h-9">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Menu Categories and Items */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Categories Sidebar */}
              <Card className="lg:col-span-1">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base sm:text-lg">Categories</CardTitle>
                    <Button size="sm" onClick={() => setShowCategoryDialog(true)} className="h-7 w-7 p-0">
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1 pt-0">
                  <Button
                    variant={selectedCategory === null ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start h-8 text-xs sm:text-sm"
                    onClick={() => setSelectedCategory(null)}
                  >
                    All Items ({menuData.categories.reduce((acc, cat) => acc + cat.items.length, 0)})
                  </Button>
                  {menuData.categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start h-8 text-xs sm:text-sm"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.name} ({category.items.length})
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Menu Items */}
              <div className="lg:col-span-3 space-y-4">
                {filteredCategories.map((category) => (
                  <Card key={category.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base sm:text-lg">{category.name}</CardTitle>
                          <CardDescription className="text-xs sm:text-sm">{category.description}</CardDescription>
                        </div>
                        <div className="flex gap-1 sm:gap-2">
                          <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedItem(null)
                              setNewItem((prev) => ({ ...prev, categoryId: category.id }))
                              setShowItemDialog(true)
                            }}
                            className="h-7 px-2"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            <span className="hidden sm:inline">Add</span>
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {category.items.map((item) => (
                          <div key={item.id} className="border rounded-lg p-3 space-y-2">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className="font-medium text-sm sm:text-base truncate">{item.name}</h4>
                                  <div className="flex items-center space-x-1">
                                    <Switch
                                      checked={item.available}
                                      onCheckedChange={() => handleToggleAvailability(item.id)}
                                      size="sm"
                                    />
                                    {item.available ? (
                                      <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                                    ) : (
                                      <XCircle className="w-3 h-3 text-red-500 flex-shrink-0" />
                                    )}
                                  </div>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-bold text-sm sm:text-base">${item.price}</span>
                                  {item.image ? (
                                    <img
                                      src={item.image || "/placeholder.svg"}
                                      alt={item.name}
                                      className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0"
                                    />
                                  ) : (
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                      <ImageIcon className="w-4 h-4 sm:w-6 sm:h-6 text-gray-400" />
                                    </div>
                                  )}
                                </div>

                                {/* Tags */}
                                <div className="space-y-1">
                                  <div className="flex flex-wrap gap-1">
                                    {item.tasteTags.map((tag) => {
                                      const config = tasteTagsConfig[tag as keyof typeof tasteTagsConfig]
                                      if (!config) return null
                                      const Icon = config.icon
                                      return (
                                        <Badge key={tag} className={`${config.color} text-xs px-1.5 py-0.5 h-5`}>
                                          <Icon className="w-2.5 h-2.5 mr-1" />
                                          {config.label}
                                        </Badge>
                                      )
                                    })}
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    {item.promoTags.map((tag) => {
                                      const config = promoTagsConfig[tag as keyof typeof promoTagsConfig]
                                      if (!config) return null
                                      return (
                                        <Badge key={tag} className={`${config.color} text-xs px-1.5 py-0.5 h-5`}>
                                          {config.label}
                                        </Badge>
                                      )
                                    })}
                                  </div>
                                </div>
                              </div>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 ml-2 flex-shrink-0">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedItem(item)
                                      setShowItemDialog(true)
                                    }}
                                  >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Item
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleSingleAIGeneration("item-descriptions")}>
                                    <Zap className="w-4 h-4 mr-2" />
                                    Generate Description
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleSingleAIGeneration("item-tags")}>
                                    <Tag className="w-4 h-4 mr-2" />
                                    Generate Tags
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <ImageIcon className="w-4 h-4 mr-2" />
                                    Generate Image
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Item
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Menu Score */}
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow relative"
                onClick={() => handleSingleAIGeneration("menu-insights")}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-base">
                    <Award className="w-4 h-4 mr-2" />
                    Menu Score
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">8.5</div>
                    <p className="text-xs text-gray-600 mb-3">Out of 10</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Length</span>
                        <span className="text-green-600">Good</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pricing</span>
                        <span className="text-yellow-600">Average</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quality</span>
                        <span className="text-green-600">Excellent</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 absolute top-4 right-4 text-gray-400" />
                </CardContent>
              </Card>

              {/* Top Performers */}
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow relative"
                onClick={() => handleSingleAIGeneration("item-insights")}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-base">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Top Performers
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs">Butter Chicken</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full">
                          <div className="w-10 h-1.5 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-xs text-green-600">87%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs">Masala Chai</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full">
                          <div className="w-10 h-1.5 bg-blue-500 rounded-full"></div>
                        </div>
                        <span className="text-xs text-blue-600">85%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs">Garlic Naan</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full">
                          <div className="w-9 h-1.5 bg-purple-500 rounded-full"></div>
                        </div>
                        <span className="text-xs text-purple-600">75%</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 absolute top-4 right-4 text-gray-400" />
                </CardContent>
              </Card>

              {/* Pricing Insights */}
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow relative"
                onClick={() => handleSingleAIGeneration("pricing-insights")}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-base">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Pricing Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-red-50 rounded text-xs">
                      <span>Underpriced</span>
                      <Badge className="bg-red-100 text-red-700 text-xs h-5">3</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-yellow-50 rounded text-xs">
                      <span>Overpriced</span>
                      <Badge className="bg-yellow-100 text-yellow-700 text-xs h-5">2</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded text-xs">
                      <span>Optimal</span>
                      <Badge className="bg-green-100 text-green-700 text-xs h-5">20</Badge>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 absolute top-4 right-4 text-gray-400" />
                </CardContent>
              </Card>

              {/* Brand Insights */}
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow relative"
                onClick={() => handleSingleAIGeneration("brand-insights")}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-base">
                    <Palette className="w-4 h-4 mr-2" />
                    Brand Design
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Color Scheme</span>
                      <span className="text-blue-600">Modern</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Typography</span>
                      <span className="text-green-600">Readable</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Layout</span>
                      <span className="text-yellow-600">Needs Work</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 absolute top-4 right-4 text-gray-400" />
                </CardContent>
              </Card>

              {/* Trend Analysis */}
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow relative"
                onClick={() => handleSingleAIGeneration("trend-insights")}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-base">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Market Trends
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span>Healthy Options</span>
                      <Badge className="bg-green-100 text-green-700 text-xs h-5">↑ 15%</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>Spicy Food</span>
                      <Badge className="bg-red-100 text-red-700 text-xs h-5">↑ 8%</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>Combos</span>
                      <Badge className="bg-blue-100 text-blue-700 text-xs h-5">↑ 12%</Badge>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 absolute top-4 right-4 text-gray-400" />
                </CardContent>
              </Card>

              {/* Opportunities */}
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow relative"
                onClick={() => handleSingleAIGeneration("menu-insights")}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-base">
                    <Target className="w-4 h-4 mr-2" />
                    Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="p-2 bg-blue-50 rounded text-xs">
                      <div className="font-medium">Add More Desserts</div>
                      <div className="text-gray-600">Only 3 options available</div>
                    </div>
                    <div className="p-2 bg-purple-50 rounded text-xs">
                      <div className="font-medium">Create Combos</div>
                      <div className="text-gray-600">Increase average order</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 absolute top-4 right-4 text-gray-400" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {aiGenerationOptions.content.map((option) => (
                <Card key={option.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-base">
                      <Sparkles className="w-4 h-4 mr-2" />
                      {option.name}
                    </CardTitle>
                    <CardDescription className="text-xs">{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button
                      size="sm"
                      className="w-full h-8"
                      onClick={() => handleSingleAIGeneration(option.id)}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                      ) : (
                        <Zap className="w-3 h-3 mr-2" />
                      )}
                      Generate
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base">
                  <Activity className="w-4 h-4 mr-2" />
                  Activity Logs
                </CardTitle>
                <CardDescription className="text-xs">Recent activities and AI generations</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {mockLogs.map((log) => (
                      <div key={log.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <div className="flex-shrink-0">
                          {log.type === "ai" && <Zap className="w-4 h-4 text-purple-600" />}
                          {log.type === "user" && <Users className="w-4 h-4 text-blue-600" />}
                          {log.type === "system" && <Activity className="w-4 h-4 text-gray-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{log.action}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-500">{log.user}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">{log.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* AI Generation Dialog */}
        <Dialog open={showAIGenerationDialog} onOpenChange={setShowAIGenerationDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                AI Generation Options
              </DialogTitle>
              <DialogDescription>Select what you'd like AI to generate for your menu</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Insights Section */}
              <div>
                <h3 className="font-medium mb-3 flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Insights & Analysis
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {aiGenerationOptions.insights.map((option) => (
                    <div key={option.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <Checkbox
                        id={option.id}
                        checked={selectedAIOptions.includes(option.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedAIOptions([...selectedAIOptions, option.id])
                          } else {
                            setSelectedAIOptions(selectedAIOptions.filter((id) => id !== option.id))
                          }
                        }}
                      />
                      <div className="flex-1">
                        <Label htmlFor={option.id} className="text-sm font-medium cursor-pointer">
                          {option.name}
                        </Label>
                        <p className="text-xs text-gray-600 mt-1">{option.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Content Section */}
              <div>
                <h3 className="font-medium mb-3 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Content Generation
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {aiGenerationOptions.content.map((option) => (
                    <div key={option.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <Checkbox
                        id={option.id}
                        checked={selectedAIOptions.includes(option.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedAIOptions([...selectedAIOptions, option.id])
                          } else {
                            setSelectedAIOptions(selectedAIOptions.filter((id) => id !== option.id))
                          }
                        }}
                      />
                      <div className="flex-1">
                        <Label htmlFor={option.id} className="text-sm font-medium cursor-pointer">
                          {option.name}
                        </Label>
                        <p className="text-xs text-gray-600 mt-1">{option.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAIGenerationDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAIGeneration} disabled={selectedAIOptions.length === 0 || isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Generate Selected ({selectedAIOptions.length})
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* AI Results Dialog */}
        <Dialog open={!!showAIResultDialog} onOpenChange={() => setShowAIResultDialog(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                {showAIResultDialog?.data?.title}
              </DialogTitle>
              <DialogDescription>AI-generated results for your menu</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Menu Insights Results */}
              {showAIResultDialog?.type === "menu-insights" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {showAIResultDialog.data.data.overallScore}
                        </div>
                        <div className="text-sm text-gray-600">Overall Score</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {showAIResultDialog.data.data.categories}
                        </div>
                        <div className="text-sm text-gray-600">Categories</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {showAIResultDialog.data.data.totalItems}
                        </div>
                        <div className="text-sm text-gray-600">Total Items</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          ${showAIResultDialog.data.data.averagePrice}
                        </div>
                        <div className="text-sm text-gray-600">Avg Price</div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">AI Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {showAIResultDialog.data.data.recommendations.map((rec: string, index: number) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                            <Target className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Performance Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                            <span className="font-medium">Top Category</span>
                            <span className="text-green-700">
                              {showAIResultDialog.data.data.performance.topCategory}
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                            <span className="font-medium">Underperforming</span>
                            <span className="text-red-700">
                              {showAIResultDialog.data.data.performance.underperforming}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                            <span className="font-medium">Price Range</span>
                            <span className="text-blue-700">{showAIResultDialog.data.data.performance.priceRange}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                            <span className="font-medium">Menu Length</span>
                            <span className="text-purple-700">
                              {showAIResultDialog.data.data.performance.menuLength}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Item Insights Results */}
              {showAIResultDialog?.type === "item-insights" && (
                <div className="space-y-4">
                  {showAIResultDialog.data.data.map((item: any, index: number) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                          <Utensils className="w-5 h-5 mr-2" />
                          {item.item}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">AI Insights</h4>
                            <div className="space-y-2">
                              {item.insights.map((insight: string, idx: number) => (
                                <div key={idx} className="flex items-start space-x-2">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                  <p className="text-sm text-gray-700">{insight}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Recommended Actions</h4>
                            <div className="space-y-2">
                              {item.actions.map((action: string, idx: number) => (
                                <Button key={idx} size="sm" variant="outline" className="w-full justify-start h-8">
                                  <ChevronRight className="w-3 h-3 mr-2" />
                                  {action}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Brand Insights Results */}
              {showAIResultDialog?.type === "brand-insights" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                          <Palette className="w-5 h-5 mr-2" />
                          Color Scheme
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium">Current:</span>
                            <p className="text-sm text-gray-600">{showAIResultDialog.data.data.colorScheme.current}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Recommended:</span>
                            <p className="text-sm text-gray-600">
                              {showAIResultDialog.data.data.colorScheme.recommendation}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Reasoning:</span>
                            <p className="text-sm text-gray-600">
                              {showAIResultDialog.data.data.colorScheme.reasoning}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={() => handleApplyBrandSettings("colorScheme", "modern")}
                          >
                            Apply Color Scheme
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                          <FileText className="w-5 h-5 mr-2" />
                          Typography
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium">Current:</span>
                            <p className="text-sm text-gray-600">{showAIResultDialog.data.data.typography.current}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Recommended:</span>
                            <p className="text-sm text-gray-600">
                              {showAIResultDialog.data.data.typography.recommendation}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Reasoning:</span>
                            <p className="text-sm text-gray-600">{showAIResultDialog.data.data.typography.reasoning}</p>
                          </div>
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={() => handleApplyBrandSettings("typography", "consistent")}
                          >
                            Apply Typography
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                          <Eye className="w-5 h-5 mr-2" />
                          Layout
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium">Current:</span>
                            <p className="text-sm text-gray-600">{showAIResultDialog.data.data.layout.current}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Recommended:</span>
                            <p className="text-sm text-gray-600">
                              {showAIResultDialog.data.data.layout.recommendation}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Reasoning:</span>
                            <p className="text-sm text-gray-600">{showAIResultDialog.data.data.layout.reasoning}</p>
                          </div>
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={() => handleApplyBrandSettings("layout", "visual-grid")}
                          >
                            Apply Layout
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                          <ImageIcon className="w-5 h-5 mr-2" />
                          Imagery
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium">Recommendation:</span>
                            <p className="text-sm text-gray-600">
                              {showAIResultDialog.data.data.imagery.recommendation}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Style:</span>
                            <p className="text-sm text-gray-600">{showAIResultDialog.data.data.imagery.style}</p>
                          </div>
                          <Button size="sm" className="w-full">
                            Generate Images
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Applied Brand Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <span className="text-sm font-medium">Color Scheme</span>
                          <p className="text-sm text-gray-600 capitalize">{brandSettings.colorScheme}</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <span className="text-sm font-medium">Typography</span>
                          <p className="text-sm text-gray-600 capitalize">{brandSettings.typography}</p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <span className="text-sm font-medium">Layout</span>
                          <p className="text-sm text-gray-600 capitalize">{brandSettings.layout}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Item Descriptions Results */}
              {showAIResultDialog?.type === "item-descriptions" && (
                <div className="space-y-4">
                  {showAIResultDialog.data.data.map((item: any, index: number) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg">{item.item}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-500">Original Description</Label>
                            <p className="text-sm text-gray-600 mt-1">{item.original}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-green-600">AI-Generated Description</Label>
                            <p className="text-sm text-gray-900 mt-1 p-3 bg-green-50 rounded-lg">{item.generated}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              Apply Description
                            </Button>
                            <Button size="sm" variant="outline">
                              Regenerate
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Combos Results */}
              {showAIResultDialog?.type === "combos" && (
                <div className="space-y-4">
                  {showAIResultDialog.data.data.map((combo: any, index: number) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center justify-between">
                          <span>{combo.name}</span>
                          <Badge className="bg-green-100 text-green-700">Save ${combo.savings}</Badge>
                        </CardTitle>
                        <CardDescription>{combo.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Included Items</h4>
                            <div className="flex flex-wrap gap-2">
                              {combo.items.map((item: string, idx: number) => (
                                <Badge key={idx} variant="outline">
                                  {item}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm text-gray-500 line-through">
                                Original: ${combo.originalPrice}
                              </span>
                              <div className="text-lg font-bold text-green-600">Combo Price: ${combo.comboPrice}</div>
                            </div>
                            <Button size="sm">Add to Menu</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Seasonal Menu Results */}
              {showAIResultDialog?.type === "seasonal-menu" && (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Calendar className="w-5 h-5 mr-2" />
                        {showAIResultDialog.data.data.theme}
                      </CardTitle>
                      <CardDescription>Duration: {showAIResultDialog.data.data.duration}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">{showAIResultDialog.data.data.marketing}</p>
                      <h4 className="font-medium mb-2">Menu Items</h4>
                      <div className="space-y-3">
                        {showAIResultDialog.data.data.items.map((item: any, index: number) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="font-medium">{item.name}</h5>
                              <span className="text-sm text-gray-500">${item.price}</span>
                            </div>
                            <p className="text-sm text-gray-600">{item.description}</p>
                            <Badge variant="outline" className="mt-2 text-xs">
                              {item.category}
                            </Badge>
                          </div>
                        ))}
                      </div>
                      <Button size="sm" className="mt-4">
                        Apply Seasonal Menu
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Market Trends Results */}
              {showAIResultDialog?.type === "trend-insights" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center text-green-600">
                          <TrendingUp className="w-5 h-5 mr-2" />
                          Trending Up
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {showAIResultDialog.data.data.trending.map((trend: any, index: number) => (
                            <div key={index} className="p-3 bg-green-50 rounded-lg">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium">{trend.trend}</h4>
                                <Badge className="bg-green-100 text-green-700">{trend.growth}</Badge>
                              </div>
                              <p className="text-sm text-gray-600">{trend.description}</p>
                              <div className="mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {trend.impact} Impact
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center text-red-600">
                          <TrendingUp className="w-5 h-5 mr-2 rotate-180" />
                          Declining Trends
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {showAIResultDialog.data.data.declining.map((trend: any, index: number) => (
                            <div key={index} className="p-3 bg-red-50 rounded-lg">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium">{trend.trend}</h4>
                                <Badge className="bg-red-100 text-red-700">{trend.decline}</Badge>
                              </div>
                              <p className="text-sm text-gray-600">{trend.description}</p>
                              <div className="mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {trend.impact} Impact
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Target className="w-5 h-5 mr-2" />
                        Market Opportunities
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {showAIResultDialog.data.data.opportunities.map((opportunity: string, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <span className="text-sm">{opportunity}</span>
                            <Button size="sm" variant="outline">
                              Implement
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Item Cards Results */}
              {showAIResultDialog?.type === "item-cards" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {showAIResultDialog.data.data.map((card: any, index: number) => (
                      <Card key={index} className="overflow-hidden">
                        <div className="aspect-video bg-gray-100 flex items-center justify-center">
                          <img
                            src={card.preview || "/placeholder.svg"}
                            alt={`${card.itemName} card preview`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium mb-2">{card.itemName}</h3>
                          <p className="text-sm text-gray-600 mb-3">
                            {card.design} - {card.layout}
                          </p>
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-1">
                              {card.features.map((feature: string, idx: number) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" className="flex-1">
                                Apply Card
                              </Button>
                              <Button size="sm" variant="outline">
                                Customize
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Menu Profile Results */}
              {showAIResultDialog?.type === "menu-profile" && (
                <div className="space-y-4">
                  <Card className="overflow-hidden">
                    <div className="aspect-video bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center">
                      <img
                        src={showAIResultDialog.data.data.preview || "/placeholder.svg"}
                        alt="Menu profile card preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold mb-2">{showAIResultDialog.data.data.restaurantName}</h2>
                        <p className="text-gray-600">{showAIResultDialog.data.data.tagline}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-medium mb-3">Highlights</h3>
                          <div className="space-y-2">
                            {showAIResultDialog.data.data.highlights.map((highlight: string, index: number) => (
                              <div key={index} className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-sm">{highlight}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="font-medium mb-3">Restaurant Stats</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Rating</span>
                              <span className="text-sm font-medium">
                                {showAIResultDialog.data.data.stats.avgRating} ⭐
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Reviews</span>
                              <span className="text-sm font-medium">
                                {showAIResultDialog.data.data.stats.totalReviews}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Price Range</span>
                              <span className="text-sm font-medium">
                                {showAIResultDialog.data.data.stats.priceRange}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Cuisine</span>
                              <span className="text-sm font-medium">
                                {showAIResultDialog.data.data.stats.cuisineType}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h3 className="font-medium mb-3">Signature Specialties</h3>
                        <div className="flex flex-wrap gap-2">
                          {showAIResultDialog.data.data.specialties.map((specialty: string, index: number) => (
                            <Badge key={index} className="bg-orange-100 text-orange-700">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3 mt-6">
                        <Button className="flex-1">Apply Profile Card</Button>
                        <Button variant="outline">Customize</Button>
                        <Button variant="outline">Download</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Menu Templates Results */}
              {showAIResultDialog?.type === "menu-templates" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {showAIResultDialog.data.data.map((template: any, index: number) => (
                      <Card key={index} className="overflow-hidden">
                        <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center">
                          <img
                            src={template.preview || "/placeholder.svg"}
                            alt={`${template.name} template preview`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium mb-2">{template.name}</h3>
                          <p className="text-sm text-gray-600 mb-3">{template.style}</p>
                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-1">
                              {template.features.map((feature: string, idx: number) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" className="flex-1" onClick={() => handleApplyTemplate(template.id)} />
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" className="flex-1" onClick={() => handleApplyTemplate(template.id)}>
                                Apply Template
                              </Button>
                              <Button size="sm" variant="outline">
                                Preview
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAIResultDialog(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Extract Menu Dialog */}
        <Dialog open={showExtractDialog} onOpenChange={setShowExtractDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                Extract Menu
              </DialogTitle>
              <DialogDescription>Upload a menu PDF or image to automatically extract items</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Label htmlFor="menu-upload">Upload Menu</Label>
              <Input
                type="file"
                id="menu-upload"
                accept=".pdf, .jpg, .jpeg, .png"
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => handleFileUpload(e.target.files)}
              />
              <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
                {isExtracting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Extracting...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Select File
                  </>
                )}
              </Button>
              <p className="text-sm text-gray-500">Supported formats: PDF, JPG, PNG</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowExtractDialog(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Category Dialog */}
        <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Add New Category
              </DialogTitle>
              <DialogDescription>Create a new category for your menu</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Label htmlFor="category-name">Category Name</Label>
              <Input
                type="text"
                id="category-name"
                placeholder="e.g., Appetizers"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              />
              <Label htmlFor="category-description">Category Description</Label>
              <Input
                type="text"
                id="category-description"
                placeholder="e.g., Start your meal with our..."
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCategoryDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCategory}>Add Category</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Item Dialog */}
        <Dialog open={showItemDialog} onOpenChange={setShowItemDialog}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Add New Item
              </DialogTitle>
              <DialogDescription>Add a new item to your menu</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Label htmlFor="item-name">Item Name</Label>
              <Input
                type="text"
                id="item-name"
                placeholder="e.g., Samosa Chaat"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              />
              <Label htmlFor="item-description">Item Description</Label>
              <Input
                type="text"
                id="item-description"
                placeholder="e.g., Crispy samosas topped with..."
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              />
              <Label htmlFor="item-price">Item Price</Label>
              <Input
                type="number"
                id="item-price"
                placeholder="e.g., 8.99"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              />
              <Label htmlFor="item-category">Item Category</Label>
              <Select
                value={newItem.categoryId}
                onValueChange={(value) => setNewItem({ ...newItem, categoryId: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {menuData.categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Label>Taste Tags</Label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(tasteTagsConfig).map(([tag, config]) => {
                  const Icon = config.icon
                  return (
                    <Button
                      key={tag}
                      variant={newItem.tasteTags.includes(tag) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        if (newItem.tasteTags.includes(tag)) {
                          setNewItem({ ...newItem, tasteTags: newItem.tasteTags.filter((t) => t !== tag) })
                        } else {
                          setNewItem({ ...newItem, tasteTags: [...newItem.tasteTags, tag] })
                        }
                      }}
                    >
                      <Icon className="w-3 h-3 mr-1" />
                      {config.label}
                    </Button>
                  )
                })}
              </div>

              <Label>Promo Tags</Label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(promoTagsConfig).map(([tag, config]) => (
                  <Button
                    key={tag}
                    variant={newItem.promoTags.includes(tag) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      if (newItem.promoTags.includes(tag)) {
                        setNewItem({ ...newItem, promoTags: newItem.promoTags.filter((t) => t !== tag) })
                      } else {
                        setNewItem({ ...newItem, promoTags: [...newItem.promoTags, tag] })
                      }
                    }}
                  >
                    {config.label}
                  </Button>
                ))}
              </div>

              <Label htmlFor="item-image">Item Image</Label>
              <Input
                type="file"
                id="item-image"
                accept="image/*"
                className="hidden"
                ref={imageInputRef}
                onChange={(e) => handleImageUpload(e.target.files)}
              />
              <Button variant="outline" className="w-full" onClick={() => imageInputRef.current?.click()}>
                <ImageIcon className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
              {newItem.image && (
                <div className="relative">
                  <img
                    src={newItem.image || "/placeholder.svg"}
                    alt="Item Preview"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0"
                    onClick={() => setNewItem({ ...newItem, image: null })}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowItemDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddItem}>Add Item</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Preview Menu Dialog */}
        <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Menu Preview
              </DialogTitle>
              <DialogDescription>See how your menu will look to customers</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Generated Menu Cards */}
              {generatedMenuCards.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Generated Item Cards</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {generatedMenuCards.map((card) => (
                      <Card key={card.id}>
                        <CardContent className="p-4">
                          <h4 className="font-medium">{card.itemName}</h4>
                          <p className="text-sm text-gray-600">Generated on: {card.timestamp}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Generated Menu Profile */}
              {generatedMenuProfile && (
                <div>
                  <h3 className="font-medium mb-3">Generated Menu Profile</h3>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium">{generatedMenuProfile.restaurantName}</h4>
                      <p className="text-sm text-gray-600">{generatedMenuProfile.tagline}</p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Generated Menu Templates */}
              {generatedMenuTemplates.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Generated Menu Templates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {generatedMenuTemplates.map((template) => (
                      <Card key={template.id}>
                        <CardContent className="p-4">
                          <h4 className="font-medium">{template.name}</h4>
                          <p className="text-sm text-gray-600">{template.style}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPreviewDialog(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
