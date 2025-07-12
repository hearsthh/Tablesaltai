"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

interface MobileSectionProps {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
  defaultExpanded?: boolean
  headerAction?: React.ReactNode
  className?: string
}

export function MobileSection({
  title,
  icon,
  children,
  defaultExpanded = false,
  headerAction,
  className = "",
}: MobileSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {icon}
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <div className="flex items-center space-x-2">
            {headerAction}
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="lg:hidden">
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className={`pt-0 ${isExpanded || window.innerWidth >= 1024 ? "block" : "hidden lg:block"}`}>
        {children}
      </CardContent>
    </Card>
  )
}
