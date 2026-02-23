import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IBusAttendance extends Document {
  studentId: mongoose.Types.ObjectId;
  schoolId: mongoose.Types.ObjectId;
  busId?: string; // Bus number or identifier
  date: Date;
  status: 'present' | 'absent';
  markedBy: mongoose.Types.ObjectId; // Bus staff/admin who marked attendance
  markedAt: Date;
  remarks?: string;
  notificationSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BusAttendanceSchema = new Schema<IBusAttendance>(
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
    busId: {
      type: String,
      trim: true,
      index: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      index: true,
    },
    status: {
      type: String,
      enum: ['present', 'absent'],
      required: [true, 'Attendance status is required'],
    },
    markedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Marked by user is required'],
    },
    markedAt: {
      type: Date,
      default: Date.now,
    },
    remarks: {
      type: String,
      maxlength: [500, 'Remarks cannot exceed 500 characters'],
      trim: true,
    },
    notificationSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one attendance record per student per day
BusAttendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

// Index for querying by school and date
BusAttendanceSchema.index({ schoolId: 1, date: 1 });

// Index for querying by bus and date
BusAttendanceSchema.index({ busId: 1, date: 1 });

const BusAttendance: Model<IBusAttendance> =
  mongoose.models.BusAttendance || mongoose.model<IBusAttendance>('BusAttendance', BusAttendanceSchema);

export default BusAttendance;
