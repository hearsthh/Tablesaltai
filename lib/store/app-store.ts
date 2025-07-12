import { create } from "zustand"
import { persist } from "zustand/middleware"

// Types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
}

export interface RestaurantProfile {
  id: string
  userId: string
  restaurantName: string
  tagline?: string
  email: string
  phone?: string
  address: string
  cuisineType: string
  restaurantType: string
  priceRange: string
  website?: string
  description?: string
  operatingHours: Record<string, { open: string; close: string; closed: boolean }>
  socialMedia: Record<string, string>
  brandColors: { primary: string; secondary: string }
  brandVoice: string
  amenities: string[]
  logoUrl?: string
  coverImageUrl?: string
  galleryImages: string[]
  isActive: boolean
  setupCompleted: boolean
  createdAt: string
  updatedAt: string
}

export interface MenuCategory {
  id: string
  restaurantId: string
  name: string
  description?: string
  displayOrder: number
  isActive: boolean
  items: MenuItem[]
}

export interface MenuItem {
  id: string
  restaurantId: string
  categoryId?: string
  name: string
  description?: string
  price: number
  imageUrl?: string
  dietaryTags: string[]
  allergenInfo: string[]
  tasteTags: string[]
  promoTags: string[]
  isAvailable: boolean
  isFeatured: boolean
  displayOrder: number
  preparationTime?: number
  calories?: number
}

export interface Review {
  id: string
  restaurantId: string
  customerName?: string
  customerEmail?: string
  rating: number
  title?: string
  content?: string
  isVerified: boolean
  isPublished: boolean
  source: string
  sourceId?: string
  helpfulCount: number
  response?: string
  respondedAt?: string
  createdAt: string
  updatedAt: string
}

export interface Campaign {
  id: string
  restaurantId: string
  name: string
  description?: string
  campaignType: string
  status: "draft" | "active" | "paused" | "completed"
  targetAudience: Record<string, any>
  content: Record<string, any>
  schedule: Record<string, any>
  budget?: number
  spent: number
  metrics: Record<string, any>
  channels: string[]
  startDate?: string
  endDate?: string
  createdAt: string
  updatedAt: string
}

export interface Analytics {
  id: string
  restaurantId: string
  date: string
  profileViews: number
  menuViews: number
  reviewCount: number
  averageRating: number
  totalOrders: number
  revenue: number
  customerVisits: number
  conversionRate: number
  metrics: Record<string, any>
}

// Store interface
interface AppStore {
  // State
  user: User | null
  restaurant: RestaurantProfile | null
  menuCategories: MenuCategory[]
  reviews: Review[]
  campaigns: Campaign[]
  analytics: Analytics[]
  isLoading: boolean
  error: string | null

  // Actions
  setUser: (user: User | null) => void
  setRestaurant: (restaurant: RestaurantProfile | null) => void
  setMenuCategories: (categories: MenuCategory[]) => void
  setReviews: (reviews: Review[]) => void
  setCampaigns: (campaigns: Campaign[]) => void
  setAnalytics: (analytics: Analytics[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // Restaurant actions
  updateRestaurant: (updates: Partial<RestaurantProfile>) => Promise<void>

  // Menu actions
  addMenuCategory: (category: Omit<MenuCategory, "id" | "restaurantId" | "items">) => Promise<void>
  updateMenuCategory: (id: string, updates: Partial<MenuCategory>) => Promise<void>
  deleteMenuCategory: (id: string) => Promise<void>
  addMenuItem: (categoryId: string, item: Omit<MenuItem, "id" | "restaurantId" | "categoryId">) => Promise<void>
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => Promise<void>
  deleteMenuItem: (id: string) => Promise<void>

  // Review actions
  addReview: (review: Omit<Review, "id" | "restaurantId" | "createdAt" | "updatedAt">) => Promise<void>
  updateReview: (id: string, updates: Partial<Review>) => Promise<void>
  deleteReview: (id: string) => Promise<void>

  // Campaign actions
  addCampaign: (campaign: Omit<Campaign, "id" | "restaurantId" | "createdAt" | "updatedAt">) => Promise<void>
  updateCampaign: (id: string, updates: Partial<Campaign>) => Promise<void>
  deleteCampaign: (id: string) => Promise<void>

  // Data loading
  loadRestaurantData: () => Promise<void>
  refreshData: () => Promise<void>
}

// API functions
const api = {
  async get(endpoint: string) {
    const response = await fetch(`/api${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `API Error: ${response.statusText}`)
    }
    return response.json()
  },

  async post(endpoint: string, data: any) {
    const response = await fetch(`/api${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `API Error: ${response.statusText}`)
    }
    return response.json()
  },

  async put(endpoint: string, data: any) {
    const response = await fetch(`/api${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `API Error: ${response.statusText}`)
    }
    return response.json()
  },

  async delete(endpoint: string) {
    const response = await fetch(`/api${endpoint}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `API Error: ${response.statusText}`)
    }
    return response.json()
  },
}

// Create the store
export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      restaurant: null,
      menuCategories: [],
      reviews: [],
      campaigns: [],
      analytics: [],
      isLoading: false,
      error: null,

