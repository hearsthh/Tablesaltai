// File parsing utilities for different file types

export async function parseTextFile(file: File): Promise<string> {
  return await file.text()
}

export async function parseCSVFile(file: File): Promise<string> {
  const text = await file.text()
  // Convert CSV to readable format
  const lines = text.split("\n")
  const headers = lines[0]?.split(",") || []

  if (headers.length < 2) return text

  let formatted = ""
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i]?.split(",") || []
    if (values.length >= 2) {
      formatted += `${values[0]?.trim()} - ${values[1]?.trim()}\n`
    }
  }

  return formatted || text
}

export async function parsePDFFile(file: File): Promise<string> {
  try {
    // For now, we'll simulate PDF parsing
    // In production, you'd use a library like pdf-parse or PDF.js
    console.log("Parsing PDF file:", file.name, file.size)

    // Simulate reading PDF content with Indian menu items and rupee prices
    const simulatedContent = `
STARTERS
Vegetable Samosa - Crispy triangular pastries filled with spiced potatoes and peas - ₹120
Paneer Tikka - Marinated cottage cheese grilled in tandoor with bell peppers - ₹180
Chicken Tikka - Boneless chicken marinated in yogurt and spices, grilled to perfection - ₹220
Fish Amritsari - Battered and fried fish pieces served with mint chutney - ₹250
Aloo Tikki Chaat - Spiced potato patties topped with yogurt and chutneys - ₹100

MAIN COURSE
Butter Chicken - Tender chicken pieces in rich tomato and cream gravy - ₹320
Dal Makhani - Slow-cooked black lentils with butter and cream - ₹180
Palak Paneer - Fresh cottage cheese in creamy spinach curry - ₹220
Chicken Biryani - Fragrant basmati rice layered with spiced chicken - ₹350
Mutton Rogan Josh - Tender mutton in aromatic Kashmiri curry - ₹420
Rajma Chawal - Kidney bean curry served with steamed rice - ₹160
Chole Bhature - Spiced chickpea curry with fried bread - ₹140

BREADS
Butter Naan - Soft leavened bread brushed with butter - ₹60
Garlic Naan - Naan bread topped with fresh garlic and herbs - ₹70
Tandoori Roti - Whole wheat bread cooked in tandoor - ₹40
Laccha Paratha - Multi-layered flaky bread - ₹50
Kulcha - Stuffed bread with onions or potatoes - ₹80

RICE & BIRYANI
Jeera Rice - Basmati rice tempered with cumin seeds - ₹120
Vegetable Biryani - Fragrant rice with mixed vegetables and spices - ₹280
Hyderabadi Biryani - Traditional biryani with tender meat and aromatic rice - ₹380

DESSERTS
Gulab Jamun - Sweet milk dumplings in rose-flavored syrup - ₹80
Kulfi - Traditional Indian ice cream with pistachios - ₹60
Ras Malai - Cottage cheese dumplings in sweetened milk - ₹90
Gajar Ka Halwa - Carrot pudding with nuts and cardamom - ₹70

BEVERAGES
Masala Chai - Spiced Indian tea with milk - ₹30
Lassi - Sweet or salted yogurt drink - ₹50
Mango Lassi - Yogurt drink blended with fresh mango - ₹70
Fresh Lime Water - Refreshing lime drink with mint - ₹40
Thandai - Traditional milk drink with nuts and spices - ₹80
`

    return simulatedContent
  } catch (error) {
    console.error("PDF parsing error:", error)
    throw new Error("Failed to parse PDF file")
  }
}

export async function parseImageFile(file: File): Promise<string> {
  try {
    console.log("Processing image for OCR:", file.name)

    // Simulate OCR extraction with Indian menu content
    const simulatedOCR = `
APPETIZERS & STARTERS
Samosa Chaat - Crispy samosas topped with yogurt, chutneys and sev - ₹110
Spring Rolls - Crispy vegetable rolls served with sweet chili sauce - ₹90
Chicken 65 - Spicy fried chicken pieces with curry leaves - ₹200
Paneer Pakora - Cottage cheese fritters with mint chutney - ₹130
Dahi Puri - Crispy puris filled with yogurt and tangy water - ₹80

MAIN COURSE CURRIES
Butter Chicken - Creamy tomato-based chicken curry - ₹300
Dal Tadka - Yellow lentils tempered with spices - ₹140
Palak Paneer - Cottage cheese in spinach gravy - ₹200
Chicken Curry - Traditional home-style chicken curry - ₹280
Mutton Curry - Tender goat meat in spiced gravy - ₹380
Aloo Gobi - Potato and cauliflower dry curry - ₹120

RICE DISHES
Chicken Biryani - Aromatic rice with spiced chicken - ₹320
Mutton Biryani - Fragrant rice with tender mutton - ₹400
Vegetable Pulao - Basmati rice with mixed vegetables - ₹180
Plain Basmati Rice - Steamed aromatic rice - ₹80

INDIAN BREADS
Butter Naan - Soft bread with butter - ₹55
Garlic Naan - Naan with garlic and herbs - ₹65
Roti - Whole wheat flatbread - ₹35
Paratha - Layered flatbread - ₹45

DESSERTS
Kulfi - Traditional ice cream - ₹55
Gulab Jamun - Sweet milk balls in syrup - ₹75
Kheer - Rice pudding with nuts - ₹65
`

    return simulatedOCR
  } catch (error) {
    console.error("Image OCR error:", error)
    throw new Error("Failed to process image file")
  }
}

