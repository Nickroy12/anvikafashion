import Link from "next/link"
import { ShieldOff, ArrowLeft } from "lucide-react"

/**
 * Rendered automatically by Next.js whenever forbidden() is called.
 * Requires experimental.authInterrupts = true in next.config.ts
 */
export default function ForbiddenPage() {
    return (
        <div className="min-h-[85vh] flex items-center justify-center px-4">
            <div className="w-full max-w-md text-center space-y-6">
                {/* Icon */}
                <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-border/60 flex items-center justify-center">
                        <ShieldOff className="w-7 h-7 text-foreground/50" />
                    </div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                        403 — Forbidden
                    </p>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Access Denied
                    </h1>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                        You don&apos;t have permission to view this page. This area is
                        restricted to authorised roles only.
                    </p>
                </div>

                {/* Divider */}
                <div className="border-t border-border/40" />

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">

                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                        Back to home
                    </Link>
                </div>
            </div>
        </div>
    )
}
