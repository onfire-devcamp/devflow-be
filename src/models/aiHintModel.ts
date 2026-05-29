import mongoose, { Schema, Document } from "mongoose";

export type AIHintType = "hint" | "explain";

export interface AIHintDocument extends Document {
  userId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  taskId: mongoose.Types.ObjectId;
  fileId: mongoose.Types.ObjectId;
  type: AIHintType;
  selectedCode: string;
  aiResponse: string;
  createdAt: Date;
  updatedAt: Date;
}

const aiHintSchema = new Schema<AIHintDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    projectId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Project",
    },
    taskId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Task",
    },
    fileId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "FileTemplate",
    },
    type: {
      type: String,
      enum: ["hint", "explain"],
      required: true,
    },
    selectedCode: {
      type: String,
      required: true,
    },
    aiResponse: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

aiHintSchema.index({ userId: 1, taskId: 1, createdAt: -1 });

const AIHint = mongoose.model<AIHintDocument>("AIHint", aiHintSchema);

export default AIHint;
