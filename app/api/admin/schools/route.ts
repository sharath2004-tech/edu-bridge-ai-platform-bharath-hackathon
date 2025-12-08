import { getSession } from '@/lib/auth'
import School from '@/lib/models/School'
import User from '@/lib/models/User'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

// GET - Fetch all schools or a specific school
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('id')
    const code = searchParams.get('code')

    if (schoolId) {
      const school = await School.findById(schoolId)
      if (!school) {
        return NextResponse.json(
          { success: false, error: 'School not found' },
          { status: 404 }
        )
      }
      
      // Get school statistics
      const totalStudents = await User.countDocuments({ schoolId: school._id, role: 'student' })
      const totalTeachers = await User.countDocuments({ schoolId: school._id, role: 'teacher' })
      
      school.stats = {
        totalStudents,
        totalTeachers,
        totalCourses: school.stats?.totalCourses || 0
      }
      await school.save()

      return NextResponse.json({ success: true, school })
    }

    if (code) {
      const school = await School.findOne({ code: code.toUpperCase() })
      if (!school) {
        return NextResponse.json(
          { success: false, error: 'School not found' },
          { status: 404 }
        )
      }
      return NextResponse.json({ success: true, school })
    }

    // Fetch all schools with stats
    const schools = await School.find().sort({ createdAt: -1 })
    
    // Update stats for all schools
    for (const school of schools) {
      const totalStudents = await User.countDocuments({ schoolId: school._id, role: 'student' })
      const totalTeachers = await User.countDocuments({ schoolId: school._id, role: 'teacher' })
      
      school.stats = {
        totalStudents,
        totalTeachers,
        totalCourses: school.stats?.totalCourses || 0
      }
      await school.save()
    }

    return NextResponse.json({ success: true, schools })
  } catch (error: any) {
    console.error('Error fetching schools:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch schools', message: error.message },
      { status: 500 }
    )
  }
}

// POST - Create a new school
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    await connectDB()

    const data = await request.json()
    const {
      name,
      code,
      email,
      phone,
      address,
      principal,
      website,
      established,
      type,
      board,
      subscription
    } = data

    // Validate required fields
    if (!name || !code || !email || !address?.city || !address?.state || !address?.country) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if school code already exists
    const existingCode = await School.findOne({ code: code.toUpperCase() })
    if (existingCode) {
      return NextResponse.json(
        { success: false, error: 'School code already exists' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingEmail = await School.findOne({ email: email.toLowerCase() })
    if (existingEmail) {
      return NextResponse.json(
        { success: false, error: 'School email already exists' },
        { status: 400 }
      )
    }

    const school = await School.create({
      name,
      code: code.toUpperCase(),
      email: email.toLowerCase(),
      phone,
      address,
      principal,
      website,
      established,
      type: type || 'secondary',
      board,
      isActive: true,
      subscription: subscription || {
        plan: 'free',
        startDate: new Date(),
        maxStudents: 100,
        maxTeachers: 10
      },
      stats: {
        totalStudents: 0,
        totalTeachers: 0,
        totalCourses: 0
      }
    })

    return NextResponse.json(
      { success: true, school, message: 'School registered successfully' },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating school:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create school', message: error.message },
      { status: 500 }
    )
  }
}

// PUT - Update a school
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    await connectDB()

    const data = await request.json()
    const { schoolId, ...updateData } = data

    if (!schoolId) {
      return NextResponse.json(
        { success: false, error: 'School ID is required' },
        { status: 400 }
      )
    }

    const school = await School.findByIdAndUpdate(
      schoolId,
      { $set: updateData },
      { new: true, runValidators: true }
    )

    if (!school) {
      return NextResponse.json(
        { success: false, error: 'School not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: true, school, message: 'School updated successfully' }
    )
  } catch (error: any) {
    console.error('Error updating school:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update school', message: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Delete a school
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('id')

    if (!schoolId) {
      return NextResponse.json(
        { success: false, error: 'School ID is required' },
        { status: 400 }
      )
    }

    // Check if school has users
    const usersCount = await User.countDocuments({ schoolId })
    if (usersCount > 0) {
      return NextResponse.json(
        { success: false, error: `Cannot delete school with ${usersCount} active users` },
        { status: 400 }
      )
    }

    const school = await School.findByIdAndDelete(schoolId)

    if (!school) {
      return NextResponse.json(
        { success: false, error: 'School not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'School deleted successfully' }
    )
  } catch (error: any) {
    console.error('Error deleting school:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete school', message: error.message },
      { status: 500 }
    )
  }
}
