import mongoose from 'mongoose'
import Notification from '@/lib/models/Notification'
import { User, Class } from '@/lib/models'

interface NotificationData {
  userId: string | mongoose.Types.ObjectId
  schoolId: string | mongoose.Types.ObjectId
  type: 'student_registration' | 'attendance_alert' | 'marks_update' | 'course_added' | 'course_updated' | 'quiz_added' | 'assignment' | 'announcement' | 'general'
  title: string
  message: string
  relatedUser?: string | mongoose.Types.ObjectId
  relatedClass?: string | mongoose.Types.ObjectId
  relatedCourse?: string | mongoose.Types.ObjectId
  relatedExam?: string | mongoose.Types.ObjectId
  data?: any
  actionRequired?: boolean
  actionUrl?: string
}

/**
 * Create a single notification
 */
export async function createNotification(data: NotificationData) {
  try {
    const notification = await Notification.create({
      userId: data.userId,
      schoolId: data.schoolId,
      type: data.type,
      title: data.title,
      message: data.message,
      relatedUser: data.relatedUser,
      relatedClass: data.relatedClass,
      relatedCourse: data.relatedCourse,
      relatedExam: data.relatedExam,
      data: data.data,
      actionRequired: data.actionRequired || false,
      actionUrl: data.actionUrl,
      isRead: false,
    })
    return notification
  } catch (error) {
    console.error('Error creating notification:', error)
    throw error
  }
}

/**
 * Notify all students in a class about a new course
 */
export async function notifyClassAboutCourse(
  schoolId: string,
  classIds: string[],
  courseId: string,
  courseTitle: string,
  teacherName: string,
  teacherId: string
) {
  try {
    // Find all active students in the specified classes
    const students = await User.find({
      schoolId,
      role: 'student',
      isActive: true,
      classId: { $in: classIds.map(id => new mongoose.Types.ObjectId(id)) }
    }).select('_id')

    if (students.length === 0) {
      console.log('No students found in classes to notify')
      return []
    }

    // Create notifications for all students
    const notifications = await Notification.insertMany(
      students.map(student => ({
        userId: student._id,
        schoolId,
        type: 'course_added',
        title: '📚 New Course Available!',
        message: `${teacherName} has added a new course: "${courseTitle}"`,
        relatedUser: teacherId,
        relatedCourse: courseId,
        actionUrl: `/student/courses/${courseId}`,
        isRead: false,
        actionRequired: false,
      }))
    )

    console.log(`Notified ${notifications.length} students about new course`)
    return notifications
  } catch (error) {
    console.error('Error notifying class about course:', error)
    return []
  }
}

/**
 * Notify students about updated marks
 */
export async function notifyStudentsAboutMarks(
  schoolId: string,
  studentIds: string[],
  examName: string,
  subjectName: string,
  teacherName: string,
  teacherId: string,
  examId?: string
) {
  try {
    // Create notifications for all students who got marks
    const notifications = await Notification.insertMany(
      studentIds.map(studentId => ({
        userId: studentId,
        schoolId,
        type: 'marks_update',
        title: '📝 Marks Updated!',
        message: `${teacherName} has updated your ${subjectName} marks for ${examName}`,
        relatedUser: teacherId,
        relatedExam: examId,
        actionUrl: '/student/marks',
        isRead: false,
        actionRequired: false,
        data: { examName, subjectName }
      }))
    )

    console.log(`Notified ${notifications.length} students about marks update`)
    return notifications
  } catch (error) {
    console.error('Error notifying students about marks:', error)
    return []
  }
}

/**
 * Notify students in teacher's assigned classes
 */
export async function notifyTeacherAssignedStudents(
  schoolId: string,
  teacherId: string,
  type: NotificationData['type'],
  title: string,
  message: string,
  actionUrl?: string,
  relatedCourse?: string,
  relatedExam?: string
) {
  try {
    // Get teacher's assigned classes
    const teacher = await User.findById(teacherId).select('assignedClasses name')
    if (!teacher?.assignedClasses?.length) {
      console.log('Teacher has no assigned classes')
      return []
    }

    // Find all students in teacher's assigned classes
    const students = await User.find({
      schoolId,
      role: 'student',
      isActive: true,
      classId: { $in: teacher.assignedClasses }
    }).select('_id')

    if (students.length === 0) {
      console.log('No students found in teacher assigned classes')
      return []
    }

    // Create notifications for all students
    const notifications = await Notification.insertMany(
      students.map(student => ({
        userId: student._id,
        schoolId,
        type,
        title,
        message,
        relatedUser: teacherId,
        relatedCourse,
        relatedExam,
        actionUrl,
        isRead: false,
        actionRequired: false,
      }))
    )

    console.log(`Notified ${notifications.length} students in teacher's classes`)
    return notifications
  } catch (error) {
    console.error('Error notifying teacher assigned students:', error)
    return []
  }
}

/**
 * Get notification icon based on type
 */
export function getNotificationIcon(type: string): string {
  switch (type) {
    case 'course_added':
      return '📚'
    case 'course_updated':
      return '📖'
    case 'marks_update':
      return '📝'
    case 'quiz_added':
      return '❓'
    case 'assignment':
      return '📋'
    case 'attendance_alert':
      return '⚠️'
    case 'student_registration':
      return '👤'
    case 'announcement':
      return '📢'
    default:
      return '🔔'
  }
}
