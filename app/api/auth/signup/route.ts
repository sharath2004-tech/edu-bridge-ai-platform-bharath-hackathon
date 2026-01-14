import { User } from '@/lib/models'
import connectDB from '@/lib/mongodb'
import bcrypt from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { name, email, password, role, schoolId } = await req.json()
    
    if (!name || !email || !password) {
      return NextResponse.json({ 
        success: false, 
        error: 'Please fill in all required fields (name, email, password)' 
      }, { status: 400 })
    }

    // Validate school is provided for students, teachers, and principals
    if ((role === 'student' || role === 'teacher' || role === 'principal') && !schoolId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Please select a school from the list or enter a valid school code' 
      }, { status: 400 })
    }

    const exists = await User.findOne({ email })
    if (exists) {
      return NextResponse.json({ 
        success: false, 
        error: 'An account with this email already exists. Please login instead.' 
      }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 10)
    const userData: any = { 
      name, 
      email, 
      password: hashed, 
      role: role || 'student'
    }
    
    if (schoolId) {
      userData.schoolId = schoolId
    }

    const newUser = await User.create(userData)
    // Handle both array and single document returns
    const user = Array.isArray(newUser) ? newUser[0] : newUser

    const payload = { 
      id: String(user._id), 
      role: user.role, 
      name: user.name, 
      email: user.email,
      schoolId: user.schoolId ? String(user.schoolId) : undefined
    }
    const res = NextResponse.json({ success: true, data: payload }, { status: 201 })
    
    // Cookie settings that work on Vercel
    res.cookies.set('edubridge_session', JSON.stringify(payload), {
      httpOnly: true,
      secure: true, // Always use secure for production (Vercel uses HTTPS)
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    return res
  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Registration failed. Please try again or contact support.' 
    }, { status: 500 })
  }
}
