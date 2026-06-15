import Activity from "../models/activityModel.js";
import {
  WEEK_LABELS,
  STREAK_THRESHOLDS,
  STREAK_MESSAGES,
  STREAK_CONFIG,
} from "../constants/streak.ts";
import { WeekDayData, LeanActivity } from "../types/userTypes.ts";
import { Types } from "mongoose";

export const getWeekDaysData = async (
  userId: string,
): Promise<WeekDayData[]> => {
  const weekDays: WeekDayData[] = [];

  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  monday.setHours(STREAK_CONFIG.HOURS_START, 0, 0, 0);
  const nextMonday = new Date(monday);
  nextMonday.setDate(monday.getDate() + STREAK_CONFIG.DAYS_IN_WEEK);
  const activities = await Activity.find({
    userId,
    createdAt: { $gte: monday, $lt: nextMonday },
  })
    .select("createdAt")
    .lean<LeanActivity[]>();

  for (let i = 0; i < STREAK_CONFIG.DAYS_IN_WEEK; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);

    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);

    const isCompleted = activities.some(
      (act) => act.createdAt >= date && act.createdAt < nextDate,
    );

    weekDays.push({
      label: WEEK_LABELS[i],
      completed: isCompleted,
    });
  }

  return weekDays;
};

/**
 * Generate message from the streak
 */
export const generateStreakMessage = (streak: number): string => {
  if (streak >= STREAK_THRESHOLDS.AMAZING) {
    return STREAK_MESSAGES.AMAZING;
  }
  if (streak >= STREAK_THRESHOLDS.FIRE) {
    return STREAK_MESSAGES.FIRE;
  }
  if (streak >= STREAK_THRESHOLDS.MOMENTUM) {
    return STREAK_MESSAGES.MOMENTUM;
  }
  if (streak >= STREAK_THRESHOLDS.STARTED) {
    return STREAK_MESSAGES.STARTED;
  }
  return STREAK_MESSAGES.NOT_STARTED;
};

/**
 * Calculate completed days
 */
export const calculateCompletedDays = (weekDays: WeekDayData[]): number => {
  return weekDays.filter((day) => day.completed).length;
};
