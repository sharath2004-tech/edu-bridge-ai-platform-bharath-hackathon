"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Users, MessageSquare, TrendingUp, Plus, ArrowRight, Eye } from "lucide-react"

export default function TeacherDashboard() {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, Prof. Smith!</h1>
          <p className="text-muted-foreground">Manage your courses and track student progress</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create Course
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Active Courses", value: "4", icon: BookOpen, color: "from-primary/20 to-primary/5" },
          { label: "Total Students", value: "324", icon: Users, color: "from-accent/20 to-accent/5" },
          { label: "Messages", value: "12", icon: MessageSquare, color: "from-secondary/20 to-secondary/5" },
          { label: "Avg Rating", value: "4.8/5", icon: TrendingUp, color: "from-emerald-500/20 to-emerald-500/5" },
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
            <Button variant="outline" size="sm" className="gap-1 bg-transparent">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {[
              { title: "Web Development Basics", students: 45, content: "18 lessons", rating: 4.8, views: 2400 },
              { title: "Advanced React Patterns", students: 32, content: "20 lessons", rating: 4.9, views: 1850 },
              { title: "Data Science 101", students: 58, content: "25 lessons", rating: 4.7, views: 3200 },
            ].map((course, i) => (
              <Card
                key={i}
                className="p-4 border border-border hover:border-primary/50 transition-all group animate-slideInLeft"
                style={{ animationDelay: `${0.3 + i * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{course.title}</h3>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <span>{course.students} students</span>
                      <span>•</span>
                      <span>{course.content}</span>
                      <span>•</span>
                      <span>{course.rating} rating</span>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" className="group-hover:bg-primary/10">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                <Progress value={75} className="h-2" />
              </Card>
            ))}
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
