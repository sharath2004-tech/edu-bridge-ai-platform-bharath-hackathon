import mongoose, { Document, Schema } from 'mongoose'

export interface INotification extends Document {
  _id: string
  userId: mongoose.Types.ObjectId // Teacher/Admin who receives the notification
  schoolId: mongoose.Types.ObjectId
  type: 'student_registration' | 'attendance_alert' | 'marks_update' | 'general'
  title: string
  message: string
  relatedUser?: mongoose.Types.ObjectId // The student who triggered this notification
  relatedClass?: mongoose.Types.ObjectId // The class involved
  data?: any // Additional data (student info, class info, etc.)
  isRead: boolean
  actionRequired: boolean
  actionUrl?: string // URL to take action (e.g., approve student)
  createdAt: Date
  readAt?: Date
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['student_registration', 'attendance_alert', 'marks_update', 'general'],
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    relatedClass: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
    },
    data: {
      type: Schema.Types.Mixed,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    actionRequired: {
      type: Boolean,
      default: false,
    },
    actionUrl: {
      type: String,
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

// Compound index for efficient queries
NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 })
NotificationSchema.index({ schoolId: 1, type: 1, createdAt: -1 })

const Notification = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema)

export default Notification
