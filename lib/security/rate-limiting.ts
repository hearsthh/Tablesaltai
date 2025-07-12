interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests per window
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
}

class RateLimiter {
  private requests = new Map<string, number[]>()

  isAllowed(identifier: string, config: RateLimitConfig): boolean {
    const now = Date.now()
    const windowStart = now - config.windowMs

    // Get existing requests for this identifier
    const userRequests = this.requests.get(identifier) || []

    // Filter out requests outside the current window
    const recentRequests = userRequests.filter((timestamp) => timestamp > windowStart)

    // Check if under limit
    if (recentRequests.length >= config.maxRequests) {
      return false
    }

    // Add current request
    recentRequests.push(now)
    this.requests.set(identifier, recentRequests)

    // Cleanup old entries periodically
    if (Math.random() < 0.01) {
      // 1% chance
      this.cleanup()
    }

    return true
  }

  private cleanup() {
    const now = Date.now()
    const oneHourAgo = now - 60 * 60 * 1000

    for (const [identifier, requests] of this.requests.entries()) {
      const recentRequests = requests.filter((timestamp) => timestamp > oneHourAgo)
      if (recentRequests.length === 0) {
        this.requests.delete(identifier)
      } else {
        this.requests.set(identifier, recentRequests)
      }
    }
  }

  getRemainingRequests(identifier: string, config: RateLimitConfig): number {
    const now = Date.now()
    const windowStart = now - config.windowMs
    const userRequests = this.requests.get(identifier) || []
    const recentRequests = userRequests.filter((timestamp) => timestamp > windowStart)
    return Math.max(0, config.maxRequests - recentRequests.length)
  }

  getResetTime(identifier: string, config: RateLimitConfig): number {
    const userRequests = this.requests.get(identifier) || []
    if (userRequests.length === 0) return 0

    const oldestRequest = Math.min(...userRequests)
    return oldestRequest + config.windowMs
  }
}

export const rateLimiter = new RateLimiter()

// Rate limit configurations
export const RATE_LIMITS = {
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
  },
  ai: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 50,
  },
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
  },
  upload: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 20,
  },
} as const
