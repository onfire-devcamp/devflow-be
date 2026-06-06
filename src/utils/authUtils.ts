import type { Request } from "express";
import jwt from "jsonwebtoken";
import { BadRequestError } from "./customErrors.ts";

export const getAuthenticatedUserId = (req: Pick<Request, "user">): string => {
  const authenticatedUser = req.user as jwt.JwtPayload;
  const userId = authenticatedUser?.userId;

  if (!userId || typeof userId !== "string") {
    throw new BadRequestError("Invalid authenticated user context.");
  }

  return userId;
};
