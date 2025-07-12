"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Mail, Phone, Save, CheckCircle } from "lucide-react"

interface RegistrationFormProps {
  initialData?: {
    emailId: string
    mobileNo: string
  }
  onSave: (data: any) => void
  loading?: boolean
  completed?: boolean
}

export default function RegistrationForm({
  initialData,
  onSave,
  loading = false,
  completed = false,
}: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    emailId: initialData?.emailId || "",
    mobileNo: initialData?.mobileNo || "",
  })

  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.emailId.trim() || !formData.mobileNo.trim()) {
      toast({
        title: "Error",
        description: "Both email and mobile number are required",
        variant: "destructive",
      })
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.emailId)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    // Mobile validation (Indian format)
    const mobileRegex = /^[6-9]\d{9}$/
    const cleanMobile = formData.mobileNo.replace(/\D/g, "")
    if (!mobileRegex.test(cleanMobile)) {
      toast({
        title: "Error",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive",
      })
      return
    }

    try {
      await onSave({
        section: "registration",
        data: {
          registration: {
            emailId: formData.emailId.trim(),
            mobileNo: cleanMobile,
          },
        },
      })

      toast({
        title: "Success",
        description: "Registration information saved successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save registration information",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center text-gray-900">
              <Mail className="w-5 h-5 mr-2 text-gray-600" />
              Registration Information
            </CardTitle>
            <CardDescription className="text-gray-600">
              Basic contact information for your restaurant account
            </CardDescription>
          </div>
          {completed && (
            <div className="flex items-center text-green-600">
              <CheckCircle className="w-5 h-5 mr-1" />
              <span className="text-sm font-medium">Complete</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="emailId" className="text-gray-700 font-medium">
              Email ID *
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="emailId"
                type="email"
                className="pl-10 border-gray-300 focus:border-gray-900"
                value={formData.emailId}
                onChange={(e) => setFormData((prev) => ({ ...prev, emailId: e.target.value }))}
                placeholder="restaurant@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobileNo" className="text-gray-700 font-medium">
              Mobile Number *
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="mobileNo"
                type="tel"
                className="pl-10 border-gray-300 focus:border-gray-900"
                value={formData.mobileNo}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 10)
                  setFormData((prev) => ({ ...prev, mobileNo: value }))
                }}
                placeholder="9876543210"
                required
              />
            </div>
            <p className="text-xs text-gray-500">Enter 10-digit mobile number without country code</p>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-gray-900 hover:bg-gray-800 text-white">
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Registration Info
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
