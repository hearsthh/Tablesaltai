import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protected routes
  const protectedPaths = [
    "/dashboard",
    "/profile",
    "/customers",
    "/marketing",
    "/menu-intelligence",
    "/restaurant-data",
    "/review-data",
    "/marketing-system",
  ]

  // Admin routes
  const adminPaths = ["/admin", "/dev-dashboard", "/debug-", "/test-", "/setup-"]

  const isProtectedPath = protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path))
  const isAdminPath = adminPaths.some((path) => req.nextUrl.pathname.startsWith(path))

  // Redirect to login if accessing protected route without session
  if (isProtectedPath && !session) {
    const redirectUrl = new URL("/auth/login", req.url)
    redirectUrl.searchParams.set("redirectTo", req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect to dashboard if accessing auth pages with session
  if (session && (req.nextUrl.pathname.startsWith("/auth/") || req.nextUrl.pathname === "/")) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // Block admin routes in production
  if (isAdminPath && process.env.NODE_ENV === "production") {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // Rate limiting for API routes
  if (req.nextUrl.pathname.startsWith("/api/")) {
    const ip = req.ip ?? "127.0.0.1"
    const rateLimitKey = `rate_limit:${ip}:${req.nextUrl.pathname}`

    // In production, you'd use Redis or similar for rate limiting
    // For now, we'll add headers for monitoring
    res.headers.set("X-RateLimit-IP", ip)
    res.headers.set("X-RateLimit-Path", req.nextUrl.pathname)
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
