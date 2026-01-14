import { getSession } from '@/lib/auth'
import { Course, School, User } from '@/lib/models'
import connectDB from '@/lib/mongodb'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await getSession()
    
    if (!session || session.role !== 'super-admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()

    // Get counts
    const [totalUsers, activeCourses, totalSchools, students, teachers, admins] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments({ status: 'published' }),
      School.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'teacher' }),
      User.countDocuments({ role: { $in: ['admin', 'super-admin', 'principal'] } })
    ])

    // Calculate engagement (simplified - could be based on recent activity)
    const engagement = totalUsers > 0 ? Math.min(((activeCourses * 10) / totalUsers * 100), 100).toFixed(1) : '0'

    const stats = {
      totalUsers,
      activeCourses,
      engagement: `${engagement}%`,
      systemHealth: '99.8%', // Could be calculated from actual metrics
      userActivity: {
        students: { value: students, max: Math.ceil(students * 1.5) },
        teachers: { value: teachers, max: Math.ceil(teachers * 1.5) },
        admins: { value: admins, max: 100 }
      }
    }

    // Get recent users
    const recentUsers = await User.find()
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
