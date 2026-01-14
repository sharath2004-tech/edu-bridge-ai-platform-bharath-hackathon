import School from '@/lib/models/School'
import connectDB from '@/lib/mongodb'
import { getSession } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

// GET - Fetch pending schools (not yet approved)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request)
    
    // Only super-admin and admin can view pending schools
    if (!session || (session.role !== 'super-admin' && session.role !== 'admin')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      )
    }

    await connectDB()

    // Get all pending schools (isActive: false)
    const pendingSchools = await School.find({ isActive: false })
      .select('name code email phone address principal type board createdAt')
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({ 
      success: true, 
      schools: pendingSchools,
      count: pendingSchools.length
    })
  } catch (error: any) {
    console.error('Error fetching pending schools:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pending schools', message: error.message },
      { status: 500 }
    )
  }
}
