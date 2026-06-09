import type { FileTemplateView } from "./projectTypes.js";

export type AIChatRole = "user" | "mentor";

export interface AIChatView {
  _id: string;
  userId: string;
  projectId: string;
  taskId: string;
  message: string;
  role: AIChatRole;
  createdAt: Date;
  updatedAt: Date;
}

export type FrontendChatSender = "user" | "ai";

export interface FrontendChatMessageView {
  id: string;
  sender: FrontendChatSender;
  text: string;
  isPassAction?: boolean;
}

export type AIHintType = "hint" | "explain";

export interface AIHintView {
  _id: string;
  userId: string;
  projectId: string;
  taskId: string;
  fileId: FileTemplateView;
  type: AIHintType;
  selectedCode: string;
  aiResponse: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIEvaluationInput {
  rawText?: string;
  codeSnippet?: string;
  language?: string;
  mcqAnswer?: string;
  explanation?: string;
}

export interface AIEvaluationView {
  _id: string;
  userId: string;
  projectId: string;
  taskId: string;
  type: "codeReview" | "explainToPass";
  inputData: AIEvaluationInput;
  score: number;
  passStatus: "PASS" | "FAIL";
  feedback: string;
  createdAt: Date;
  updatedAt: Date;
}
