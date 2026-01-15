import { getSession } from '@/lib/auth'
import { User } from '@/lib/models'
import connectDB from '@/lib/mongodb'
import { NextResponse } from 'next/server'

// Debug endpoint to check teacher assigned classes
export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    await connectDB()

    // Get full user data
    const user = await User.findById(session.userId).select('+assignedClasses')
    
    return NextResponse.json({
      success: true,
      debug: {
        session: {
          userId: session.userId,
          id: session.id,
          role: session.role,
          email: session.email
        },
        user: user ? {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          assignedClasses: user.assignedClasses,
          assignedClassesType: Array.isArray(user.assignedClasses) ? 'array' : typeof user.assignedClasses,
          assignedClassesLength: user.assignedClasses?.length || 0
        } : null
      }
    })
  } catch (error: any) {
    console.error('Debug error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
