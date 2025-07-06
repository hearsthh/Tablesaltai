"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X, BarChart3, Building, Target, Users, PieChart, Sparkles, Star, Clock, MapPin } from "lucide-react"

interface NavigationProps {
  restaurantName?: string
  location?: string
  avgRating?: number
  className?: string
}

export function Navigation({
  restaurantName = "Tasty Biryani",
  location = "Mumbai, Maharashtra",
  avgRating = 4.7,
  className,
}: NavigationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [currentTime] = useState(new Date())

  const navigationItems = [
    { name: "Dashboard", route: "/dashboard", icon: BarChart3 },
    { name: "Profile", route: "/profile", icon: Building },
    { name: "Marketing", route: "/marketing", icon: Target },
    { name: "Customers", route: "/customers", icon: Users },
    { name: "Analytics", route: "/analytics", icon: PieChart },
  ]

  const isActiveRoute = (route: string) => {
    if (route === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/"
    }
    return pathname.startsWith(route)
  }

  const handleNavigation = (route: string) => {
    router.push(route)
    setIsMobileMenuOpen(false)
  }

  const NavigationContent = () => (
    <div className="space-y-4">
      {/* Restaurant Info */}
      <div className="pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{restaurantName}</h2>
            <p className="text-xs text-gray-600">TableSalt AI Platform</p>
          </div>
        </div>
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <MapPin className="w-3 h-3" />
            <span>{location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-3 h-3 text-yellow-500" />
            <span>{avgRating} average rating</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Last sync: {currentTime.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = isActiveRoute(item.route)

          return (
            <Button
              key={item.name}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start space-x-3 ${
                isActive ? "bg-black text-white hover:bg-gray-800" : "text-gray-600 hover:text-black hover:bg-gray-100"
              }`}
              onClick={() => handleNavigation(item.route)}
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </Button>
          )
        })}
      </nav>

      {/* Quick Stats */}
      <div className="pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-sm font-bold text-gray-900">47</div>
            <div className="text-xs text-gray-600">Orders Today</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-sm font-bold text-gray-900">3.2%</div>
            <div className="text-xs text-gray-600">CTR (7d)</div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Navigation */}
      <div className={`bg-white border-b border-gray-200 sticky top-0 z-50 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-black">TableSalt AI</h1>
                <p className="text-xs text-gray-600 hidden sm:block">Restaurant Growth Platform</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = isActiveRoute(item.route)

                return (
                  <Button
                    key={item.name}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={`flex items-center space-x-2 ${
                      isActive
                        ? "bg-black text-white hover:bg-gray-800"
                        : "text-gray-600 hover:text-black hover:bg-gray-100"
                    }`}
                    onClick={() => handleNavigation(item.route)}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Button>
                )
              })}
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <NavigationContent />
                </SheetContent>
              </Sheet>
            </div>

            {/* Status Indicator */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-black">{currentTime.toLocaleTimeString()}</p>
                <p className="text-xs text-gray-500">Live Dashboard</p>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = isActiveRoute(item.route)

            return (
              <Button
                key={item.name}
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center space-y-1 h-12 ${isActive ? "text-black" : "text-gray-600"}`}
                onClick={() => handleNavigation(item.route)}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs">{item.name}</span>
                {isActive && <div className="w-1 h-1 bg-black rounded-full"></div>}
              </Button>
            )
          })}
        </div>
      </div>
    </>
  )
}