export async function parseWordFile(file: File): Promise<string> {
  try {
    console.log("Processing Word document:", file.name)

    // Simulate Word document parsing with Indian restaurant menu
    const simulatedContent = `
RESTAURANT MENU

APPETIZERS
• Vegetable Samosa - Golden triangular pastries with spiced filling - ₹100
• Chicken Tikka - Marinated chicken grilled in tandoor - ₹200
• Paneer Tikka - Grilled cottage cheese with vegetables - ₹160
• Fish Tikka - Marinated fish pieces grilled to perfection - ₹220

MAIN COURSE
• Butter Chicken - Rich and creamy tomato-based chicken curry - ₹300
• Dal Makhani - Slow-cooked black lentils with cream - ₹170
• Palak Paneer - Cottage cheese in fresh spinach gravy - ₹190
• Chicken Biryani - Aromatic basmati rice with spiced chicken - ₹330
• Mutton Rogan Josh - Tender mutton in Kashmiri spices - ₹400
• Vegetable Korma - Mixed vegetables in coconut curry - ₹180

BREADS & RICE
• Butter Naan - Soft leavened bread - ₹50
• Garlic Naan - Naan with fresh garlic - ₹60
• Tandoori Roti - Whole wheat bread from tandoor - ₹35
• Jeera Rice - Cumin-flavored basmati rice - ₹110

DESSERTS
• Gulab Jamun - Sweet dumplings in syrup - ₹70
• Kulfi - Traditional Indian ice cream - ₹50
• Ras Malai - Cottage cheese in sweet milk - ₹80
`

    return simulatedContent
  } catch (error) {
    console.error("Word document parsing error:", error)
    throw new Error("Failed to parse Word document")
  }
}

export async function parseExcelFile(file: File): Promise<string> {
  try {
    console.log("Processing Excel file:", file.name)

    // Simulate Excel parsing with structured menu data
    const simulatedContent = `
MENU ITEMS SPREADSHEET

Category: Starters
Item Name | Description | Price
Samosa | Crispy pastry with potato filling | ₹90
Pakora | Mixed vegetable fritters | ₹80
Chicken Tikka | Grilled marinated chicken | ₹180
Paneer Tikka | Grilled cottage cheese | ₹150

Category: Main Course
Item Name | Description | Price
Butter Chicken | Creamy tomato chicken curry | ₹290
Dal Fry | Tempered yellow lentils | ₹130
Palak Paneer | Spinach with cottage cheese | ₹180
Biryani | Aromatic rice with meat/vegetables | ₹300
Mutton Curry | Spiced goat meat curry | ₹370

Category: Breads
Item Name | Description | Price
Naan | Leavened flatbread | ₹45
Roti | Whole wheat bread | ₹30
Paratha | Layered flatbread | ₹40

Category: Desserts
Item Name | Description | Price
Kulfi | Traditional ice cream | ₹45
Gulab Jamun | Sweet milk dumplings | ₹65
Kheer | Rice pudding | ₹55
`

    return simulatedContent
  } catch (error) {
    console.error("Excel parsing error:", error)
    throw new Error("Failed to parse Excel file")
  }
}

// Currency conversion utility
export function convertRupeesToDollars(text: string): string {
  // Convert rupee symbols and amounts to dollars (approximate conversion)
  const rupeeRate = 83 // Approximate INR to USD rate

  return text.replace(/₹(\d+(?:\.\d{2})?)/g, (match, amount) => {
    const rupeeAmount = Number.parseFloat(amount)
    const dollarAmount = (rupeeAmount / rupeeRate).toFixed(2)
    return `$${dollarAmount}`
  })
}

// Extract file content based on file type
export async function extractFileContent(file: File): Promise<string> {
  const fileName = file.name.toLowerCase()
  const fileType = file.type.toLowerCase()

  console.log("Extracting content from:", fileName, "Type:", fileType)

  try {
    if (fileType === "text/plain" || fileName.endsWith(".txt")) {
      return await parseTextFile(file)
    } else if (fileType.includes("csv") || fileName.endsWith(".csv")) {
      return await parseCSVFile(file)
    } else if (fileType.includes("pdf") || fileName.endsWith(".pdf")) {
      return await parsePDFFile(file)
    } else if (fileType.includes("image") || /\.(jpg|jpeg|png|gif)$/i.test(fileName)) {
      return await parseImageFile(file)
    } else if (fileType.includes("word") || /\.(doc|docx)$/i.test(fileName)) {
      return await parseWordFile(file)
    } else if (fileType.includes("sheet") || /\.(xls|xlsx)$/i.test(fileName)) {
      return await parseExcelFile(file)
    } else {
      // Default fallback
      console.log("Unknown file type, attempting text parsing")
      return await parseTextFile(file)
    }
  } catch (error) {
    console.error("File parsing error:", error)
    throw new Error(`Failed to parse ${fileName}: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
