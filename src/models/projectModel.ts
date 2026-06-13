import mongoose, { Schema, Document } from "mongoose";

export type ProjectLevel = "Beginner" | "Intermediate" | "Advanced";
export type TechStackCategory = "Frontend" | "Backend" | "Database" | "DevOps";

export interface ProjectTechStackItem {
  name: string;
  iconUrl: string;
  category: TechStackCategory;
}

export interface ProjectFeatureItem {
  title: string;
  description: string;
}

export interface ProjectDocument extends Document {
  title: string;
  slug: string;
  description?: string;
  level: ProjectLevel;
  previewUrl?: string;
  systemFlowUrl?: string;
  techStack: ProjectTechStackItem[];
  features: ProjectFeatureItem[];
  createdAt: Date;
  updatedAt: Date;
}

const projectTechStackSchema = new Schema<ProjectTechStackItem>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    iconUrl: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["Frontend", "Backend", "Database", "DevOps"],
      required: true,
    },
  },
  {
    _id: false,
  },
);

const projectFeatureSchema = new Schema<ProjectFeatureItem>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const projectSchema = new Schema<ProjectDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },
    previewUrl: {
      type: String,
      trim: true,
    },
    systemFlowUrl: {
      type: String,
      trim: true,
    },
    techStack: {
      type: [projectTechStackSchema],
      default: [],
    },
    features: {
      type: [projectFeatureSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Project = mongoose.model<ProjectDocument>("Project", projectSchema);

export default Project;
