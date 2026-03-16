import mongoose, { Schema, Document, Model } from 'mongoose';
import type { AuthTokenPurpose } from '@prepsync/shared';

export interface IAuthToken extends Document {
  userId: mongoose.Types.ObjectId;
  tokenHash: string;
  purpose: AuthTokenPurpose;
  expiresAt: Date;
  usedAt?: Date;
}

const authTokenSchema = new Schema<IAuthToken>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    tokenHash: { type: String, required: true },
    purpose: {
      type: String,
      required: true,
      enum: ['email_verification', 'password_reset', 'magic_login'],
    },
    expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
    usedAt: { type: Date },
  },
  { timestamps: true },
);

// Compound index for efficient lookup
authTokenSchema.index({ userId: 1, purpose: 1 });

const AuthToken: Model<IAuthToken> = mongoose.model<IAuthToken>('AuthToken', authTokenSchema);

export default AuthToken;
