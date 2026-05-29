import mongoose from "mongoose";
import FileTemplate from "../models/fileTemplateModel.js";
import Module from "../models/moduleModel.js";
import Task from "../models/taskModel.js";
import UserFile from "../models/userFileModel.js";
import UserProgress from "../models/userProgressModel.js";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../utils/customErrors.js";
import {
  isValidObjectId,
  toIdString,
  toUserProgressView,
  toUserWorkspaceFileView,
} from "../utils/mappers.js";
import type {
  InitializeWorkspaceView,
  SaveUserFileInput,
  UserProgressView,
  UserWorkspaceFileView,
} from "../types/workspaceTypes.js";

type ModuleSummary = {
  _id: mongoose.Types.ObjectId;
  order: number;
};

const ensureTaskModuleAccess = async (
  userId: string,
  projectId: string,
  requestedModuleId: mongoose.Types.ObjectId,
  orderedModules: ModuleSummary[],
  activeTaskId?: string,
): Promise<import("../models/userProgressModel.js").UserProgressDocument> => {
  const firstModule = orderedModules[0];
  if (!firstModule) {
    throw new NotFoundError("Project has no modules.");
  }

  const requestedModuleIdString = toIdString(requestedModuleId);
  const firstModuleIdString = toIdString(firstModule._id);

  const progress = await UserProgress.findOne({ userId, projectId });

  if (!progress) {
    if (requestedModuleIdString !== firstModuleIdString) {
      throw new ForbiddenError(
        "Complete the earlier modules before starting this task.",
      );
    }

    return UserProgress.create({
      userId,
      projectId,
      completedTaskIds: [],
      unlockedModuleIds: [firstModule._id],
      ...(activeTaskId
        ? { lastActiveTaskId: new mongoose.Types.ObjectId(activeTaskId) }
        : {}),
    });
  }

  const unlockedModuleIds = new Set(
    progress.unlockedModuleIds.map((moduleId) => toIdString(moduleId)),
  );

  if (unlockedModuleIds.has(requestedModuleIdString)) {
    if (activeTaskId) {
      progress.lastActiveTaskId = new mongoose.Types.ObjectId(activeTaskId);
      await progress.save();
    }

    return progress;
  }

  if (requestedModuleIdString === firstModuleIdString) {
    if (!unlockedModuleIds.has(firstModuleIdString)) {
      progress.unlockedModuleIds.push(firstModule._id);
    }
    if (activeTaskId) {
      progress.lastActiveTaskId = new mongoose.Types.ObjectId(activeTaskId);
    }
    await progress.save();
    return progress;
  }

  throw new ForbiddenError(
    "Complete the earlier modules before starting this task.",
  );
};

export const initializeWorkspace = async (
  userId: string,
  projectId: string,
  taskId: string,
): Promise<InitializeWorkspaceView> => {
  if (![userId, projectId, taskId].every(isValidObjectId)) {
    throw new BadRequestError("Invalid workspace identifiers.");
  }

  const task = await Task.findById(taskId).lean();
  if (!task) throw new NotFoundError("Task not found.");

  const moduleDoc = await Module.findById(task.moduleId)
    .select("projectId")
    .lean();
  if (!moduleDoc || toIdString(moduleDoc.projectId) !== projectId) {
    throw new BadRequestError("Task does not belong to the specified project.");
  }

  const orderedModules = (await Module.find({ projectId })
    .sort({ order: 1 })
    .select("_id order")
    .lean()) as ModuleSummary[];

  await ensureTaskModuleAccess(
    userId,
    projectId,
    task.moduleId,
    orderedModules,
    taskId,
  );

  const fileTemplates = await FileTemplate.find({
    _id: { $in: task.fileId },
    projectId,
  }).lean();

  const existingUserFiles = await UserFile.find({
    userId,
    projectId,
    fileId: { $in: fileTemplates.map((ft) => ft._id) },
  }).lean();

  const existingFileIdSet = new Set(
    existingUserFiles.map((file) => toIdString(file.fileId)),
  );

  const newUserFiles = fileTemplates
    .filter((ft) => !existingFileIdSet.has(toIdString(ft._id)))
    .map((ft) => ({
      userId,
      projectId,
      fileId: ft._id,
      content: ft.content,
    }));

  if (newUserFiles.length > 0) {
    const bulkOps = newUserFiles.map((file) => ({
      updateOne: {
        filter: {
          userId: file.userId,
          projectId: file.projectId,
          fileId: file.fileId,
        },
        update: { $setOnInsert: file },
        upsert: true,
      },
    })) as mongoose.mongo.AnyBulkWriteOperation[];
    await UserFile.bulkWrite(bulkOps);
  }

  const workspaceFiles = await UserFile.find({ userId, projectId })
    .sort({ createdAt: 1 })
    .populate("fileId")
    .lean();

  return {
    createdCount: newUserFiles.length,
    files: workspaceFiles.map(toUserWorkspaceFileView),
  };
};

