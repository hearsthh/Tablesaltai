import { create } from "zustand"

// Mock Restaurant Profile Data
export const mockRestaurantProfile = {
  id: "restaurant-123",
  user_id: "user-123",
  name: "Spice Garden",
  tagline: "Authentic Indian Cuisine with Modern Flair",
  cuisine: "Indian",
  restaurant_type: "Casual Dining",
  price_range: "$$",
  email: "contact@spicegarden.com",
  phone: "+1 (555) 123-4567",
  website: "https://spicegarden.com",
  address: "123 Culinary Lane, Foodville, CA 94123",
  description: "Spice Garden brings authentic Indian flavors to your neighborhood with a modern twist.",
  concept: "Traditional Indian hospitality meets contemporary dining experience",
  history: "Founded in 2010 by the Sharma family, started as a small 8-table restaurant",
  philosophy: "Great food comes from great ingredients, traditional techniques, and genuine passion",
  social_media: {
    facebook: "https://facebook.com/spicegarden",
    instagram: "https://instagram.com/spicegarden",
    twitter: "https://twitter.com/spicegarden",
  },
  operating_hours: {
    monday: { open: "11:00", close: "22:00", closed: false },
    tuesday: { open: "11:00", close: "22:00", closed: false },
    wednesday: { open: "11:00", close: "22:00", closed: false },
    thursday: { open: "11:00", close: "23:00", closed: false },
    friday: { open: "11:00", close: "23:00", closed: false },
    saturday: { open: "11:00", close: "23:00", closed: false },
    sunday: { open: "12:00", close: "21:00", closed: false },
  },
  brand_colors: {
    primary: "#e65c00",
    secondary: "#f9a602",
    accent: "#4a1e09",
  },
  amenities: {
    pet_friendly: true,
    outdoor_seating: true,
    private_events: true,
    wifi: true,
    parking: "Free street parking available",
    accessibility: "Fully wheelchair accessible",
  },
  created_at: "2024-01-01T00:00:00Z",
  updated_at: new Date().toISOString(),
}

// Mock Menu Data
export const mockMenuData = {
  categories: [
    {
      id: "cat-1",
      name: "Appetizers",
      description: "Start your meal with our delicious appetizers",
      display_order: 1,
      items: [
        {
          id: "item-1",
          name: "Samosa Chaat",
          description: "Crispy samosas topped with tangy chutneys and yogurt",
          price: 8.99,
          category_id: "cat-1",
          available: true,
          is_vegetarian: true,
          is_signature: false,
          spice_level: "medium",
          allergens: ["gluten"],
          nutrition: { calories: 320, protein: 8, carbs: 45, fat: 12 },
          image_url: "/placeholder.svg?height=200&width=200&text=Samosa+Chaat",
        },
        {
          id: "item-2",
          name: "Chicken Wings",
          description: "Spicy buffalo wings with ranch dip",
          price: 12.99,
          category_id: "cat-1",
          available: true,
          is_vegetarian: false,
          is_signature: false,
          spice_level: "hot",
          allergens: ["dairy"],
          nutrition: { calories: 480, protein: 28, carbs: 5, fat: 38 },
          image_url: "/placeholder.svg?height=200&width=200&text=Chicken+Wings",
        },
        {
          id: "item-3",
          name: "Paneer Tikka",
          description: "Grilled cottage cheese marinated in aromatic spices",
          price: 10.99,
          category_id: "cat-1",
          available: true,
          is_vegetarian: true,
          is_signature: true,
          spice_level: "mild",
          allergens: ["dairy"],
          nutrition: { calories: 280, protein: 18, carbs: 12, fat: 20 },
          image_url: "/placeholder.svg?height=200&width=200&text=Paneer+Tikka",
        },
      ],
    },
    {
      id: "cat-2",
      name: "Main Course",
      description: "Our signature main dishes",
      display_order: 2,
      items: [
        {
          id: "item-4",
          name: "Butter Chicken",
          description: "Tender chicken in rich tomato-based curry",
          price: 16.99,
          category_id: "cat-2",
          available: true,
          is_vegetarian: false,
          is_signature: true,
          spice_level: "mild",
          allergens: ["dairy"],
          nutrition: { calories: 520, protein: 35, carbs: 18, fat: 32 },
          image_url: "/placeholder.svg?height=200&width=200&text=Butter+Chicken",
        },
        {
          id: "item-5",
          name: "Dal Makhani",
          description: "Slow-cooked black lentils in creamy tomato gravy",
          price: 13.99,
          category_id: "cat-2",
          available: true,
          is_vegetarian: true,
          is_signature: true,
          spice_level: "mild",
          allergens: ["dairy"],
          nutrition: { calories: 380, protein: 16, carbs: 45, fat: 15 },
          image_url: "/placeholder.svg?height=200&width=200&text=Dal+Makhani",
        },
        {
          id: "item-6",
          name: "Chicken Biryani",
          description: "Fragrant basmati rice with spiced chicken",
          price: 18.99,
          category_id: "cat-2",
          available: true,
          is_vegetarian: false,
          is_signature: true,
          spice_level: "medium",
          allergens: [],
          nutrition: { calories: 650, protein: 40, carbs: 75, fat: 18 },
          image_url: "/placeholder.svg?height=200&width=200&text=Chicken+Biryani",
        },
      ],
    },
    {
      id: "cat-3",
      name: "Breads & Rice",
      description: "Freshly baked breads and aromatic rice dishes",
      display_order: 3,
      items: [
        {
          id: "item-7",
          name: "Garlic Naan",
          description: "Soft bread topped with fresh garlic and herbs",
          price: 3.99,
          category_id: "cat-3",
          available: true,
          is_vegetarian: true,
          is_signature: false,
          spice_level: "none",
          allergens: ["gluten", "dairy"],
          nutrition: { calories: 220, protein: 6, carbs: 35, fat: 8 },
          image_url: "/placeholder.svg?height=200&width=200&text=Garlic+Naan",
        },
      ],
    },
  ],
}

