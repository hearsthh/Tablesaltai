"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowDown } from "lucide-react"

export function ScrollButton() {
  const [showScrollUp, setShowScrollUp] = useState(false)
  const [showScrollDown, setShowScrollDown] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show scroll up button when user has scrolled down 300px
      setShowScrollUp(window.scrollY > 300)

      // Show scroll down button when user is not at the bottom of the page
      const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
      setShowScrollDown(!isAtBottom && document.body.offsetHeight > window.innerHeight + 300)
    }

    window.addEventListener("scroll", handleScroll)
    // Initial check
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    })
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {showScrollUp && (
        <Button
          onClick={scrollToTop}
          size="icon"
          className="rounded-full bg-slate-900 hover:bg-slate-800 shadow-md"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      )}
      {showScrollDown && (
        <Button
          onClick={scrollToBottom}
          size="icon"
          className="rounded-full bg-slate-900 hover:bg-slate-800 shadow-md"
          aria-label="Scroll to bottom"
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
