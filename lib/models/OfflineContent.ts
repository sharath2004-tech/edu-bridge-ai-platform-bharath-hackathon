import mongoose, { Document } from 'mongoose'

export interface IOfflineContent extends Document {
  userId: mongoose.Schema.Types.ObjectId
  courseId?: mongoose.Schema.Types.ObjectId
  contentId?: mongoose.Schema.Types.ObjectId
  lessonId?: mongoose.Schema.Types.ObjectId
  contentType: 'video' | 'pdf' | 'audio' | 'notes' | 'quiz' | 'text'
  fileName: string
  fileSize: number
  fileUrl: string
  downloadedAt: Date
  lastAccessedAt: Date
  syncStatus: 'pending' | 'synced' | 'outdated'
}

const OfflineContentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  contentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Content' },
  lessonId: { type: mongoose.Schema.Types.ObjectId },
  contentType: { type: String, enum: ['video', 'pdf', 'audio', 'notes', 'quiz', 'text'], required: true },
  fileName: { type: String, required: true },
  fileSize: { type: Number, required: true },  fileUrl: { type: String, required: true },  downloadedAt: { type: Date, default: Date.now },
  lastAccessedAt: { type: Date, default: Date.now },
  syncStatus: { type: String, enum: ['pending', 'synced', 'outdated'], default: 'synced' }
}, { timestamps: true })

OfflineContentSchema.index({ userId: 1, courseId: 1 })
OfflineContentSchema.index({ syncStatus: 1 })

export default mongoose.models.OfflineContent || mongoose.model<IOfflineContent>('OfflineContent', OfflineContentSchema)