// Mock Customer Data
export const mockCustomers = Array.from({ length: 50 }, (_, i) => ({
  id: `customer-${i + 1}`,
  name: [
    "Rajesh Kumar",
    "Priya Sharma",
    "Amit Patel",
    "Sneha Gupta",
    "Vikram Singh",
    "Anita Desai",
    "Rohit Mehta",
    "Kavya Nair",
  ][i % 8],
  email: `customer${i + 1}@email.com`,
  phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
  demographics: {
    age: Math.floor(Math.random() * 40) + 20,
    gender: Math.random() > 0.5 ? "Male" : "Female",
    location: ["Mumbai", "Delhi", "Bangalore", "Chennai", "Pune"][Math.floor(Math.random() * 5)],
    income: ["< 5L", "5-10L", "10-20L", "20L+"][Math.floor(Math.random() * 4)],
  },
  behavior: {
    frequency: Math.floor(Math.random() * 8) + 1,
    avg_spend: Math.floor(Math.random() * 2000) + 500,
    last_visit: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    total_spent: Math.floor(Math.random() * 50000) + 5000,
    preferred_time: ["Lunch", "Dinner", "Brunch"][Math.floor(Math.random() * 3)],
  },
  metrics: {
    cac: Math.floor(Math.random() * 500) + 100,
    ltv: Math.floor(Math.random() * 20000) + 5000,
    clv: Math.floor(Math.random() * 15000) + 3000,
    churn_risk: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as "low" | "medium" | "high",
  },
  status: ["new", "active", "dormant"][Math.floor(Math.random() * 3)] as "new" | "active" | "dormant",
  segment: ["VIP", "Regular", "Occasional", "New"][Math.floor(Math.random() * 4)],
  preferences: {
    cuisine: ["North Indian", "South Indian", "Chinese"][Math.floor(Math.random() * 3)],
    dietary: ["Vegetarian", "Non-Vegetarian"][Math.floor(Math.random() * 2)],
    communication: ["Email", "SMS", "WhatsApp"][Math.floor(Math.random() * 3)],
  },
  created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
}))

