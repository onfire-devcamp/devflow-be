import mongoose, { Schema, Document } from "mongoose";

export interface TaskFileDocument extends Document {
  taskId: mongoose.Types.ObjectId;
  fileId: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const taskFileSchema = new Schema<TaskFileDocument>(
  {
    taskId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Task",
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

taskFileSchema.index({ taskId: 1, fileId: 1 }, { unique: true });

const TaskFile = mongoose.model<TaskFileDocument>("TaskFile", taskFileSchema);

export default TaskFile;
