"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, Sparkles, ChevronDown, LogOut, User as UserIcon, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion, AnimatePresence } from "framer-motion"
import { authClient } from "@/lib/auth-client"

type NavLink = {
  name: string
  href: string
  megaMenu?: {
    categories: { title: string; items: { name: string; href: string }[] }[]
    featuredImage?: { src: string; alt: string; title: string; link: string }
  }
}

const NAV_LINKS: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "New Arrivals", href: "/new-arrivals" },
  { 
    name: "Dresses", 
    href: "/dresses",
    megaMenu: {
      categories: [
        {
          title: "Shop by Style",
          items: [
            { name: "Maxi Dresses", href: "/dresses/maxi" },
            { name: "Midi Dresses", href: "/dresses/midi" },
            { name: "Mini Dresses", href: "/dresses/mini" },
            { name: "Wrap Dresses", href: "/dresses/wrap" }
          ]
        },
        {
          title: "Shop by Occasion",
          items: [
            { name: "Casual", href: "/dresses/casual" },
            { name: "Party", href: "/dresses/party" },
            { name: "Wedding Guest", href: "/dresses/wedding-guest" },
            { name: "Work", href: "/dresses/work" }
          ]
        }
      ],
      featuredImage: {
        src: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop",
        alt: "Summer Collection",
        title: "Summer Collection '26",
        link: "/collections/summer"
      }
    }
  },
  { name: "Accessories", href: "/accessories" },
  { name: "Autumn Sales", href: "/autumn-sales" },
]

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false)
  const pathname = usePathname()
  const router = useRouter()
  const userMenuRef = useRef<HTMLDivElement>(null)

  const { data: session, isPending } = authClient.useSession()
  const user = session?.user

  // Close user dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [])

  const handleSignOut = async () => {
    await authClient.signOut()
    setIsUserMenuOpen(false)
    router.push("/")
    router.refresh()
  }

  const getInitial = (name?: string | null, email?: string | null) => {
    if (name) return name.charAt(0).toUpperCase()
    if (email) return email.charAt(0).toUpperCase()
    return "U"
  }

  const userRole = (user as any)?.role as string | undefined
  const dashboardHref = userRole === "admin" ? "/dashboard/admin" : "/dashboard/customer"

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
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium h-full">
            {NAV_LINKS.map((link) => (
              <div key={link.href} className="group relative h-full flex items-center">
                <Link 
                  href={link.href} 
                  className={`transition-colors py-2 flex items-center gap-1 ${
                    pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.name}
                  {link.megaMenu && <ChevronDown className={`w-4 h-4 transition-transform duration-300 group-hover:rotate-180 ${pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href)) ? "opacity-100" : "opacity-70"}`} />}
                </Link>
                {link.megaMenu && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[600px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out z-50 transform origin-top -translate-y-2 group-hover:translate-y-0">
                    <div className="shadow-2xl rounded-xl overflow-hidden bg-white dark:bg-zinc-950 border border-border/40 grid grid-cols-3 p-6 gap-6">
                      <div className="col-span-2 grid grid-cols-2 gap-6">
                        {link.megaMenu.categories.map((category) => (
                          <div key={category.title}>
                            <h4 className="font-semibold mb-4 text-foreground">{category.title}</h4>
                            <ul className="space-y-2">
                              {category.items.map((item) => (
                                <li key={item.name}>
                                  <Link href={item.href} className="text-muted-foreground hover:text-foreground hover:underline transition-colors block text-sm">
                                    {item.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                      {link.megaMenu.featuredImage && (
                        <div className="col-span-1 relative rounded-lg overflow-hidden group/img h-full min-h-[200px]">
                          <img 
                            src={link.megaMenu.featuredImage.src} 
                            alt={link.megaMenu.featuredImage.alt}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity hover:bg-black/50">
                            <Link href={link.megaMenu.featuredImage.link} className="text-white font-semibold text-center px-4 hover:underline">
                              {link.megaMenu.featuredImage.title}
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Action Button & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-4 z-50">
            <ThemeToggle />

            {/* Session-aware auth area */}
            {!isPending && (
              user ? (
                /* User Avatar Dropdown */
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 group focus:outline-none"
                    aria-label="User menu"
                  >
                    <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-gray-500 to-zinc-700 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-transparent group-hover:ring-primary/40 transition-all duration-300">
                      {user.image ? (
                        <img src={user.image} alt={user.name ?? "User"} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span>{getInitial(user.name, user.email)}</span>
                      )}
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-background" />
                    </div>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground hidden sm:block transition-transform duration-300 ${isUserMenuOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="absolute right-0 top-full mt-3 w-60 rounded-2xl border border-border/50 bg-background/95 backdrop-blur-md shadow-2xl overflow-hidden z-[120]"
                      >
                        {/* User info header */}
                        <div className="px-4 py-3 border-b border-border/40">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-500 to-zinc-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                              {user.image ? (
                                <img src={user.image} alt={user.name ?? "User"} className="w-full h-full rounded-full object-cover" />
                              ) : (
                                <span>{getInitial(user.name, user.email)}</span>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-foreground truncate">{user.name || "User"}</p>
                                {userRole && (
                                  <span className={`flex-shrink-0 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full ${
                                    userRole === "admin"
                                      ? "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
                                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                  }`}>
                                    {userRole}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                            </div>
                          </div>
                        </div>

                        {/* Menu items */}
                        <div className="p-2">
                          <Link
                            href={dashboardHref}
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground/80 hover:text-foreground hover:bg-muted transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                          </Link>
                          <Link
                            href="/profile"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground/80 hover:text-foreground hover:bg-muted transition-colors"
                          >
                            <UserIcon className="w-4 h-4" />
                            My Profile
                          </Link>
                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:text-red-600 hover:bg-red-500/10 transition-colors mt-0.5"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* Get Started button when logged out */
                <div className="inline-flex relative group overflow-hidden rounded-full p-[2px] transition-shadow duration-500 hover:shadow-[0_0_20px_rgba(128,128,128,0.5)]">
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_75%,#9ca3af_100%)] opacity-80 group-hover:opacity-100 transition-opacity duration-1000 delay-75" />
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] [animation-direction:reverse] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_75%,#9ca3af_100%)] opacity-80 group-hover:opacity-100 transition-opacity duration-500 delay-200" />
                  <Link href="/auth">
                    <Button
                      className="relative h-10 px-8 rounded-full bg-gradient-to-b from-gray-500 to-zinc-700 text-white hover:from-gray-400 hover:to-white-100 hover:text-black z-10 border-0 transition-all duration-500 flex items-center gap-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]"
                      variant="outline"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-100" />
                      Get Started
                    </Button>
                  </Link>
                </div>
              )
            )}

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
              <div className="flex flex-col h-full gap-8 mt-16 text-lg font-medium overflow-y-auto pb-20 no-scrollbar">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                    className="flex flex-col"
                  >
                    <Link 
                      href={link.href} 
                      className={`transition-colors block ${
                        pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
                          ? "text-primary font-bold"
                          : "hover:text-primary"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                    {link.megaMenu && (
                      <div className="mt-5 flex flex-col gap-6 pl-4 border-l-2 border-zinc-100 dark:border-zinc-800">
                        {link.megaMenu.categories.map((category) => (
                          <div key={category.title} className="flex flex-col gap-3">
                            <span className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">{category.title}</span>
                            <div className="flex flex-col gap-3 pl-2">
                              {category.items.map((item) => (
                                <Link 
                                  key={item.name} 
                                  href={item.href} 
                                  className="text-base text-foreground/80 hover:text-primary transition-colors" 
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  {item.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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