import { type NextRequest, NextResponse } from "next/server"
import { parseUniversalMenu } from "@/lib/ai/universal-menu-parser"

export async function POST(request: NextRequest) {
  try {
    console.log("=== Universal Menu Extract API ===")

    const body = await request.json()
    const { extractionType, data, options = {} } = body

    console.log("Extraction type:", extractionType)
    console.log("Options:", options)

    let content = ""
    let sourceInfo = ""
    let processingMetadata = {}

    // Handle different extraction types
    switch (extractionType) {
      case "file":
        // For file uploads, the content should already be processed by the frontend
        content = data.content
        sourceInfo = `File: ${data.fileName}`
        processingMetadata = {
          fileName: data.fileName,
          fileType: data.fileType,
          fileSize: data.fileSize || 0,
        }
        break

      case "url":
        content = data.content
        sourceInfo = `URL: ${data.url}`
        break

      default:
        return NextResponse.json({ error: "Invalid extraction type" }, { status: 400 })
    }

    if (!content.trim()) {
      return NextResponse.json(
        {
          error: "No content found",
          details: "The uploaded file appears to be empty or unreadable",
        },
        { status: 400 },
      )
    }

    console.log("Content length:", content.length)
    console.log("Content preview:", content.substring(0, 200) + "...")

    // Parse with universal AI system
    try {
      const parsedMenu = await parseUniversalMenu(content, sourceInfo, {
        preserveOriginalFormat: true,
        generateDescriptions: options.generateDescriptions || false,
        inferCategories: true,
        detectCurrency: true,
        handleMultipleLanguages: true,
      })

      console.log("✅ Menu parsed successfully")
      console.log("Categories:", parsedMenu.categories.length)
      console.log("Total items:", parsedMenu.metadata.totalItems)

      return NextResponse.json({
        success: true,
        menuData: {
          categories: parsedMenu.categories,
        },
        metadata: parsedMenu.metadata,
        sourceInfo,
        processingMetadata,
        mode: "universal-ai",
        extractedText: content.substring(0, 500) + "...",
      })
    } catch (aiError) {
      console.error("Universal AI parsing failed:", aiError)

      return NextResponse.json(
        {
          error: "Failed to parse menu content",
          details: aiError instanceof Error ? aiError.message : "AI parsing failed",
          suggestion:
            "Please ensure the file contains a clear menu with item names and prices. Supported formats: text, images, PDFs, CSV files.",
          debugInfo: {
            contentLength: content.length,
            hasNumbers: /\d/.test(content),
            hasCurrency: /[$₹€£¥]/.test(content),
            sourceInfo,
          },
        },
        { status: 422 },
      )
    }
  } catch (error) {
    console.error("Menu extraction error:", error)

    return NextResponse.json(
      {
        error: "Failed to process request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
