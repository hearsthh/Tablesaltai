import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const appColors = {
  primary: {
    bg: "bg-slate-900",
    hover: "hover:bg-slate-800",
    text: "text-slate-900",
    border: "border-slate-900",
  },
  accent: {
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
    },
    green: {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
    },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
    },
    pink: {
      bg: "bg-pink-50",
      text: "text-pink-700",
      border: "border-pink-200",
    },
    orange: {
      bg: "bg-orange-50",
      text: "text-orange-700",
      border: "border-orange-200",
    },
  },
  neutral: {
    bg: "bg-white",
    card: "bg-white",
    border: "border-slate-200",
    muted: "bg-slate-50",
    text: {
      primary: "text-slate-900",
      secondary: "text-slate-600",
      muted: "text-slate-500",
    },
  },
}

export function useResponsiveModal() {
  return {
    className: "max-h-[85vh] overflow-y-auto p-6 max-w-[95vw] w-full md:w-auto",
  }
}

export function ensureNoHorizontalScroll() {
  if (typeof document !== "undefined") {
    document.body.style.overflowX = "hidden"
    document.documentElement.style.overflowX = "hidden"
  }
}
