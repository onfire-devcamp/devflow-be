import mongoose, { Schema } from "mongoose";
const taskSchema = new Schema({
    moduleId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Module",
    },
    fileId: [
        {
            type: Schema.Types.ObjectId,
            ref: "FileTemplate",
        },
    ],
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
    instructions: {
        type: String,
    },
    difficulty: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced"],
        default: "Beginner",
    },
    concepts: {
        type: String,
    },
    skillCategory: {
        type: String,
        enum: ["Frontend", "Backend", "Database", "DevOps"],
        required: true,
    },
    skillPoints: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
const Task = mongoose.model("Task", taskSchema);
export default Task;
