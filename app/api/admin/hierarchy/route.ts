/**
 * Hierarchy Query Examples API
 * 
 * This endpoint demonstrates how to query the hierarchical database structure
 * with proper population of relationships
 */

import Class from '@/lib/models/Class';
import School from '@/lib/models/School';
import User from '@/lib/models/User';
import dbConnect from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const schoolId = searchParams.get('schoolId');
    
    switch (query) {
      case 'full-hierarchy':
        return await getFullHierarchy(schoolId);
      
      case 'school-with-admins':
        return await getSchoolWithAdmins(schoolId);
      
      case 'school-with-principal':
        return await getSchoolWithPrincipal(schoolId);
      
      case 'school-complete':
        return await getSchoolComplete(schoolId);
      
      case 'class-with-students':
        return await getClassWithStudents();
      
      case 'teacher-with-classes':
        return await getTeacherWithClasses();
      
      case 'hierarchy-stats':
        return await getHierarchyStats();
      
      default:
        return NextResponse.json({
          error: 'Invalid query parameter',
          availableQueries: [
            'full-hierarchy',
            'school-with-admins',
            'school-with-principal',
            'school-complete',
            'class-with-students',
            'teacher-with-classes',
            'hierarchy-stats'
          ]
        }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Hierarchy query error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Get complete hierarchy for a school
async function getFullHierarchy(schoolId: string | null) {
  if (!schoolId) {
    return NextResponse.json({ error: 'schoolId required' }, { status: 400 });
  }
  
  const school = await School.findById(schoolId)
    .populate('adminUsers', 'name email role createdAt')
    .populate('principalUser', 'name email phone role')
    .populate({
      path: 'schoolClasses',
      select: 'className section strength academicYear',
      populate: {
        path: 'classTeacher',
        select: 'name email phone'
      }
    })
    .lean();
  
  if (!school) {
    return NextResponse.json({ error: 'School not found' }, { status: 404 });
  }
  
  // Get student count by class
  const classes = await Class.find({ schoolId }).lean();
  const classesWithStudents = await Promise.all(
    classes.map(async (classDoc) => {
      const studentCount = await User.countDocuments({
        classId: classDoc._id,
        role: 'student'
      });
      
      return {
        ...classDoc,
        studentCount
      };
    })
  );
  
  return NextResponse.json({
    school: {
      id: school._id,
      name: school.name,
      code: school.code,
      admins: school.adminUsers || [],
      principal: school.principalUser || null,
      classes: classesWithStudents,
      stats: {
        totalAdmins: school.adminUsers?.length || 0,
        totalClasses: classesWithStudents.length,
        totalStudents: classesWithStudents.reduce((sum, c: any) => sum + c.studentCount, 0)
      }
    }
  });
}

// Get school with all admins
async function getSchoolWithAdmins(schoolId: string | null) {
  if (!schoolId) {
    return NextResponse.json({ error: 'schoolId required' }, { status: 400 });
  }
  
  const school = await School.findById(schoolId)
    .populate({
      path: 'adminUsers',
      select: 'name email phone role isActive createdAt',
      options: { sort: { createdAt: 1 } }
    })
    .lean();
  
  return NextResponse.json({ school });
}

// Get school with principal
async function getSchoolWithPrincipal(schoolId: string | null) {
  if (!schoolId) {
    return NextResponse.json({ error: 'schoolId required' }, { status: 400 });
  }
  
  const school = await School.findById(schoolId)
    .populate('principalUser', 'name email phone role assignedClasses')
    .lean();
  
  return NextResponse.json({ school });
}

// Get complete school data with all relationships
async function getSchoolComplete(schoolId: string | null) {
  if (!schoolId) {
    return NextResponse.json({ error: 'schoolId required' }, { status: 400 });
  }
  
  const school = await School.findById(schoolId)
    .populate('adminUsers', 'name email role')
    .populate('principalUser', 'name email role')
    .populate({
      path: 'schoolClasses',
      populate: [
        { path: 'classTeacher', select: 'name email' },
        { path: 'students', select: 'name email rollNumber' }
      ]
    })
    .lean();
  
  return NextResponse.json({ school });
}

// Get class with all students
async function getClassWithStudents() {
  const classes = await Class.find()
    .populate('school', 'name code')
    .populate('classTeacher', 'name email phone')
    .populate({
      path: 'students',
      select: 'name email rollNumber isPending isActive',
      options: { sort: { rollNumber: 1 } }
    })
    .limit(5)
    .lean();
  
  return NextResponse.json({ classes });
}

// Get teacher with assigned classes and students
async function getTeacherWithClasses() {
  const teachers = await User.find({ role: 'teacher' })
    .populate('school', 'name code')
    .populate({
      path: 'assignedClassDetails',
      select: 'className section strength',
      populate: {
        path: 'students',
        select: 'name email',
        options: { limit: 5 }
      }
    })
    .limit(5)
    .lean();
  
  return NextResponse.json({ teachers });
}

// Get hierarchy statistics
async function getHierarchyStats() {
  const stats = {
    schools: await School.countDocuments({ isActive: true }),
    totalUsers: await User.countDocuments(),
    byRole: {
      superAdmin: await User.countDocuments({ role: 'super-admin' }),
      admins: await User.countDocuments({ role: 'admin' }),
      principals: await User.countDocuments({ role: 'principal' }),
      teachers: await User.countDocuments({ role: 'teacher' }),
      students: await User.countDocuments({ role: 'student' })
    },
    classes: await Class.countDocuments(),
    pendingStudents: await User.countDocuments({ role: 'student', isPending: true }),
    activeStudents: await User.countDocuments({ role: 'student', isActive: true }),
    classesWithTeachers: await Class.countDocuments({ classTeacherId: { $exists: true, $ne: null } })
  };
  
  // Get school-wise breakdown
  const schools = await School.find({ isActive: true }, 'name code').lean();
  const schoolBreakdown = await Promise.all(
    schools.map(async (school) => {
      const [admins, principals, teachers, students, classes] = await Promise.all([
        User.countDocuments({ schoolId: school._id, role: 'admin' }),
        User.countDocuments({ schoolId: school._id, role: 'principal' }),
        User.countDocuments({ schoolId: school._id, role: 'teacher' }),
        User.countDocuments({ schoolId: school._id, role: 'student' }),
        Class.countDocuments({ schoolId: school._id })
      ]);
      
      return {
        school: school.name,
        code: school.code,
        admins,
        principals,
        teachers,
        students,
        classes,
        hierarchy: `School → ${admins} Admin(s) → ${principals} Principal → ${teachers} Teacher(s) → ${classes} Class(es) → ${students} Student(s)`
      };
    })
  );
  
  return NextResponse.json({
    overallStats: stats,
    schoolBreakdown
  });
}
