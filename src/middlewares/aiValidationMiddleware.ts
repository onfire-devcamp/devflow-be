import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { z } from "zod";

const objectIdSchema = z.string().trim().min(1, "Must be a non-empty string");

export const chatBodySchema = z.object({
  projectId: objectIdSchema,
  taskId: objectIdSchema,
  message: z.string().trim().min(1, "message is required"),
});

export const hintBodySchema = z.object({
  projectId: objectIdSchema,
  taskId: objectIdSchema,
  fileId: objectIdSchema,
  type: z.enum(["hint", "explain"]),
  selectedCode: z.string().trim().min(1, "selectedCode is required"),
  userQuestion: z.string().trim().optional(),
});

export const evaluationBodySchema = z.object({
  projectId: objectIdSchema,
  taskId: objectIdSchema,
});

const formatZodError = (error: z.ZodError): string =>
  error.issues
    .map((issue) => `${issue.path.join(".") || "body"}: ${issue.message}`)
    .join("; ");

export const validateBody = <T>(schema: ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: `Invalid request body: ${formatZodError(result.error)}`,
      });
      return;
    }

    req.body = result.data as Request["body"];
    next();
  };
};
