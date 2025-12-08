import connectDB from '@/lib/mongodb'
import Class from '@/lib/models/Class'
import Subject from '@/lib/models/Subject'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId')

    const query: any = {}
    if (schoolId && schoolId !== 'all') {
      query.schoolId = schoolId
    }

    const classes = await Class.find(query)
      .populate('schoolId', 'name code')
      .populate('classTeacherId', 'name email')
      .select('-__v')
      .sort({ className: 1, section: 1 })
      .lean()

    // Get subject count for each class
    const classesWithSubjects = await Promise.all(
      classes.map(async (classItem) => {
        const subjectCount = await Subject.countDocuments({ classId: classItem._id })
        return {
          ...classItem,
          subjectCount
        }
      })
    )

    return NextResponse.json({
      success: true,
      classes: classesWithSubjects,
      count: classesWithSubjects.length
    })
  } catch (error: any) {
    console.error('Error fetching classes:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
