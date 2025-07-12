"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  Megaphone,
  UtensilsCrossed,
  Star,
  Users,
  User,
  Sparkles,
  Calendar,
  Settings,
  Menu,
  Bell,
  Search,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Marketing", href: "/marketing", icon: Megaphone, badge: "2" },
  { name: "Menu", href: "/menu", icon: UtensilsCrossed },
  { name: "Reviews", href: "/reviews", icon: Star, badge: "3" },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Profile", href: "/profile", icon: User },
  { name: "AI Content", href: "/ai-content-generator", icon: Sparkles },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function AppNavigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <h1 className="text-xl font-bold text-gray-900">Tablesalt</h1>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                            isActive(item.href)
                              ? "bg-gray-50 text-black"
                              : "text-gray-700 hover:text-black hover:bg-gray-50"
                          }`}
                        >
                          <Icon className="h-6 w-6 shrink-0" />
                          {item.name}
                          {item.badge && <Badge className="ml-auto bg-red-100 text-red-800">{item.badge}</Badge>}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile Top Bar */}
      <div className="lg:hidden">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <div className="flex h-16 shrink-0 items-center">
                <h1 className="text-xl font-bold text-gray-900">Tablesalt</h1>
              </div>
              <nav className="flex flex-1 flex-col mt-6">
                <ul role="list" className="space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                            isActive(item.href)
                              ? "bg-gray-50 text-black"
                              : "text-gray-700 hover:text-black hover:bg-gray-50"
                          }`}
                        >
                          <Icon className="h-6 w-6 shrink-0" />
                          {item.name}
                          {item.badge && <Badge className="ml-auto bg-red-100 text-red-800">{item.badge}</Badge>}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            </SheetContent>
          </Sheet>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              <h1 className="text-lg font-semibold text-gray-900">Tablesalt</h1>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <Button variant="ghost" size="sm">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 bg-red-500 text-white text-xs">3</Badge>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navigation.slice(0, 5).map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center p-2 rounded-lg relative ${
                  isActive(item.href) ? "bg-gray-100 text-black" : "text-gray-600 hover:text-black hover:bg-gray-50"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs mt-1 font-medium">{item.name}</span>
                {item.badge && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 bg-red-500 text-white text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}

export function MobileBottomNavigation() {
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
      <div className="grid grid-cols-5 gap-1 p-2">
        {navigation.slice(0, 5).map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center p-2 rounded-lg relative ${
                isActive(item.href) ? "bg-gray-100 text-black" : "text-gray-600 hover:text-black hover:bg-gray-50"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs mt-1 font-medium">{item.name}</span>
              {item.badge && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 bg-red-500 text-white text-xs">
                  {item.badge}
                </Badge>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
