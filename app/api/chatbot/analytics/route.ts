import { authenticateAndAuthorize } from '@/lib/auth-middleware';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Analytics endpoint for chatbot
 * Returns role-based school analytics data
 */
export async function POST(req: NextRequest) {
  try {
    const authResult = authenticateAndAuthorize(req, {
      requiredRoles: ['super-admin', 'admin', 'principal', 'teacher'],
    });

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const user = authResult;
    const { query } = await req.json();

    console.log(`📊 Analytics query from ${user.role}: "${query}"`);

    const { db } = await dbConnect();

    // Get role-based school data
    let schoolsData;
    if (user.role === 'super-admin') {
      // Super admin sees ALL schools
      schoolsData = await getAllSchoolsAnalytics(db);
    } else {
      // Others see only their school
      if (!user.schoolId) {
        return NextResponse.json(
          { error: 'School ID not found for user' },
          { status: 400 }
        );
      }
      schoolsData = await getSchoolAnalytics(db, user.schoolId);
    }

    // Handle specific queries
    const specificAnswer = await handleSpecificQuery(db, query, user);

    return NextResponse.json({
      success: true,
      data: schoolsData,
      specificAnswer,
      userRole: user.role,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('❌ Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Get analytics for all schools (super-admin only)
 */
async function getAllSchoolsAnalytics(db: any) {
  const schools = await db.collection('schools').find({ isActive: true }).toArray();

  const analyticsPromises = schools.map(async (school: any) => {
    const schoolId = school._id.toString();

    const [studentsCount, teachersCount, classesCount, marks] = await Promise.all([
      db.collection('users').countDocuments({ schoolId, role: 'student' }),
      db.collection('users').countDocuments({ schoolId, role: 'teacher' }),
      db.collection('classes').countDocuments({ schoolId: new mongoose.Types.ObjectId(schoolId) }),
      db.collection('marks').find({ schoolId: new mongoose.Types.ObjectId(schoolId) }).toArray(),
    ]);

    // Calculate average marks
    const avgMarks = marks.length > 0
      ? marks.reduce((sum: number, m: any) => sum + (m.percentage || 0), 0) / marks.length
      : 0;

    return {
      schoolId,
      schoolName: school.name,
      totalStudents: studentsCount,
      totalTeachers: teachersCount,
      totalClasses: classesCount,
      averageMarks: Math.round(avgMarks * 100) / 100,
      studentTeacherRatio: teachersCount > 0 ? (studentsCount / teachersCount).toFixed(2) : 'N/A',
    };
  });

  return Promise.all(analyticsPromises);
}

/**
 * Get analytics for a specific school
 */
async function getSchoolAnalytics(db: any, schoolId: string) {
  const school = await db.collection('schools').findOne({ _id: new mongoose.Types.ObjectId(schoolId) });

  if (!school) {
    throw new Error('School not found');
  }

  const [studentsCount, teachersCount, classesCount, marks, classes] = await Promise.all([
    db.collection('users').countDocuments({ schoolId, role: 'student' }),
    db.collection('users').countDocuments({ schoolId, role: 'teacher' }),
    db.collection('classes').countDocuments({ schoolId: new mongoose.Types.ObjectId(schoolId) }),
    db.collection('marks').find({ schoolId: new mongoose.Types.ObjectId(schoolId) }).toArray(),
    db.collection('classes').find({ schoolId: new mongoose.Types.ObjectId(schoolId) }).toArray(),
  ]);

  // Calculate average marks
  const avgMarks = marks.length > 0
    ? marks.reduce((sum: number, m: any) => sum + (m.percentage || 0), 0) / marks.length
    : 0;

  // Get class-wise breakdown
  const classBreakdown = await Promise.all(
    classes.map(async (cls: any) => {
      const classStudents = await db.collection('users').countDocuments({
        schoolId,
        role: 'student',
        assignedClass: cls._id.toString(),
      });

      return {
        className: `${cls.className} - ${cls.section}`,
        studentCount: classStudents,
      };
    })
  );

  return [{
    schoolId,
    schoolName: school.name,
    totalStudents: studentsCount,
    totalTeachers: teachersCount,
    totalClasses: classesCount,
    averageMarks: Math.round(avgMarks * 100) / 100,
    studentTeacherRatio: teachersCount > 0 ? (studentsCount / teachersCount).toFixed(2) : 'N/A',
    classBreakdown,
  }];
}

/**
 * Handle specific analytical queries like "who scored lowest in math in class X"
 */
async function handleSpecificQuery(db: any, query: string, user: any): Promise<string | null> {
  const lowerQuery = query.toLowerCase();

  // Query: Who has lowest/highest marks in Subject in Class X
  const markQueryPattern = /(lowest|highest|best|worst|top|bottom).*(marks|score|performance).*(in|for)\s+(\w+).*(?:class|grade)\s+(\w+)/i;
  const match = query.match(markQueryPattern);

  if (match) {
    const [, rankType, , , subject, className] = match;
    const isLowest = rankType.includes('lowest') || rankType.includes('worst') || rankType.includes('bottom');
    
    return await getStudentsByMarks(db, user.schoolId, className, subject, isLowest);
  }

  // Query: Class average/performance
  if (lowerQuery.includes('average') && lowerQuery.includes('class')) {
    const classMatch = query.match(/class\s+(\w+)/i);
    if (classMatch) {
      return await getClassAverage(db, user.schoolId, classMatch[1]);
    }
  }

  // Query: Top performers
  if (lowerQuery.includes('top') && (lowerQuery.includes('student') || lowerQuery.includes('performer'))) {
    return await getTopPerformers(db, user.schoolId);
  }

  return null;
}

/**
 * Get students by marks in a specific subject and class
 */
async function getStudentsByMarks(
  db: any,
  schoolId: string,
  className: string,
  subject: string,
  isLowest: boolean
): Promise<string> {
  try {
    // Find the class
    const classDoc = await db.collection('classes').findOne({
      schoolId: new mongoose.Types.ObjectId(schoolId),
      className: new RegExp(className, 'i'),
    });

    if (!classDoc) {
      return `Class "${className}" not found in your school.`;
    }

    // Find the subject
    const subjectDoc = await db.collection('subjects').findOne({
      schoolId: new mongoose.Types.ObjectId(schoolId),
      name: new RegExp(subject, 'i'),
    });

    if (!subjectDoc) {
      return `Subject "${subject}" not found in your school.`;
    }

    // Get marks for this class and subject
    const marks = await db.collection('marks')
      .find({
        schoolId: new mongoose.Types.ObjectId(schoolId),
        subjectId: subjectDoc._id,
      })
      .sort({ marksScored: isLowest ? 1 : -1 })
      .limit(5)
      .toArray();

    if (marks.length === 0) {
      return `No marks recorded for ${subject} in class ${className} yet.`;
    }

    // Get student details
    const studentsPromises = marks.map(async (mark: any) => {
      const student = await db.collection('users').findOne({ _id: mark.studentId });
      const classInfo = await db.collection('classes').findOne({ _id: new mongoose.Types.ObjectId(student?.assignedClass) });
      
      return {
        name: student?.name || 'Unknown',
        marks: mark.marksScored,
        total: mark.totalMarks || 100,
        percentage: mark.percentage || ((mark.marksScored / (mark.totalMarks || 100)) * 100).toFixed(2),
        class: classInfo ? `${classInfo.className}-${classInfo.section}` : className,
      };
    });

    const students = await Promise.all(studentsPromises);

    const title = isLowest ? 'Lowest' : 'Highest';
    let response = `📊 ${title} Performers in ${subject} (Class ${className}):\n\n`;
    
    students.forEach((s, idx) => {
      response += `${idx + 1}. ${s.name} - ${s.marks}/${s.total} (${s.percentage}%)\n`;
    });

    return response;
  } catch (error: any) {
    console.error('Error in getStudentsByMarks:', error);
    return `Unable to fetch marks data. Error: ${error.message}`;
  }
}

/**
 * Get class average marks
 */
async function getClassAverage(db: any, schoolId: string, className: string): Promise<string> {
  try {
    const classDoc = await db.collection('classes').findOne({
      schoolId: new mongoose.Types.ObjectId(schoolId),
      className: new RegExp(className, 'i'),
    });

    if (!classDoc) {
      return `Class "${className}" not found.`;
    }

    const students = await db.collection('users').find({
      schoolId,
      role: 'student',
      assignedClass: classDoc._id.toString(),
    }).toArray();

    const studentIds = students.map((s: any) => s._id);

    const marks = await db.collection('marks').find({
      schoolId: new mongoose.Types.ObjectId(schoolId),
      studentId: { $in: studentIds },
    }).toArray();

    if (marks.length === 0) {
      return `No marks recorded for class ${className} yet.`;
    }

    const avgPercentage = marks.reduce((sum: number, m: any) => sum + (m.percentage || 0), 0) / marks.length;

    return `📊 Class ${className} Average: ${avgPercentage.toFixed(2)}% (Total Students: ${students.length})`;
  } catch (error: any) {
    return `Unable to fetch class data. Error: ${error.message}`;
  }
}

/**
 * Get top performers in the school
 */
async function getTopPerformers(db: any, schoolId: string): Promise<string> {
  try {
    const marks = await db.collection('marks')
      .find({ schoolId: new mongoose.Types.ObjectId(schoolId) })
      .sort({ percentage: -1 })
      .limit(10)
      .toArray();

    if (marks.length === 0) {
      return 'No marks recorded yet.';
    }

    const studentsPromises = marks.map(async (mark: any) => {
      const student = await db.collection('users').findOne({ _id: mark.studentId });
      const subject = await db.collection('subjects').findOne({ _id: mark.subjectId });
      
      return {
        name: student?.name || 'Unknown',
        subject: subject?.name || 'Unknown',
        percentage: mark.percentage || 0,
      };
    });

    const students = await Promise.all(studentsPromises);

    let response = '🏆 Top Performers:\n\n';
    students.forEach((s, idx) => {
      response += `${idx + 1}. ${s.name} - ${s.subject}: ${s.percentage.toFixed(2)}%\n`;
    });

    return response;
  } catch (error: any) {
    return `Unable to fetch top performers. Error: ${error.message}`;
  }
}
