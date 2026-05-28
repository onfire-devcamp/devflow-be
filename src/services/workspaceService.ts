import mongoose from "mongoose";

import FileTemplate from "../models/fileTemplateModel.js";
import Module from "../models/moduleModel.js";
import Task from "../models/taskModel.js";
import UserFile from "../models/userFileModel.js";
import { BadRequestError } from "../utils/customErrors.ts";
import type { FileTemplateView } from "../types/projectTypes.js";
import type {
  InitializeWorkspaceView,
  SaveUserFileInput,
  UserWorkspaceFileView,
} from "../types/workspaceTypes.js";

const isValidObjectId = (id: string) => mongoose.isValidObjectId(id);

const toIdString = (value: mongoose.Types.ObjectId | string): string =>
  value.toString();

const toFileTemplateView = (fileTemplate: {
  _id: mongoose.Types.ObjectId | string;
  projectId: mongoose.Types.ObjectId | string;
  path: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}): FileTemplateView => ({
  _id: toIdString(fileTemplate._id),
  projectId: toIdString(fileTemplate.projectId),
  path: fileTemplate.path,
  content: fileTemplate.content,
  createdAt: fileTemplate.createdAt,
  updatedAt: fileTemplate.updatedAt,
});

const toUserWorkspaceFileView = (userFile: {
  _id: mongoose.Types.ObjectId | string;
  userId: mongoose.Types.ObjectId | string;
  projectId: mongoose.Types.ObjectId | string;
  fileId: {
    _id: mongoose.Types.ObjectId | string;
    projectId: mongoose.Types.ObjectId | string;
    path: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
  };
  content: string;
  createdAt: Date;
  updatedAt: Date;
}): UserWorkspaceFileView => ({
  _id: toIdString(userFile._id),
  userId: toIdString(userFile.userId),
  projectId: toIdString(userFile.projectId),
  fileId: toFileTemplateView(userFile.fileId),
  content: userFile.content,
  createdAt: userFile.createdAt,
  updatedAt: userFile.updatedAt,
});

export const initializeWorkspace = async (
  userId: string,
  projectId: string,
  taskId: string,
): Promise<InitializeWorkspaceView> => {
  if (![userId, projectId, taskId].every(isValidObjectId)) {
    throw new BadRequestError("Invalid workspace identifiers.");
  }

  const task = await Task.findById(taskId).lean();
  if (!task) {
    throw new BadRequestError("Task not found.");
  }

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
    fileId: { $in: fileTemplates.map((fileTemplate) => fileTemplate._id) },
  }).lean();

  const existingFileIdSet = new Set(
    existingUserFiles.map((file) => toIdString(file.fileId)),
  );
  const newUserFiles = fileTemplates
    .filter(
      (fileTemplate) => !existingFileIdSet.has(toIdString(fileTemplate._id)),
    )
    .map((fileTemplate) => ({
      userId,
      projectId,
      fileId: fileTemplate._id,
      content: fileTemplate.content,
    }));

  if (newUserFiles.length > 0) {
    await UserFile.insertMany(newUserFiles);
  }

  const workspaceFiles = await UserFile.find({
    userId,
    projectId,
    fileId: { $in: fileTemplates.map((fileTemplate) => fileTemplate._id) },
  })
    .sort({ createdAt: 1 })
    .populate({ path: "fileId" })
    .lean();

  return {
    createdCount: newUserFiles.length,
    files: workspaceFiles.map((userFile) =>
      toUserWorkspaceFileView({
        ...userFile,
        fileId: userFile.fileId as {
          _id: mongoose.Types.ObjectId | string;
          projectId: mongoose.Types.ObjectId | string;
          path: string;
          content: string;
          createdAt: Date;
          updatedAt: Date;
        },
      }),
    ),
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
      $set: {
        content: newContent,
        userId,
        projectId,
        fileId,
      },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  )
    .populate({ path: "fileId" })
    .lean();

  if (!updatedUserFile) {
    throw new BadRequestError("Unable to save the workspace file.");
  }

  return toUserWorkspaceFileView({
    ...updatedUserFile,
    fileId: updatedUserFile.fileId as {
      _id: mongoose.Types.ObjectId | string;
      projectId: mongoose.Types.ObjectId | string;
      path: string;
      content: string;
      createdAt: Date;
      updatedAt: Date;
    },
  });
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
    .populate({ path: "fileId" })
    .lean();

  return workspaceFiles.map((userFile) =>
    toUserWorkspaceFileView({
      ...userFile,
      fileId: userFile.fileId as {
        _id: mongoose.Types.ObjectId | string;
        projectId: mongoose.Types.ObjectId | string;
        path: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
      },
    }),
  );
};
