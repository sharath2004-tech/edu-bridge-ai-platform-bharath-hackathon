import { authenticateAndAuthorize } from '@/lib/auth-middleware'
import { Class, Course, User } from '@/lib/models'
import School from '@/lib/models/School'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const authResult = authenticateAndAuthorize(request, {
      requiredRoles: ['principal', 'super-admin'],
      resource: 'stats',
      action: 'read'
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
    const [totalStudents, totalTeachers, totalClasses, totalCourses, school] = await Promise.all([
      User.countDocuments({ schoolId, role: 'student' }),
      User.countDocuments({ schoolId, role: 'teacher' }),
      Class.countDocuments({ schoolId }),
      Course.countDocuments({ schoolId }),
      School.findById(schoolId)
    ])

    return NextResponse.json({
      success: true,
      stats: {
        totalStudents,
        totalTeachers,
        totalClasses,
        totalCourses,
        schoolName: school?.name,
        schoolCode: school?.code
      }
    })

  } catch (error: any) {
    console.error('Stats API Error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
