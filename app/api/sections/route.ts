import { requireRole } from '@/lib/auth'
import { Section } from '@/lib/models'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const teacher = await requireRole('teacher')
  const admin = await requireRole('admin')
  const student = await requireRole('student')
  const session = teacher || admin || student
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  let query: any = {}
  if (admin) {
    // Admin can see all sections from their school
    const User = (await import('@/lib/models/User')).default
    const user = await User.findById(admin.id)
    if (user?.schoolId) {
      const Section = (await import('@/lib/models/Section')).default
      const User2 = (await import('@/lib/models/User')).default
      const teachers = await User2.find({ schoolId: user.schoolId, role: 'teacher' }).select('_id')
      const teacherIds = teachers.map(t => t._id)
      query = { owner: { $in: teacherIds } }
    }
  } else if (teacher) {
    // Teacher sees only their sections
    query = { owner: teacher.id }
  } else if (student) {
    // For testing: Student sees all sections from their school
    // In production, use: query = { students: student.id }
    const User = (await import('@/lib/models/User')).default
    const user = await User.findById(student.id)
    if (user?.schoolId) {
      const User2 = (await import('@/lib/models/User')).default
      const teachers = await User2.find({ schoolId: user.schoolId, role: 'teacher' }).select('_id')
      const teacherIds = teachers.map(t => t._id)
      query = { owner: { $in: teacherIds } }
    }
  }

  const sections = await Section.find(query).lean()
  console.log(`Found ${sections.length} sections for ${session.role}`)
  return NextResponse.json({ success: true, data: sections })
}

export async function POST(req: NextRequest) {
  const session = (await requireRole('teacher')) || (await requireRole('admin'))
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const { name, students } = await req.json()
  if (!name) return NextResponse.json({ success: false, error: 'Name required' }, { status: 400 })
  const section = await Section.create({ name, owner: session.id, students: students ?? [] })
  return NextResponse.json({ success: true, data: section }, { status: 201 })
}