// Mock Reviews Data
export const mockReviews = [
  {
    id: "review-1",
    customer_name: "Sarah M.",
    rating: 5,
    title: "Amazing Experience!",
    text: "The butter chicken was absolutely divine! Service was excellent and the atmosphere was perfect for our date night.",
    platform: "google",
    date: "2024-01-15",
    sentiment: "positive",
    response: "Thank you Sarah! We're delighted you enjoyed your evening with us.",
    responded_at: "2024-01-16",
    helpful_votes: 12,
    verified: true,
  },
  {
    id: "review-2",
    customer_name: "Mike R.",
    rating: 4,
    title: "Great Food, Good Service",
    text: "Really enjoyed the biryani and the garlic naan. Staff was friendly and attentive. Will definitely come back!",
    platform: "yelp",
    date: "2024-01-12",
    sentiment: "positive",
    response: null,
    responded_at: null,
    helpful_votes: 8,
    verified: true,
  },
  {
    id: "review-3",
    customer_name: "Jennifer L.",
    rating: 5,
    title: "Best Indian Food in Town",
    text: "Authentic flavors, generous portions, and excellent service. The paneer tikka was outstanding!",
    platform: "tripadvisor",
    date: "2024-01-10",
    sentiment: "positive",
    response: "Thank you Jennifer! We're thrilled you loved the paneer tikka.",
    responded_at: "2024-01-11",
    helpful_votes: 15,
    verified: true,
  },
]

// Mock Marketing Campaigns
export const mockCampaigns = [
  {
    id: "campaign-1",
    name: "Weekend Brunch Special",
    type: "promotion",
    status: "active",
    budget: 2500,
    spent: 1200,
    start_date: "2024-01-01",
    end_date: "2024-01-31",
    channels: ["facebook", "instagram", "google"],
    metrics: {
      impressions: 45000,
      clicks: 1200,
      conversions: 85,
      ctr: 2.67,
      conversion_rate: 7.08,
      roas: 3.2,
    },
    target_audience: "Families, Young Professionals",
    description: "Promote our new weekend brunch menu with special pricing",
  },
  {
    id: "campaign-2",
    name: "Valentine's Day Special",
    type: "seasonal",
    status: "completed",
    budget: 1500,
    spent: 1450,
    start_date: "2024-02-01",
    end_date: "2024-02-14",
    channels: ["instagram", "email"],
    metrics: {
      impressions: 28000,
      clicks: 890,
      conversions: 65,
      ctr: 3.18,
      conversion_rate: 7.3,
      roas: 4.1,
    },
    target_audience: "Couples, Date Night",
    description: "Special romantic dinner packages for Valentine's Day",
  },
]

// Mock Analytics Data
export const mockAnalytics = {
  revenue: {
    total: 125000,
    monthly: [
      { month: "Jan", revenue: 18500, orders: 245 },
      { month: "Feb", revenue: 22000, orders: 289 },
      { month: "Mar", revenue: 19800, orders: 267 },
      { month: "Apr", revenue: 21500, orders: 278 },
    ],
    growth: 12.5,
  },
  customers: {
    total: 1250,
    new_this_month: 85,
    retention_rate: 78.5,
    churn_rate: 12.3,
    segments: {
      vip: 125,
      regular: 450,
      occasional: 375,
      new: 300,
    },
  },
  menu_performance: {
    top_items: [
      { name: "Butter Chicken", orders: 156, revenue: 2650 },
      { name: "Chicken Biryani", orders: 134, revenue: 2545 },
      { name: "Dal Makhani", orders: 98, revenue: 1370 },
    ],
    category_performance: [
      { category: "Main Course", orders: 445, revenue: 7850 },
      { category: "Appetizers", orders: 234, revenue: 2340 },
      { category: "Breads & Rice", orders: 189, revenue: 754 },
    ],
  },
  reviews: {
    average_rating: 4.7,
    total_reviews: 892,
    sentiment_distribution: {
      positive: 78,
      neutral: 18,
      negative: 4,
    },
    platform_ratings: {
      google: { rating: 4.8, reviews: 356 },
      yelp: { rating: 4.6, reviews: 234 },
      tripadvisor: { rating: 4.7, reviews: 178 },
      zomato: { rating: 4.5, reviews: 124 },
    },
  },
}

