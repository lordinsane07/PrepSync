import mongoose, { Schema, Document, Model } from 'mongoose';
import type { Domain, Difficulty, SessionType, SessionStatus, TranscriptEntryRole, TranscriptEntryType } from '@prepsync/shared';

// ===== Subdocument Interfaces =====

interface TranscriptEntryDoc {
  role: TranscriptEntryRole;
  content: string;
  timestamp: Date;
  type: TranscriptEntryType;
}

interface EvaluationDimensionsDoc {
  correctness: number;
  approachQuality: number;
  timeEfficiency: number;
  communicationClarity: number;
  problemDecomposition: number;
  edgeCaseHandling: number;
}

interface EvaluationReportDoc {
  overallScore: number;
  dimensions: EvaluationDimensionsDoc;
  mistakesIdentified: string[];
  strongAnswerExample: string;
  improvementSuggestions: string[];
  topicsToReview: string[];
  generatedAt: Date;
}

interface SessionSummaryDoc {
  topicsCovered: string[];
  strongMoments: string[];
  weakMoments: string[];
  actionItems: string[];
  generatedAt: Date;
}

// ===== Session Interface =====

export interface ISession extends Document {
  type: SessionType;
  userId: mongoose.Types.ObjectId;
  peerId?: mongoose.Types.ObjectId;
  domain: Domain;
  difficulty: Difficulty;
  durationMinutes: number;
  startedAt: Date;
  endedAt?: Date;
  status: SessionStatus;
  peerRating?: number;
  transcript: TranscriptEntryDoc[];
  evaluationReport?: EvaluationReportDoc;
  summary?: SessionSummaryDoc;
  createdAt: Date;
  updatedAt: Date;
}

// ===== Schemas =====

const transcriptEntrySchema = new Schema<TranscriptEntryDoc>(
  {
    role: { type: String, required: true, enum: ['ai', 'user', 'system'] },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    type: { type: String, required: true, enum: ['text', 'code', 'whiteboard_snapshot'] },
  },
  { _id: false },
);

const evaluationDimensionsSchema = new Schema(
  {
    correctness: { type: Number, min: 0, max: 100, default: 0 },
    approachQuality: { type: Number, min: 0, max: 100, default: 0 },
    timeEfficiency: { type: Number, min: 0, max: 100, default: 0 },
    communicationClarity: { type: Number, min: 0, max: 100, default: 0 },
    problemDecomposition: { type: Number, min: 0, max: 100, default: 0 },
    edgeCaseHandling: { type: Number, min: 0, max: 100, default: 0 },
  },
  { _id: false },
);

const evaluationReportSchema = new Schema(
  {
    overallScore: { type: Number, min: 0, max: 100, required: true },
    dimensions: { type: evaluationDimensionsSchema, required: true },
    mistakesIdentified: [{ type: String }],
    strongAnswerExample: { type: String },
    improvementSuggestions: [{ type: String }],
    topicsToReview: [{ type: String }],
    generatedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const sessionSummarySchema = new Schema(
  {
    topicsCovered: [{ type: String }],
    strongMoments: [{ type: String }],
    weakMoments: [{ type: String }],
    actionItems: [{ type: String }],
    generatedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const sessionSchema = new Schema<ISession>(
  {
    type: { type: String, required: true, enum: ['ai', 'peer'] },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    peerId: { type: Schema.Types.ObjectId, ref: 'User' },
    domain: {
      type: String,
      required: true,
      enum: ['dsa', 'systemDesign', 'backend', 'conceptual', 'behavioural'],
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['easy', 'medium', 'hard', 'faang'],
    },
    durationMinutes: { type: Number, required: true, min: 10, max: 120 },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
    status: {
      type: String,
      default: 'active',
      enum: ['active', 'completed', 'abandoned'],
    },
    peerRating: { type: Number, min: 1, max: 5 },
    transcript: [transcriptEntrySchema],
    evaluationReport: evaluationReportSchema,
    summary: sessionSummarySchema,
  },
  { timestamps: true },
);

// Compound index for user's session history
sessionSchema.index({ userId: 1, startedAt: -1 });
sessionSchema.index({ userId: 1, domain: 1 });

const Session: Model<ISession> = mongoose.model<ISession>('Session', sessionSchema);

export default Session;
