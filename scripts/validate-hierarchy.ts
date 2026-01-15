/**
 * Database Hierarchy Validation Script
 * 
 * This script validates and enforces the hierarchical structure:
 * School → Admin/Principal → Teacher → Class → Student
 * 
 * Validations:
 * 1. Each school has exactly ONE principal
 * 2. All users (except super-admin) belong to a school
 * 3. All students are assigned to a class
 * 4. All classes belong to a school
 * 5. Class teachers are valid teachers in the same school
 * 6. No orphaned records
 */

import mongoose from 'mongoose';
import Class from '../lib/models/Class';
import School from '../lib/models/School';
import User from '../lib/models/User';

interface ValidationResult {
  category: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
  message: string;
  count?: number;
  details?: any[];
}

const results: ValidationResult[] = [];

async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/edu-bridge';
  
  if (mongoose.connection.readyState !== 0) {
    return;
  }

  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB\n');
}

async function validateSchoolPrincipals() {
  console.log('🔍 Validating: One Principal Per School...');
  
  const schools = await School.find({ isActive: true });
  
  for (const school of schools) {
    const principals = await User.find({ schoolId: school._id, role: 'principal' });
    
    if (principals.length === 0) {
      results.push({
        category: 'School Principal',
        status: 'WARNING',
        message: `School "${school.name}" (${school.code}) has NO principal`,
        details: [{ schoolId: school._id, schoolName: school.name }]
      });
    } else if (principals.length > 1) {
      results.push({
        category: 'School Principal',
        status: 'FAIL',
        message: `School "${school.name}" (${school.code}) has ${principals.length} principals (MUST have exactly 1)`,
        count: principals.length,
        details: principals.map(p => ({ id: p._id, name: p.name, email: p.email }))
      });
    } else {
      results.push({
        category: 'School Principal',
        status: 'PASS',
        message: `School "${school.name}" has exactly 1 principal ✓`,
      });
    }
  }
}

async function validateUserSchoolAssociation() {
  console.log('🔍 Validating: All Users Belong to Schools...');
  
  const usersWithoutSchool = await User.find({
    role: { $ne: 'super-admin' },
    $or: [
      { schoolId: { $exists: false } },
      { schoolId: null }
    ]
  });
  
  if (usersWithoutSchool.length > 0) {
    results.push({
      category: 'User-School Association',
      status: 'FAIL',
      message: `Found ${usersWithoutSchool.length} users without school association`,
      count: usersWithoutSchool.length,
      details: usersWithoutSchool.map(u => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role
      }))
    });
  } else {
    const totalUsers = await User.countDocuments({ role: { $ne: 'super-admin' } });
    results.push({
      category: 'User-School Association',
      status: 'PASS',
      message: `All ${totalUsers} users are properly associated with schools ✓`
    });
  }
}

async function validateStudentClassAssignment() {
  console.log('🔍 Validating: All Students Assigned to Classes...');
  
  const studentsWithoutClass = await User.find({
    role: 'student',
    $or: [
      { classId: { $exists: false } },
      { classId: null }
    ]
  });
  
  if (studentsWithoutClass.length > 0) {
    results.push({
      category: 'Student-Class Assignment',
      status: 'FAIL',
      message: `Found ${studentsWithoutClass.length} students without class assignment`,
      count: studentsWithoutClass.length,
      details: studentsWithoutClass.slice(0, 10).map(s => ({
        id: s._id,
        name: s.name,
        email: s.email,
        schoolId: s.schoolId
      }))
    });
  } else {
    const totalStudents = await User.countDocuments({ role: 'student' });
    results.push({
      category: 'Student-Class Assignment',
      status: 'PASS',
      message: `All ${totalStudents} students are assigned to classes ✓`
    });
  }
}

async function validateClassSchoolAssociation() {
  console.log('🔍 Validating: All Classes Belong to Schools...');
  
  const classesWithoutSchool = await Class.find({
    $or: [
      { schoolId: { $exists: false } },
      { schoolId: null }
    ]
  });
  
  if (classesWithoutSchool.length > 0) {
    results.push({
      category: 'Class-School Association',
      status: 'FAIL',
      message: `Found ${classesWithoutSchool.length} classes without school association`,
      count: classesWithoutSchool.length,
      details: classesWithoutSchool.map(c => ({
        id: c._id,
        className: c.className,
        section: c.section
      }))
    });
  } else {
    const totalClasses = await Class.countDocuments();
    results.push({
      category: 'Class-School Association',
      status: 'PASS',
      message: `All ${totalClasses} classes are properly associated with schools ✓`
    });
  }
}

async function validateClassTeacherAssignment() {
  console.log('🔍 Validating: Class Teacher Assignments...');
  
  const classesWithTeachers = await Class.find({ classTeacherId: { $exists: true, $ne: null } });
  
  let invalidAssignments = 0;
  const invalidDetails: any[] = [];
  
  for (const classDoc of classesWithTeachers) {
    const teacher = await User.findOne({
      _id: classDoc.classTeacherId,
      role: 'teacher',
      schoolId: classDoc.schoolId
    });
    
    if (!teacher) {
      invalidAssignments++;
      invalidDetails.push({
        classId: classDoc._id,
        className: `${classDoc.className} - ${classDoc.section}`,
        teacherId: classDoc.classTeacherId,
        schoolId: classDoc.schoolId
      });
    }
  }
  
  if (invalidAssignments > 0) {
    results.push({
      category: 'Class Teacher Assignment',
      status: 'FAIL',
      message: `Found ${invalidAssignments} classes with invalid teacher assignments`,
      count: invalidAssignments,
      details: invalidDetails
    });
  } else {
    results.push({
      category: 'Class Teacher Assignment',
      status: 'PASS',
      message: `All ${classesWithTeachers.length} class teacher assignments are valid ✓`
    });
  }
}

