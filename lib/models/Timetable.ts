import mongoose, { Document, Model, Schema } from 'mongoose'

export interface ITimetable extends Document {
  _id: string
  classId: mongoose.Types.ObjectId
  schoolId: mongoose.Types.ObjectId
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
  period: number
  startTime: string
  endTime: string
  subjectId: mongoose.Types.ObjectId
  teacherId: mongoose.Types.ObjectId
  roomNumber?: string
  createdAt: Date
  updatedAt: Date
}

const TimetableSchema = new Schema<ITimetable>({
  classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true, index: true },
  schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true, index: true },
  dayOfWeek: { 
    type: String, 
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  period: { type: Number, required: true, min: 1, max: 10 },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
  teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  roomNumber: { type: String, trim: true },
}, { timestamps: true })

TimetableSchema.index({ classId: 1, dayOfWeek: 1, period: 1 }, { unique: true })
TimetableSchema.index({ teacherId: 1 })
TimetableSchema.index({ subjectId: 1 })

const Timetable: Model<ITimetable> = mongoose.models.Timetable || mongoose.model<ITimetable>('Timetable', TimetableSchema)
export default Timetable
