"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { BookOpen, Clock, Users } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface Course {
  _id: string
  title: string
  description: string
  enrolledStudents: string[]
  createdAt: string
}

export default function TeacherCoursesPage() {
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

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Courses</h1>
          <p className="text-muted-foreground">Manage your courses and content</p>
        </div>
        <Link href="/teacher/courses/create">
          <Button>Create New Course</Button>
        </Link>
      </div>

      <Separator />

      {loading ? (
        <div>Loading courses...</div>
      ) : courses.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">No courses yet</h3>
          <p className="text-muted-foreground mb-4">Create your first course to get started</p>
          <Link href="/teacher/courses/create">
            <Button>Create Course</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <Card key={course._id} className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold mb-2">{course.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {course.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{course.enrolledStudents?.length || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(course.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <Link href={`/teacher/courses/${course._id}`}>
                <Button className="w-full" variant="outline">View Course</Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
