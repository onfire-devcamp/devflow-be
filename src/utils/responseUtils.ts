import type { Response } from "express";

export class SuccessResponse<T> {
  constructor(
    public res: Response,
    public data: T,
    public statusCode: number = 200,
  ) {
    this.send();
  }

  private send(): void {
    this.res.status(this.statusCode).json({
      success: true,
      data: this.data,
    });
  }
}

export const handleControllerError = (res: Response, error: unknown): void => {
  const message = error instanceof Error ? error.message : "Unexpected error";
  const statusCode =
    typeof error === "object" && error !== null && "statusCode" in error
      ? Number((error as Record<string, unknown>).statusCode)
      : 500;

  res.status(statusCode).json({ success: false, message });
};
