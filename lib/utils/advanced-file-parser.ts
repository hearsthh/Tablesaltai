// Advanced file parsing utilities for accurate menu extraction

export async function parseTextContent(file: File): Promise<string> {
  try {
    const content = await file.text()
    console.log("Text file parsed, length:", content.length)
    return content
  } catch (error) {
    throw new Error(`Failed to read text file: ${error}`)
  }
}

export async function parseCSVContent(file: File): Promise<string> {
  try {
    const content = await file.text()
    console.log("CSV file parsed, length:", content.length)

    // Convert CSV to readable menu format
    const lines = content.split("\n").filter((line) => line.trim())
    let formattedContent = ""

    for (const line of lines) {
      const columns = line.split(",").map((col) => col.trim().replace(/"/g, ""))
      if (columns.length >= 2) {
        // Assume first column is item name, second is price, third might be description
        const name = columns[0]
        const price = columns[1]
        const description = columns[2] || ""

        if (name && price && !name.toLowerCase().includes("name") && !name.toLowerCase().includes("item")) {
          formattedContent += `${name} - ${price}`
          if (description) {
            formattedContent += ` - ${description}`
          }
          formattedContent += "\n"
        }
      }
    }

    return formattedContent || content
  } catch (error) {
    throw new Error(`Failed to parse CSV file: ${error}`)
  }
}

export async function parseImageWithOCR(file: File): Promise<string> {
  // For now, we'll need to implement actual OCR
  // This would integrate with Tesseract.js or a cloud OCR service
  console.log("Image OCR not yet implemented for:", file.name)
  throw new Error("Image OCR parsing not yet implemented. Please use text-based files for now.")
}

export async function parsePDFContent(file: File): Promise<string> {
  // For now, we'll need to implement actual PDF parsing
  // This would use pdf-parse or PDF.js
  console.log("PDF parsing not yet implemented for:", file.name)
  throw new Error("PDF parsing not yet implemented. Please convert to text format for now.")
}

export async function parseWordDocument(file: File): Promise<string> {
  // For now, we'll need to implement actual Word parsing
  // This would use mammoth.js or similar
  console.log("Word document parsing not yet implemented for:", file.name)
  throw new Error("Word document parsing not yet implemented. Please convert to text format for now.")
}

export async function parseExcelFile(file: File): Promise<string> {
  // For now, we'll need to implement actual Excel parsing
  // This would use xlsx or similar
  console.log("Excel parsing not yet implemented for:", file.name)
  throw new Error("Excel parsing not yet implemented. Please convert to CSV or text format for now.")
}

// Main file content extractor - only handles what we can actually parse
export async function extractRealFileContent(file: File): Promise<string> {
  const fileName = file.name.toLowerCase()
  const fileType = file.type.toLowerCase()

  console.log("Extracting real content from:", fileName, "Type:", fileType, "Size:", file.size)

  try {
    if (fileType === "text/plain" || fileName.endsWith(".txt")) {
      return await parseTextContent(file)
    } else if (fileType.includes("csv") || fileName.endsWith(".csv")) {
      return await parseCSVContent(file)
    } else if (fileType.includes("pdf") || fileName.endsWith(".pdf")) {
      return await parsePDFContent(file)
    } else if (fileType.includes("image") || /\.(jpg|jpeg|png|gif)$/i.test(fileName)) {
      return await parseImageWithOCR(file)
    } else if (fileType.includes("word") || /\.(doc|docx)$/i.test(fileName)) {
      return await parseWordDocument(file)
    } else if (fileType.includes("sheet") || /\.(xls|xlsx)$/i.test(fileName)) {
      return await parseExcelFile(file)
    } else {
      // Try as text file as last resort
      console.log("Unknown file type, attempting text parsing")
      return await parseTextContent(file)
    }
  } catch (error) {
    console.error("File parsing error:", error)
    throw new Error(`Failed to parse ${fileName}: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

// Intelligent menu structure detection
export function detectMenuStructure(content: string): {
  hasCategories: boolean
  hasPrices: boolean
  hasDescriptions: boolean
  currency: string
  format: "structured" | "list" | "table" | "mixed"
} {
  const lines = content.split("\n").filter((line) => line.trim())

  // Detect categories
  const categoryPatterns = [
    /^[A-Z\s&-]{3,30}$/,
    /^(APPETIZERS?|STARTERS?|MAINS?|MAIN COURSE|DESSERTS?|BEVERAGES?|DRINKS?|BREADS?)/i,
    /^(Category|Section):/i,
  ]

  const hasCategories = lines.some((line) => categoryPatterns.some((pattern) => pattern.test(line.trim())))

  // Detect prices
  const pricePatterns = [/₹\s*\d+/, /\$\s*\d+/, /Rs\.?\s*\d+/i, /\d+\s*₹/, /\d+\s*\$/]

  const hasPrices = lines.some((line) => pricePatterns.some((pattern) => pattern.test(line)))

  // Detect currency
  let currency = "USD"
  if (content.includes("₹") || /Rs\.?\s*\d+/i.test(content)) {
    currency = "INR"
  }

  // Detect descriptions (lines with more than just name and price)
  const hasDescriptions = lines.some((line) => {
    const parts = line.split("-").map((p) => p.trim())
    return parts.length > 2 || (parts.length === 2 && parts[1].length > 10 && !/^\d+/.test(parts[1]))
  })

  // Detect format
  let format: "structured" | "list" | "table" | "mixed" = "list"
  if (hasCategories) {
    format = "structured"
  } else if (content.includes("\t") || content.includes("|")) {
    format = "table"
  }

  return {
    hasCategories,
    hasPrices,
    hasDescriptions,
    currency,
    format,
  }
}
