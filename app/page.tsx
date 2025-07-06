"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ChefHat,
  Users,
  Star,
  Menu,
  X,
  Brain,
  BarChart3,
  MessageSquare,
  Globe,
  ArrowRight,
  Sparkles,
  Shield,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <ChefHat className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-black">TableSalt AI</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-black transition-colors font-medium">
                Features
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-black transition-colors font-medium">
                Pricing
              </Link>
              <Link href="#testimonials" className="text-gray-600 hover:text-black transition-colors font-medium">
                Testimonials
              </Link>
              <Link href="/auth/login" className="text-gray-600 hover:text-black transition-colors font-medium">
                Login
              </Link>
              <Button asChild className="bg-black hover:bg-gray-800 text-white">
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </nav>

            {/* Mobile menu button */}
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-4">
                <Link href="#features" className="text-gray-600 hover:text-black transition-colors font-medium">
                  Features
                </Link>
                <Link href="#pricing" className="text-gray-600 hover:text-black transition-colors font-medium">
                  Pricing
                </Link>
                <Link href="#testimonials" className="text-gray-600 hover:text-black transition-colors font-medium">
                  Testimonials
                </Link>
                <Link href="/auth/login" className="text-gray-600 hover:text-black transition-colors font-medium">
                  Login
                </Link>
                <Button asChild className="bg-black hover:bg-gray-800 text-white w-full">
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 bg-gray-100 text-gray-800 border-gray-200">
              <Sparkles className="w-3 h-3 mr-1 text-blue-600" />
              AI-Powered Restaurant Management
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight">
              Transform Your Restaurant with <span className="text-blue-600">Smart AI</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Create compelling profiles, optimize menus, understand customers, and grow your business with our
              comprehensive AI-powered platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" asChild className="bg-black hover:bg-gray-800 text-white text-lg px-8 py-3">
                <Link href="/auth/signup">
                  Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-lg px-8 py-3 border-gray-300 hover:bg-gray-50 bg-transparent text-black"
              >
                <Link href="/dashboard">View Demo</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">500+</div>
                <div className="text-sm text-gray-600">Restaurants</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">40%</div>
                <div className="text-sm text-gray-600">Revenue Increase</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">4.9/5</div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-1">24/7</div>
                <div className="text-sm text-gray-600">AI Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-black mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform provides all the tools you need to create, manage, and grow your restaurant
              business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Smart Profiles */}
            <Card className="border-gray-200 hover:shadow-lg transition-shadow bg-white">
              <CardHeader>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-black">Smart Profile Creation</CardTitle>
                <CardDescription className="text-gray-600">
                  AI-generated restaurant profiles that capture your unique brand and attract customers.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Menu Optimization */}
            <Card className="border-gray-200 hover:shadow-lg transition-shadow bg-white">
              <CardHeader>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <ChefHat className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-black">Menu Intelligence</CardTitle>
                <CardDescription className="text-gray-600">
                  Optimize your menu with AI insights, pricing strategies, and performance analytics.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Customer Analytics */}
            <Card className="border-gray-200 hover:shadow-lg transition-shadow bg-white">
              <CardHeader>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-black">Customer Insights</CardTitle>
                <CardDescription className="text-gray-600">
                  Understand your customers better with AI-powered analytics and segmentation.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Marketing Automation */}
            <Card className="border-gray-200 hover:shadow-lg transition-shadow bg-white">
              <CardHeader>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-black">Marketing Automation</CardTitle>
                <CardDescription className="text-gray-600">
                  Create and schedule marketing campaigns that drive engagement and sales.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Performance Analytics */}
            <Card className="border-gray-200 hover:shadow-lg transition-shadow bg-white">
              <CardHeader>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle className="text-black">Performance Analytics</CardTitle>
                <CardDescription className="text-gray-600">
                  Track your restaurant's performance with detailed analytics and reporting.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Integration Hub */}
            <Card className="border-gray-200 hover:shadow-lg transition-shadow bg-white">
              <CardHeader>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-teal-600" />
                </div>
                <CardTitle className="text-black">Platform Integrations</CardTitle>
                <CardDescription className="text-gray-600">
                  Connect with Google My Business, Yelp, OpenTable, and other platforms seamlessly.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-black mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">Join thousands of restaurant owners who trust TableSalt AI</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-gray-200 bg-white">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "TableSalt AI transformed our restaurant's online presence. Our customer engagement increased by 40%
                  in just 3 months!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-black font-semibold text-sm">MR</span>
                  </div>
                  <div>
                    <div className="font-semibold text-black">Maria Rodriguez</div>
                    <div className="text-sm text-gray-500">Owner, Bella Vista</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 bg-white">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "The AI-powered menu optimization helped us increase our profit margins by 20%. Incredible results!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-black font-semibold text-sm">JC</span>
                  </div>
                  <div>
                    <div className="font-semibold text-black">James Chen</div>
                    <div className="text-sm text-gray-500">Chef, Golden Dragon</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 bg-white">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "The customer insights feature is a game-changer. We now understand our customers like never before."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-black font-semibold text-sm">SP</span>
                  </div>
                  <div>
                    <div className="font-semibold text-black">Sarah Patel</div>
                    <div className="text-sm text-gray-500">Manager, Spice Route</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Ready to Transform Your Restaurant?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of restaurant owners who are already using TableSalt AI to grow their business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-white hover:bg-gray-100 text-black text-lg px-8 py-3">
                <Link href="/auth/signup">Start Your Free Trial</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-black bg-transparent"
              >
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
            <div className="flex items-center justify-center mt-6 space-x-2 text-gray-300">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">No credit card required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <ChefHat className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-black">TableSalt AI</span>
              </div>
              <p className="text-gray-600 mb-4">
                AI-powered restaurant management platform helping restaurants grow and succeed.
              </p>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">Enterprise-grade security</span>
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-semibold mb-4 text-black">Product</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link href="/features" className="hover:text-black transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-black transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/integrations" className="hover:text-black transition-colors">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="hover:text-black transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold mb-4 text-black">Company</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link href="/about" className="hover:text-black transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-black transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-black transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-black transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold mb-4 text-black">Support</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link href="/help" className="hover:text-black transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="hover:text-black transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/status" className="hover:text-black transition-colors">
                    Status
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-black transition-colors">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2024 TableSalt AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
