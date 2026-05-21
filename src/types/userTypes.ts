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