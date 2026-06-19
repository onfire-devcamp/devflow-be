import type { SeedProject } from "./seedTypes.js";

// ═══════════════════════════════════════════════════════════════════════════
// Foundational Files — Read-Only & Always Visible
// ═══════════════════════════════════════════════════════════════════════════

const foundationalFiles: SeedProject["foundationalFiles"] = [
  {
    path: "package.json",
    content: `{
  "name": "kahoot-clone",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "zustand": "^5.0.2"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.16",
    "typescript": "^5.7.2",
    "vite": "^6.0.1"
  }
}`,
  },
  {
    path: "vite.config.ts",
    content: `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
});`,
  },
  {
    path: "tailwind.config.js",
    content: `/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5f3ff",
          100: "#ede9fe",
          500: "#8b5cf6",
          600: "#7c3aed",
          900: "#4c1d95",
        },
      },
    },
  },
  plugins: [],
};`,
  },
  {
    path: "src/index.css",
    content: `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #f1f5f9;
  color: #0f172a;
}`,
  },
  {
    path: "src/main.tsx",
    content: `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);`,
  },
  {
    path: "src/data/questions.ts",
    content: `export interface Question {
  id: string;
  text: string;
  options: { id: string; text: string }[];
  correctAnswerId: string;
}

export const mockQuestions: Question[] = [
  {
    id: "q1",
    text: "What is the capital of France?",
    options: [
      { id: "o1", text: "London" },
      { id: "o2", text: "Berlin" },
      { id: "o3", text: "Paris" },
      { id: "o4", text: "Madrid" },
    ],
    correctAnswerId: "o3",
  },
  {
    id: "q2",
    text: "Which planet is known as the Red Planet?",
    options: [
      { id: "o1", text: "Venus" },
      { id: "o2", text: "Mars" },
      { id: "o3", text: "Jupiter" },
      { id: "o4", text: "Saturn" },
    ],
    correctAnswerId: "o2",
  },
  {
    id: "q3",
    text: "Who wrote 'Romeo and Juliet'?",
    options: [
      { id: "o1", text: "Charles Dickens" },
      { id: "o2", text: "Jane Austen" },
      { id: "o3", text: "William Shakespeare" },
      { id: "o4", text: "Mark Twain" },
    ],
    correctAnswerId: "o3",
  },
  {
    id: "q4",
    text: "What is the largest ocean on Earth?",
    options: [
      { id: "o1", text: "Atlantic Ocean" },
      { id: "o2", text: "Indian Ocean" },
      { id: "o3", text: "Arctic Ocean" },
      { id: "o4", text: "Pacific Ocean" },
    ],
    correctAnswerId: "o4",
  },
  {
    id: "q5",
    text: "What is the chemical symbol for gold?",
    options: [
      { id: "o1", text: "Ag" },
      { id: "o2", text: "Fe" },
      { id: "o3", text: "Au" },
      { id: "o4", text: "Cu" },
    ],
    correctAnswerId: "o3",
  },
];`,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// Module 1 — Global Quiz State
// ═══════════════════════════════════════════════════════════════════════════

const m1t1QuizStoreSkeleton = `import { create } from "zustand";

interface QuizState {
  score: number;
  currentQuestionIndex: number;
  isGameOver: boolean;
  answerQuestion: (isCorrect: boolean, totalQuestions: number) => void;
  resetGame: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  score: 0,
  currentQuestionIndex: 0,
  isGameOver: false,

  // TODO: Implement the answerQuestion action.
  // Use set((state) => { ... }) to return the next state.
  // 1. If isCorrect is true, increment state.score.
  // 2. Increment state.currentQuestionIndex by 1.
  // 3. Set isGameOver to true if the new index is >= totalQuestions.
  answerQuestion: (isCorrect, totalQuestions) => set((state) => {
    return state;
  }),

  //  The resetGame action is already implemented for you.
  resetGame: () => set({
    score: 0,
    currentQuestionIndex: 0,
    isGameOver: false,
  }),
}));`;

const m1t1QuizStoreSolution = `import { create } from "zustand";

interface QuizState {
  score: number;
  currentQuestionIndex: number;
  isGameOver: boolean;
  answerQuestion: (isCorrect: boolean, totalQuestions: number) => void;
  resetGame: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  score: 0,
  currentQuestionIndex: 0,
  isGameOver: false,

  answerQuestion: (isCorrect, totalQuestions) => set((state) => {
    const nextIndex = state.currentQuestionIndex + 1;
    return {
      score: isCorrect ? state.score + 1 : state.score,
      currentQuestionIndex: nextIndex,
      isGameOver: nextIndex >= totalQuestions,
    };
  }),

  resetGame: () => set({
    score: 0,
    currentQuestionIndex: 0,
    isGameOver: false,
  }),
}));`;

// ═══════════════════════════════════════════════════════════════════════════
// Module 2 — Question UI Component
// ═══════════════════════════════════════════════════════════════════════════

const m2t1QuestionCardSkeleton = `import type { Question } from "../data/questions";

interface QuestionCardProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
}

export default function QuestionCard({ question, onAnswer }: QuestionCardProps) {
  return (
    <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-lg">
      <h2 className="mb-8 text-center text-3xl font-bold text-slate-800">
        {question.text}
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/*  We have implemented the first button manually to show the pattern.
            It uses the first option (index 0) from the array. */}
        <button
          onClick={() => onAnswer(question.options[0].id === question.correctAnswerId)}
          className="rounded-xl border-2 border-slate-200 bg-slate-50 p-6 text-lg font-semibold text-slate-700 transition hover:border-brand-500 hover:bg-brand-50"
        >
          {question.options[0].text}
        </button>

        {/* TODO: Delete the manual button above!
            Instead, map over question.options and return a <button> for each option.
            Use option.id as the key, and option.text as the content.
            Use the exact same onClick logic and className shown above! */}
      </div>
    </div>
  );
}`;

const m2t1QuestionCardSolution = `import type { Question } from "../data/questions";

interface QuestionCardProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
}

export default function QuestionCard({ question, onAnswer }: QuestionCardProps) {
  return (
    <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-lg">
      <h2 className="mb-8 text-center text-3xl font-bold text-slate-800">
        {question.text}
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {question.options.map((option) => (
          <button
            key={option.id}
            onClick={() => onAnswer(option.id === question.correctAnswerId)}
            className="rounded-xl border-2 border-slate-200 bg-slate-50 p-6 text-lg font-semibold text-slate-700 transition hover:border-brand-500 hover:bg-brand-50"
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
}`;

// ═══════════════════════════════════════════════════════════════════════════
// Module 3 — The Countdown Timer
// ═══════════════════════════════════════════════════════════════════════════

const m3t1UseCountdownSkeleton = `import { useState, useEffect } from "react";

export function useCountdown(initialSeconds: number, onTimeUp: () => void) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  // TODO: Add a useEffect hook block.
  // Inside the effect, check if timeLeft <= 0. If so, call onTimeUp() and return.
  // Otherwise, create a setInterval that fires every 1000ms.
  // The interval should decrease timeLeft by 1 using setTimeLeft((prev) => prev - 1).
  // Don't forget to return a cleanup function that clears the interval!

  return timeLeft;
}`;

const m3t1UseCountdownSolution = `import { useState, useEffect } from "react";

export function useCountdown(initialSeconds: number, onTimeUp: () => void) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  return timeLeft;
}`;

// M3T2 Chains QuestionCard.tsx (MUST EQUAL m2t1QuestionCardSolution)
const m3t2QuestionCardSkeleton = m2t1QuestionCardSolution;

const m3t2QuestionCardSolution = `import type { Question } from "../data/questions";
import { useCountdown } from "../hooks/useCountdown";

interface QuestionCardProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
}

export default function QuestionCard({ question, onAnswer }: QuestionCardProps) {
  const timeLeft = useCountdown(10, () => onAnswer(false));

  return (
    <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-lg">
      <div className="mb-4 flex justify-end">
        <span className={\`text-xl font-bold \${timeLeft <= 3 ? 'text-red-500' : 'text-slate-500'}\`}>
          ⏳ {timeLeft}s
        </span>
      </div>

      <h2 className="mb-8 text-center text-3xl font-bold text-slate-800">
        {question.text}
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {question.options.map((option) => (
          <button
            key={option.id}
            onClick={() => onAnswer(option.id === question.correctAnswerId)}
            className="rounded-xl border-2 border-slate-200 bg-slate-50 p-6 text-lg font-semibold text-slate-700 transition hover:border-brand-500 hover:bg-brand-50"
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
}`;

// ═══════════════════════════════════════════════════════════════════════════
// Module 4 — Game Loop & Routing
// ═══════════════════════════════════════════════════════════════════════════

const m4t1ScoreScreenSkeleton = `import { useQuizStore } from "../stores/useQuizStore";
import { mockQuestions } from "../data/questions";

export default function ScoreScreen() {
  const { score, resetGame } = useQuizStore();
  const total = mockQuestions.length;
  
  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
      <h2 className="mb-4 text-4xl font-bold text-slate-800">Quiz Complete!</h2>
      <p className="mb-8 text-xl text-slate-600">
        You scored <span className="font-bold text-brand-600">{score}</span> out of {total}
      </p>
      
      {/* TODO: Add a Play Again <button>.
          Attach the resetGame function to its onClick handler.
          Use className="w-full rounded-xl bg-brand-600 py-4 text-lg font-bold text-white transition hover:bg-brand-700" */}
    </div>
  );
}`;

const m4t1ScoreScreenSolution = `import { useQuizStore } from "../stores/useQuizStore";
import { mockQuestions } from "../data/questions";

export default function ScoreScreen() {
  const { score, resetGame } = useQuizStore();
  const total = mockQuestions.length;
  
  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
      <h2 className="mb-4 text-4xl font-bold text-slate-800">Quiz Complete!</h2>
      <p className="mb-8 text-xl text-slate-600">
        You scored <span className="font-bold text-brand-600">{score}</span> out of {total}
      </p>
      
      <button 
        onClick={resetGame}
        className="w-full rounded-xl bg-brand-600 py-4 text-lg font-bold text-white transition hover:bg-brand-700"
      >
        Play Again
      </button>
    </div>
  );
}`;

const m4t2AppSkeleton = `import { useQuizStore } from "./stores/useQuizStore";
import { mockQuestions } from "./data/questions";
import QuestionCard from "./components/QuestionCard";
import ScoreScreen from "./components/ScoreScreen";

export default function App() {
  const { currentQuestionIndex, isGameOver, answerQuestion } = useQuizStore();

  const handleAnswer = (isCorrect: boolean) => {
    answerQuestion(isCorrect, mockQuestions.length);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4 font-sans">
      {/* TODO: Implement the game loop logic!
          If 'isGameOver' is true, render the <ScoreScreen /> component.
          Otherwise, render the <QuestionCard /> component.
          When rendering <QuestionCard />, pass 'question={mockQuestions[currentQuestionIndex]}'
          and 'onAnswer={handleAnswer}'.
          CRITICAL: You must pass 'key={currentQuestionIndex}' to <QuestionCard /> 
          so the React component remounts and resets the timer on each new question! */}
    </div>
  );
}`;

const m4t2AppSolution = `import { useQuizStore } from "./stores/useQuizStore";
import { mockQuestions } from "./data/questions";
import QuestionCard from "./components/QuestionCard";
import ScoreScreen from "./components/ScoreScreen";

export default function App() {
  const { currentQuestionIndex, isGameOver, answerQuestion } = useQuizStore();

  const handleAnswer = (isCorrect: boolean) => {
    answerQuestion(isCorrect, mockQuestions.length);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4 font-sans">
      {isGameOver ? (
        <ScoreScreen />
      ) : (
        <QuestionCard 
          key={currentQuestionIndex}
          question={mockQuestions[currentQuestionIndex]} 
          onAnswer={handleAnswer} 
        />
      )}
    </div>
  );
}`;

// ═══════════════════════════════════════════════════════════════════════════
// Full Project Seed
// ═══════════════════════════════════════════════════════════════════════════

const kahootProject: SeedProject = {
  title: "Build a Kahoot-Style Trivia Game",
  slug: "kahoot-clone",
  description:
    "Master global state, custom hooks, and React component lifecycles by building a fast-paced trivia game with a countdown timer.",
  level: "Intermediate",
  category: "Frontend",
  previewUrl: "https://example.com/kahoot-preview",
  systemFlowUrl: "https://example.com/kahoot-system-flow",
  techStack: [
    {
      name: "React",
      iconUrl: "https://cdn.simpleicons.org/react/61DAFB",
      category: "Frontend",
    },
    {
      name: "TypeScript",
      iconUrl: "https://cdn.simpleicons.org/typescript/3178C6",
      category: "Frontend",
    },
    {
      name: "Zustand",
      iconUrl: "https://cdn.simpleicons.org/npm/CB3837",
      category: "Frontend",
    },
    {
      name: "Tailwind CSS",
      iconUrl: "https://cdn.simpleicons.org/tailwindcss/06B6D4",
      category: "Frontend",
    },
  ],
  features: [
    {
      title: "Global State Management",
      description:
        "Use Zustand to seamlessly track the score and game progression across components.",
    },
    {
      title: "Custom Countdown Hook",
      description:
        "Build a robust timer hook that automatically handles intervals and cleanup.",
    },
    {
      title: "Dynamic Component Unmounting",
      description:
        "Learn the React 'key' prop trick to forcefully remount components and reset state.",
    },
  ],
  foundationalFiles,
  modules: [
    {
      title: "Global Quiz State",
      description:
        "Initialize the Zustand store to manage the score and the active question index.",
      order: 1,
      tasks: [
        {
          title: "Implement the answerQuestion store action",
          description:
            "Update the score and index when a user answers a question.",
          order: 1,
          instructions:
            "The Zustand store is initialized. Complete the answerQuestion action to increment the score if isCorrect is true, increment the currentQuestionIndex, and set isGameOver to true if the new index has reached the totalQuestions limit.",
          difficulty: "Intermediate",
          skillCategory: "Frontend",
          skillPoints: 12,
          concepts: "Zustand, Global State, State Transitions",
          files: [
            {
              path: "src/stores/useQuizStore.ts",
              skeleton: m1t1QuizStoreSkeleton,
              solution: m1t1QuizStoreSolution,
            },
          ],
          mcq: {
            question:
              "In Zustand, how do you access the previous state values when updating the store?",
            options: [
              {
                id: "a",
                text: "By using the callback form of the set function: set((state) => ({ ... }))",
              },
              {
                id: "b",
                text: "By calling getPreviousState() inside the store.",
              },
              { id: "c", text: "By using the usePrevious hook." },
              {
                id: "d",
                text: "Zustand does not allow access to the previous state during updates.",
              },
            ],
            correctAnswer: "a",
          },
        },
      ],
    },
    {
      title: "Question UI Component",
      description:
        "Build the interactive question card that maps out the multiple-choice options.",
      order: 2,
      tasks: [
        {
          title: "Map the answer options in QuestionCard",
          description:
            "Transform an array of option objects into clickable React buttons.",
          order: 1,
          instructions:
            "We've provided a hardcoded example of the first button. Delete it, and use question.options.map() to render a <button> for each option dynamically.",
          difficulty: "Beginner",
          skillCategory: "Frontend",
          skillPoints: 10,
          concepts: "Array mapping, onClick handlers",
          files: [
            {
              path: "src/components/QuestionCard.tsx",
              skeleton: m2t1QuestionCardSkeleton,
              solution: m2t1QuestionCardSolution,
            },
          ],
          mcq: {
            question:
              "Why must we wrap the onAnswer call in an anonymous arrow function like onClick={() => onAnswer(true)}?",
            options: [
              {
                id: "a",
                text: "If we don't, the function will execute immediately when the component renders, instead of waiting for the click event.",
              },
              {
                id: "b",
                text: "Because React only accepts arrow functions in onClick handlers.",
              },
              {
                id: "c",
                text: "To prevent the button from submitting an HTML form.",
              },
              {
                id: "d",
                text: "It improves the performance of the component by caching the function.",
              },
            ],
            correctAnswer: "a",
          },
        },
      ],
    },
    {
      title: "The Countdown Timer",
      description:
        "Build a custom React hook to run a countdown timer, and wire it into the QuestionCard.",
      order: 3,
      tasks: [
        {
          title: "Implement the useCountdown interval",
          description: "Use useEffect to decrement the timer every second.",
          order: 1,
          instructions:
            "Inside the useEffect, check if timeLeft is 0 and call onTimeUp(). Otherwise, use setInterval to decrement timeLeft every 1000ms. Finally, return a cleanup function calling clearInterval(timer).",
          difficulty: "Intermediate",
          skillCategory: "Frontend",
          skillPoints: 15,
          concepts: "useEffect, setInterval, Cleanup Functions",
          files: [
            {
              path: "src/hooks/useCountdown.ts",
              skeleton: m3t1UseCountdownSkeleton,
              solution: m3t1UseCountdownSolution,
            },
          ],
          mcq: {
            question:
              "Why is returning () => clearInterval(timer) from the useEffect crucial?",
            options: [
              {
                id: "a",
                text: "It prevents memory leaks by stopping the interval when the component unmounts or before the effect runs again.",
              },
              {
                id: "b",
                text: "It tells React that the component is ready to be rendered.",
              },
              {
                id: "c",
                text: "It resets the timer back to its initial value.",
              },
              {
                id: "d",
                text: "Without it, setInterval will crash the browser immediately.",
              },
            ],
            correctAnswer: "a",
          },
        },
        {
          title: "Wire useCountdown into QuestionCard",
          description: "Add the 10-second timer to the UI.",
          order: 2,
          instructions:
            "Import useCountdown and initialize it with 10 seconds. Pass a callback that calls onAnswer(false) when the time is up. We've added the UI element for the timer at the top of the card.",
          difficulty: "Beginner",
          skillCategory: "Frontend",
          skillPoints: 10,
          concepts: "Custom Hooks, Component Composition",
          files: [
            {
              path: "src/components/QuestionCard.tsx",
              skeleton: m3t2QuestionCardSkeleton,
              solution: m3t2QuestionCardSolution,
            },
          ],
          mcq: {
            question:
              "What happens when useCountdown triggers onAnswer(false)?",
            options: [
              {
                id: "a",
                text: "The score remains the same, the question index advances, and the next question is shown.",
              },
              { id: "b", text: "The score decreases by 1 point." },
              {
                id: "c",
                text: "The game immediately ends and shows the ScoreScreen.",
              },
              {
                id: "d",
                text: "The timer resets to 10 seconds without changing the question.",
              },
            ],
            correctAnswer: "a",
          },
        },
      ],
    },
    {
      title: "Game Loop & Routing",
      description:
        "Control the application flow by rendering either the active question or the final score.",
      order: 4,
      tasks: [
        {
          title: "Add a Play Again button to ScoreScreen",
          description: "Wire up the reset functionality to start a new game.",
          order: 1,
          instructions:
            "The resetGame action is already pulled from the Zustand store. Add a <button> that says 'Play Again' and attach resetGame to its onClick handler.",
          difficulty: "Beginner",
          skillCategory: "Frontend",
          skillPoints: 8,
          concepts: "onClick handlers, Component layout",
          files: [
            {
              path: "src/components/ScoreScreen.tsx",
              skeleton: m4t1ScoreScreenSkeleton,
              solution: m4t1ScoreScreenSolution,
            },
          ],
          mcq: {
            question:
              "When resetGame is called, why does the screen automatically switch back to the first question?",
            options: [
              {
                id: "a",
                text: "Because resetGame updates isGameOver to false and currentQuestionIndex to 0 in the Zustand store, causing App.tsx to re-render the QuestionCard.",
              },
              {
                id: "b",
                text: "Because resetGame forces the browser to refresh the page.",
              },
              {
                id: "c",
                text: "Because resetGame sends a network request to the backend to start a new session.",
              },
              {
                id: "d",
                text: "Because the button has a type='submit' attribute.",
              },
            ],
            correctAnswer: "a",
          },
        },
        {
          title: "Implement the Game Loop in App",
          description:
            "Conditionally render components based on the Zustand game state.",
          order: 2,
          instructions:
            "Use a ternary operator to conditionally render the <ScoreScreen /> if isGameOver is true, or the <QuestionCard /> otherwise. Remember to pass 'key={currentQuestionIndex}' to the QuestionCard so its internal timer resets!",
          difficulty: "Intermediate",
          skillCategory: "Frontend",
          skillPoints: 12,
          concepts: "Conditional Rendering, React Keys, State Flow",
          files: [
            {
              path: "src/App.tsx",
              skeleton: m4t2AppSkeleton,
              solution: m4t2AppSolution,
            },
          ],
          mcq: {
            question:
              "Why is passing key={currentQuestionIndex} to <QuestionCard /> critical for the timer to work?",
            options: [
              {
                id: "a",
                text: "Changing the 'key' forces React to completely unmount and remount the component, which resets the internal useState timer back to its initial value.",
              },
              {
                id: "b",
                text: "It is required for accessibility purposes so screen readers know which question is active.",
              },
              {
                id: "c",
                text: "Without a key prop, React will throw a fatal error when rendering components from a conditional ternary.",
              },
              {
                id: "d",
                text: "The key prop acts as a unique ID that the Tailwind CSS classes use for styling.",
              },
            ],
            correctAnswer: "a",
          },
        },
      ],
    },
  ],
};

export default kahootProject;
