import { create } from "zustand"
import { persist } from "zustand/middleware"

// Types for our app data
interface RestaurantProfile {
  id: string
  name: string
  cuisine: string
  description: string
  phone: string
  email: string
  address: string
  website: string
  priceRange: string
  rating: number
  totalReviews: number
  logo?: string
  operatingHours: Record<string, { open: string; close: string; closed: boolean }>
  socialMedia: {
    facebook?: string
    instagram?: string
    twitter?: string
  }
}

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image?: string
  available: boolean
  inStock: boolean
  tasteTags: string[]
  promoTags: string[]
}

interface MenuCategory {
  id: string
  name: string
  description: string
  items: MenuItem[]
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  totalOrders: number
  totalSpent: number
  lastVisit: string
  segment: string
  status: "active" | "inactive" | "new"
}

interface Review {
  id: string
  customerName: string
  rating: number
  text: string
  platform: string
  date: string
  responded: boolean
  response?: string
}

interface Campaign {
  id: string
  name: string
  type: string
  status: "active" | "paused" | "completed"
  budget: number
  spent: number
  startDate: string
  endDate: string
  channels: string[]
  metrics: {
    impressions: number
    clicks: number
    conversions: number
  }
}

interface AppDataState {
  // Restaurant Profile
  profile: RestaurantProfile | null

  // Menu Data
  menuCategories: MenuCategory[]

  // Customer Data
  customers: Customer[]

  // Reviews
  reviews: Review[]

  // Marketing Campaigns
  campaigns: Campaign[]

  // Analytics
  analytics: {
    monthlyRevenue: number
    revenueChange: number
    customerVisits: number
    visitsChange: number
    averageRating: number
    ratingChange: number
    averageOrderValue: number
    orderValueChange: number
  }

  // Actions
  updateProfile: (profile: Partial<RestaurantProfile>) => void
  addMenuCategory: (category: Omit<MenuCategory, "id">) => void
  updateMenuCategory: (id: string, updates: Partial<MenuCategory>) => void
  deleteMenuCategory: (id: string) => void
  addMenuItem: (categoryId: string, item: Omit<MenuItem, "id">) => void
  updateMenuItem: (categoryId: string, itemId: string, updates: Partial<MenuItem>) => void
  deleteMenuItem: (categoryId: string, itemId: string) => void
  addCustomer: (customer: Omit<Customer, "id">) => void
  updateCustomer: (id: string, updates: Partial<Customer>) => void
  addReview: (review: Omit<Review, "id">) => void
  updateReview: (id: string, updates: Partial<Review>) => void
  addCampaign: (campaign: Omit<Campaign, "id">) => void
  updateCampaign: (id: string, updates: Partial<Campaign>) => void
  initializeWithMockData: () => void
  clearAllData: () => void
}

// Default/Mock data
const defaultProfile: RestaurantProfile = {
  id: "restaurant-1",
  name: "Spice Garden Restaurant",
  cuisine: "North Indian, Chinese",
  description:
    "Authentic North Indian cuisine with a modern twist. Family-friendly restaurant serving fresh, flavorful dishes made with traditional recipes.",
  phone: "+91 98765 43210",
  email: "info@spicegarden.com",
  address: "Sector 18, Noida, Uttar Pradesh 201301",
  website: "www.spicegarden.com",
  priceRange: "₹₹",
  rating: 4.6,
  totalReviews: 1247,
  operatingHours: {
    monday: { open: "11:00", close: "23:00", closed: false },
    tuesday: { open: "11:00", close: "23:00", closed: false },
    wednesday: { open: "11:00", close: "23:00", closed: false },
    thursday: { open: "11:00", close: "23:00", closed: false },
    friday: { open: "11:00", close: "23:00", closed: false },
    saturday: { open: "11:00", close: "23:00", closed: false },
    sunday: { open: "12:00", close: "22:00", closed: false },
  },
  socialMedia: {
    facebook: "https://facebook.com/spicegarden",
    instagram: "https://instagram.com/spicegarden",
    twitter: "https://twitter.com/spicegarden",
  },
}

