import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { LoginPayload } from "../types/userTypes.js";
import { env } from "../config/environment.js";

export const loginUserService = async (input: LoginPayload) => {
  const { email, password } = input;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid email or password!");
  }
  const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordMatch) {
    throw new Error("Invalid email or password!");
  }
  const secretKey = env.JWT_SECRET || "fallback_secret_key";
  const token = jwt.sign({ userId: user._id, email: user.email }, secretKey, {
    expiresIn: "1d",
  });
  return {
    token,
    user: {
      id: user._id,
      name: user.username,
      email: user.email,
    },
  };
};
