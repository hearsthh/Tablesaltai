"use client"

import React from "react"

interface ErrorContext {
  userId?: string
  restaurantId?: string
  action?: string
  metadata?: Record<string, any>
}

class ErrorTracker {
  private static instance: ErrorTracker
  private isProduction = process.env.NODE_ENV === "production"

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker()
    }
    return ErrorTracker.instance
  }

  async captureError(error: Error, context?: ErrorContext) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      context,
      environment: process.env.NODE_ENV,
      url: typeof window !== "undefined" ? window.location.href : undefined,
      userAgent: typeof window !== "undefined" ? window.navigator.userAgent : undefined,
    }

    // Log to console in development
    if (!this.isProduction) {
      console.error("Error captured:", errorData)
    }

    // In production, send to error tracking service (Sentry, LogRocket, etc.)
    if (this.isProduction) {
      try {
        await fetch("/api/monitoring/errors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(errorData),
        })
      } catch (e) {
        console.error("Failed to send error to tracking service:", e)
      }
    }
  }

  async captureMessage(message: string, level: "info" | "warning" | "error" = "info", context?: ErrorContext) {
    const logData = {
      message,
      level,
      timestamp: new Date().toISOString(),
      context,
      environment: process.env.NODE_ENV,
    }

    if (!this.isProduction) {
      console.log(`[${level.toUpperCase()}]`, logData)
    }

    if (this.isProduction && level === "error") {
      try {
        await fetch("/api/monitoring/logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(logData),
        })
      } catch (e) {
        console.error("Failed to send log to tracking service:", e)
      }
    }
  }

  async capturePerformance(metric: string, value: number, context?: ErrorContext) {
    const performanceData = {
      metric,
      value,
      timestamp: new Date().toISOString(),
      context,
      environment: process.env.NODE_ENV,
    }

    if (!this.isProduction) {
      console.log("Performance metric:", performanceData)
    }

    if (this.isProduction) {
      try {
        await fetch("/api/monitoring/performance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(performanceData),
        })
      } catch (e) {
        console.error("Failed to send performance metric:", e)
      }
    }
  }
}

export const errorTracker = ErrorTracker.getInstance()

// React Error Boundary
export function withErrorBoundary<T extends Record<string, any>>(Component: React.ComponentType<T>) {
  return function ErrorBoundaryWrapper(props: T) {
    return (
      <ErrorBoundary>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    errorTracker.captureError(error, {
      action: "react_error_boundary",
      metadata: errorInfo,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">We've been notified and are working on a fix.</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
