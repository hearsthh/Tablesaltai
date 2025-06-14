"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Logo } from "@/components/logo"
import {
  Users,
  TrendingUp,
  Globe,
  Menu,
  X,
  BarChart3,
  ChevronDown,
  Settings,
  LogOut,
  User,
  Bell,
  Search,
} from "lucide-react"

interface NavigationProps {
  variant?: "app" | "marketing"
}

export function Navigation({ variant = "app" }: NavigationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === "/dashboard") return pathname === "/dashboard"
    return pathname.startsWith(path)
  }

  const navigationItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: BarChart3,
      active: isActive("/dashboard"),
    },
    {
      label: "Profile",
      href: "/profile",
      icon: Users,
      active: isActive("/profile"),
      submenu: [
        { label: "Overview", href: "/profile" },
        { label: "Smart Profile", href: "/profile/smart-profile" },
        { label: "Reviews", href: "/profile/reviews" },
      ],
    },
    {
      label: "Marketing",
      href: "/marketing",
      icon: TrendingUp,
      active: isActive("/marketing"),
      submenu: [
        { label: "Marketing Hub", href: "/marketing" },
        { label: "Content Marketing", href: "/marketing/content" },
        { label: "Performance Marketing", href: "/marketing/performance" },
        { label: "Marketing Calendar", href: "/marketing/calendar" },
        { label: "AI Content Creation", href: "/marketing/ai-content" },
        { label: "Social Media", href: "/marketing/content/social-media" },
        { label: "Blog Articles", href: "/marketing/content/blog" },
        { label: "Campaigns", href: "/marketing/campaigns" },
        { label: "Strategies", href: "/marketing/strategies" },
        { label: "Offers & Promotions", href: "/marketing/offers" },
      ],
    },
    {
      label: "Customers",
      href: "/customers",
      icon: Users,
      active: isActive("/customers"),
      submenu: [
        { label: "Customer Hub", href: "/customers" },
        { label: "Segmentation", href: "/customers/segmentation" },
        { label: "Churn Management", href: "/customers/churn" },
        { label: "Customer Profiles", href: "/customers/profiles" },
        { label: "AI Insights", href: "/customers/insights" },
      ],
    },
    {
      label: "Integrations",
      href: "/integrations",
      icon: Globe,
      active: isActive("/integrations"),
    },
  ]

  if (variant === "marketing") {
    return (
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo size="md" onClick={() => router.push("/")} className="cursor-pointer" />

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
              <Button variant="ghost" onClick={() => router.push("/blog")}>
                Blog
              </Button>
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
                <Button variant="ghost" onClick={() => router.push("/blog")} className="justify-start">
                  Blog
                </Button>
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
    )
  }

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Logo size="md" onClick={() => router.push("/dashboard")} className="cursor-pointer" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <div key={item.href}>
                {item.submenu ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className={`rounded-md ${item.active ? "text-slate-900 font-medium bg-slate-100" : "text-slate-500"}`}
                      >
                        <item.icon className="w-4 h-4 mr-2" />
                        {item.label}
                        <ChevronDown className="w-4 h-4 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      <DropdownMenuLabel>{item.label}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {item.submenu.map((subItem) => (
                        <DropdownMenuItem
                          key={subItem.href}
                          onClick={() => router.push(subItem.href)}
                          className="cursor-pointer"
                        >
                          {subItem.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    variant="ghost"
                    className={`rounded-md ${item.active ? "text-slate-900 font-medium bg-slate-100" : "text-slate-500"}`}
                    onClick={() => router.push(item.href)}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="rounded-md">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-md relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                3
              </Badge>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-md">
                  <User className="w-4 h-4 mr-2" />
                  Account
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Spice Garden Restaurant</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer">
                  <User className="w-4 h-4 mr-2" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/settings")} className="cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/auth/login")} className="cursor-pointer text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden rounded-md"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200">
            <nav className="flex flex-col space-y-2">
              {navigationItems.map((item) => (
                <div key={item.href}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start rounded-md ${item.active ? "text-slate-900 font-medium bg-slate-100" : "text-slate-500"}`}
                    onClick={() => {
                      router.push(item.href)
                      setIsMenuOpen(false)
                    }}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                  {item.submenu && item.active && (
                    <div className="ml-6 mt-2 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Button
                          key={subItem.href}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-slate-600"
                          onClick={() => {
                            router.push(subItem.href)
                            setIsMenuOpen(false)
                          }}
                        >
                          {subItem.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 border-t border-slate-200 space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-slate-600"
                  onClick={() => router.push("/settings")}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600"
                  onClick={() => router.push("/auth/login")}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
