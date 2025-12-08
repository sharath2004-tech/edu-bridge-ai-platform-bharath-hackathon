import { authenticateAndAuthorize } from '@/lib/auth-middleware';
import Mark from '@/lib/models/Mark';
import User from '@/lib/models/User';
import connectDB from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

// GET - List marks/grades
export async function GET(request: NextRequest) {
  try {
    const authResult = authenticateAndAuthorize(request, {
      requiredRoles: ['principal', 'teacher', 'student', 'super-admin'],
    });

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const user = authResult;
    await connectDB();

    const { searchParams } = new URL(request.url);
    const className = searchParams.get('className');
    const subject = searchParams.get('subject');
    const term = searchParams.get('term');
    const studentId = searchParams.get('studentId');
    const examType = searchParams.get('examType');

    // Build query
    const query: any = {};

    // School filtering
    if (user.role === 'principal' || user.role === 'teacher') {
      query.schoolId = user.schoolId;
    }

    // Student can only see their own marks
    if (user.role === 'student') {
      query.studentId = user.id;
    }

    // Teacher can only see marks for their assigned classes/subjects
    if (user.role === 'teacher') {
      const teacherData = await User.findById(user.id).select('assignedClasses assignedSubjects');
      if (teacherData) {
        if (teacherData.assignedClasses) {
          query.className = { $in: teacherData.assignedClasses };
        }
        if (teacherData.assignedSubjects) {
          query.subject = { $in: teacherData.assignedSubjects };
        }
      }
    }

    // Filters
    if (className) query.className = className;
    if (subject) query.subject = subject;
    if (term) query.term = term;
    if (studentId) query.studentId = studentId;
    if (examType) query.examType = examType;

    const marks = await Mark.find(query)
      .populate('studentId', 'name email rollNumber className')
      .populate('markedBy', 'name email')
      .sort({ examDate: -1, className: 1, subject: 1 })
      .limit(500);

    // Calculate statistics if viewing all marks for a class
    let statistics = null;
    if (className && !studentId) {
      const classMarks = marks.filter(m => m.className === className);
      if (classMarks.length > 0) {
        const avgPercentage = classMarks.reduce((sum, m) => sum + m.percentage, 0) / classMarks.length;
        const passed = classMarks.filter(m => m.percentage >= 40).length;
        const failed = classMarks.length - passed;

        statistics = {
          totalStudents: classMarks.length,
          averagePercentage: Math.round(avgPercentage * 100) / 100,
          passed,
          failed,
          passPercentage: Math.round((passed / classMarks.length) * 100),
        };
      }
    }

    return NextResponse.json({
      success: true,
      marks,
      count: marks.length,
      statistics,
    });

  } catch (error: any) {
    console.error('Marks fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch marks', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create marks (single or bulk)
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
      const {
        studentId,
        className,
        subject,
        examType,
        examName,
        marksObtained,
        totalMarks,
        term,
        examDate,
        remarks
      } = record;

      if (!studentId || !className || !subject || !examType || !examName ||
          marksObtained === undefined || !totalMarks || !term || !examDate) {
        return NextResponse.json(
          { error: 'Missing required fields in one or more records' },
          { status: 400 }
        );
      }

      if (marksObtained > totalMarks) {
        return NextResponse.json(
          { error: `Marks obtained (${marksObtained}) cannot exceed total marks (${totalMarks})` },
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
          { error: 'Cannot enter marks for students from other schools' },
          { status: 403 }
        );
      }

      preparedRecords.push({
        studentId,
        schoolId: student.schoolId,
        className,
        subject,
        examType,
        examName,
        marksObtained,
        totalMarks,
        term,
        examDate: new Date(examDate),
        remarks: remarks || '',
        markedBy: user.id,
      });
    }

    const createdMarks = await Mark.insertMany(preparedRecords);

    return NextResponse.json({
      success: true,
      message: `Created marks for ${createdMarks.length} student(s)`,
      marks: createdMarks,
      count: createdMarks.length,
    });

  } catch (error: any) {
    console.error('Marks creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create marks', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update marks
export async function PUT(request: NextRequest) {
  try {
    const authResult = authenticateAndAuthorize(request, {
      requiredRoles: ['principal', 'teacher', 'super-admin'],
    });

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const user = authResult;
    await connectDB();

    const { markId, marksObtained, remarks } = await request.json();

    if (!markId) {
      return NextResponse.json(
        { error: 'Mark ID is required' },
        { status: 400 }
      );
    }

    const mark = await Mark.findById(markId);
    if (!mark) {
      return NextResponse.json(
        { error: 'Mark record not found' },
        { status: 404 }
      );
    }

    // Check school access
    if (user.role !== 'super-admin' && mark.schoolId?.toString() !== user.schoolId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    if (marksObtained !== undefined) {
      if (marksObtained > mark.totalMarks) {
        return NextResponse.json(
          { error: `Marks obtained (${marksObtained}) cannot exceed total marks (${mark.totalMarks})` },
          { status: 400 }
        );
      }
      mark.marksObtained = marksObtained;
    }

    if (remarks !== undefined) {
      mark.remarks = remarks;
    }

    await mark.save(); // Will trigger pre-save hook to recalculate percentage and grade

    return NextResponse.json({
      success: true,
      message: 'Marks updated successfully',
      mark,
    });

  } catch (error: any) {
    console.error('Marks update error:', error);
    return NextResponse.json(
      { error: 'Failed to update marks', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete marks
export async function DELETE(request: NextRequest) {
  try {
    const authResult = authenticateAndAuthorize(request, {
      requiredRoles: ['principal', 'super-admin'],
    });

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const user = authResult;
    await connectDB();

    const { searchParams } = new URL(request.url);
    const markId = searchParams.get('markId');

    if (!markId) {
      return NextResponse.json(
        { error: 'Mark ID is required' },
        { status: 400 }
      );
    }

    const mark = await Mark.findById(markId);
    if (!mark) {
      return NextResponse.json(
        { error: 'Mark record not found' },
        { status: 404 }
      );
    }

    // Check school access
    if (user.role !== 'super-admin' && mark.schoolId?.toString() !== user.schoolId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    await Mark.findByIdAndDelete(markId);

    return NextResponse.json({
      success: true,
      message: 'Mark record deleted successfully',
    });

  } catch (error: any) {
    console.error('Marks deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete mark', details: error.message },
      { status: 500 }
    );
  }
}
