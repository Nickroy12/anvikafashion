import { getUserSession } from "@/lib/core/sessions"
import { serverFetch } from "@/lib/core/api"
import {
  ShoppingBag,
  Heart,
  Package,
  Star,
  MapPin,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"

interface OrderItem {
  name?: string
  title?: string
  price?: number
  quantity?: number
}

interface Order {
  _id: string
  transactionId?: string
  items?: OrderItem[]
  price?: number
  total?: number
  totalPrice?: number
  status?: string
  paymentStatus?: string
  createdAt?: string
  date?: string
}

const statusStyles: Record<string, string> = {
  Pending: "text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/40",
  Processing: "text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/40",
  Shipped: "text-foreground/70 bg-zinc-100 dark:bg-zinc-800",
  Delivered: "text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/40",
  Cancelled: "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/40",
}

const quickLinks = [
  { label: "New Arrivals", href: "/new-arrivals", icon: ShoppingBag },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
  { label: "Track Order", href: "/orders", icon: Package },
  { label: "My Reviews", href: "/reviews", icon: Star },
]

function formatDate(dateStr?: string): string {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function formatPrice(order: Order): string {
  const amount = order.price ?? order.total ?? order.totalPrice ?? 0
  return `₹${Number(amount).toLocaleString("en-IN")}`
}

function getOrderLabel(order: Order): string {
  if (order.items && order.items.length > 0) {
    const firstName = order.items[0].name || order.items[0].title || "Item"
    if (order.items.length > 1) {
      return `${firstName} + ${order.items.length - 1} more`
    }
    return firstName
  }
  return "Order"
}

export default async function CustomerDashboardPage() {
  const user = await getUserSession()
  const name = user?.name || "Customer"
  const firstName = name.split(" ")[0]
  const email = (user as any)?.email

  // Fetch orders for the logged-in user
  let orders: Order[] = []
  if (email) {
    const data = await serverFetch<Order[] | { orders?: Order[] }>(
      `/api/orders/email/${encodeURIComponent(email)}`
    )
    if (Array.isArray(data)) {
      orders = data
    } else if (data && Array.isArray((data as any).orders)) {
      orders = (data as any).orders
    }
  }

  // Show the most recent 5 orders
  const recentOrders = orders
    .sort((a, b) => {
      const da = new Date(a.createdAt || a.date || 0).getTime()
      const db = new Date(b.createdAt || b.date || 0).getTime()
      return db - da
    })
    .slice(0, 5)

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <div className="border-b border-border/40 bg-background sticky top-16 z-10">
        <div className="container mx-auto px-4 md:px-8 py-5">
          <p className="text-xs text-muted-foreground mb-0.5">Welcome back</p>
          <h1 className="text-xl font-semibold tracking-tight">{firstName}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Quick Actions */}
        <section>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
            Quick Actions
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-xl bg-white dark:bg-zinc-900 border border-border/60 p-4 hover:border-border transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3">
                  <link.icon className="w-4 h-4 text-foreground/70" />
                </div>
                <p className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                  {link.label}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Orders */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              Recent Orders
            </p>
            <Link
              href="/orders"
              className="text-xs text-foreground/60 hover:text-foreground transition-colors flex items-center gap-1"
            >
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="rounded-xl bg-white dark:bg-zinc-900 border border-border/60 overflow-hidden divide-y divide-border/40">
            {recentOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
                <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3">
                  <Package className="w-5 h-5 text-foreground/40" />
                </div>
                <p className="text-sm font-medium text-foreground/60">No orders yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Your recent orders will appear here.
                </p>
              </div>
            ) : (
              recentOrders.map((order) => {
                const status = order.status || order.paymentStatus || "Pending"
                const statusClass =
                  statusStyles[status] ||
                  "text-foreground/70 bg-zinc-100 dark:bg-zinc-800"

                return (
                  <div
                    key={order._id || order.transactionId}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                      <Package className="w-4 h-4 text-foreground/60" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {getOrderLabel(order)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.transactionId
                          ? `#${order.transactionId.slice(-6).toUpperCase()}`
                          : `#${order._id.slice(-6).toUpperCase()}`}{" "}
                        · {formatDate(order.createdAt || order.date)}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 space-y-1">
                      <p className="text-sm font-semibold">
                        {formatPrice(order)}
                      </p>
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusClass}`}
                      >
                        {status}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </section>

        {/* Address prompt */}
        <div className="rounded-xl border border-border/60 bg-white dark:bg-zinc-900 p-5 flex items-center gap-4">
          <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-4 h-4 text-foreground/70" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Save an address for faster checkout</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Add a delivery address to speed up future orders.
            </p>
          </div>
          <Link
            href="/profile"
            className="flex-shrink-0 px-3 py-1.5 rounded-lg border border-border/60 bg-zinc-50 dark:bg-zinc-800 text-xs font-semibold text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
          >
            Add Address
          </Link>
        </div>
      </div>
    </main>
  )
}
