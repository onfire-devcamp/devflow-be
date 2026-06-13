import type { Request, Response } from "express";
import User from "../models/userModel.js";
import type { AccessTokenPayload } from "../utils/tokenUtils.js";
import { getUserProgressService } from "../services/userServices.js";
import { getUserStreakService } from "../services/userServices.js";
import type {
  EmptyObject,
  RegisterPayload,
  UserQuery,
  UserUpdatePayload,
  LoginPayload,
  GoogleAuthPayload,
} from "../types/userTypes.js";
import {
  loginUserService,
  createUserService,
  googleAuthService,
} from "../services/userServices.js";
import { AuthenticationError, BadRequestError } from "../utils/customErrors.js";
import { setRefreshTokenCookie } from "../utils/cookieUtils.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const serverError = (res: Response, context: string, error: unknown): void => {
  console.error(`[${context}]`, error);
  res.status(500).json({ message: "Internal server error" });
};

// GET /users
export const getUser = async (
  _req: Request<EmptyObject, unknown, EmptyObject, UserQuery>,
  res: Response,
): Promise<void> => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    serverError(res, "getUser", error);
  }
};

// POST /users — Register
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

    if (!EMAIL_RE.test(email)) {
      res.status(400).json({ message: "Invalid email format." });
      return;
    }

    const { accessToken, refreshToken, user } = await createUserService({
      email,
      password,
      username,
      avatarUrl,
      skills,
    });

    setRefreshTokenCookie(res, refreshToken);
    res
      .status(201)
      .json({ message: "Account created!", token: accessToken, user });
  } catch (error) {
    if (error instanceof BadRequestError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    serverError(res, "createUser", error);
  }
};

// PUT /users/profile
export const updateProfile = async (
  req: Request<EmptyObject, unknown, UserUpdatePayload, UserQuery>,
  res: Response,
): Promise<void> => {
  try {
    const { userId } = req.user as AccessTokenPayload;
    const user = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json(user);
  } catch (error) {
    serverError(res, "updateProfile", error);
  }
};

// DELETE /users/profile
export const deleteProfile = async (
  req: Request<EmptyObject, unknown, EmptyObject, UserQuery>,
  res: Response,
): Promise<void> => {
  try {
    const { userId } = req.user as AccessTokenPayload;
    await User.findByIdAndDelete(userId);
    res
      .status(200)
      .json({ message: "Your account has been successfully deleted." });
  } catch (error) {
    serverError(res, "deleteProfile", error);
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

    const { accessToken, refreshToken, user } = await loginUserService({
      email,
      password,
    });

    setRefreshTokenCookie(res, refreshToken);
    res
      .status(200)
      .json({ message: "Login successful!", token: accessToken, user });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    serverError(res, "loginUser", error);
  }
};

// POST /users/google-auth
export const googleAuth = async (
  req: Request<EmptyObject, unknown, GoogleAuthPayload, UserQuery>,
  res: Response,
): Promise<void> => {
  try {
    const { accessToken: googleAccessToken } = req.body;

    if (!googleAccessToken?.trim()) {
      res.status(400).json({ message: "Access token is required." });
      return;
    }

    const { accessToken, refreshToken, user } =
      await googleAuthService(googleAccessToken);

    setRefreshTokenCookie(res, refreshToken);
    res.status(200).json({
      message: "Google authentication successful!",
      token: accessToken,
      user,
    });
  } catch (error) {
    if (
      error instanceof AuthenticationError ||
      error instanceof BadRequestError
    ) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    serverError(res, "googleAuth", error);
  }
};
//GET /user/progress
export const getUserProgress = async (
  req: Request<EmptyObject, unknown, EmptyObject, UserQuery>,
  res: Response,
): Promise<void> => {
  try {
    const { userId } = req.user as AccessTokenPayload;
    const progressData = await getUserProgressService(userId.toString());
    res.status(200).json(progressData);
  } catch (error) {
    if (error instanceof BadRequestError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    serverError(res, "getUserProgress", error);
  }
};
// GET /user/streak
export const getUserStreak = async (
  req: Request<EmptyObject, unknown, EmptyObject, UserQuery>,
  res: Response,
): Promise<void> => {
  try {
    const { userId } = req.user as AccessTokenPayload;
    const streakData = await getUserStreakService(userId.toString());
    res.status(200).json(streakData);
  } catch (error) {
    serverError(res, "getStreakData", error);
  }
};
