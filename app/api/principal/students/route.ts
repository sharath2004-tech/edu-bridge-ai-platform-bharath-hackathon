import { authenticateAndAuthorize } from '@/lib/auth-middleware'
import { User } from '@/lib/models'
import School from '@/lib/models/School'
import connectDB from '@/lib/mongodb'
import bcrypt from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server'

// GET - List all students (filtered by role and school)
export async function GET(request: NextRequest) {
  try {
    const authResult = authenticateAndAuthorize(request, {
      requiredRoles: ['principal', 'teacher', 'super-admin'],
      resource: 'students',
      action: 'read'
    })

    if (authResult instanceof NextResponse) {
      return authResult
    }

    const user = authResult
    await connectDB()

    const { searchParams } = new URL(request.url)
    const className = searchParams.get('class')
    const section = searchParams.get('section')

    // Build query based on role
    const query: any = { role: 'student' }
    
    if (user.role === 'principal' || user.role === 'teacher') {
      // Principal and teachers can only see students in their school
      if (!user.schoolId) {
        return NextResponse.json(
          { success: false, error: 'School information missing' },
          { status: 400 }
        )
      }
      query.schoolId = user.schoolId
    }

    // Teachers can only see students in their assigned classes
    if (user.role === 'teacher') {
      // Get teacher data to check assigned classes
      const teacherData = await User.findById(user.id).select('assignedClasses')
      if (teacherData && teacherData.assignedClasses && teacherData.assignedClasses.length > 0) {
        query.className = { $in: teacherData.assignedClasses }
      } else {
        // Teacher has no assigned classes, return empty
        return NextResponse.json({
          success: true,
          students: [],
          message: 'No assigned classes'
        })
      }
    }

    // Filter by class if provided
    if (className) {
      query.className = className
    }

    // Filter by section if provided
    if (section) {
      query.section = section
    }

    const students = await User.find(query)
      .select('-password')
      .populate('schoolId', 'name code')
      .sort({ className: 1, rollNumber: 1 })

    return NextResponse.json({
      success: true,
      students,
      count: students.length
    })

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST - Create a new student (Principal only)
export async function POST(request: NextRequest) {
  try {
    const authResult = authenticateAndAuthorize(request, {
      requiredRoles: ['principal', 'super-admin'],
      resource: 'students',
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
      name, 
      email, 
      password, 
      phone,
      className,
      section,
      rollNumber,
      bio
    } = body

    // Validate required fields
    if (!name || !email || !password || !className) {
      return NextResponse.json(
        { success: false, error: 'Name, email, password, and class are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Get school ID
    let schoolId = user.schoolId
    
    // If super admin, they must provide schoolId
    if (user.role === 'super-admin' && body.schoolId) {
      schoolId = body.schoolId
    }

    if (!schoolId) {
      return NextResponse.json(
        { success: false, error: 'School information required' },
        { status: 400 }
      )
    }

    // Verify school exists and is active
    const school = await School.findById(schoolId)
    if (!school) {
      return NextResponse.json(
        { success: false, error: 'School not found' },
        { status: 404 }
      )
    }

    if (!school.isActive) {
      return NextResponse.json(
        { success: false, error: 'School is not active' },
        { status: 400 }
      )
    }

    // Check student limit based on subscription
    const studentCount = await User.countDocuments({ 
      schoolId, 
      role: 'student' 
    })

    if (studentCount >= (school.subscription?.maxStudents || 100)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Student limit reached for your subscription plan',
          limit: school.subscription?.maxStudents
        },
        { status: 400 }
      )
    }

    // Check if roll number already exists in the same class
    if (rollNumber) {
      const existingRoll = await User.findOne({ 
        schoolId, 
        className, 
        rollNumber 
      })
      if (existingRoll) {
        return NextResponse.json(
          { success: false, error: 'Roll number already exists in this class' },
          { status: 400 }
        )
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create student account
    const student = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'student',
      phone,
      schoolId,
      className,
      section,
      rollNumber,
      bio: bio || `Student at ${school.name}`
    })

    // Update school stats
    await School.findByIdAndUpdate(schoolId, {
      $inc: { 'stats.totalStudents': 1 }
    })

    // Return student data (without password)
    const studentData = await User.findById(student._id)
      .select('-password')
      .populate('schoolId', 'name code')

    return NextResponse.json({
      success: true,
      message: 'Student enrolled successfully',
      student: studentData
    }, { status: 201 })

  } catch (error: any) {
    console.error('Enroll student error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Delete a student
export async function DELETE(request: NextRequest) {
  try {
    const authResult = authenticateAndAuthorize(request, {
      requiredRoles: ['principal', 'super-admin'],
      resource: 'students',
      action: 'delete',
      scope: 'school'
    })

    if (authResult instanceof NextResponse) {
      return authResult
    }

    const user = authResult
    await connectDB()

    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('id')

    if (!studentId) {
      return NextResponse.json(
        { success: false, error: 'Student ID is required' },
        { status: 400 }
      )
    }

    // Find the student
    const student = await User.findById(studentId)
    if (!student) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      )
    }

    // Verify student belongs to same school (unless super-admin)
    if (user.role !== 'super-admin' && student.schoolId?.toString() !== user.schoolId) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete students from other schools' },
        { status: 403 }
      )
    }

    // Verify it's a student
    if (student.role !== 'student') {
      return NextResponse.json(
        { success: false, error: 'Can only delete student accounts' },
        { status: 400 }
      )
    }

    // Delete the student
    await User.findByIdAndDelete(studentId)

    // Update school stats
    if (student.schoolId) {
      await School.findByIdAndUpdate(student.schoolId, {
        $inc: { 'stats.totalStudents': -1 }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Student deleted successfully'
    })

  } catch (error: any) {
    console.error('Delete student error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
