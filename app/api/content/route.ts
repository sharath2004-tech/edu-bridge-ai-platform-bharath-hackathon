import { requireRole } from '@/lib/auth'
import { Content } from '@/lib/models'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const teacher = await requireRole('teacher')
  const admin = await requireRole('admin')
  const student = await requireRole('student')
  const session = teacher || admin || student
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const section = searchParams.get('section')
  await connectDB()

  // Students must specify section and be a member of it
  if (student) {
    if (!section) {
      return NextResponse.json({ success: false, error: 'Section required for students' }, { status: 400 })
    }
    // Verify section membership
    const Section = (await import('@/lib/models/Section')).default
    const sec = await Section.findOne({ _id: section, students: student.id })
    if (!sec) return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
  }

  const query: any = {}
  if (section) query.section = section
  if (teacher) query.owner = teacher.id
  const items = await Content.find(query).sort({ createdAt: -1 })
  return NextResponse.json({ success: true, data: items })
}

export async function POST(req: NextRequest) {
  const session = (await requireRole('teacher')) || (await requireRole('admin'))
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const body = await req.json()
  const { title, description, type, url, text, section } = body
  if (!title || !type || !section) {
    return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
  }
  const item = await Content.create({ title, description, type, url, text, section, owner: session.id })
  return NextResponse.json({ success: true, data: item }, { status: 201 })
}