// Mock Generated Content
export const mockGeneratedContent = [
  {
    id: "content-1",
    title: "Weekend Combo Meals",
    content_type: "combos",
    status: "generated",
    created_at: "2024-01-15T10:30:00Z",
    content_data: [
      {
        name: "Family Feast Combo",
        description: "Perfect for family dining with variety for everyone",
        items: ["Butter Chicken", "Dal Makhani", "Garlic Naan", "Basmati Rice"],
        original_price: 45.96,
        combo_price: 38.99,
        savings: 6.97,
        serves: "3-4 people",
      },
      {
        name: "Date Night Special",
        description: "Romantic dinner for two with our signature dishes",
        items: ["Paneer Tikka", "Chicken Biryani", "Garlic Naan"],
        original_price: 33.97,
        combo_price: 28.99,
        savings: 4.98,
        serves: "2 people",
      },
    ],
  },
  {
    id: "content-2",
    title: "Enhanced Item Descriptions",
    content_type: "item-descriptions",
    status: "applied",
    created_at: "2024-01-14T15:20:00Z",
    content_data: [
      {
        itemId: "item-1",
        itemName: "Samosa Chaat",
        description: "Crispy golden samosas topped with tangy tamarind chutney, cooling mint sauce, and creamy yogurt",
        tasteTags: ["crispy", "tangy", "vegetarian"],
        promoTags: ["popular", "street-food"],
      },
    ],
  },
]

// Mock Database Store
interface MockDatabaseStore {
  restaurant: typeof mockRestaurantProfile
  menu: typeof mockMenuData
  customers: typeof mockCustomers
  reviews: typeof mockReviews
  campaigns: typeof mockCampaigns
  analytics: typeof mockAnalytics
  generatedContent: typeof mockGeneratedContent

  // Actions
  updateRestaurant: (data: Partial<typeof mockRestaurantProfile>) => void
  addMenuItem: (categoryId: string, item: any) => void
  updateMenuItem: (itemId: string, updates: any) => void
  addCustomer: (customer: any) => void
  addReview: (review: any) => void
  addCampaign: (campaign: any) => void
  addGeneratedContent: (content: any) => void
}

export const useMockDatabase = create<MockDatabaseStore>((set, get) => ({
  restaurant: mockRestaurantProfile,
  menu: mockMenuData,
  customers: mockCustomers,
  reviews: mockReviews,
  campaigns: mockCampaigns,
  analytics: mockAnalytics,
  generatedContent: mockGeneratedContent,

  updateRestaurant: (data) =>
    set((state) => ({
      restaurant: { ...state.restaurant, ...data, updated_at: new Date().toISOString() },
    })),

  addMenuItem: (categoryId, item) =>
    set((state) => ({
      menu: {
        ...state.menu,
        categories: state.menu.categories.map((cat) =>
          cat.id === categoryId ? { ...cat, items: [...cat.items, { ...item, id: `item-${Date.now()}` }] } : cat,
        ),
      },
    })),

  updateMenuItem: (itemId, updates) =>
    set((state) => ({
      menu: {
        ...state.menu,
        categories: state.menu.categories.map((cat) => ({
          ...cat,
          items: cat.items.map((item) => (item.id === itemId ? { ...item, ...updates } : item)),
        })),
      },
    })),

  addCustomer: (customer) =>
    set((state) => ({
      customers: [...state.customers, { ...customer, id: `customer-${Date.now()}` }],
    })),

  addReview: (review) =>
    set((state) => ({
      reviews: [...state.reviews, { ...review, id: `review-${Date.now()}` }],
    })),

  addCampaign: (campaign) =>
    set((state) => ({
      campaigns: [...state.campaigns, { ...campaign, id: `campaign-${Date.now()}` }],
    })),

  addGeneratedContent: (content) =>
    set((state) => ({
      generatedContent: [...state.generatedContent, { ...content, id: `content-${Date.now()}` }],
    })),
}))
