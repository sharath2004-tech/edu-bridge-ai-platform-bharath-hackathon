import mongoose, { Document, Model, Schema } from 'mongoose'

export interface ISection extends Document {
  _id: string
  name: string
  owner: mongoose.Types.ObjectId // teacher/admin who created
  students: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const SectionSchema = new Schema<ISection>({
  name: { type: String, required: true, trim: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  students: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true })

SectionSchema.index({ owner: 1, name: 1 }, { unique: true })

const Section: Model<ISection> = mongoose.models.Section || mongoose.model<ISection>('Section', SectionSchema)
export default Section
