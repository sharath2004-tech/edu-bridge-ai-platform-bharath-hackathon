import Class from '@/lib/models/Class'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { schoolId: string } }
) {
  try {
    await connectDB()
    
    const { schoolId } = params
    
    if (!schoolId) {
      return NextResponse.json(
        { success: false, error: 'School ID is required' },
        { status: 400 }
      )
    }

    // Fetch classes for the school
    const classes = await Class.find({ 
      schoolId,
    })
      .select('className section')
      .sort({ className: 1, section: 1 })
      .lean()

    return NextResponse.json({
      success: true,
      classes
    })
  } catch (error: any) {
    console.error('Error fetching school classes:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch classes' },
      { status: 500 }
    )
  }
}
