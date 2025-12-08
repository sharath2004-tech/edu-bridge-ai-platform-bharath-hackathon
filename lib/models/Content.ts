import mongoose, { Document, Model, Schema } from 'mongoose'

export type ContentType = 'video' | 'audio' | 'pdf' | 'text'

export interface IContent extends Document {
  _id: string
  title: string
  description?: string
  type: ContentType
  url?: string // storage URL for video/audio/pdf
  text?: string // inline text content when type=text
  section: mongoose.Types.ObjectId
  owner: mongoose.Types.ObjectId // teacher who uploaded
  createdAt: Date
  updatedAt: Date
}

const ContentSchema = new Schema<IContent>({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['video','audio','pdf','text'], required: true },
  url: { type: String },
  text: { type: String },
  section: { type: Schema.Types.ObjectId, ref: 'Section', required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true })

ContentSchema.index({ section: 1, createdAt: -1 })

const Content: Model<IContent> = mongoose.models.Content || mongoose.model<IContent>('Content', ContentSchema)
export default Content
