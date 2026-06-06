import mongoose, { Schema, Document, Types } from "mongoose";

export interface RefreshTokenDocument extends Document {
  tokenHash: string;
  userId: Types.ObjectId;
  family: string;
  isRevoked: boolean;
  expiresAt: Date;
}

const refreshTokenSchema = new Schema<RefreshTokenDocument>(
  {
    tokenHash: { type: String, required: true, unique: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    family: { type: String, required: true, index: true },
    isRevoked: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

// MongoDB TTL index — auto-deletes expired tokens so the collection stays clean
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<RefreshTokenDocument>(
  "RefreshToken",
  refreshTokenSchema,
);
