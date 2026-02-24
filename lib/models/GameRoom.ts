import mongoose, { Document, Schema } from 'mongoose'

export interface IPlayer {
  userId: mongoose.Types.ObjectId
  name: string
  team: 'alpha' | 'beta'
  score: number
  isReady: boolean
}

export interface IGameRoom extends Document {
  roomCode: string
  password: string
  challengeId: string
  creatorId: mongoose.Types.ObjectId
  schoolId: mongoose.Types.ObjectId
  classId?: mongoose.Types.ObjectId
  status: 'waiting' | 'in-progress' | 'completed'
  maxPlayersPerTeam: number
  players: IPlayer[]
  gameState: {
    ropePosition: number
    currentQuestionIndex: number
    teamAScore: number
    teamBScore: number
    winner: 'alpha' | 'beta' | null
  }
  questions: Array<{
    id: string
    question: string
    options: string[]
    correctAnswer: number
  }>
  startedAt?: Date
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const PlayerSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  team: {
    type: String,
    enum: ['alpha', 'beta'],
    required: true,
  },
  score: {
    type: Number,
    default: 0,
  },
  isReady: {
    type: Boolean,
    default: false,
  },
})

const GameRoomSchema = new Schema<IGameRoom>(
  {
    roomCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
      uppercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    challengeId: {
      type: String,
      required: true,
    },
    creatorId: {
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
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
    },
    status: {
      type: String,
      enum: ['waiting', 'in-progress', 'completed'],
      default: 'waiting',
      index: true,
    },
    maxPlayersPerTeam: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    players: [PlayerSchema],
    gameState: {
      ropePosition: {
        type: Number,
        default: 50,
      },
      currentQuestionIndex: {
        type: Number,
        default: 0,
      },
      teamAScore: {
        type: Number,
        default: 0,
      },
      teamBScore: {
        type: Number,
        default: 0,
      },
      winner: {
        type: String,
        enum: ['alpha', 'beta', null],
        default: null,
      },
    },
    questions: [
      {
        id: String,
        question: String,
        options: [String],
        correctAnswer: Number,
      },
    ],
    startedAt: Date,
    completedAt: Date,
  },
  {
    timestamps: true,
  }
)

// Compound index for efficient queries
GameRoomSchema.index({ schoolId: 1, status: 1, createdAt: -1 })
GameRoomSchema.index({ roomCode: 1, status: 1 })

// Auto-delete completed rooms after 24 hours
GameRoomSchema.index({ completedAt: 1 }, { expireAfterSeconds: 86400 })

export default mongoose.models.GameRoom || mongoose.model<IGameRoom>('GameRoom', GameRoomSchema)
