// src/services/userServices.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { LoginPayload, RegisterPayload } from "../types/userTypes.js";
import { env } from "../config/environment.js";

export const createUserService = async (input: RegisterPayload) => {
  const { email, password, username, avatarUrl, skills } = input;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email already exists");
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const user = await User.create({
    email,
    passwordHash,
    username,
    avatarUrl,
    skills,
  });

  return {
    id: user._id,
    username: user.username,
    email: user.email,
  };
};

export const loginUserService = async (input: LoginPayload) => {
  const { email, password } = input;
  const user = await User.findOne({ email }).select("+passwordHash");

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
