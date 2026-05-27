import mongoose, { Schema, Document } from "mongoose";

export type AIEvaluationType = "codeReview" | "explainToPass";
export type AIEvaluationPassStatus = "PASS" | "FAIL";

export interface AIEvaluationDocument extends Document {
  userId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  taskId: mongoose.Types.ObjectId;
  type: AIEvaluationType;
  inputData: string | Record<string, unknown>;
  score: number;
  passStatus: AIEvaluationPassStatus;
  feedback: string;
}

const aiEvaluationSchema = new Schema<AIEvaluationDocument>(
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
    type: {
      type: String,
      enum: ["codeReview", "explainToPass"],
      required: true,
    },
    inputData: {
      type: Schema.Types.Mixed,
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    passStatus: {
      type: String,
      enum: ["PASS", "FAIL"],
      required: true,
    },
    feedback: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

aiEvaluationSchema.index({ userId: 1, taskId: 1, createdAt: -1 });

const AIEvaluation = mongoose.model<AIEvaluationDocument>(
  "AIEvaluation",
  aiEvaluationSchema,
);

export default AIEvaluation;
