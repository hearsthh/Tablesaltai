import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Analyzing Vercel deployment environment...")

    // Get all environment variables
    const allEnvVars = Object.keys(process.env)
    console.log(`📊 Total environment variables: ${allEnvVars.length}`)

    // Categorize environment variables
    const categorizedVars = {
      supabase: allEnvVars.filter((key) => key.toLowerCase().includes("supabase")),
      vercel: allEnvVars.filter((key) => key.toLowerCase().includes("vercel")),
      next: allEnvVars.filter((key) => key.startsWith("NEXT_")),
      other: allEnvVars.filter(
        (key) =>
          !key.toLowerCase().includes("supabase") && !key.toLowerCase().includes("vercel") && !key.startsWith("NEXT_"),
      ),
    }

    // Check deployment environment
    const isProduction = process.env.NODE_ENV === "production"
    const vercelEnv = process.env.VERCEL_ENV
    const vercelRegion = process.env.VERCEL_REGION
    const nodeVersion = process.version
    const platform = process.platform

    // Check for specific Supabase variables
    const requiredSupabaseVars = [
      "NEXT_PUBLIC_SUPABASE_URL",
      "SUPABASE_SERVICE_ROLE_KEY",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    ]

    const missingSupabaseVars = requiredSupabaseVars.filter((varName) => !process.env[varName])
    const presentSupabaseVars = requiredSupabaseVars.filter((varName) => process.env[varName])

    // Check if we're in Vercel environment
    const isVercelDeployment = !!process.env.VERCEL
    const vercelUrl = process.env.VERCEL_URL
    const vercelGitCommitSha = process.env.VERCEL_GIT_COMMIT_SHA

    // Sample some environment variable values (safely)
    const sampleEnvValues = {}
    for (const key of allEnvVars.slice(0, 10)) {
      const value = process.env[key]
      if (value && value.length > 10) {
        sampleEnvValues[key] = value.substring(0, 20) + "..."
      } else {
        sampleEnvValues[key] = value || "undefined"
      }
    }

    console.log("✅ Environment analysis complete")

    return NextResponse.json({
      success: true,
      totalEnvVars: allEnvVars.length,
      supabaseVars: categorizedVars.supabase.length,
      vercelVars: categorizedVars.vercel.length,
      nextVars: categorizedVars.next.length,
      otherVars: categorizedVars.other.length,
      categorizedVars,
      deployment: {
        isProduction,
        isVercelDeployment,
        vercelEnv,
        vercelRegion,
        vercelUrl,
        vercelGitCommitSha,
        nodeVersion,
        platform,
      },
      supabaseStatus: {
        required: requiredSupabaseVars.length,
        present: presentSupabaseVars.length,
        missing: missingSupabaseVars.length,
        missingVars: missingSupabaseVars,
        presentVars: presentSupabaseVars,
      },
      sampleEnvValues,
      recommendations: generateEnvironmentRecommendations(
        missingSupabaseVars,
        isVercelDeployment,
        categorizedVars.supabase.length,
      ),
    })
  } catch (error) {
    console.error("💥 Environment analysis error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      totalEnvVars: Object.keys(process.env).length,
      message: "Could not complete environment analysis",
    })
  }
}

function generateEnvironmentRecommendations(missingVars: string[], isVercel: boolean, supabaseVarCount: number) {
  const recommendations = []

  if (missingVars.length === 0) {
    recommendations.push({
      type: "success",
      message: "All required Supabase environment variables are present",
      action: "Your environment is properly configured",
    })
  } else {
    recommendations.push({
      type: "error",
      message: `${missingVars.length} required Supabase variables are missing`,
      action: "Add the missing environment variables to your deployment",
    })
  }

  if (!isVercel) {
    recommendations.push({
      type: "warning",
      message: "Not running in Vercel environment",
      action: "This might be a local development environment",
    })
  }

  if (supabaseVarCount === 0) {
    recommendations.push({
      type: "error",
      message: "No Supabase environment variables found",
      action: "The Supabase integration sync failed - set up manually",
    })
  } else if (supabaseVarCount < 3) {
    recommendations.push({
      type: "warning",
      message: "Partial Supabase configuration detected",
      action: "Some Supabase variables are missing",
    })
  }

  return recommendations
}
