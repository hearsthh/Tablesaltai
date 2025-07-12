import type {
  Customer,
  SpendTag,
  ActivityTag,
  BehaviorTag,
  TagCalculationInput,
  TagCalculationResult,
  RestaurantCustomerSummary,
} from "@/lib/types/customer-tagging"

export class CustomerTaggingService {
  // Calculate all tags for customers
  static calculateCustomerTags(input: TagCalculationInput): TagCalculationResult[] {
    const { customers, restaurant_avg_visit_gap } = input
    const results: TagCalculationResult[] = []

    // Calculate percentiles for spend tags
    const ltvValues = customers.map((c) => c.total_spend).sort((a, b) => b - a)
    const aovValues = customers.map((c) => c.average_order_value).sort((a, b) => b - a)
    const visitFreqValues = customers.map((c) => c.total_visits).sort((a, b) => b - a)

    const ltv90th = this.getPercentile(ltvValues, 90)
    const aov80th = this.getPercentile(aovValues, 80)
    const visitFreq80th = this.getPercentile(visitFreqValues, 80)

    customers.forEach((customer) => {
      const oldTags = {
        spend_tag: customer.spend_tag,
        activity_tag: customer.activity_tag,
        behavior_tags: [...customer.behavior_tags],
      }

      // Calculate new tags
      const newSpendTag = this.calculateSpendTag(customer, ltv90th, aov80th)
      const newActivityTag = this.calculateActivityTag(customer, restaurant_avg_visit_gap, visitFreq80th)
      const newBehaviorTags = this.calculateBehaviorTags(customer)

      const newTags = {
        spend_tag: newSpendTag,
        activity_tag: newActivityTag,
        behavior_tags: newBehaviorTags,
      }

      const changesDetected =
        oldTags.spend_tag !== newTags.spend_tag ||
        oldTags.activity_tag !== newTags.activity_tag ||
        !this.arraysEqual(oldTags.behavior_tags, newTags.behavior_tags)

      results.push({
        customer_id: customer.id,
        old_tags: oldTags,
        new_tags: newTags,
        changes_detected: changesDetected,
      })
    })

    return results
  }

  // Calculate spend tag based on percentiles
  private static calculateSpendTag(customer: Customer, ltv90th: number, aov80th: number): SpendTag {
    if (customer.total_spend >= ltv90th) {
      return "vip"
    } else if (customer.average_order_value >= aov80th) {
      return "high_spender"
    } else if (customer.average_order_value >= aov80th * 0.6) {
      return "mid_spender"
    } else {
      return "low_spender"
    }
  }

  // Calculate activity tag based on visit patterns
  private static calculateActivityTag(
    customer: Customer,
    restaurantAvgGap: number,
    visitFreq80th: number,
  ): ActivityTag {
    const daysSinceFirstVisit = this.daysBetween(customer.first_visit_date, new Date().toISOString())
    const daysSinceLastVisit = this.daysBetween(customer.last_visit_date, new Date().toISOString())

    // New customer logic
    if (daysSinceFirstVisit <= 0.5 * restaurantAvgGap) {
      return "new"
    }

    // Loyal customer (high visit frequency)
    if (customer.total_visits >= visitFreq80th) {
      return "loyal"
    }

    // Activity based on last visit
    if (daysSinceLastVisit <= 1.5 * customer.average_visit_gap) {
      return "active"
    } else if (daysSinceLastVisit >= 2 * customer.average_visit_gap) {
      return "churn_risk"
    } else if (daysSinceLastVisit > 90) {
      return "inactive"
    }

    return "active" // default
  }

  // Calculate behavior tags based on order patterns
  private static calculateBehaviorTags(customer: Customer): BehaviorTag[] {
    const tags: BehaviorTag[] = []

    if (customer.order_history.length === 0) return tags

    // Combo responder: Orders combos >3 times
    const comboOrders = customer.order_history.filter((order) => order.items.some((item) => item.is_combo)).length
    if (comboOrders >= 3) {
      tags.push("combo_responder")
    }

    // Weekend only: 70% visits on weekends
    const weekendOrders = customer.order_history.filter((order) => {
      const date = new Date(order.timestamp)
      const dayOfWeek = date.getDay()
      return dayOfWeek === 0 || dayOfWeek === 6 // Sunday or Saturday
    }).length
    const weekendPercentage = (weekendOrders / customer.order_history.length) * 100
    if (weekendPercentage >= 70) {
      tags.push("weekend_only")
    }

    // Category loyalist: Category repeat > 60%
    const categoryCount: { [key: string]: number } = {}
    customer.order_history.forEach((order) => {
      order.categories.forEach((category) => {
        categoryCount[category] = (categoryCount[category] || 0) + 1
      })
    })
    const totalCategoryOrders = Object.values(categoryCount).reduce((sum, count) => sum + count, 0)
    const maxCategoryCount = Math.max(...Object.values(categoryCount))
    const categoryLoyaltyPercentage = (maxCategoryCount / totalCategoryOrders) * 100
    if (categoryLoyaltyPercentage > 60) {
      tags.push("category_loyalist")
    }

    // Family diner: guest_estimate_avg ≥ 3
    if (customer.guest_estimate_avg >= 3) {
      tags.push("family_diner")
    }

    // Time-based patterns
    const lunchOrders = customer.order_history.filter((order) => {
      const hour = new Date(order.timestamp).getHours()
      return hour >= 11 && hour <= 15
    }).length
    const dinnerOrders = customer.order_history.filter((order) => {
      const hour = new Date(order.timestamp).getHours()
      return hour >= 18 && hour <= 22
    }).length

    if (lunchOrders / customer.order_history.length >= 0.7) {
      tags.push("lunch_regular")
    }
    if (dinnerOrders / customer.order_history.length >= 0.7) {
      tags.push("dinner_regular")
    }

    // Price sensitivity
    const avgOrderValue = customer.average_order_value
    if (avgOrderValue < 200) {
      tags.push("price_sensitive")
    } else if (avgOrderValue > 800) {
      tags.push("premium_seeker")
    }

    return tags
  }

