import Activity from "../models/activityModel.js";
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
export const getRecentActivitiesByUser = async (userId, options = {}) => {
    const limit = Math.min(Math.max(options.limit ?? DEFAULT_LIMIT, 1), MAX_LIMIT);
    return Activity.find({ userId }).sort({ createdAt: -1 }).limit(limit).lean();
};
export const createActivity = async (payload) => {
    return Activity.create(payload);
};
