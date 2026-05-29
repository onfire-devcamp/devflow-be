import mongoose from "mongoose";
import FileTemplate from "../models/fileTemplateModel.js";
import Module from "../models/moduleModel.js";
import Task from "../models/taskModel.js";
import UserFile from "../models/userFileModel.js";
import { BadRequestError, NotFoundError } from "../utils/customErrors.js";
import {
  isValidObjectId,
  toIdString,
  toUserWorkspaceFileView,
} from "../utils/mappers.js";
import type {
  InitializeWorkspaceView,
  SaveUserFileInput,
  UserWorkspaceFileView,
} from "../types/workspaceTypes.js";

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

  const workspaceFiles = await UserFile.find({
    userId,
    projectId,
    fileId: { $in: fileTemplates.map((ft) => ft._id) },
  })
    .sort({ createdAt: 1 })
    .populate("fileId")
    .lean();

  return {
    createdCount: newUserFiles.length,
    files: workspaceFiles.map(toUserWorkspaceFileView),
  };
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
