import Activity from "../models/activityModel.ts";

export interface ActivityQueryOptions {
  limit?: number;
}

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export const getRecentActivitiesByUser = async (
  userId: string,
  options: ActivityQueryOptions = {},
) => {
  const limit = Math.min(
    Math.max(options.limit ?? DEFAULT_LIMIT, 1),
    MAX_LIMIT,
  );

  return Activity.find({ userId }).sort({ createdAt: -1 }).limit(limit).lean();
};

export interface CreateActivityInput {
  userId: string;
  projectId: string;
  taskId?: string;
  type: "PROJECT_START" | "TASK_SUBMIT_FAIL" | "TASK_PASS";
  moduleName: string;
  activityTitle: string;
}

export const createActivity = async (payload: CreateActivityInput) => {
  return Activity.create(payload);
};
