"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/logo"
import {
  BarChart3,
  Users,
  Target,
  Zap,
  Star,
  CheckCircle,
  TrendingUp,
  Globe,
  Menu,
  X,
  Brain,
  Sparkles,
  ArrowRight,
  Heart,
  Shield,
  Rocket,
  Play,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  const heroRef = useRef<HTMLDivElement>(null)
  const modulesRef = useRef<HTMLDivElement>(null)
  const aiRef = useRef<HTMLDivElement>(null)
  const testimonialsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsVisible(true)

    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up")
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    )

    const sections = [modulesRef.current, aiRef.current, testimonialsRef.current]
    sections.forEach((section) => {
      if (section) observer.observe(section)
    })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      observer.disconnect()
    }
  }, [])

  const coreModules = [
    {
      title: "Profile Management",
      description: "AI-powered restaurant profiling with smart menu optimization and review management",
      icon: Users,
      href: "/profile",
      features: ["Smart Restaurant Profiling", "AI Menu Optimization", "Review Management", "Brand Asset Management"],
      aiFeatures: [
        "Menu description generation",
        "Pricing optimization insights",
        "Brand voice analysis",
        "Review sentiment analysis",
      ],
      cta: "Build Profile",
    },
    {
      title: "Marketing Hub",
      description: "Comprehensive AI-driven marketing with content creation and campaign management",
      icon: Target,
      href: "/marketing",
      features: ["AI Content Creation", "Campaign Management", "Marketing Calendar", "Performance Analytics"],
      aiFeatures: [
        "Social media content generation",
        "Campaign strategy optimization",
        "Automated scheduling",
        "ROI prediction",
      ],
      cta: "Start Marketing",
    },
    {
      title: "Customer Intelligence",
      description: "Advanced AI analytics for customer segmentation and personalized engagement",
      icon: BarChart3,
      href: "/customers",
      features: [
        "Smart Customer Segmentation",
        "Churn Prediction",
        "Personalization Engine",
        "Lifetime Value Analysis",
      ],
      aiFeatures: [
        "Behavioral pattern analysis",
        "Churn risk prediction",
        "Personalized recommendations",
        "Customer journey mapping",
      ],
      cta: "Analyze Data",
    },
  ]

  const aiCapabilities = [
    {
      title: "Content Generation AI",
      description: "Create engaging content across all platforms instantly",
      icon: Sparkles,
      gradient: "from-emerald-500 to-teal-500",
      examples: ["Social media posts", "Menu descriptions", "Email campaigns", "Blog articles"],
    },
    {
      title: "Analytics & Insights AI",
      description: "Deep insights and predictive analytics for growth",
      icon: Brain,
      gradient: "from-purple-500 to-indigo-500",
      examples: ["Customer behavior", "Revenue forecasting", "Market trends", "Performance optimization"],
    },
    {
      title: "Automation AI",
      description: "Automate repetitive tasks and workflows",
      icon: Zap,
      gradient: "from-blue-500 to-cyan-500",
      examples: ["Content scheduling", "Review responses", "Campaign optimization", "Customer outreach"],
    },
  ]

  const globalFeatures = [
    {
      title: "Multi-Language Support",
      description: "AI content generation in 15+ languages including Hindi, Spanish, French",
      icon: Globe,
    },
    {
      title: "Local Market Intelligence",
      description: "Understand local food trends, pricing, and customer preferences",
      icon: TrendingUp,
    },
    {
      title: "Universal Integrations",
      description: "Connect with global platforms - Zomato, Uber Eats, DoorDash, and more",
      icon: Shield,
    },
    {
      title: "Cultural Adaptation",
      description: "AI adapts content and strategies to local culture and preferences",
      icon: Heart,
    },
  ]

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Owner, Spice Garden Mumbai",
      content: "TableSalt AI increased our customer engagement by 150% and revenue by 35% in just 3 months!",
      rating: 5,
      location: "🇮🇳 India",
    },
    {
      name: "Maria Rodriguez",
      role: "Manager, Casa Mexicana",
      content:
        "The AI content generation saves us 20 hours per week. Our social media presence has never been stronger.",
      rating: 5,
      location: "🇺🇸 USA",
    },
    {
      name: "Ahmed Hassan",
      role: "Founder, Desert Rose Chain",
      content: "Customer segmentation insights helped us increase average order value by 40%. Incredible ROI!",
      rating: 5,
      location: "🇦🇪 UAE",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .opacity-0 {
          opacity: 0;
        }
      `}</style>

      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo size="md" />

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#modules"
                className="text-slate-600 hover:text-black transition-all duration-200 text-sm font-medium hover:scale-105"
              >
                Modules
              </a>
              <a
                href="#ai-features"
                className="text-slate-600 hover:text-black transition-all duration-200 text-sm font-medium hover:scale-105"
              >
                AI Features
              </a>
              <a
                href="#pricing"
                className="text-slate-600 hover:text-black transition-all duration-200 text-sm font-medium hover:scale-105"
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className="text-slate-600 hover:text-black transition-all duration-200 text-sm font-medium hover:scale-105"
              >
                Reviews
              </a>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm font-medium hover:scale-105 transition-transform rounded-md"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button
                  size="sm"
                  className="bg-black hover:bg-gray-800 text-white text-sm font-medium hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md rounded-md"
                >
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden hover:scale-105 transition-transform rounded-md"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-sm py-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
              <a
                href="#modules"
                className="block px-4 py-2 text-slate-600 hover:text-black transition-colors font-medium"
              >
                Modules
              </a>
              <a
                href="#ai-features"
                className="block px-4 py-2 text-slate-600 hover:text-black transition-colors font-medium"
              >
                AI Features
              </a>
              <a
                href="#pricing"
                className="block px-4 py-2 text-slate-600 hover:text-black transition-colors font-medium"
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className="block px-4 py-2 text-slate-600 hover:text-black transition-colors font-medium"
              >
                Reviews
              </a>
              <div className="px-4 pt-4 space-y-2">
                <Link href="/auth/login" className="block">
                  <Button variant="ghost" size="sm" className="w-full font-medium rounded-md">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup" className="block">
                  <Button size="sm" className="w-full bg-black hover:bg-gray-800 text-white font-medium rounded-md">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative bg-gradient-to-br from-gray-50 to-white py-16 sm:py-20 lg:py-24 overflow-hidden"
        style={{
          transform: `translateY(${scrollY * 0.1}px)`,
        }}
      >
        <div className="absolute inset-0 bg-grid-gray-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="flex items-center justify-center mb-6 sm:mb-8">
              <div className="relative">
                <Brain className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-slate-600 mr-3 sm:mr-4 animate-pulse" />
                <div className="absolute -inset-1 bg-slate-600/20 rounded-full blur animate-ping" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-black leading-tight">TableSalt AI</h1>
            </div>

            <div className="space-y-4 sm:space-y-6 mb-10 sm:mb-12">
              <p className="text-xl sm:text-2xl lg:text-3xl text-gray-800 font-semibold max-w-4xl mx-auto leading-relaxed">
                AI-Powered Restaurant Management Platform
              </p>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Transform your restaurant with intelligent profiling, automated marketing, and customer insights. Built
                for global restaurants, launching in India.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-10 sm:mb-12">
              <Link href="/profile/menu-builder">
                <Button
                  size="lg"
                  className="group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 text-base font-medium shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 rounded-md"
                >
                  <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                  Try AI Menu Builder
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  size="lg"
                  className="group px-6 py-3 text-base font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:text-black transition-all duration-300 hover:scale-105 hover:shadow-sm rounded-md bg-transparent"
                >
                  <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform text-slate-600" />
                  <span className="text-gray-700 group-hover:text-black">Watch Demo</span>
                </Button>
              </Link>
            </div>

            {/* Global Launch Status */}
            <div
              className={`flex flex-wrap items-center justify-center gap-3 sm:gap-4 transition-all duration-1000 delay-300 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <Badge className="bg-gray-100 text-gray-800 px-4 py-2 hover:scale-105 transition-transform cursor-default font-medium text-sm border border-gray-200 rounded-md">
                🇮🇳 Launching in India
              </Badge>
              <Badge className="bg-gray-100 text-gray-800 px-4 py-2 hover:scale-105 transition-transform cursor-default font-medium text-sm border border-gray-200 rounded-md">
                🌍 Global Platform
              </Badge>
              <Badge className="bg-gray-100 text-gray-800 px-4 py-2 hover:scale-105 transition-transform cursor-default font-medium text-sm border border-gray-200 rounded-md">
                🤖 AI-First
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Core Modules Section */}
      <section id="modules" ref={modulesRef} className="py-16 sm:py-20 lg:py-24 bg-gray-50 opacity-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4 sm:mb-6 leading-tight">
              Three Powerful AI Modules
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Complete restaurant management solution with AI automation at every step
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            {coreModules.map((module, index) => (
              <Card
                key={index}
                className="border border-gray-200 hover:shadow-lg transition-all duration-500 cursor-pointer group bg-white hover:-translate-y-2 rounded-lg overflow-hidden"
                onClick={() => router.push(module.href)}
              >
                <CardHeader className="pb-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <module.icon className="w-6 h-6 text-slate-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold group-hover:text-black transition-colors leading-tight">
                        {module.title}
                      </CardTitle>
                    </div>
                  </div>
                  <CardDescription className="text-base text-gray-600 leading-relaxed">
                    {module.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-8">
                  {/* Core Features */}
                  <div>
                    <h4 className="font-bold text-black mb-4 text-base">Core Features:</h4>
                    <div className="space-y-3">
                      {module.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-slate-500 mr-3 flex-shrink-0" />
                          <span className="font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Features */}
                  <div>
                    <h4 className="font-bold text-black mb-4 text-base flex items-center">
                      <Brain className="w-4 h-4 mr-2 text-slate-600" />
                      AI Capabilities:
                    </h4>
                    <div className="space-y-3">
                      {module.aiFeatures.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-sm text-gray-600">
                          <Zap className="w-3 h-3 text-slate-500 mr-3 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full group-hover:shadow-md transition-all duration-300 hover:scale-105 bg-black hover:bg-gray-800 text-white font-medium py-2 rounded-md text-sm">
                    <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                    {module.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Capabilities Section */}
      <section id="ai-features" ref={aiRef} className="py-16 sm:py-20 lg:py-24 bg-white opacity-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4 sm:mb-6 leading-tight">
              Advanced AI Capabilities
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Cutting-edge artificial intelligence designed specifically for restaurant operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 mb-16 sm:mb-20">
            {aiCapabilities.map((capability, index) => (
              <Card
                key={index}
                className="border border-gray-200 hover:shadow-lg transition-all duration-500 hover:-translate-y-2 group rounded-lg overflow-hidden bg-white"
              >
                <CardContent className="p-8">
                  <div
                    className={`w-16 h-16 rounded-lg bg-gradient-to-r ${capability.gradient} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-sm`}
                  >
                    <capability.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-4 leading-tight">{capability.title}</h3>
                  <p className="text-gray-600 mb-8 text-base leading-relaxed">{capability.description}</p>
                  <div className="space-y-3">
                    {capability.examples.map((example, exampleIndex) => (
                      <div key={exampleIndex} className="flex items-center text-sm text-gray-700">
                        <Star className="w-3 h-3 text-slate-500 mr-3 flex-shrink-0" />
                        <span className="font-medium">{example}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Global Features */}
          <Card className="bg-gray-50 border border-gray-200 hover:shadow-lg transition-all duration-500 rounded-lg overflow-hidden">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl sm:text-3xl font-bold text-black flex items-center justify-center mb-4">
                <Globe className="w-8 h-8 mr-3 text-slate-600" />
                Built for Global Restaurants
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 leading-relaxed">
                Universal platform with local market intelligence
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {globalFeatures.map((feature, index) => (
                  <div key={index} className="text-center group">
                    <div className="w-14 h-14 bg-white border border-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                      <feature.icon className="w-7 h-7 text-slate-600" />
                    </div>
                    <h3 className="font-bold text-black mb-3 text-base leading-tight">{feature.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" ref={testimonialsRef} className="py-16 sm:py-20 lg:py-24 bg-gray-50 opacity-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4 sm:mb-6 leading-tight">
              Trusted by Restaurants Worldwide
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              See how TableSalt AI is helping restaurants across the globe grow their business
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="border border-gray-200 hover:shadow-lg transition-all duration-500 hover:-translate-y-2 group rounded-lg overflow-hidden bg-white"
              >
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-slate-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-8 italic text-base leading-relaxed font-medium">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-black text-base">{testimonial.name}</p>
                      <p className="text-sm text-gray-600 font-medium">{testimonial.role}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-sm font-medium group-hover:scale-105 transition-transform border border-gray-200 rounded-md"
                    >
                      {testimonial.location}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 sm:mb-8 leading-tight">
            Ready to Transform Your Restaurant?
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-10 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of restaurants using AI to grow their business. Start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-3 text-base font-medium shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 rounded-md"
              >
                <Rocket className="w-5 h-5 mr-2 group-hover:-translate-y-1 transition-transform" />
                Start Free Trial
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-3 text-base font-medium border border-white text-white hover:bg-white hover:text-black transition-all duration-300 hover:scale-105 rounded-md bg-transparent"
              >
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div>
              <Logo size="md" className="mb-6" />
              <p className="text-gray-600 text-base leading-relaxed">
                AI-powered restaurant management platform designed for global restaurants.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-black mb-6 text-lg">Modules</h3>
              <ul className="space-y-3 text-base text-gray-600">
                <li>
                  <Link href="/profile" className="hover:text-black transition-colors font-medium">
                    Profile Management
                  </Link>
                </li>
                <li>
                  <Link href="/marketing" className="hover:text-black transition-colors font-medium">
                    Marketing Hub
                  </Link>
                </li>
                <li>
                  <Link href="/customers" className="hover:text-black transition-colors font-medium">
                    Customer Intelligence
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-black mb-6 text-lg">Company</h3>
              <ul className="space-y-3 text-base text-gray-600">
                <li>
                  <a href="#about" className="hover:text-black transition-colors font-medium">
                    About
                  </a>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-black transition-colors font-medium">
                    Pricing
                  </Link>
                </li>
                <li>
                  <a href="/contact" className="hover:text-black transition-colors font-medium">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-black mb-6 text-lg">Support</h3>
              <ul className="space-y-3 text-base text-gray-600">
                <li>
                  <a href="/help" className="hover:text-black transition-colors font-medium">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="/docs" className="hover:text-black transition-colors font-medium">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="hover:text-black transition-colors font-medium">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-base text-gray-600">
            <p>&copy; 2024 TableSalt AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
