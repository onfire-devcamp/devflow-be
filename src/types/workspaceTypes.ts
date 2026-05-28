import type { FileTemplateView } from "./projectTypes.js";

export interface UserWorkspaceFileView {
  _id: string;
  userId: string;
  projectId: string;
  fileId: FileTemplateView;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InitializeWorkspaceView {
  createdCount: number;
  files: UserWorkspaceFileView[];
}

export interface SaveUserFileInput {
  userId: string;
  projectId: string;
  fileId: string;
  newContent: string;
}
