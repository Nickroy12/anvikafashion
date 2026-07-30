import React from "react"
import { Auth } from "@/components/shared/auth"

export default function AuthPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-950/50">
      <Auth />
    </div>
  )
}
