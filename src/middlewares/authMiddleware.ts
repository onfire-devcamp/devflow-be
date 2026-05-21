// src/middlewares/authMiddleware.ts
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: string | jwt.JwtPayload;
    }
  }
}

export const protect = (
  req: Request<any, any, any, any>,
  res: Response,
  next: NextFunction,
): void => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const secretKey = process.env.JWT_SECRET || "fallback_secret_key";
      const decoded = jwt.verify(token, secretKey);

      req.user = decoded;
      next();
    } catch (error) {
      res
        .status(401)
        .json({ message: "No access, invalid token, or expired token!" });
      return;
    }
  }

  if (!token) {
    res.status(401).json({ message: "No access, not found token!" });
    return;
  }
};
