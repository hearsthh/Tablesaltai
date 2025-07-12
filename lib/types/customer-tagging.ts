export interface Customer {
  id: string
  name: string
  phone: string
  email?: string

  // Visit tracking
  first_visit_date: string
  last_visit_date: string
  total_visits: number

  // Financial metrics
  total_spend: number // LTV
  average_order_value: number // AOV
  average_visit_gap: number // days between visits
  guest_estimate_avg: number // avg(items per order ÷ 1.5)

  // Order history
  order_history: CustomerOrder[]

  // Tags
  spend_tag: SpendTag
  activity_tag: ActivityTag
  behavior_tags: BehaviorTag[]

  // Metadata
  created_at: string
  updated_at: string
  restaurant_id: string
}

export interface CustomerOrder {
  id: string
  timestamp: string
  items: OrderItem[]
  categories: string[]
  total_amount: number
  guest_count_estimate: number
  order_source: "dine_in" | "takeaway" | "delivery" | "online"
}

export interface OrderItem {
  id: string
  name: string
  category: string
  price: number
  quantity: number
  is_combo: boolean
}

// Tag types
export type SpendTag = "low_spender" | "mid_spender" | "high_spender" | "vip"
export type ActivityTag = "new" | "active" | "loyal" | "churn_risk" | "inactive"
export type BehaviorTag =
  | "combo_responder"
  | "weekend_only"
  | "category_loyalist"
  | "family_diner"
  | "lunch_regular"
  | "dinner_regular"
  | "price_sensitive"
  | "premium_seeker"

// Restaurant summary metrics
export interface RestaurantCustomerSummary {
  restaurant_id: string
  total_customers: number
  churn_rate: number // % with 'churn_risk'
  active_rate: number // % visited in last 30 days
  average_visit_gap: number // restaurant average

  // Top segments
  top_10_percent_ltv: Customer[]
  most_common_behavior_tags: { tag: BehaviorTag; count: number; percentage: number }[]
  new_customers_count: number

  // Tag distribution
  spend_tag_distribution: { tag: SpendTag; count: number; percentage: number }[]
  activity_tag_distribution: { tag: ActivityTag; count: number; percentage: number }[]

  last_calculated: string
}

// Automation trigger events
export interface AutomationTrigger {
  id: string
  customer_id: string
  trigger_type: TriggerType
  trigger_data: TriggerData
  created_at: string
  processed: boolean
  campaign_sent?: string
}

export type TriggerType =
  | "tag_changed"
  | "new_customer"
  | "churn_risk"
  | "vip_upgrade"
  | "inactive_customer"
  | "high_value_order"
  | "milestone_reached"

export interface TriggerData {
  old_tags?: string[]
  new_tags?: string[]
  milestone_type?: "visits" | "spend" | "anniversary"
  milestone_value?: number
  order_value?: number
}

// Campaign personalization data
export interface PersonalizationData {
  customer: Customer
  recommended_items: string[]
  preferred_categories: string[]
  optimal_contact_time: string
  discount_sensitivity: "low" | "medium" | "high"
  message_tone: "casual" | "formal" | "enthusiastic"
}

// Tag calculation utilities
export interface TagCalculationInput {
  customers: Customer[]
  restaurant_avg_visit_gap: number
}

export interface TagCalculationResult {
  customer_id: string
  old_tags: {
    spend_tag: SpendTag
    activity_tag: ActivityTag
    behavior_tags: BehaviorTag[]
  }
  new_tags: {
    spend_tag: SpendTag
    activity_tag: ActivityTag
    behavior_tags: BehaviorTag[]
  }
  changes_detected: boolean
}
