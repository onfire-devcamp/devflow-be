import type {
  ProjectFeatureItem,
  ProjectLevel,
  ProjectTechStackItem,
} from "../models/projectModel.js";
import type { SkillCategory, TaskDifficulty } from "../models/taskModel.js";

export interface FileTemplateView {
  _id: string;
  projectId: string;
  path: string;
  content: string;
  readOnly: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskFileSolutionView {
  _id: string;
  taskId: string;
  fileId: FileTemplateView;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export const TaskRoadmapStatus = {
  COMPLETED: "completed",
  CURRENT: "current",
  LOCKED: "locked",
} as const;

export type TaskRoadmapStatus =
  (typeof TaskRoadmapStatus)[keyof typeof TaskRoadmapStatus];

export interface TaskView {
  _id: string;
  moduleId: string;
  fileId: FileTemplateView[];
  title: string;
  description?: string;
  order: number;
  instructions?: string;
  difficulty: TaskDifficulty;
  concepts?: string;
  mcq?: {
    question: string;
    options: {
      id: string;
      text: string;
    }[];
  };
  skillCategory: SkillCategory;
  skillPoints: number;
  aiScore?: number;
  status?: TaskRoadmapStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ModuleWithTasksView {
  _id: string;
  projectId: string;
  title: string;
  description?: string;
  order: number;
  tasks: TaskView[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectSummaryView {
  _id: string;
  title: string;
  slug: string;
  description: string;
  level: string;
  category: string;
  previewUrl?: string;
  systemFlowUrl?: string;
  progressPercentage?: number;
  moduleCount?: number;
  estimatedHours?: number;
  isInitialized?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectDetailsView extends ProjectSummaryView {
  techStack: ProjectTechStackItem[];
  features: ProjectFeatureItem[];
}

export interface ProjectRoadmapView {
  project: ProjectSummaryView;
  modules: ModuleWithTasksView[];
}

export interface TaskDetailsView {
  task: TaskView;
  solutions: TaskFileSolutionView[];
}
