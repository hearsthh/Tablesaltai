import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { generateCustomerInsights } from "@/lib/ai/openai"
import { generateEmbeddings } from "@/lib/ai/deepinfra"

export const customerService = {
  // Get customers
  async getCustomers(restaurantId: string) {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("created_at", { ascending: false })

    if (error) {
      return { customers: [], error: error.message }
    }

    return { customers: data, error: null }
  },

  // Get customer by ID
  async getCustomerById(customerId: string) {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase.from("customers").select("*").eq("id", customerId).single()

    if (error) {
      return { customer: null, error: error.message }
    }

    return { customer: data, error: null }
  },

  // Create customer
  async createCustomer(restaurantId: string, customerData: any) {
    const supabase = getSupabaseBrowserClient()

    // Generate embeddings for semantic search
    const { embedding } = await generateEmbeddings(
      `${customerData.name} ${customerData.email} ${customerData.preferences?.join(" ") || ""}`,
    )

    const { data, error } = await supabase
      .from("customers")
      .insert({
        restaurant_id: restaurantId,
        ...customerData,
        embedding: embedding || null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      return { customer: null, error: error.message }
    }

    return { customer: data, error: null }
  },

  // Update customer
  async updateCustomer(customerId: string, customerData: any) {
    const supabase = getSupabaseBrowserClient()

    // Generate new embeddings if name or preferences changed
    if (customerData.name || customerData.preferences) {
      const { customer } = await customerService.getCustomerById(customerId)

      if (customer) {
        const { embedding } = await generateEmbeddings(
          `${customerData.name || customer.name} ${customerData.email || customer.email} ${customerData.preferences?.join(" ") || customer.preferences?.join(" ") || ""}`,
        )

        if (embedding) {
          customerData.embedding = embedding
        }
      }
    }

    const { data, error } = await supabase.from("customers").update(customerData).eq("id", customerId).select().single()

    if (error) {
      return { customer: null, error: error.message }
    }

    return { customer: data, error: null }
  },

  // Delete customer
  async deleteCustomer(customerId: string) {
    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase.from("customers").delete().eq("id", customerId)

    if (error) {
      return { error: error.message }
    }

    return { error: null }
  },

  // Get customer segments
  async getCustomerSegments(restaurantId: string) {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase.from("customer_segments").select("*").eq("restaurant_id", restaurantId)

    if (error) {
      return { segments: [], error: error.message }
    }

    return { segments: data, error: null }
  },

  // Create customer segment
  async createCustomerSegment(restaurantId: string, segmentData: any) {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from("customer_segments")
      .insert({
        restaurant_id: restaurantId,
        ...segmentData,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      return { segment: null, error: error.message }
    }

    return { segment: data, error: null }
  },

  // Generate customer insights
  async generateCustomerInsights(restaurantId: string) {
    // Get customers
    const { customers, error: customersError } = await customerService.getCustomers(restaurantId)

    if (customersError) {
      return { insights: null, error: customersError }
    }

    // Generate insights
    const { insights, error } = await generateCustomerInsights(customers)

    if (error) {
      return { insights: null, error }
    }

    return { insights, error: null }
  },

  // Search customers
  async searchCustomers(restaurantId: string, query: string) {
    const supabase = getSupabaseBrowserClient()

    // Generate embeddings for the search query
    const { embedding, error: embeddingError } = await generateEmbeddings(query)

    if (embeddingError || !embedding) {
      // Fall back to basic search if embeddings fail
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
        .limit(20)

      if (error) {
        return { customers: [], error: error.message }
      }

      return { customers: data, error: null }
    }

    // Perform vector search
    const { data, error } = await supabase.rpc("match_customers", {
      query_embedding: embedding,
      match_threshold: 0.5,
      match_count: 20,
      restaurant_id: restaurantId,
    })

    if (error) {
      return { customers: [], error: error.message }
    }

    return { customers: data, error: null }
  },
}

// Server-side customer service
export const serverCustomerService = {
  // Get customer analytics
  async getCustomerAnalytics(restaurantId: string) {
    const supabase = getSupabaseServerClient()

    // Get customer counts by segment
    const { data: segmentCounts, error: segmentError } = await supabase
      .from("customers")
      .select("segment, count(*)")
      .eq("restaurant_id", restaurantId)
      .group("segment")

    if (segmentError) {
      return { analytics: null, error: segmentError.message }
    }

    // Get churn metrics
    const { data: churnMetrics, error: churnError } = await supabase
      .from("customer_churn_metrics")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("date", { ascending: false })
      .limit(1)
      .single()

    if (churnError && churnError.code !== "PGRST116") {
      // PGRST116 is "no rows returned"
      return { analytics: null, error: churnError.message }
    }

    // Get customer acquisition metrics
    const { data: acquisitionMetrics, error: acquisitionError } = await supabase
      .from("customer_acquisition_metrics")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("date", { ascending: false })
      .limit(12)

    if (acquisitionError) {
      return { analytics: null, error: acquisitionError.message }
    }

    // Combine analytics
    const analytics = {
      segmentCounts,
      churnMetrics: churnMetrics || null,
      acquisitionMetrics: acquisitionMetrics || [],
    }

    return { analytics, error: null }
  },
}
