import type {
  AutomationTrigger,
  TriggerType,
  TriggerData,
  Customer,
  TagCalculationResult,
  PersonalizationData,
} from "@/lib/types/customer-tagging"

export class AutomationTriggerService {
  // Process tag changes and create automation triggers
  static processTagChanges(tagResults: TagCalculationResult[]): AutomationTrigger[] {
    const triggers: AutomationTrigger[] = []

    tagResults.forEach((result) => {
      if (!result.changes_detected) return

      const { customer_id, old_tags, new_tags } = result

      // New customer trigger
      if (old_tags.activity_tag !== "new" && new_tags.activity_tag === "new") {
        triggers.push(
          this.createTrigger(customer_id, "new_customer", {
            new_tags: [new_tags.activity_tag],
          }),
        )
      }

      // Churn risk trigger
      if (old_tags.activity_tag !== "churn_risk" && new_tags.activity_tag === "churn_risk") {
        triggers.push(
          this.createTrigger(customer_id, "churn_risk", {
            old_tags: [old_tags.activity_tag],
            new_tags: [new_tags.activity_tag],
          }),
        )
      }

      // VIP upgrade trigger
      if (old_tags.spend_tag !== "vip" && new_tags.spend_tag === "vip") {
        triggers.push(
          this.createTrigger(customer_id, "vip_upgrade", {
            old_tags: [old_tags.spend_tag],
            new_tags: [new_tags.spend_tag],
          }),
        )
      }

      // Inactive customer trigger
      if (old_tags.activity_tag !== "inactive" && new_tags.activity_tag === "inactive") {
        triggers.push(
          this.createTrigger(customer_id, "inactive_customer", {
            old_tags: [old_tags.activity_tag],
            new_tags: [new_tags.activity_tag],
          }),
        )
      }

      // General tag change trigger
      triggers.push(
        this.createTrigger(customer_id, "tag_changed", {
          old_tags: [old_tags.spend_tag, old_tags.activity_tag, ...old_tags.behavior_tags],
          new_tags: [new_tags.spend_tag, new_tags.activity_tag, ...new_tags.behavior_tags],
        }),
      )
    })

    return triggers
  }

  // Create personalized campaign content based on customer tags
  static generatePersonalizedContent(customer: Customer): PersonalizationData {
    const recommendedItems: string[] = []
    const preferredCategories: string[] = []
    let discountSensitivity: "low" | "medium" | "high" = "medium"
    let messageTone: "casual" | "formal" | "enthusiastic" = "casual"
    let optimalContactTime = "18:00" // default dinner time

    // Analyze behavior tags for personalization
    customer.behavior_tags.forEach((tag) => {
      switch (tag) {
        case "combo_responder":
          recommendedItems.push("combo_meals", "value_deals")
          break
        case "family_diner":
          recommendedItems.push("family_platters", "kids_meals", "sharing_options")
          messageTone = "enthusiastic"
          break
        case "weekend_only":
          optimalContactTime = "19:00" // weekend dinner time
          break
        case "lunch_regular":
          recommendedItems.push("quick_bites", "lunch_specials")
          optimalContactTime = "11:30"
          break
        case "dinner_regular":
          recommendedItems.push("dinner_specials", "premium_dishes")
          optimalContactTime = "18:30"
          break
        case "price_sensitive":
          discountSensitivity = "high"
          recommendedItems.push("budget_options", "daily_deals")
          break
        case "premium_seeker":
          discountSensitivity = "low"
          recommendedItems.push("chef_specials", "premium_items")
          messageTone = "formal"
          break
        case "category_loyalist":
          // Get most ordered category from order history
          const categoryCount: { [key: string]: number } = {}
          customer.order_history.forEach((order) => {
            order.categories.forEach((category) => {
              categoryCount[category] = (categoryCount[category] || 0) + 1
            })
          })
          const topCategory = Object.entries(categoryCount).sort(([, a], [, b]) => b - a)[0]?.[0]
          if (topCategory) {
            preferredCategories.push(topCategory)
          }
          break
      }
    })

    // Adjust based on spend tag
    switch (customer.spend_tag) {
      case "vip":
        messageTone = "formal"
        discountSensitivity = "low"
        recommendedItems.push("exclusive_items", "chef_table")
        break
      case "high_spender":
        recommendedItems.push("premium_dishes", "wine_pairings")
        break
      case "low_spender":
        discountSensitivity = "high"
        recommendedItems.push("value_meals", "student_discounts")
        break
    }

    // Adjust based on activity tag
    switch (customer.activity_tag) {
      case "new":
        messageTone = "enthusiastic"
        recommendedItems.push("popular_items", "signature_dishes")
        break
      case "churn_risk":
        discountSensitivity = "high"
        recommendedItems.push("comeback_offers", "loyalty_rewards")
        break
      case "loyal":
        recommendedItems.push("new_items", "seasonal_specials")
        break
    }

    return {
      customer,
      recommended_items: [...new Set(recommendedItems)], // remove duplicates
      preferred_categories: [...new Set(preferredCategories)],
      optimal_contact_time: optimalContactTime,
      discount_sensitivity: discountSensitivity,
      message_tone: messageTone,
    }
  }

