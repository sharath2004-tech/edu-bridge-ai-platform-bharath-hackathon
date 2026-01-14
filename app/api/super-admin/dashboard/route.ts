import School from '@/lib/models/School'
import User from '@/lib/models/User'
import connectDB from '@/lib/mongodb'
import { getSession } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request)
    
    if (!session || session.role !== 'super-admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Super Admin access required.' },
        { status: 403 }
      )
    }

    await connectDB()

    // Get all statistics
    const [
      totalSchools,
      activeSchools,
      pendingSchools,
      totalPrincipals,
      totalTeachers,
      totalStudents,
      recentSchools
    ] = await Promise.all([
      School.countDocuments(),
      School.countDocuments({ isActive: true }),
      School.countDocuments({ isActive: false }),
      User.countDocuments({ role: 'principal' }),
      User.countDocuments({ role: 'teacher' }),
      User.countDocuments({ role: 'student' }),
      School.find({ isActive: true })
        .select('name code type board principal address createdAt')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()
    ])

    return NextResponse.json({ 
      success: true, 
      stats: {
        totalSchools,
        activeSchools,
        pendingSchools,
        totalPrincipals,
        totalTeachers,
        totalStudents
      },
      recentSchools
    })
  } catch (error: any) {
    console.error('Error fetching super admin dashboard:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data', message: error.message },
      { status: 500 }
    )
  }
}
