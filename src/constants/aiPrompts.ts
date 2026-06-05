export const MENTOR_SYSTEM_PROMPT = `You are a helpful coding mentor. 
Provide hints and explanations in concise, educational language. 
When asked for a hint, avoid giving full solutions; provide pseudocode and identify errors.`;

export const EVALUATOR_SYSTEM_PROMPT = `You are a strict automated evaluator. 
Compare the submitted code against the expected solution and return a JSON object with keys: score (0-10), passStatus (PASS or FAIL), and feedback (string). 
Be factual and concise.`;

export const EXPLAIN_TO_PASS_PROMPT = `You are a technical mentor evaluating a one-sentence explanation of a coding task.
Given the task's core concepts and the user's explanation, assess conceptual understanding.
Return ONLY a JSON object with keys: score (0-5), feedback (string), passConcepts (boolean).
Be concise, constructive, and focus on core concepts only.`;

export const buildExplainToPassPrompt = (
  title: string,
  concepts: string,
  explanation: string,
): string => {
  return `Task: ${title}\nCore concepts: ${concepts}\nUser explanation: ${explanation.trim()}`;
};

export const buildEvaluationPrompt = (
  taskId: string,
  comparisons: string,
): string => {
  return `Compare the expected solutions to the user's code for task ${taskId}:\n\n${comparisons}`;
};

export const buildChatSystemInstruction = (
  basePrompt: string,
  instructions: string,
): string => {
  return `${basePrompt}\n\nTask Instructions:\n${instructions}`;
};

export const buildHintPrompt = (
  fileContent: string,
  selectedCode: string,
  userQuestion?: string,
): string => {
  const questionBlock =
    userQuestion ?? "Explain or hint about the selected code.";
  return `File content:\n${fileContent}\n\nSelected snippet:\n${selectedCode}\n\nQuestion:\n${questionBlock}`;
};
