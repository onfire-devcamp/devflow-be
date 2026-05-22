// src/controllers/userControllers.ts
import type { Request, Response } from "express";
import User from "../models/userModel.js";
import type {
  EmptyObject,
  UserIdParams,
  RegisterPayload,
  UserQuery,
  UserUpdatePayload,
  LoginPayload,
} from "../types/userTypes.js";
import {
  loginUserService,
  createUserService,
} from "../services/userServices.js";

// GET /users
export const getUser = async (
  req: Request<EmptyObject, unknown, EmptyObject, UserQuery>,
  res: Response,
): Promise<void> => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Getting error", error: errorMessage });
  }
};

// POST /users (Register / Create User)
export const createUser = async (
  req: Request<EmptyObject, unknown, RegisterPayload, UserQuery>,
  res: Response,
): Promise<void> => {
  try {
    const { email, password, username, avatarUrl, skills } = req.body;

    if (!email || !password || !username) {
      res
        .status(400)
        .json({ message: "Email, password, and username are required." });
      return;
    }
    const user = await createUserService({
      email,
      password,
      username,
      avatarUrl,
      skills,
    });
    res.status(201).json(user);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage === "Email already exists") {
      res.status(400).json({ message: errorMessage });
      return;
    }
    res.status(500).json({ message: "Creating error", error: errorMessage });
  }
};

// PUT /users/:id
export const updateUser = async (
  req: Request<UserIdParams, unknown, UserUpdatePayload, UserQuery>,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    res.status(200).json(user);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Updating error", error: errorMessage });
  }
};

// DELETE /users/:id
export const deleteUser = async (
  req: Request<UserIdParams, unknown, EmptyObject, UserQuery>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "Deleted" });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Deleting error", error: errorMessage });
  }
};

// POST /users/login
export const loginUser = async (
  req: Request<EmptyObject, unknown, LoginPayload, UserQuery>,
  res: Response,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res
        .status(400)
        .json({ message: "Please provide both email and password." });
      return;
    }
    const result = await loginUserService({ email, password });
    res.status(200).json({
      message: "Login successful!",
      ...result,
    });
  } catch (error: any) {
    if (error.message === "Invalid email or password!") {
      res.status(401).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }
};
