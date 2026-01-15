import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'super-admin' | 'admin' | 'principal' | 'teacher' | 'student';
  schoolId?: mongoose.Types.ObjectId;
  avatar?: string;
  bio?: string;
  phone?: string;
  isActive: boolean;
  isPending?: boolean; // For student self-registration approval
  mustChangePassword?: boolean; // Flag for temporary password
  // Teacher-specific fields
  subjectSpecialization?: string;
  teacherRole?: 'Teacher' | 'HOD' | 'Vice Principal';
  assignedClasses?: (mongoose.Types.ObjectId | string)[]; // Array of Class IDs or names
  assignedSubjects?: (mongoose.Types.ObjectId | string)[]; // Array of Subject IDs or names
  // Student-specific fields
  classId?: mongoose.Types.ObjectId; // Reference to Class model
  rollNo?: number;
  parentName?: string;
  parentPhone?: string;
  // Legacy fields (for backward compatibility)
  className?: string; // e.g., '10-A'
  section?: string; // e.g., 'A', 'B', 'C', 'D', 'E'
  rollNumber?: string;
  enrolledCourses?: mongoose.Types.ObjectId[];
  // Teacher fields
  createdCourses?: mongoose.Types.ObjectId[];
  progress?: {
    courseId: mongoose.Types.ObjectId;
    completedLessons: number;
    totalLessons: number;
    lastAccessed: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ['super-admin', 'admin', 'principal', 'teacher', 'student'],
      default: 'student',
      required: true,
    },
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: 'School',
    },
    avatar: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot be more than 500 characters'],
    },
    phone: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isPending: {
      type: Boolean,
      default: false,
      index: true,
    },
    mustChangePassword: {
      type: Boolean,
      default: false,
    },
    // Teacher-specific fields
    subjectSpecialization: {
      type: String,
      trim: true,
    },
    teacherRole: {
      type: String,
      enum: ['Teacher', 'HOD', 'Vice Principal'],
    },
    assignedClasses: [
      {
        type: Schema.Types.Mixed, // Allow both ObjectId and String for flexibility
      },
    ],
    assignedSubjects: [
      {
        type: Schema.Types.Mixed, // Allow both ObjectId and String for flexibility
      },
    ],
    // Student-specific fields
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      index: true,
    },
    rollNo: {
      type: Number,
      min: 1,
    },
    parentName: {
      type: String,
      trim: true,
    },
    parentPhone: {
      type: String,
      trim: true,
    },
    // Legacy fields (backward compatibility)
    className: {
      type: String,
      trim: true,
    },
    section: {
      type: String,
      trim: true,
    },
    rollNumber: {
      type: String,
      trim: true,
    },
    enrolledCourses: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    createdCourses: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    progress: [
      {
        courseId: {
          type: Schema.Types.ObjectId,
          ref: 'Course',
        },
        completedLessons: {
          type: Number,
          default: 0,
        },
        totalLessons: {
          type: Number,
          default: 0,
        },
        lastAccessed: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
UserSchema.index({ role: 1 });
UserSchema.index({ schoolId: 1, role: 1 });
// email already has unique index from schema definition

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
