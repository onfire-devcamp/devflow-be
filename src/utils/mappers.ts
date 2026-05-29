import mongoose from "mongoose";
import type {
  FileTemplateView,
  TaskFileSolutionView,
  TaskView,
  ProjectSummaryView,
} from "../types/projectTypes.js";
import type { UserWorkspaceFileView } from "../types/workspaceTypes.js";
import { DataIntegrityError } from "./customErrors.ts";

export const isValidObjectId = (id: string) => mongoose.isValidObjectId(id);

export const toIdString = (
  value: mongoose.Types.ObjectId | string | undefined | null,
): string => {
  if (value == null) {
    throw new DataIntegrityError("Missing required related identifier.");
  }

  return value.toString();
};

export const toFileTemplateView = (fileTemplate: any): FileTemplateView => ({
  _id: toIdString(fileTemplate._id),
  projectId: toIdString(fileTemplate.projectId),
  path: fileTemplate.path,
  content: fileTemplate.content,
  createdAt: fileTemplate.createdAt,
  updatedAt: fileTemplate.updatedAt,
});

export const toTaskView = (
  task: any,
  fileTemplateMap?: Map<string, FileTemplateView>,
): TaskView => {
  const mappedFiles = (task.fileId ?? [])
    .map((file: any) => {
      const id = toIdString(file._id || file);
      return (
        fileTemplateMap?.get(id) || (file._id ? toFileTemplateView(file) : null)
      );
    })
    .filter(Boolean) as FileTemplateView[];

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
  solution: any,
): TaskFileSolutionView => ({
  _id: toIdString(solution._id),
  taskId: toIdString(solution.taskId),
  fileId: toFileTemplateView(solution.fileId),
  content: solution.content,
  createdAt: solution.createdAt,
  updatedAt: solution.updatedAt,
});

export const toUserWorkspaceFileView = (
  userFile: any,
): UserWorkspaceFileView => ({
  _id: toIdString(userFile._id),
  userId: toIdString(userFile.userId),
  projectId: toIdString(userFile.projectId),
  fileId: toFileTemplateView(userFile.fileId),
  content: userFile.content,
  createdAt: userFile.createdAt,
  updatedAt: userFile.updatedAt,
});

export const toProjectSummaryView = (project: any): ProjectSummaryView => ({
  _id: toIdString(project._id),
  title: project.title,
  description: project.description,
  level: project.level,
  previewUrl: project.previewUrl,
  systemFlowUrl: project.systemFlowUrl,
  createdAt: project.createdAt,
  updatedAt: project.updatedAt,
});
