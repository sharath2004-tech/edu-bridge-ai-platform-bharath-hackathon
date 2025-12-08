import { authenticateAndAuthorize } from '@/lib/auth-middleware';
import Attendance from '@/lib/models/Attendance';
import User from '@/lib/models/User';
import connectDB from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

// GET - List attendance records
export async function GET(request: NextRequest) {
  try {
    const authResult = authenticateAndAuthorize(request, {
      requiredRoles: ['principal', 'teacher', 'super-admin'],
    });

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const user = authResult;
    await connectDB();

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const className = searchParams.get('className');
    const studentId = searchParams.get('studentId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build query
    const query: any = {};

    // School filtering
    if (user.role === 'principal' || user.role === 'teacher') {
      query.schoolId = user.schoolId;
    }

    // Teacher can only see their assigned classes
    if (user.role === 'teacher') {
      const teacherData = await User.findById(user.id).select('assignedClasses');
      if (teacherData && teacherData.assignedClasses) {
        query.className = { $in: teacherData.assignedClasses };
      }
    }

    // Filters
    if (date) {
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);
      const nextDate = new Date(targetDate);
      nextDate.setDate(nextDate.getDate() + 1);
      query.date = { $gte: targetDate, $lt: nextDate };
    }

    if (className) {
      query.className = className;
    }

    if (studentId) {
      query.studentId = studentId;
    }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const attendance = await Attendance.find(query)
      .populate('studentId', 'name email rollNumber className')
      .populate('markedBy', 'name email')
      .sort({ date: -1, className: 1 })
      .limit(500);

    return NextResponse.json({
      success: true,
      attendance,
      count: attendance.length,
    });

  } catch (error: any) {
    console.error('Attendance fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendance records', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Mark attendance (single or bulk)
export async function POST(request: NextRequest) {
  try {
    const authResult = authenticateAndAuthorize(request, {
      requiredRoles: ['principal', 'teacher', 'super-admin'],
    });

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const user = authResult;
    await connectDB();

    const { records } = await request.json();

    if (!records || !Array.isArray(records) || records.length === 0) {
      return NextResponse.json(
        { error: 'Records array is required' },
        { status: 400 }
      );
    }

    // Validate and prepare records
    const preparedRecords = [];

    for (const record of records) {
      const { studentId, className, section, date, status, notes } = record;

      if (!studentId || !className || !date || !status) {
        return NextResponse.json(
          { error: 'Missing required fields: studentId, className, date, status' },
          { status: 400 }
        );
      }

      // Verify student exists and belongs to same school
      const student = await User.findById(studentId);
      if (!student || student.role !== 'student') {
        return NextResponse.json(
          { error: `Student not found: ${studentId}` },
          { status: 404 }
        );
      }

      if (user.role !== 'super-admin' && student.schoolId?.toString() !== user.schoolId) {
        return NextResponse.json(
          { error: 'Cannot mark attendance for students from other schools' },
          { status: 403 }
        );
      }

      // Check if attendance already exists for this student on this date
      const existingAttendance = await Attendance.findOne({
        studentId,
        date: {
          $gte: new Date(date).setHours(0, 0, 0, 0),
          $lt: new Date(date).setHours(23, 59, 59, 999),
        },
      });

      if (existingAttendance) {
        // Update existing record
        existingAttendance.status = status;
        existingAttendance.section = section;
        existingAttendance.notes = notes || '';
        existingAttendance.markedBy = user.id;
        await existingAttendance.save();
        preparedRecords.push(existingAttendance);
      } else {
        // Create new record
        preparedRecords.push({
          studentId,
          schoolId: student.schoolId,
          className,
          section,
          date: new Date(date),
          status,
          notes: notes || '',
          markedBy: user.id,
        });
      }
    }

    // Insert only new records
    const newRecords = preparedRecords.filter(r => !r._id);
    if (newRecords.length > 0) {
      await Attendance.insertMany(newRecords);
    }

    return NextResponse.json({
      success: true,
      message: `Marked attendance for ${records.length} student(s)`,
      count: records.length,
    });

  } catch (error: any) {
    console.error('Attendance mark error:', error);
    return NextResponse.json(
      { error: 'Failed to mark attendance', details: error.message },
      { status: 500 }
    );
  }
}
