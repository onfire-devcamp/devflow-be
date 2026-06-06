import type { Request, Response, NextFunction } from "express";
import {
  verifyAccessToken,
  type AccessTokenPayload,
} from "../utils/tokenUtils.js";

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}

export const protect = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Access denied. No token provided." });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    res
      .status(401)
      .json({ message: "Access denied. Token is invalid or expired." });
  }
};
