"use client"

import { GamificationWidget } from "@/components/gamification-widget"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, BookOpen, Clock, Play, Target, TrendingUp } from "lucide-react"

export default function StudentDashboard() {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back, Alex!</h1>
        <p className="text-muted-foreground">Continue your learning journey with EduBridge AI</p>
      </div>

      {/* Gamification */}
      <GamificationWidget />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Learning Streak", value: "12 days", icon: TrendingUp, color: "from-primary/20 to-primary/5" },
          { label: "Courses Active", value: "5 courses", icon: BookOpen, color: "from-accent/20 to-accent/5" },
          { label: "Hours Learned", value: "24.5 hrs", icon: Clock, color: "from-secondary/20 to-secondary/5" },
          { label: "Goals Completed", value: "8 of 12", icon: Target, color: "from-emerald-500/20 to-emerald-500/5" },
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
        {/* Courses Section */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Active Courses</h2>
            <Button variant="outline" size="sm" className="gap-1 bg-transparent">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {[
              { title: "Web Development Basics", progress: 65, lessons: "12/18 lessons", instructor: "Sarah Chen" },
              { title: "Advanced React Patterns", progress: 45, lessons: "9/20 lessons", instructor: "Mike Johnson" },
              { title: "Data Science 101", progress: 80, lessons: "16/20 lessons", instructor: "Dr. Priya Kumar" },
            ].map((course, i) => (
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
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Next Lesson */}
          <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <h3 className="font-semibold mb-3">Next Lesson</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium mb-1">React Hooks Deep Dive</p>
                <p className="text-xs text-muted-foreground">Advanced React Patterns • 45 mins</p>
              </div>
              <Button className="w-full gap-2" size="sm">
                <Play className="w-4 h-4" />
                Start Now
              </Button>
            </div>
          </Card>

          {/* Upcoming Deadlines */}
          <Card className="p-4 border border-border">
            <h3 className="font-semibold mb-3">Deadlines</h3>
            <div className="space-y-3">
              {[
                { title: "Quiz: Arrays & Objects", date: "Today" },
                { title: "Assignment: Build a Form", date: "Tomorrow" },
                { title: "Project: Todo App", date: "3 days" },
              ].map((item, i) => (
                <div key={i} className="pb-3 border-b border-border last:border-0">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
              ))}
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
