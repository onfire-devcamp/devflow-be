import mongoose from "mongoose";
import FileTemplate from "../models/fileTemplateModel.js";
import Module from "../models/moduleModel.js";
import Project, { type ProjectTechStackItem } from "../models/projectModel.js";
import Task from "../models/taskModel.js";
import TaskFile from "../models/taskFileModel.js";
import UserFile from "../models/userFileModel.js";
import { BadRequestError, NotFoundError } from "../utils/customErrors.js";
import {
  isValidObjectId,
  toIdString,
  toFileTemplateView,
  toTaskView,
  toTaskFileSolutionView,
  toProjectSummaryView,
} from "../utils/mappers.js";
import type {
  ModuleWithTasksView,
  ProjectDetailsView,
  ProjectRoadmapView,
  ProjectSummaryView,
  TaskDetailsView,
  TaskView,
} from "../types/projectTypes.js";

const toModuleWithTasksView = (
  module: any,
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
  if (!isValidObjectId(projectId))
    throw new BadRequestError("Invalid project id.");

  const project = await Project.findById(projectId).lean();
  if (!project) throw new NotFoundError("Project not found.");

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
  if (!isValidObjectId(projectId))
    throw new BadRequestError("Invalid project id.");

  const project = await Project.findById(projectId).lean();
  if (!project) throw new NotFoundError("Project not found.");

  const modules = await Module.find({ projectId }).sort({ order: 1 }).lean();
  const moduleIds = modules.map((m) => m._id);

  const tasks = await Task.find({ moduleId: { $in: moduleIds } })
    .sort({ moduleId: 1, order: 1 })
    .lean();

  const fileTemplateIds = Array.from(
    new Set(tasks.flatMap((task) => task.fileId.map((id) => toIdString(id)))),
  );

  const fileTemplates = await FileTemplate.find({
    _id: { $in: fileTemplateIds },
  })
    .select("-content")
    .lean();
  const fileTemplateMap = new Map(
    fileTemplates.map((ft) => [toIdString(ft._id), toFileTemplateView(ft)]),
  );

  const tasksByModuleId = new Map<string, TaskView[]>();
  for (const task of tasks) {
    const taskView = toTaskView(task, fileTemplateMap);

    const moduleKey = toIdString(task.moduleId);
    if (!tasksByModuleId.has(moduleKey)) tasksByModuleId.set(moduleKey, []);
    tasksByModuleId.get(moduleKey)!.push(taskView);
  }

  const roadmapModules = modules.map((module) =>
    toModuleWithTasksView(
      module,
      tasksByModuleId.get(toIdString(module._id)) ?? [],
    ),
  );

  return {
    project: toProjectSummaryView(project),
    modules: roadmapModules,
  };
};

export const getTaskDetails = async (
  taskId: string,
  userId?: string,
): Promise<TaskDetailsView> => {
  if (!isValidObjectId(taskId)) throw new BadRequestError("Invalid task id.");

  const task = await Task.findById(taskId).populate("fileId").lean();
  if (!task) throw new NotFoundError("Task not found.");

  const taskView = toTaskView(task);

  if (userId && isValidObjectId(userId)) {
    const moduleDoc = await Module.findById(task.moduleId)
      .select("projectId")
      .lean();

    if (moduleDoc) {
      const projectId = toIdString(moduleDoc.projectId);
      const taskFileIds = taskView.fileId.map((file) => file._id);

      if (taskFileIds.length > 0) {
        const savedUserFiles = await UserFile.find({
          userId,
          projectId,
          fileId: { $in: taskFileIds },
        }).lean();

        const savedContentByFileId = new Map(
          savedUserFiles.map((userFile) => [
            toIdString(userFile.fileId),
            userFile.content,
          ]),
        );

        taskView.fileId = taskView.fileId.map((file) => ({
          ...file,
          content: savedContentByFileId.get(file._id) ?? file.content,
        }));
      }
    }
  }

  const solutions = await TaskFile.find({ taskId: task._id })
    .sort({ createdAt: 1 })
    .populate("fileId")
    .lean();

  return {
    task: taskView,
    solutions: solutions.map(toTaskFileSolutionView),
  };
};

const groupTechStackItem = (
  item: ProjectTechStackItem,
  dictionary: Record<string, ProjectTechStackItem[]>,
) => {
  const cat = item.category ?? "Other";
  if (!dictionary[cat]) {
    dictionary[cat] = [];
  }
  dictionary[cat].push(item);
};

export const getProjectTechStackGrouped = async (
  projectId: string,
): Promise<Record<string, ProjectTechStackItem[]>> => {
  if (!isValidObjectId(projectId)) {
    throw new BadRequestError("Invalid project id.");
  }

  const project = await Project.findById(projectId).lean();
  if (!project) {
    throw new NotFoundError("Project not found.");
  }

  const grouped: Record<string, ProjectTechStackItem[]> = {};

  for (const item of project.techStack ?? []) {
    groupTechStackItem(item, grouped);
  }

  return grouped;
};
