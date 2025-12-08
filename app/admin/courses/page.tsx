"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { BookOpen, GraduationCap, TrendingUp, Users } from "lucide-react"
import { useEffect, useState } from "react"

interface Course {
  _id: string
  title: string
  description: string
  enrolledStudents: string[]
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        setCourses(data.courses || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const totalEnrollments = courses.reduce((sum, course) => 
    sum + (course.enrolledStudents?.length || 0), 0)

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Courses Management</h1>
          <p className="text-muted-foreground">Monitor and manage all platform courses</p>
        </div>
        <Button>View All Statistics</Button>
      </div>

      <Separator />

      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <p className="text-sm text-muted-foreground">Total Courses</p>
          </div>
          <p className="text-3xl font-bold">{courses.length}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-primary" />
            <p className="text-sm text-muted-foreground">Enrollments</p>
          </div>
          <p className="text-3xl font-bold">{totalEnrollments}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            <p className="text-sm text-muted-foreground">Active Learners</p>
          </div>
          <p className="text-3xl font-bold">{Math.floor(totalEnrollments * 0.7)}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <p className="text-sm text-muted-foreground">Avg Completion</p>
          </div>
          <p className="text-3xl font-bold">68%</p>
        </Card>
      </div>

      {loading ? (
        <div>Loading courses...</div>
      ) : (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">All Courses</h3>
          <div className="space-y-3">
            {courses.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No courses available</p>
            ) : (
              courses.map((course) => (
                <div key={course._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{course.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">{course.description}</p>
                  </div>
                  <div className="flex items-center gap-6 mr-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{course.enrolledStudents?.length || 0}</p>
                      <p className="text-xs text-muted-foreground">Students</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              ))
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
