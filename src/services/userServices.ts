// src/services/userServices.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { LoginPayload, RegisterPayload } from "../types/userTypes.js";
import { env } from "../config/environment.js";
import { AuthenticationError, BadRequestError } from "../utils/customErrors.ts";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signToken = (userId: unknown, email: string) =>
  jwt.sign({ userId, email }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });

const validateEmailFormat = (email: string) => {
  if (!EMAIL_RE.test(email)) {
    throw new BadRequestError("Invalid email format.");
  }
};

export const createUserService = async (input: RegisterPayload) => {
  const { email, password, username, avatarUrl, skills } = input;

  validateEmailFormat(email);

  const passwordHash = await bcrypt.hash(password, env.SALT_ROUNDS);
  try {
    const user = await User.create({
      email,
      passwordHash,
      username,
      avatarUrl,
      skills,
      provider: "local",
    });
    const token = signToken(user._id, user.email);
    return {
      token,
      user: { id: user._id, username: user.username, email: user.email },
    };
  } catch (error: any) {
    if (error.code === 11000) {
      throw new BadRequestError("Email is already in use.");
    }
    throw error;
  }
};

export const loginUserService = async (input: LoginPayload) => {
  const { email, password } = input;
  const user = await User.findOne({ email }).select("+passwordHash");

  if (!user) {
    throw new AuthenticationError("Invalid email or password!");
  }

  if (!user.passwordHash) {
    throw new AuthenticationError(
      "This account uses Google Sign-In. Please continue with Google.",
    );
  }

  const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordMatch) {
    throw new AuthenticationError("Invalid email or password!");
  }

  const token = signToken(user._id, user.email);
  return {
    token,
    user: { id: user._id, username: user.username, email: user.email },
  };
};

interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture?: string;
  verified_email?: boolean;
}

export const googleAuthService = async (accessToken: string) => {
  const googleRes = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  if (!googleRes.ok) {
    throw new AuthenticationError("Invalid Google token.");
  }

  const googleUser = (await googleRes.json()) as GoogleUserInfo;

  if (!googleUser.email) {
    throw new AuthenticationError("Could not retrieve email from Google.");
  }

  if (googleUser.verified_email === false) {
    throw new AuthenticationError("Google account email is not verified.");
  }

  let user = await User.findOne({ email: googleUser.email });

  if (user) {
    if (user.provider !== "google") {
      throw new BadRequestError(
        "An account with this email already exists. Please sign in with your password.",
      );
    }
    user.lastLogin = new Date();
    await user.save();
  } else {
    user = await User.create({
      email: googleUser.email,
      username: googleUser.name,
      avatarUrl: googleUser.picture ?? "",
      provider: "google",
      providerId: googleUser.id,
    });
  }

  const token = signToken(user._id, user.email);
  return {
    token,
    user: { id: user._id, username: user.username, email: user.email },
  };
};
