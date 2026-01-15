import { authenticateAndAuthorize } from '@/lib/auth-middleware'
import { generatePassword } from '@/lib/email'
import { User } from '@/lib/models'
import School from '@/lib/models/School'
import connectDB from '@/lib/mongodb'
import bcrypt from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server'

// GET - List all teachers in principal's school
export async function GET(request: NextRequest) {
  try {
    const authResult = authenticateAndAuthorize(request, {
      requiredRoles: ['principal', 'super-admin'],
      resource: 'teachers',
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
      // Principal can only see teachers in their school
      if (!user.schoolId) {
        return NextResponse.json(
          { success: false, error: 'School information missing' },
          { status: 400 }
        )
      }
      query.schoolId = user.schoolId
    }
    // Super admin can see all teachers (no filter needed)

    query.role = 'teacher'

    const teachers = await User.find(query)
      .select('-password')
      .populate('schoolId', 'name code')
      .sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      teachers
    })

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST - Create a new teacher account (Principal only)
export async function POST(request: NextRequest) {
  try {
    const authResult = authenticateAndAuthorize(request, {
      requiredRoles: ['principal', 'super-admin'],
      resource: 'teachers',
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
      assignedClasses = [],
      assignedSubjects = [],
      bio,
      sendEmail
    } = body

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required' },
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

    // Generate password if not provided
    const generatedPassword = password || generatePassword(12)

    // Validate password length
    if (generatedPassword.length < 6) {
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

    // Check teacher limit based on subscription
    const teacherCount = await User.countDocuments({ 
      schoolId, 
      role: 'teacher' 
    })

    if (teacherCount >= (school.subscription?.maxTeachers || 10)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Teacher limit reached for your subscription plan',
          limit: school.subscription?.maxTeachers
        },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(generatedPassword, 10)

    // Create teacher account
    const teacher = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'teacher',
      phone,
      schoolId,
      assignedClasses: Array.isArray(assignedClasses) ? assignedClasses : [],
      assignedSubjects: Array.isArray(assignedSubjects) ? assignedSubjects : [],
      bio: bio || `Teacher at ${school.name}`,
      mustChangePassword: !password // If auto-generated, must change password
    })

    // Send email if requested
    if (sendEmail && !password) {
      try {
        const { sendTeacherCredentials } = await import('@/lib/email')
        await sendTeacherCredentials(
          email.toLowerCase(),
          name,
          school.name,
          school.code,
          generatedPassword
        )
      } catch (emailError) {
        console.error('Error sending email:', emailError)
      }
    }

    // Update school stats
    await School.findByIdAndUpdate(schoolId, {
      $inc: { 'stats.totalTeachers': 1 }
    })

    // Return teacher data (without password)
    const teacherData = await User.findById(teacher._id)
      .select('-password')
      .populate('schoolId', 'name code')

    return NextResponse.json({
      success: true,
      message: 'Teacher account created successfully',
      teacher: teacherData,
      credentials: (sendEmail || password) ? undefined : {
        email: email.toLowerCase(),
        password: generatedPassword
      }
    }, { status: 201 })

  } catch (error: any) {
    console.error('Create teacher error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
