"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion, AnimatePresence } from "framer-motion"

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "New Arrivals", href: "/new-arrivals" },
  { name: "Dresses", href: "/dresses" },
  { name: "Accessories", href: "/accessories" },
  { name: "Autumn Sales", href: "/autumn-sales" },
]

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)

  return (
    <>
      <header className="sticky top-0 z-[110] w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80 z-50">
            <span className="text-2xl font-bold tracking-tighter">
              Anbika<span className="text-primary animate-pulse">.</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-muted-foreground transition-colors hover:text-foreground">
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action Button & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-4 z-50">
            <ThemeToggle />

            {/* Desktop Button */}
            <div className="inline-flex relative group overflow-hidden rounded-full p-[2px] transition-shadow duration-500 hover:shadow-[0_0_20px_rgba(128,128,128,0.5)]">
              {/* Comet animation border */}
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_75%,#9ca3af_100%)] opacity-80 group-hover:opacity-100 transition-opacity duration-1000 delay-75" />
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] [animation-direction:reverse] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_75%,#9ca3af_100%)] opacity-80 group-hover:opacity-100 transition-opacity duration-500 delay-200" />

              <Button
                className="relative h-10 px-8 rounded-full bg-gradient-to-b from-gray-500 to-zinc-700 text-white hover:from-gray-400 hover:to-white-100 hover:text-black z-10 border-0 transition-all duration-500 flex items-center gap-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]"
                variant="outline"
              >
                <Sparkles className="w-4 h-4 text-emerald-100" />
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-foreground focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-y-0 right-0 z-[100] w-[80vw] max-w-sm border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full gap-8 mt-16 text-lg font-medium">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                  >
                    <Link href={link.href} className="hover:text-primary transition-colors block" onClick={() => setIsMobileMenuOpen(false)}>
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}