      // Basic setters
      setUser: (user) => set({ user }),
      setRestaurant: (restaurant) => set({ restaurant }),
      setMenuCategories: (menuCategories) => set({ menuCategories }),
      setReviews: (reviews) => set({ reviews }),
      setCampaigns: (campaigns) => set({ campaigns }),
      setAnalytics: (analytics) => set({ analytics }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      // Restaurant actions
      updateRestaurant: async (updates) => {
        const { restaurant } = get()
        if (!restaurant) throw new Error("No restaurant profile found")

        set({ isLoading: true, error: null })
        try {
          const updatedRestaurant = await api.put(`/restaurant`, updates)
          set({ restaurant: updatedRestaurant })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to update restaurant"
          set({ error: errorMessage })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      // Menu actions
      addMenuCategory: async (categoryData) => {
        const { restaurant, menuCategories } = get()
        if (!restaurant) throw new Error("No restaurant profile found")

        set({ isLoading: true, error: null })
        try {
          const newCategory = await api.post("/menu/categories", {
            ...categoryData,
            restaurantId: restaurant.id,
          })
          set({ menuCategories: [...menuCategories, { ...newCategory, items: [] }] })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to add category"
          set({ error: errorMessage })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      updateMenuCategory: async (id, updates) => {
        const { menuCategories } = get()
        set({ isLoading: true, error: null })
        try {
          const updatedCategory = await api.put(`/menu/categories/${id}`, updates)
          set({
            menuCategories: menuCategories.map((cat) => (cat.id === id ? { ...cat, ...updatedCategory } : cat)),
          })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to update category"
          set({ error: errorMessage })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      deleteMenuCategory: async (id) => {
        const { menuCategories } = get()
        set({ isLoading: true, error: null })
        try {
          await api.delete(`/menu/categories/${id}`)
          set({ menuCategories: menuCategories.filter((cat) => cat.id !== id) })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to delete category"
          set({ error: errorMessage })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      addMenuItem: async (categoryId, itemData) => {
        const { restaurant, menuCategories } = get()
        if (!restaurant) throw new Error("No restaurant profile found")

        set({ isLoading: true, error: null })
        try {
          const newItem = await api.post("/menu/items", {
            ...itemData,
            restaurantId: restaurant.id,
            categoryId,
          })
          set({
            menuCategories: menuCategories.map((cat) =>
              cat.id === categoryId ? { ...cat, items: [...cat.items, newItem] } : cat,
            ),
          })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to add menu item"
          set({ error: errorMessage })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      updateMenuItem: async (id, updates) => {
        const { menuCategories } = get()
        set({ isLoading: true, error: null })
        try {
          const updatedItem = await api.put(`/menu/items/${id}`, updates)
          set({
            menuCategories: menuCategories.map((cat) => ({
              ...cat,
              items: cat.items.map((item) => (item.id === id ? { ...item, ...updatedItem } : item)),
            })),
          })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to update menu item"
          set({ error: errorMessage })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      deleteMenuItem: async (id) => {
        const { menuCategories } = get()
        set({ isLoading: true, error: null })
        try {
          await api.delete(`/menu/items/${id}`)
          set({
            menuCategories: menuCategories.map((cat) => ({
              ...cat,
              items: cat.items.filter((item) => item.id !== id),
            })),
          })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to delete menu item"
          set({ error: errorMessage })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      // Review actions
      addReview: async (reviewData) => {
        const { restaurant, reviews } = get()
        if (!restaurant) throw new Error("No restaurant profile found")

        set({ isLoading: true, error: null })
        try {
          const newReview = await api.post("/reviews", {
            ...reviewData,
            restaurantId: restaurant.id,
          })
          set({ reviews: [...reviews, newReview] })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to add review"
          set({ error: errorMessage })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      updateReview: async (id, updates) => {
        const { reviews } = get()
        set({ isLoading: true, error: null })
        try {
          const updatedReview = await api.put(`/reviews/${id}`, updates)
          set({
            reviews: reviews.map((review) => (review.id === id ? { ...review, ...updatedReview } : review)),
          })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to update review"
          set({ error: errorMessage })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      deleteReview: async (id) => {
        const { reviews } = get()
        set({ isLoading: true, error: null })
        try {
          await api.delete(`/reviews/${id}`)
          set({ reviews: reviews.filter((review) => review.id !== id) })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to delete review"
          set({ error: errorMessage })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      // Campaign actions
      addCampaign: async (campaignData) => {
        const { restaurant, campaigns } = get()
        if (!restaurant) throw new Error("No restaurant profile found")

        set({ isLoading: true, error: null })
        try {
          const newCampaign = await api.post("/campaigns", {
            ...campaignData,
            restaurantId: restaurant.id,
          })
          set({ campaigns: [...campaigns, newCampaign] })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to add campaign"
          set({ error: errorMessage })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      updateCampaign: async (id, updates) => {
        const { campaigns } = get()
        set({ isLoading: true, error: null })
        try {
          const updatedCampaign = await api.put(`/campaigns/${id}`, updates)
          set({
            campaigns: campaigns.map((campaign) =>
              campaign.id === id ? { ...campaign, ...updatedCampaign } : campaign,
            ),
          })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to update campaign"
          set({ error: errorMessage })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      deleteCampaign: async (id) => {
        const { campaigns } = get()
        set({ isLoading: true, error: null })
        try {
          await api.delete(`/campaigns/${id}`)
          set({ campaigns: campaigns.filter((campaign) => campaign.id !== id) })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to delete campaign"
          set({ error: errorMessage })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      // Data loading
      loadRestaurantData: async () => {
        set({ isLoading: true, error: null })
        try {
          const [restaurant, menuCategories, reviews, campaigns, analytics] = await Promise.all([
            api.get("/restaurant").catch(() => null),
            api.get("/menu/categories").catch(() => []),
            api.get("/reviews").catch(() => []),
            api.get("/campaigns").catch(() => []),
            api.get("/analytics").catch(() => []),
          ])

          set({
            restaurant,
            menuCategories: menuCategories || [],
            reviews: reviews || [],
            campaigns: campaigns || [],
            analytics: analytics || [],
          })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to load data"
          set({ error: errorMessage })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      refreshData: async () => {
        const { loadRestaurantData } = get()
        await loadRestaurantData()
      },
    }),
    {
      name: "restaurant-app-store",
      partialize: (state) => ({
        user: state.user,
        restaurant: state.restaurant,
        menuCategories: state.menuCategories,
        reviews: state.reviews,
        campaigns: state.campaigns,
        analytics: state.analytics,
      }),
    },
  ),
)

// Selector hooks for better performance
export const useUser = () => useAppStore((state) => state.user)
export const useRestaurant = () => useAppStore((state) => state.restaurant)
export const useMenuCategories = () => useAppStore((state) => state.menuCategories)
export const useReviews = () => useAppStore((state) => state.reviews)
export const useCampaigns = () => useAppStore((state) => state.campaigns)
export const useAnalytics = () => useAppStore((state) => state.analytics)
export const useLoading = () => useAppStore((state) => state.isLoading)
export const useError = () => useAppStore((state) => state.error)