const defaultMenuCategories: MenuCategory[] = [
  {
    id: "cat-1",
    name: "Appetizers",
    description: "Start your meal with our delicious appetizers",
    items: [
      {
        id: "item-1",
        name: "Samosa Chaat",
        description: "Crispy samosas topped with tangy chutneys and yogurt",
        price: 8.99,
        category: "cat-1",
        available: true,
        inStock: true,
        tasteTags: ["spicy", "vegetarian"],
        promoTags: ["popular", "signature"],
      },
      {
        id: "item-2",
        name: "Chicken Wings",
        description: "Spicy buffalo wings with blue cheese dip",
        price: 12.99,
        category: "cat-1",
        available: true,
        inStock: false,
        tasteTags: ["spicy", "non-vegetarian"],
        promoTags: ["popular"],
      },
    ],
  },
  {
    id: "cat-2",
    name: "Main Course",
    description: "Our signature main dishes",
    items: [
      {
        id: "item-3",
        name: "Butter Chicken",
        description: "Tender chicken in rich tomato cream sauce",
        price: 16.99,
        category: "cat-2",
        available: true,
        inStock: true,
        tasteTags: ["mild", "non-vegetarian", "creamy"],
        promoTags: ["signature", "chef-special"],
      },
      {
        id: "item-4",
        name: "Palak Paneer",
        description: "Cottage cheese in creamy spinach curry",
        price: 14.99,
        category: "cat-2",
        available: true,
        inStock: true,
        tasteTags: ["mild", "vegetarian", "healthy"],
        promoTags: ["popular"],
      },
    ],
  },
]

const defaultCustomers: Customer[] = [
  {
    id: "cust-1",
    name: "Rajesh Kumar",
    email: "rajesh@email.com",
    phone: "+91 98765 43210",
    totalOrders: 23,
    totalSpent: 12450,
    lastVisit: "2024-01-15",
    segment: "VIP",
    status: "active",
  },
  {
    id: "cust-2",
    name: "Priya Sharma",
    email: "priya@email.com",
    phone: "+91 98765 43211",
    totalOrders: 15,
    totalSpent: 8900,
    lastVisit: "2024-01-12",
    segment: "Regular",
    status: "active",
  },
]

const defaultReviews: Review[] = [
  {
    id: "review-1",
    customerName: "Sarah M.",
    rating: 5,
    text: "Amazing food and excellent service! The butter chicken was absolutely divine.",
    platform: "Google",
    date: "2024-01-15",
    responded: true,
    response: "Thank you Sarah! We're delighted you enjoyed your experience.",
  },
  {
    id: "review-2",
    customerName: "Mike R.",
    rating: 4,
    text: "Great food, good service. Will definitely come back!",
    platform: "Zomato",
    date: "2024-01-12",
    responded: false,
  },
]

const defaultCampaigns: Campaign[] = [
  {
    id: "camp-1",
    name: "Weekend Special",
    type: "promotion",
    status: "active",
    budget: 5000,
    spent: 2300,
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    channels: ["facebook", "instagram"],
    metrics: {
      impressions: 45000,
      clicks: 1200,
      conversions: 85,
    },
  },
]

const defaultAnalytics = {
  monthlyRevenue: 245000,
  revenueChange: 12.5,
  customerVisits: 1247,
  visitsChange: 8.2,
  averageRating: 4.6,
  ratingChange: 0.3,
  averageOrderValue: 485,
  orderValueChange: -2.1,
}

