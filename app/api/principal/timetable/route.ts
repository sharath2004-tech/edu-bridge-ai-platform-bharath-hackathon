import { authenticateAndAuthorize } from '@/lib/auth-middleware'
import Timetable from '@/lib/models/Timetable'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

// GET - List timetable entries
export async function GET(request: NextRequest) {
  try {
    const authResult = authenticateAndAuthorize(request, {
      requiredRoles: ['principal', 'teacher', 'student', 'super-admin'],
      resource: 'timetable',
      action: 'read',
    })

    if (authResult instanceof NextResponse) {
      return authResult
    }

    const user = authResult
    await connectDB()

    const { searchParams } = new URL(request.url)
    const classId = searchParams.get('classId')
    const dayOfWeek = searchParams.get('dayOfWeek')
    const teacherId = searchParams.get('teacherId')

    // Build query
    const query: any = {}

    // School filtering for principal and teacher
    if (user.role === 'principal' || user.role === 'teacher') {
      if (!user.schoolId) {
        return NextResponse.json(
          { success: false, error: 'School information missing' },
          { status: 400 }
        )
      }
      query.schoolId = user.schoolId
    }

    // Filters
    if (classId) query.classId = classId
    if (dayOfWeek) query.dayOfWeek = dayOfWeek
    if (teacherId) query.teacherId = teacherId

    const timetable = await Timetable.find(query)
      .populate('classId', 'className section grade')
      .populate('subjectId', 'name')
      .populate('teacherId', 'name email')
      .sort({ dayOfWeek: 1, period: 1 })

    return NextResponse.json({
      success: true,
      timetable,
      count: timetable.length,
    })
  } catch (error: any) {
    console.error('Timetable API Error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
