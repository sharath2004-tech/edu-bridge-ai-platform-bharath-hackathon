import { getSession } from '@/lib/auth';
import BusAttendance from '@/lib/models/BusAttendance';
import User from '@/lib/models/User';
import connectDB from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

// GET - Fetch bus attendance statistics
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || !['admin', 'principal', 'transport', 'super-admin'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const busId = searchParams.get('busId');

    const query: any = {};

    // School isolation (except super-admin)
    if (session.role !== 'super-admin') {
      query.schoolId = session.schoolId;
    }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (busId) {
      query.busId = busId;
    }

    // Get total bus students
    const studentQuery: any = {
      role: 'student',
      transportMode: 'bus',
      isActive: true,
    };

    if (session.role !== 'super-admin') {
      studentQuery.schoolId = session.schoolId;
    }

    if (busId) {
      studentQuery.busId = busId;
    }

    const totalBusStudents = await User.countDocuments(studentQuery);

    // Get attendance statistics
    const [
      totalRecords,
      presentCount,
      absentCount,
      busWiseStats,
    ] = await Promise.all([
      BusAttendance.countDocuments(query),
      BusAttendance.countDocuments({ ...query, status: 'present' }),
      BusAttendance.countDocuments({ ...query, status: 'absent' }),
      BusAttendance.aggregate([
        { $match: query },
        {
          $group: {
            _id: '$busId',
            totalRecords: { $sum: 1 },
            presentCount: {
              $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] }
            },
            absentCount: {
              $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] }
            },
          }
        },
        { $sort: { _id: 1 } }
      ]),
    ]);

    // Get list of all buses
    const buses = await User.distinct('busId', {
      role: 'student',
      transportMode: 'bus',
      busId: { $exists: true, $ne: null },
      ...(session.role !== 'super-admin' ? { schoolId: session.schoolId } : {}),
    });

    return NextResponse.json({
      success: true,
      statistics: {
        totalBusStudents,
        totalRecords,
        presentCount,
        absentCount,
        presentPercentage: totalRecords > 0 ? ((presentCount / totalRecords) * 100).toFixed(2) : '0',
        absentPercentage: totalRecords > 0 ? ((absentCount / totalRecords) * 100).toFixed(2) : '0',
      },
      busWiseStats,
      buses: buses.filter(Boolean),
    });
  } catch (error) {
    console.error('Error fetching bus attendance statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
