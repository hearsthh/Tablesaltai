import { getSupabaseServerClient } from "@/lib/supabase/server"

export interface MockReviewData {
  id: string
  restaurant_id: string
  author_name: string
  author_profile_url?: string
  author_photo_url?: string
  rating: number
  title?: string
  content: string
  platform: string
  platform_review_id: string
  platform_url?: string
  platform_rating_scale: string
  review_date: string
  visit_date?: string
  verified: boolean
  helpful_votes: number
  total_votes: number
  photos: string[]
  videos: string[]
  food_rating?: number
  service_rating?: number
  ambiance_rating?: number
  value_rating?: number
  cleanliness_rating?: number
  sentiment: "positive" | "negative" | "neutral"
  sentiment_score: number
  emotion?: string
  topics: string[]
  keywords: string[]
  mentioned_items: string[]
  mentioned_staff: string[]
  review_type: string
  visit_type: string
  party_size?: number
  occasion?: string
  has_response: boolean
  response_text?: string
  response_date?: string
  response_author?: string
  response_helpful_votes: number
  auto_response: boolean
  response_template_id?: string
  is_fake: boolean
  is_spam: boolean
  requires_attention: boolean
  moderation_status: string
  internal_notes?: string
  view_count: number
  share_count: number
  influenced_bookings: number
  estimated_revenue_impact: number
  categories: string[]
  tags: string[]
}

const REVIEW_TEMPLATES = {
  positive: [
    {
      title: "Amazing food and service!",
      content:
        "Had an incredible dining experience here. The {dish} was absolutely delicious and the staff was very attentive. The ambiance was perfect for our {occasion}. Will definitely be coming back!",
      keywords: ["delicious", "attentive", "perfect", "incredible"],
      topics: ["food quality", "service", "ambiance"],
      emotion: "delighted",
    },
    {
      title: "Best {cuisine} in town!",
      content:
        "This place never disappoints! The {dish} is always fresh and flavorful. {staff_name} provided excellent service throughout our meal. Highly recommend for anyone looking for authentic {cuisine} cuisine.",
      keywords: ["fresh", "flavorful", "excellent", "authentic"],
      topics: ["food quality", "service", "authenticity"],
      emotion: "satisfied",
    },
    {
      title: "Perfect for special occasions",
      content:
        "Celebrated our {occasion} here and it was perfect! The atmosphere is elegant, food is top-notch, and the service is impeccable. The {dish} was the highlight of our meal.",
      keywords: ["perfect", "elegant", "top-notch", "impeccable"],
      topics: ["ambiance", "food quality", "service", "special occasions"],
      emotion: "happy",
    },
  ],
  negative: [
    {
      title: "Disappointing experience",
      content:
        "Unfortunately, our visit was quite disappointing. The {dish} was cold when it arrived and the service was slow. We waited over 30 minutes just to place our order. Expected much better.",
      keywords: ["disappointing", "cold", "slow", "waited"],
      topics: ["food temperature", "service speed", "wait time"],
      emotion: "disappointed",
    },
    {
      title: "Not worth the price",
      content:
        "The food was average at best, but the prices are way too high for what you get. The {dish} lacked flavor and the portion size was small. Service was okay but nothing special.",
      keywords: ["average", "expensive", "lacked flavor", "small portion"],
      topics: ["value for money", "food quality", "portion size"],
      emotion: "frustrated",
    },
    {
      title: "Poor service ruined the meal",
      content:
        "The food was decent, but the service was terrible. Our server was rude and inattentive. We had to ask multiple times for basic things like water refills. Won't be returning.",
      keywords: ["terrible", "rude", "inattentive", "multiple times"],
      topics: ["service quality", "staff behavior"],
      emotion: "angry",
    },
  ],
  neutral: [
    {
      title: "Decent place, nothing special",
      content:
        "It's an okay restaurant. The {dish} was fine, service was standard. Nothing particularly stood out, but nothing was terrible either. Might come back if in the area.",
      keywords: ["okay", "fine", "standard", "nothing special"],
      topics: ["overall experience", "food quality", "service"],
      emotion: "neutral",
    },
    {
      title: "Mixed experience",
      content:
        "Some things were good, others not so much. The {dish} was tasty but the {other_dish} was bland. Service was friendly but slow. It's hit or miss here.",
      keywords: ["mixed", "tasty", "bland", "friendly", "slow"],
      topics: ["food quality", "service", "consistency"],
      emotion: "neutral",
    },
  ],
}

const PLATFORMS = [
  { name: "Google", weight: 40, scale: "1-5" },
  { name: "Zomato", weight: 25, scale: "1-5" },
  { name: "TripAdvisor", weight: 15, scale: "1-5" },
  { name: "Yelp", weight: 10, scale: "1-5" },
  { name: "Facebook", weight: 10, scale: "1-5" },
]

