import rateLimit from "express-rate-limit";
import { rateLimitStore } from "../config/rateLimitStore.js";
import type { Request } from "express";

// Ensure global type augmentation is loaded
import "./authMiddleware.js";

export const globalLimiter = rateLimit({
  store: rateLimitStore,
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

export const authLimiter = rateLimit({
  store: rateLimitStore,
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Try again in 15 minutes.",
  },
});

export const aiRateLimiter = rateLimit({
  store: rateLimitStore,
  windowMs: 60 * 60 * 1000,
  max: 50,
  keyGenerator: (req: Request) => {
    if (req.user && req.user.userId) {
      return req.user.userId.toString();
    }
    return req.ip || "unknown";
  },
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "AI hourly quota exceeded. Try again later.",
  },
});

export const autoSaveLimiter = rateLimit({
  store: rateLimitStore,
  windowMs: 10 * 1000,
  max: 15,
  keyGenerator: (req: Request) => {
    if (req.user && req.user.userId) {
      return req.user.userId.toString();
    }
    return req.ip || "unknown";
  },
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Saving too rapidly. Please wait.",
  },
});

export const heavyExportLimiter = rateLimit({
  store: rateLimitStore,
  windowMs: 5 * 60 * 1000,
  max: 5,
  keyGenerator: (req: Request) => {
    if (req.user && req.user.userId) {
      return req.user.userId.toString();
    }
    return req.ip || "unknown";
  },
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "You are requesting exports too frequently. Please wait a few minutes.",
  },
});
