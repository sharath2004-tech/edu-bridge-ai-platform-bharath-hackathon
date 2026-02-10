import mongoose from 'mongoose';

/**
 * Helper function to get analytics data for chatbot
 * This is called directly by the chatbot route to avoid HTTP fetch loops
 */
export async function getAnalyticsForChatbot(db: any, user: any, query: string) {
  try {
    // Get role-based school data
    let schoolsData;
    if (user.role === 'super-admin') {
      schoolsData = await getAllSchoolsAnalytics(db);
    } else {
      if (!user.schoolId) {
        return { data: null, specificAnswer: 'School ID not found for user' };
      }
      schoolsData = await getSchoolAnalytics(db, user.schoolId);
    }

    // Return comprehensive data - let AI understand and answer naturally
    return {
      data: schoolsData,
      userRole: user.role,
      message: 'All student and school data is available. You can answer any questions about students, marks, classes, performance, toppers, etc.'
    };
  } catch (error: any) {
    console.error('❌ Analytics helper error:', error);
    return {
      data: null,
      specificAnswer: `Unable to fetch analytics: ${error.message}`,
    };
  }
}

/**
 * Get analytics for all schools (super-admin only)
 */
async function getAllSchoolsAnalytics(db: any) {
  const schools = await db.collection('schools').find({ isActive: true }).toArray();

  const analyticsPromises = schools.map(async (school: any) => {
    const schoolIdStr = school._id.toString();
    const schoolIdObj = new mongoose.Types.ObjectId(schoolIdStr);

    const [studentsCount, teachersCount, classesCount, marks, students] = await Promise.all([
      db.collection('users').countDocuments({ schoolId: schoolIdObj, role: 'student' }),
      db.collection('users').countDocuments({ schoolId: schoolIdObj, role: 'teacher' }),
      db.collection('classes').countDocuments({ schoolId: schoolIdObj }),
      db.collection('marks').find({ schoolId: schoolIdObj }).toArray(),
      db.collection('users').find({ schoolId: schoolIdObj, role: 'student' }).toArray(),
    ]);

    console.log(`📊 [${schoolIdStr}] Found ${marks.length} marks entries for ${studentsCount} students`);
    if (marks.length > 0) {
      console.log(`   Sample mark:`, {
        marksScored: marks[0].marksScored,
        totalMarks: marks[0].totalMarks,
        percentage: marks[0].percentage,
      });
    }

    const avgMarks = marks.length > 0
      ? marks.reduce((sum: number, m: any) => {
          const percentage = m.percentage || (m.marksScored && m.totalMarks ? (m.marksScored / m.totalMarks) * 100 : 0);
          return sum + percentage;
        }, 0) / marks.length
      : 0;

    // Get ALL student details with their marks and classes (NO LIMIT - as requested)
    const studentDetails = await Promise.all(
      students.map(async (student: any) => {
        const studentMarks = marks.filter((m: any) => m.studentId.toString() === student._id.toString());
        const avgStudentMarks = studentMarks.length > 0
          ? studentMarks.reduce((sum: number, m: any) => {
              const percentage = m.percentage || (m.marksScored && m.totalMarks ? (m.marksScored / m.totalMarks) * 100 : 0);
              return sum + percentage;
            }, 0) / studentMarks.length
          : 0;
        
        // Get student's class information (use classId field)
        const studentClass = student.classId 
          ? await db.collection('classes').findOne({ _id: student.classId })
          : null;

        // Get subject-wise marks for this student (calculate percentage properly)
        // Only store top 3 subjects to reduce data size
        const subjectMarks = await Promise.all(
          studentMarks.slice(0, 3).map(async (mark: any) => {
            const subject = await db.collection('subjects').findOne({ _id: mark.subjectId });
            const percentage = mark.percentage !== undefined && mark.percentage !== null 
              ? mark.percentage 
              : (mark.marksScored && mark.totalMarks ? (mark.marksScored / mark.totalMarks) * 100 : 0);
            return {
              subj: subject?.name || 'Unknown', // Shortened key
              pct: Math.round(percentage),
            };
          })
        );

        return {
          id: student._id.toString(),
          name: student.name,
          class: studentClass ? `${studentClass.className}-${studentClass.section}` : 'Unassigned',
          avg: Math.round(avgStudentMarks),
          exams: studentMarks.length,
          topSubjects: subjectMarks, // Only top 3 subjects to save space
        };
      })
    );
    
    // Sort by performance for better insights
    studentDetails.sort((a, b) => b.avg - a.avg);
    
    // Calculate proper statistics
    const studentsWithMarks = studentDetails.filter(s => s.totalExams > 0);
    const actualAvgMarks = studentsWithMarks.length > 0
      ? Math.round(studentsWithMarks.reduce((sum, s) => sum + s.avg, 0) / studentsWithMarks.length)
      : 0;

    // Group students by class for easy class-wise queries
    const classwiseData: { [key: string]: any[] } = {};
    studentDetails.forEach(student => {
      // Extract class number (e.g., "10-A" -> "10", "Class 8-B" -> "8")
      const classMatch = student.class.match(/(\d+)/);
      const classNum = classMatch ? classMatch[1] : student.class;
      
      if (!classwiseData[classNum]) {
        classwiseData[classNum] = [];
      }
      classwiseData[classNum].push(student);
    });
    
    // Sort students within each class by performance
    Object.keys(classwiseData).forEach(classNum => {
      classwiseData[classNum].sort((a: any, b: any) => b.avg - a.avg);
    });

    // Create subject-wise toppers efficiently (query marks directly)
    const allSubjects = await db.collection('subjects').find({ schoolId: schoolIdObj }).toArray();
    const subjectwiseToppers: { [key: string]: any[] } = {};
    
    for (const subject of allSubjects.slice(0, 10)) { // Limit to 10 subjects to reduce processing
      const topMarks = await db.collection('marks')
        .find({ 
          schoolId: schoolIdObj, 
          subjectId: subject._id 
        })
        .sort({ marksScored: -1 })
        .limit(5) // Top 5 for each subject
        .toArray();
      
      const topStudentsInSubject = await Promise.all(
        topMarks.map(async (mark: any) => {
          const student = await db.collection('users').findOne({ _id: mark.studentId });
          const studentClass = student?.classId 
            ? await db.collection('classes').findOne({ _id: student.classId })
            : null;
          const pct = mark.percentage !== undefined && mark.percentage !== null 
            ? mark.percentage 
            : (mark.marksScored && mark.totalMarks ? (mark.marksScored / mark.totalMarks) * 100 : 0);
          return {
            name: student?.name || 'Unknown',
            class: studentClass ? `${studentClass.className}-${studentClass.section}` : 'N/A',
            pct: Math.round(pct),
          };
        })
      );
      
      subjectwiseToppers[subject.name] = topStudentsInSubject;
    }

    return {
      school: school.name,
      students: studentsCount,
      studentsWithMarks: studentsWithMarks.length,
      studentsWithoutMarks: studentsCount - studentsWithMarks.length,
      teachers: teachersCount,
      classes: classesCount,
      avgMarks: actualAvgMarks,
      ratio: teachersCount > 0 ? (studentsCount / teachersCount).toFixed(1) : 'N/A',
      topPerformers: studentDetails.slice(0, 10),
      classwiseBreakdown: classwiseData, // Students grouped by class
      subjectwiseToppers, // Top 5 per subject
      // Don't send ALL students - too large for AI
    };
  });

  return Promise.all(analyticsPromises);
}

