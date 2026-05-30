import AIEvaluation from "../models/aiEvaluationModel.js";
import GeminiClient from "../utils/geminiClient.js";
import { EVALUATOR_SYSTEM_PROMPT } from "../constants/aiPrompts.js";
import { toAIEvaluationView, toIdString } from "../utils/mappers.js";
import { getUserWorkspace, completeTask } from "./workspaceService.js";
import { getTaskDetails } from "./projectService.js";
import { BadRequestError } from "../utils/customErrors.js";
import type { AIEvaluationView } from "../types/aiTypes.js";
import type { AIEvaluationDocument } from "../models/aiEvaluationModel.js";
import { isValidObjectId } from "mongoose";
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
    type: "OBJECT",
    properties: {
      score: { type: "number" },
      passStatus: { type: "string" },
      feedback: { type: "string" },
    },
    required: ["score", "passStatus", "feedback"],
    additionalProperties: false,
  } as const;

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
