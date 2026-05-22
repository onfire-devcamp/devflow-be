// src/controllers/userControllers.ts
import type { Request, Response } from "express";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import type {
  EmptyObject,
  RegisterPayload,
  UserQuery,
  UserUpdatePayload,
  LoginPayload,
} from "../types/userTypes.js";
import {
  loginUserService,
  createUserService,
} from "../services/userServices.js";
import { AuthenticationError, BadRequestError } from "../utils/customErrors.ts";
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

    if (!email?.trim() || !password?.trim() || !username?.trim()) {
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
    if (error instanceof BadRequestError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    const errorMessage = error instanceof Error ? error.message : String(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: errorMessage });
  }
};

// PUT /users/profile
export const updateProfile = async (
  req: Request<EmptyObject, unknown, UserUpdatePayload, UserQuery>,
  res: Response,
): Promise<void> => {
  try {
    // get id from token verified in protect middleware
    const authenticatedUser = req.user as jwt.JwtPayload;
    const id = authenticatedUser?.userId;

    const updateData = req.body;
    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(user);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res
      .status(500)
      .json({ message: "Updating profile error", error: errorMessage });
  }
};

// DELETE /users/profile
export const deleteProfile = async (
  req: Request<EmptyObject, unknown, EmptyObject, UserQuery>,
  res: Response,
): Promise<void> => {
  try {
    // get id from token verified in protect middleware
    const authenticatedUser = req.user as jwt.JwtPayload;
    const id = authenticatedUser?.userId;

    await User.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: "Your account has been successfully deleted." });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res
      .status(500)
      .json({ message: "Deleting profile error", error: errorMessage });
  }
};

// POST /users/login
export const loginUser = async (
  req: Request<EmptyObject, unknown, LoginPayload, UserQuery>,
  res: Response,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
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
  } catch (error: unknown) {
    if (error instanceof AuthenticationError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }

    const errorMessage = error instanceof Error ? error.message : String(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: errorMessage });
  }
};
