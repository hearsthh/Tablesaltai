// Enhanced types for menu manager

export interface MenuItemOption {
  id: string
  optionName: string
  optionValues: string[]
  required: boolean
}

export interface MenuItemModifier {
  id: string
  modifierName: string
  modifierPrice: number
  modifierType: "add" | "remove" | "side"
}

export interface AvailabilitySchedule {
  daysOfWeek: string[]
  startTime: string
  endTime: string
  startDate?: string
  endDate?: string
}

export interface NutritionalInformation {
  calories: number
  fat: number
  protein: number
  carbohydrates: number
  sugar: number
  sodium: number
}

export interface MenuSubcategory {
  id: string
  categoryId: string
  subcategoryName: string
  subcategoryDescription: string
  displayOrder: number
}

export interface CompleteMenuItem {
  options: MenuItemOption[]
  modifiers: MenuItemModifier[]
  availabilitySchedule: AvailabilitySchedule
  nutritionalInformation: NutritionalInformation
  allergenInformation: string[]
  subcategory: MenuSubcategory
}
