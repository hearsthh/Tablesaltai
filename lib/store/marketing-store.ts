import { create } from "zustand"
import { persist } from "zustand/middleware"

interface Campaign {
  id: string
  name: string
  type: string
  budget: number
  spent: number
  reach: string
  engagement: string
  status: "active" | "paused" | "draft"
  startDate: string
  endDate: string
  description: string
  platforms: string[]
  objective: string
}

interface Strategy {
  id: string
  name: string
  objective: string
  duration: string
  budget: number
  status: "active" | "draft" | "completed"
  progress: number
  startDate: string
  endDate: string
  description: string
  keyMetrics: {
    targetReach: string
    currentReach: string
    targetEngagement: string
    currentEngagement: string
  }
  campaigns: number
  milestones: Array<{
    name: string
    status: "completed" | "active" | "pending"
    date: string
  }>
}

interface SocialMediaPost {
  id: string
  title: string
  platform: string
  type: string
  status: "published" | "scheduled" | "draft"
  scheduledDate: string
  content: string
  hashtags: string[]
  engagement: {
    likes: number
    comments: number
    shares: number
  }
  reach: string
}

interface Offer {
  id: string
  title: string
  type: string
  discount: string
  status: "active" | "scheduled" | "expired"
  startDate: string
  endDate: string
  usageCount: number
  maxUsage: number
  description: string
}

interface MarketingStore {
  // Data
  campaigns: Campaign[]
  strategies: Strategy[]
  socialMediaPosts: SocialMediaPost[]
  offers: Offer[]

  // Actions
  addCampaign: (campaign: Omit<Campaign, "id">) => void
  updateCampaign: (id: string, updates: Partial<Campaign>) => void
  deleteCampaign: (id: string) => void

  addStrategy: (strategy: Omit<Strategy, "id">) => void
  updateStrategy: (id: string, updates: Partial<Strategy>) => void
  deleteStrategy: (id: string) => void

  addSocialMediaPost: (post: Omit<SocialMediaPost, "id">) => void
  updateSocialMediaPost: (id: string, updates: Partial<SocialMediaPost>) => void
  deleteSocialMediaPost: (id: string) => void

  addOffer: (offer: Omit<Offer, "id">) => void
  updateOffer: (id: string, updates: Partial<Offer>) => void
  deleteOffer: (id: string) => void

  // Computed values
  getActiveCampaigns: () => Campaign[]
  getTotalBudget: () => number
  getTotalSpent: () => number
}

export const useMarketingStore = create<MarketingStore>()(
  persist(
    (set, get) => ({
      // Initial data (can be empty or with some defaults)
      campaigns: [],
      strategies: [],
      socialMediaPosts: [],
      offers: [],

      // Campaign actions
      addCampaign: (campaign) => {
        const newCampaign = {
          ...campaign,
          id: Date.now().toString(),
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

      deleteCampaign: (id) => {
        set((state) => ({
          campaigns: state.campaigns.filter((campaign) => campaign.id !== id),
        }))
      },

      // Strategy actions
      addStrategy: (strategy) => {
        const newStrategy = {
          ...strategy,
          id: Date.now().toString(),
        }
        set((state) => ({
          strategies: [...state.strategies, newStrategy],
        }))
      },

      updateStrategy: (id, updates) => {
        set((state) => ({
          strategies: state.strategies.map((strategy) => (strategy.id === id ? { ...strategy, ...updates } : strategy)),
        }))
      },

      deleteStrategy: (id) => {
        set((state) => ({
          strategies: state.strategies.filter((strategy) => strategy.id !== id),
        }))
      },

      // Social Media Post actions
      addSocialMediaPost: (post) => {
        const newPost = {
          ...post,
          id: Date.now().toString(),
        }
        set((state) => ({
          socialMediaPosts: [...state.socialMediaPosts, newPost],
        }))
      },

      updateSocialMediaPost: (id, updates) => {
        set((state) => ({
          socialMediaPosts: state.socialMediaPosts.map((post) => (post.id === id ? { ...post, ...updates } : post)),
        }))
      },

      deleteSocialMediaPost: (id) => {
        set((state) => ({
          socialMediaPosts: state.socialMediaPosts.filter((post) => post.id !== id),
        }))
      },

      // Offer actions
      addOffer: (offer) => {
        const newOffer = {
          ...offer,
          id: Date.now().toString(),
        }
        set((state) => ({
          offers: [...state.offers, newOffer],
        }))
      },

      updateOffer: (id, updates) => {
        set((state) => ({
          offers: state.offers.map((offer) => (offer.id === id ? { ...offer, ...updates } : offer)),
        }))
      },

      deleteOffer: (id) => {
        set((state) => ({
          offers: state.offers.filter((offer) => offer.id !== id),
        }))
      },

      // Computed values
      getActiveCampaigns: () => {
        return get().campaigns.filter((campaign) => campaign.status === "active")
      },

      getTotalBudget: () => {
        return get().campaigns.reduce((total, campaign) => total + campaign.budget, 0)
      },

      getTotalSpent: () => {
        return get().campaigns.reduce((total, campaign) => total + campaign.spent, 0)
      },
    }),
    {
      name: "marketing-store", // localStorage key
    },
  ),
)
