"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Upload, FileText, ImageIcon, FileSpreadsheet, Globe, Smartphone, Zap, AlertCircle } from "lucide-react"
import type React from "react"

interface MenuExtractModalProps {
  isOpen: boolean
  onClose: () => void
  onMenuExtracted: (menuData: any) => void
}

const fileTypes = [
  { type: "pdf", icon: FileText, label: "PDF", accept: ".pdf", color: "text-red-600" },
  { type: "doc", icon: FileText, label: "Word", accept: ".doc,.docx", color: "text-blue-600" },
  { type: "excel", icon: FileSpreadsheet, label: "Excel", accept: ".xls,.xlsx,.csv", color: "text-green-600" },
  { type: "txt", icon: FileText, label: "Text", accept: ".txt", color: "text-gray-600" },
  { type: "image", icon: ImageIcon, label: "Image", accept: ".jpg,.jpeg,.png", color: "text-purple-600" },
]

const platforms = [
  { id: "pos", name: "POS System", icon: Smartphone, description: "Square, Toast, Clover", status: "coming-soon" },
  { id: "swiggy", name: "Swiggy", icon: Smartphone, description: "Import from Swiggy partner", status: "coming-soon" },
  { id: "zomato", name: "Zomato", icon: Smartphone, description: "Import from Zomato partner", status: "coming-soon" },
  { id: "website", name: "Website", icon: Globe, description: "Extract from website URL", status: "available" },
]

