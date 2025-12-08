import { requireRole } from '@/lib/auth'
import { Section, User } from '@/lib/models'
import connectDB from '@/lib/mongodb'
import bcrypt from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server'

// Teacher: create student accounts
export async function POST(req: NextRequest) {
  const session = await requireRole('teacher')
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }
  await connectDB()
  const { name, email, password, sectionId } = await req.json()
  if (!name || !email || !password) {
    return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
  }
  const exists = await User.findOne({ email })
  if (exists) {
    return NextResponse.json({ success: false, error: 'User already exists' }, { status: 400 })
  }
  const hashed = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email, password: hashed, role: 'student' })
  
  // Add student to section if sectionId provided
  if (sectionId) {
    await Section.findByIdAndUpdate(sectionId, { $addToSet: { students: user._id } })
  }
  
  return NextResponse.json({ success: true, data: { id: String(user._id), name: user.name, email: user.email, role: user.role } }, { status: 201 })
}

// Teacher: list students
export async function GET() {
  const session = await requireRole('teacher')
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }
  await connectDB()
  const students = await User.find({ role: 'student' }).select('-password').limit(100)
  return NextResponse.json({ success: true, data: students })
}
