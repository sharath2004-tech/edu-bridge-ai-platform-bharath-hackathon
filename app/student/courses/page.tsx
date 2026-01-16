import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getSession } from "@/lib/auth"
import { Course, Section } from "@/lib/models"
import connectDB from "@/lib/mongodb"
import { Clock, FolderOpen, Search, Star, Video } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

type CourseType = {
  _id: string
  title: string
  category: string
  level: string
  duration: number
  rating?: number
  enrolledStudents?: any[]
  description?: string
  thumbnail?: string
}

export default async function CoursesPage() {
  const session = await getSession()
  if (!session || session.role !== 'student') {
    redirect('/login')
  }

  await connectDB()

  // Find the student's section
  const studentSection = await Section.findOne({ students: session.id }).lean()
  
  let courses: CourseType[] = []
  
  if (studentSection) {
    // Get courses assigned to student's section
    const coursesData = await Course.find({ 
      sections: studentSection._id,
      status: 'published'
    }).lean()
    
    courses = coursesData.map(c => ({
      _id: String(c._id),
      title: c.title,
      category: c.category,
      level: c.level,
      duration: c.duration,
      rating: c.rating,
      enrolledStudents: c.enrolledStudents,
      description: c.description,
      thumbnail: c.thumbnail
    }))
  } else {
    // If student is not in a section, show all published courses from their school
    const coursesData = await Course.find({ 
      schoolId: session.schoolId,
      status: 'published'
    }).lean()
    
    courses = coursesData.map(c => ({
      _id: String(c._id),
      title: c.title,
      category: c.category,
      level: c.level,
      duration: c.duration,
      rating: c.rating,
      enrolledStudents: c.enrolledStudents,
      description: c.description,
      thumbnail: c.thumbnail
    }))
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Uploaded Materials Banner */}
      <Card className="p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/30">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/20 rounded-lg">
            <Video className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">Looking for Uploaded Videos & Materials?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your teachers upload videos, PDFs, and other materials in <strong>My Sections</strong>. 
              Access all uploaded content there!
            </p>
            <Link href="/student/sections">
              <Button className="gap-2">
                <FolderOpen className="w-4 h-4" />
                View Uploaded Materials
              </Button>
            </Link>
          </div>
        </div>
      </Card>
      
      <div>
        <h1 className="text-3xl font-bold mb-2">All Courses</h1>
        <p className="text-muted-foreground">Explore and enroll in courses that match your interests</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search courses..." className="pl-10" />
        </div>
        <select className="px-4 py-2 border border-border rounded-lg bg-background">
          <option>All Categories</option>
          <option>Web Development</option>
          <option>Data Science</option>
          <option>AI & ML</option>
        </select>
      </div>

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <div className="text-sm text-muted-foreground">No courses found.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, i) => (
            <Card
              key={course._id}
              className="overflow-hidden border border-border hover:border-primary/50 transition-all group animate-slideInLeft"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {course.thumbnail ? (
                <div className="h-32 overflow-hidden">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="h-32 bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-all"></div>
              )}
              <div className="p-4 space-y-3">
                <div>
                  <span className="inline-block px-2 py-1 bg-secondary/20 text-secondary text-xs font-medium rounded">
                    {course.category ?? "General"}
                  </span>
                  <h3 className="font-semibold mt-2">{course.title}</h3>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span>{(course as any).rating ?? 0}</span>
                  </div>
                  <span>{(course.enrolledStudents?.length ?? 0).toLocaleString()} students</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration ?? 0} mins</span>
                </div>
                <Link href={`/student/courses/${course._id}`}>
                  <Button className="w-full">View Course</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
