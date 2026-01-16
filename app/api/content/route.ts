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

  const query: any = {}
  
  // If section is provided, filter by section
  if (section) {
    query.section = section
  }
  
  // Only filter by owner for teachers (not for students viewing content)
  // Teachers see their own content, students/admins see all content for the section
  if (teacher && !section) {
    query.owner = teacher.id
  }
  
  const items = await Content.find(query).sort({ createdAt: -1 }).lean()
  console.log(`Found ${items.length} content items for query:`, query)
  
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
