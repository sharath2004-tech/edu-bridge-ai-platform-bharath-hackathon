import { getSession } from '@/lib/auth'
import { Course, User } from '@/lib/models'
import connectDB from '@/lib/mongodb'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()

    // Fetch user data
    const user = await User.findById(session.id).select('name email')
    
    // Fetch enrolled courses with progress
    const enrolledCourses = await Course.find({
      enrolledStudents: session.id,
      status: 'published'
    })
      .populate('instructor', 'name')
      .limit(5)
      .lean()

    // Calculate progress for each course (simplified - you may have a separate progress model)
    const courses = enrolledCourses.map(course => {
      const totalLessons = course.lessons?.length || 0
      // For now, assume 50% progress - replace with actual progress tracking
      const completedLessons = Math.floor(totalLessons * 0.5)
      const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
      
      // Handle instructor which might be an ObjectId or populated object
      const instructorName = typeof course.instructor === 'object' && course.instructor !== null
        ? (course.instructor as any).name || 'Unknown Instructor'
        : 'Unknown Instructor'
      
      return {
        title: course.title,
        progress,
        lessons: `${completedLessons}/${totalLessons} lessons`,
        instructor: instructorName,
      }
    })

    // Get next lesson (from first enrolled course with incomplete progress)
    let nextLesson = undefined
    if (enrolledCourses.length > 0 && enrolledCourses[0].lessons?.length > 0) {
      const firstCourse = enrolledCourses[0]
      nextLesson = {
        title: firstCourse.lessons[0]?.title || 'Introduction',
        course: firstCourse.title,
        duration: firstCourse.lessons[0]?.duration || 30,
      }
    }

    // Build dashboard data
    const dashboardData = {
      name: user?.name || session.name || 'Student',
      stats: {
        streak: 0, // Implement streak tracking
        activeCourses: enrolledCourses.length,
        hoursLearned: 0, // Implement time tracking
        goalsCompleted: 0,
        totalGoals: 0,
      },
      courses,
      nextLesson,
      deadlines: [], // Implement deadline tracking from quizzes/assignments
    }

    return NextResponse.json({
      success: true,
      data: dashboardData,
    })
  } catch (error: any) {
    console.error('Dashboard fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
