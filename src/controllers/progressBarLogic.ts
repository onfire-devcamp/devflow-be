import { Request, Response } from "express";
import User from "../models/userModel.js";

export const getUserSkills = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "Cannot find user" });
      return; // Ensure we don't continue after sending response
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
