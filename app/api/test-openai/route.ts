import { NextResponse } from "next/server"
import OpenAI from "openai"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { forceReal = false, prompt = "Say hello" } = body

    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey || apiKey.trim() === "" || apiKey === "undefined") {
      return NextResponse.json({
        success: false,
        error: "OpenAI API key not configured",
        message: "Add OPENAI_API_KEY to environment variables",
        mode: "error",
        hasApiKey: false,
      })
    }

    if (forceReal) {
      try {
        const openai = new OpenAI({
          apiKey: apiKey,
          timeout: 30000,
        })

        const startTime = Date.now()
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 100,
          temperature: 0.7,
        })

        const endTime = Date.now()
        const responseTime = endTime - startTime

        const usage = completion.usage
        const cost = usage
          ? {
              promptTokens: usage.prompt_tokens,
              completionTokens: usage.completion_tokens,
              totalTokens: usage.total_tokens,
              estimatedCost: (usage.prompt_tokens * 0.0015 + usage.completion_tokens * 0.002) / 1000,
              totalCost: ((usage.prompt_tokens * 0.0015 + usage.completion_tokens * 0.002) / 1000).toFixed(4),
            }
          : null

        return NextResponse.json({
          success: true,
          message: completion.choices[0]?.message?.content || "No response",
          mode: "real",
          model: "gpt-3.5-turbo",
          usage: usage,
          cost: cost,
          responseTime: responseTime,
          hasApiKey: true,
        })
      } catch (openaiError: any) {
        console.error("Real OpenAI Error:", openaiError)

        return NextResponse.json({
          success: false,
          error: openaiError.message || "OpenAI API call failed",
          message: "Real OpenAI connection failed",
          mode: "error",
          details: openaiError.code || "Unknown error",
          hasApiKey: true,
        })
      }
    }

    return NextResponse.json({
      success: false,
      error: "forceReal parameter required for real testing",
      mode: "error",
    })
  } catch (error) {
    console.error("Test OpenAI Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        mode: "error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "OpenAI Test API",
    usage: "Send POST request with forceReal: true to test real OpenAI",
    status: "available",
  })
}
