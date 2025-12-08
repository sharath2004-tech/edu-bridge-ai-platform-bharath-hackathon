import mongoose, { Document } from 'mongoose'

export interface IGamification extends Document {
  userId: mongoose.Schema.Types.ObjectId
  xp: number
  level: number
  streak: number
  lastActivityDate: Date
  badges: Array<{
    id: string
    name: string
    description: string
    icon: string
    earnedAt: Date
  }>
  achievements: Array<{
    id: string
    title: string
    progress: number
    target: number
    completed: boolean
  }>
}

const GamificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  streak: { type: Number, default: 0 },
  lastActivityDate: { type: Date, default: null },
  badges: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: String,
    icon: String,
    earnedAt: { type: Date, default: Date.now }
  }],
  achievements: [{
    id: { type: String, required: true },
    title: { type: String, required: true },
    progress: { type: Number, default: 0 },
    target: { type: Number, required: true },
    completed: { type: Boolean, default: false }
  }]
}, { timestamps: true })

GamificationSchema.index({ userId: 1 })
GamificationSchema.index({ xp: -1 })
GamificationSchema.index({ level: -1 })

export default mongoose.models.Gamification || mongoose.model<IGamification>('Gamification', GamificationSchema)
