import { User } from '@/lib/models'
import connectDB from '@/lib/mongodb'
import bcrypt from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { name, email, password, role, schoolId } = await req.json()
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    // Validate school is provided for students, teachers, and principals
    if ((role === 'student' || role === 'teacher' || role === 'principal') && !schoolId) {
      return NextResponse.json({ success: false, error: 'School selection is required' }, { status: 400 })
    }

    const exists = await User.findOne({ email })
    if (exists) {
      return NextResponse.json({ success: false, error: 'User already exists' }, { status: 400 })
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

    const user = await User.create(userData)

    const payload = { 
      id: String(user._id), 
      role: user.role, 
      name: user.name, 
      email: user.email,
      schoolId: user.schoolId ? String(user.schoolId) : undefined
    }
    const res = NextResponse.json({ success: true, data: payload }, { status: 201 })
    res.cookies.set('edubridge_session', JSON.stringify(payload), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
    return res
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
