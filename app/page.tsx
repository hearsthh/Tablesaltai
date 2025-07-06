"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ChefHat,
  Sparkles,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  Globe,
  Target,
  Shield,
  Play,
  Menu,
  X,
} from "lucide-react"

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const features = [
    {
      icon: <ChefHat className="h-8 w-8 text-blue-600" />,
      title: "Smart Profile Management",
      description:
        "AI-powered restaurant profiles that automatically sync across all platforms. Manage your menu, photos, and business information from one central dashboard.",
      benefits: [
        "Auto-sync across 15+ platforms",
        "AI-generated descriptions",
        "Real-time menu updates",
        "Professional photo optimization",
      ],
    },
    {
      icon: <Target className="h-8 w-8 text-green-600" />,
      title: "Intelligent Marketing Hub",
      description:
        "Create, schedule, and optimize marketing campaigns across social media, email, and review platforms with AI-powered content generation.",
      benefits: [
        "AI content generation",
        "Multi-platform scheduling",
        "Performance analytics",
        "Automated A/B testing",
      ],
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "Customer Intelligence Engine",
      description:
        "Deep insights into customer behavior, preferences, and lifetime value. Predict churn, identify VIP customers, and personalize experiences.",
      benefits: ["Predictive analytics", "Customer segmentation", "Churn prevention", "Personalized recommendations"],
    },
  ]

  const testimonials = [
    {
      name: "Rajesh Kumar",
      restaurant: "Spice Garden, Mumbai",
      rating: 5,
      text: "TableSalt AI increased our online orders by 40% in just 2 months. The AI-generated social media content is incredible!",
      avatar: "/placeholder.svg?height=60&width=60&text=RK",
    },
    {
      name: "Priya Sharma",
      restaurant: "Café Delight, Delhi",
      rating: 5,
      text: "Managing multiple platforms was a nightmare. Now everything is automated and our customer engagement has tripled.",
      avatar: "/placeholder.svg?height=60&width=60&text=PS",
    },
    {
      name: "Amit Patel",
      restaurant: "Tandoor Express, Bangalore",
      rating: 5,
      text: "The customer insights helped us identify our most valuable customers. Our retention rate improved by 60%.",
      avatar: "/placeholder.svg?height=60&width=60&text=AP",
    },
  ]

  const stats = [
    { number: "500+", label: "Restaurants Powered" },
    { number: "2.5M+", label: "Orders Processed" },
    { number: "40%", label: "Average Revenue Increase" },
    { number: "15+", label: "Platform Integrations" },
  ]

  const pricingPlans = [
    {
      name: "Starter",
      price: "₹2,999",
      period: "/month",
      description: "Perfect for small restaurants getting started",
      features: [
        "Smart Profile Management",
        "Basic Marketing Tools",
        "Customer Analytics",
        "5 Platform Integrations",
        "Email Support",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: "₹5,999",
      period: "/month",
      description: "Ideal for growing restaurants",
      features: [
        "Everything in Starter",
        "Advanced AI Marketing",
        "Predictive Analytics",
        "15+ Platform Integrations",
        "Priority Support",
        "Custom Branding",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For restaurant chains and franchises",
      features: [
        "Everything in Professional",
        "Multi-location Management",
        "Advanced Reporting",
        "API Access",
        "Dedicated Account Manager",
        "Custom Integrations",
      ],
      popular: false,
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <ChefHat className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-black">TableSalt AI</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-black transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-black transition-colors">
                Pricing
              </Link>
              <Link href="#testimonials" className="text-gray-600 hover:text-black transition-colors">
                Reviews
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-black transition-colors">
                Dashboard
              </Link>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-black hover:bg-gray-800 text-white">Get Started</Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-4">
                <Link href="#features" className="text-gray-600 hover:text-black transition-colors">
                  Features
                </Link>
                <Link href="#pricing" className="text-gray-600 hover:text-black transition-colors">
                  Pricing
                </Link>
                <Link href="#testimonials" className="text-gray-600 hover:text-black transition-colors">
                  Reviews
                </Link>
                <Link href="/dashboard" className="text-gray-600 hover:text-black transition-colors">
                  Dashboard
                </Link>
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                  <Link href="/auth/login">
                    <Button variant="ghost" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button className="w-full bg-black hover:bg-gray-800 text-white">Get Started</Button>
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                🇮🇳 Launching in India
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Globe className="h-3 w-3 mr-1" />
                Global Platform
              </Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                <Sparkles className="h-3 w-3 mr-1" />
                AI-First
              </Badge>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-black mb-6">
              <span className="block">AI-Powered</span>
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Restaurant Growth
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transform your restaurant with intelligent profiling, automated marketing, and customer insights. Built
              for global restaurants, launching in India.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8 py-4 text-lg">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Try AI Menu Builder
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg bg-transparent">
                <Play className="h-5 w-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-black mb-2">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">Three Powerful AI Modules</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete restaurant management solution with AI automation at every step
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    {feature.icon}
                    <CardTitle className="text-xl font-semibold text-black">{feature.title}</CardTitle>
                  </div>
                  <CardDescription className="text-gray-600 text-base">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">Loved by Restaurant Owners</h2>
            <p className="text-xl text-gray-600">See how TableSalt AI is transforming restaurants across India</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-white border-gray-200">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-xl text-gray-800 mb-6">
                    "{testimonials[currentTestimonial].text}"
                  </blockquote>
                  <div className="flex items-center justify-center space-x-4">
                    <img
                      src={testimonials[currentTestimonial].avatar || "/placeholder.svg"}
                      alt={testimonials[currentTestimonial].name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="text-left">
                      <div className="font-semibold text-black">{testimonials[currentTestimonial].name}</div>
                      <div className="text-sm text-gray-600">{testimonials[currentTestimonial].restaurant}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial Indicators */}
            <div className="flex items-center justify-center space-x-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentTestimonial ? "bg-black" : "bg-gray-300"
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">Choose the perfect plan for your restaurant's growth</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`bg-white border-gray-200 relative ${plan.popular ? "ring-2 ring-black" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-black text-white">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-black">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-black">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-black hover:bg-gray-800 text-white"
                        : "bg-white hover:bg-gray-50 text-black border border-gray-300"
                    }`}
                  >
                    {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Transform Your Restaurant?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of restaurants already using TableSalt AI to grow their business
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-white hover:bg-gray-100 text-black px-8 py-4 text-lg">
                Start Free Trial
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg bg-transparent"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <ChefHat className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-black">TableSalt AI</span>
              </div>
              <p className="text-gray-600 mb-4">
                AI-powered restaurant management platform built for global restaurants.
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="h-4 w-4" />
                <span>Enterprise-grade security</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-black mb-4">Product</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link href="#features" className="hover:text-black transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-black transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-black transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/integrations" className="hover:text-black transition-colors">
                    Integrations
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-black mb-4">Company</h3>
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

            <div>
              <h3 className="font-semibold text-black mb-4">Support</h3>
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
                  <Link href="/api" className="hover:text-black transition-colors">
                    API
                  </Link>
                </li>
                <li>
                  <Link href="/status" className="hover:text-black transition-colors">
                    Status
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-600 text-sm">© 2024 TableSalt AI. All rights reserved.</p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-600 hover:text-black text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-black text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
