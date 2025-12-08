"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { BookOpen, Clock, Plus, Search, Users } from "lucide-react"
import { useEffect, useState } from "react"

interface Course {
  _id: string
  title: string
  description: string
  category: string
  level: string
  duration: number
  thumbnail?: string
  classes?: string[]
  isPublished: boolean
  createdBy: {
    name: string
    email: string
  }
  createdAt: string
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/principal/courses')
      if (res.ok) {
        const data = await res.json()
        setCourses(data.courses)
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="text-muted-foreground">Manage courses and curriculum</p>
        </div>
        <Button asChild>
          <a href="/principal/courses/create">
            <Plus className="w-4 h-4 mr-2" />
            Add Course
          </a>
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <p className="text-muted-foreground col-span-full text-center py-8">Loading...</p>
        ) : filteredCourses.length === 0 ? (
          <Card className="col-span-full p-8">
            <div className="text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "No courses found" : "No courses yet. Create your first course!"}
              </p>
              {!searchQuery && (
                <Button asChild>
                  <a href="/principal/courses/create">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Course
                  </a>
                </Button>
              )}
            </div>
          </Card>
        ) : (
          filteredCourses.map((course) => (
            <Card key={course._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {course.thumbnail && (
                <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-600 relative">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {!course.thumbnail && (
                <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-white" />
                </div>
              )}
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold line-clamp-1">{course.title}</h3>
                    <p className="text-xs text-muted-foreground">{course.category}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    course.isPublished 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {course.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {course.description}
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{course.duration || 0} hours</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{course.classes?.length || 0} classes</span>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {course.level}
                  </span>
                </div>

                {course.classes && course.classes.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-medium mb-1">Assigned to:</p>
                    <div className="flex flex-wrap gap-1">
                      {course.classes.slice(0, 3).map((cls) => (
                        <span key={cls} className="text-xs bg-muted px-2 py-1 rounded">
                          {cls}
                        </span>
                      ))}
                      {course.classes.length > 3 && (
                        <span className="text-xs text-muted-foreground px-2 py-1">
                          +{course.classes.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View
                  </Button>
                  <Button size="sm" className="flex-1">
                    Edit
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {filteredCourses.length > 0 && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Showing {filteredCourses.length} course(s)
          </p>
        </div>
      )}
    </div>
  )
}
