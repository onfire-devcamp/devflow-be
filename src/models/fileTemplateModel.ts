import mongoose, { Schema, Document } from "mongoose";

export interface FileTemplateDocument extends Document {
  projectId: mongoose.Types.ObjectId;
  path: string;
  content: string;
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
