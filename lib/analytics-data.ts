import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

export interface SchoolAnalytics {
  schoolId: string;
  schoolName: string;
  totalStudents: number;
  totalTeachers: number;
  averageAttendance: number;
  averageGrade: number;
  performanceScore: number;
  activeStudents: number;
  coursesOffered: number;
}

export async function getSchoolAnalyticsData(): Promise<SchoolAnalytics[]> {
  try {
    const mongoose = await dbConnect();
    const db = mongoose.connection.db;
    
    // Check if db exists
    if (!db) {
      console.error('Database connection not available');
      return [];
    }

    // Fetch all schools
    const schools = await db.collection('schools').find({}).toArray();

    const analyticsData: SchoolAnalytics[] = [];

    for (const school of schools) {
      // Count students in this school
      const totalStudents = await db.collection('users').countDocuments({
        school: school._id.toString(),
        role: 'student',
      });

      // Count teachers in this school
      const totalTeachers = await db.collection('users').countDocuments({
        school: school._id.toString(),
        role: 'teacher',
      });

      // Get student grades/scores (if you have a grades collection)
      const students = await db.collection('users')
        .find({ school: school._id.toString(), role: 'student' })
        .toArray();

      // Calculate metrics (adjust based on your actual schema)
      const avgGrade = 75 + Math.random() * 20; // Placeholder - replace with actual grade calculation
      const avgAttendance = 70 + Math.random() * 25; // Placeholder - replace with actual attendance

      // Count courses (if you track this)
      const coursesOffered = await db.collection('courses').countDocuments({
        schoolId: school._id.toString(),
      });

      const performanceScore = (avgAttendance * 0.3 + avgGrade * 0.7);

      analyticsData.push({
        schoolId: school._id.toString(),
        schoolName: school.name || 'Unknown School',
        totalStudents,
        totalTeachers,
        averageAttendance: Math.round(avgAttendance * 100) / 100,
        averageGrade: Math.round(avgGrade * 100) / 100,
        performanceScore: Math.round(performanceScore * 100) / 100,
        activeStudents: totalStudents,
        coursesOffered,
      });
    }

    return analyticsData;
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    throw error;
  }
}

export async function getDetailedSchoolAnalytics(schoolId: string) {
  try {
    const mongoose = await dbConnect();
    const db = mongoose.connection.db;
    
    // Check if db exists
    if (!db) {
      throw new Error('Database connection not available');
    }

    const school = await db.collection('schools').findOne({ _id: new mongoose.Types.ObjectId(schoolId) });
    
    if (!school) {
      throw new Error('School not found');
    }

    const students = await db.collection('users')
      .find({ school: schoolId, role: 'student' })
      .toArray();

    const teachers = await db.collection('users')
      .find({ school: schoolId, role: 'teacher' })
      .toArray();

    const courses = await db.collection('courses')
      .find({ schoolId })
      .toArray();

    return {
      school,
      students,
      teachers,
      courses,
      metrics: {
        studentCount: students.length,
        teacherCount: teachers.length,
        courseCount: courses.length,
        studentTeacherRatio: teachers.length > 0 ? (students.length / teachers.length).toFixed(2) : 'N/A',
      },
    };
  } catch (error) {
    console.error('Error fetching detailed analytics:', error);
    throw error;
  }
}
