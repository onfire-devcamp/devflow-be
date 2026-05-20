import type { ParsedQs } from "qs";

export interface UserPayload {
  name: string;
  email: string;
}

export interface UserIdParams {
  id: string;
}

export interface UserQuery extends ParsedQs {}

export type EmptyObject = Record<string, never>;
