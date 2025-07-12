// Complete restaurant data types based on the provided specification
export interface RestaurantData {
  id: string
  userId: string

  // Registration Section
  registration: {
    emailId: string
    mobileNo: string
  }

  // Identification Section
  identification: {
    restaurantName: string
    address: string
    location: string // PIN code
    restaurantPhoneNumber: string
  }

  // Info Section
  info: {
    map: {
      latitude: number
      longitude: number
    }
    priceRange: string // Selection
    cuisines: string[] // Multiple selections
    dietaryOptions: string[] // Veg/non-veg/vegan - Multiple selections
    type: string // Selection
    timings: {
      [key: string]: {
        isOpen: boolean
        openTime: string
        closeTime: string
      }
    } // Days & Hours selection
  }

  // Brand Assets Section
  brandAssets: {
    logo: {
      url: string
      fileName: string
      fileSize: number
    } | null // File
    logoColors: string[] // Selection
    brandVoice: string // Selection
    positioning: string // Selection
  }

  // More Info Section
  moreInfo: {
    chefIntro: string // Free text
    conceptDescription: string // Free text
    legacy: string // Free text
    awardsRecognition: string[] // Bullet points
    mediaCoverage: string[] // Bullet points
    highlights: string[] // Bullet points
    amenities: string[] // Selection + custom
    features: string[] // Selection + custom
  }

  // Metadata
  createdAt: string
  updatedAt: string
  completionStatus: {
    registration: boolean
    identification: boolean
    info: boolean
    brandAssets: boolean
    moreInfo: boolean
    overall: number // percentage
  }
}

// Field options for selections
export const FIELD_OPTIONS = {
  priceRange: [
    { value: "budget", label: "₹ - Budget Friendly (Under ₹500)" },
    { value: "moderate", label: "₹₹ - Moderate (₹500-₹1000)" },
    { value: "upscale", label: "₹₹₹ - Upscale (₹1000-₹2000)" },
    { value: "fine_dining", label: "₹₹₹₹ - Fine Dining (Above ₹2000)" },
  ],

  cuisines: [
    "North Indian",
    "South Indian",
    "Chinese",
    "Italian",
    "Continental",
    "Mexican",
    "Thai",
    "Japanese",
    "Korean",
    "Mediterranean",
    "Lebanese",
    "Mughlai",
    "Punjabi",
    "Bengali",
    "Gujarati",
    "Rajasthani",
    "Hyderabadi",
    "Goan",
    "Maharashtrian",
    "Tamil",
    "Kerala",
    "Andhra",
    "Fast Food",
    "Street Food",
    "Desserts",
    "Bakery",
    "Cafe",
    "Bar",
    "Fusion",
  ],

  dietaryOptions: [
    "Pure Vegetarian",
    "Non-Vegetarian",
    "Vegan Options",
    "Jain Food",
    "Gluten-Free Options",
    "Keto-Friendly",
    "Diabetic-Friendly",
    "Organic",
  ],

  restaurantType: [
    "Fine Dining",
    "Casual Dining",
    "Quick Service Restaurant (QSR)",
    "Fast Casual",
    "Food Court",
    "Cloud Kitchen",
    "Home Delivery",
    "Cafe",
    "Bar & Grill",
    "Buffet",
    "Food Truck",
    "Catering",
    "Bakery",
    "Sweet Shop",
    "Juice Bar",
    "Ice Cream Parlor",
  ],

  logoColors: [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E9",
    "#F8C471",
    "#82E0AA",
    "#F1948A",
    "#85C1E9",
    "#000000",
    "#FFFFFF",
    "#808080",
    "#8B4513",
  ],

  brandVoice: [
    "Friendly & Approachable",
    "Professional & Sophisticated",
    "Fun & Playful",
    "Traditional & Authentic",
    "Modern & Trendy",
    "Warm & Welcoming",
    "Premium & Exclusive",
    "Casual & Relaxed",
    "Energetic & Vibrant",
  ],

  positioning: [
    "Premium Fine Dining",
    "Family Restaurant",
    "Quick Bite",
    "Romantic Dining",
    "Business Dining",
    "Casual Hangout",
    "Traditional Authentic",
    "Modern Fusion",
    "Health Conscious",
    "Value for Money",
    "Luxury Experience",
    "Local Favorite",
  ],

  amenities: [
    "Air Conditioning",
    "Free WiFi",
    "Parking Available",
    "Valet Parking",
    "Home Delivery",
    "Online Ordering",
    "Card Payment",
    "Digital Payment",
    "Wheelchair Accessible",
    "Kid-Friendly",
    "Pet-Friendly",
    "Outdoor Seating",
    "Private Dining",
    "Live Music",
    "DJ",
    "Dance Floor",
    "Bar",
    "Smoking Area",
    "Non-Smoking",
    "Buffet",
    "Breakfast",
    "Lunch",
    "Dinner",
    "Late Night",
    "24/7 Service",
    "Takeaway",
    "Catering Services",
    "Event Hosting",
  ],

  features: [
    "Chef's Special",
    "Live Kitchen",
    "Wood Fired Oven",
    "Tandoor",
    "Fresh Ingredients",
    "Organic Produce",
    "Farm to Table",
    "Homemade",
    "Secret Recipe",
    "Family Recipe",
    "Award Winning",
    "Celebrity Chef",
    "Michelin Recommended",
    "TripAdvisor Certified",
    "Zomato Gold",
    "Swiggy Partner",
    "Uber Eats",
    "Instagram Worthy",
    "Instagrammable Decor",
  ],
}

export const DAYS_OF_WEEK = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
]
