"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Users, BookOpen, TrendingUp, AlertCircle, Activity, ArrowUp, ArrowDown, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

interface DashboardData {
  stats: {
    totalUsers: number
    activeCourses: number
    engagement: string
    systemHealth: string
    userActivity: {
      students: { value: number; max: number }
      teachers: { value: number; max: number }
      principals: { value: number; max: number }
    }
  }
  recentUsers: {
    name: string
    email: string
    role: string
    time: string
  }[]
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch('/api/admin/dashboard')
        if (res.ok) {
          const json = await res.json()
          if (json.success) {
            setData(json.data)
          }
        }
      } catch (error) {
        console.error('Failed to fetch dashboard:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  const displayStats = data?.stats || {
    totalUsers: 0,
    activeCourses: 0,
    engagement: '0%',
    systemHealth: '99.8%'
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold mb-2">System Dashboard</h1>
        <p className="text-muted-foreground">Monitor platform performance and user activity</p>
      </div>

      {/* Key Metrics */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-4">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-8 bg-muted rounded w-3/4" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Total Users", value: displayStats.totalUsers.toString(), icon: Users, change: "+12%", color: "from-primary/20 to-primary/5" },
            { label: "Active Courses", value: displayStats.activeCourses.toString(), icon: BookOpen, change: "+8%", color: "from-accent/20 to-accent/5" },
            {
              label: "Engagement",
              value: displayStats.engagement,
              icon: Activity,
              change: "+3%",
              color: "from-secondary/20 to-secondary/5",
            },
            {
              label: "System Health",
              value: displayStats.systemHealth,
              icon: TrendingUp,
              change: "+0.2%",
              color: "from-emerald-500/20 to-emerald-500/5",
            },
          ].map((metric, i) => {
          const Icon = metric.icon
          const isPositive = metric.change.startsWith("+")
          return (
            <Card
              key={i}
              className={`p-4 border-0 bg-gradient-to-br ${metric.color} hover:shadow-md transition-all animate-slideInLeft`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                  <p className="text-2xl font-bold mb-2">{metric.value}</p>
                  <div className="flex items-center gap-1">
                    {isPositive ? (
                      <ArrowUp className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <ArrowDown className="w-3 h-3 text-destructive" />
                    )}
                    <span className={`text-xs font-medium ${isPositive ? "text-emerald-600" : "text-destructive"}`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <div className="p-2 bg-white/10 rounded-lg">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </Card>
          )
        })}
        </div>
      )}

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Activity Overview */}
        <div className="lg:col-span-2">
          <Card className="p-6 border border-border animate-slideInLeft" style={{ animationDelay: "0.4s" }}>
            <h2 className="text-xl font-bold mb-4">User Activity</h2>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-muted rounded mb-2" />
                    <div className="h-2 bg-muted rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {[
                  { label: "Students", value: data?.stats.userActivity.students.value || 0, max: data?.stats.userActivity.students.max || 100, color: "from-primary/60 to-primary/40" },
                  { label: "Teachers", value: data?.stats.userActivity.teachers.value || 0, max: data?.stats.userActivity.teachers.max || 100, color: "from-accent/60 to-accent/40" },
                  { label: "Principals", value: data?.stats.userActivity.principals.value || 0, max: data?.stats.userActivity.principals.max || 100, color: "from-secondary/60 to-secondary/40" },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{item.label}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.value} / {item.max}
                      </span>
                    </div>
                    <Progress value={(item.value / item.max) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Recent Alerts */}
          <Card className="p-6 border border-border mt-6 animate-slideInLeft" style={{ animationDelay: "0.5s" }}>
            <h2 className="text-xl font-bold mb-4">System Alerts</h2>
            <div className="space-y-3">
              {[
                { type: "Warning", message: "High database query time detected", time: "2 min ago", icon: "warn" },
                { type: "Info", message: "Backup completed successfully", time: "1 hour ago", icon: "info" },
                { type: "Alert", message: "Multiple failed login attempts", time: "3 hours ago", icon: "alert" },
              ].map((alert, i) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                  <div
                    className={`p-2 rounded-lg ${
                      alert.type === "Warning"
                        ? "bg-amber-500/10"
                        : alert.type === "Info"
                          ? "bg-blue-500/10"
                          : "bg-destructive/10"
                    }`}
                  >
                    <AlertCircle
                      className={`w-4 h-4 ${
                        alert.type === "Warning"
                          ? "text-amber-600"
                          : alert.type === "Info"
                            ? "text-blue-600"
                            : "text-destructive"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <Card
            className="p-4 bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20 animate-slideInLeft"
            style={{ animationDelay: "0.6s" }}
          >
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-destructive" />
              Critical Items
            </h3>
            <div className="space-y-2">
              <p className="text-sm">
                Pending moderation: <span className="font-bold">7</span>
              </p>
              <p className="text-sm">
                Flagged content: <span className="font-bold">3</span>
              </p>
              <p className="text-sm">
                Server alerts: <span className="font-bold">1</span>
              </p>
            </div>
            <Button size="sm" className="w-full mt-3 bg-transparent" variant="outline">
              Review
            </Button>
          </Card>

          {/* Usage Stats */}
          <Card className="p-4 border border-border animate-slideInLeft" style={{ animationDelay: "0.7s" }}>
            <h3 className="font-semibold mb-3">Resource Usage</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>CPU</span>
                  <span className="font-medium">45%</span>
                </div>
                <Progress value={45} className="h-1.5" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Memory</span>
                  <span className="font-medium">62%</span>
                </div>
                <Progress value={62} className="h-1.5" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Storage</span>
                  <span className="font-medium">78%</span>
                </div>
                <Progress value={78} className="h-1.5" />
              </div>
            </div>
          </Card>

          {/* Recent Updates */}
          <Card className="p-4 border border-border animate-slideInLeft" style={{ animationDelay: "0.8s" }}>
            <h3 className="font-semibold mb-3">Latest Updates</h3>
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">v2.1.0 released</p>
              <p className="text-muted-foreground">Security patches applied</p>
              <p className="text-muted-foreground">Database optimized</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
