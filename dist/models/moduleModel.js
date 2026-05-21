import mongoose, { Schema } from "mongoose";
const moduleSchema = new Schema({
    projectId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Project",
    },
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
}, {
    timestamps: true,
});
const Module = mongoose.model("Module", moduleSchema);
export default Module;
