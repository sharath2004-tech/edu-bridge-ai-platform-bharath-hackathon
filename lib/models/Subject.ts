import mongoose, { Document, Schema } from 'mongoose';

export interface ISubject extends Document {
  _id: string;
  schoolId: mongoose.Types.ObjectId;
  classId: mongoose.Types.ObjectId;
  subjectName: string;
  subjectCode?: string; // Optional subject code like "MAT101"
  teacherId?: mongoose.Types.ObjectId;
  description?: string;
  totalLessons?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema = new Schema<ISubject>(
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
    subjectName: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true,
    },
    subjectCode: {
      type: String,
      trim: true,
      uppercase: true,
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    totalLessons: {
      type: Number,
      min: 0,
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

// Compound index to ensure unique subject per class in a school
SubjectSchema.index({ schoolId: 1, classId: 1, subjectName: 1 }, { unique: true });

// Index for querying by teacher
SubjectSchema.index({ teacherId: 1 });

const Subject = mongoose.models.Subject || mongoose.model<ISubject>('Subject', SubjectSchema);

export default Subject;
