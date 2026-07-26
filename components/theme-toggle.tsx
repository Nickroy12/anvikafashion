"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export const ThemeToggle: React.FC = () => {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState<boolean>(false)

  // Avoid hydration mismatch by only rendering the switch after mount
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-14 h-7 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
  }

  const isDark = resolvedTheme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 ${
        isDark ? "bg-zinc-800" : "bg-zinc-200"
      }`}
      role="switch"
      aria-checked={isDark}
    >
      <span className="sr-only">Toggle theme</span>
      
      {/* Sliding Thumb */}
      <span
        className={`inline-flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isDark ? "translate-x-[30px]" : "translate-x-[4px]"
        }`}
      >
        {isDark ? (
          <Moon className="h-3 w-3 text-zinc-900 transition-opacity duration-300" />
        ) : (
          <Sun className="h-3 w-3 text-amber-500 transition-opacity duration-300" />
        )}
      </span>
    </button>
  )
}
