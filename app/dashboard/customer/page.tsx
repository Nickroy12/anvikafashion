import { getUserSession } from "@/lib/core/sessions"
import {
  ShoppingBag,
  Heart,
  Package,
  Star,
  MapPin,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"

const recentOrders = [
  {
    id: "#ORD-4821",
    item: "Floral Maxi Dress",
    date: "28 Jul 2026",
    status: "Shipped",
    amount: "₹2,450",
    statusClass: "text-foreground/70 bg-zinc-100 dark:bg-zinc-800",
  },
  {
    id: "#ORD-4790",
    item: "Silk Wrap Dress",
    date: "20 Jul 2026",
    status: "Delivered",
    amount: "₹3,800",
    statusClass: "text-foreground bg-zinc-200 dark:bg-zinc-700",
  },
  {
    id: "#ORD-4755",
    item: "Cotton Midi Dress",
    date: "10 Jul 2026",
    status: "Delivered",
    amount: "₹1,950",
    statusClass: "text-foreground bg-zinc-200 dark:bg-zinc-700",
  },
]

const quickLinks = [
  { label: "New Arrivals", href: "/new-arrivals", icon: ShoppingBag },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
  { label: "Track Order", href: "/orders", icon: Package },
  { label: "My Reviews", href: "/reviews", icon: Star },
]

export default async function CustomerDashboardPage() {
  const user = await getUserSession()
  const name = user?.name || "Customer"
  const firstName = name.split(" ")[0]

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
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center gap-4 px-5 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                  <Package className="w-4 h-4 text-foreground/60" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{order.item}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.id} · {order.date}
                  </p>
                </div>
                <div className="text-right flex-shrink-0 space-y-1">
                  <p className="text-sm font-semibold">{order.amount}</p>
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${order.statusClass}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
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
