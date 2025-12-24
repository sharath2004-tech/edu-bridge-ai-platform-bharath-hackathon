import { User } from '@/lib/models'
import connectDB from '@/lib/mongodb'
import bcrypt from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password required' }, { status: 400 })
    }

    await connectDB()
    
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 })
    }
    
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) {
      return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 })
    }

    // Set a simple session cookie with minimal user info
    const payload = { 
      id: String(user._id), 
      role: user.role, 
      name: user.name, 
      email: user.email,
      schoolId: user.schoolId ? String(user.schoolId) : undefined
    }
    const res = NextResponse.json({ success: true, data: payload })
    
    // Cookie settings that work on Vercel
    res.cookies.set('edubridge_session', JSON.stringify(payload), {
      httpOnly: true,
      secure: true, // Always use secure in production (Vercel uses HTTPS)
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    return res
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Login failed. Please try again.' 
    }, { status: 500 })
  }
}
