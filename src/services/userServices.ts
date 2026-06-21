import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import {
  LoginPayload,
  RegisterPayload,
  PopulatedProject,
} from "../types/userTypes.js";
import { env } from "../config/environment.js";
import { AuthenticationError, BadRequestError } from "../utils/customErrors.js";
import { generateTokenPair } from "./authService.js";
import type { AuthResult } from "./authService.js";
import UserProgress from "../models/userProgressModel.ts";
import Module from "../models/moduleModel.ts";
import Task from "../models/taskModel.ts";
import {
  calculateCompletedDays,
  getWeekDaysData,
  generateStreakMessage,
} from "../utils/streakUtils.ts";
import { WeekDayData, UserProgressResponse } from "../types/userTypes.js";
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
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        workplace: user.workplace,
        socialLinks: user.socialLinks,
        totalXp: user.totalXp,
      },
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

  const user = await User.findOne({ email }).select(
    "+passwordHash avatarUrl bio workplace socialLinks username email totalXp",
  );
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
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      workplace: user.workplace,
      socialLinks: user.socialLinks,
      totalXp: user.totalXp,
    },
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
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      workplace: user.workplace,
      socialLinks: user.socialLinks,
      totalXp: user.totalXp,
    },
  };
};

export const getUserProgressService = async (
  userId: string,
): Promise<UserProgressResponse> => {
  const userProgress = await UserProgress.findOne({ userId })
    .sort({ updatedAt: -1 })
    .populate<{ projectId: PopulatedProject | null }>({
      path: "projectId",
      select: "title slug",
    })
    .populate({
      path: "lastActiveTaskId",
      populate: {
        path: "moduleId",
        select: "title description",
      },
    });
  if (!userProgress) {
    throw new BadRequestError("No progress found");
  }
  const project = userProgress.projectId;
  const rawProjectId = project ? project._id : null;
  const modules = await Module.find({ projectId: rawProjectId }).select("_id");
  const moduleIds = modules.map((m) => m._id);

  const allTasks = await Task.find({ moduleId: { $in: moduleIds } });
  const totalTasksOfProject = allTasks.length;

  const completedTasks = userProgress.completedTaskIds.length;
  const progressPercent =
    totalTasksOfProject > 0
      ? Math.round((completedTasks / totalTasksOfProject) * 100)
      : 0;

  const currentModuleId =
    userProgress.unlockedModuleIds?.[userProgress.unlockedModuleIds.length - 1];

  const currentModuleData = currentModuleId
    ? await Module.findById(currentModuleId).select("title description")
    : null;
  return {
    id: userProgress._id.toString(),
    projectId: project?._id.toString() || "",
    slug: project?.slug || "",
    title: project?.title || "No project",
    moduleName: currentModuleData?.title || "N/A",
    moduleHint: currentModuleData?.description || "",
    progressPercent,
  };
};
export const getUserStreakService = async (
  userId: string,
): Promise<{
  weekDays: WeekDayData[];
  completedDays: number;
  totalDays: 7;
  message: string;
  currentStreak: number;
}> => {
  const weekDays = await getWeekDaysData(userId.toString());
  const completedDays = calculateCompletedDays(weekDays);
  const message = generateStreakMessage(completedDays);

  const user = await User.findById(userId).select("currentStreak").lean();

  return {
    weekDays: weekDays,
    completedDays: completedDays,
    totalDays: 7,
    message: message,
    currentStreak: user?.currentStreak || 0,
  };
};
