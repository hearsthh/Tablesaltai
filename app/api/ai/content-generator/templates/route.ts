import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const contentType = searchParams.get("contentType")
    const seasonal = searchParams.get("seasonal")

    const supabase = createClient()
    let query = supabase.from("content_templates").select("*").order("usage_count", { ascending: false })

    if (category) {
      query = query.eq("category", category)
    }

    if (contentType) {
      query = query.eq("content_type", contentType)
    }

    if (seasonal === "true") {
      query = query.eq("is_seasonal", true)
    }

    const { data: templates, error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      templates: templates || [],
    })
  } catch (error) {
    console.error("Templates fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const supabase = createClient()
    const { data: template, error } = await supabase
      .from("content_templates")
      .insert({
        restaurant_id: body.restaurantId || "default",
        user_id: body.userId || "default",
        name: body.name,
        description: body.description,
        category: body.category,
        content_type: body.contentType,
        prompt_template: body.promptTemplate,
        default_tone: body.defaultTone || "professional",
        suggested_channels: body.suggestedChannels || [],
        tags: body.tags || [],
        is_seasonal: body.isSeasonal || false,
        seasonal_period: body.seasonalPeriod,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      template,
    })
  } catch (error) {
    console.error("Template creation error:", error)
    return NextResponse.json({ error: "Failed to create template" }, { status: 500 })
  }
}
