import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IChatMessage extends Document {
  userId: mongoose.Types.ObjectId
  userName: string
  role: 'user' | 'assistant'
  content: string
  language: string
  quizMode: boolean
  timestamp: Date
}

const ChatMessageSchema = new Schema<IChatMessage>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  language: { type: String, default: 'english' },
  quizMode: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true })

// Indexes for performance
ChatMessageSchema.index({ userId: 1, timestamp: -1 })
ChatMessageSchema.index({ userName: 1, timestamp: -1 })
ChatMessageSchema.index({ quizMode: 1 })

const ChatMessage: Model<IChatMessage> = mongoose.models.ChatMessage || mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema)
export default ChatMessage
