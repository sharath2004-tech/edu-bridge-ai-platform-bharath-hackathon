import mongoose, { Document, Schema } from 'mongoose';

export interface IExam extends Document {
  schoolId: mongoose.Types.ObjectId;
  classId: mongoose.Types.ObjectId;
  examName: string;
  examType: 'unit-test' | 'mid-term' | 'final' | 'quarterly' | 'half-yearly' | 'annual' | 'other';
  date: Date;
  term?: string; // e.g., "Term 1", "Term 2"
  academicYear?: string;
  totalMarks?: number;
  duration?: number; // in minutes
  subjects?: mongoose.Types.ObjectId[]; // Array of subject IDs
  instructions?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ExamSchema = new Schema<IExam>(
  {
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: [true, 'School ID is required'],
      index: true,
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: [true, 'Class ID is required'],
      index: true,
    },
    examName: {
      type: String,
      required: [true, 'Exam name is required'],
      trim: true,
    },
    examType: {
      type: String,
      enum: ['unit-test', 'mid-term', 'final', 'quarterly', 'half-yearly', 'annual', 'other'],
      default: 'unit-test',
    },
    date: {
      type: Date,
      required: [true, 'Exam date is required'],
    },
    term: {
      type: String,
      trim: true,
    },
    academicYear: {
      type: String,
      trim: true,
    },
    totalMarks: {
      type: Number,
      min: 0,
    },
    duration: {
      type: Number,
      min: 0,
    },
    subjects: [{
      type: Schema.Types.ObjectId,
      ref: 'Subject',
    }],
    instructions: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for querying exams by school and class
ExamSchema.index({ schoolId: 1, classId: 1, date: -1 });

const Exam = mongoose.models.Exam || mongoose.model<IExam>('Exam', ExamSchema);

export default Exam;