const CUISINES = ["Indian", "Italian", "Chinese", "Continental", "Mexican", "Thai", "Japanese"]
const DISHES = ["Butter Chicken", "Biryani", "Pasta", "Pizza", "Noodles", "Curry", "Tandoori", "Dosa"]
const STAFF_NAMES = ["Raj", "Priya", "Amit", "Sneha", "Vikram", "Anita", "Rohit", "Kavya"]
const OCCASIONS = ["anniversary", "birthday", "date night", "family dinner", "business lunch", "celebration"]

const REVIEW_CATEGORIES = [
  { name: "Food Quality", description: "Reviews about taste, freshness, and preparation", color: "#EF4444" },
  { name: "Service", description: "Reviews about staff behavior and service quality", color: "#3B82F6" },
  { name: "Ambiance", description: "Reviews about atmosphere and environment", color: "#10B981" },
  { name: "Value for Money", description: "Reviews about pricing and portions", color: "#F59E0B" },
  { name: "Cleanliness", description: "Reviews about hygiene and cleanliness", color: "#8B5CF6" },
  { name: "Wait Time", description: "Reviews about service speed and waiting", color: "#EF4444" },
  { name: "Special Occasions", description: "Reviews for celebrations and events", color: "#EC4899" },
]

const REVIEW_TAGS = [
  "authentic",
  "fresh",
  "delicious",
  "spicy",
  "mild",
  "hot",
  "cold",
  "slow-service",
  "fast-service",
  "friendly-staff",
  "rude-staff",
  "clean",
  "dirty",
  "expensive",
  "affordable",
  "large-portions",
  "small-portions",
  "noisy",
  "quiet",
  "crowded",
  "empty",
  "parking-available",
  "no-parking",
  "family-friendly",
  "romantic",
  "casual",
]

const RESPONSE_TEMPLATES = [
  {
    sentiment: "positive",
    templates: [
      "Thank you so much for your wonderful review! We're thrilled that you enjoyed your experience with us. We look forward to serving you again soon!",
      "We're delighted to hear about your positive experience! Your kind words mean a lot to our team. See you again soon!",
      "Thank you for taking the time to share your feedback! We're so happy you loved the food and service. Can't wait to welcome you back!",
    ],
  },
  {
    sentiment: "negative",
    templates: [
      "We sincerely apologize for the disappointing experience. Your feedback is valuable to us and we're taking immediate steps to address these issues. Please give us another chance to serve you better.",
      "Thank you for bringing this to our attention. We take all feedback seriously and are working to improve. We'd love the opportunity to make it right - please contact us directly.",
      "We're sorry to hear about your experience and appreciate you taking the time to share your concerns. We're committed to doing better and hope you'll consider giving us another try.",
    ],
  },
  {
    sentiment: "neutral",
    templates: [
      "Thank you for your honest feedback! We appreciate you taking the time to review us and will use your comments to continue improving our service.",
      "We value your feedback and are always working to enhance our guests' experience. Thank you for visiting us!",
      "Thanks for the review! We're constantly striving to improve and your input helps us do that. Hope to see you again soon!",
    ],
  },
]

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function getWeightedPlatform(): string {
  const random = Math.random() * 100
  let cumulative = 0

  for (const platform of PLATFORMS) {
    cumulative += platform.weight
    if (random <= cumulative) {
      return platform.name
    }
  }
  return PLATFORMS[0].name
}

function generateSentimentDistribution(): "positive" | "negative" | "neutral" {
  const random = Math.random()
  if (random < 0.6) return "positive" // 60% positive
  if (random < 0.8) return "neutral" // 20% neutral
  return "negative" // 20% negative
}

function generateRatingFromSentiment(sentiment: "positive" | "negative" | "neutral"): number {
  switch (sentiment) {
    case "positive":
      return Math.random() < 0.7 ? 5 : 4
    case "negative":
      return Math.random() < 0.5 ? 1 : 2
    case "neutral":
      return Math.random() < 0.6 ? 3 : Math.random() < 0.5 ? 2 : 4
  }
}

function generateDetailedRatings(overallRating: number): {
  food_rating: number
  service_rating: number
  ambiance_rating: number
  value_rating: number
  cleanliness_rating: number
} {
  const variance = 0.5
  return {
    food_rating: Math.max(1, Math.min(5, overallRating + (Math.random() - 0.5) * variance)),
    service_rating: Math.max(1, Math.min(5, overallRating + (Math.random() - 0.5) * variance)),
    ambiance_rating: Math.max(1, Math.min(5, overallRating + (Math.random() - 0.5) * variance)),
    value_rating: Math.max(1, Math.min(5, overallRating + (Math.random() - 0.5) * variance)),
    cleanliness_rating: Math.max(1, Math.min(5, overallRating + (Math.random() - 0.5) * variance)),
  }
}

