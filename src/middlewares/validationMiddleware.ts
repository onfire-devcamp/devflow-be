import type { NextFunction, Request, Response } from "express";
import type { ZodIssue, ZodSchema } from "zod";

const formatZodError = (issues: ZodIssue[]): string =>
  issues
    .map((issue) => `${issue.path.join(".") || "body"}: ${issue.message}`)
    .join("; ");

export const validateBody = <T>(schema: ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: `Invalid request body: ${formatZodError(result.error.issues)}`,
      });
      return;
    }

    req.body = result.data as Request["body"];
    next();
  };
};
