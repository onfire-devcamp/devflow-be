import { createActivity, getRecentActivitiesByUser, } from "../services/activityService.js";
export const getUserRecentActivities = async (req, res) => {
    const { userId } = req.params;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    if (!userId) {
        res.status(400).json({ message: "userId is required" });
        return;
    }
    if (limit !== undefined && (Number.isNaN(limit) || limit <= 0)) {
        res.status(400).json({ message: "limit must be a positive number" });
        return;
    }
    try {
        const activities = await getRecentActivitiesByUser(userId, { limit });
        res.status(200).json(activities);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res
            .status(500)
            .json({ message: "Failed to fetch activities", error: errorMessage });
    }
};
export const createUserActivity = async (req, res) => {
    const { userId, projectId, taskId, type, moduleName, activityTitle } = req.body;
    if (!userId || !projectId || !type || !moduleName || !activityTitle) {
        res.status(400).json({ message: "Missing required fields" });
        return;
    }
    const allowedTypes = ["PROJECT_START", "TASK_SUBMIT_FAIL", "TASK_PASS"];
    if (!allowedTypes.includes(type)) {
        res.status(400).json({ message: "Invalid activity type" });
        return;
    }
    try {
        const activity = await createActivity({
            userId,
            projectId,
            taskId,
            type,
            moduleName,
            activityTitle,
        });
        res.status(201).json(activity);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res
            .status(500)
            .json({ message: "Failed to create activity", error: errorMessage });
    }
};
