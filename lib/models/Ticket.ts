import mongoose, { Document, Schema } from 'mongoose'

export interface ITicketResponse {
  message: string
  respondedBy: mongoose.Types.ObjectId
  respondedAt: Date
  isAdmin: boolean
}

export interface ITicket extends Document {
  title: string
  description: string
  category: 'Academic' | 'Infrastructure' | 'Transport' | 'Canteen' | 'Bullying' | 'Other'
  priority: 'low' | 'medium' | 'high'
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  studentId: mongoose.Types.ObjectId
  schoolId: mongoose.Types.ObjectId
  assignedTo?: mongoose.Types.ObjectId
  responses: ITicketResponse[]
  attachments?: string[]
  createdAt: Date
  updatedAt: Date
}

const TicketResponseSchema = new Schema({
  message: {
    type: String,
    required: true,
  },
  respondedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  respondedAt: {
    type: Date,
    default: Date.now,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
})

const TicketSchema = new Schema<ITicket>(
  {
    title: {
      type: String,
      required: [true, 'Ticket title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      enum: ['Academic', 'Infrastructure', 'Transport', 'Canteen', 'Bullying', 'Other'],
      required: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved', 'closed'],
      default: 'open',
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    responses: [TicketResponseSchema],
    attachments: [String],
  },
  {
    timestamps: true,
  }
)

// Compound index for efficient queries
TicketSchema.index({ schoolId: 1, status: 1, createdAt: -1 })
TicketSchema.index({ studentId: 1, createdAt: -1 })

export default mongoose.models.Ticket || mongoose.model<ITicket>('Ticket', TicketSchema)
