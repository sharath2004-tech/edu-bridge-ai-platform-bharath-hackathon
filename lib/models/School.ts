import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISchool extends Document {
  _id: string;
  name: string;
  code: string; // Unique school code for registration
  email: string;
  phone?: string;
  address: {
    street?: string;
    city: string;
    state: string;
    country: string;
    zipCode?: string;
  };
  principal?: {
    name: string;
    email: string;
    phone?: string;
  };
  logo?: string;
  website?: string;
  established?: Date;
  type: 'primary' | 'secondary' | 'higher-secondary' | 'university' | 'institute';
  board?: string; // CBSE, ICSE, State Board, etc.
  isActive: boolean;
  subscription?: {
    plan: 'free' | 'basic' | 'premium' | 'enterprise';
    startDate: Date;
    endDate?: Date;
    maxStudents?: number;
    maxTeachers?: number;
  };
  stats?: {
    totalStudents: number;
    totalTeachers: number;
    totalCourses: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const SchoolSchema = new Schema<ISchool>(
  {
    name: {
      type: String,
      required: [true, 'School name is required'],
      trim: true,
      maxlength: [200, 'School name cannot exceed 200 characters'],
    },
    code: {
      type: String,
      required: [true, 'School code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      match: [/^[A-Z0-9]{4,10}$/, 'School code must be 4-10 alphanumeric characters'],
    },
    email: {
      type: String,
      required: [true, 'School email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      street: String,
      city: {
        type: String,
        required: [true, 'City is required'],
      },
      state: {
        type: String,
        required: [true, 'State is required'],
      },
      country: {
        type: String,
        required: [true, 'Country is required'],
        default: 'India',
      },
      zipCode: String,
    },
    principal: {
      name: String,
      email: String,
      phone: String,
    },
    logo: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      trim: true,
    },
    established: {
      type: Date,
    },
    type: {
      type: String,
      enum: ['primary', 'secondary', 'higher-secondary', 'university', 'institute'],
      default: 'secondary',
      required: true,
    },
    board: {
      type: String,
      default: 'CBSE',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    subscription: {
      plan: {
        type: String,
        enum: ['free', 'basic', 'premium', 'enterprise'],
        default: 'free',
      },
      startDate: {
        type: Date,
        default: Date.now,
      },
      endDate: Date,
      maxStudents: {
        type: Number,
        default: 100,
      },
      maxTeachers: {
        type: Number,
        default: 10,
      },
    },
    stats: {
      totalStudents: {
        type: Number,
        default: 0,
      },
      totalTeachers: {
        type: Number,
        default: 0,
      },
      totalCourses: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
// Note: code and email already have indexes from schema definitions
SchoolSchema.index({ isActive: 1 });
SchoolSchema.index({ 'subscription.plan': 1 });

const School: Model<ISchool> =
  mongoose.models.School || mongoose.model<ISchool>('School', SchoolSchema);

export default School;
