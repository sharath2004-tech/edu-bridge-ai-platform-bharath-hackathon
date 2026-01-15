import { User } from '@/lib/models'
import School from '@/lib/models/School'
import connectDB from '@/lib/mongodb'
import bcrypt from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { schoolCode, identifier, password, selectedRole } = await req.json()
    
    // Super admin doesn't need school code
    if (selectedRole === 'super-admin') {
      if (!identifier || !password) {
        return NextResponse.json({ 
          success: false, 
          error: 'Email and password are required' 
        }, { status: 400 })
      }
    } else {
      if (!schoolCode || !identifier || !password) {
        return NextResponse.json({ 
          success: false, 
          error: 'School code, user ID/email, and password are required' 
        }, { status: 400 })
      }
    }

    // Connect to database with error handling
    try {
      await connectDB()
    } catch (dbError: any) {
      console.error('Database connection error:', dbError)
      return NextResponse.json({ 
        success: false, 
        error: 'Database connection failed. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      }, { status: 503 })
    }
    
    // Super admin login - no school required
    if (selectedRole === 'super-admin') {
      const user = await User.findOne({ 
        email: identifier.toLowerCase(),
        role: 'super-admin'
      }).select('+password')
      
      if (!user) {
        return NextResponse.json({ 
          success: false, 
          error: 'Invalid super admin credentials' 
        }, { status: 401 })
      }
      
      const ok = await bcrypt.compare(password, user.password)
      if (!ok) {
        return NextResponse.json({ 
          success: false, 
          error: 'Invalid password' 
        }, { status: 401 })
      }

      // Set session cookie for super admin
      const payload = { 
        id: String(user._id),
        userId: String(user._id),
        role: user.role, 
        name: user.name, 
        email: user.email,
      }
      
      const response = NextResponse.json({ 
        success: true, 
        data: { 
          role: user.role, 
          name: user.name,
          email: user.email,
          mustChangePassword: user.mustChangePassword || false
        } 
      })
      
      response.cookies.set('auth-session', JSON.stringify(payload), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/'
      })
      
      return response
    }
    
    // Regular login - find school by code
    const school = await School.findOne({ code: schoolCode.toUpperCase() })
    if (!school) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid school code' 
      }, { status: 401 })
    }

    if (!school.isActive) {
      return NextResponse.json({ 
        success: false, 
        error: 'School account is inactive. Please contact support.' 
      }, { status: 403 })
    }
    
    // Find user by email or roll number within the school
    // Build query based on identifier type
    const query: any = { schoolId: school._id }
    
    // Check if identifier is a number (roll number)
    if (!isNaN(Number(identifier)) && Number(identifier) > 0) {
      query.rollNo = Number(identifier)
    } else {
      // Otherwise treat as email
      query.email = identifier.toLowerCase()
    }

    console.log('Login query:', { schoolCode, identifier, query })

    const user = await User.findOne(query).select('+password')
    if (!user) {
      console.log('User not found with query:', query)
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid credentials. Please check your email/roll number and password.' 
      }, { status: 401 })
    }
    
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) {
      console.log('Invalid password for user:', user.email)
      return NextResponse.json({ success: false, error: 'Invalid password. Please try again.' }, { status: 401 })
    }

    // Check if student account is pending approval
    if (user.role === 'student' && user.isPending) {
      return NextResponse.json({ 
        success: false, 
        error: 'Your account is pending approval from your class teacher. Please wait for approval before logging in.' 
      }, { status: 403 })
    }

    console.log('Login successful:', { userId: user._id, email: user.email, role: user.role })

    // Validate selected role matches user's actual role
    if (selectedRole && selectedRole !== user.role) {
      console.log('Role mismatch:', { userRole: user.role, selectedRole })
      return NextResponse.json({ 
        success: false, 
        error: `This account is registered as ${user.role}, not ${selectedRole}. Please select the correct role.` 
      }, { status: 403 })
    }

    // Set a simple session cookie with minimal user info
    const payload = { 
      id: String(user._id),
      userId: String(user._id), // For backwards compatibility
      role: user.role, 
      name: user.name, 
      email: user.email,
      schoolId: user.schoolId ? String(user.schoolId) : undefined,
      mustChangePassword: user.mustChangePassword || false
    }
    const res = NextResponse.json({ success: true, data: payload })
    
    // Cookie settings that work on Vercel
    res.cookies.set('edubridge_session', JSON.stringify(payload), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure only in production
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    return res
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Login failed. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}
