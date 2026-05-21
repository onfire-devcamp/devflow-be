import type { ParsedQs } from "qs";

export interface UserSkillsPayload {
  frontend?: number;
  backend?: number;
  database?: number;
  devops?: number;
}

export interface UserCreatePayload {
  email: string;
  passwordHash: string;
  username: string;
  avatarUrl?: string;
  skills?: UserSkillsPayload;
}

export interface UserUpdatePayload {
  email?: string;
  passwordHash?: string;
  username?: string;
  lastLogin?: Date;
  avatarUrl?: string;
  currentStreak?: number;
  highestStreak?: number;
  skills?: UserSkillsPayload;
}

export interface UserIdParams {
  id: string;
}

export interface UserQuery extends ParsedQs {}

export type EmptyObject = Record<string, never>;
