import { getSession } from '@/lib/auth'
import { Course, User } from '@/lib/models'
import connectDB from '@/lib/mongodb'
import { NextResponse } from 'next/server'

export async function GET() {
  let session = null
  try {
    session = await getSession()
    
    if (!session || (session.role !== 'teacher' && session.role !== 'principal')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()

    // Fetch teacher's assigned classes
    const Class = (await import('@/lib/models/Class')).default
    const teacherId = session.userId || session.id
    
    console.log('Teacher dashboard - fetching for:', { teacherId, role: session.role })
    
    const teacher = await User.findById(teacherId).select('assignedClasses')
    let classes = []
    if (teacher && teacher.assignedClasses && teacher.assignedClasses.length > 0) {
      const classIds = teacher.assignedClasses.map((cls: any) => 
        typeof cls === 'string' ? cls : cls.toString()
      )
      console.log('Fetching classes for IDs:', classIds)
      classes = await Class.find({
        _id: { $in: classIds },
        schoolId: session.schoolId
      }).select('className section').lean()
    }

    // Fetch teacher's courses from their school only
    const courses = await Course.find({
      instructor: teacherId,
      schoolId: session.schoolId,
      status: { $ne: 'archived' }
    }).select('title enrolledStudents rating').lean()

    // Count total students from teacher's school only (unique across all courses)
    const allStudentIds = new Set()
    if (courses.length > 0) {
      // Get actual students from the school to verify
      const studentIds = courses.flatMap(c => c.enrolledStudents || [])
      const schoolStudents = await User.find({
        _id: { $in: studentIds },
        schoolId: session.schoolId,
        role: 'student'
      }).select('_id').lean()
      schoolStudents.forEach(s => allStudentIds.add(String(s._id)))
    }

    const stats = {
      activeCourses: courses.length,
      totalStudents: allStudentIds.size,
      messages: 0, // Implement message count if you have messaging
      avgRating: courses.length > 0 
        ? (courses.reduce((sum, c) => sum + (c.rating || 0), 0) / courses.length).toFixed(1)
        : '0'
    }

    // Get recent courses with details from teacher's school only
    const recentCourses = await Course.find({
      instructor: session.id,
      schoolId: session.schoolId,
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
        courses: coursesData,
        classes: classes.map(c => ({
          id: String(c._id),
          className: c.className,
          section: c.section
        }))
      }
    })
  } catch (error: any) {
    console.error('Teacher dashboard error:', error)
    console.error('Error stack:', error.stack)
    console.error('Session info:', { 
      hasSession: !!session, 
      userId: session?.userId, 
      id: session?.id,
      role: session?.role 
    })
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data', details: error.message },
      { status: 500 }
    )
  }
}
