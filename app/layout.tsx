import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ScrollButton } from "@/components/scroll-button"
import { ensureNoHorizontalScroll } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TableSalt - Restaurant Marketing Platform",
  description: "AI-powered marketing tools for restaurants",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Prevent horizontal scrolling
  ensureNoHorizontalScroll()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} overflow-x-hidden`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <ScrollButton />
        </ThemeProvider>
      </body>
    </html>
  )
}
