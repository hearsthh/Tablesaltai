import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// POST - Apply generated content to menu
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient()
    const { applyToType, applyToId, currentData } = await request.json()

    // First, get the generated content
    const { data: generatedContent, error: fetchError } = await supabase
      .from("generated_content")
      .select("*")
      .eq("id", params.id)
      .single()

    if (fetchError || !generatedContent) {
      return NextResponse.json({ error: "Generated content not found" }, { status: 404 })
    }

    // Record the application
    const { data: application, error: applicationError } = await supabase
      .from("content_applications")
      .insert({
        generated_content_id: params.id,
        applied_to_type: applyToType,
        applied_to_id: applyToId,
        previous_data: currentData,
        applied_data: generatedContent.content_data,
      })
      .select()
      .single()

    if (applicationError) {
      console.error("Error recording application:", applicationError)
      return NextResponse.json({ error: "Failed to record application" }, { status: 500 })
    }

    // Update the generated content status
    await supabase
      .from("generated_content")
      .update({ status: "applied", updated_at: new Date().toISOString() })
      .eq("id", params.id)

    return NextResponse.json({
      success: true,
      application,
      appliedData: generatedContent.content_data,
    })
  } catch (error) {
    console.error("Content application error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
