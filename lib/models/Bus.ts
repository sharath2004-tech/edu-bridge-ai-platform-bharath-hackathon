import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IBus extends Document {
  schoolId: mongoose.Types.ObjectId;
  busNumber: string; // e.g., BUS-001
  routeName: string; // e.g., North Route - Downtown
  capacity: number;
  driverName?: string;
  driverPhone?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BusSchema = new Schema<IBus>(
  {
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: [true, 'School ID is required'],
      index: true,
    },
    busNumber: {
      type: String,
      required: [true, 'Bus number is required'],
      trim: true,
      uppercase: true,
    },
    routeName: {
      type: String,
      required: [true, 'Route name is required'],
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1'],
      max: [100, 'Capacity cannot exceed 100'],
    },
    driverName: {
      type: String,
      trim: true,
    },
    driverPhone: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index: unique bus number per school
BusSchema.index({ schoolId: 1, busNumber: 1 }, { unique: true });

// Index for queries
BusSchema.index({ isActive: 1 });

const Bus: Model<IBus> = mongoose.models.Bus || mongoose.model<IBus>('Bus', BusSchema);

export default Bus;
