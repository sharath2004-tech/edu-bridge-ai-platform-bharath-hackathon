import { getSession } from '@/lib/auth'
import { generatePassword, sendAdminCredentials, sendStudentCredentials, sendTeacherCredentials } from '@/lib/email'
import School from '@/lib/models/School'
import User from '@/lib/models/User'
import connectDB from '@/lib/mongodb'
import bcrypt from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'super-admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Super Admin access required' },
        { status: 401 }
      )
    }

    console.log('Connecting to database...')
    await connectDB()
    console.log('Database connected successfully')

    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const schoolId = searchParams.get('schoolId')
    const classId = searchParams.get('classId')
    const search = searchParams.get('search')

    console.log('Query params:', { role, schoolId, classId, search })

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

    console.log('Built query:', JSON.stringify(query))
    console.log('Fetching users from database...')

    let users
    try {
      users = await User.find(query)
        .populate({
          path: 'schoolId',
          select: 'name code',
          strictPopulate: false
        })
        .populate({
          path: 'classId',
          select: 'className section',
          strictPopulate: false
        })
        .select('-password -__v')
        .sort({ createdAt: -1 })
        .limit(1000)
        .lean()
      console.log(`Successfully fetched ${users.length} users`)
    } catch (populateError: any) {
      console.error('Error with populate:', populateError)
      console.error('Falling back to query without populate')
      // Fallback: fetch without populate
      users = await User.find(query)
        .select('-password -__v')
        .sort({ createdAt: -1 })
        .limit(1000)
        .lean()
      console.log(`Fallback: fetched ${users.length} users without populate`)
    }

    // Transform users to ensure safe data structure
    const transformedUsers = users.map((user: any) => {
      // Handle schoolId - could be populated object, ObjectId, or null
      let schoolInfo = { name: 'N/A', code: 'N/A' }
      if (user.schoolId) {
        if (typeof user.schoolId === 'object' && user.schoolId.name) {
          // Successfully populated
          schoolInfo = {
            name: user.schoolId.name,
            code: user.schoolId.code || 'N/A'
          }
        } else if (typeof user.schoolId === 'string' || user.schoolId._id) {
          // Failed to populate - has ObjectId but no school found
          schoolInfo = {
            name: 'Unknown School',
            code: 'DELETED'
          }
        }
      }

      // Handle classId - could be populated object, ObjectId, or null
      let classInfo = { className: 'N/A', section: 'N/A' }
      if (user.classId) {
        if (typeof user.classId === 'object' && user.classId.className) {
          // Successfully populated
          classInfo = {
            className: user.classId.className,
            section: user.classId.section || 'N/A'
          }
        } else if (typeof user.classId === 'string' || user.classId._id) {
          // Failed to populate - has ObjectId but no class found
          classInfo = {
            className: 'Unknown Class',
            section: 'N/A'
          }
        }
      }

      return {
        ...user,
        schoolId: schoolInfo,
        classId: classInfo
      }
    })

    return NextResponse.json({
      success: true,
      users: transformedUsers,
      count: transformedUsers.length
    })
  } catch (error: any) {
    console.error('Error fetching users:', error)
    console.error('Error stack:', error.stack)
    console.error('Error name:', error.name)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch users' },
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
      isActive: true,
      mustChangePassword: true // Require password change on first login
    })

    // Send email if requested
    if (sendEmail && email) {
      try {
        const school = schoolId ? await School.findById(schoolId) : null
        const schoolName = school?.name || 'EduBridge Platform'
        const schoolCode = school?.code || 'N/A'
        
        // Use appropriate email function based on role
        if (role === 'super-admin' || role === 'admin' || role === 'principal') {
          await sendAdminCredentials(
            email.toLowerCase(),
            name,
            schoolName,
            schoolCode,
            generatedPassword
          )
        } else if (role === 'teacher') {
          await sendTeacherCredentials(
            email.toLowerCase(),
            name,
            schoolName,
            schoolCode,
            generatedPassword
          )
        } else if (role === 'student') {
          await sendStudentCredentials(
            email.toLowerCase(),
            name,
            schoolName,
            schoolCode,
            generatedPassword
          )
        }
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

export async function PATCH(request: NextRequest) {
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
    const { userId, ...updateData } = data

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Find user
    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Validate email uniqueness if email is being changed
    if (updateData.email && updateData.email.toLowerCase() !== user.email) {
      const existingUser = await User.findOne({ email: updateData.email.toLowerCase() })
      if (existingUser) {
        return NextResponse.json(
          { success: false, error: 'Email already exists' },
          { status: 400 }
        )
      }
    }

    // Prepare update object (only allow specific fields)
    const allowedFields = ['name', 'email', 'phone', 'isActive', 'rollNo', 'parentName', 'parentPhone', 'address', 'subjectSpecialization', 'teacherRole']
    const updateObj: any = {}
    
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        if (field === 'email') {
          updateObj[field] = updateData[field].toLowerCase()
        } else {
          updateObj[field] = updateData[field]
        }
      }
    })

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateObj },
      { new: true, runValidators: true }
    )
      .populate('schoolId', 'name code')
      .populate('classId', 'className section')
      .select('-password')
      .lean()

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser
    })
  } catch (error: any) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
