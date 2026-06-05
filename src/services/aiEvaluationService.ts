import AIEvaluation from "../models/aiEvaluationModel.js";
import Task from "../models/taskModel.js";
import GeminiClient from "../utils/geminiClient.js";
import {
  EVALUATOR_SYSTEM_PROMPT,
  EXPLAIN_TO_PASS_PROMPT,
} from "../constants/aiPrompts.js";
import { toAIEvaluationView, toIdString } from "../utils/mappers.js";
import { getUserWorkspace, completeTask } from "./workspaceService.js";
import { getTaskDetails } from "./projectService.js";
import { BadRequestError, NotFoundError } from "../utils/customErrors.js";
import type { AIEvaluationView } from "../types/aiTypes.js";
import type { AIEvaluationDocument } from "../models/aiEvaluationModel.js";
import { isValidObjectId } from "mongoose";
import { SchemaType } from "@google/generative-ai";

type ExplainToPassAIResult = {
  score?: number;
  feedback?: string;
  passConcepts?: boolean;
};
export const submitTaskForEvaluation = async (
  userId: string,
  projectId: string,
  taskId: string,
): Promise<AIEvaluationView> => {
  if (![userId, projectId, taskId].every(isValidObjectId)) {
    throw new BadRequestError("Invalid identifiers for evaluation.");
  }

  const userFiles = await getUserWorkspace(userId, projectId);
  const taskDetails = await getTaskDetails(taskId);

  // Build a comparison prompt
  const comparisons = taskDetails.solutions
    .map((sol) => {
      const expectedFileId = toIdString(sol.fileId._id);
      const userFile = userFiles.find((f) => f.fileId._id === expectedFileId);
      return `File: ${sol.fileId.path}\nExpected:\n${sol.content}\nUser:\n${userFile?.content ?? "(missing)"}`;
    })
    .join("\n\n---\n\n");

  const prompt = `Compare the expected solutions to the user's code for task ${taskId}:\n\n${comparisons}`;

  const schema = {
    type: SchemaType.OBJECT,
    properties: {
      score: { type: SchemaType.NUMBER },
      passStatus: { type: SchemaType.STRING },
      feedback: { type: SchemaType.STRING },
    },
    required: ["score", "passStatus", "feedback"],
  };

  const structured = await GeminiClient.generateStructuredResponse(
    prompt,
    schema,
    EVALUATOR_SYSTEM_PROMPT,
  );

  const result = structured as unknown as {
    score?: number;
    passStatus?: string;
    feedback?: string;
  };

  if (typeof result !== "object" || result == null) {
    throw new Error("Invalid evaluation response from AI.");
  }

  if (
    typeof result.score !== "number" ||
    (result.passStatus !== "PASS" && result.passStatus !== "FAIL") ||
    typeof result.feedback !== "string"
  ) {
    throw new Error("Invalid evaluation response from AI.");
  }

  const score = Number(result.score ?? 0);
  const passStatus = result.passStatus === "PASS" ? "PASS" : "FAIL";
  const feedback = String(result.feedback ?? "No feedback provided.");

  const evalDoc = (await AIEvaluation.create({
    userId,
    projectId,
    taskId,
    type: "codeReview",
    inputData: {},
    score,
    passStatus,
    feedback,
  })) as unknown as AIEvaluationDocument;

  if (passStatus === "PASS") {
    await completeTask(userId, projectId, taskId);
  }

  return toAIEvaluationView(evalDoc);
};

export const evaluateExplainToPass = async (
  userId: string,
  projectId: string,
  taskId: string,
  mcqAnswer: string,
  explanation: string,
): Promise<AIEvaluationView> => {
  if (![userId, projectId, taskId].every(isValidObjectId)) {
    throw new BadRequestError("Invalid identifiers for explain-to-pass.");
  }

  const task = await Task.findById(taskId).lean();
  if (!task) {
    throw new NotFoundError("Task not found.");
  }

  if (!task.mcq?.correctAnswer) {
    throw new BadRequestError("Task does not have an Explain-to-Pass MCQ.");
  }

  const normalizedMcqAnswer = mcqAnswer.trim();
  const normalizedCorrectAnswer = task.mcq.correctAnswer.trim();
  const mcqScore = normalizedMcqAnswer === normalizedCorrectAnswer ? 5 : 0;

  const concepts =
    Array.isArray(task.concepts) && task.concepts.length > 0
      ? task.concepts.join(", ")
      : "No explicit concepts configured.";

  const prompt = `Task: ${task.title}
Core concepts: ${concepts}
User explanation: ${explanation.trim()}`;

  const schema = {
    type: SchemaType.OBJECT,
    properties: {
      score: { type: SchemaType.NUMBER },
      feedback: { type: SchemaType.STRING },
      passConcepts: { type: SchemaType.BOOLEAN },
    },
    required: ["score", "feedback", "passConcepts"],
  };

  const structured = await GeminiClient.generateStructuredResponse(
    prompt,
    schema,
    EXPLAIN_TO_PASS_PROMPT,
  );

  const result = structured as ExplainToPassAIResult;

  if (typeof result !== "object" || result == null) {
    throw new Error("Invalid explain-to-pass response from AI.");
  }

  if (
    typeof result.score !== "number" ||
    typeof result.feedback !== "string" ||
    typeof result.passConcepts !== "boolean"
  ) {
    throw new Error("Invalid explain-to-pass response from AI.");
  }

  const aiScore = Math.min(5, Math.max(0, Number(result.score)));
  const totalScore = mcqScore + aiScore;
  const passStatus = totalScore >= 7 ? "PASS" : "FAIL";
  const mcqFeedback =
    mcqScore === 5 ? "MCQ answered correctly." : "MCQ answered incorrectly.";
  const feedback = `${mcqFeedback} ${result.feedback}`;

  const evalDoc = (await AIEvaluation.create({
    userId,
    projectId,
    taskId,
    type: "explainToPass",
    inputData: {
      mcqAnswer: normalizedMcqAnswer,
      explanation: explanation.trim(),
    },
    score: totalScore,
    passStatus,
    feedback,
  })) as unknown as AIEvaluationDocument;

  if (passStatus === "PASS") {
    await completeTask(userId, projectId, taskId);
  }

  return toAIEvaluationView(evalDoc);
};
