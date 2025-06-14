import { NextResponse } from "next/server"
import { generateAIText } from "@/lib/ai/openai"

export async function GET() {
  try {
    // Test if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        status: "error",
        message: "OpenAI API key not configured",
        configured: false,
      })
    }

    // Test a simple generation
    const result = await generateAIText("Say 'Hello from TableSalt AI!'", {
      temperature: 0.1,
      maxTokens: 20,
    })

    if (result.error) {
      return NextResponse.json({
        status: "error",
        message: result.error,
        configured: true,
      })
    }

    return NextResponse.json({
      status: "success",
      message: "OpenAI is working correctly!",
      configured: true,
      testResponse: result.text,
    })
  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: `Unexpected error: ${error}`,
      configured: !!process.env.OPENAI_API_KEY,
    })
  }
}
