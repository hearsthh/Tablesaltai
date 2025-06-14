"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { Logo } from "@/components/logo"
import { ArrowRight, BarChart3, Users, Target, Zap, Star, CheckCircle, TrendingUp, Globe, Menu, X } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [email, setEmail] = useState("")

  const features = [
    {
      icon: BarChart3,
      title: "AI-Powered Analytics",
      description: "Get deep insights into customer behavior, preferences, and trends with advanced AI analytics.",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: Users,
      title: "Customer Management",
      description: "Segment customers, track lifetime value, and manage churn with intelligent automation.",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: Target,
      title: "Smart Marketing",
      description: "Create targeted campaigns, optimize ad spend, and maximize ROI with AI-driven strategies.",
      color: "bg-purple-50 text-purple-600",
    },
    {
      icon: Zap,
      title: "Content Generation",
      description: "Generate engaging social media posts, blog articles, and marketing copy instantly.",
      color: "bg-orange-50 text-orange-600",
    },
    {
      icon: TrendingUp,
      title: "Performance Tracking",
      description: "Monitor campaign performance, track KPIs, and get actionable recommendations.",
      color: "bg-pink-50 text-pink-600",
    },
    {
      icon: Globe,
      title: "Multi-Platform Integration",
      description: "Connect with social media, delivery platforms, and POS systems seamlessly.",
      color: "bg-indigo-50 text-indigo-600",
    },
  ]

  const modules = [
    {
      title: "Profile Management",
      description:
        "Smart restaurant profiling with AI-generated descriptions, menu optimization, and review management.",
      features: ["AI Menu Descriptions", "Smart Profiling", "Review Monitoring", "Website Builder"],
      icon: Users,
      color: "bg-blue-50 border-blue-200",
    },
    {
      title: "Marketing Hub",
      description: "Comprehensive marketing tools with AI-powered content creation and campaign management.",
      features: ["Content Marketing", "Performance Marketing", "Marketing Calendar", "AI Content Creation"],
      icon: Target,
      color: "bg-green-50 border-green-200",
    },
    {
      title: "Customer Intelligence",
      description: "Advanced customer segmentation, churn management, and personalized engagement strategies.",
      features: ["Customer Segmentation", "Churn Management", "Individual Profiling", "AI Insights"],
      icon: BarChart3,
      color: "bg-purple-50 border-purple-200",
    },
  ]

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Owner, Spice Garden",
      content: "TableSalt AI transformed our marketing. Our customer engagement increased by 150% in just 3 months!",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      role: "Marketing Manager, Urban Bites",
      content: "The AI-generated content saves us hours every week. Our social media presence has never been stronger.",
      rating: 5,
    },
    {
      name: "Amit Patel",
      role: "Founder, Curry House Chain",
      content: "Customer segmentation insights helped us increase our average order value by 40%. Incredible ROI!",
      rating: 5,
    },
  ]

  const pricingPlans = [
    {
      name: "Starter",
      price: "₹2,999",
      period: "/month",
      description: "Perfect for small restaurants getting started",
      features: [
        "Basic AI Analytics",
        "Social Media Management",
        "Customer Database (up to 500)",
        "Email Marketing",
        "Basic Templates",
        "Email Support",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: "₹5,999",
      period: "/month",
      description: "Ideal for growing restaurants and chains",
      features: [
        "Advanced AI Analytics",
        "Full Marketing Suite",
        "Customer Database (up to 2,000)",
        "AI Content Generation",
        "Custom Campaigns",
        "Priority Support",
        "Integration Support",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "₹12,999",
      period: "/month",
      description: "For large chains and restaurant groups",
      features: [
        "Enterprise AI Analytics",
        "Multi-location Management",
        "Unlimited Customer Database",
        "Custom AI Models",
        "Dedicated Account Manager",
        "24/7 Phone Support",
        "Custom Integrations",
        "White-label Options",
      ],
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo size="md" />

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">
                Features
              </a>
              <a href="#modules" className="text-slate-600 hover:text-slate-900 transition-colors">
                Modules
              </a>
              <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition-colors">
                Pricing
              </a>
              <a href="#testimonials" className="text-slate-600 hover:text-slate-900 transition-colors">
                Reviews
              </a>
              <a href="#about" className="text-slate-600 hover:text-slate-900 transition-colors">
                About
              </a>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.push("/auth/login")}>
                Sign In
              </Button>
              <Button onClick={() => router.push("/auth/signup")} className="bg-slate-900 hover:bg-slate-800">
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-200">
              <nav className="flex flex-col space-y-4">
                <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Features
                </a>
                <a href="#modules" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Modules
                </a>
                <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Pricing
                </a>
                <a href="#testimonials" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Reviews
                </a>
                <a href="#about" className="text-slate-600 hover:text-slate-900 transition-colors">
                  About
                </a>
                <div className="flex flex-col space-y-2 pt-4">
                  <Button variant="ghost" onClick={() => router.push("/auth/login")}>
                    Sign In
                  </Button>
                  <Button onClick={() => router.push("/auth/signup")} className="bg-slate-900 hover:bg-slate-800">
                    Get Started
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 mb-6">
              AI-Powered Marketing for <span className="text-blue-600">Restaurants</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Transform your restaurant's marketing with intelligent customer insights, automated content creation, and
              data-driven strategies that drive real results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                className="bg-slate-900 hover:bg-slate-800 text-lg px-8 py-3"
                onClick={() => router.push("/auth/signup")}
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-3 border-slate-300"
                onClick={() => router.push("/demo")}
              >
                Watch Demo
              </Button>
            </div>
            <div className="flex items-center justify-center space-x-6 text-sm text-slate-500">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                14-day free trial
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Powerful Features for Restaurant Success
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Everything you need to understand your customers, optimize your marketing, and grow your business.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-slate-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="modules" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Three Powerful Modules</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Comprehensive solutions for every aspect of your restaurant's digital presence and customer relationships.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {modules.map((module, index) => (
              <Card key={index} className={`border ${module.color} hover:shadow-lg transition-shadow`}>
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mb-6">
                    <module.icon className="w-8 h-8 text-slate-700" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{module.title}</h3>
                  <p className="text-slate-600 mb-6">{module.description}</p>
                  <ul className="space-y-2">
                    {module.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-slate-700">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
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
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Loved by Restaurant Owners</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              See how TableSalt AI is helping restaurants across India grow their business.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-slate-900">{testimonial.name}</p>
                    <p className="text-sm text-slate-600">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Choose the plan that fits your restaurant's needs. All plans include a 14-day free trial.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`border-slate-200 relative ${plan.popular ? "ring-2 ring-blue-500" : ""}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white">
                    Most Popular
                  </Badge>
                )}
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <p className="text-slate-600 mb-6">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                    <span className="text-slate-600">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-slate-700">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${plan.popular ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-900 hover:bg-slate-800"}`}
                    onClick={() => router.push("/auth/signup")}
                  >
                    Start Free Trial
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Restaurant Marketing?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Join thousands of restaurants already using TableSalt AI to grow their business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="max-w-sm bg-white"
            />
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700" onClick={() => router.push("/auth/signup")}>
              Get Started Free
            </Button>
          </div>
          <p className="text-sm text-slate-400">No credit card required • 14-day free trial • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Logo size="md" className="mb-4" />
              <p className="text-slate-600 text-sm">
                AI-powered marketing platform designed specifically for restaurants to grow their business.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <a href="#features" className="hover:text-slate-900">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#modules" className="hover:text-slate-900">
                    Modules
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-slate-900">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="/demo" className="hover:text-slate-900">
                    Demo
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <a href="#about" className="hover:text-slate-900">
                    About
                  </a>
                </li>
                <li>
                  <a href="/blog" className="hover:text-slate-900">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="/careers" className="hover:text-slate-900">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-slate-900">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <a href="/help" className="hover:text-slate-900">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="/docs" className="hover:text-slate-900">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="hover:text-slate-900">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="hover:text-slate-900">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 mt-8 pt-8 text-center text-sm text-slate-600">
            <p>&copy; 2024 TableSalt AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
