"use client"

import { Card } from "@/components/ui/card"
import { Award, BookOpen, TrendingUp, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export default function TeacherAnalyticsPage() {
  const [stats, setStats] = useState({
    activeCourses: 0,
    totalStudents: 0,
    avgRating: "0"
  })
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/teacher/dashboard')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.data.stats)
          setCourses(data.data.courses || [])
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const chartData = courses.map(course => ({
    course: course.title.substring(0, 15),
    students: course.students || 0,
    rating: course.rating || 0,
    lessons: parseInt(course.content.split(' ')[0]) || 0
  }))

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold mb-2">Course Analytics</h1>
        <p className="text-muted-foreground">Track your courses and student engagement</p>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading analytics...</div>
      ) : (
        <>
          {/* Key Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { label: "Active Courses", value: stats.activeCourses.toString(), icon: BookOpen },
              { label: "Total Students", value: stats.totalStudents.toString(), icon: Users },
              { label: "Avg Rating", value: stats.avgRating, icon: Award },
              { label: "Trending", value: "↑ 12%", icon: TrendingUp },
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
          {chartData.length > 0 && (
            <Card className="p-6 border border-border animate-slideInLeft" style={{ animationDelay: "0.4s" }}>
              <h2 className="text-lg font-bold mb-4">Course Overview</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
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
                  <Bar dataKey="students" fill="var(--color-primary)" name="Students" />
                  <Bar dataKey="lessons" fill="var(--color-accent)" name="Lessons" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
