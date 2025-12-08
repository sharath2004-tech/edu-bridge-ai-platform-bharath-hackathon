import { requireRole } from '@/lib/auth'
import { User } from '@/lib/models'
import connectDB from '@/lib/mongodb'
import bcrypt from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server'

// Admin: create teacher or admin
export async function POST(req: NextRequest) {
  const session = await requireRole('admin')
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }
  await connectDB()
  const { name, email, password, role } = await req.json()
  if (!name || !email || !password) {
    return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
  }
  if (!['teacher','admin'].includes(role)) {
    return NextResponse.json({ success: false, error: 'Role must be teacher or admin' }, { status: 400 })
  }
  const exists = await User.findOne({ email })
  if (exists) {
    return NextResponse.json({ success: false, error: 'User already exists' }, { status: 400 })
  }
  const hashed = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email, password: hashed, role })
  return NextResponse.json({ success: true, data: { id: String(user._id), name: user.name, email: user.email, role: user.role } }, { status: 201 })
}

// Admin: list users
export async function GET() {
  const session = await requireRole('admin')
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }
  await connectDB()
  const users = await User.find().select('-password').limit(100)
  return NextResponse.json({ success: true, data: users })
}
