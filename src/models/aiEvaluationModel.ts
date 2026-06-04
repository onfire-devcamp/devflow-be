import mongoose, { Schema, Document } from "mongoose";

export type AIEvaluationType = "codeReview" | "explainToPass";
export type AIEvaluationPassStatus = "PASS" | "FAIL";

export interface AIEvaluationInput {
  rawText?: string;
  codeSnippet?: string;
  language?: string;
  mcqAnswer?: string;
  explanation?: string;
}

export interface AIEvaluationDocument extends Document {
  userId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  taskId: mongoose.Types.ObjectId;
  type: AIEvaluationType;
  inputData: AIEvaluationInput;
  score: number;
  passStatus: AIEvaluationPassStatus;
  feedback: string;
  createdAt: Date;
  updatedAt: Date;
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
      rawText: { type: String, trim: true },
      codeSnippet: { type: String },
      language: { type: String, trim: true },
      mcqAnswer: { type: String, trim: true },
      explanation: { type: String, trim: true },
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
