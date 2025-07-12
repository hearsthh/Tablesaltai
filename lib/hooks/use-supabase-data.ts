"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export function useMenuItems() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: items, error } = await supabase
          .from("menu_items")
          .select("*")
          .order("ai_score", { ascending: false })

        if (error) throw error
        setData(items || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch menu items")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return { data, loading, error, refetch: () => setLoading(true) }
}

export function useCampaigns() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: campaigns, error } = await supabase
          .from("campaigns")
          .select(`
            *,
            strategies(*),
            content_units(*)
          `)
          .order("created_at", { ascending: false })

        if (error) throw error
        setData(campaigns || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch campaigns")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return { data, loading, error, refetch: () => setLoading(true) }
}

export function useReviews() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: reviews, error } = await supabase
          .from("reviews")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) throw error
        setData(reviews || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch reviews")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return { data, loading, error, refetch: () => setLoading(true) }
}

export function useCustomerSegments() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: customers, error } = await supabase
          .from("customer_profiles")
          .select("*")
          .order("lifetime_value", { ascending: false })

        if (error) throw error
        setData(customers || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch customers")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return { data, loading, error, refetch: () => setLoading(true) }
}

export function useCalendarEvents() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const today = new Date().toISOString().split("T")[0]
        const { data: events, error } = await supabase
          .from("calendar_events")
          .select("*")
          .gte("date", today)
          .order("date", { ascending: true })

        if (error) throw error
        setData(events || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch calendar events")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return { data, loading, error, refetch: () => setLoading(true) }
}

export function useGeneratedContent() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: content, error } = await supabase
          .from("generated_content")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) throw error
        setData(content || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch generated content")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return { data, loading, error, refetch: () => setLoading(true) }
}
