import { Request, Response } from "express";
import User from "../models/userModel.js";
import type { AuthenticatedRequest } from "../types/userTypes.js";

export const getUserSkills = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "Cannot find user" });
      return;
    }

    const processedSkills = [
      { name: "Frontend", value: user.skills.frontend || 0 },
      { name: "Backend", value: user.skills.backend || 0 },
      { name: "Database", value: user.skills.database || 0 },
      { name: "DevOps", value: user.skills.devops || 0 },
    ];

    res.status(200).json(processedSkills);
  } catch (error) {
    console.error("Error in getUserSkills:", error);
    res.status(500).json({ message: "Error in server" });
  }
};
