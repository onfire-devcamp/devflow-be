import AIEvaluation from "../models/aiEvaluationModel.js";
import Task from "../models/taskModel.js";
import GeminiClient from "../utils/geminiClient.js";
import {
  EVALUATOR_SYSTEM_PROMPT,
  EXPLAIN_TO_PASS_PROMPT,
  buildEvaluationPrompt,
  buildExplainToPassPrompt,
} from "../constants/aiPrompts.js";
import {
  EXPLAIN_TO_PASS_RULES,
  EVAL_STATUS,
  EVAL_TYPE,
} from "../constants/evaluationConstant.js";
import { toAIEvaluationView, toIdString } from "../utils/mappers.js";
import { appendChatMessages } from "./aiChatService.js";
import { getUserWorkspace, completeTask } from "./workspaceService.js";
import { getTaskDetails } from "./projectService.js";
import { BadRequestError, NotFoundError } from "../utils/customErrors.js";
import {
  CODE_REVIEW_USER_MESSAGE,
  EXPLAIN_TO_PASS_USER_MESSAGE,
  buildCodeReviewMentorMessage,
  buildExplainToPassFailMessage,
  buildExplainToPassPassMessage,
} from "../constants/chatMessages.js";
import type { AIEvaluationView } from "../types/aiTypes.js";
import type { AIEvaluationDocument } from "../models/aiEvaluationModel.js";
import mongoose, { isValidObjectId } from "mongoose";
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
  const userFiles = await getUserWorkspace(userId, projectId);
  const taskDetails = await getTaskDetails(taskId);

  const comparisons = taskDetails.solutions
    .map((sol) => {
      const expectedFileId = toIdString(sol.fileId._id);
      const userFile = userFiles.find((f) => f.fileId._id === expectedFileId);
      return `File: ${sol.fileId.path}\nExpected:\n${sol.content}\nUser:\n${userFile?.content ?? "(missing)"}`;
    })
    .join("\n\n---\n\n");

  const prompt = buildEvaluationPrompt(taskId, comparisons);

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
    (result.passStatus !== EVAL_STATUS.PASS &&
      result.passStatus !== EVAL_STATUS.FAIL) ||
    typeof result.feedback !== "string"
  ) {
    throw new Error("Invalid evaluation response from AI.");
  }

  const score = Number(result.score ?? 0);
  const passStatus =
    result.passStatus === EVAL_STATUS.PASS
      ? EVAL_STATUS.PASS
      : EVAL_STATUS.FAIL;
  const feedback = String(result.feedback ?? "No feedback provided.");
  const mentorMessage = buildCodeReviewMentorMessage(
    score,
    passStatus,
    feedback,
  );

  await appendChatMessages(userId, projectId, taskId, [
    { role: "user", message: CODE_REVIEW_USER_MESSAGE },
    {
      role: "mentor",
      message: mentorMessage.message,
      isPassAction: mentorMessage.isPassAction,
    },
  ]);

  if (passStatus === EVAL_STATUS.PASS) {
    const session = await mongoose.startSession();
    let evalDoc: AIEvaluationDocument | null = null;
    try {
      await session.withTransaction(async () => {
        const [createdEvalDoc] = await AIEvaluation.create(
          [
            {
              userId,
              projectId,
              taskId,
              type: "codeReview",
              inputData: {},
              score,
              passStatus,
              feedback,
            },
          ],
          { session },
        );
        await completeTask(userId, projectId, taskId, session);
        evalDoc = createdEvalDoc as unknown as AIEvaluationDocument;
      });
    } finally {
      await session.endSession();
    }

    if (!evalDoc) {
      throw new Error("Unable to create evaluation.");
    }

    return toAIEvaluationView(evalDoc);
  }

  const evalDoc = (await AIEvaluation.create({
    userId,
    projectId,
    taskId,
    type: EVAL_TYPE.CODE_REVIEW,
    inputData: {},
    score,
    passStatus,
    feedback,
  })) as unknown as AIEvaluationDocument;

  return toAIEvaluationView(evalDoc);
};

export const evaluateExplainToPass = async (
  userId: string,
  projectId: string,
  taskId: string,
  mcqAnswer: string,
  explanation: string,
): Promise<AIEvaluationView> => {
  const task = await Task.findById(taskId).lean();
  if (!task) {
    throw new NotFoundError("Task not found.");
  }
  const previousPassedEvaluation = (await AIEvaluation.findOne({
    userId,
    projectId,
    taskId,
    type: EVAL_TYPE.EXPLAIN_TO_PASS,
    passStatus: EVAL_STATUS.PASS,
  }).sort({ createdAt: -1 })) as unknown as AIEvaluationDocument | null;
  if (previousPassedEvaluation) {
    return toAIEvaluationView(previousPassedEvaluation);
  }

  if (!task.mcq?.correctAnswer) {
    throw new BadRequestError("Task does not have an Explain-to-Pass MCQ.");
  }

  const normalizedMcqAnswer = mcqAnswer.trim();
  const normalizedCorrectAnswer = task.mcq.correctAnswer.trim();
  const mcqScore =
    normalizedMcqAnswer === normalizedCorrectAnswer
      ? EXPLAIN_TO_PASS_RULES.MCQ_SCORE
      : 0;

  const concepts =
    Array.isArray(task.concepts) && task.concepts.length > 0
      ? task.concepts.join(", ")
      : "No explicit concepts configured.";

  const prompt = buildExplainToPassPrompt(
    task.title,
    concepts,
    explanation.trim(),
  );

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

  const aiScore = Math.min(
    EXPLAIN_TO_PASS_RULES.AI_SCORE,
    Math.max(0, Number(result.score)),
  );
  const totalScore = mcqScore + aiScore;
  const passStatus =
    totalScore >= EXPLAIN_TO_PASS_RULES.PASS_SCORE
      ? EVAL_STATUS.PASS
      : EVAL_STATUS.FAIL;
  const mcqFeedback =
    mcqScore === EXPLAIN_TO_PASS_RULES.MCQ_SCORE
      ? "MCQ answered correctly."
      : "MCQ answered incorrectly.";
  const feedback = `${mcqFeedback} ${result.feedback}`;

  if (passStatus === EVAL_STATUS.PASS) {
    await appendChatMessages(userId, projectId, taskId, [
      { role: "user", message: EXPLAIN_TO_PASS_USER_MESSAGE },
      {
        role: "mentor",
        message: buildExplainToPassPassMessage(totalScore, feedback),
      },
    ]);
  } else {
    const failMessage = buildExplainToPassFailMessage(totalScore, feedback);
    await appendChatMessages(userId, projectId, taskId, [
      { role: "user", message: EXPLAIN_TO_PASS_USER_MESSAGE },
      {
        role: "mentor",
        message: failMessage.message,
        isPassAction: failMessage.isPassAction,
      },
    ]);
  }

  if (passStatus === EVAL_STATUS.PASS) {
    const session = await mongoose.startSession();
    let evalDoc: AIEvaluationDocument | null = null;
    try {
      await session.withTransaction(async () => {
        const [createdEvalDoc] = await AIEvaluation.create(
          [
            {
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
            },
          ],
          { session },
        );
        await completeTask(userId, projectId, taskId, session);
        evalDoc = createdEvalDoc as unknown as AIEvaluationDocument;
      });
    } finally {
      await session.endSession();
    }

    if (!evalDoc) {
      throw new Error("Unable to create evaluation.");
    }

    return toAIEvaluationView(evalDoc);
  }

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

  return toAIEvaluationView(evalDoc);
};
