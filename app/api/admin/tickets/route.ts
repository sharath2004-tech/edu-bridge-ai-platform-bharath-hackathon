import { getSession } from '@/lib/auth'
import Ticket from '@/lib/models/Ticket'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

// GET - Fetch all tickets for school
export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !['admin', 'principal'].includes(session.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized - Admin access required' }, { status: 401 })
    }

    if (!session.schoolId) {
      return NextResponse.json({ success: false, error: 'No school assigned' }, { status: 400 })
    }

    await connectDB()

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const priority = searchParams.get('priority')

    const query: any = { schoolId: session.schoolId }
    
    if (status && status !== 'all') {
      query.status = status
    }
    
    if (category && category !== 'all') {
      query.category = category
    }
    
    if (priority && priority !== 'all') {
      query.priority = priority
    }

    const tickets = await Ticket.find(query)
      .populate('studentId', 'name email rollNo className section classId')
      .populate('assignedTo', 'name email role')
      .populate('responses.respondedBy', 'name role')
      .sort({ createdAt: -1 })
      .limit(200)

    // Count statistics
    const stats = await Ticket.aggregate([
      { $match: { schoolId: session.schoolId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ])

    const statusCounts = {
      open: 0,
      'in-progress': 0,
      resolved: 0,
      closed: 0,
    }

    stats.forEach((stat) => {
      statusCounts[stat._id as keyof typeof statusCounts] = stat.count
    })

    return NextResponse.json({
      success: true,
      tickets,
      stats: statusCounts,
    })
  } catch (error: any) {
    console.error('Error fetching tickets:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
