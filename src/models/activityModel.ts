import mongoose, { Schema, Document } from "mongoose";

export type ActivityType = "PROJECT_START" | "TASK_SUBMIT_FAIL" | "TASK_PASS";

export interface ActivityDocument extends Document {
  userId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  taskId?: mongoose.Types.ObjectId;
  type: ActivityType;
  moduleName: string;
  activityTitle: string;
}

const activitySchema = new Schema<ActivityDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Project",
    },
    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },
    type: {
      type: String,
      enum: ["PROJECT_START", "TASK_SUBMIT_FAIL", "TASK_PASS"],
      required: true,
    },
    moduleName: {
      type: String,
      required: true,
    },
    activityTitle: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  },
);

const Activity = mongoose.model<ActivityDocument>("Activity", activitySchema);

export default Activity;
