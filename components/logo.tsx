import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "full" | "icon" | "text"
}

export function Logo({ className, size = "md", variant = "full" }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6 text-sm",
    md: "h-8 w-8 text-base",
    lg: "h-10 w-10 text-lg",
    xl: "h-12 w-12 text-xl",
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  }

  if (variant === "icon") {
    return (
      <div className={cn("bg-slate-900 rounded-md flex items-center justify-center", sizeClasses[size], className)}>
        <span className="text-white font-bold">T</span>
      </div>
    )
  }

  if (variant === "text") {
    return <span className={cn("font-bold text-slate-900", textSizeClasses[size], className)}>TableSalt AI</span>
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className={cn("bg-slate-900 rounded-md flex items-center justify-center", sizeClasses[size])}>
        <span className="text-white font-bold">T</span>
      </div>
      <span className={cn("font-bold text-slate-900", textSizeClasses[size])}>TableSalt AI</span>
    </div>
  )
}
