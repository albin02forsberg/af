"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Users, TrendingUp, DollarSign, Activity } from "lucide-react"
import type { Customer, CustomersListResponse } from "@/models/customer"
import { addDays, eachDayOfInterval, endOfMonth, format, startOfMonth } from "date-fns"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  Area,
  AreaChart,
} from "recharts"

function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/customers", { cache: "no-store" })
        if (!res.ok) throw new Error((await res.json()).error || `HTTP ${res.status}`)
        const data = (await res.json()) as CustomersListResponse
        if (!cancelled) setCustomers(data.customers)
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Failed to load customers"
        if (!cancelled) setError(msg)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { customers, loading, error }
}

function generateMockSeries(days = 30, base = 1000, variance = 200) {
  const start = addDays(new Date(), -days)
  return Array.from({ length: days }, (_, i) => {
    const date = addDays(start, i)
    const value = Math.max(0, Math.round(base + (Math.random() - 0.5) * 2 * variance))
    return { date: format(date, "MMM d"), value, rawDate: date }
  })
}

export function Dashboard() {
  const { customers, loading, error } = useCustomers()

  // KPIs
  const totalCustomers = customers.length
  const startThisMonth = startOfMonth(new Date())
  const newThisMonth = customers.filter((c) => c.createdAt && c.createdAt >= startThisMonth.getTime()).length

  const customerByDay = useMemo(() => {
    if (!customers.length) return [] as { date: string; count: number }[]
    const earliest = customers.reduce((min, c) => (c.createdAt < min ? c.createdAt : min), Date.now())
    const start = startOfMonth(new Date(earliest))
    const end = endOfMonth(new Date())
    const days = eachDayOfInterval({ start, end })
    const counts = new Map<string, number>()
    for (const d of days) counts.set(format(d, "MMM d"), 0)
    for (const c of customers) {
      const key = format(new Date(c.createdAt), "MMM d")
      counts.set(key, (counts.get(key) || 0) + 1)
    }
    return Array.from(counts, ([date, count]) => ({ date, count }))
  }, [customers])

  // Mock series for revenue and activity
  const revenueSeries = useMemo(() => generateMockSeries(30, 2500, 600), [])
  const activeUsers = useMemo(() => generateMockSeries(30, 120, 30), [])

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-24" /> : <div className="text-2xl font-bold">{totalCustomers}</div>}
            <p className="text-xs text-muted-foreground mt-1">Across your current organization</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-24" /> : <div className="text-2xl font-bold">{newThisMonth}</div>}
            <p className="text-xs text-muted-foreground mt-1">Since {format(startThisMonth, "MMM d")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MRR (mock)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$ {(revenueSeries.at(-1)?.value ?? 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Simulated revenue series</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users (mock)</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers.at(-1)?.value ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Last 24h</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Customer signups</CardTitle>
                <CardDescription>Grouped per day</CardDescription>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="text-xs text-muted-foreground">What am I seeing?</TooltipTrigger>
                  <TooltipContent side="left" className="max-w-xs">
                    Daily counts computed from Firestore customer documents by createdAt
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent className="h-64">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={customerByDay}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} interval={Math.ceil(customerByDay.length / 8)} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <ReTooltip cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }} />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue (mock)</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} interval={5} />
                <YAxis tick={{ fontSize: 12 }} />
                <ReTooltip cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }} />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active users vs signups (mock + real)</CardTitle>
          <CardDescription>Comparison of simulated active users and cumulative signups</CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={activeUsers.map((d, i) => ({
                date: d.date,
                active: d.value,
                signups: i < customerByDay.length ? customerByDay[i].count : 0,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} interval={5} />
              <YAxis tick={{ fontSize: 12 }} />
              <Legend />
              <ReTooltip cursor={{ stroke: "hsl(var(--muted-foreground))" }} />
              <Line type="monotone" dataKey="active" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="signups" stroke="hsl(var(--foreground))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {error && (
        <div role="alert" className="text-red-600 text-sm">{error}</div>
      )}

      <Separator />

      <div className="text-xs text-muted-foreground">
        Tip: Revenue and activity are mocked. Replace with your own data sources when available.
      </div>
    </div>
  )
}

export default Dashboard
