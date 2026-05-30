import type { Request, Response } from "express";
import {
  rotateRefreshToken,
  revokeRefreshToken,
} from "../services/authService.js";
import {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
  REFRESH_TOKEN_COOKIE,
} from "../utils/cookieUtils.js";
import { AuthenticationError } from "../utils/customErrors.js";

const serverError = (res: Response, context: string, error: unknown): void => {
  console.error(`[${context}]`, error);
  res.status(500).json({ message: "Internal server error" });
};

// POST /api/auth/refresh
// Browser sends the HttpOnly refresh token cookie automatically.
// Returns a new access token + rotated refresh token cookie.
export const refreshTokens = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const rawRefreshToken = req.cookies[REFRESH_TOKEN_COOKIE] as
    | string
    | undefined;

  if (!rawRefreshToken) {
    res.status(401).json({ message: "No refresh token provided." });
    return;
  }

  try {
    const { accessToken, refreshToken, user } =
      await rotateRefreshToken(rawRefreshToken);

    setRefreshTokenCookie(res, refreshToken);
    res.status(200).json({ accessToken, user });
  } catch (error) {
    clearRefreshTokenCookie(res);
    if (error instanceof AuthenticationError) {
      res.status(401).json({ message: error.message });
      return;
    }
    serverError(res, "refreshTokens", error);
  }
};

// POST /api/auth/logout
// Revokes the refresh token in the DB and clears the cookie.
export const logout = async (req: Request, res: Response): Promise<void> => {
  const rawRefreshToken = req.cookies[REFRESH_TOKEN_COOKIE] as
    | string
    | undefined;

  try {
    if (rawRefreshToken) {
      // Best-effort — don't fail the logout if the token was already gone
      await revokeRefreshToken("", rawRefreshToken);
    }
  } catch (error) {
    console.error("[logout] Failed to revoke token:", error);
  } finally {
    clearRefreshTokenCookie(res);
    res.status(200).json({ message: "Logged out successfully." });
  }
};
