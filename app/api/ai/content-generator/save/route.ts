import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { GeneratedContent } from "@/lib/types/ai-content-generator"

const DEMO_USER_ID = "550e8400-e29b-41d4-a716-446655440000"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const content: Partial<GeneratedContent> = body

    if (!content.title || !content.category || !content.contentType) {
      return NextResponse.json({ error: "Title, category, and contentType are required" }, { status: 400 })
    }

    const supabase = createClient()

    // Prepare data for database
    const contentData = {
      id: content.id || `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      restaurant_id: content.restaurantId || DEMO_USER_ID,
      user_id: content.userId || DEMO_USER_ID,
      title: content.title,
      category: content.category,
      content_type: content.contentType,
      channel: content.channel,
      prompt_input: content.promptInput || "",
      tone: content.tone || "friendly",
      ai_model: content.aiModel || "gpt-4",
      output_text: content.outputText,
      output_media_urls: content.outputMediaUrls || [],
      is_approved: content.isApproved || false,
      status: content.status || "draft",
      generated_by: content.generatedBy || "user",
      version: content.version || 1,
      linked_entity_id: content.linkedEntityId,
      linked_entity_type: content.linkedEntityType,
      used_in_campaign_id: content.usedInCampaignId,
      used_in_content_unit_id: content.usedInContentUnitId,
      usage_count: content.usageCount || 0,
      performance_score: content.performanceScore || 0,
      engagement_metrics: content.engagementMetrics || {},
      tags: content.tags || [],
      is_favorite: content.isFavorite || false,
      is_template: content.isTemplate || false,
      template_category: content.templateCategory,
      trigger_source: content.triggerSource,
      trigger_metadata: content.triggerMetadata || {},
      created_at: content.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      approved_at: content.approvedAt,
      used_at: content.usedAt,
    }

    // Save to database
    const { data, error } = await supabase.from("generated_content").upsert(contentData).select().single()

    if (error) {
      console.error("Error saving content:", error)
      throw new Error(`Failed to save content: ${error.message}`)
    }

    // If this is being marked as a template, also save to templates table
    if (content.isTemplate && content.templateCategory) {
      const templateData = {
        id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        restaurant_id: content.restaurantId || DEMO_USER_ID,
        user_id: content.userId || DEMO_USER_ID,
        name: content.title,
        description: `Template for ${content.contentType}`,
        category: content.category,
        content_type: content.contentType,
        prompt_template: content.promptInput || "",
        default_tone: content.tone || "friendly",
        suggested_channels: content.channel ? [content.channel] : [],
        usage_count: 0,
        success_rate: 0,
        tags: content.tags || [],
        is_system_template: false,
        is_seasonal: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const { error: templateError } = await supabase.from("content_templates").insert(templateData)

      if (templateError) {
        console.warn("Failed to save as template:", templateError)
      }
    }

    // Update performance tracking if content is being used
    if (content.status === "used" && content.usedInCampaignId) {
      const performanceData = {
        id: `perf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        content_id: data.id,
        restaurant_id: content.restaurantId || DEMO_USER_ID,
        campaign_id: content.usedInCampaignId,
        channel: content.channel,
        engagement_metrics: content.engagementMetrics || {},
        performance_score: content.performanceScore || 0,
        tracked_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      }

      const { error: perfError } = await supabase.from("content_performance").insert(performanceData)

      if (perfError) {
        console.warn("Failed to save performance data:", perfError)
      }
    }

    return NextResponse.json({
      success: true,
      content: data,
      message: "Content saved successfully",
    })
  } catch (error) {
    console.error("Content save API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to save content",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { contentId, updates } = body

    if (!contentId) {
      return NextResponse.json({ error: "Content ID is required" }, { status: 400 })
    }

    const supabase = createClient()

    // Prepare update data
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString(),
      version: (updates.version || 1) + 1,
    }

    // Handle approval
    if (updates.isApproved === true && !updates.approvedAt) {
      updateData.approved_at = new Date().toISOString()
      updateData.status = "approved"
    }

    // Handle usage
    if (updates.status === "used" && !updates.usedAt) {
      updateData.used_at = new Date().toISOString()
      updateData.usage_count = (updates.usageCount || 0) + 1
    }

    const { data, error } = await supabase
      .from("generated_content")
      .update(updateData)
      .eq("id", contentId)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update content: ${error.message}`)
    }

    return NextResponse.json({
      success: true,
      content: data,
      message: "Content updated successfully",
    })
  } catch (error) {
    console.error("Content update API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update content",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contentId = searchParams.get("contentId")

    if (!contentId) {
      return NextResponse.json({ error: "Content ID is required" }, { status: 400 })
    }

    const supabase = createClient()

    // Soft delete by updating status to archived
    const { data, error } = await supabase
      .from("generated_content")
      .update({
        status: "archived",
        updated_at: new Date().toISOString(),
      })
      .eq("id", contentId)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to archive content: ${error.message}`)
    }

    return NextResponse.json({
      success: true,
      content: data,
      message: "Content archived successfully",
    })
  } catch (error) {
    console.error("Content delete API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to archive content",
      },
      { status: 500 },
    )
  }
}
