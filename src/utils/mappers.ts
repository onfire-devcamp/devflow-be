import mongoose from "mongoose";
import type { FileTemplateDocument } from "../models/fileTemplateModel.js";
import type { TaskDocument } from "../models/taskModel.js";
import type { TaskFileDocument } from "../models/taskFileModel.js";
import type { UserFileDocument } from "../models/userFileModel.js";
import type { UserProgressDocument } from "../models/userProgressModel.js";
import type { ProjectDocument } from "../models/projectModel.js";
import type {
  FileTemplateView,
  TaskFileSolutionView,
  TaskView,
  ProjectSummaryView,
} from "../types/projectTypes.js";
import type {
  UserProgressView,
  UserWorkspaceFileView,
} from "../types/workspaceTypes.js";
import { DataIntegrityError } from "./customErrors.ts";

type TaskFileReference =
  | mongoose.Types.ObjectId
  | string
  | FileTemplateDocument;

type TaskWithFileReferences = Omit<TaskDocument, "fileId"> & {
  fileId?: TaskFileReference[];
};

export const isValidObjectId = (id: string) => mongoose.isValidObjectId(id);

export const toIdString = (
  value: mongoose.Types.ObjectId | string | undefined | null,
): string => {
  if (value == null) {
    throw new DataIntegrityError("Missing required related identifier.");
  }

  return value.toString();
};

export const toFileTemplateView = (
  fileTemplate: FileTemplateDocument,
): FileTemplateView => ({
  _id: toIdString(fileTemplate._id),
  projectId: toIdString(fileTemplate.projectId),
  path: fileTemplate.path,
  content: fileTemplate.content,
  createdAt: fileTemplate.createdAt,
  updatedAt: fileTemplate.updatedAt,
});

export const toTaskView = (
  task: TaskWithFileReferences,
  fileTemplateMap?: Map<string, FileTemplateView>,
): TaskView => {
  const mappedFiles = (task.fileId ?? [])
    .map((file) => {
      if (file instanceof mongoose.Types.ObjectId) {
        return fileTemplateMap?.get(toIdString(file)) ?? null;
      }

      if (typeof file === "string") {
        return fileTemplateMap?.get(file) ?? null;
      }

      const fileId = toIdString(file._id);
      return fileTemplateMap?.get(fileId) ?? toFileTemplateView(file);
    })
    .filter((file): file is FileTemplateView => file !== null);

  return {
    _id: toIdString(task._id),
    moduleId: toIdString(task.moduleId),
    fileId: mappedFiles,
    title: task.title,
    description: task.description,
    order: task.order,
    instructions: task.instructions,
    difficulty: task.difficulty,
    concepts: task.concepts,
    skillCategory: task.skillCategory,
    skillPoints: task.skillPoints,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
};

export const toTaskFileSolutionView = (
  solution: TaskFileDocument,
): TaskFileSolutionView => ({
  _id: toIdString(solution._id),
  taskId: toIdString(solution.taskId),
  fileId: toFileTemplateView(
    solution.fileId as unknown as FileTemplateDocument,
  ),
  content: solution.content,
  createdAt: solution.createdAt,
  updatedAt: solution.updatedAt,
});

export const toUserWorkspaceFileView = (
  userFile: UserFileDocument,
): UserWorkspaceFileView => ({
  _id: toIdString(userFile._id),
  userId: toIdString(userFile.userId),
  projectId: toIdString(userFile.projectId),
  fileId: toFileTemplateView(
    userFile.fileId as unknown as FileTemplateDocument,
  ),
  content: userFile.content,
  createdAt: userFile.createdAt,
  updatedAt: userFile.updatedAt,
});

export const toUserProgressView = (
  progress: UserProgressDocument,
): UserProgressView => ({
  _id: toIdString(progress._id),
  userId: toIdString(progress.userId),
  projectId: toIdString(progress.projectId),
  completedTaskIds: (progress.completedTaskIds ?? []).map(toIdString),
  unlockedModuleIds: (progress.unlockedModuleIds ?? []).map(toIdString),
  lastActiveTaskId: progress.lastActiveTaskId
    ? toIdString(progress.lastActiveTaskId)
    : undefined,
  createdAt: progress.createdAt,
  updatedAt: progress.updatedAt,
});

export const toProjectSummaryView = (
  project: ProjectDocument,
): ProjectSummaryView => ({
  _id: toIdString(project._id),
  title: project.title,
  description: project.description,
  level: project.level,
  previewUrl: project.previewUrl,
  systemFlowUrl: project.systemFlowUrl,
  createdAt: project.createdAt,
  updatedAt: project.updatedAt,
});
