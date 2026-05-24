import cron from "node-cron";
import Activity from "../models/activityModel.ts";
import User from "../models/userModel.ts";

const getStartOfDayUtc = (date: Date) =>
  new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );

const addDaysUtc = (date: Date, days: number) =>
  new Date(date.getTime() + days * 24 * 60 * 60 * 1000);

const updateDailyStreaks = async () => {
  const todayStart = getStartOfDayUtc(new Date());
  const tomorrowStart = addDaysUtc(todayStart, 1);
  const yesterdayStart = addDaysUtc(todayStart, -1);

  const activeUsers = await Activity.aggregate<{
    _id: string;
    lastActivity: Date;
  }>([
    {
      $match: {
        type: "TASK_PASS",
        createdAt: { $gte: todayStart, $lt: tomorrowStart },
      },
    },
    {
      $group: {
        _id: "$userId",
        lastActivity: { $max: "$createdAt" },
      },
    },
  ]);

  for (const userActivity of activeUsers) {
    const user = await User.findById(userActivity._id).select(
      "currentStreak highestStreak lastStreakDate",
    );

    if (!user) {
      continue;
    }

    const lastStreakDate = user.lastStreakDate
      ? getStartOfDayUtc(user.lastStreakDate)
      : null;

    if (lastStreakDate && lastStreakDate.getTime() === todayStart.getTime()) {
      continue;
    }

    const shouldIncrement =
      lastStreakDate && lastStreakDate.getTime() === yesterdayStart.getTime();
    const nextStreak = shouldIncrement ? user.currentStreak + 1 : 1;

    user.currentStreak = nextStreak;
    user.highestStreak = Math.max(user.highestStreak, nextStreak);
    user.lastStreakDate = todayStart;
    await user.save();
  }

  await User.updateMany(
    {
      lastStreakDate: { $lt: yesterdayStart },
      currentStreak: { $gt: 0 },
    },
    { $set: { currentStreak: 0 } },
  );
};

export const startStreakCron = () => {
  cron.schedule("5 0 * * *", () => {
    updateDailyStreaks().catch((error: unknown) => {
      console.error("Failed to update streaks:", error);
    });
  });
};
