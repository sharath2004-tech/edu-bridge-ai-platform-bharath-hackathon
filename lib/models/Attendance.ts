import mongoose, { Document, Schema } from 'mongoose';

export interface IAttendance extends Document {
  studentId: mongoose.Types.ObjectId;
  schoolId: mongoose.Types.ObjectId;
  date: Date;
  status: 'Present' | 'Absent' | 'Late';
  markedBy?: mongoose.Types.ObjectId; // Teacher or Principal who marked attendance
  notes?: string;
  // Legacy fields (backward compatibility)
  className?: string;
  section?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema = new Schema<IAttendance>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID is required'],
      index: true,
    },
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: [true, 'School ID is required'],
      index: true,
    },
    className: {
      type: String,
      required: [true, 'Class name is required'],
      trim: true,
      index: true,
    },
    section: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      index: true,
    },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Late', 'present', 'absent', 'late', 'excused'],
      required: [true, 'Status is required'],
      default: 'Present',
    },
    markedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
AttendanceSchema.index({ schoolId: 1, date: -1 });
AttendanceSchema.index({ studentId: 1, date: -1 });
AttendanceSchema.index({ schoolId: 1, className: 1, date: -1 });

// Ensure one attendance record per student per day
AttendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

export default mongoose.models.Attendance || mongoose.model<IAttendance>('Attendance', AttendanceSchema);