/**
 * Get analytics for a specific school
 */
async function getSchoolAnalytics(db: any, schoolId: string) {
  const schoolIdObj = new mongoose.Types.ObjectId(schoolId);
  const school = await db.collection('schools').findOne({ _id: schoolIdObj });

  if (!school) {
    throw new Error('School not found');
  }

  const [studentsCount, teachersCount, classesCount, marks, classes, students] = await Promise.all([
    db.collection('users').countDocuments({ schoolId: schoolIdObj, role: 'student' }),
    db.collection('users').countDocuments({ schoolId: schoolIdObj, role: 'teacher' }),
    db.collection('classes').countDocuments({ schoolId: schoolIdObj }),
    db.collection('marks').find({ schoolId: schoolIdObj }).toArray(),
    db.collection('classes').find({ schoolId: schoolIdObj }).toArray(),
    db.collection('users').find({ schoolId: schoolIdObj, role: 'student' }).toArray(),
  ]);

  console.log(`📊 [School ${schoolId}] Found ${marks.length} marks entries for ${studentsCount} students`);

  const avgMarks = marks.length > 0
    ? marks.reduce((sum: number, m: any) => {
        const percentage = m.percentage || (m.marksScored && m.totalMarks ? (m.marksScored / m.totalMarks) * 100 : 0);
        return sum + percentage;
      }, 0) / marks.length
    : 0;

  const classBreakdown = await Promise.all(
    classes.map(async (cls: any) => {
      const classStudents = await db.collection('users').countDocuments({
        schoolId: schoolIdObj,
        role: 'student',
        classId: cls._id, // Use classId, not assignedClass
      });

      return {
        className: `${cls.className} - ${cls.section}`,
        studentCount: classStudents,
      };
    })
  );

  // Get ALL detailed student information (NO LIMIT - as requested)
  const studentDetails = await Promise.all(
    students.map(async (student: any) => {
      const studentMarks = marks.filter((m: any) => m.studentId.toString() === student._id.toString());
      const avgStudentMarks = studentMarks.length > 0
        ? studentMarks.reduce((sum: number, m: any) => {
            const percentage = m.percentage || (m.marksScored && m.totalMarks ? (m.marksScored / m.totalMarks) * 100 : 0);
            return sum + percentage;
          }, 0) / studentMarks.length
        : 0;
      
      // Get student's class information (use classId field)
      const studentClass = student.classId 
        ? await db.collection('classes').findOne({ _id: student.classId })
        : null;

      // Get subject-wise marks for this student (calculate percentage properly)
      // Only store top 3 subjects to reduce data size
      const subjectMarks = await Promise.all(
        studentMarks.slice(0, 3).map(async (mark: any) => {
          const subject = await db.collection('subjects').findOne({ _id: mark.subjectId });
          const percentage = mark.percentage !== undefined && mark.percentage !== null 
            ? mark.percentage 
            : (mark.marksScored && mark.totalMarks ? (mark.marksScored / mark.totalMarks) * 100 : 0);
          return {
            subj: subject?.name || 'Unknown',
            pct: Math.round(percentage),
          };
        })
      );

      return {
        id: student._id.toString(),
        name: student.name,
        class: studentClass ? `${studentClass.className}-${studentClass.section}` : 'Unassigned',
        avg: Math.round(avgStudentMarks),
        exams: studentMarks.length,
        topSubjects: subjectMarks, // Only top 3 subjects
      };
    })
  );
  
  // Sort by performance
  studentDetails.sort((a: any, b: any) => b.avg - a.avg);
  
  // Calculate proper statistics
  const studentsWithMarks = studentDetails.filter(s => s.exams > 0);
  const actualAvgMarks = studentsWithMarks.length > 0
    ? Math.round(studentsWithMarks.reduce((sum, s) => sum + s.avg, 0) / studentsWithMarks.length)
    : 0;

  // Group students by class for easy class-wise queries
  const classwiseData: { [key: string]: any[] } = {};
  studentDetails.forEach(student => {
    // Extract class number (e.g., "10-A" -> "10", "Class 8-B" -> "8")
    const classMatch = student.class.match(/(\d+)/);
    const classNum = classMatch ? classMatch[1] : student.class;
    
    if (!classwiseData[classNum]) {
      classwiseData[classNum] = [];
    }
    classwiseData[classNum].push(student);
  });
  
  // Sort students within each class by performance
  Object.keys(classwiseData).forEach(classNum => {
    classwiseData[classNum].sort((a: any, b: any) => b.avg - a.avg);
  });

  // Create subject-wise toppers efficiently (query marks directly)
  const allSubjects = await db.collection('subjects').find({ schoolId: schoolIdObj }).toArray();
  const subjectwiseToppers: { [key: string]: any[] } = {};
  
  for (const subject of allSubjects.slice(0, 10)) { // Limit to 10 subjects
    const topMarks = await db.collection('marks')
      .find({ 
        schoolId: schoolIdObj, 
        subjectId: subject._id 
      })
      .sort({ marksScored: -1 })
      .limit(5)
      .toArray();
    
    const topStudentsInSubject = await Promise.all(
      topMarks.map(async (mark: any) => {
        const student = await db.collection('users').findOne({ _id: mark.studentId });
        const studentClass = student?.classId 
          ? await db.collection('classes').findOne({ _id: student.classId })
          : null;
        const pct = mark.percentage !== undefined && mark.percentage !== null 
          ? mark.percentage 
          : (mark.marksScored && mark.totalMarks ? (mark.marksScored / mark.totalMarks) * 100 : 0);
        return {
          name: student?.name || 'Unknown',
          class: studentClass ? `${studentClass.className}-${studentClass.section}` : 'N/A',
          pct: Math.round(pct),
        };
      })
    );
    
    subjectwiseToppers[subject.name] = topStudentsInSubject;
  }

  return [{
    school: school.name,
    students: studentsCount,
    studentsWithMarks: studentsWithMarks.length,
    studentsWithoutMarks: studentsCount - studentsWithMarks.length,
    teachers: teachersCount,
    classes: classesCount,
    avgMarks: actualAvgMarks,
    ratio: teachersCount > 0 ? (studentsCount / teachersCount).toFixed(1) : 'N/A',
    classBreakdown,
    topPerformers: studentDetails.slice(0, 10),
    classwiseBreakdown: classwiseData,
    subjectwiseToppers,
  }];
}

