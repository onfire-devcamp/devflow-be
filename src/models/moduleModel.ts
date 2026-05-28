import mongoose, { Schema, Document } from "mongoose";

export interface ModuleDocument extends Document {
  projectId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  order: number;
}

const moduleSchema = new Schema<ModuleDocument>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Project",
    },
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
  },
  {
    timestamps: true,
  },
);

moduleSchema.index({ projectId: 1, order: 1 }, { unique: true });

const Module = mongoose.model<ModuleDocument>("Module", moduleSchema);

export default Module;