  // Calculate restaurant summary
  static calculateRestaurantSummary(customers: Customer[], restaurantId: string): RestaurantCustomerSummary {
    const totalCustomers = customers.length
    const churnRiskCustomers = customers.filter((c) => c.activity_tag === "churn_risk").length
    const churnRate = (churnRiskCustomers / totalCustomers) * 100

    // Active rate (visited in last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const activeCustomers = customers.filter((c) => new Date(c.last_visit_date) >= thirtyDaysAgo).length
    const activeRate = (activeCustomers / totalCustomers) * 100

    // Restaurant average visit gap
    const avgVisitGap = customers.reduce((sum, c) => sum + c.average_visit_gap, 0) / totalCustomers

    // Top 10% by LTV
    const sortedByLTV = [...customers].sort((a, b) => b.total_spend - a.total_spend)
    const top10PercentCount = Math.ceil(totalCustomers * 0.1)
    const top10PercentLTV = sortedByLTV.slice(0, top10PercentCount)

    // Most common behavior tags
    const behaviorTagCount: { [key: string]: number } = {}
    customers.forEach((customer) => {
      customer.behavior_tags.forEach((tag) => {
        behaviorTagCount[tag] = (behaviorTagCount[tag] || 0) + 1
      })
    })
    const mostCommonBehaviorTags = Object.entries(behaviorTagCount)
      .map(([tag, count]) => ({
        tag: tag as BehaviorTag,
        count,
        percentage: (count / totalCustomers) * 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // New customers count
    const newCustomersCount = customers.filter((c) => c.activity_tag === "new").length

    // Tag distributions
    const spendTagCount: { [key in SpendTag]: number } = {
      low_spender: 0,
      mid_spender: 0,
      high_spender: 0,
      vip: 0,
    }
    const activityTagCount: { [key in ActivityTag]: number } = {
      new: 0,
      active: 0,
      loyal: 0,
      churn_risk: 0,
      inactive: 0,
    }

    customers.forEach((customer) => {
      spendTagCount[customer.spend_tag]++
      activityTagCount[customer.activity_tag]++
    })

    const spendTagDistribution = Object.entries(spendTagCount).map(([tag, count]) => ({
      tag: tag as SpendTag,
      count,
      percentage: (count / totalCustomers) * 100,
    }))

    const activityTagDistribution = Object.entries(activityTagCount).map(([tag, count]) => ({
      tag: tag as ActivityTag,
      count,
      percentage: (count / totalCustomers) * 100,
    }))

    return {
      restaurant_id: restaurantId,
      total_customers: totalCustomers,
      churn_rate: Math.round(churnRate * 100) / 100,
      active_rate: Math.round(activeRate * 100) / 100,
      average_visit_gap: Math.round(avgVisitGap * 100) / 100,
      top_10_percent_ltv: top10PercentLTV,
      most_common_behavior_tags: mostCommonBehaviorTags,
      new_customers_count: newCustomersCount,
      spend_tag_distribution: spendTagDistribution,
      activity_tag_distribution: activityTagDistribution,
      last_calculated: new Date().toISOString(),
    }
  }

  // Utility functions
  private static getPercentile(sortedArray: number[], percentile: number): number {
    const index = Math.ceil((percentile / 100) * sortedArray.length) - 1
    return sortedArray[Math.max(0, index)] || 0
  }

  private static daysBetween(date1: string, date2: string): number {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    const diffTime = Math.abs(d2.getTime() - d1.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  private static arraysEqual(arr1: string[], arr2: string[]): boolean {
    if (arr1.length !== arr2.length) return false
    const sorted1 = [...arr1].sort()
    const sorted2 = [...arr2].sort()
    return sorted1.every((val, index) => val === sorted2[index])
  }
}