// Create the store
export const useAppData = create<AppDataState>()(
  persist(
    (set, get) => ({
      // Initial state
      profile: null,
      menuCategories: [],
      customers: [],
      reviews: [],
      campaigns: [],
      analytics: defaultAnalytics,

      // Profile actions
      updateProfile: (profileUpdates) => {
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...profileUpdates } : { ...defaultProfile, ...profileUpdates },
        }))
      },

      // Menu actions
      addMenuCategory: (category) => {
        const newCategory = {
          ...category,
          id: `cat-${Date.now()}`,
        }
        set((state) => ({
          menuCategories: [...state.menuCategories, newCategory],
        }))
      },

      updateMenuCategory: (id, updates) => {
        set((state) => ({
          menuCategories: state.menuCategories.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat)),
        }))
      },

      deleteMenuCategory: (id) => {
        set((state) => ({
          menuCategories: state.menuCategories.filter((cat) => cat.id !== id),
        }))
      },

      addMenuItem: (categoryId, item) => {
        const newItem = {
          ...item,
          id: `item-${Date.now()}`,
          category: categoryId,
        }
        set((state) => ({
          menuCategories: state.menuCategories.map((cat) =>
            cat.id === categoryId ? { ...cat, items: [...cat.items, newItem] } : cat,
          ),
        }))
      },

      updateMenuItem: (categoryId, itemId, updates) => {
        set((state) => ({
          menuCategories: state.menuCategories.map((cat) =>
            cat.id === categoryId
              ? {
                  ...cat,
                  items: cat.items.map((item) => (item.id === itemId ? { ...item, ...updates } : item)),
                }
              : cat,
          ),
        }))
      },

      deleteMenuItem: (categoryId, itemId) => {
        set((state) => ({
          menuCategories: state.menuCategories.map((cat) =>
            cat.id === categoryId ? { ...cat, items: cat.items.filter((item) => item.id !== itemId) } : cat,
          ),
        }))
      },

      // Customer actions
      addCustomer: (customer) => {
        const newCustomer = {
          ...customer,
          id: `cust-${Date.now()}`,
        }
        set((state) => ({
          customers: [...state.customers, newCustomer],
        }))
      },

      updateCustomer: (id, updates) => {
        set((state) => ({
          customers: state.customers.map((customer) => (customer.id === id ? { ...customer, ...updates } : customer)),
        }))
      },

      // Review actions
      addReview: (review) => {
        const newReview = {
          ...review,
          id: `review-${Date.now()}`,
        }
        set((state) => ({
          reviews: [...state.reviews, newReview],
        }))
      },

      updateReview: (id, updates) => {
        set((state) => ({
          reviews: state.reviews.map((review) => (review.id === id ? { ...review, ...updates } : review)),
        }))
      },

      // Campaign actions
      addCampaign: (campaign) => {
        const newCampaign = {
          ...campaign,
          id: `camp-${Date.now()}`,
        }
        set((state) => ({
          campaigns: [...state.campaigns, newCampaign],
        }))
      },

      updateCampaign: (id, updates) => {
        set((state) => ({
          campaigns: state.campaigns.map((campaign) => (campaign.id === id ? { ...campaign, ...updates } : campaign)),
        }))
      },

      // Utility actions
      initializeWithMockData: () => {
        set({
          profile: defaultProfile,
          menuCategories: defaultMenuCategories,
          customers: defaultCustomers,
          reviews: defaultReviews,
          campaigns: defaultCampaigns,
          analytics: defaultAnalytics,
        })
      },

      clearAllData: () => {
        set({
          profile: null,
          menuCategories: [],
          customers: [],
          reviews: [],
          campaigns: [],
          analytics: defaultAnalytics,
        })
      },
    }),
    {
      name: "restaurant-app-data",
      partialize: (state) => ({
        profile: state.profile,
        menuCategories: state.menuCategories,
        customers: state.customers,
        reviews: state.reviews,
        campaigns: state.campaigns,
        analytics: state.analytics,
      }),
    },
  ),
)

// Helper hooks for specific data
export const useRestaurantProfile = () => {
  const profile = useAppData((state) => state.profile)
  const updateProfile = useAppData((state) => state.updateProfile)
  return { profile, updateProfile }
}

export const useMenuData = () => {
  const menuCategories = useAppData((state) => state.menuCategories)
  const addMenuCategory = useAppData((state) => state.addMenuCategory)
  const updateMenuCategory = useAppData((state) => state.updateMenuCategory)
  const deleteMenuCategory = useAppData((state) => state.deleteMenuCategory)
  const addMenuItem = useAppData((state) => state.addMenuItem)
  const updateMenuItem = useAppData((state) => state.updateMenuItem)
  const deleteMenuItem = useAppData((state) => state.deleteMenuItem)

  return {
    menuCategories,
    addMenuCategory,
    updateMenuCategory,
    deleteMenuCategory,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
  }
}

export const useCustomerData = () => {
  const customers = useAppData((state) => state.customers)
  const addCustomer = useAppData((state) => state.addCustomer)
  const updateCustomer = useAppData((state) => state.updateCustomer)
  return { customers, addCustomer, updateCustomer }
}

export const useReviewData = () => {
  const reviews = useAppData((state) => state.reviews)
  const addReview = useAppData((state) => state.addReview)
  const updateReview = useAppData((state) => state.updateReview)
  return { reviews, addReview, updateReview }
}

export const useCampaignData = () => {
  const campaigns = useAppData((state) => state.campaigns)
  const addCampaign = useAppData((state) => state.addCampaign)
  const updateCampaign = useAppData((state) => state.updateCampaign)
  return { campaigns, addCampaign, updateCampaign }
}

export const useAnalyticsData = () => {
  const analytics = useAppData((state) => state.analytics)
  return { analytics }
}
