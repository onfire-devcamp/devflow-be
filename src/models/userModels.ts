import mongoose from "mongoose";

interface UserDocument {
  name: string;
  email: string;
  passwordHash: string;
  username: string;
  createdAt: Date;
  lastLogin: Date;
}

const userSchema = new mongoose.Schema<UserDocument>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: null },
});

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
