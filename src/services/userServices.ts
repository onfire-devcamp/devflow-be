import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import { LoginPayload, RegisterPayload } from "../types/userTypes.js";
import { env } from "../config/environment.js";
import { AuthenticationError, BadRequestError } from "../utils/customErrors.js";
import { generateTokenPair } from "./authService.js";
import type { AuthResult } from "./authService.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmailFormat = (email: string): void => {
  if (!EMAIL_RE.test(email)) throw new BadRequestError("Invalid email format.");
};

export const createUserService = async (
  input: RegisterPayload,
): Promise<AuthResult> => {
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

    const { accessToken, refreshToken } = await generateTokenPair(
      user._id,
      user.email,
    );

    return {
      accessToken,
      refreshToken,
      user: { id: user._id, username: user.username, email: user.email },
    };
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: number }).code === 11000
    ) {
      throw new BadRequestError("Email is already in use.");
    }
    throw error;
  }
};

export const loginUserService = async (
  input: LoginPayload,
): Promise<AuthResult> => {
  const { email, password } = input;

  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user) throw new AuthenticationError("Invalid email or password!");

  if (!user.passwordHash) {
    throw new AuthenticationError(
      "This account uses Google Sign-In. Please continue with Google.",
    );
  }

  const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordMatch)
    throw new AuthenticationError("Invalid email or password!");

  const { accessToken, refreshToken } = await generateTokenPair(
    user._id,
    user.email,
  );

  return {
    accessToken,
    refreshToken,
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

export const googleAuthService = async (
  googleAccessToken: string,
): Promise<AuthResult> => {
  const googleRes = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    { headers: { Authorization: `Bearer ${googleAccessToken}` } },
  );

  if (!googleRes.ok) throw new AuthenticationError("Invalid Google token.");

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

  const { accessToken, refreshToken } = await generateTokenPair(
    user._id,
    user.email,
  );

  return {
    accessToken,
    refreshToken,
    user: { id: user._id, username: user.username, email: user.email },
  };
};