export const completeTask = async (
  userId: string,
  projectId: string,
  taskId: string,
): Promise<UserProgressView> => {
  if (![userId, projectId, taskId].every(isValidObjectId)) {
    throw new BadRequestError("Invalid workspace identifiers.");
  }

  const task = await Task.findById(taskId).lean();
  if (!task) throw new NotFoundError("Task not found.");

  const moduleDoc = await Module.findById(task.moduleId)
    .select("projectId")
    .lean();
  if (!moduleDoc || toIdString(moduleDoc.projectId) !== projectId) {
    throw new BadRequestError("Task does not belong to the specified project.");
  }

  const orderedModules = (await Module.find({ projectId })
    .sort({ order: 1 })
    .select("_id order")
    .lean()) as ModuleSummary[];

  const progress = await ensureTaskModuleAccess(
    userId,
    projectId,
    task.moduleId,
    orderedModules,
  );

  const moduleTaskIds = await Task.find({ moduleId: task.moduleId })
    .select("_id")
    .lean();

  const completedTaskIdSet = new Set(
    progress.completedTaskIds.map((completedTaskId) =>
      toIdString(completedTaskId),
    ),
  );
  completedTaskIdSet.add(toIdString(task._id));

  const isModuleComplete = moduleTaskIds.every((moduleTask) =>
    completedTaskIdSet.has(toIdString(moduleTask._id)),
  );

  const currentModuleIndex = orderedModules.findIndex(
    (module) => toIdString(module._id) === toIdString(task.moduleId),
  );

  const nextModuleId =
    isModuleComplete && currentModuleIndex >= 0
      ? orderedModules[currentModuleIndex + 1]?._id
      : undefined;

  const update: {
    $addToSet: {
      completedTaskIds: mongoose.Types.ObjectId;
      unlockedModuleIds?: mongoose.Types.ObjectId;
    };
  } = {
    $addToSet: {
      completedTaskIds: task._id,
    },
  };

  if (nextModuleId) {
    update.$addToSet.unlockedModuleIds = nextModuleId;
  }

  const updatedProgress = await UserProgress.findOneAndUpdate(
    { userId, projectId },
    update,
    { new: true },
  );

  if (!updatedProgress) {
    throw new BadRequestError("Unable to update workspace progress.");
  }

  return toUserProgressView(updatedProgress);
};

export const saveUserFile = async ({
  userId,
  projectId,
  fileId,
  newContent,
}: SaveUserFileInput): Promise<UserWorkspaceFileView> => {
  if (![userId, projectId, fileId].every(isValidObjectId)) {
    throw new BadRequestError("Invalid workspace file identifiers.");
  }

  const updatedUserFile = await UserFile.findOneAndUpdate(
    { userId, projectId, fileId },
    {
      $set: { content: newContent },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  )
    .populate("fileId")
    .lean();

  if (!updatedUserFile) {
    throw new BadRequestError("Unable to save the workspace file.");
  }

  return toUserWorkspaceFileView(updatedUserFile);
};

export const getUserWorkspace = async (
  userId: string,
  projectId: string,
): Promise<UserWorkspaceFileView[]> => {
  if (![userId, projectId].every(isValidObjectId)) {
    throw new BadRequestError("Invalid workspace identifiers.");
  }

  const workspaceFiles = await UserFile.find({ userId, projectId })
    .sort({ createdAt: 1 })
    .populate("fileId")
    .lean();

  return workspaceFiles.map(toUserWorkspaceFileView);
};
