import mongoose, { Schema, Document } from "mongoose";

export interface FileTemplateDocument extends Document {
  projectId: mongoose.Types.ObjectId;
  path: string;
  content: string;
  readOnly: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const fileTemplateSchema = new Schema<FileTemplateDocument>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Project",
    },
    path: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const FileTemplate = mongoose.model<FileTemplateDocument>(
  "FileTemplate",
  fileTemplateSchema,
);

export default FileTemplate;
