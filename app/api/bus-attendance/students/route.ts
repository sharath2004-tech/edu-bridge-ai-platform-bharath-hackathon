import { getSession } from '@/lib/auth';
import User from '@/lib/models/User';
import connectDB from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

// GET - Fetch students who use bus transportation
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || !['admin', 'principal', 'teacher', 'transport', 'super-admin'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const busId = searchParams.get('busId');

    const query: any = {
      role: 'student',
      transportMode: 'bus',
      isActive: true,
    };

    // School isolation (except super-admin)
    if (session.role !== 'super-admin') {
      query.schoolId = session.schoolId;
    }

    if (busId) {
      query.busId = busId;
    }

    const students = await User.find(query)
      .select('name email rollNo className section classId parentName parentEmail parentPhone busId transportMode')
      .populate('classId', 'className section')
      .sort({ className: 1, section: 1, rollNo: 1 });

    return NextResponse.json({
      success: true,
      students,
      count: students.length,
    });
  } catch (error) {
    console.error('Error fetching bus students:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bus students' },
      { status: 500 }
    );
  }
}