export default function MenuExtractModal({ isOpen, onClose, onMenuExtracted }: MenuExtractModalProps) {
  const [activeTab, setActiveTab] = useState("file")
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractedData, setExtractedData] = useState<any>(null)
  const [step, setStep] = useState<"input" | "preview" | "confirm">("input")
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [manualText, setManualText] = useState("")
  const [currencyOption, setCurrencyOption] = useState<"keep" | "convert">("keep")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB",
        variant: "destructive",
      })
      return
    }

    setIsExtracting(true)

    try {
      console.log("🔄 Processing file with universal processor:", file.name)

      // Use universal file processor
      const { universalFileProcessor } = await import("@/lib/utils/universal-file-processor")
      const result = await universalFileProcessor.processFile(file)

      console.log("✅ File processed successfully")
      console.log("Content length:", result.content.length)
      console.log("Processing method:", result.metadata.processingMethod)
      console.log("Confidence:", result.metadata.confidence)

      if (!result.content.trim()) {
        throw new Error("No readable content found in the file")
      }

      // Show processing info to user
      toast({
        title: "File Processed",
        description: `Extracted content using ${result.metadata.processingMethod} (${result.metadata.confidence * 100}% confidence)`,
      })

      await extractMenu("file", {
        content: result.content,
        fileName: file.name,
        fileType: file.type || "unknown",
        fileSize: file.size,
        processingMethod: result.metadata.processingMethod,
        confidence: result.metadata.confidence,
      })
    } catch (error) {
      console.error("File processing error:", error)
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "Failed to process the uploaded file",
        variant: "destructive",
      })
    } finally {
      setIsExtracting(false)
    }
  }

  const handleWebsiteExtract = async () => {
    if (!websiteUrl.trim()) {
      toast({
        title: "URL required",
        description: "Please enter a website URL",
        variant: "destructive",
      })
      return
    }

    setIsExtracting(true)

    try {
      // In production, you'd scrape the website
      // For demo, we'll simulate website content with rupees
      const content = `
APPETIZERS & STARTERS
Vegetable Samosa - Crispy pastry with spiced vegetables - ₹120
Chicken Tikka - Grilled chicken marinated in yogurt and spices - ₹200
Paneer Pakora - Cottage cheese fritters with mint chutney - ₹150

MAIN COURSES
Butter Chicken - Tender chicken in rich tomato cream sauce - ₹300
Lamb Biryani - Fragrant basmati rice with spiced lamb - ₹380
Dal Tadka - Yellow lentils tempered with spices - ₹140
Palak Paneer - Cottage cheese in creamy spinach curry - ₹220

BREADS & RICE
Garlic Naan - Soft bread with fresh garlic - ₹60
Basmati Rice - Aromatic long grain rice - ₹80
Butter Naan - Classic naan with butter - ₹50

DESSERTS
Gulab Jamun - Sweet milk dumplings in syrup - ₹70
Kulfi - Traditional Indian ice cream - ₹50
`

      await extractMenu("url", {
        content,
        url: websiteUrl,
        hasRupees: true,
      })
    } catch (error) {
      console.error("Website extraction error:", error)
      toast({
        title: "Extraction failed",
        description: "Failed to extract menu from website",
        variant: "destructive",
      })
    } finally {
      setIsExtracting(false)
    }
  }

  const handleManualExtract = async () => {
    if (!manualText.trim()) {
      toast({
        title: "Text required",
        description: "Please enter menu text to extract",
        variant: "destructive",
      })
      return
    }

    setIsExtracting(true)

    try {
      const hasRupees = manualText.includes("₹") || manualText.includes("Rs.") || manualText.includes("INR")

      await extractMenu("file", {
        content: manualText,
        fileName: "manual-input.txt",
        fileType: "text/plain",
        hasRupees,
      })
    } catch (error) {
      console.error("Manual extraction error:", error)
      toast({
        title: "Extraction failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsExtracting(false)
    }
  }

  const extractMenu = async (type: string, data: any) => {
    try {
      console.log("=== Sending to Menu Extract API ===")
      console.log("Type:", type)
      console.log("Data keys:", Object.keys(data))
      console.log("Content length:", data.content?.length || 0)
      console.log("Has rupees:", data.hasRupees)
      console.log("Content preview:", data.content?.substring(0, 100) + "...")

      const response = await fetch("/api/ai/menu-extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          extractionType: type,
          data,
          options: {
            includeDescriptions: true,
            inferTags: true,
            groupSimilarItems: false,
            preserveCurrency: true,
            hasRupees: data.hasRupees,
          },
        }),
      })

      console.log("API Response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("API Error:", errorData)
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const result = await response.json()
      console.log("API Success:", result)

      if (result.success) {
        setExtractedData(result)
        setStep("preview")

        toast({
          title: "✅ Menu Extracted!",
          description: `Found ${result.menuData.categories.length} categories using ${result.mode === "openai" ? "OpenAI" : "Fallback"} parsing`,
        })
      } else {
        throw new Error(result.error || "Extraction failed")
      }
    } catch (error) {
      console.error("Menu extraction error:", error)
      toast({
        title: "❌ Extraction Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
    }
  }

  const handleConfirmExtraction = () => {
    if (extractedData?.menuData) {
      onMenuExtracted(extractedData.menuData)
      toast({
        title: "✅ Menu Imported!",
        description: `Successfully imported ${extractedData.menuData.categories.length} categories to your menu`,
      })
      handleClose()
    }
  }

  const handleClose = () => {
    setStep("input")
    setExtractedData(null)
    setWebsiteUrl("")
    setManualText("")
    setActiveTab("file")
    setCurrencyOption("keep")
    onClose()
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            {step === "input" && "AI Menu Extract"}
            {step === "preview" && "Preview Extracted Menu"}
            {step === "confirm" && "Confirm Import"}
          </DialogTitle>
        </DialogHeader>

        {step === "input" && (
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="file">File Upload</TabsTrigger>
                <TabsTrigger value="platform">Platform Import</TabsTrigger>
                <TabsTrigger value="manual">Manual Text</TabsTrigger>
              </TabsList>

              <TabsContent value="file" className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">Upload Menu File</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Support for PDF, Word, Excel, Text files, and Images (with OCR). Handles both ₹ and $ currencies.
                  </p>
                </div>

                {/* File Types */}
                <div className="grid grid-cols-5 gap-3 mb-4">
                  {fileTypes.map((fileType) => {
                    const Icon = fileType.icon
                    return (
                      <div key={fileType.type} className="text-center p-3 border rounded-lg">
                        <Icon className={`w-8 h-8 mx-auto mb-2 ${fileType.color}`} />
                        <div className="text-xs font-medium">{fileType.label}</div>
                      </div>
                    )
                  })}
                </div>

                {/* Drag & Drop Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">Drop your menu file here</p>
                    <p className="text-sm text-gray-600">or click to browse</p>
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isExtracting}>
                      {isExtracting ? "Processing..." : "Choose File"}
                    </Button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload(e.target.files)}
                  />
                </div>

                <div className="text-xs text-gray-500 text-center">
                  Maximum file size: 10MB • Supported formats: PDF, DOC, DOCX, XLS, XLSX, CSV, TXT, JPG, PNG
                  <br />
                  Automatically detects and preserves Indian rupee (₹) pricing
                </div>
              </TabsContent>

              <TabsContent value="platform" className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium mb-2">Import from Platform</h3>
                  <p className="text-sm text-gray-600">Connect and import your menu from existing platforms</p>
                </div>

                <div className="grid gap-4">
                  {platforms.map((platform) => {
                    const Icon = platform.icon
                    const isAvailable = platform.status === "available"

                    return (
                      <div
                        key={platform.id}
                        className={`border rounded-lg p-4 ${
                          isAvailable ? "hover:border-blue-300 cursor-pointer" : "opacity-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Icon className="w-8 h-8 text-blue-600" />
                            <div>
                              <h4 className="font-medium">{platform.name}</h4>
                              <p className="text-sm text-gray-600">{platform.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {isAvailable ? (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                Available
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-orange-600 border-orange-600">
                                Coming Soon
                              </Badge>
                            )}
                          </div>
                        </div>

                        {platform.id === "website" && (
                          <div className="mt-4 space-y-3">
                            <Label htmlFor="websiteUrl">Website URL</Label>
                            <div className="flex gap-2">
                              <Input
                                id="websiteUrl"
                                placeholder="https://yourrestaurant.com/menu"
                                value={websiteUrl}
                                onChange={(e) => setWebsiteUrl(e.target.value)}
                              />
                              <Button onClick={handleWebsiteExtract} disabled={isExtracting || !websiteUrl.trim()}>
                                {isExtracting ? "Extracting..." : "Extract"}
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </TabsContent>

              <TabsContent value="manual" className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium mb-2">Manual Text Input</h3>
                  <p className="text-sm text-gray-600">Paste your menu text and let AI structure it for you</p>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="manualText">Menu Text</Label>
                  <Textarea
                    id="manualText"
                    placeholder="Paste your menu text here...

Example:
APPETIZERS
Samosa - ₹120
Spring Rolls - ₹90

MAIN COURSE
Butter Chicken - ₹300
Biryani - ₹350"
                    value={manualText}
                    onChange={(e) => setManualText(e.target.value)}
                    rows={12}
                    className="font-mono text-sm"
                  />

                  <div className="flex justify-end">
                    <Button onClick={handleManualExtract} disabled={isExtracting || !manualText.trim()}>
                      {isExtracting ? "Extracting..." : "Extract Menu"}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {step === "preview" && extractedData && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">Extracted Menu Preview</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {extractedData.sourceInfo} • {extractedData.menuData.categories.length} categories • Parsed with{" "}
                  {extractedData.mode === "openai" ? "OpenAI AI" : "Fallback Parser"}
                  {extractedData.hasRupees && " • Indian Currency Detected"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep("input")}>
                  Back
                </Button>
                <Button onClick={handleConfirmExtraction}>Import Menu</Button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
              {extractedData.menuData.categories.map((category: any, catIndex: number) => (
                <div key={category.id} className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">
                    {category.name}
                    <span className="text-sm font-normal text-gray-600 ml-2">({category.items.length} items)</span>
                  </h4>

                  <div className="grid gap-3">
                    {category.items.map((item: any, itemIndex: number) => (
                      <div key={item.id} className="bg-white rounded-lg p-3 border">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{item.name}</h5>
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          </div>
                          <div className="text-lg font-semibold text-green-600 ml-4">
                            {item.originalPrice || `$${item.price.toFixed(2)}`}
                          </div>
                        </div>

                        {(item.tasteTags.length > 0 || item.promoTags.length > 0) && (
                          <div className="flex flex-wrap gap-1">
                            {item.tasteTags.map((tag: string) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {item.promoTags.map((tag: string) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {extractedData.mode === "fallback" && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-orange-800">Fallback Parsing Used</h4>
                    <p className="text-sm text-orange-700 mt-1">
                      The menu was parsed using our fallback system. You may need to review and edit the extracted data.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
