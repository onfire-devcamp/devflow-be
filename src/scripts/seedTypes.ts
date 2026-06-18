import type { ProjectLevel } from "../models/projectModel.js";
import type { SkillCategory, TaskDifficulty } from "../models/taskModel.js";

export type SeedFoundationalFile = {
  path: string;
  content: string;
};

export type SeedTaskFile = {
  path: string;
  skeleton: string;
  solution: string;
};

export type SeedTaskMcq = {
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
};

export type SeedTask = {
  title: string;
  description: string;
  order: number;
  instructions: string;
  difficulty: TaskDifficulty;
  skillCategory: SkillCategory;
  skillPoints: number;
  concepts: string;
  files: SeedTaskFile[];
  mcq: SeedTaskMcq;
};

export type SeedModule = {
  title: string;
  description: string;
  order: number;
  tasks: SeedTask[];
};

export type SeedTechStackItem = {
  name: string;
  iconUrl: string;
  category: string;
};

export type SeedFeatureItem = {
  title: string;
  description: string;
};

export type SeedProject = {
  title: string;
  slug: string;
  description: string;
  level: ProjectLevel;
  previewUrl: string;
  systemFlowUrl: string;
  techStack: SeedTechStackItem[];
  features: SeedFeatureItem[];
  foundationalFiles: SeedFoundationalFile[];
  modules: SeedModule[];
};
