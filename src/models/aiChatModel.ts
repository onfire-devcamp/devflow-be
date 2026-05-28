import mongoose, { Schema, Document } from "mongoose";

export type AIChatRole = "user" | "mentor";

export interface AIChatDocument extends Document {
  userId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  taskId: mongoose.Types.ObjectId;
  message: string;
  role: AIChatRole;
}

const aiChatSchema = new Schema<AIChatDocument>(
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
    message: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "mentor"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

aiChatSchema.index({ userId: 1, taskId: 1, createdAt: -1 });

const AIChat = mongoose.model<AIChatDocument>("AIChat", aiChatSchema);

export default AIChat;
