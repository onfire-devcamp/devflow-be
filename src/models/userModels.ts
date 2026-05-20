import mongoose from "mongoose";

interface UserDocument {
  name: string;
  email: string;
}

const userSchema = new mongoose.Schema<UserDocument>({
  name: String,
  email: String,
});

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
