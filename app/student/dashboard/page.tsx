"use client"

import { GamificationWidget } from "@/components/gamification-widget"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, BookOpen, Clock, FolderOpen, Play, Target, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface DashboardData {
  name: string
  stats: {
    streak: number
    activeCourses: number
    hoursLearned: number
    goalsCompleted: number
    totalGoals: number
  }
  courses: {
    title: string
    progress: number
    lessons: string
    instructor: string
  }[]
  nextLesson?: {
    title: string
    course: string
    duration: number
  }
  deadlines: {
    title: string
    date: string
  }[]
}

export default function StudentDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch('/api/student/dashboard')
        if (res.ok) {
          const json = await res.json()
          setData(json.data)
        }
      } catch (error) {
        console.error('Failed to fetch dashboard:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  // Fallback data while loading or if fetch fails
  const displayData: DashboardData = data || {
    name: 'Student',
    stats: {
      streak: 0,
      activeCourses: 0,
      hoursLearned: 0,
      goalsCompleted: 0,
      totalGoals: 0,
    },
    courses: [],
    deadlines: [],
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          {loading ? (
            <span className="inline-block w-48 h-8 bg-muted animate-pulse rounded" />
          ) : (
            `Welcome back, ${displayData.name}!`
          )}
        </h1>
        <p className="text-muted-foreground">Continue your learning journey with EduBridge AI</p>
      </div>

      {/* Gamification */}
      <GamificationWidget />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Learning Streak", value: `${displayData.stats.streak} days`, icon: TrendingUp, color: "from-primary/20 to-primary/5" },
          { label: "Courses Active", value: `${displayData.stats.activeCourses} courses`, icon: BookOpen, color: "from-accent/20 to-accent/5" },
          { label: "Hours Learned", value: `${displayData.stats.hoursLearned} hrs`, icon: Clock, color: "from-secondary/20 to-secondary/5" },
          { label: "Goals Completed", value: `${displayData.stats.goalsCompleted} of ${displayData.stats.totalGoals}`, icon: Target, color: "from-emerald-500/20 to-emerald-500/5" },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card
              key={i}
              className={`p-4 border-0 bg-gradient-to-br ${stat.color} hover:shadow-xl transition-all duration-500 group animate-slideInUp hover:-translate-y-1`}
              style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'both' }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold animate-countUp">{stat.value}</p>
                </div>
                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Courses Section */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Active Courses</h2>
            <Button variant="outline" size="sm" className="gap-1 bg-transparent">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {displayData.courses.length > 0 ? (
              displayData.courses.map((course, i) => (
                <Card
                  key={i}
                  className="p-4 border border-border hover:border-primary/50 transition-all group animate-slideInLeft"
                  style={{ animationDelay: `${0.3 + i * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">by {course.instructor}</p>
                    </div>
                    <Button size="icon" variant="ghost" className="group-hover:bg-primary/10">
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Progress value={course.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {course.lessons} • {course.progress}% complete
                    </p>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-6 text-center text-muted-foreground">
                <p>No active courses yet. Start learning today!</p>
                <Button className="mt-4" size="sm">Browse Courses</Button>
              </Card>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Next Lesson */}
          <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <h3 className="font-semibold mb-3">Next Lesson</h3>
            {displayData.nextLesson ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-1">{displayData.nextLesson.title}</p>
                  <p className="text-xs text-muted-foreground">{displayData.nextLesson.course} • {displayData.nextLesson.duration} mins</p>
                </div>
                <Button className="w-full gap-2" size="sm">
                  <Play className="w-4 h-4" />
                  Start Now
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No upcoming lessons scheduled</p>
            )}
          </Card>

          {/* Upcoming Deadlines */}
          <Card className="p-4 border border-border">
            <h3 className="font-semibold mb-3">Deadlines</h3>
            <div className="space-y-3">
              {displayData.deadlines.length > 0 ? (
                displayData.deadlines.map((item, i) => (
                  <div key={i} className="pb-3 border-b border-border last:border-0">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No upcoming deadlines</p>
              )}
            </div>
          </Card>



          {/* Recommended */}
          <Card className="p-4 border border-accent/30 bg-accent/5">
            <h3 className="font-semibold mb-3">Recommended for You</h3>
            <p className="text-sm text-muted-foreground mb-3">Machine Learning Basics</p>
            <Button size="sm" className="w-full bg-transparent" variant="outline">
              Explore
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
