import type { Response } from "express";

export const handleControllerError = (res: Response, error: unknown): void => {
  const message = error instanceof Error ? error.message : "Unexpected error";
  const statusCode =
    typeof error === "object" && error !== null && "statusCode" in error
      ? Number((error as Record<string, unknown>).statusCode)
      : 500;

  res.status(statusCode).json({ success: false, message });
};
