import mongoose, { Document, Schema } from 'mongoose';

export interface IClass extends Document {
  _id: string;
  schoolId: mongoose.Types.ObjectId;
  className: string; // e.g., "LKG", "1st", "2nd", "10th"
  section: string; // e.g., "A", "B", "C"
  classTeacherId?: mongoose.Types.ObjectId;
  academicYear?: string; // e.g., "2024-2025"
  strength?: number; // Total students in this class
  createdAt: Date;
  updatedAt: Date;
}

const ClassSchema = new Schema<IClass>(
  {
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
      // LKG, UKG, 1st, 2nd, 3rd, 4th, 5th, 6th, 7th, 8th, 9th, 10th, 11th, 12th
    },
    section: {
      type: String,
      required: [true, 'Section is required'],
      trim: true,
      uppercase: true,
      // A, B, C, D, E, etc.
    },
    classTeacherId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    academicYear: {
      type: String,
      trim: true,
    },
    strength: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure unique class-section per school
ClassSchema.index({ schoolId: 1, className: 1, section: 1 }, { unique: true });

// Index for querying by class teacher
ClassSchema.index({ classTeacherId: 1 });

const Class = mongoose.models.Class || mongoose.model<IClass>('Class', ClassSchema);

export default Class;
