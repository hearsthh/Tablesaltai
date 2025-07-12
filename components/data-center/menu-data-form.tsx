"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Plus, X, Utensils, DollarSign, Clock, Sparkles, ChefHat, Edit, Trash2, Save } from "lucide-react"

interface MenuDataFormProps {
  restaurantId: string
  initialData?: any
  onSave: (data: any) => void
}

interface MenuItem {
  id?: string
  name: string
  description: string
  price: number
  categoryId: string
  ingredients: string[]
  allergens: string[]
  dietaryTags: string[]
  preparationTime: number
  spiceLevel: number
  isAvailable: boolean
  isPopular: boolean
  isNew: boolean
}

interface MenuCategory {
  id?: string
  name: string
  description: string
  displayOrder: number
  isActive: boolean
}

const DIETARY_TAGS = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Nut-Free",
  "Keto",
  "Low-Carb",
  "High-Protein",
  "Organic",
  "Halal",
  "Kosher",
]

const COMMON_ALLERGENS = ["Nuts", "Dairy", "Eggs", "Gluten", "Soy", "Shellfish", "Fish", "Sesame"]

const SPICE_LEVELS = [
  { value: 0, label: "No Spice" },
  { value: 1, label: "Mild" },
  { value: 2, label: "Medium" },
  { value: 3, label: "Hot" },
  { value: 4, label: "Very Hot" },
  { value: 5, label: "Extremely Hot" },
]

