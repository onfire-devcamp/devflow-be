import mongoose, { Schema } from "mongoose";
const activitySchema = new Schema({
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
}, {
    timestamps: {
        createdAt: true,
        updatedAt: false,
    },
});
const Activity = mongoose.model("Activity", activitySchema);
export default Activity;
