import { getSession } from '@/lib/auth'
import { Course, User } from '@/lib/models'
import connectDB from '@/lib/mongodb'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await getSession()
    
    if (!session || (session.role !== 'teacher' && session.role !== 'principal')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()

    // Fetch teacher's courses
    const courses = await Course.find({
      instructor: session.id,
      status: { $ne: 'archived' }
    }).select('title enrolledStudents rating').lean()

    // Count total students (unique across all courses)
    const allStudentIds = new Set()
    courses.forEach(course => {
      course.enrolledStudents?.forEach((id: any) => allStudentIds.add(String(id)))
    })

    const stats = {
      activeCourses: courses.length,
      totalStudents: allStudentIds.size,
      messages: 0, // Implement message count if you have messaging
      avgRating: courses.length > 0 
        ? (courses.reduce((sum, c) => sum + (c.rating || 0), 0) / courses.length).toFixed(1)
        : '0'
    }

    // Get recent courses with details
    const recentCourses = await Course.find({
      instructor: session.id,
      status: 'published'
    })
      .select('title enrolledStudents lessons rating')
      .limit(3)
      .lean()

    const coursesData = recentCourses.map(course => ({
      id: String(course._id),
      title: course.title,
      students: course.enrolledStudents?.length || 0,
      content: `${course.lessons?.length || 0} lessons`,
      rating: course.rating || 0,
      views: 0 // Implement view tracking if needed
    }))

    return NextResponse.json({
      success: true,
      data: {
        stats,
        courses: coursesData
      }
    })
  } catch (error: any) {
    console.error('Teacher dashboard error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
