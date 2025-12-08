"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Play, BookOpen, Users, Clock, Star, Download, Share2 } from "lucide-react"
import Link from "next/link"

export default function CoursePage() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <Link href="/student/courses" className="flex items-center gap-2 text-primary hover:underline w-fit">
        <ArrowLeft className="w-4 h-4" />
        Back to Courses
      </Link>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl p-8 md:p-12 animate-slideInUp">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2">
            <div className="inline-block px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium mb-4 border border-primary/30">
              Featured Course
            </div>
            <h1 className="text-4xl font-bold mb-4">Advanced React Patterns</h1>
            <p className="text-lg text-muted-foreground mb-4">
              Master advanced React techniques, hooks, and patterns to build scalable applications
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="gap-2">
                <Play className="w-4 h-4" />
                Continue Learning
              </Button>
              <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Course Stats */}
          <div className="space-y-4">
            {[
              { icon: Users, label: "Students", value: "850" },
              { icon: BookOpen, label: "Lessons", value: "20" },
              { icon: Clock, label: "Duration", value: "30 hrs" },
              { icon: Star, label: "Rating", value: "4.9/5" },
            ].map((stat, i) => {
              const Icon = stat.icon
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 animate-slideInLeft"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="font-semibold">{stat.value}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Progress */}
      <Card className="p-6 border border-border animate-slideInLeft" style={{ animationDelay: "0.5s" }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">Your Progress</h2>
          <span className="text-sm font-medium">45%</span>
        </div>
        <Progress value={45} className="h-3" />
        <p className="text-sm text-muted-foreground mt-2">9 of 20 lessons completed</p>
      </Card>

      {/* Lessons */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Course Content</h2>
        <div className="space-y-3">
          {[
            { module: "Module 1", title: "React Hooks Fundamentals", duration: "45 min", completed: true },
            { module: "Module 2", title: "Custom Hooks Advanced", duration: "52 min", completed: true },
            { module: "Module 3", title: "Context API Deep Dive", duration: "38 min", completed: false },
            { module: "Module 4", title: "Performance Optimization", duration: "41 min", completed: false },
            { module: "Module 5", title: "Testing React Components", duration: "55 min", completed: false },
          ].map((lesson, i) => (
            <Card
              key={i}
              className="p-4 border border-border hover:border-primary/50 transition-all group cursor-pointer animate-slideInLeft"
              style={{ animationDelay: `${0.6 + i * 0.05}s` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">{lesson.module}</p>
                  <h3 className="font-semibold">{lesson.title}</h3>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-2">{lesson.duration}</p>
                  {lesson.completed ? (
                    <span className="inline-block px-2 py-1 bg-emerald-500/20 text-emerald-600 text-xs font-medium rounded">
                      Completed
                    </span>
                  ) : (
                    <Button size="sm" className="gap-1">
                      <Play className="w-3 h-3" />
                      Play
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Resources */}
      <Card className="p-6 border border-border animate-slideInLeft" style={{ animationDelay: "1s" }}>
        <h2 className="text-lg font-bold mb-4">Course Resources</h2>
        <div className="space-y-2">
          {["React Hooks Documentation", "Project Starter Code", "Cheat Sheet"].map((resource, i) => (
            <button
              key={i}
              className="w-full flex items-center justify-between p-3 hover:bg-muted rounded transition-colors text-left animate-slideInLeft"
              style={{ animationDelay: `${1.1 + i * 0.05}s` }}
            >
              <span className="text-sm font-medium">{resource}</span>
              <Download className="w-4 h-4 text-primary" />
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}
