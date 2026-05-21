import mongoose, { Schema } from "mongoose";
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        trim: true,
    },
    lastLogin: {
        type: Date,
        default: Date.now,
    },
    avatarUrl: {
        type: String,
        default: "",
    },
    currentStreak: {
        type: Number,
        default: 0,
    },
    highestStreak: {
        type: Number,
        default: 0,
    },
    skills: {
        frontend: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        backend: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        database: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        devops: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
    },
}, {
    timestamps: true,
});
const User = mongoose.model("User", userSchema);
export default User;
