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
    // HIERARCHY: Notification belongs to a user
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // HIERARCHY: All notifications are school-scoped for isolation
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true, // Critical for school isolation
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

// HIERARCHY ENFORCEMENT
NotificationSchema.pre('save', function(next) {
  if (!this.schoolId) {
    return next(new Error('Notification must belong to a school'))
  }
  next()
})

// HIERARCHY INDEXES: Optimized for school-scoped queries
NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 })
NotificationSchema.index({ schoolId: 1, type: 1, createdAt: -1 })
NotificationSchema.index({ schoolId: 1, userId: 1, isRead: 1 }) // School isolation + user filtering

// Virtual for user details
NotificationSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
})

// Virtual for school details
NotificationSchema.virtual('school', {
  ref: 'School',
  localField: 'schoolId',
  foreignField: '_id',
  justOne: true
})

// Enable virtual population
NotificationSchema.set('toJSON', { virtuals: true })
NotificationSchema.set('toObject', { virtuals: true })

const Notification = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema)

export default Notification
