import mongoose, { Schema, Document, Model } from 'mongoose';

// ===== Subdocument Interfaces =====

interface AttachmentDoc {
  type: 'image' | 'pdf';
  url: string;
  filename: string;
  filesize: number;
}

interface PollOptionDoc {
  text: string;
  votes: mongoose.Types.ObjectId[];
}

interface PollDoc {
  question: string;
  options: PollOptionDoc[];
  expiresAt?: Date;
  closed: boolean;
}

// ===== GroupMessage Interface =====

export interface IGroupMessage extends Document {
  groupId: string;
  userId: mongoose.Types.ObjectId;
  type: 'text' | 'file' | 'poll' | 'system';
  content?: string;
  attachments?: AttachmentDoc[];
  poll?: PollDoc;
  createdAt: Date;
  editedAt?: Date;
}

// ===== Schemas =====

const attachmentSchema = new Schema<AttachmentDoc>(
  {
    type: { type: String, required: true, enum: ['image', 'pdf'] },
    url: { type: String, required: true },
    filename: { type: String, required: true },
    filesize: { type: Number, required: true },
  },
  { _id: false },
);

const pollOptionSchema = new Schema<PollOptionDoc>(
  {
    text: { type: String, required: true },
    votes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { _id: false },
);

const pollSchema = new Schema<PollDoc>(
  {
    question: { type: String, required: true },
    options: [pollOptionSchema],
    expiresAt: { type: Date },
    closed: { type: Boolean, default: false },
  },
  { _id: false },
);

const groupMessageSchema = new Schema<IGroupMessage>(
  {
    groupId: {
      type: String,
      required: true,
      enum: ['dsa', 'system-design', 'backend', 'conceptual', 'behavioural'],
      index: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      required: true,
      enum: ['text', 'file', 'poll', 'system'],
      default: 'text',
    },
    content: { type: String },
    attachments: [attachmentSchema],
    poll: pollSchema,
    editedAt: { type: Date },
  },
  { timestamps: true },
);

// Compound index for paginated message retrieval
groupMessageSchema.index({ groupId: 1, createdAt: -1 });

const GroupMessage: Model<IGroupMessage> = mongoose.model<IGroupMessage>('GroupMessage', groupMessageSchema);

export default GroupMessage;
