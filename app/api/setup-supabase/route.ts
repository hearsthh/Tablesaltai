import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    instructions: {
      step1: {
        title: "Create .env.local file",
        description: "Create a .env.local file in your project root directory",
        location: "Project root (same level as package.json)",
        filename: ".env.local",
      },
      step2: {
        title: "Get Supabase credentials",
        description: "Get your Supabase project credentials from the dashboard",
        url: "https://supabase.com/dashboard",
        credentials: [
          {
            name: "Project URL",
            envVar: "NEXT_PUBLIC_SUPABASE_URL",
            location: "Settings > API > Project URL",
            example: "https://your-project-id.supabase.co",
          },
          {
            name: "Anon Key",
            envVar: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
            location: "Settings > API > Project API keys > anon public",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          },
          {
            name: "Service Role Key",
            envVar: "SUPABASE_SERVICE_ROLE_KEY",
            location: "Settings > API > Project API keys > service_role",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            warning: "Keep this secret! Only use on server-side",
          },
          {
            name: "JWT Secret",
            envVar: "SUPABASE_JWT_SECRET",
            location: "Settings > API > JWT Settings > JWT Secret",
            example: "your-super-secret-jwt-token-with-at-least-32-characters-long",
          },
        ],
      },
      step3: {
        title: "Add environment variables",
        description: "Add these lines to your .env.local file",
        template: `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
SUPABASE_JWT_SECRET=your-jwt-secret-here`,
      },
      step4: {
        title: "Restart development server",
        description: "Stop and restart your development server to load the new environment variables",
        commands: ["Ctrl+C (to stop)", "npm run dev (to restart)", "or yarn dev / pnpm dev"],
      },
      step5: {
        title: "Verify setup",
        description: "Run the debug console again to verify everything is working",
        url: "/debug-supabase",
      },
    },
    quickSetup: {
      title: "Quick Setup Guide",
      steps: [
        "1. Go to https://supabase.com/dashboard",
        "2. Select your project (or create one)",
        "3. Go to Settings > API",
        "4. Copy Project URL and API keys",
        "5. Create .env.local file in project root",
        "6. Add the environment variables",
        "7. Restart your development server",
        "8. Test at /debug-supabase",
      ],
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()

    if (action === "create-env-template") {
      const template = `# Supabase Configuration
# Get these values from: https://supabase.com/dashboard > Your Project > Settings > API

# Project URL (Settings > API > Project URL)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

# Anon Key (Settings > API > Project API keys > anon public)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Service Role Key (Settings > API > Project API keys > service_role)
# ⚠️ KEEP THIS SECRET - Server-side only!
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# JWT Secret (Settings > API > JWT Settings > JWT Secret)
SUPABASE_JWT_SECRET=your-super-secret-jwt-token-with-at-least-32-characters-long

# Optional: Additional Supabase settings
# SUPABASE_URL=https://your-project-id.supabase.co
# SUPABASE_ANON_KEY=your-anon-key-here`

      return NextResponse.json({
        success: true,
        template,
        filename: ".env.local",
        instructions: [
          "1. Create a file named '.env.local' in your project root",
          "2. Copy the template above into the file",
          "3. Replace the placeholder values with your actual Supabase credentials",
          "4. Save the file",
          "5. Restart your development server",
        ],
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: "Setup failed" }, { status: 500 })
  }
}
