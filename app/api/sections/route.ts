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
    // Admin can see all sections
    query = {}
  } else if (teacher) {
    // Teacher sees only their sections
    query = { owner: teacher.id }
  } else if (student) {
    // Student sees sections they belong to
    query = { students: student.id }
  }

  const sections = await Section.find(query)
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
