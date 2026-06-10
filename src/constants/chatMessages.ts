import { EVAL_STATUS } from "./evaluationConstant.js";

export const CODE_REVIEW_USER_MESSAGE = "Submitted my code for review.";
export const EXPLAIN_TO_PASS_USER_MESSAGE =
  "Submitted my Explain-to-Pass answers.";

export const CODE_REVIEW_PASS_SCORE_THRESHOLD = 7;

export const buildWelcomeMessage = (taskTitle: string): string =>
  `New task: **${taskTitle}**. Submit code when you're ready — I'll point out anything missing.`;

export const buildHintUserMessage = (
  type: "hint" | "explain",
  userQuestion?: string,
): string => {
  const trimmedQuestion = userQuestion?.trim();
  if (trimmedQuestion) return trimmedQuestion;

  return type === "explain"
    ? "Can you explain this highlighted code?"
    : "Can you give me a hint for this highlighted code?";
};

export const buildCodeReviewMentorMessage = (
  score: number,
  passStatus: string,
  feedback: string,
): { message: string; isPassAction: boolean } => {
  const passedCodeReview =
    passStatus === EVAL_STATUS.PASS &&
    Number(score) >= CODE_REVIEW_PASS_SCORE_THRESHOLD;
  const message = passedCodeReview
    ? `**Task passed - Score:** ${score}/10\n\n${feedback}\n\nLet's finish with the Explain-to-Pass quick check.`
    : `**Status:** ${passStatus} | **Score:** ${score}\n\n${feedback}`;

  return { message, isPassAction: passedCodeReview };
};

export const buildExplainToPassPassMessage = (
  totalScore: number,
  feedback: string,
): string =>
  `**Task officially completed - Explain-to-Pass Score:** ${totalScore}/10\n\n${feedback}\n\nNice. The next task should now be unlocked.`;

export const buildExplainToPassFailMessage = (
  totalScore: number,
  feedback: string,
): { message: string; isPassAction: boolean } => ({
  message: `**Explain-to-Pass needs one more try - Score:** ${totalScore}/10\n\n${feedback}`,
  isPassAction: true,
});
