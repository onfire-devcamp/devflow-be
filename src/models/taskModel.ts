import mongoose, { Schema, Document } from "mongoose";

export type TaskDifficulty = "Beginner" | "Intermediate" | "Advanced";
export type SkillCategory = "Frontend" | "Backend" | "Database" | "DevOps";

export interface TaskMcq {
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctAnswer: string;
}

export interface TaskDocument extends Document {
  moduleId: mongoose.Types.ObjectId;
  fileId: mongoose.Types.ObjectId[];
  title: string;
  description?: string;
  order: number;
  instructions?: string;
  difficulty: TaskDifficulty;
  concepts?: string[];
  mcq?: TaskMcq;
  skillCategory: SkillCategory;
  skillPoints: number;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<TaskDocument>(
  {
    moduleId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Module",
    },
    fileId: [
      {
        type: Schema.Types.ObjectId,
        ref: "FileTemplate",
      },
    ],
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    order: {
      type: Number,
      required: true,
    },
    instructions: {
      type: String,
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    concepts: {
      type: [String],
    },
    mcq: {
      question: { type: String, trim: true },
      options: [
        {
          id: { type: String, required: true, trim: true },
          text: { type: String, required: true, trim: true },
        },
      ],
      correctAnswer: { type: String, trim: true },
    },
    skillCategory: {
      type: String,
      enum: ["Frontend", "Backend", "Database", "DevOps"],
      required: true,
    },
    skillPoints: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Task = mongoose.model<TaskDocument>("Task", taskSchema);

export default Task;
