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

export type TaskRoadmapStatus = "completed" | "current" | "locked";

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
  description?: string;
  level: ProjectLevel;
  previewUrl?: string;
  systemFlowUrl?: string;
  progressPercentage?: number;
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
