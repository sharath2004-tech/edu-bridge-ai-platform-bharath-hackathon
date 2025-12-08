import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IStandaloneQuiz extends Document {
  title: string
  subject: string
  description?: string
  instructor: mongoose.Types.ObjectId
  questions: {
    question: string
    options: string[]
    correctAnswer: number
    explanation?: string
  }[]
  passingScore: number
  status: 'draft' | 'published'
  createdAt: Date
  updatedAt: Date
}

const StandaloneQuizSchema = new Schema<IStandaloneQuiz>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a quiz title'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Please specify a subject'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
)

// Indexes
StandaloneQuizSchema.index({ instructor: 1 })
StandaloneQuizSchema.index({ subject: 1 })
StandaloneQuizSchema.index({ status: 1 })
StandaloneQuizSchema.index({ title: 'text', subject: 'text' })

const StandaloneQuiz: Model<IStandaloneQuiz> =
  mongoose.models.StandaloneQuiz || mongoose.model<IStandaloneQuiz>('StandaloneQuiz', StandaloneQuizSchema)

export default StandaloneQuiz
