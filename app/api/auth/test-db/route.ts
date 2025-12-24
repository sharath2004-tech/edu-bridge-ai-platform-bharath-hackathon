import { User } from '@/lib/models'
import connectDB from '@/lib/mongodb'
import { NextResponse } from 'next/server'

/**
 * Test endpoint to verify database connection and user existence
 * GET /api/auth/test-db?email=test@example.com
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    // Test database connection
    await connectDB()
    
    const results: any = {
      mongodbConnected: true,
      timestamp: new Date().toISOString(),
    }

    // If email provided, check if user exists
    if (email) {
      const user = await User.findOne({ email }).select('-password')
      results.userExists = !!user
      if (user) {
        results.userDetails = {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          hasSchoolId: !!user.schoolId
        }
      }
    }

    // Count total users
    results.totalUsers = await User.countDocuments()

    return NextResponse.json({
      success: true,
      data: results
    })
  } catch (error: any) {
    console.error('Database test error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}
