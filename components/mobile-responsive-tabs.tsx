"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MobileResponsiveTabsProps {
  children: React.ReactNode
  className?: string
}

export function MobileResponsiveTabs({ children, className }: MobileResponsiveTabsProps) {
  const tabsRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(false)

  const checkForScrollPosition = () => {
    if (!tabsRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
  }

  React.useEffect(() => {
    const tabsElement = tabsRef.current
    if (!tabsElement) return

    checkForScrollPosition()

    const observer = new ResizeObserver(() => {
      checkForScrollPosition()
    })

    observer.observe(tabsElement)
    tabsElement.addEventListener("scroll", checkForScrollPosition)

    return () => {
      observer.disconnect()
      tabsElement.removeEventListener("scroll", checkForScrollPosition)
    }
  }, [])

  const scrollLeft = () => {
    if (!tabsRef.current) return
    tabsRef.current.scrollBy({ left: -200, behavior: "smooth" })
  }

  const scrollRight = () => {
    if (!tabsRef.current) return
    tabsRef.current.scrollBy({ left: 200, behavior: "smooth" })
  }

  return (
    <div className="relative">
      <div ref={tabsRef} className={cn("flex overflow-x-auto scrollbar-hide scroll-smooth", className)}>
        {children}
      </div>

      {canScrollLeft && (
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white shadow-md border-slate-200"
          onClick={scrollLeft}
          aria-label="Scroll tabs left"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      {canScrollRight && (
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white shadow-md border-slate-200"
          onClick={scrollRight}
          aria-label="Scroll tabs right"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
