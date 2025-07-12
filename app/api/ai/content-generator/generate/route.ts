import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { createClient } from "@/lib/supabase/server"
import type { ContentGenerationRequest } from "@/lib/types/ai-content-generator"

export async function POST(request: NextRequest) {
  try {
    const body: ContentGenerationRequest = await request.json()

    // Validate required fields
    if (!body.category || !body.contentType || !body.promptInput) {
      return NextResponse.json(
        { error: "Missing required fields: category, contentType, promptInput" },
        { status: 400 },
      )
    }

    // Check if OpenAI is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "AI service not configured" }, { status: 503 })
    }

    // Build the AI prompt based on content type and category
    const systemPrompt = buildSystemPrompt(body.category, body.contentType, body.tone)
    const userPrompt = buildUserPrompt(body)

    console.log("🤖 Generating content with AI:", {
      category: body.category,
      contentType: body.contentType,
      tone: body.tone,
      channel: body.channel,
    })

    // Generate content using AI
    const { text, usage } = await generateText({
      model: openai(body.aiModel || "gpt-4o"),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.7,
      maxTokens: 1000,
    })

    // Save to database
    const supabase = createClient()
    const { data: savedContent, error: saveError } = await supabase
      .from("generated_content")
      .insert({
        restaurant_id: body.linkedEntityId || "default", // This should come from auth context
        user_id: "default", // This should come from auth context
        title: generateTitle(body.category, body.contentType),
        category: body.category,
        content_type: body.contentType,
        channel: body.channel,
        prompt_input: body.promptInput,
        tone: body.tone,
        ai_model: body.aiModel || "openai:gpt-4o",
        output_text: text,
        linked_entity_id: body.linkedEntityId,
        linked_entity_type: body.linkedEntityType,
        trigger_source: "manual",
        status: "draft",
      })
      .select()
      .single()

    if (saveError) {
      console.error("Error saving generated content:", saveError)
      // Continue anyway, return the generated content
    }

    return NextResponse.json({
      success: true,
      content: {
        id: savedContent?.id || `temp_${Date.now()}`,
        text,
        category: body.category,
        contentType: body.contentType,
        tone: body.tone,
        channel: body.channel,
        usage: {
          promptTokens: usage?.promptTokens || 0,
          completionTokens: usage?.completionTokens || 0,
          totalTokens: usage?.totalTokens || 0,
        },
      },
    })
  } catch (error) {
    console.error("Content generation error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate content",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

function buildSystemPrompt(category: string, contentType: string, tone: string): string {
  const basePrompt = `You are an expert restaurant marketing content creator. Generate high-quality, engaging content that drives customer action.`

  const categoryPrompts = {
    campaign: "Focus on promotional content that drives traffic and sales. Use compelling calls-to-action.",
    crm: "Create personalized, relationship-building content that makes customers feel valued.",
    menu: "Write appetizing descriptions that make food sound irresistible and highlight unique qualities.",
    review: "Craft professional, grateful responses that show appreciation and encourage future visits.",
    profile: "Develop authentic brand storytelling that connects with customers emotionally.",
    in_store: "Create clear, actionable content for physical restaurant materials.",
    strategy: "Generate strategic, data-driven content that explains marketing concepts clearly.",
  }

  const tonePrompts = {
    casual: "Use a relaxed, conversational tone like talking to a friend.",
    quirky: "Be playful, fun, and slightly humorous while staying professional.",
    gourmet: "Use sophisticated language that conveys culinary expertise and refinement.",
    emotional: "Connect on an emotional level, emphasizing feelings and experiences.",
    professional: "Maintain a polished, business-appropriate tone.",
    friendly: "Be warm, welcoming, and approachable.",
    elegant: "Use refined, upscale language that conveys luxury and quality.",
  }

  return `${basePrompt}

CATEGORY FOCUS: ${categoryPrompts[category as keyof typeof categoryPrompts] || categoryPrompts.campaign}

TONE: ${tonePrompts[tone as keyof typeof tonePrompts] || tonePrompts.professional}

CONTENT TYPE: ${contentType}

Guidelines:
- Keep content concise and impactful
- Include relevant emojis when appropriate
- Ensure content is actionable and engaging
- Adapt length based on platform requirements
- Focus on customer benefits and value proposition`
}

function buildUserPrompt(body: ContentGenerationRequest): string {
  let prompt = `Generate ${body.contentType} content for a restaurant.

Input Details: ${body.promptInput}`

  if (body.channel) {
    prompt += `\nPlatform: ${body.channel}`
  }

  if (body.customInstructions) {
    prompt += `\nAdditional Instructions: ${body.customInstructions}`
  }

  // Add platform-specific requirements
  const platformRequirements = {
    instagram: "Include relevant hashtags (3-5). Keep caption engaging and visual.",
    whatsapp: "Keep it conversational and include emojis. Max 160 characters if specified.",
    sms: "Keep under 160 characters. Include clear call-to-action.",
    email: "Include subject line and body. Make it scannable with clear sections.",
    poster: "Focus on headline and key message. Should be readable from distance.",
  }

  if (body.channel && platformRequirements[body.channel as keyof typeof platformRequirements]) {
    prompt += `\n\nPlatform Requirements: ${platformRequirements[body.channel as keyof typeof platformRequirements]}`
  }

  return prompt
}

function generateTitle(category: string, contentType: string): string {
  const titles = {
    campaign: {
      instagram_caption: "Instagram Caption",
      whatsapp_card: "WhatsApp Message",
      email_subject: "Email Subject Line",
      sms_text: "SMS Message",
    },
    menu: {
      item_description: "Menu Item Description",
      combo_name: "Combo Name",
      food_image_prompt: "Food Image Prompt",
    },
    review: {
      review_reply: "Review Response",
      feedback_request: "Feedback Request",
    },
  }

  return (
    titles[category as keyof typeof titles]?.[contentType as keyof any] ||
    `${category} ${contentType}`.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  )
}
