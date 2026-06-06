import mongoose, { Schema, Document } from "mongoose";

export interface UserFileDocument extends Document {
  userId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  fileId: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const userFileSchema = new Schema<UserFileDocument>(
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
    fileId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "FileTemplate",
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

userFileSchema.index({ userId: 1, projectId: 1, fileId: 1 }, { unique: true });

const UserFile = mongoose.model<UserFileDocument>("UserFile", userFileSchema);

export default UserFile;
