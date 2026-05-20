import type { Request, Response } from "express";
import User from "../models/userModels.ts";
import type {
  EmptyObject,
  UserIdParams,
  UserPayload,
  UserQuery,
} from "../types/userTypes.ts";

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

// POST /users
export const createUser = async (
  req: Request<EmptyObject, unknown, UserPayload, UserQuery>,
  res: Response,
): Promise<void> => {
  const { name, email } = req.body;
  try {
    const user = await User.create({ name, email });
    res.status(201).json(user);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Creating error", error: errorMessage });
  }
};

// Update user by ID
export const updateUser = async (
  req: Request<UserIdParams, unknown, UserPayload, UserQuery>,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true },
    );
    res.status(200).json(user);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Updating error", error: errorMessage });
  }
};

export const deleteUser = async (
  req: Request<UserIdParams, unknown, EmptyObject, UserQuery>,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  console.log("ID deleted: ", id);
  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "Deleted" });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Deleting error", error: errorMessage });
  }
};
