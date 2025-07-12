"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Logo } from "@/components/logo"
import { Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function SignupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Account Details
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,

    // Step 2: Restaurant Details
    restaurantName: "",
    ownerName: "",
    phone: "",
    location: "",
    cuisineType: "",
    restaurantType: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (step === 1) {
      // Validate step 1
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Password Mismatch",
          description: "Passwords do not match. Please try again.",
          variant: "destructive",
        })
        return
      }

      if (!formData.agreeToTerms) {
        toast({
          title: "Terms Required",
          description: "Please agree to the terms and conditions.",
          variant: "destructive",
        })
        return
      }

      setStep(2)
    } else {
      // Step 2: Mock signup for development
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
        toast({
          title: "Account Created!",
          description: "Welcome to TableSalt AI. Your account has been created successfully.",
        })
        router.push("/dashboard")
      }, 2000)
    }
  }

  const renderStep1 = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            minLength={6}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          required
        />
      </div>
      <div className="flex items-start space-x-2">
        <Checkbox
          id="terms"
          checked={formData.agreeToTerms}
          onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })}
          required
        />
        <Label htmlFor="terms" className="text-sm leading-5">
          I agree to the{" "}
          <Button variant="link" className="p-0 h-auto text-slate-900 font-medium">
            Terms of Service
          </Button>{" "}
          and{" "}
          <Button variant="link" className="p-0 h-auto text-slate-900 font-medium">
            Privacy Policy
          </Button>
        </Label>
      </div>
      <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800">
        Continue
      </Button>
    </form>
  )

  const renderStep2 = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="restaurantName">Restaurant Name</Label>
        <Input
          id="restaurantName"
          placeholder="Enter your restaurant name"
          value={formData.restaurantName}
          onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="ownerName">Owner/Manager Name</Label>
        <Input
          id="ownerName"
          placeholder="Enter your full name"
          value={formData.ownerName}
          onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+91 98765 43210"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="City, State"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="cuisineType">Cuisine Type</Label>
        <Select
          value={formData.cuisineType}
          onValueChange={(value) => setFormData({ ...formData, cuisineType: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select cuisine type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="indian">Indian</SelectItem>
            <SelectItem value="chinese">Chinese</SelectItem>
            <SelectItem value="italian">Italian</SelectItem>
            <SelectItem value="continental">Continental</SelectItem>
            <SelectItem value="multi-cuisine">Multi-Cuisine</SelectItem>
            <SelectItem value="fast-food">Fast Food</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="restaurantType">Restaurant Type</Label>
        <Select
          value={formData.restaurantType}
          onValueChange={(value) => setFormData({ ...formData, restaurantType: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select restaurant type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fine-dining">Fine Dining</SelectItem>
            <SelectItem value="casual-dining">Casual Dining</SelectItem>
            <SelectItem value="quick-service">Quick Service</SelectItem>
            <SelectItem value="cafe">Cafe</SelectItem>
            <SelectItem value="food-truck">Food Truck</SelectItem>
            <SelectItem value="cloud-kitchen">Cloud Kitchen</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex space-x-3">
        <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={() => setStep(1)}>
          Back
        </Button>
        <Button type="submit" className="flex-1 bg-slate-900 hover:bg-slate-800" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </div>
    </form>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Button variant="ghost" className="mb-6 text-slate-600 hover:text-slate-900" onClick={() => router.push("/")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="border-slate-200 shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Logo size="lg" />
            </div>
            <CardTitle className="text-2xl">{step === 1 ? "Create Account" : "Restaurant Details"}</CardTitle>
            <CardDescription>
              {step === 1 ? "Start your 14-day free trial with TableSalt AI" : "Tell us about your restaurant"}
            </CardDescription>

            {/* Progress Indicator */}
            <div className="flex items-center justify-center space-x-2 mt-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-slate-900 text-white" : "bg-slate-200"}`}
              >
                {step > 1 ? <CheckCircle className="w-4 h-4" /> : "1"}
              </div>
              <div className={`w-8 h-1 ${step >= 2 ? "bg-slate-900" : "bg-slate-200"}`}></div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-slate-900 text-white" : "bg-slate-200"}`}
              >
                2
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {step === 1 ? renderStep1() : renderStep2()}

            {step === 1 && (
              <div className="mt-6 text-center">
                <p className="text-sm text-slate-600">
                  Already have an account?{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto text-slate-900 font-medium"
                    onClick={() => router.push("/auth/login")}
                  >
                    Sign in
                  </Button>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
