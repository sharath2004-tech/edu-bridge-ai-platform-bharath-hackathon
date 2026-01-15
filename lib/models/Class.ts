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
    // HIERARCHY: Every class belongs to exactly one school
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: [true, 'School ID is required'],
      index: true, // Critical for school isolation
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
    // HIERARCHY: Class teacher (optional, one teacher per class)
    classTeacherId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      // Note: Validation commented out for now to allow seeding
      // Will be enforced at application level
      // validate: {
      //   validator: async function(v: mongoose.Types.ObjectId) {
      //     if (!v) return true // Optional field
      //     const User = mongoose.model('User')
      //     const teacher = await User.findOne({ _id: v, role: 'teacher', schoolId: this.schoolId })
      //     return !!teacher // Must be a teacher in the same school
      //   },
      //   message: 'Class teacher must be a valid teacher in the same school'
      // }
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

// HIERARCHY ENFORCEMENT: Pre-save validation
ClassSchema.pre('save', async function() {
  if (!this.schoolId) {
    throw new Error('Class must belong to a school')
  }
})

// HIERARCHY INDEXES: Optimized for hierarchical queries
// Compound index to ensure unique class-section per school (CRITICAL for school isolation)
ClassSchema.index({ schoolId: 1, className: 1, section: 1 }, { unique: true })

// Index for querying by school and teacher
ClassSchema.index({ schoolId: 1, classTeacherId: 1 })
ClassSchema.index({ classTeacherId: 1 }) // For teacher's class queries
ClassSchema.index({ schoolId: 1, academicYear: 1 }) // For academic year filtering

// Virtual for school details
ClassSchema.virtual('school', {
  ref: 'School',
  localField: 'schoolId',
  foreignField: '_id',
  justOne: true
})

// Virtual for class teacher details
ClassSchema.virtual('classTeacher', {
  ref: 'User',
  localField: 'classTeacherId',
  foreignField: '_id',
  justOne: true
})

// Virtual for students in this class
ClassSchema.virtual('students', {
  ref: 'User',
  localField: '_id',
  foreignField: 'classId',
  match: { role: 'student' },
  options: { sort: { rollNumber: 1 } }
})

// Enable virtual population
ClassSchema.set('toJSON', { virtuals: true })
ClassSchema.set('toObject', { virtuals: true })

const Class = mongoose.models.Class || mongoose.model<IClass>('Class', ClassSchema);

export default Class;
