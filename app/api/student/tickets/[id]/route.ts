import { getSession } from '@/lib/auth'
import Ticket from '@/lib/models/Ticket'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

// PATCH - Add response to ticket (student reply)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'student') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const { message } = await req.json()

    if (!message || !message.trim()) {
      return NextResponse.json({ success: false, error: 'Message is required' }, { status: 400 })
    }

    const ticket = await Ticket.findOne({
      _id: params.id,
      studentId: session.userId, // Ensure student owns this ticket
    })

    if (!ticket) {
      return NextResponse.json({ success: false, error: 'Ticket not found' }, { status: 404 })
    }

    ticket.responses.push({
      message: message.trim(),
      respondedBy: session.userId,
      respondedAt: new Date(),
      isAdmin: false,
    })

    await ticket.save()

    const updatedTicket = await Ticket.findById(params.id)
      .populate('assignedTo', 'name email role')
      .populate('responses.respondedBy', 'name role')

    return NextResponse.json({
      success: true,
      message: 'Response added successfully',
      ticket: updatedTicket,
    })
  } catch (error: any) {
    console.error('Error adding response:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
