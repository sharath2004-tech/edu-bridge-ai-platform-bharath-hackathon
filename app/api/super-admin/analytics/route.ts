import Class from '@/lib/models/Class'
import Exam from '@/lib/models/Exam'
import School from '@/lib/models/School'
import Subject from '@/lib/models/Subject'
import User from '@/lib/models/User'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Basic stats
    const [
      totalSchools,
      activeSchools,
      totalStudents,
      totalTeachers,
      totalPrincipals,
      totalClasses,
      totalSubjects,
      totalExams
    ] = await Promise.all([
      School.countDocuments(),
      School.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'teacher' }),
      User.countDocuments({ role: 'principal' }),
      Class.countDocuments(),
      Subject.countDocuments(),
      Exam.countDocuments()
    ])

    // Students per school
    const studentsBySchoolData = await User.aggregate([
      { $match: { role: 'student' } },
      {
        $lookup: {
          from: 'schools',
          localField: 'schoolId',
          foreignField: '_id',
          as: 'school'
        }
      },
      { $unwind: '$school' },
      {
        $group: {
          _id: '$school.name',
          students: { $sum: 1 }
        }
      },
      { $project: { school: '$_id', students: 1, _id: 0 } },
      { $sort: { school: 1 } }
    ])

    // Teachers per school
    const teachersBySchoolData = await User.aggregate([
      { $match: { role: 'teacher' } },
      {
        $lookup: {
          from: 'schools',
          localField: 'schoolId',
          foreignField: '_id',
          as: 'school'
        }
      },
      { $unwind: '$school' },
      {
        $group: {
          _id: '$school.name',
          teachers: { $sum: 1 }
        }
      },
      { $project: { school: '$_id', teachers: 1, _id: 0 } },
      { $sort: { school: 1 } }
    ])

    // Students by grade (using className from Class)
    const studentsByGradeData = await User.aggregate([
      { $match: { role: 'student' } },
      {
        $lookup: {
          from: 'classes',
          localField: 'classId',
          foreignField: '_id',
          as: 'class'
        }
      },
      { $unwind: '$class' },
      {
        $group: {
          _id: '$class.className',
          students: { $sum: 1 }
        }
      },
      { $project: { grade: '$_id', students: 1, _id: 0 } },
      { $sort: { grade: 1 } }
    ])

    // Schools by board
    const schoolsByBoardData = await School.aggregate([
      {
        $group: {
          _id: '$board',
          count: { $sum: 1 }
        }
      },
      { $project: { name: '$_id', value: '$count', _id: 0 } }
    ])

    // Calculate average class size
    const classStrengths = await Class.aggregate([
      {
        $group: {
          _id: null,
          avgStrength: { $avg: '$strength' }
        }
      }
    ])
    const avgClassSize = classStrengths[0]?.avgStrength 
      ? Math.round(classStrengths[0].avgStrength) 
      : 0

    // Student-teacher ratio
    const studentTeacherRatio = totalTeachers > 0 
      ? `${Math.round(totalStudents / totalTeachers)}:1`
      : '0:1'

    const analytics = {
      stats: {
        totalSchools,
        activeSchools,
        totalStudents,
        totalTeachers,
        totalPrincipals,
        totalClasses,
        totalSubjects,
        totalExams,
        avgClassSize,
        studentTeacherRatio
      },
      studentsBySchool: studentsBySchoolData,
      teachersBySchool: teachersBySchoolData,
      studentsByGrade: studentsByGradeData,
      schoolsByBoard: schoolsByBoardData
    }

    return NextResponse.json({
      success: true,
      analytics
    })
  } catch (error: any) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
