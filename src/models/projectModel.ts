import mongoose, { Schema, Document } from "mongoose";

export interface ProjectDocument extends Document {
  title: string;
  description?: string;
  previewUrl?: string;
  techStack: string[];
  features: string[];
  systemFlowUrl?: string;
}

const projectSchema = new Schema<ProjectDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    previewUrl: {
      type: String,
    },
    techStack: {
      type: [String],
      default: [],
    },
    features: {
      type: [String],
      default: [],
    },
    systemFlowUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const Project = mongoose.model<ProjectDocument>("Project", projectSchema);

export default Project;