async function validateOrphanedRecords() {
  console.log('🔍 Validating: No Orphaned Records...');
  
  // Check for users referencing non-existent schools
  const allSchoolIds = (await School.find({}, '_id')).map(s => s._id);
  const orphanedUsers = await User.find({
    schoolId: { $exists: true, $nin: allSchoolIds }
  });
  
  if (orphanedUsers.length > 0) {
    results.push({
      category: 'Orphaned Records',
      status: 'FAIL',
      message: `Found ${orphanedUsers.length} users referencing non-existent schools`,
      count: orphanedUsers.length,
      details: orphanedUsers.slice(0, 10).map(u => ({
        id: u._id,
        name: u.name,
        schoolId: u.schoolId
      }))
    });
  }
  
  // Check for students referencing non-existent classes
  const allClassIds = (await Class.find({}, '_id')).map(c => c._id);
  const orphanedStudents = await User.find({
    role: 'student',
    classId: { $exists: true, $nin: allClassIds }
  });
  
  if (orphanedStudents.length > 0) {
    results.push({
      category: 'Orphaned Records',
      status: 'FAIL',
      message: `Found ${orphanedStudents.length} students referencing non-existent classes`,
      count: orphanedStudents.length,
      details: orphanedStudents.slice(0, 10).map(s => ({
        id: s._id,
        name: s.name,
        classId: s.classId
      }))
    });
  }
  
  if (orphanedUsers.length === 0 && orphanedStudents.length === 0) {
    results.push({
      category: 'Orphaned Records',
      status: 'PASS',
      message: 'No orphaned records found ✓'
    });
  }
}

async function generateHierarchyReport() {
  console.log('\n📊 Generating Hierarchy Report...\n');
  
  const schools = await School.find({ isActive: true }).sort({ name: 1 });
  
  console.log('═══════════════════════════════════════════════════════════');
  console.log('                  HIERARCHY STRUCTURE REPORT                ');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  for (const school of schools) {
    console.log(`🏫 ${school.name} (${school.code})`);
    console.log(`   ID: ${school._id}`);
    
    // Count users by role
    const admins = await User.countDocuments({ schoolId: school._id, role: 'admin' });
    const principals = await User.countDocuments({ schoolId: school._id, role: 'principal' });
    const teachers = await User.countDocuments({ schoolId: school._id, role: 'teacher' });
    const students = await User.countDocuments({ schoolId: school._id, role: 'student' });
    const classes = await Class.countDocuments({ schoolId: school._id });
    
    console.log(`   ├─ 👔 Admins: ${admins}`);
    console.log(`   ├─ 🎓 Principals: ${principals} ${principals === 1 ? '✓' : principals === 0 ? '⚠️' : '❌'}`);
    console.log(`   ├─ 👨‍🏫 Teachers: ${teachers}`);
    console.log(`   ├─ 📚 Classes: ${classes}`);
    console.log(`   └─ 👨‍🎓 Students: ${students}\n`);
  }
}

async function printSummary() {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('                   VALIDATION SUMMARY                      ');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const warnings = results.filter(r => r.status === 'WARNING').length;
  
  console.log(`✅ PASSED: ${passed}`);
  console.log(`❌ FAILED: ${failed}`);
  console.log(`⚠️  WARNINGS: ${warnings}\n`);
  
  if (failed > 0) {
    console.log('FAILURES:\n');
    results.filter(r => r.status === 'FAIL').forEach(r => {
      console.log(`❌ ${r.category}: ${r.message}`);
      if (r.details && r.details.length > 0) {
        console.log('   Details:', JSON.stringify(r.details.slice(0, 3), null, 2));
      }
      console.log();
    });
  }
  
  if (warnings > 0) {
    console.log('WARNINGS:\n');
    results.filter(r => r.status === 'WARNING').forEach(r => {
      console.log(`⚠️  ${r.category}: ${r.message}`);
      console.log();
    });
  }
  
  console.log('═══════════════════════════════════════════════════════════\n');
  
  if (failed === 0 && warnings === 0) {
    console.log('🎉 ALL VALIDATIONS PASSED! Database hierarchy is properly structured.\n');
  } else if (failed === 0) {
    console.log('✓ No critical issues found. Address warnings for optimal structure.\n');
  } else {
    console.log('⚠️  CRITICAL ISSUES FOUND! Please run migration script to fix.\n');
  }
}

async function main() {
  try {
    await connectDB();
    
    await validateSchoolPrincipals();
    await validateUserSchoolAssociation();
    await validateStudentClassAssignment();
    await validateClassSchoolAssociation();
    await validateClassTeacherAssignment();
    await validateOrphanedRecords();
    
    await generateHierarchyReport();
    await printSummary();
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Validation failed:', error);
    process.exit(1);
  }
}

main();
