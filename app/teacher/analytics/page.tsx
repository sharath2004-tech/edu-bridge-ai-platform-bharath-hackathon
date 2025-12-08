"use client"

import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Users, TrendingUp, Eye, MessageSquare } from "lucide-react"

export default function TeacherAnalyticsPage() {
  const data = [
    { course: "Web Dev", students: 45, avgScore: 82, views: 2400 },
    { course: "React", students: 32, avgScore: 88, views: 1850 },
    { course: "Data Science", students: 58, avgScore: 79, views: 3200 },
    { course: "Python", students: 42, avgScore: 85, views: 2100 },
  ]

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold mb-2">Course Analytics</h1>
        <p className="text-muted-foreground">Track your students' performance and engagement</p>
      </div>

      {/* Key Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: "Total Students", value: "177", icon: Users },
          { label: "Avg Grade", value: "83.5%", icon: TrendingUp },
          { label: "Total Views", value: "9.5K", icon: Eye },
          { label: "Messages", value: "234", icon: MessageSquare },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card
              key={i}
              className="p-4 border border-border animate-slideInLeft"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <Icon className="w-5 h-5 text-primary" />
              </div>
            </Card>
          )
        })}
      </div>

      {/* Chart */}
      <Card className="p-6 border border-border animate-slideInLeft" style={{ animationDelay: "0.4s" }}>
        <h2 className="text-lg font-bold mb-4">Course Performance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="course" stroke="var(--color-muted-foreground)" />
            <YAxis stroke="var(--color-muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: `1px solid var(--color-border)`,
              }}
            />
            <Legend />
            <Bar dataKey="students" fill="var(--color-primary)" />
            <Bar dataKey="avgScore" fill="var(--color-accent)" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
