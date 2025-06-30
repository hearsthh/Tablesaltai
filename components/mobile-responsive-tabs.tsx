"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Tab {
  id: string
  label: string
  content: React.ReactNode
}

interface MobileResponsiveTabsProps {
  tabs: Tab[]
  defaultTab?: string
  className?: string
}

export function MobileResponsiveTabs({ tabs, defaultTab, className = "" }: MobileResponsiveTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || "")
  const currentIndex = tabs.findIndex((tab) => tab.id === activeTab)
  const currentTab = tabs[currentIndex]

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id)
    }
  }

  const handleNext = () => {
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id)
    }
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Desktop Tabs */}
      <div className="hidden md:block">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-6">{currentTab?.content}</div>
      </div>

      {/* Mobile Tabs */}
      <div className="md:hidden">
        {/* Tab Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <Button variant="ghost" size="sm" onClick={handlePrevious} disabled={currentIndex === 0} className="p-2">
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="text-center">
            <h3 className="font-medium text-black">{currentTab?.label}</h3>
            <p className="text-xs text-gray-500">
              {currentIndex + 1} of {tabs.length}
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleNext}
            disabled={currentIndex === tabs.length - 1}
            className="p-2"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Tab Content */}
        <div className="p-4">{currentTab?.content}</div>

        {/* Tab Indicators */}
        <div className="flex justify-center space-x-2 p-4 border-t border-gray-200">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-2 h-2 rounded-full transition-colors ${activeTab === tab.id ? "bg-black" : "bg-gray-300"}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
