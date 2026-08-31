"use client"

import { useState, useEffect, useRef } from "react"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import {
  User,
  MapPin,
  Mail,
  Phone,
  Camera,
  Check,
  Loader2,
  ArrowLeft,
  Shield,
  Edit3,
  Save,
  X,
} from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

type ToastType = "success" | "error"

interface Toast {
  id: number
  type: ToastType
  message: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { data: session, isPending, refetch } = authClient.useSession()
  const user = session?.user as any

  const [name, setName] = useState("")
  const [location, setLocation] = useState("")
  const [editingName, setEditingName] = useState(false)
  const [editingLocation, setEditingLocation] = useState(false)
  const [saving, setSaving] = useState<"name" | "location" | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const toastIdRef = useRef(0)

  useEffect(() => {
    if (user) {
      setName(user.name || "")
      setLocation(user.location || "")
    }
  }, [user])

  useEffect(() => {
    if (!isPending && !user) {
      router.push("/auth")
    }
  }, [isPending, user, router])

  const addToast = (type: ToastType, message: string) => {
    const id = ++toastIdRef.current
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500)
  }

  const saveName = async () => {
    if (!name.trim() || name === user?.name) {
      setEditingName(false)
      return
    }
    setSaving("name")
    const { error } = await authClient.updateUser({ name: name.trim() })
    setSaving(null)
    if (error) {
      addToast("error", "Failed to update name.")
      setName(user?.name || "")
    } else {
      addToast("success", "Name updated successfully!")
      refetch?.()
    }
    setEditingName(false)
  }

  const saveLocation = async () => {
    if (location === (user?.location || "")) {
      setEditingLocation(false)
      return
    }
    setSaving("location")
    const { error } = await authClient.updateUser({ location: location.trim() } as any)
    setSaving(null)
    if (error) {
      addToast("error", "Failed to update location.")
      setLocation(user?.location || "")
    } else {
      addToast("success", "Location saved!")
      refetch?.()
    }
    setEditingLocation(false)
  }

  const getInitial = (n?: string | null, e?: string | null) => {
    if (n) return n.charAt(0).toUpperCase()
    if (e) return e.charAt(0).toUpperCase()
    return "U"
  }

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!user) return null

  const userRole = (user as any)?.role as string | undefined

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Toast notifications */}
      <div className="fixed top-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 60, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.92 }}
              transition={{ duration: 0.22 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border text-sm font-medium pointer-events-auto ${
                t.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-200"
                  : "bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200"
              }`}
            >
              {t.type === "success" ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Header */}
      <div className="border-b border-border/40 bg-background sticky top-16 z-10">
        <div className="container mx-auto px-4 md:px-8 py-4 flex items-center gap-4">
          <Link
            href="/dashboard/customer"
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <p className="text-xs text-muted-foreground">Account</p>
            <h1 className="text-lg font-semibold tracking-tight">My Profile</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-8 max-w-2xl space-y-5">
        {/* Avatar card */}
        <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-border/60 overflow-hidden">
          {/* Banner */}
          <div className="h-24 bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800" />

          <div className="px-6 pb-6">
            <div className="-mt-10 mb-4 flex items-end justify-between">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-500 to-zinc-700 flex items-center justify-center text-white font-bold text-2xl shadow-lg ring-4 ring-background">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name ?? "User"}
                      className="w-full h-full rounded-2xl object-cover"
                    />
                  ) : (
                    <span>{getInitial(user.name, user.email)}</span>
                  )}
                </div>
                <button
                  className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-background border border-border/60 flex items-center justify-center shadow-sm hover:bg-muted transition-colors"
                  title="Change photo (coming soon)"
                >
                  <Camera className="w-3.5 h-3.5 text-foreground/70" />
                </button>
              </div>

              {userRole && (
                <span
                  className={`text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${
                    userRole === "admin"
                      ? "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                  }`}
                >
                  {userRole}
                </span>
              )}
            </div>

            <div>
              <p className="text-lg font-semibold">{user.name || "User"}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Profile fields */}
        <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-border/60 divide-y divide-border/40 overflow-hidden">
          <div className="px-5 py-3">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              Personal Information
            </p>
          </div>

          {/* Name */}
          <div className="px-5 py-4 flex items-center gap-4">
            <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-foreground/60" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-1">Full Name</p>
              {editingName ? (
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveName()
                    if (e.key === "Escape") {
                      setName(user?.name || "")
                      setEditingName(false)
                    }
                  }}
                  className="w-full bg-transparent text-sm font-medium outline-none border-b-2 border-primary py-0.5 focus:border-primary"
                  placeholder="Your full name"
                />
              ) : (
                <p className="text-sm font-medium truncate">{user.name || "—"}</p>
              )}
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {editingName ? (
                <>
                  <button
                    onClick={() => {
                      setName(user?.name || "")
                      setEditingName(false)
                    }}
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={saveName}
                    disabled={saving === "name"}
                    className="p-1.5 rounded-lg bg-foreground text-background hover:opacity-80 transition-opacity disabled:opacity-60"
                  >
                    {saving === "name" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditingName(true)}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Email (read-only) */}
          <div className="px-5 py-4 flex items-center gap-4">
            <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
              <Mail className="w-4 h-4 text-foreground/60" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-1">Email Address</p>
              <p className="text-sm font-medium truncate">{user.email}</p>
            </div>
            <span className="flex-shrink-0 flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <Check className="w-3 h-3" />
              Verified
            </span>
          </div>

          {/* Phone (read-only) */}
          {(user as any)?.phoneNumber && (
            <div className="px-5 py-4 flex items-center gap-4">
              <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                <Phone className="w-4 h-4 text-foreground/60" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1">Phone Number</p>
                <p className="text-sm font-medium truncate">{(user as any).phoneNumber}</p>
              </div>
              {(user as any)?.phoneNumberVerified && (
                <span className="flex-shrink-0 flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  <Check className="w-3 h-3" />
                  Verified
                </span>
              )}
            </div>
          )}
        </div>

        {/* Location / Address */}
        <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-border/60 divide-y divide-border/40 overflow-hidden">
          <div className="px-5 py-3">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              Delivery Location
            </p>
          </div>

          <div className="px-5 py-4">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin className="w-4 h-4 text-foreground/60" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs text-muted-foreground">Delivery Address / Location</p>
                  {!editingLocation && (
                    <button
                      onClick={() => setEditingLocation(true)}
                      className="flex items-center gap-1.5 text-xs font-medium text-foreground/60 hover:text-foreground transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      {location ? "Edit" : "Add"}
                    </button>
                  )}
                </div>

                {editingLocation ? (
                  <>
                    <textarea
                      autoFocus
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") {
                          setLocation(user?.location || "")
                          setEditingLocation(false)
                        }
                      }}
                      rows={3}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
                      placeholder="e.g. 123 Elm Street, Dhaka, Bangladesh"
                    />
                    <div className="flex items-center justify-end gap-2 mt-2.5">
                      <button
                        onClick={() => {
                          setLocation(user?.location || "")
                          setEditingLocation(false)
                        }}
                        className="px-3 py-1.5 rounded-lg border border-border/60 text-xs font-medium text-foreground/70 hover:bg-muted transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveLocation}
                        disabled={saving === "location"}
                        className="px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-semibold hover:opacity-80 transition-opacity disabled:opacity-60 flex items-center gap-1.5"
                      >
                        {saving === "location" ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Save className="w-3.5 h-3.5" />
                        )}
                        Save Location
                      </button>
                    </div>
                  </>
                ) : location ? (
                  <p className="text-sm font-medium leading-relaxed">{location}</p>
                ) : (
                  <div
                    className="border-2 border-dashed border-border/60 rounded-xl p-4 text-center cursor-pointer hover:border-border hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                    onClick={() => setEditingLocation(true)}
                  >
                    <MapPin className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground font-medium">No address saved yet</p>
                    <p className="text-xs text-muted-foreground/70 mt-0.5">
                      Tap to add your delivery address
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Account security */}
        <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-border/60 divide-y divide-border/40 overflow-hidden">
          <div className="px-5 py-3">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              Account Security
            </p>
          </div>
          <div className="px-5 py-4 flex items-center gap-4">
            <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-foreground/60" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Password</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {(user as any)?.emailVerified ? "Password-based account" : "Google-linked account"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
