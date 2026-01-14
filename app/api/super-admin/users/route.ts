import User from '@/lib/models/User'
import School from '@/lib/models/School'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import bcrypt from 'bcrypt'
import { generatePassword, sendAdminCredentials } from '@/lib/email'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'super-admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Super Admin access required' },
        { status: 401 }
      )
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const schoolId = searchParams.get('schoolId')
    const classId = searchParams.get('classId')
    const search = searchParams.get('search')

    // Build query
    const query: any = {}
    
    if (role && role !== 'all') {
      query.role = role
    }
    
    if (schoolId && schoolId !== 'all') {
      query.schoolId = schoolId
    }
    
    if (classId && classId !== 'all') {
      query.classId = classId
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { rollNo: { $regex: search, $options: 'i' } }
      ]
    }

    const users = await User.find(query)
      .populate('schoolId', 'name code')
      .populate('classId', 'className section')
      .select('-password -__v')
      .sort({ createdAt: -1 })
      .limit(1000)
      .lean()

    return NextResponse.json({
      success: true,
      users,
      count: users.length
    })
  } catch (error: any) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'super-admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Super Admin access required' },
        { status: 401 }
      )
    }

    await connectDB()

    const data = await request.json()
    const { name, email, role, schoolId, phone, sendEmail } = data

    // Validate required fields
    if (!name || !email || !role) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and role are required' },
        { status: 400 }
      )
    }

    // Validate role
    const validRoles = ['super-admin', 'admin', 'principal', 'teacher', 'student']
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already exists' },
        { status: 400 }
      )
    }

    // Validate schoolId for non-super-admin roles
    if (role !== 'super-admin' && !schoolId) {
      return NextResponse.json(
        { success: false, error: 'School is required for this role' },
        { status: 400 }
      )
    }

    // Validate school exists and is active
    if (schoolId) {
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
    }

    // Generate password
    const generatedPassword = generatePassword(12)
    const hashedPassword = await bcrypt.hash(generatedPassword, 10)

    // Create user
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      schoolId: schoolId || undefined,
      phone: phone || undefined,
      isActive: true
    })

    // Send email if requested
    if (sendEmail && email) {
      try {
        const school = schoolId ? await School.findById(schoolId) : null
        await sendAdminCredentials(
          email.toLowerCase(),
          name,
          school?.name || 'EduBridge Platform',
          school?.code || 'N/A',
          generatedPassword
        )
      } catch (emailError) {
        console.error('Error sending email:', emailError)
        // Don't fail user creation if email fails
      }
    }

    const userResponse = await User.findById(newUser._id)
      .populate('schoolId', 'name code')
      .select('-password')
      .lean()

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: userResponse,
      credentials: sendEmail ? undefined : {
        email: email.toLowerCase(),
        password: generatedPassword
      }
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'super-admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Super Admin access required' },
        { status: 401 }
      )
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Prevent deleting self
    if (userId === session.userId) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete your own account' },
        { status: 400 }
      )
    }

    const user = await User.findByIdAndDelete(userId)

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error: any) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