export default function MenuDataForm({ restaurantId, initialData, onSave }: MenuDataFormProps) {
  const [categories, setCategories] = useState<MenuCategory[]>(initialData?.categories || [])
  const [items, setItems] = useState<MenuItem[]>(initialData?.items || [])
  const [aiEnhance, setAiEnhance] = useState(true)
  const [loading, setLoading] = useState(false)
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const { toast } = useToast()

  // Category Management
  const addCategory = () => {
    const newCategory: MenuCategory = {
      id: `temp-${Date.now()}`,
      name: "",
      description: "",
      displayOrder: categories.length,
      isActive: true,
    }
    setCategories([...categories, newCategory])
    setEditingCategory(newCategory.id!)
  }

  const updateCategory = (id: string, updates: Partial<MenuCategory>) => {
    setCategories((prev) => prev.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat)))
  }

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id))
    setItems((prev) => prev.filter((item) => item.categoryId !== id))
  }

  // Item Management
  const addItem = (categoryId: string) => {
    const newItem: MenuItem = {
      id: `temp-${Date.now()}`,
      name: "",
      description: "",
      price: 0,
      categoryId,
      ingredients: [],
      allergens: [],
      dietaryTags: [],
      preparationTime: 15,
      spiceLevel: 0,
      isAvailable: true,
      isPopular: false,
      isNew: true,
    }
    setItems([...items, newItem])
    setEditingItem(newItem.id!)
  }

  const updateItem = (id: string, updates: Partial<MenuItem>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)))
  }

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const addItemTag = (itemId: string, field: "ingredients" | "allergens" | "dietaryTags", value: string) => {
    if (!value.trim()) return

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const currentArray = item[field] as string[]
          if (!currentArray.includes(value.trim())) {
            return {
              ...item,
              [field]: [...currentArray, value.trim()],
            }
          }
        }
        return item
      }),
    )
  }

  const removeItemTag = (itemId: string, field: "ingredients" | "allergens" | "dietaryTags", value: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            [field]: (item[field] as string[]).filter((tag) => tag !== value),
          }
        }
        return item
      }),
    )
  }

  const handleSave = async () => {
    // Validate data
    const invalidCategories = categories.filter((cat) => !cat.name.trim())
    const invalidItems = items.filter((item) => !item.name.trim() || item.price <= 0)

    if (invalidCategories.length > 0) {
      toast({
        title: "Validation Error",
        description: "All categories must have a name",
        variant: "destructive",
      })
      return
    }

    if (invalidItems.length > 0) {
      toast({
        title: "Validation Error",
        description: "All items must have a name and valid price",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const menuData = {
        categories: categories.map((cat) => ({
          ...cat,
          id: cat.id?.startsWith("temp-") ? undefined : cat.id,
        })),
        items: items.map((item) => ({
          ...item,
          id: item.id?.startsWith("temp-") ? undefined : item.id,
        })),
      }

      await onSave({
        restaurantId,
        menuData,
        enhanceWithAI: aiEnhance,
      })

      toast({
        title: "Success",
        description: aiEnhance ? "Menu data saved and enhanced with AI" : "Menu data saved successfully",
      })

      setEditingCategory(null)
      setEditingItem(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save menu data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* AI Enhancement Toggle */}
      <Card className="border-gray-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center text-gray-900">
                <Sparkles className="w-5 h-5 mr-2 text-gray-600" />
                AI Enhancement
              </CardTitle>
              <CardDescription className="text-gray-600">
                Enhance menu items with AI-generated descriptions and tags
              </CardDescription>
            </div>
            <Switch checked={aiEnhance} onCheckedChange={setAiEnhance} />
          </div>
        </CardHeader>
      </Card>

      {/* Categories */}
      <Card className="border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center text-gray-900">
              <Utensils className="w-5 h-5 mr-2 text-gray-600" />
              Menu Categories
            </CardTitle>
            <Button onClick={addCategory} variant="outline" size="sm" className="border-gray-300 bg-transparent">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {categories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ChefHat className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No categories yet. Add your first menu category to get started.</p>
            </div>
          ) : (
            categories.map((category) => (
              <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                {editingCategory === category.id ? (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Category Name *</Label>
                      <Input
                        value={category.name}
                        onChange={(e) => updateCategory(category.id!, { name: e.target.value })}
                        placeholder="e.g., Appetizers, Main Courses"
                        className="border-gray-300 focus:border-gray-900"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Description</Label>
                      <Textarea
                        value={category.description}
                        onChange={(e) => updateCategory(category.id!, { description: e.target.value })}
                        placeholder="Brief description of this category"
                        rows={2}
                        className="border-gray-300 focus:border-gray-900 resize-none"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={category.isActive}
                          onCheckedChange={(checked) => updateCategory(category.id!, { isActive: checked })}
                        />
                        <Label className="text-sm text-gray-700">Active</Label>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => setEditingCategory(null)}
                          variant="outline"
                          size="sm"
                          className="border-gray-300"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        <Button
                          onClick={() => deleteCategory(category.id!)}
                          variant="outline"
                          size="sm"
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{category.name || "Untitled Category"}</h3>
                      {category.description && <p className="text-sm text-gray-600 mt-1">{category.description}</p>}
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant={category.isActive ? "default" : "secondary"} className="text-xs">
                          {category.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {items.filter((item) => item.categoryId === category.id).length} items
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => addItem(category.id!)}
                        variant="outline"
                        size="sm"
                        className="border-gray-300"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Item
                      </Button>
                      <Button
                        onClick={() => setEditingCategory(category.id!)}
                        variant="outline"
                        size="sm"
                        className="border-gray-300"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Items in this category */}
                {items.filter((item) => item.categoryId === category.id).length > 0 && (
                  <div className="mt-4 space-y-3">
                    <div className="border-t border-gray-200 pt-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Items in this category:</h4>
                      {items
                        .filter((item) => item.categoryId === category.id)
                        .map((item) => (
                          <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                            {editingItem === item.id ? (
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label className="text-gray-700 font-medium">Item Name *</Label>
                                    <Input
                                      value={item.name}
                                      onChange={(e) => updateItem(item.id!, { name: e.target.value })}
                                      placeholder="e.g., Margherita Pizza"
                                      className="border-gray-300 focus:border-gray-900"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-gray-700 font-medium">Price *</Label>
                                    <div className="relative">
                                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                      <Input
                                        type="number"
                                        step="0.01"
                                        value={item.price}
                                        onChange={(e) =>
                                          updateItem(item.id!, { price: Number.parseFloat(e.target.value) || 0 })
                                        }
                                        placeholder="0.00"
                                        className="pl-10 border-gray-300 focus:border-gray-900"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-gray-700 font-medium">Description</Label>
                                  <Textarea
                                    value={item.description}
                                    onChange={(e) => updateItem(item.id!, { description: e.target.value })}
                                    placeholder="Describe this menu item..."
                                    rows={3}
                                    className="border-gray-300 focus:border-gray-900 resize-none"
                                  />
                                  {aiEnhance && (
                                    <p className="text-xs text-gray-500">
                                      AI will enhance this description if left empty
                                    </p>
                                  )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label className="text-gray-700 font-medium">Preparation Time (minutes)</Label>
                                    <div className="relative">
                                      <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                      <Input
                                        type="number"
                                        value={item.preparationTime}
                                        onChange={(e) =>
                                          updateItem(item.id!, {
                                            preparationTime: Number.parseInt(e.target.value) || 0,
                                          })
                                        }
                                        placeholder="15"
                                        className="pl-10 border-gray-300 focus:border-gray-900"
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-gray-700 font-medium">Spice Level</Label>
                                    <Select
                                      value={item.spiceLevel.toString()}
                                      onValueChange={(value) =>
                                        updateItem(item.id!, { spiceLevel: Number.parseInt(value) })
                                      }
                                    >
                                      <SelectTrigger className="border-gray-300">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {SPICE_LEVELS.map((level) => (
                                          <SelectItem key={level.value} value={level.value.toString()}>
                                            {level.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>

                                {/* Ingredients */}
                                <div className="space-y-2">
                                  <Label className="text-gray-700 font-medium">Ingredients</Label>
                                  <div className="flex flex-wrap gap-2 mb-2">
                                    {item.ingredients.map((ingredient, idx) => (
                                      <Badge key={idx} variant="outline" className="bg-white">
                                        {ingredient}
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => removeItemTag(item.id!, "ingredients", ingredient)}
                                          className="ml-1 h-auto p-0 hover:bg-transparent"
                                        >
                                          <X className="w-3 h-3" />
                                        </Button>
                                      </Badge>
                                    ))}
                                  </div>
                                  <div className="flex space-x-2">
                                    <Input
                                      placeholder="Add ingredient"
                                      className="border-gray-300 focus:border-gray-900"
                                      onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                          addItemTag(item.id!, "ingredients", e.currentTarget.value)
                                          e.currentTarget.value = ""
                                        }
                                      }}
                                    />
                                  </div>
                                </div>

                                {/* Allergens */}
                                <div className="space-y-2">
                                  <Label className="text-gray-700 font-medium">Allergens</Label>
                                  <div className="flex flex-wrap gap-2 mb-2">
                                    {item.allergens.map((allergen, idx) => (
                                      <Badge
                                        key={idx}
                                        variant="outline"
                                        className="bg-red-50 border-red-200 text-red-800"
                                      >
                                        {allergen}
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => removeItemTag(item.id!, "allergens", allergen)}
                                          className="ml-1 h-auto p-0 hover:bg-transparent"
                                        >
                                          <X className="w-3 h-3" />
                                        </Button>
                                      </Badge>
                                    ))}
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {COMMON_ALLERGENS.filter((a) => !item.allergens.includes(a)).map((allergen) => (
                                      <Button
                                        key={allergen}
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => addItemTag(item.id!, "allergens", allergen)}
                                        className="text-xs border-gray-300"
                                      >
                                        <Plus className="w-3 h-3 mr-1" />
                                        {allergen}
                                      </Button>
                                    ))}
                                  </div>
                                </div>

                                {/* Dietary Tags */}
                                <div className="space-y-2">
                                  <Label className="text-gray-700 font-medium">Dietary Tags</Label>
                                  <div className="flex flex-wrap gap-2 mb-2">
                                    {item.dietaryTags.map((tag, idx) => (
                                      <Badge
                                        key={idx}
                                        variant="outline"
                                        className="bg-green-50 border-green-200 text-green-800"
                                      >
                                        {tag}
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => removeItemTag(item.id!, "dietaryTags", tag)}
                                          className="ml-1 h-auto p-0 hover:bg-transparent"
                                        >
                                          <X className="w-3 h-3" />
                                        </Button>
                                      </Badge>
                                    ))}
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {DIETARY_TAGS.filter((t) => !item.dietaryTags.includes(t)).map((tag) => (
                                      <Button
                                        key={tag}
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => addItemTag(item.id!, "dietaryTags", tag)}
                                        className="text-xs border-gray-300"
                                      >
                                        <Plus className="w-3 h-3 mr-1" />
                                        {tag}
                                      </Button>
                                    ))}
                                  </div>
                                </div>

                                {/* Item Status */}
                                <div className="flex flex-wrap gap-4">
                                  <div className="flex items-center space-x-2">
                                    <Switch
                                      checked={item.isAvailable}
                                      onCheckedChange={(checked) => updateItem(item.id!, { isAvailable: checked })}
                                    />
                                    <Label className="text-sm text-gray-700">Available</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Switch
                                      checked={item.isPopular}
                                      onCheckedChange={(checked) => updateItem(item.id!, { isPopular: checked })}
                                    />
                                    <Label className="text-sm text-gray-700">Popular</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Switch
                                      checked={item.isNew}
                                      onCheckedChange={(checked) => updateItem(item.id!, { isNew: checked })}
                                    />
                                    <Label className="text-sm text-gray-700">New</Label>
                                  </div>
                                </div>

                                <div className="flex justify-end space-x-2">
                                  <Button
                                    onClick={() => setEditingItem(null)}
                                    variant="outline"
                                    size="sm"
                                    className="border-gray-300"
                                  >
                                    <Save className="w-4 h-4 mr-1" />
                                    Save
                                  </Button>
                                  <Button
                                    onClick={() => deleteItem(item.id!)}
                                    variant="outline"
                                    size="sm"
                                    className="border-red-300 text-red-600 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <h5 className="font-medium text-gray-900">{item.name || "Untitled Item"}</h5>
                                    <span className="font-medium text-gray-900">${item.price.toFixed(2)}</span>
                                  </div>
                                  {item.description && <p className="text-sm text-gray-600 mb-2">{item.description}</p>}
                                  <div className="flex flex-wrap gap-1">
                                    {!item.isAvailable && (
                                      <Badge variant="secondary" className="text-xs bg-red-100 text-red-800">
                                        Unavailable
                                      </Badge>
                                    )}
                                    {item.isPopular && (
                                      <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                                        Popular
                                      </Badge>
                                    )}
                                    {item.isNew && (
                                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                        New
                                      </Badge>
                                    )}
                                    {item.dietaryTags.slice(0, 2).map((tag, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                    {item.dietaryTags.length > 2 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{item.dietaryTags.length - 2} more
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <Button
                                  onClick={() => setEditingItem(item.id!)}
                                  variant="outline"
                                  size="sm"
                                  className="ml-4 border-gray-300"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-4">
        <Button onClick={handleSave} disabled={loading} className="w-full bg-gray-900 hover:bg-gray-800 text-white">
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {aiEnhance ? "Save & Enhance with AI" : "Save Menu Data"}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
