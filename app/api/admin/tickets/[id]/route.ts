import { getSession } from '@/lib/auth'
import Ticket from '@/lib/models/Ticket'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

// PATCH - Update ticket (status, assign, respond)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    if (!session || !['admin', 'principal', 'teacher'].includes(session.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const { status, assignedTo, message } = await req.json()

    const ticket = await Ticket.findOne({
      _id: params.id,
      schoolId: session.schoolId, // Ensure ticket belongs to admin's school
    })

    if (!ticket) {
      return NextResponse.json({ success: false, error: 'Ticket not found' }, { status: 404 })
    }

    // Update status
    if (status && ['open', 'in-progress', 'resolved', 'closed'].includes(status)) {
      ticket.status = status
    }

    // Update assignment
    if (assignedTo !== undefined) {
      ticket.assignedTo = assignedTo || undefined
    }

    // Add admin response
    if (message && message.trim()) {
      ticket.responses.push({
        message: message.trim(),
        respondedBy: session.userId,
        respondedAt: new Date(),
        isAdmin: true,
      })
    }

    await ticket.save()

    const updatedTicket = await Ticket.findById(params.id)
      .populate('studentId', 'name email rollNo className section')
      .populate('assignedTo', 'name email role')
      .populate('responses.respondedBy', 'name role')

    return NextResponse.json({
      success: true,
      message: 'Ticket updated successfully',
      ticket: updatedTicket,
    })
  } catch (error: any) {
    console.error('Error updating ticket:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// DELETE - Delete ticket (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized - Admin only' }, { status: 401 })
    }

    await connectDB()

    const ticket = await Ticket.findOne({
      _id: params.id,
      schoolId: session.schoolId,
    })

    if (!ticket) {
      return NextResponse.json({ success: false, error: 'Ticket not found' }, { status: 404 })
    }

    await ticket.deleteOne()

    return NextResponse.json({
      success: true,
      message: 'Ticket deleted successfully',
    })
  } catch (error: any) {
    console.error('Error deleting ticket:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
