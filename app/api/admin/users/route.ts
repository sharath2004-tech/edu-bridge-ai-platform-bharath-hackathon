import { getSession } from '@/lib/auth'
import { generatePassword, sendAdminCredentials } from '@/lib/email'
import { User } from '@/lib/models'
import School from '@/lib/models/School'
import connectDB from '@/lib/mongodb'
import bcrypt from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server'

// Admin: create principal, teacher, or student for their school
export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized - Admin access required' }, { status: 401 })
    }

    if (!session.schoolId) {
      return NextResponse.json({ success: false, error: 'No school assigned to this admin' }, { status: 400 })
    }

    await connectDB()
    
    const { name, email, role, phone, sendEmail, assignedClasses } = await req.json()
    
    if (!name || !email || !role) {
      return NextResponse.json({ success: false, error: 'Name, email, and role are required' }, { status: 400 })
    }
    
    // Admin can only create principal, teacher, or student
    if (!['principal', 'teacher', 'student'].includes(role)) {
      return NextResponse.json({ success: false, error: 'Admin can only create principals, teachers, or students' }, { status: 400 })
    }
    
    const exists = await User.findOne({ email: email.toLowerCase() })
    if (exists) {
      return NextResponse.json({ success: false, error: 'User already exists with this email' }, { status: 400 })
    }
    
    // Generate password
    const generatedPassword = generatePassword(12)
    const hashed = await bcrypt.hash(generatedPassword, 10)
    
    // Create user for admin's school
    const userData: any = { 
      name, 
      email: email.toLowerCase(), 
      password: hashed, 
      role,
      schoolId: session.schoolId,
      phone: phone || undefined,
      mustChangePassword: true // Require password change on first login
    }

    // Add assignedClasses for teachers
    if (role === 'teacher' && assignedClasses && Array.isArray(assignedClasses) && assignedClasses.length > 0) {
      userData.assignedClasses = assignedClasses
    }

    const user = await User.create(userData)
    
    // Send email if requested
    if (sendEmail && email) {
      try {
        const school = await School.findById(session.schoolId)
        await sendAdminCredentials(
          email.toLowerCase(),
          name,
          school?.name || 'Your School',
          school?.code || 'N/A',
          generatedPassword
        )
      } catch (emailError) {
        console.error('Error sending email:', emailError)
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'User created successfully',
      user: { 
        id: String(user._id), 
        name: user.name, 
        email: user.email, 
        role: user.role 
      },
      credentials: sendEmail ? undefined : {
        email: email.toLowerCase(),
        password: generatedPassword
      }
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating user:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// Admin: list users from their school only
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized - Admin access required' }, { status: 401 })
    }

    if (!session.schoolId) {
      return NextResponse.json({ success: false, error: 'No school assigned to this admin' }, { status: 400 })
    }

    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const search = searchParams.get('search')
    
    // Build query - only users from admin's school
    const query: any = { schoolId: session.schoolId }
    
    if (role && role !== 'all') {
      query.role = role
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(500)
      .lean()
    
    return NextResponse.json({ 
      success: true, 
      users,
      count: users.length
    })
  } catch (error: any) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// Admin: delete user from their school
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized - Admin access required' }, { status: 401 })
    }

    if (!session.schoolId) {
      return NextResponse.json({ success: false, error: 'No school assigned to this admin' }, { status: 400 })
    }

    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 })
    }
    
    // Find user and verify they belong to admin's school
    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }
    
    if (String(user.schoolId) !== String(session.schoolId)) {
      return NextResponse.json({ success: false, error: 'Cannot delete users from other schools' }, { status: 403 })
    }
    
    await User.findByIdAndDelete(userId)
    
    return NextResponse.json({ 
      success: true, 
      message: 'User deleted successfully'
    })
  } catch (error: any) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
