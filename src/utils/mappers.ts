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
import type { AIChatDocument } from "../models/aiChatModel.js";
import type { AIHintDocument } from "../models/aiHintModel.js";
import type { AIEvaluationDocument } from "../models/aiEvaluationModel.js";
import type {
  AIChatView,
  AIHintView,
  AIEvaluationView,
  FrontendChatMessageView,
} from "../types/aiTypes.js";
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
    concepts: Array.isArray(task.concepts)
      ? task.concepts.join(", ")
      : task.concepts,
    mcq: task.mcq
      ? {
          question: task.mcq.question,
          options: task.mcq.options.map((opt) => ({
            id: opt.id,
            text: opt.text,
          })),
        }
      : undefined,
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

export const toProjectSummaryView = (
  project: ProjectDocument,
): ProjectSummaryView => ({
  _id: toIdString(project._id),
  title: project.title,
  slug: project.slug,
  description: project.description,
  level: project.level,
  previewUrl: project.previewUrl,
  systemFlowUrl: project.systemFlowUrl,
  createdAt: project.createdAt,
  updatedAt: project.updatedAt,
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

export const toAIChatView = (chat: AIChatDocument): AIChatView => ({
  _id: toIdString(chat._id),
  userId: toIdString(chat.userId),
  projectId: toIdString(chat.projectId),
  taskId: toIdString(chat.taskId),
  message: chat.message,
  role: chat.role as AIChatView["role"],
  isPassAction: chat.isPassAction ?? false,
  createdAt: chat.createdAt,
  updatedAt: chat.updatedAt,
});

const EXPLAIN_TO_PASS_ACTION_MARKERS = [
  "Explain-to-Pass quick check",
  "Explain-to-Pass needs one more try",
] as const;

export const toFrontendChatMessage = (
  chat: AIChatView,
): FrontendChatMessageView => {
  const isPassAction =
    chat.isPassAction ||
    (chat.role === "mentor" &&
      EXPLAIN_TO_PASS_ACTION_MARKERS.some((marker) =>
        chat.message.includes(marker),
      ));

  return {
    id: chat._id,
    sender: chat.role === "user" ? "user" : "ai",
    text: chat.message,
    ...(isPassAction ? { isPassAction: true } : {}),
  };
};

export const toAIHintView = (hint: AIHintDocument): AIHintView => ({
  _id: toIdString(hint._id),
  userId: toIdString(hint.userId),
  projectId: toIdString(hint.projectId),
  taskId: toIdString(hint.taskId),
  fileId: toFileTemplateView(hint.fileId as unknown as FileTemplateDocument),
  type: hint.type as AIHintView["type"],
  selectedCode: hint.selectedCode,
  aiResponse: hint.aiResponse,
  createdAt: hint.createdAt,
  updatedAt: hint.updatedAt,
});

export const toAIEvaluationView = (
  evalDoc: AIEvaluationDocument,
): AIEvaluationView => ({
  _id: toIdString(evalDoc._id),
  userId: toIdString(evalDoc.userId),
  projectId: toIdString(evalDoc.projectId),
  taskId: toIdString(evalDoc.taskId),
  type: evalDoc.type as AIEvaluationView["type"],
  inputData: evalDoc.inputData,
  score: evalDoc.score,
  passStatus: evalDoc.passStatus as AIEvaluationView["passStatus"],
  feedback: evalDoc.feedback,
  createdAt: evalDoc.createdAt,
  updatedAt: evalDoc.updatedAt,
});