/**
 * Handle specific analytical queries
 */
async function handleSpecificQuery(db: any, query: string, user: any): Promise<string | null> {
  const lowerQuery = query.toLowerCase();

  // Query: Class/Grade topper (e.g., "who is class topper in grade 8", "who is topper of class 10")
  const topperPattern = /(topper|top\s+student|rank\s+1|first\s+rank).*(class|grade)\s+(\d+)/i;
  const topperMatch = query.match(topperPattern);
  
  if (topperMatch || (lowerQuery.includes('topper') && /\b\d+\b/.test(lowerQuery))) {
    // Extract class number
    const classNumMatch = query.match(/(?:class|grade)\s+(\d+)/i) || query.match(/\b(\d+)\b/);
    const classNum = classNumMatch ? classNumMatch[1] : null;
    
    if (classNum) {
      return await getClassTopper(db, user, classNum);
    }
  }

  // Query: Who has lowest/highest marks
  const markQueryPattern = /(lowest|highest|best|worst|top|bottom).*(marks|score|performance).*(in|for)\s+(\w+).*(?:class|grade)\s+(\w+)/i;
  const match = query.match(markQueryPattern);

  if (match) {
    const [, rankType, , , subject, className] = match;
    const isLowest = rankType.includes('lowest') || rankType.includes('worst') || rankType.includes('bottom');
    
    return await getStudentsByMarks(db, user.schoolId, className, subject, isLowest);
  }

  // Query: Class average
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

async function getStudentsByMarks(
  db: any,
  schoolId: string,
  className: string,
  subject: string,
  isLowest: boolean
): Promise<string> {
  try {
    const classDoc = await db.collection('classes').findOne({
      schoolId: new mongoose.Types.ObjectId(schoolId),
      className: new RegExp(className, 'i'),
    });

    if (!classDoc) {
      return `Class "${className}" not found.`;
    }

    const subjectDoc = await db.collection('subjects').findOne({
      schoolId: new mongoose.Types.ObjectId(schoolId),
      name: new RegExp(subject, 'i'),
    });

    if (!subjectDoc) {
      return `Subject "${subject}" not found.`;
    }

    const marks = await db.collection('marks')
      .find({
        schoolId: new mongoose.Types.ObjectId(schoolId),
        subjectId: subjectDoc._id,
      })
      .sort({ marksScored: isLowest ? 1 : -1 })
      .limit(5)
      .toArray();

    if (marks.length === 0) {
      return `No marks recorded for ${subject} in class ${className}.`;
    }

    const studentsPromises = marks.map(async (mark: any) => {
      const student = await db.collection('users').findOne({ _id: mark.studentId });
      return {
        name: student?.name || 'Unknown',
        marks: mark.marksScored,
        total: mark.totalMarks || 100,
        percentage: mark.percentage || ((mark.marksScored / (mark.totalMarks || 100)) * 100).toFixed(2),
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
    return `Unable to fetch marks data: ${error.message}`;
  }
}

async function getClassAverage(db: any, schoolId: string, className: string): Promise<string> {
  try {
    const schoolIdObj = new mongoose.Types.ObjectId(schoolId);
    const classDoc = await db.collection('classes').findOne({
      schoolId: schoolIdObj,
      className: new RegExp(className, 'i'),
    });

    if (!classDoc) {
      return `Class "${className}" not found.`;
    }

    const students = await db.collection('users').find({
      schoolId: schoolIdObj,
      role: 'student',
      classId: classDoc._id, // Use classId, not assignedClass
    }).toArray();

    const studentIds = students.map((s: any) => s._id);
    const marks = await db.collection('marks').find({
      schoolId: schoolIdObj,
      studentId: { $in: studentIds },
    }).toArray();

    if (marks.length === 0) {
      return `No marks recorded for class ${className}.`;
    }

    const avgPercentage = marks.reduce((sum: number, m: any) => sum + (m.percentage || 0), 0) / marks.length;
    return `📊 Class ${className} Average: ${avgPercentage.toFixed(2)}% (Total Students: ${students.length})`;
  } catch (error: any) {
    return `Unable to fetch class data: ${error.message}`;
  }
}

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
    return `Unable to fetch top performers: ${error.message}`;
  }
}
/**
 * Get class topper(s) for a specific grade/class
 * Super-admin: searches across all schools
 * School admin/principal: searches only in their school
 */
async function getClassTopper(db: any, user: any, classNum: string): Promise<string> {
  try {
    // Build query based on user role
    let classQuery: any = {
      className: new RegExp(`^${classNum}$|^Class\\s+${classNum}$|^Grade\\s+${classNum}$`, 'i'),
    };

    // If not super-admin, restrict to user's school
    if (user.role !== 'super-admin') {
      if (!user.schoolId) {
        return 'School ID not found for user.';
      }
      classQuery.schoolId = new mongoose.Types.ObjectId(user.schoolId);
    }

    // Find all classes matching the grade/class number
    const classes = await db.collection('classes').find(classQuery).toArray();

    if (classes.length === 0) {
      return `No Class/Grade ${classNum} found${user.role === 'super-admin' ? ' in any school' : ' in your school'}.`;
    }

    console.log(`🔍 Found ${classes.length} classes for Grade/Class ${classNum}`);

    // Get all students from these classes with their marks
    const classIds = classes.map((c: any) => c._id.toString());
    const schoolIds = [...new Set(classes.map((c: any) => c.schoolId))];

    const students = await db.collection('users').find({
      role: 'student',
      classId: { $in: classIds }, // Use classId, not assignedClass
    }).toArray();

    if (students.length === 0) {
      return `No students found in Class/Grade ${classNum}.`;
    }

    console.log(`👥 Found ${students.length} students in Grade/Class ${classNum}`);

    // Get marks for these students
    const studentIds = students.map((s: any) => s._id);
    const marks = await db.collection('marks').find({
      studentId: { $in: studentIds },
      schoolId: { $in: schoolIds },
    }).toArray();

    console.log(`📊 Found ${marks.length} marks entries for these students`);

    // Calculate average marks for each student
    const studentPerformance = students.map((student: any) => {
      const studentMarks = marks.filter((m: any) => m.studentId.toString() === student._id.toString());
      const avgMarks = studentMarks.length > 0
        ? studentMarks.reduce((sum: number, m: any) => {
            const percentage = m.percentage || (m.marksScored && m.totalMarks ? (m.marksScored / m.totalMarks) * 100 : 0);
            return sum + percentage;
          }, 0) / studentMarks.length
        : 0;

      // Get class info for this student
      const studentClass = classes.find((c: any) => c._id.equals(student.classId));
      
      return {
        name: student.name,
        email: student.email,
        avgMarks: Math.round(avgMarks * 100) / 100,
        totalExams: studentMarks.length,
        class: studentClass ? `${studentClass.className} - ${studentClass.section}` : 'Unknown',
        schoolId: student.schoolId,
      };
    });

    // Filter out students with no marks and sort by performance
    const studentsWithMarks = studentPerformance.filter((s: any) => s.totalExams > 0);
    
    if (studentsWithMarks.length === 0) {
      return `No marks recorded for students in Class/Grade ${classNum} yet.`;
    }

    studentsWithMarks.sort((a: any, b: any) => b.avgMarks - a.avgMarks);

    // Get school names if super-admin
    const schoolNames: { [key: string]: string } = {};
    if (user.role === 'super-admin') {
      const schools = await db.collection('schools').find({
        _id: { $in: schoolIds }
      }).toArray();
      schools.forEach((school: any) => {
        schoolNames[school._id.toString()] = school.name;
      });
    }

    // Build response
    let response = `🏆 Top Performers in Class/Grade ${classNum}:\n\n`;
    
    studentsWithMarks.slice(0, 10).forEach((student: any, idx: number) => {
      const schoolName = user.role === 'super-admin' && student.schoolId 
        ? ` (${schoolNames[student.schoolId.toString()] || 'Unknown School'})` 
        : '';
      response += `${idx + 1}. ${student.name}${schoolName} - ${student.class}\n`;
      response += `   Average: ${student.avgMarks}% (${student.totalExams} exams)\n\n`;
    });

    return response;
  } catch (error: any) {
    console.error('Error in getClassTopper:', error);
    return `Unable to fetch class topper: ${error.message}`;
  }
}