export const EXPLAIN_TO_PASS_RULES = {
  MAX_TOTAL_SCORE: 10,
  MCQ_SCORE: 5,
  AI_SCORE: 5,
  PASS_SCORE: 7,
} as const;

export const EVAL_STATUS = {
  PASS: "PASS",
  FAIL: "FAIL",
} as const;

export const EVAL_TYPE = {
  CODE_REVIEW: "codeReview",
  EXPLAIN_TO_PASS: "explainToPass",
} as const;
