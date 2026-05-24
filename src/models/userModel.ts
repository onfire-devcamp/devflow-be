import mongoose, { Schema, Document } from "mongoose";

export interface UserSkills {
  frontend: number;
  backend: number;
  database: number;
  devops: number;
}

export interface UserDocument extends Document {
  email: string;
  passwordHash: string;
  username: string;
  lastLogin: Date;
  avatarUrl: string;
  currentStreak: number;
  highestStreak: number;
  lastStreakDate?: Date;
  skills: UserSkills;
}

const userSchema = new Schema<UserDocument>(
  {
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
      select: false,
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
    lastStreakDate: {
      type: Date,
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
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
