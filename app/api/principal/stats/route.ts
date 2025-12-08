import { authenticateAndAuthorize } from '@/lib/auth-middleware'
import { User } from '@/lib/models'
import School from '@/lib/models/School'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const authResult = authenticateAndAuthorize(request, {
      requiredRoles: ['principal', 'super-admin'],
      resource: 'analytics',
      action: 'read',
      scope: 'school'
    })

    if (authResult instanceof NextResponse) {
      return authResult
    }

    const user = authResult
    await connectDB()

    if (user.role === 'principal' && !user.schoolId) {
      return NextResponse.json(
        { success: false, error: 'School information missing' },
        { status: 400 }
      )
    }

    const schoolId = user.schoolId

    // Get counts
    const [totalStudents, totalTeachers, school] = await Promise.all([
      User.countDocuments({ schoolId, role: 'student' }),
      User.countDocuments({ schoolId, role: 'teacher' }),
      School.findById(schoolId)
    ])

    // Get unique classes
    const classes = await User.distinct('className', { 
      schoolId, 
      role: 'student',
      className: { $exists: true, $ne: null }
    })

    // Get total courses (you can adjust this based on your Course model)
    const totalCourses = school?.stats?.totalCourses || 0

    return NextResponse.json({
      success: true,
      stats: {
        totalStudents,
        totalTeachers,
        totalClasses: classes.length,
        totalCourses,
        schoolName: school?.name,
        schoolCode: school?.code
      }
    })

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