  // Generate campaign messages based on trigger type and personalization
  static generateCampaignMessage(
    trigger: AutomationTrigger,
    personalization: PersonalizationData,
  ): {
    whatsapp: string
    email: { subject: string; body: string }
    sms: string
  } {
    const { customer } = personalization
    const firstName = customer.name.split(" ")[0]

    let whatsappMessage = ""
    let emailSubject = ""
    let emailBody = ""
    let smsMessage = ""

    switch (trigger.trigger_type) {
      case "new_customer":
        whatsappMessage = `Hi ${firstName}! 🎉 Welcome to our restaurant family! As a new customer, enjoy 20% off your next order. What would you like to try? ${personalization.recommended_items.slice(0, 2).join(", ")} are customer favorites!`
        emailSubject = `Welcome ${firstName}! Your 20% discount awaits`
        emailBody = `Dear ${firstName},\n\nWelcome to our restaurant! We're excited to have you join our family. Enjoy 20% off your next visit and try our signature dishes: ${personalization.recommended_items.slice(0, 3).join(", ")}.\n\nBest regards,\nThe Team`
        smsMessage = `Hi ${firstName}! Welcome! Get 20% off your next order. Try our ${personalization.recommended_items[0]}!`
        break

      case "churn_risk":
        const discount = personalization.discount_sensitivity === "high" ? "30%" : "20%"
        whatsappMessage = `Hi ${firstName}, we miss you! 😊 It's been a while since your last visit. Come back and enjoy ${discount} off + a complimentary ${personalization.recommended_items[0]}. When can we see you again?`
        emailSubject = `We miss you ${firstName}! ${discount} off to welcome you back`
        emailBody = `Dear ${firstName},\n\nWe noticed it's been a while since your last visit and we miss having you! Come back and enjoy ${discount} off your meal plus a complimentary ${personalization.recommended_items[0]}.\n\nWe'd love to see you again soon!\n\nWarm regards,\nThe Team`
        smsMessage = `Hi ${firstName}! We miss you. Get ${discount} off + free ${personalization.recommended_items[0]} on your comeback visit!`
        break

      case "vip_upgrade":
        whatsappMessage = `🌟 Congratulations ${firstName}! You're now a VIP member! Enjoy exclusive perks: priority seating, chef's special tastings, and 15% off all orders. Thank you for being an amazing customer!`
        emailSubject = `🌟 Welcome to VIP Status, ${firstName}!`
        emailBody = `Dear ${firstName},\n\nCongratulations! You've been upgraded to VIP status for being such a valued customer.\n\nYour VIP benefits include:\n- Priority seating\n- Exclusive chef's specials\n- 15% off all orders\n- Special event invitations\n\nThank you for your loyalty!\n\nBest regards,\nThe Management`
        smsMessage = `🌟 ${firstName}, you're now VIP! Enjoy priority seating & 15% off all orders. Thank you for your loyalty!`
        break

      case "inactive_customer":
        whatsappMessage = `Hi ${firstName}, we haven't seen you in a while and wanted to check in! 😊 We have some exciting new ${personalization.preferred_categories[0] || "dishes"} that we think you'd love. Come back with 25% off!`
        emailSubject = `${firstName}, we have something special for you!`
        emailBody = `Dear ${firstName},\n\nIt's been quite some time since your last visit, and we wanted to reach out personally. We've added some exciting new items to our menu that we think you'd enjoy.\n\nCome back and try them with 25% off your entire order!\n\nWe hope to see you soon,\nThe Team`
        smsMessage = `Hi ${firstName}! New ${personalization.preferred_categories[0] || "dishes"} added! Come back with 25% off your order.`
        break

      default:
        whatsappMessage = `Hi ${firstName}! We have something special for you based on your preferences. Visit us soon!`
        emailSubject = `Special offer for you, ${firstName}!`
        emailBody = `Dear ${firstName},\n\nWe have a special offer just for you! Visit us soon to discover what we have in store.\n\nBest regards,\nThe Team`
        smsMessage = `Hi ${firstName}! Special offer waiting for you. Visit us soon!`
    }

    return {
      whatsapp: whatsappMessage,
      email: { subject: emailSubject, body: emailBody },
      sms: smsMessage,
    }
  }

  private static createTrigger(
    customerId: string,
    triggerType: TriggerType,
    triggerData: TriggerData,
  ): AutomationTrigger {
    return {
      id: `trigger_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      customer_id: customerId,
      trigger_type: triggerType,
      trigger_data: triggerData,
      created_at: new Date().toISOString(),
      processed: false,
    }
  }
}
