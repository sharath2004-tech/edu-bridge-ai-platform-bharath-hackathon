import { getSession } from '@/lib/auth'
import Ticket from '@/lib/models/Ticket'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

// GET - Fetch student's tickets
export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'student') {
      return NextResponse.json({ success: false, error: 'Unauthorized - Student access required' }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    const query: any = { studentId: session.userId }
    
    if (status && status !== 'all') {
      query.status = status
    }

    const tickets = await Ticket.find(query)
      .populate('assignedTo', 'name email role')
      .populate('responses.respondedBy', 'name role')
      .sort({ createdAt: -1 })
      .limit(100)

    return NextResponse.json({
      success: true,
      tickets,
    })
  } catch (error: any) {
    console.error('Error fetching tickets:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// POST - Create a new ticket
export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'student') {
      return NextResponse.json({ success: false, error: 'Unauthorized - Student access required' }, { status: 401 })
    }

    if (!session.schoolId) {
      return NextResponse.json({ success: false, error: 'No school assigned' }, { status: 400 })
    }

    await connectDB()

    const { title, description, category, priority } = await req.json()

    if (!title || !description || !category) {
      return NextResponse.json({ success: false, error: 'Title, description, and category are required' }, { status: 400 })
    }

    const ticket = await Ticket.create({
      title,
      description,
      category,
      priority: priority || 'medium',
      studentId: session.userId,
      schoolId: session.schoolId,
      status: 'open',
      responses: [],
    })

    return NextResponse.json({
      success: true,
      message: 'Ticket created successfully',
      ticket,
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating ticket:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
