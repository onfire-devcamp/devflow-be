import crypto from "crypto";
import User from "../models/userModel.js";
import RefreshToken from "../models/refreshTokenModel.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  verifyRefreshToken,
} from "../utils/tokenUtils.js";
import { AuthenticationError } from "../utils/customErrors.js";
import type { Types } from "mongoose";

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult extends TokenPair {
  user: {
    id: Types.ObjectId;
    username: string;
    email: string;
    avatarUrl?: string;
    bio?: string;
    workplace?: string;
    socialLinks?: Array<{ platform: string; url: string }>;
  };
}

export const generateTokenPair = async (
  userId: Types.ObjectId | string,
  email: string,
  family?: string,
): Promise<TokenPair> => {
  const tokenFamily = family ?? crypto.randomUUID();

  const accessToken = generateAccessToken(userId, email);
  const refreshToken = generateRefreshToken(userId, tokenFamily);

  await RefreshToken.create({
    tokenHash: hashToken(refreshToken),
    userId,
    family: tokenFamily,
    isRevoked: false,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
  });

  return { accessToken, refreshToken };
};

export const rotateRefreshToken = async (
  rawToken: string,
): Promise<AuthResult> => {
  // 1. Verify JWT signature and expiry first (cheap, no DB hit)
  let payload: { userId: string; family: string };
  try {
    payload = verifyRefreshToken(rawToken);
  } catch {
    throw new AuthenticationError("Invalid or expired refresh token.");
  }

  const { userId, family } = payload;
  const tokenHash = hashToken(rawToken);

  // 2. Look up the hashed token in the DB
  const storedToken = await RefreshToken.findOne({ tokenHash });

  // 3. Token not in DB but family exists = reuse attack — revoke the whole family
  if (!storedToken) {
    const familyExists = await RefreshToken.exists({ family, userId });
    if (familyExists) {
      await RefreshToken.updateMany({ family, userId }, { isRevoked: true });
    }
    throw new AuthenticationError(
      "Refresh token reuse detected. Please log in again.",
    );
  }

  // 4. Token explicitly revoked (e.g. from a prior logout or reuse detection)
  if (storedToken.isRevoked) {
    await RefreshToken.updateMany({ family, userId }, { isRevoked: true });
    throw new AuthenticationError(
      "Refresh token has been revoked. Please log in again.",
    );
  }

  // 5. Invalidate the consumed token (rotation: one token, one use)
  await RefreshToken.findByIdAndUpdate(storedToken._id, { isRevoked: true });

  // 6. Fetch user to include in response
  const user = await User.findById(userId).select(
    "email username avatarUrl bio workplace socialLinks",
  );
  if (!user) throw new AuthenticationError("User account no longer exists.");

  // 7. Issue a fresh pair in the same family
  const { accessToken, refreshToken } = await generateTokenPair(
    userId,
    user.email,
    family,
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id as Types.ObjectId,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      workplace: user.workplace,
      socialLinks: user.socialLinks,
    },
  };
};

// Revoke the single token that matches rawToken (used by logout).
// Passing no token revokes every token owned by the user (force-logout all devices).
export const revokeRefreshToken = async (
  userId: string,
  rawToken?: string,
): Promise<void> => {
  if (rawToken) {
    await RefreshToken.findOneAndUpdate(
      { tokenHash: hashToken(rawToken) },
      { isRevoked: true },
    );
  } else {
    await RefreshToken.updateMany({ userId }, { isRevoked: true });
  }
};
