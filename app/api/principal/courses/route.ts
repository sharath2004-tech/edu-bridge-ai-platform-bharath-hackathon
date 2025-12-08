import { authenticateAndAuthorize } from '@/lib/auth-middleware'
import { Course } from '@/lib/models'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

// GET - List courses (filtered by role and school)
export async function GET(request: NextRequest) {
  try {
    const authResult = authenticateAndAuthorize(request, {
      requiredRoles: ['principal', 'teacher', 'super-admin'],
      resource: 'courses',
      action: 'read'
    })

    if (authResult instanceof NextResponse) {
      return authResult
    }

    const user = authResult
    await connectDB()

    // Build query based on role
    const query: any = {}
    
    if (user.role === 'principal' || user.role === 'teacher') {
      if (!user.schoolId) {
        return NextResponse.json(
          { success: false, error: 'School information missing' },
          { status: 400 }
        )
      }
      query.schoolId = user.schoolId
    }

    const courses = await Course.find(query)
      .populate('createdBy', 'name email')
      .populate('schoolId', 'name code')
      .sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      courses,
      count: courses.length
    })

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST - Create a new course (Principal only)
export async function POST(request: NextRequest) {
  try {
    const authResult = authenticateAndAuthorize(request, {
      requiredRoles: ['principal', 'super-admin'],
      resource: 'courses',
      action: 'create',
      scope: 'school'
    })

    if (authResult instanceof NextResponse) {
      return authResult
    }

    const user = authResult
    await connectDB()

    const body = await request.json()
    const { 
      title, 
      description,
      category,
      level,
      duration,
      thumbnail,
      classes = []
    } = body

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'Title and description are required' },
        { status: 400 }
      )
    }

    // Get school ID
    let schoolId = user.schoolId
    
    if (user.role === 'super-admin' && body.schoolId) {
      schoolId = body.schoolId
    }

    if (!schoolId) {
      return NextResponse.json(
        { success: false, error: 'School information required' },
        { status: 400 }
      )
    }

    // Create course
    const course = await Course.create({
      title,
      description,
      category: category || 'General',
      level: level || 'Beginner',
      duration: duration || 0,
      thumbnail: thumbnail || '',
      schoolId,
      createdBy: user.id,
      classes: Array.isArray(classes) ? classes : [],
      isPublished: false,
      sections: []
    })

    // Populate before returning
    const populatedCourse = await Course.findById(course._id)
      .populate('createdBy', 'name email')
      .populate('schoolId', 'name code')

    return NextResponse.json({
      success: true,
      message: 'Course created successfully',
      course: populatedCourse
    }, { status: 201 })

  } catch (error: any) {
    console.error('Create course error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
