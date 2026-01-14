"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Users, MessageSquare, TrendingUp, Plus, ArrowRight, Eye, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"

interface DashboardData {
  stats: {
    activeCourses: number
    totalStudents: number
    messages: number
    avgRating: string
  }
  courses: {
    id: string
    title: string
    students: number
    content: string
    rating: number
    views: number
  }[]
}

export default function TeacherDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [teacherName, setTeacherName] = useState('Teacher')

  useEffect(() => {
    // Get teacher name from session cookie
    try {
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`
        const parts = value.split(`; ${name}=`)
        if (parts.length === 2) return parts.pop()?.split(';').shift()
      }
      const sessionCookie = getCookie('edubridge_session')
      if (sessionCookie) {
        const session = JSON.parse(decodeURIComponent(sessionCookie))
        setTeacherName(session.name || 'Teacher')
      }
    } catch (err) {
      console.error('Error parsing session:', err)
    }

    async function fetchDashboard() {
      try {
        const res = await fetch('/api/teacher/dashboard')
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
    activeCourses: 0,
    totalStudents: 0,
    messages: 0,
    avgRating: '0'
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {loading ? (
              <span className="inline-block w-64 h-8 bg-muted animate-pulse rounded" />
            ) : (
              `Welcome back, ${teacherName}!`
            )}
          </h1>
          <p className="text-muted-foreground">Manage your courses and track student progress</p>
        </div>
        <Button className="gap-2" asChild>
          <Link href="/teacher/courses/create">
            <Plus className="w-4 h-4" />
            Create Course
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Active Courses", value: displayStats.activeCourses.toString(), icon: BookOpen, color: "from-primary/20 to-primary/5" },
          { label: "Total Students", value: displayStats.totalStudents.toString(), icon: Users, color: "from-accent/20 to-accent/5" },
          { label: "Messages", value: displayStats.messages.toString(), icon: MessageSquare, color: "from-secondary/20 to-secondary/5" },
          { label: "Avg Rating", value: `${displayStats.avgRating}/5`, icon: TrendingUp, color: "from-emerald-500/20 to-emerald-500/5" },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card
              key={i}
              className={`p-4 border-0 bg-gradient-to-br ${stat.color} hover:shadow-md transition-all group animate-slideInLeft`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-all">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Your Courses</h2>
            <Button variant="outline" size="sm" className="gap-1 bg-transparent" asChild>
              <Link href="/teacher/courses">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="space-y-4">
            {loading ? (
              // Loading skeleton
              [1, 2, 3].map((i) => (
                <Card key={i} className="p-4 border border-border">
                  <div className="animate-pulse space-y-3">
                    <div className="h-5 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </div>
                </Card>
              ))
            ) : data?.courses && data.courses.length > 0 ? (
              data.courses.map((course, i) => (
                <Card
                  key={course.id}
                  className="p-4 border border-border hover:border-primary/50 transition-all group animate-slideInLeft cursor-pointer"
                  style={{ animationDelay: `${0.3 + i * 0.1}s` }}
                  onClick={() => window.location.href = `/teacher/courses/${course.id}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{course.title}</h3>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <span>{course.students} students</span>
                        <span>•</span>
                        <span>{course.content}</span>
                        <span>•</span>
                        <span>{course.rating.toFixed(1)} rating</span>
                      </div>
                    </div>
                    <Button size="icon" variant="ghost" className="group-hover:bg-primary/10">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                  <Progress value={65} className="h-2" />
                </Card>
              ))
            ) : (
              <Card className="p-6 text-center text-muted-foreground">
                <p>No courses yet. Create your first course to get started!</p>
                <Button className="mt-4" size="sm" asChild>
                  <Link href="/teacher/courses/create">Create Course</Link>
                </Button>
              </Card>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {/* Quick Actions */}
          <Card className="p-4 border border-border">
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {["Create New Course", "Upload Content", "Review Submissions", "Message Students"].map((action, i) => (
                <button key={i} className="w-full px-3 py-2 text-left text-sm hover:bg-muted rounded transition-colors">
                  {action}
                </button>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-4 border border-border">
            <h3 className="font-semibold mb-3">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { text: "New submission from John", time: "2 hours ago" },
                { text: "Student completed quiz", time: "5 hours ago" },
                { text: "Course comment received", time: "1 day ago" },
              ].map((activity, i) => (
                <div key={i} className="pb-3 border-b border-border last:border-0">
                  <p className="text-sm">{activity.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
