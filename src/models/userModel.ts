import mongoose, { Schema, Document } from "mongoose";

export interface UserSkills {
  frontend: number;
  backend: number;
  fullstack: number;
}

export interface UserDocument extends Document {
  email: string;
  passwordHash?: string;
  username: string;
  provider: "local" | "google";
  providerId?: string;
  lastLogin: Date;
  avatarUrl: string;
  bio?: string;
  workplace?: string;
  socialLinks?: Array<{ platform: string; url: string }>;
  currentStreak: number;
  highestStreak: number;
  lastStreakDate?: Date;
  skills: UserSkills;
  totalXp: number;
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
      select: false,
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    providerId: {
      type: String,
      default: "",
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
    bio: {
      type: String,
      maxlength: 160,
      default: "",
    },
    workplace: {
      type: String,
      default: "",
    },
    socialLinks: [
      {
        platform: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
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
      fullstack: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
    },
    totalXp: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
