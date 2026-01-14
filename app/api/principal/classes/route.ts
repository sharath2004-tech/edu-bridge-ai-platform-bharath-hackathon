import { authenticateAndAuthorize } from '@/lib/auth-middleware'
import { Class } from '@/lib/models'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

// GET - List all classes in principal's school
export async function GET(request: NextRequest) {
  try {
    const authResult = authenticateAndAuthorize(request, {
      requiredRoles: ['principal', 'admin', 'super-admin'],
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
    
    if (user.role === 'principal' || user.role === 'admin') {
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

// POST - Create a new class
export async function POST(request: NextRequest) {
  try {
    const authResult = authenticateAndAuthorize(request, {
      requiredRoles: ['principal', 'admin', 'super-admin'],
      resource: 'classes',
      action: 'create',
      scope: 'school'
    })

    if (authResult instanceof NextResponse) {
      return authResult
    }

    const user = authResult
    await connectDB()

    const body = await request.json()
    const { className, section, classTeacherId, academicYear } = body

    if (!className || !section) {
      return NextResponse.json(
        { success: false, error: 'Class name and section are required' },
        { status: 400 }
      )
    }

    // Get schoolId
    const schoolId = user.schoolId

    if (!schoolId) {
      return NextResponse.json(
        { success: false, error: 'School information required' },
        { status: 400 }
      )
    }

    // Check if class already exists
    const existingClass = await Class.findOne({
      schoolId,
      className,
      section
    })

    if (existingClass) {
      return NextResponse.json(
        { success: false, error: 'Class with this name and section already exists' },
        { status: 400 }
      )
    }

    // Create class
    const newClass = await Class.create({
      schoolId,
      className,
      section: section.toUpperCase(),
      classTeacherId: classTeacherId || undefined,
      academicYear: academicYear || new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
      strength: 0
    })

    const populatedClass = await Class.findById(newClass._id)
      .populate('schoolId', 'name code')
      .populate('classTeacherId', 'name email')

    return NextResponse.json({
      success: true,
      class: populatedClass,
      message: 'Class created successfully'
    }, { status: 201 })

  } catch (error: any) {
    console.error('Create class error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
