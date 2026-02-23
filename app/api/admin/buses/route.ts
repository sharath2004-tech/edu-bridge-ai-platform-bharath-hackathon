import { getSession } from '@/lib/auth'
import Bus from '@/lib/models/Bus'
import User from '@/lib/models/User'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

// GET: Fetch all buses for admin's school
export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !['admin', 'principal', 'super-admin'].includes(session.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    if (!session.schoolId && session.role !== 'super-admin') {
      return NextResponse.json({ success: false, error: 'No school assigned' }, { status: 400 })
    }

    await connectDB()

    const query = session.role === 'super-admin' && !session.schoolId 
      ? {} 
      : { schoolId: session.schoolId }

    const buses = await Bus.find(query)
      .populate('schoolId', 'name code')
      .sort({ busNumber: 1 })
      .lean()

    // Get student count for each bus
    const busesWithStudents = await Promise.all(
      buses.map(async (bus) => {
        const studentCount = await User.countDocuments({
          role: 'student',
          transportMode: 'bus',
          busId: bus._id,
          isActive: true
        })
        return {
          ...bus,
          studentCount
        }
      })
    )

    return NextResponse.json({
      success: true,
      buses: busesWithStudents
    })
  } catch (error: any) {
    console.error('Error fetching buses:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch buses' },
      { status: 500 }
    )
  }
}

// POST: Create a new bus
export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    
    console.log('Bus creation - Session:', { 
      role: session?.role, 
      schoolId: session?.schoolId,
      hasSession: !!session 
    })
    
    if (!session || !['admin', 'principal', 'super-admin'].includes(session.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    if (!session.schoolId && session.role !== 'super-admin') {
      return NextResponse.json({ success: false, error: 'No school assigned' }, { status: 400 })
    }

    await connectDB()

    const body = await req.json()
    console.log('Bus creation - Request body:', body)
    
    const { busNumber, routeName, capacity, driverName, driverPhone, schoolId } = body

    if (!busNumber || !routeName || !capacity) {
      return NextResponse.json(
        { success: false, error: 'Bus number, route name, and capacity are required' },
        { status: 400 }
      )
    }

    // Use provided schoolId for super-admin, otherwise use session schoolId
    const targetSchoolId = session.role === 'super-admin' && schoolId ? schoolId : session.schoolId
    
    console.log('Bus creation - Target schoolId:', targetSchoolId)

    if (!targetSchoolId) {
      return NextResponse.json(
        { success: false, error: 'School ID is required' },
        { status: 400 }
      )
    }

    // Check if bus number already exists for this school
    const existingBus = await Bus.findOne({
      schoolId: targetSchoolId,
      busNumber: busNumber.toUpperCase()
    })

    if (existingBus) {
      return NextResponse.json(
        { success: false, error: 'Bus number already exists for this school' },
        { status: 400 }
      )
    }

    const busData = {
      schoolId: targetSchoolId,
      busNumber: busNumber.toUpperCase(),
      routeName,
      capacity: Number(capacity),
      driverName: driverName || undefined,
      driverPhone: driverPhone || undefined,
      isActive: true
    }
    
    console.log('Bus creation - Creating bus with data:', busData)
    
    const bus = await Bus.create(busData)
    
    console.log('Bus creation - Success:', bus._id)

    return NextResponse.json({
      success: true,
      message: 'Bus created successfully',
      bus
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating bus - Full error:', error)
    console.error('Error stack:', error.stack)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create bus' },
      { status: 500 }
    )
  }
}

// DELETE: Delete a bus
export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !['admin', 'principal', 'super-admin'].includes(session.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(req.url)
    const busId = searchParams.get('id')

    if (!busId) {
      return NextResponse.json(
        { success: false, error: 'Bus ID is required' },
        { status: 400 }
      )
    }

    const bus = await Bus.findById(busId)

    if (!bus) {
      return NextResponse.json(
        { success: false, error: 'Bus not found' },
        { status: 404 }
      )
    }

    // Check authorization (non-super-admin can only delete buses from their school)
    if (session.role !== 'super-admin' && bus.schoolId.toString() !== session.schoolId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized to delete this bus' },
        { status: 403 }
      )
    }

    // Check if any students are assigned to this bus
    const studentCount = await User.countDocuments({
      transportMode: 'bus',
      busId: busId,
      isActive: true
    })

    if (studentCount > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Cannot delete bus. ${studentCount} student(s) are currently assigned to this bus.` 
        },
        { status: 400 }
      )
    }

    await Bus.findByIdAndDelete(busId)

    return NextResponse.json({
      success: true,
      message: 'Bus deleted successfully'
    })
  } catch (error: any) {
    console.error('Error deleting bus:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete bus' },
      { status: 500 }
    )
  }
}