function generateReviewContent(
  sentiment: "positive" | "negative" | "neutral",
  cuisine: string,
): {
  title: string
  content: string
  keywords: string[]
  topics: string[]
  emotion: string
} {
  const templates = REVIEW_TEMPLATES[sentiment]
  const template = getRandomElement(templates)

  const dish = getRandomElement(DISHES)
  const otherDish = getRandomElement(DISHES.filter((d) => d !== dish))
  const staffName = getRandomElement(STAFF_NAMES)
  const occasion = getRandomElement(OCCASIONS)

  const content = template.content
    .replace(/{dish}/g, dish)
    .replace(/{other_dish}/g, otherDish)
    .replace(/{cuisine}/g, cuisine)
    .replace(/{staff_name}/g, staffName)
    .replace(/{occasion}/g, occasion)

  const title = template.title
    .replace(/{dish}/g, dish)
    .replace(/{cuisine}/g, cuisine)
    .replace(/{occasion}/g, occasion)

  return {
    title,
    content,
    keywords: template.keywords,
    topics: template.topics,
    emotion: template.emotion,
  }
}

function generateMockReview(restaurantId: string, cuisine: string, index: number): MockReviewData {
  const sentiment = generateSentimentDistribution()
  const rating = generateRatingFromSentiment(sentiment)
  const platform = getWeightedPlatform()
  const reviewContent = generateReviewContent(sentiment, cuisine)
  const detailedRatings = generateDetailedRatings(rating)

  const reviewDate = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000) // Last 90 days
  const visitDate = new Date(reviewDate.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Visit before review

  const hasResponse = Math.random() < 0.4 // 40% have responses
  const autoResponse = hasResponse && Math.random() < 0.3 // 30% of responses are auto

  const requiresAttention = sentiment === "negative" && rating <= 2

  return {
    id: `review_${restaurantId}_${index}`,
    restaurant_id: restaurantId,
    author_name: `User${index}`,
    author_profile_url: Math.random() < 0.3 ? `https://example.com/user${index}` : undefined,
    author_photo_url: Math.random() < 0.4 ? `/placeholder-user.jpg` : undefined,
    rating,
    title: reviewContent.title,
    content: reviewContent.content,
    platform,
    platform_review_id: `${platform.toLowerCase()}_${restaurantId}_${index}`,
    platform_url: `https://${platform.toLowerCase()}.com/review/${index}`,
    platform_rating_scale: "1-5",
    review_date: reviewDate.toISOString(),
    visit_date: visitDate.toISOString().split("T")[0],
    verified: Math.random() < 0.7, // 70% verified
    helpful_votes: Math.floor(Math.random() * 20),
    total_votes: Math.floor(Math.random() * 30),
    photos: Math.random() < 0.2 ? [`/placeholder.jpg`] : [],
    videos: Math.random() < 0.05 ? [`/placeholder-video.mp4`] : [],
    ...detailedRatings,
    sentiment,
    sentiment_score:
      sentiment === "positive"
        ? 0.7 + Math.random() * 0.3
        : sentiment === "negative"
          ? -0.7 - Math.random() * 0.3
          : -0.2 + Math.random() * 0.4,
    emotion: reviewContent.emotion,
    topics: reviewContent.topics,
    keywords: reviewContent.keywords,
    mentioned_items: Math.random() < 0.6 ? [getRandomElement(DISHES)] : [],
    mentioned_staff: Math.random() < 0.3 ? [getRandomElement(STAFF_NAMES)] : [],
    review_type: "general",
    visit_type: getRandomElement(["dine-in", "takeaway", "delivery"]),
    party_size: Math.random() < 0.7 ? Math.floor(Math.random() * 6) + 1 : undefined,
    occasion: Math.random() < 0.4 ? getRandomElement(OCCASIONS) : undefined,
    has_response: hasResponse,
    response_text: hasResponse
      ? getRandomElement(RESPONSE_TEMPLATES.find((t) => t.sentiment === sentiment)?.templates || [])
      : undefined,
    response_date: hasResponse
      ? new Date(reviewDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      : undefined,
    response_author: hasResponse ? "Restaurant Manager" : undefined,
    response_helpful_votes: hasResponse ? Math.floor(Math.random() * 10) : 0,
    auto_response: autoResponse,
    response_template_id: autoResponse ? `template_${sentiment}_1` : undefined,
    is_fake: Math.random() < 0.02, // 2% fake reviews
    is_spam: Math.random() < 0.01, // 1% spam
    requires_attention: requiresAttention,
    moderation_status: "approved",
    internal_notes: requiresAttention ? "Requires follow-up" : undefined,
    view_count: Math.floor(Math.random() * 100),
    share_count: Math.floor(Math.random() * 5),
    influenced_bookings: Math.floor(Math.random() * 3),
    estimated_revenue_impact: rating >= 4 ? Math.floor(Math.random() * 500) : -Math.floor(Math.random() * 200),
    categories: [getRandomElement(REVIEW_CATEGORIES).name],
    tags: Array.from(new Set([getRandomElement(REVIEW_TAGS), getRandomElement(REVIEW_TAGS)])),
  }
}

export async function generateReviewManagerMockData(restaurantId: string, cuisine = "Indian") {
  try {
    const supabase = getSupabaseServerClient()

    // Generate 150-300 reviews per restaurant
    const reviewCount = 150 + Math.floor(Math.random() * 150)
    const reviews: MockReviewData[] = []

    for (let i = 1; i <= reviewCount; i++) {
      reviews.push(generateMockReview(restaurantId, cuisine, i))
    }

    // Insert reviews in batches
    const batchSize = 50
    for (let i = 0; i < reviews.length; i += batchSize) {
      const batch = reviews.slice(i, i + batchSize)
      const { error } = await supabase.from("reviews").insert(batch)
      if (error) {
        console.error(`Error inserting review batch ${i / batchSize + 1}:`, error)
      }
    }

    // Generate response templates
    const responseTemplates = RESPONSE_TEMPLATES.flatMap((group) =>
      group.templates.map((template, index) => ({
        id: `template_${group.sentiment}_${index + 1}`,
        restaurant_id: restaurantId,
        template_name: `${group.sentiment.charAt(0).toUpperCase() + group.sentiment.slice(1)} Response ${index + 1}`,
        template_text: template,
        sentiment_target: group.sentiment,
        is_active: true,
        usage_count: Math.floor(Math.random() * 20),
      })),
    )

    await supabase.from("response_templates").insert(responseTemplates)

    // Generate review categories
    const categories = REVIEW_CATEGORIES.map((cat) => ({
      restaurant_id: restaurantId,
      category_name: cat.name,
      category_description: cat.description,
      color_code: cat.color,
      is_active: true,
    }))

    await supabase.from("review_categories").insert(categories)

    // Generate review tags
    const tags = REVIEW_TAGS.map((tag) => ({
      restaurant_id: restaurantId,
      tag_name: tag,
      tag_description: `Reviews tagged with ${tag}`,
      usage_count: Math.floor(Math.random() * 30),
      is_active: true,
    }))

    await supabase.from("review_tags").insert(tags)

    // Generate notification settings
    const notificationSettings = {
      restaurant_id: restaurantId,
      email_notifications: true,
      push_notifications: true,
      sms_notifications: false,
      notification_frequency: "realtime",
      notification_types: ["new_review", "negative_review"],
      notification_threshold: 3.0,
      auto_response_enabled: true,
      auto_response_delay_minutes: 60,
      business_hours_only: false,
    }

    await supabase.from("review_notification_settings").insert(notificationSettings)

    // Generate daily analytics for last 30 days
    const analytics = []
    for (let i = 0; i < 30; i++) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      const dayReviews = reviews.filter((r) => new Date(r.review_date).toDateString() === date.toDateString())

      if (dayReviews.length > 0) {
        analytics.push({
          restaurant_id: restaurantId,
          analysis_date: date.toISOString().split("T")[0],
          total_reviews: dayReviews.length,
          positive_reviews: dayReviews.filter((r) => r.sentiment === "positive").length,
          negative_reviews: dayReviews.filter((r) => r.sentiment === "negative").length,
          neutral_reviews: dayReviews.filter((r) => r.sentiment === "neutral").length,
          avg_rating: dayReviews.reduce((sum, r) => sum + r.rating, 0) / dayReviews.length,
          response_rate: (dayReviews.filter((r) => r.has_response).length / dayReviews.length) * 100,
          avg_response_time_hours: 2.5,
          sentiment_score: dayReviews.reduce((sum, r) => sum + r.sentiment_score, 0) / dayReviews.length,
          trending_keywords: ["delicious", "service", "ambiance"],
          top_complaints: ["slow service", "cold food"],
          top_compliments: ["great taste", "friendly staff"],
        })
      }
    }

    if (analytics.length > 0) {
      await supabase.from("review_analytics").insert(analytics)
    }

    return {
      success: true,
      generated: {
        reviews: reviews.length,
        response_templates: responseTemplates.length,
        categories: categories.length,
        tags: tags.length,
        analytics: analytics.length,
      },
    }
  } catch (error) {
    console.error("Error generating review manager mock data:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
