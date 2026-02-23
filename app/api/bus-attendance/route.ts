import { getSession } from '@/lib/auth';
import { sendBusAttendanceNotification } from '@/lib/email';
import BusAttendance from '@/lib/models/BusAttendance';
import User from '@/lib/models/User';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

// GET - Fetch bus attendance records
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || !['admin', 'principal', 'teacher', 'super-admin'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const busId = searchParams.get('busId');
    const studentId = searchParams.get('studentId');

    const query: any = {};

    // School isolation (except super-admin)
    if (session.role !== 'super-admin') {
      query.schoolId = session.schoolId;
    }

    if (date) {
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);
      const nextDate = new Date(targetDate);
      nextDate.setDate(nextDate.getDate() + 1);
      
      query.date = {
        $gte: targetDate,
        $lt: nextDate,
      };
    }

    if (busId) {
      query.busId = busId;
    }

    if (studentId) {
      query.studentId = studentId;
    }

    const attendanceRecords = await BusAttendance.find(query)
      .populate('studentId', 'name email rollNo className parentName parentEmail parentPhone transportMode busId')
      .populate('markedBy', 'name email')
      .sort({ date: -1, markedAt: -1 })
      .limit(200);

    return NextResponse.json({
      success: true,
      records: attendanceRecords,
    });
  } catch (error) {
    console.error('Error fetching bus attendance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bus attendance records' },
      { status: 500 }
    );
  }
}

// POST - Mark bus attendance
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || !['admin', 'principal', 'teacher', 'transport', 'super-admin'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();

    const body = await req.json();
    const { studentId, date, status, busId, remarks } = body;

    // Validation
    if (!studentId || !date || !status) {
      return NextResponse.json(
        { error: 'studentId, date, and status are required' },
        { status: 400 }
      );
    }

    if (!['present', 'absent'].includes(status)) {
      return NextResponse.json(
        { error: 'Status must be either "present" or "absent"' },
        { status: 400 }
      );
    }

    // Fetch student to validate and get parent info
    const student = await User.findById(studentId);
    
    if (!student || student.role !== 'student') {
      return NextResponse.json({ error: 'Invalid student ID' }, { status: 400 });
    }

    // Check if student uses bus
    if (student.transportMode !== 'bus') {
      return NextResponse.json(
        { error: 'This student does not use bus transportation' },
        { status: 400 }
      );
    }

    // School isolation check (except super-admin)
    if (session.role !== 'super-admin' && student.schoolId?.toString() !== session.schoolId?.toString()) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    // Check if attendance already exists for this student on this date
    const existing = await BusAttendance.findOne({
      studentId,
      date: attendanceDate,
    });

    let attendanceRecord;

    if (existing) {
      // Update existing record
      existing.status = status;
      existing.busId = busId || student.busId || existing.busId;
      existing.markedBy = new mongoose.Types.ObjectId(session.id);
      existing.markedAt = new Date();
      existing.remarks = remarks;
      existing.notificationSent = false; // Reset to send new notification
      
      attendanceRecord = await existing.save();
    } else {
      // Create new record
      attendanceRecord = await BusAttendance.create({
        studentId,
        schoolId: student.schoolId,
        busId: busId || student.busId,
        date: attendanceDate,
        status,
        markedBy: new mongoose.Types.ObjectId(session.id),
        remarks,
        notificationSent: false,
      });
    }

    // Send notification to parent
    if (student.parentEmail) {
      try {
        const notificationSent = await sendBusAttendanceNotification(
          student.parentEmail,
          student.name,
          student.parentName || 'Parent',
          status,
          attendanceDate,
          busId || student.busId || 'N/A'
        );
        
        // Update notification status
        attendanceRecord.notificationSent = notificationSent;
        await attendanceRecord.save();
      } catch (emailError) {
        console.error('Failed to send notification:', emailError);
        // Continue even if email fails
      }
    }

    // Populate the record before returning
    await attendanceRecord.populate('studentId', 'name email rollNo className parentName parentEmail parentPhone');
    await attendanceRecord.populate('markedBy', 'name email');

    return NextResponse.json({
      success: true,
      message: `Attendance marked as ${status}`,
      record: attendanceRecord,
    });
  } catch (error: any) {
    console.error('Error marking bus attendance:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Attendance already marked for this student today' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to mark bus attendance' },
      { status: 500 }
    );
  }
}

// DELETE - Delete attendance record (admin/principal only)
export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || !['admin', 'principal', 'transport', 'super-admin'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const recordId = searchParams.get('id');

    if (!recordId) {
      return NextResponse.json({ error: 'Record ID is required' }, { status: 400 });
    }

    const record = await BusAttendance.findById(recordId);
    
    if (!record) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    // School isolation check
    if (session.role !== 'super-admin' && record.schoolId?.toString() !== session.schoolId?.toString()) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    await BusAttendance.findByIdAndDelete(recordId);

    return NextResponse.json({
      success: true,
      message: 'Attendance record deleted',
    });
  } catch (error) {
    console.error('Error deleting bus attendance:', error);
    return NextResponse.json(
      { error: 'Failed to delete attendance record' },
      { status: 500 }
    );
  }
}
