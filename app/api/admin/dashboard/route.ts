import { getSession } from '@/lib/auth'
import { Course, School, User } from '@/lib/models'
import connectDB from '@/lib/mongodb'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await getSession()
    
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    if (!session.schoolId) {
      return NextResponse.json(
        { success: false, error: 'No school assigned to this admin' },
        { status: 400 }
      )
    }

    await connectDB()

    // Get counts for admin's school only
    const [totalUsers, activeCourses, students, teachers, principals] = await Promise.all([
      User.countDocuments({ schoolId: session.schoolId }),
      Course.countDocuments({ schoolId: session.schoolId, status: 'published' }),
      User.countDocuments({ schoolId: session.schoolId, role: 'student' }),
      User.countDocuments({ schoolId: session.schoolId, role: 'teacher' }),
      User.countDocuments({ schoolId: session.schoolId, role: 'principal' })
    ])

    // Calculate engagement (simplified - could be based on recent activity)
    const engagement = totalUsers > 0 ? Math.min(((activeCourses * 10) / totalUsers * 100), 100).toFixed(1) : '0'

    const stats = {
      totalUsers,
      activeCourses,
      engagement: `${engagement}%`,
      systemHealth: '100%',
      userActivity: {
        students: { value: students, max: Math.ceil(students * 1.5) || 50 },
        teachers: { value: teachers, max: Math.ceil(teachers * 1.5) || 20 },
        principals: { value: principals, max: 10 }
      }
    }

    // Get recent users from admin's school
    const recentUsers = await User.find({ schoolId: session.schoolId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role createdAt')
      .lean()

    return NextResponse.json({
      success: true,
      data: {
        stats,
        recentUsers: recentUsers.map(u => ({
          name: u.name,
          email: u.email,
          role: u.role,
          time: new Date(u.createdAt).toLocaleString()
        }))
      }
    })
  } catch (error: any) {
    console.error('Admin dashboard error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
