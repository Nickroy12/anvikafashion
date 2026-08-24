"use client"

import { useEffect, useState, useCallback } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts"
import { BarChart3, TrendingUp, Loader2, AreaChart as AreaChartIcon } from "lucide-react"

// ── Types ──────────────────────────────────────────────────────────────────
type Range = "7d" | "30d"
type ChartType = "area" | "bar"

interface ChartPoint {
  label: string
  revenue: number
}

interface ChartApiResponse {
  labels: string[]
  data: number[]
  maxValue: number
  totalPaidOrders: number
}

interface RevenueChartProps {
  backendUrl?: string
}

// ── Helpers ────────────────────────────────────────────────────────────────
function formatRevenue(amount: number): string {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`
  return `₹${amount}`
}

// ── Custom Tooltip ─────────────────────────────────────────────────────────
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-foreground text-background rounded-lg px-3 py-2 shadow-xl text-xs">
      <p className="font-semibold">{label}</p>
      <p className="text-background/80 mt-0.5">
        Revenue:{" "}
        <span className="font-bold text-background">{formatRevenue(payload[0].value)}</span>
      </p>
    </div>
  )
}

// ── Component ──────────────────────────────────────────────────────────────
export default function RevenueChart({
  backendUrl = "http://localhost:5000",
}: RevenueChartProps) {
  const [range, setRange] = useState<Range>("7d")
  const [chartType, setChartType] = useState<ChartType>("area")
  const [points, setPoints] = useState<ChartPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [peakRevenue, setPeakRevenue] = useState(0)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const fetchChartData = useCallback(
    async (selectedRange: Range) => {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(
          `${backendUrl}/api/admin/revenue-chart?range=${selectedRange}`,
          { cache: "no-store" }
        )
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json: ChartApiResponse = await res.json()

        const newPoints: ChartPoint[] = json.labels.map((label, i) => ({
          label,
          revenue: json.data[i] ?? 0,
        }))

        setPoints(newPoints)
        setTotalRevenue(json.data.reduce((a, b) => a + b, 0))
        setPeakRevenue(json.maxValue)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load")
      } finally {
        setLoading(false)
      }
    },
    [backendUrl]
  )

  useEffect(() => {
    fetchChartData(range)
  }, [range, fetchChartData])

  const isEmpty = points.every((p) => p.revenue === 0)

  return (
    <div className="lg:col-span-2 rounded-xl bg-white dark:bg-zinc-900 border border-border/60 p-6 flex flex-col gap-5">
      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-foreground/60" />
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-tight">Revenue Overview</h3>
            <p className="text-[11px] text-muted-foreground">Paid orders · live data</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Chart type toggle */}
          <div className="flex items-center gap-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5">
            <button
              id="revenue-chart-type-area"
              onClick={() => setChartType("area")}
              title="Area chart"
              className={`p-1.5 rounded-md transition-all duration-150 ${
                chartType === "area"
                  ? "bg-white dark:bg-zinc-700 shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <AreaChartIcon className="w-3.5 h-3.5" />
            </button>
            <button
              id="revenue-chart-type-bar"
              onClick={() => setChartType("bar")}
              title="Bar chart"
              className={`p-1.5 rounded-md transition-all duration-150 ${
                chartType === "bar"
                  ? "bg-white dark:bg-zinc-700 shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Range selector */}
          <div className="flex items-center gap-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5">
            {(["7d", "30d"] as Range[]).map((r) => (
              <button
                key={r}
                id={`revenue-chart-range-${r}`}
                onClick={() => setRange(r)}
                className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all duration-200 ${
                  range === r
                    ? "bg-white dark:bg-zinc-700 text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r === "7d" ? "7 days" : "30 days"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats row ── */}
      {!loading && !error && (
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5 text-xs">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-muted-foreground">
              Total:{" "}
              <span className="font-semibold text-foreground">
                {formatRevenue(totalRevenue)}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="w-2 h-2 rounded-full bg-foreground/30 inline-block" />
            <span className="text-muted-foreground">
              Peak:{" "}
              <span className="font-semibold text-foreground">
                {formatRevenue(peakRevenue)}
              </span>
            </span>
          </div>
          {isEmpty && (
            <span className="ml-auto text-[11px] text-muted-foreground italic">
              No revenue in this period
            </span>
          )}
        </div>
      )}

      {/* ── Chart body ── */}
      <div className="w-full h-52">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <p className="text-xs text-muted-foreground">
              Could not load chart —{" "}
              <span className="font-mono text-[10px]">{error}</span>
            </p>
            <button
              onClick={() => fetchChartData(range)}
              className="text-xs underline text-foreground/60 hover:text-foreground transition-colors"
            >
              Retry
            </button>
          </div>
        ) : chartType === "area" ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={points}
              margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
            >
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="currentColor" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                strokeOpacity={0.06}
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "currentColor", opacity: 0.45 }}
                axisLine={false}
                tickLine={false}
                interval={range === "30d" ? 4 : 0}
              />
              <YAxis
                tickFormatter={(v) => formatRevenue(v)}
                tick={{ fontSize: 10, fill: "currentColor", opacity: 0.4 }}
                axisLine={false}
                tickLine={false}
                width={55}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "currentColor", strokeWidth: 1, strokeOpacity: 0.1 }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="currentColor"
                strokeWidth={2}
                fill="url(#revenueGradient)"
                strokeOpacity={0.7}
                dot={false}
                activeDot={{ r: 4, fill: "currentColor", strokeWidth: 0 }}
                animationDuration={800}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={points}
              margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
              barCategoryGap="30%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                strokeOpacity={0.06}
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "currentColor", opacity: 0.45 }}
                axisLine={false}
                tickLine={false}
                interval={range === "30d" ? 4 : 0}
              />
              <YAxis
                tickFormatter={(v) => formatRevenue(v)}
                tick={{ fontSize: 10, fill: "currentColor", opacity: 0.4 }}
                axisLine={false}
                tickLine={false}
                width={55}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "currentColor", fillOpacity: 0.04 }}
              />
              <Bar
                dataKey="revenue"
                radius={[4, 4, 0, 0]}
                animationDuration={700}
                animationEasing="ease-out"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {points.map((_, index) => (
                  <Cell
                    key={index}
                    fill="currentColor"
                    fillOpacity={
                      activeIndex === null || activeIndex === index ? 0.75 : 0.25
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
