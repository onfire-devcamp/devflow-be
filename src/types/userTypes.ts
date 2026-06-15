import type { ParsedQs } from "qs";
export interface UserSkillsPayload {
  frontend?: number;
  backend?: number;
  database?: number;
  devops?: number;
}

export interface BaseUserPayload {
  email: string;
  username: string;
  avatarUrl?: string;
  skills?: UserSkillsPayload;
}

// Auth payloads
export interface RegisterPayload extends BaseUserPayload {
  password: string;
}

export type LoginPayload = Pick<RegisterPayload, "email" | "password">;

// Database & services payloads
export interface UserCreatePayload extends BaseUserPayload {
  passwordHash: string;
}

export type UserUpdatePayload = Partial<
  Omit<UserCreatePayload, "passwordHash">
>;

export interface UserIdParams {
  id: string;
}

export interface UserQuery extends ParsedQs {}

export type EmptyObject = Record<string, never>;

export interface GoogleAuthPayload {
  accessToken: string;
}

export interface WeekDayData {
  label: string;
  completed: boolean;
}
export interface LeanActivity {
  _id: string;
  createdAt: Date;
}

export interface UserProgressResponse {
  id: string;
  projectId: string;
  slug: string;
  title: string;
  moduleName: string;
  moduleHint: string;
  progressPercent: number;
}
export interface PopulatedProject {
  _id: string;
  title: string;
  slug: string;
}
