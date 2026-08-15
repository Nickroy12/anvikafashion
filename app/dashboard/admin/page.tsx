import { getUserSession } from "@/lib/core/sessions"
import Link from "next/link"
import {
  Users,
  ShoppingBag,
  TrendingUp,
  Package,
  Settings,
  Bell,
  BarChart3,
  Shield,
  Plus,
} from "lucide-react"

// ── Types ──────────────────────────────────────────────────────────────────
interface AdminStats {
  totalUsers: number
  totalOrders: number
  totalProducts: number
  totalRevenue: number
  recentActivity: {
    user: string
    action: string
    time: string | null
    amount: string | null
  }[]
}

// ── Helpers ────────────────────────────────────────────────────────────────
function formatRevenue(amount: number): string {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`
  return `₹${amount}`
}

function formatCount(n: number): string {
  return n.toLocaleString("en-IN")
}

function timeAgo(isoString: string | null): string {
  if (!isoString) return "—"
  const diff = Date.now() - new Date(isoString).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "Just now"
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hr ago`
  return `${Math.floor(hrs / 24)} days ago`
}

// ── Data fetcher ───────────────────────────────────────────────────────────
async function getAdminStats(): Promise<AdminStats | null> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000"
  try {
    const res = await fetch(`${backendUrl}/api/admin/stats`, {
      cache: "no-store", // always fresh data
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function AdminDashboardPage() {
  const [adminName, serverStats] = await Promise.all([
    getUserSession().then((s) => s?.name ?? "Admin"),
    getAdminStats(),
  ])

  const stats = [
    {
      label: "Total Users",
      value: serverStats ? formatCount(serverStats.totalUsers) : "—",
      change: "live",
      icon: Users,
    },
    {
      label: "Total Orders",
      value: serverStats ? formatCount(serverStats.totalOrders) : "—",
      change: "live",
      icon: ShoppingBag,
    },
    {
      label: "Revenue",
      value: serverStats ? formatRevenue(serverStats.totalRevenue) : "—",
      change: "live",
      icon: TrendingUp,
    },
    {
      label: "Products",
      value: serverStats ? formatCount(serverStats.totalProducts) : "—",
      change: "live",
      icon: Package,
    },
  ]

  const recentActivity = serverStats?.recentActivity.map((item) => ({
    ...item,
    time: timeAgo(item.time),
  })) ?? []

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <div className="border-b border-border/40 bg-background sticky top-16 z-10">
        <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-foreground/60" />
              <h1 className="text-lg font-semibold tracking-tight">Admin Dashboard</h1>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              Welcome back,{" "}
              <span className="font-medium text-foreground">{adminName}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/admin/products/add"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Product
            </Link>
            <button
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-foreground/70" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-foreground rounded-full" />
            </button>
            <button
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4 text-foreground/70" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Stats */}
        <section>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
            Overview
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl bg-white dark:bg-zinc-900 border border-border/60 p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1 tracking-tight">{stat.value}</p>
                    <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live
                    </span>
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                    <stat.icon className="w-4 h-4 text-foreground/70" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Charts + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bar chart */}
          <div className="lg:col-span-2 rounded-xl bg-white dark:bg-zinc-900 border border-border/60 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-foreground/60" />
                <h3 className="text-sm font-semibold">Revenue Overview</h3>
              </div>
              <select className="text-xs border border-border/60 rounded-lg px-2 py-1 bg-zinc-50 dark:bg-zinc-800 text-muted-foreground">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
              </select>
            </div>
            <div className="flex items-end gap-2 h-36">
              {[60, 80, 45, 90, 70, 85, 95].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-500 transition-colors"
                    style={{ height: `${h}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[11px] text-muted-foreground px-1">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl bg-white dark:bg-zinc-900 border border-border/60 p-6">
            <h3 className="text-sm font-semibold mb-5">Recent Activity</h3>
            <ul className="space-y-4">
              {recentActivity.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-foreground/70 text-xs font-semibold flex-shrink-0 mt-0.5 border border-border/40">
                    {item.user.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{item.user}</p>
                    <p className="text-xs text-muted-foreground">{item.action}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {item.amount && (
                      <p className="text-xs font-semibold text-foreground">{item.amount}</p>
                    )}
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quick Actions */}
        <section>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
            Quick Actions
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <Link
              href="/dashboard/admin/products"
              id="manage-products-link"
              className="group rounded-xl bg-white dark:bg-zinc-900 border border-border/60 p-5 hover:border-foreground/30 hover:shadow-sm transition-all flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 flex items-center justify-center flex-shrink-0 transition-colors">
                <Package className="w-5 h-5 text-foreground/70" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Manage Products</p>
                <p className="text-xs text-muted-foreground mt-0.5">View, edit &amp; delete all products</p>
              </div>
            </Link>
            <Link
              href="/dashboard/admin/products/add"
              id="quick-add-product-link"
              className="group rounded-xl bg-white dark:bg-zinc-900 border border-border/60 p-5 hover:border-foreground/30 hover:shadow-sm transition-all flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 flex items-center justify-center flex-shrink-0 transition-colors">
                <Plus className="w-5 h-5 text-foreground/70" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Add Product</p>
                <p className="text-xs text-muted-foreground mt-0.5">Create a new product listing</p>
              </div>
            </Link>
          </div>
        </section>

        {/* Role info banner */}
        <div className="rounded-xl border border-border/60 bg-white dark:bg-zinc-900 p-5 flex items-center gap-4">
          <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4 text-foreground/70" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Admin access enabled</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage users, orders, and products. Promote a user via{" "}
              <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-[11px]">
                authClient.admin.setRole()
              </code>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
