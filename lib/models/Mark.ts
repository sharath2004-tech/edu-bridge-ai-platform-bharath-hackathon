import mongoose, { Document, Schema } from 'mongoose';

export interface IMark extends Document {
  studentId: mongoose.Types.ObjectId;
  schoolId: mongoose.Types.ObjectId;
  examId: mongoose.Types.ObjectId;
  subjectId: mongoose.Types.ObjectId;
  marksScored: number;
  totalMarks?: number;
  percentage?: number;
  grade?: string;
  remarks?: string;
  markedBy?: mongoose.Types.ObjectId; // Teacher who entered marks
  createdAt: Date;
  updatedAt: Date;
}

const MarkSchema = new Schema<IMark>(
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
    examId: {
      type: Schema.Types.ObjectId,
      ref: 'Exam',
      required: [true, 'Exam ID is required'],
      index: true,
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Subject ID is required'],
      index: true,
    },
    marksScored: {
      type: Number,
      required: [true, 'Marks scored is required'],
      min: 0,
    },
    totalMarks: {
      type: Number,
      min: 1,
    },
    percentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    grade: {
      type: String,
      trim: true,
    },
    remarks: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    markedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
MarkSchema.index({ schoolId: 1, examId: 1 });
MarkSchema.index({ studentId: 1, examId: 1, subjectId: 1 }, { unique: true });
MarkSchema.index({ examId: 1, subjectId: 1 });

// Pre-save hook to calculate percentage and grade
MarkSchema.pre('save', function () {
  if (this.marksScored !== undefined && this.totalMarks !== undefined) {
    this.percentage = (this.marksScored / this.totalMarks) * 100;
    
    // Calculate grade based on percentage
    if (this.percentage >= 90) this.grade = 'A+';
    else if (this.percentage >= 80) this.grade = 'A';
    else if (this.percentage >= 70) this.grade = 'B+';
    else if (this.percentage >= 60) this.grade = 'B';
    else if (this.percentage >= 50) this.grade = 'C';
    else if (this.percentage >= 40) this.grade = 'D';
    else this.grade = 'F';
  }
});

export default mongoose.models.Mark || mongoose.model<IMark>('Mark', MarkSchema);
