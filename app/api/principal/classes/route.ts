import { authenticateAndAuthorize } from '@/lib/auth-middleware'
import { Class } from '@/lib/models'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

// GET - List all classes in principal's school
export async function GET(request: NextRequest) {
  try {
    const authResult = authenticateAndAuthorize(request, {
      requiredRoles: ['principal', 'super-admin'],
      resource: 'classes',
      action: 'read',
      scope: 'school'
    })

    if (authResult instanceof NextResponse) {
      return authResult
    }

    const user = authResult
    await connectDB()

    // Build query based on role
    const query: any = {}
    
    if (user.role === 'principal') {
      if (!user.schoolId) {
        return NextResponse.json(
          { success: false, error: 'School information missing' },
          { status: 400 }
        )
      }
      query.schoolId = user.schoolId
    }

    const classes = await Class.find(query)
      .populate('schoolId', 'name code')
      .populate('classTeacherId', 'name email')
      .sort({ grade: 1, section: 1 })

    return NextResponse.json({
      success: true,
      classes,
      count: classes.length
    })

  } catch (error: any) {
    console.error('Classes API Error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
