import mongoose from "mongoose";

import FileTemplate from "../models/fileTemplateModel.js";
import Module from "../models/moduleModel.js";
import Project from "../models/projectModel.js";
import Task from "../models/taskModel.js";
import TaskFile from "../models/taskFileModel.js";
import { BadRequestError } from "../utils/customErrors.ts";
import type {
  FileTemplateView,
  ModuleWithTasksView,
  ProjectDetailsView,
  ProjectRoadmapView,
  ProjectSummaryView,
  TaskDetailsView,
  TaskFileSolutionView,
  TaskView,
} from "../types/projectTypes.js";

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

const toTaskView = (
  task: {
    _id: mongoose.Types.ObjectId | string;
    moduleId: mongoose.Types.ObjectId | string;
    fileId?: Array<{
      _id: mongoose.Types.ObjectId | string;
      projectId: mongoose.Types.ObjectId | string;
      path: string;
      content: string;
      createdAt: Date;
      updatedAt: Date;
    }>;
    title: string;
    description?: string;
    order: number;
    instructions?: string;
    difficulty: TaskView["difficulty"];
    concepts?: string;
    skillCategory: TaskView["skillCategory"];
    skillPoints: number;
    createdAt: Date;
    updatedAt: Date;
  },
  fileTemplates: Map<string, FileTemplateView>,
): TaskView => ({
  _id: toIdString(task._id),
  moduleId: toIdString(task.moduleId),
  fileId: (task.fileId ?? []).map(
    (fileTemplate) =>
      fileTemplates.get(toIdString(fileTemplate._id)) ??
      toFileTemplateView(fileTemplate),
  ),
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
});

const toModuleWithTasksView = (
  module: {
    _id: mongoose.Types.ObjectId | string;
    projectId: mongoose.Types.ObjectId | string;
    title: string;
    description?: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
  },
  tasks: TaskView[],
): ModuleWithTasksView => ({
  _id: toIdString(module._id),
  projectId: toIdString(module.projectId),
  title: module.title,
  description: module.description,
  order: module.order,
  tasks,
  createdAt: module.createdAt,
  updatedAt: module.updatedAt,
});

const toTaskFileSolutionView = (solution: {
  _id: mongoose.Types.ObjectId | string;
  taskId: mongoose.Types.ObjectId | string;
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
}): TaskFileSolutionView => ({
  _id: toIdString(solution._id),
  taskId: toIdString(solution.taskId),
  fileId: toFileTemplateView(solution.fileId),
  content: solution.content,
  createdAt: solution.createdAt,
  updatedAt: solution.updatedAt,
});

export const getAllProjects = async (): Promise<ProjectSummaryView[]> => {
  const projects = await Project.find({}, { features: 0, techStack: 0 })
    .sort({ createdAt: -1 })
    .lean();

  return projects.map((project) => ({
    _id: toIdString(project._id),
    title: project.title,
    description: project.description,
    level: project.level,
    previewUrl: project.previewUrl,
    systemFlowUrl: project.systemFlowUrl,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  }));
};

