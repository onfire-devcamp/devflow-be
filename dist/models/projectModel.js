import mongoose, { Schema } from "mongoose";
const projectSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    previewUrl: {
        type: String,
    },
    techStack: {
        type: [String],
        default: [],
    },
    features: {
        type: [String],
        default: [],
    },
    systemFlowUrl: {
        type: String,
    },
}, {
    timestamps: true,
});
const Project = mongoose.model("Project", projectSchema);
export default Project;
