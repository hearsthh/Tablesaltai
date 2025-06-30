"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LinkIcon } from "lucide-react"

interface NavigationProps {
  variant?: "default" | "minimal"
  title?: string
}

export function Navigation({ variant = "default", title }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [connectionPercentage, setConnectionPercentage] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    const connectedIntegrations = 0
    const totalIntegrations = 8
    setConnectionPercentage(Math.round((connectedIntegrations / totalIntegrations) * 100))
  }, [])

  const getIntegrationColor = (percentage: number) => {
    if (percentage === 0) return "text-gray-400"
    if (percentage < 40) return "text-red-500"
    if (percentage < 70) return "text-yellow-500"
    return "text-green-500"
  }

  const mainNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      title: "Profile",
      href: "/profile",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
      subItems: [
        { title: "Smart Profile", href: "/profile/smart-profile" },
        { title: "Social Profile", href: "/profile/social-profile" },
        { title: "Menu Builder", href: "/profile/menu-builder" },
        { title: "Reviews", href: "/profile/reviews" },
        { title: "Integrations", href: "/profile/integrations" },
      ],
    },
    {
      title: "Marketing",
      href: "/marketing",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      subItems: [
        { title: "Campaigns", href: "/marketing/campaigns" },
        { title: "Content", href: "/marketing/content" },
        { title: "Calendar", href: "/marketing/calendar" },
        { title: "Analytics", href: "/marketing/analytics" },
      ],
    },
    {
      title: "Customers",
      href: "/customers",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      subItems: [
        { title: "Profiles", href: "/customers/profiles" },
        { title: "Segmentation", href: "/customers/segmentation" },
        { title: "Insights", href: "/customers/insights" },
        { title: "Churn Analysis", href: "/customers/churn" },
      ],
    },
  ]

  if (variant === "minimal") {
    return (
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                    />
                  </svg>
                </div>
                <span className="font-semibold text-gray-900">TableSalt AI</span>
              </Link>
              {title && (
                <>
                  <span className="text-gray-400">/</span>
                  <span className="text-gray-600 font-medium">{title}</span>
                </>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <LinkIcon className="w-4 h-4 text-gray-400" />
                <span className={`text-sm font-medium ${getIntegrationColor(connectionPercentage)}`}>
                  {connectionPercentage}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                  />
                </svg>
              </div>
              <span className="font-semibold text-gray-900">TableSalt AI</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {mainNavItems.map((item) => {
              const isActive = pathname.startsWith(item.href)

              return (
                <Link key={item.title} href={item.href}>
                  <Button
                    variant="ghost"
                    className={`flex items-center space-x-2 text-sm ${
                      isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </Button>
                </Link>
              )
            })}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <LinkIcon className="w-4 h-4 text-gray-400" />
              <span className={`text-sm font-medium ${getIntegrationColor(connectionPercentage)}`}>
                {connectionPercentage}%
              </span>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </Button>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {mainNavItems.map((item) => {
                const isActive = pathname.startsWith(item.href)

                return (
                  <div key={item.title}>
                    <Link href={item.href}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start ${isActive ? "bg-gray-100 text-gray-900" : "text-gray-600"}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span className="mr-2">{item.icon}</span>
                        {item.title}
                      </Button>
                    </Link>
                    {item.subItems && isActive && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.subItems.map((subItem) => (
                          <Link key={subItem.href} href={subItem.href}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start text-gray-500 hover:text-gray-900"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {subItem.title}
                            </Button>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <LinkIcon className="w-4 h-4 text-gray-400" />
                  <span className={`text-sm font-medium ${getIntegrationColor(connectionPercentage)}`}>
                    {connectionPercentage}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