export const getProjectDetails = async (
  projectId: string,
): Promise<ProjectDetailsView> => {
  if (!isValidObjectId(projectId)) {
    throw new BadRequestError("Invalid project id.");
  }

  const project = await Project.findById(projectId).lean();
  if (!project) {
    throw new BadRequestError("Project not found.");
  }

  return {
    _id: toIdString(project._id),
    title: project.title,
    description: project.description,
    level: project.level,
    previewUrl: project.previewUrl,
    systemFlowUrl: project.systemFlowUrl,
    techStack: project.techStack,
    features: project.features,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
};

export const getProjectRoadmap = async (
  projectId: string,
): Promise<ProjectRoadmapView> => {
  if (!isValidObjectId(projectId)) {
    throw new BadRequestError("Invalid project id.");
  }

  const project = await Project.findById(projectId).lean();
  if (!project) {
    throw new BadRequestError("Project not found.");
  }

  const modules = await Module.find({ projectId }).sort({ order: 1 }).lean();
  const moduleIds = modules.map((module) => module._id);

  const tasks = await Task.find({ moduleId: { $in: moduleIds } })
    .sort({ moduleId: 1, order: 1 })
    .lean();

  const fileTemplateIds = Array.from(
    new Set(
      tasks.flatMap((task) => task.fileId.map((fileId) => toIdString(fileId))),
    ),
  );

  const fileTemplates = await FileTemplate.find({
    _id: { $in: fileTemplateIds },
  }).lean();
  const fileTemplateMap = new Map(
    fileTemplates.map((fileTemplate) => [
      toIdString(fileTemplate._id),
      toFileTemplateView(fileTemplate),
    ]),
  );

  const tasksByModuleId = new Map<string, TaskView[]>();
  for (const task of tasks) {
    const taskView = toTaskView(
      {
        ...task,
        fileId: task.fileId as Array<{
          _id: mongoose.Types.ObjectId | string;
          projectId: mongoose.Types.ObjectId | string;
          path: string;
          content: string;
          createdAt: Date;
          updatedAt: Date;
        }>,
      },
      fileTemplateMap,
    );

    const moduleKey = toIdString(task.moduleId);
    const currentTasks = tasksByModuleId.get(moduleKey) ?? [];
    currentTasks.push(taskView);
    tasksByModuleId.set(moduleKey, currentTasks);
  }

  const roadmapModules = modules.map((module) =>
    toModuleWithTasksView(
      module,
      tasksByModuleId.get(toIdString(module._id)) ?? [],
    ),
  );

  return {
    project: {
      _id: toIdString(project._id),
      title: project.title,
      description: project.description,
      level: project.level,
      previewUrl: project.previewUrl,
      systemFlowUrl: project.systemFlowUrl,
      techStack: project.techStack,
      features: project.features,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    },
    modules: roadmapModules,
  };
};

export const getTaskDetails = async (
  taskId: string,
): Promise<TaskDetailsView> => {
  if (!isValidObjectId(taskId)) {
    throw new BadRequestError("Invalid task id.");
  }

  const task = await Task.findById(taskId).lean();
  if (!task) {
    throw new BadRequestError("Task not found.");
  }

  const fileTemplates = await FileTemplate.find({
    _id: { $in: task.fileId },
  }).lean();
  const fileTemplateMap = new Map(
    fileTemplates.map((fileTemplate) => [
      toIdString(fileTemplate._id),
      toFileTemplateView(fileTemplate),
    ]),
  );

  const taskView = toTaskView(
    {
      ...task,
      fileId: fileTemplates,
    },
    fileTemplateMap,
  );

  const solutions = await TaskFile.find({ taskId: task._id })
    .sort({ createdAt: 1 })
    .lean();
  const solutionFileTemplates = await FileTemplate.find({
    _id: { $in: solutions.map((solution) => solution.fileId) },
  }).lean();
  const solutionFileTemplateMap = new Map(
    solutionFileTemplates.map((fileTemplate) => [
      toIdString(fileTemplate._id),
      toFileTemplateView(fileTemplate),
    ]),
  );

  return {
    task: taskView,
    solutions: solutions.map((solution) => {
      const fileTemplate = solutionFileTemplateMap.get(
        toIdString(solution.fileId),
      );

      if (!fileTemplate) {
        throw new BadRequestError("Task file solution could not be resolved.");
      }

      return toTaskFileSolutionView({
        _id: solution._id,
        taskId: solution.taskId,
        fileId: {
          _id: fileTemplate._id,
          projectId: fileTemplate.projectId,
          path: fileTemplate.path,
          content: fileTemplate.content,
          createdAt: fileTemplate.createdAt,
          updatedAt: fileTemplate.updatedAt,
        },
        content: solution.content,
        createdAt: solution.createdAt,
        updatedAt: solution.updatedAt,
      });
    }),
  };
};
