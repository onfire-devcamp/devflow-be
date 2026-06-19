import mongoose from "mongoose";
import FileTemplate from "../models/fileTemplateModel.js";
import Module from "../models/moduleModel.js";
import Project, { type ProjectTechStackItem } from "../models/projectModel.js";
import Task from "../models/taskModel.js";
import TaskFile from "../models/taskFileModel.js";
import UserFile from "../models/userFileModel.js";
import UserProgress from "../models/userProgressModel.js";
import AIEvaluation from "../models/aiEvaluationModel.js";
import { EVAL_STATUS, EVAL_TYPE } from "../constants/evaluationConstant.js";
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
import { TaskRoadmapStatus } from "../types/projectTypes.js";

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
    slug: project.slug,
    description: project.description,
    level: project.level,
    category: project.category,
    previewUrl: project.previewUrl,
    systemFlowUrl: project.systemFlowUrl,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  }));
};

export const getProjectDetails = async (
  slug: string,
): Promise<ProjectDetailsView> => {
  if (!slug) throw new BadRequestError("Invalid project slug.");

  const project = await Project.findOne({ slug }).lean();
  if (!project) throw new NotFoundError("Project not found.");

  const moduleCount = await Module.countDocuments({ projectId: project._id });
  const estimatedHours = moduleCount * 5;

  return {
    _id: toIdString(project._id),
    title: project.title,
    slug: project.slug,
    description: project.description,
    level: project.level,
    category: project.category,
    previewUrl: project.previewUrl,
    systemFlowUrl: project.systemFlowUrl,
    techStack: project.techStack,
    features: project.features,
    moduleCount,
    estimatedHours,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
};

const resolveTaskRoadmapStatus = (
  taskId: string,
  completedTaskIds: Set<string>,
  isModuleUnlocked: boolean,
): TaskRoadmapStatus => {
  if (completedTaskIds.has(taskId)) return TaskRoadmapStatus.COMPLETED;
  if (isModuleUnlocked) return TaskRoadmapStatus.CURRENT;
  return TaskRoadmapStatus.LOCKED;
};

const buildCompletedTaskIdSet = async (
  userId: string,
  projectId: string,
): Promise<Set<string>> => {
  const completedTaskIds = new Set<string>();

  const progress = await UserProgress.findOne({ userId, projectId }).lean();
  for (const taskId of progress?.completedTaskIds ?? []) {
    completedTaskIds.add(toIdString(taskId));
  }

  const passedEvaluationTaskIds = await AIEvaluation.distinct("taskId", {
    userId,
    projectId,
    passStatus: EVAL_STATUS.PASS,
    type: EVAL_TYPE.EXPLAIN_TO_PASS,
  });

  for (const taskId of passedEvaluationTaskIds) {
    completedTaskIds.add(toIdString(taskId as mongoose.Types.ObjectId));
  }

  return completedTaskIds;
};

export const getProjectRoadmap = async (
  projectId: string,
  userId?: string,
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

  const completedTaskIds =
    userId && isValidObjectId(userId)
      ? await buildCompletedTaskIdSet(userId, projectId)
      : new Set<string>();

  const taskScores = new Map<string, number>();
  if (userId && isValidObjectId(userId)) {
    const aiEvals = await AIEvaluation.find({
      userId,
      projectId,
      type: EVAL_TYPE.EXPLAIN_TO_PASS,
      passStatus: EVAL_STATUS.PASS,
    }).lean();
    for (const ev of aiEvals) {
      taskScores.set(
        toIdString(ev.taskId as mongoose.Types.ObjectId),
        ev.score,
      );
    }
  }

  let nextModuleUnlocked = true;
  const roadmapModules: ModuleWithTasksView[] = [];

  for (const module of modules) {
    const moduleKey = toIdString(module._id);
    const moduleTasks = (tasksByModuleId.get(moduleKey) ?? []).map((task) => ({
      ...task,
      aiScore: taskScores.get(task._id),
      status: resolveTaskRoadmapStatus(
        task._id,
        completedTaskIds,
        nextModuleUnlocked,
      ),
    }));

    const isModuleFullyCompleted =
      moduleTasks.length === 0 ||
      moduleTasks.every((task) => task.status === TaskRoadmapStatus.COMPLETED);

    nextModuleUnlocked = nextModuleUnlocked && isModuleFullyCompleted;

    roadmapModules.push(toModuleWithTasksView(module, moduleTasks));
  }

  const totalTasks = tasks.length;
  const completedCount = tasks.filter((task) =>
    completedTaskIds.has(toIdString(task._id)),
  ).length;
  const progressPercentage =
    totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const progress =
    userId && isValidObjectId(userId)
      ? await UserProgress.findOne({ userId, projectId }).lean()
      : null;

  return {
    project: {
      ...toProjectSummaryView(project),
      progressPercentage,
      isInitialized: !!progress,
    },
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
          skeleton: file.content,
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

export const getProjectCodebase = async (
  slug: string,
): Promise<import("../types/projectTypes.js").FileTemplateView[]> => {
  if (!slug) throw new BadRequestError("Invalid project slug.");

  const project = await Project.findOne({ slug }).lean();
  if (!project) throw new NotFoundError("Project not found.");

  const fileTemplates = await FileTemplate.find({ projectId: project._id })
    .sort({ path: 1 })
    .lean();

  return fileTemplates.map(toFileTemplateView);
};
