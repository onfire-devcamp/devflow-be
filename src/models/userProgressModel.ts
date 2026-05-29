import mongoose, { Schema, Document } from "mongoose";

export interface UserProgressDocument extends Document {
  userId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  completedTaskIds: mongoose.Types.ObjectId[];
  unlockedModuleIds: mongoose.Types.ObjectId[];
  lastActiveTaskId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const userProgressSchema = new Schema<UserProgressDocument>(
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
    completedTaskIds: {
      type: [Schema.Types.ObjectId],
      ref: "Task",
      default: [],
    },
    unlockedModuleIds: {
      type: [Schema.Types.ObjectId],
      ref: "Module",
      default: [],
    },
    lastActiveTaskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },
  },
  {
    timestamps: true,
  },
);

userProgressSchema.index({ userId: 1, projectId: 1 }, { unique: true });
userProgressSchema.index({ userId: 1, projectId: 1, unlockedModuleIds: 1 });
userProgressSchema.index({ userId: 1, projectId: 1, completedTaskIds: 1 });

const UserProgress = mongoose.model<UserProgressDocument>(
  "UserProgress",
  userProgressSchema,
);

export default UserProgress;
