import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  description: string;
  instructor: mongoose.Types.ObjectId;
  schoolId?: mongoose.Types.ObjectId;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  thumbnail?: string;
  price: number;
  duration: number; // in minutes
  classes?: string[]; // Array of class names this course is assigned to
  isPublished?: boolean;
  createdBy?: mongoose.Types.ObjectId;
  lessons: {
    title: string;
    description: string;
    content: string;
    videoUrl?: string;
    duration: number;
    order: number;
  }[];
  quizzes: {
    title: string;
    questions: {
      question: string;
      options: string[];
      correctAnswer: number;
      explanation?: string;
    }[];
    passingScore: number;
  }[];
  sections: mongoose.Types.ObjectId[]; // Sections this course is assigned to
  enrolledStudents: mongoose.Types.ObjectId[];
  rating: number;
  reviews: {
    user: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
  }[];
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a course title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a course description'],
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: 'School',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    classes: [
      {
        type: String,
        trim: true,
      },
    ],
    isPublished: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      trim: true,
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    thumbnail: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      default: 0,
      min: [0, 'Price cannot be negative'],
    },
    duration: {
      type: Number,
      required: true,
      min: [0, 'Duration cannot be negative'],
    },
    lessons: [
      {
        title: {
          type: String,
          required: true,
        },
        description: String,
        content: {
          type: String,
          required: true,
        },
        videoUrl: String,
        duration: {
          type: Number,
          required: true,
        },
        order: {
          type: Number,
          required: true,
        },
      },
    ],
    quizzes: [
      {
        title: {
          type: String,
          required: true,
        },
        questions: [
          {
            question: {
              type: String,
              required: true,
            },
            options: {
              type: [String],
              required: true,
              validate: {
                validator: (v: string[]) => v.length >= 2,
                message: 'At least 2 options are required',
              },
            },
            correctAnswer: {
              type: Number,
              required: true,
            },
            explanation: String,
          },
        ],
        passingScore: {
          type: Number,
          default: 70,
          min: 0,
          max: 100,
        },
      },
    ],
    sections: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Section',
      },
    ],
    enrolledStudents: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
          maxlength: [1000, 'Comment cannot be more than 1000 characters'],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
CourseSchema.index({ title: 'text', description: 'text' });
CourseSchema.index({ instructor: 1 });
CourseSchema.index({ schoolId: 1 });
CourseSchema.index({ category: 1, level: 1 });
CourseSchema.index({ status: 1 });
CourseSchema.index({ rating: -1 });

const Course: Model<ICourse> =
  mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);

export default Course;
