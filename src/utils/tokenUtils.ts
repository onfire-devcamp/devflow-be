import crypto from "crypto";
import jwt from "jsonwebtoken";
import { env } from "../config/environment.js";
import type { Types } from "mongoose";

export interface AccessTokenPayload {
  userId: string;
  email: string;
}

export interface RefreshTokenPayload {
  userId: string;
  family: string;
}

export const generateAccessToken = (
  userId: Types.ObjectId | string,
  email: string,
): string =>
  jwt.sign({ userId: userId.toString(), email }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });

export const generateRefreshToken = (
  userId: Types.ObjectId | string,
  family: string,
): string =>
  jwt.sign(
    { userId: userId.toString(), family, jti: crypto.randomUUID() },
    env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: env.REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    },
  );

// SHA-256 is correct here: refresh tokens are already high-entropy (JWT signed),
// so the slow cost of bcrypt buys nothing. SHA-256 is fast, deterministic, and
// lets us index the hash column for O(1) lookup.
export const hashToken = (token: string): string =>
  crypto.createHash("sha256").update(token).digest("hex");

export const verifyAccessToken = (token: string): AccessTokenPayload =>
  jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;

export const verifyRefreshToken = (token: string): RefreshTokenPayload =>
  jwt.verify(token, env.REFRESH_TOKEN_SECRET) as RefreshTokenPayload;
