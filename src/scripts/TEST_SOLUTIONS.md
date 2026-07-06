# 🧪 DevFlow E2E Testing Solutions

*Generated for rapid copy-paste testing of the workspace evaluation engine.*

---

## 1. Build a Modern Single-Page CV

**Project Slug:** `single-page-cv` | **Level:** Beginner | **Category:** Frontend

---

### Module 1: Layout & Header

#### Task 1: Build the Header component

**File:** `src/components/Header.tsx`
**MCQ Answer:** `a` — Elements stack vertically on mobile screens, but align horizontally side-by-side on screens wider than the 'sm' breakpoint (640px).
**Explain-to-Pass:** "I added two paragraph tags inside the Header component for the job title and contact info, applying Tailwind typography utilities to style a responsive flexbox layout."

**Solution Code:**

```tsx
export default function Header() {
  return (
    <header className="flex flex-col items-center gap-4 border-b border-slate-200 pb-8 text-center sm:flex-row sm:text-left">
      <img
        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop"
        alt="Profile Avatar"
        className="h-24 w-24 rounded-full object-cover shadow-sm"
      />
      
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-slate-900">Alex Developer</h1>
        <p className="mt-1 text-lg font-medium text-brand-600">Full-Stack Software Engineer</p>
        <p className="mt-2 text-sm text-slate-500">San Francisco, CA • alex@example.com</p>
      </div>
    </header>
  );
}
```

---

#### Task 2: Set up the main App shell

**File:** `src/App.tsx`
**MCQ Answer:** `a` — It represents the dominant, core content of the document, improving semantic meaning for screen readers and search engines.
**Explain-to-Pass:** "I composed the App shell by rendering the Header component inside a styled container and added a semantic main tag with spacing utilities to prepare for the body content."

**Solution Code:**

```tsx
import Header from "./components/Header";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 py-12 font-sans sm:p-8">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm sm:p-12">
        <Header />
        
        <main className="mt-8 space-y-12">
        </main>
      </div>
    </div>
  );
}
```

---

### Module 2: Experience Section

#### Task 1: Build the ExperienceItem and ExperienceList components

**MCQ Answer:** `a` — The data is passed down from the parent component as a 'prop' (property) and destructured in the function arguments.
**Explain-to-Pass:** "I rendered the description prop inside ExperienceItem and used array mapping with the spread operator in ExperienceList to dynamically render a reusable component for each experience entry."

**File 1:** `src/components/ExperienceItem.tsx`

```tsx
export interface ExperienceItemProps {
  title: string;
  subtitle: string;
  period: string;
  description: string;
}

export default function ExperienceItem({ title, subtitle, period, description }: ExperienceItemProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
      <div className="w-full shrink-0 text-sm font-medium text-slate-500 sm:w-32 sm:text-right">
        {period}
      </div>
      
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="font-medium text-brand-600">{subtitle}</p>
        
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
      </div>
    </div>
  );
}
```

**File 2:** `src/components/ExperienceList.tsx`

```tsx
import ExperienceItem from "./ExperienceItem";

const experienceData = [
  {
    id: "exp1",
    title: "Senior Frontend Engineer",
    subtitle: "TechStart Inc.",
    period: "2021 - Present",
    description: "Lead the frontend team in building a modern React application. Migrated legacy codebase to TypeScript and improved performance by 40%.",
  },
  {
    id: "exp2",
    title: "Web Developer",
    subtitle: "Creative Agency",
    period: "2019 - 2021",
    description: "Developed responsive websites for clients. Worked closely with designers to implement pixel-perfect UIs.",
  }
];

export default function ExperienceList() {
  return (
    <section>
      <h2 className="mb-6 text-xl font-bold tracking-tight text-slate-900">Experience</h2>
      <div className="space-y-8">
        {experienceData.map((item) => (
          <ExperienceItem key={item.id} {...item} />
        ))}
      </div>
    </section>
  );
}
```

---

#### Task 2: Render ExperienceList inside App

**File:** `src/App.tsx`
**MCQ Answer:** `a` — TypeScript and Vite will throw a ReferenceError, preventing the application from compiling and running.
**Explain-to-Pass:** "I imported the ExperienceList component and composed it inside the App's main tag, demonstrating how component composition and proper imports connect separate UI pieces together."

**Solution Code:**

```tsx
import Header from "./components/Header";
import ExperienceList from "./components/ExperienceList";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 py-12 font-sans sm:p-8">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm sm:p-12">
        <Header />
        
        <main className="mt-8 space-y-12">
          <ExperienceList />
        </main>
      </div>
    </div>
  );
}
```

---

### Module 3: Skills & Polish

#### Task 1: Extract mock data and render backend skill badges

**MCQ Answer:** `a` — It keeps the component files smaller and focuses them strictly on UI rendering logic.
**Explain-to-Pass:** "I extracted the backend skills data into a separate mockData file, imported it into SkillTags, and used array mapping with flex-wrap to render styled skill badges dynamically."

**File 1:** `src/data/mockData.ts`

```ts
export const frontendSkills = ["React", "TypeScript", "Tailwind CSS", "Next.js"];

export const backendSkills = ["Node.js", "Express", "PostgreSQL", "Redis"];
```

**File 2:** `src/components/SkillTags.tsx`

```tsx
import { frontendSkills, backendSkills } from "../data/mockData";

export default function SkillTags() {
  return (
    <section>
      <h2 className="mb-6 text-xl font-bold tracking-tight text-slate-900">Skills</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Frontend</h3>
          <div className="flex flex-wrap gap-2">
            {frontendSkills.map((skill) => (
              <span key={skill} className="rounded-lg bg-brand-50 px-3 py-1 text-sm font-medium text-brand-600">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Backend</h3>
          <div className="flex flex-wrap gap-2">
            {backendSkills.map((skill) => (
              <span key={skill} className="rounded-lg bg-brand-50 px-3 py-1 text-sm font-medium text-brand-600">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

#### Task 2: Add SkillTags to the Resume

**File:** `src/App.tsx`
**MCQ Answer:** `a` — No, multiple adjacent elements must be wrapped in a single parent element or a React Fragment (`<>...</>`).
**Explain-to-Pass:** "I imported SkillTags and added it as the last child inside the main tag in App.tsx, completing the CV layout through component composition."

**Solution Code:**

```tsx
import Header from "./components/Header";
import ExperienceList from "./components/ExperienceList";
import SkillTags from "./components/SkillTags";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 py-12 font-sans sm:p-8">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm sm:p-12">
        <Header />
        
        <main className="mt-8 space-y-12">
          <ExperienceList />
          <SkillTags />
        </main>
      </div>
    </div>
  );
}
```

---
---

## 2. Build a Kahoot-Style Trivia Game

**Project Slug:** `kahoot-clone` | **Level:** Intermediate | **Category:** Frontend

---

### Module 1: Global Quiz State

#### Task 1: Define types and implement the store

**MCQ Answer:** `a` — By using the callback form of the set function: `set((state) => ({ ... }))`
**Explain-to-Pass:** "I defined the answerQuestion TypeScript interface and implemented its Zustand store logic using set's callback form to increment the score, advance the question index, and flag game-over based on totalQuestions."

**File 1:** `src/types/quiz.ts`

```ts
export interface QuizState {
  score: number;
  currentQuestionIndex: number;
  isGameOver: boolean;
  answerQuestion: (isCorrect: boolean, totalQuestions: number) => void;
  resetGame: () => void;
}
```

**File 2:** `src/stores/useQuizStore.ts`

```ts
import { create } from "zustand";
import type { QuizState } from "../types/quiz";

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
}));
```

---

### Module 2: Question UI Component

#### Task 1: Map the answer options in QuestionCard

**MCQ Answer:** `a` — If we don't, the function will execute immediately when the component renders, instead of waiting for the click event.
**Explain-to-Pass:** "I replaced the hardcoded button with a dynamic array map over question.options, rendering a button for each option with an onClick handler that checks correctness against the correctAnswerId."

**File:** `src/components/QuestionCard.tsx`

```tsx
import type { Question } from "../data/questions";

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
}
```

---

### Module 3: The Countdown Timer

#### Task 1: Implement the useCountdown interval

**MCQ Answer:** `a` — It prevents memory leaks by stopping the interval when the component unmounts or before the effect runs again.
**Explain-to-Pass:** "I implemented a useEffect that calls onTimeUp when timeLeft reaches zero, otherwise runs a setInterval to decrement the counter every second, with a cleanup function that clears the interval on unmount."

**File:** `src/hooks/useCountdown.ts`

```ts
import { useState, useEffect } from "react";

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
}
```

---

#### Task 2: Wire useCountdown into QuestionCard

**MCQ Answer:** `a` — The score remains the same, the question index advances, and the next question is shown.
**Explain-to-Pass:** "I imported the useCountdown custom hook into QuestionCard, initialized it with 10 seconds, and passed a callback that auto-submits a wrong answer when time runs out."

**File:** `src/components/QuestionCard.tsx`

```tsx
import type { Question } from "../data/questions";
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
        <span className={`text-xl font-bold ${timeLeft <= 3 ? 'text-red-500' : 'text-slate-500'}`}>
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
}
```

---

### Module 4: Game Loop & Routing

#### Task 1: Build ScoreScreen and implement the Game Loop

**MCQ Answer:** `a` — Changing the 'key' forces React to completely unmount and remount the component, which resets the internal useState timer back to its initial value.
**Explain-to-Pass:** "I built the ScoreScreen with a Play Again button wired to resetGame, and implemented conditional rendering in App to toggle between ScoreScreen and QuestionCard using key={currentQuestionIndex} to force timer resets."

**File 1:** `src/components/ScoreScreen.tsx`

```tsx
import { useQuizStore } from "../stores/useQuizStore";
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
}
```

**File 2:** `src/App.tsx`

```tsx
import { useQuizStore } from "./stores/useQuizStore";
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
}
```

---
---

## 3. Build a Full-Stack Twitter Clone

**Project Slug:** `twitter-clone` | **Level:** Advanced | **Category:** Fullstack

---

### Module 1: Base Routing

#### Task 1: Add the login and profile routes to App.tsx

**MCQ Answer:** `opt_a` — It replaces the current entry in the browser history so the user cannot press Back to return to the unknown path.
**Explain-to-Pass:** "I exported LoginPage and ProfilePage stub components, imported them into App.tsx, and added React Router Route elements for /login and /profile/:username using dynamic path parameters alongside the existing feed route."

**File 1:** `src/pages/index.ts`

```ts
export function FeedPage() {
  return <div>Feed page</div>;
}

export function LoginPage() {
  return <div>Login page</div>;
}

export function ProfilePage() {
  return <div>Profile page</div>;
}
```

**File 2:** `src/App.tsx`

```tsx
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { FeedPage, LoginPage, ProfilePage } from "./pages";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/feed" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

### Module 2: Layout & Navigation

#### Task 1: Map the navigation links inside the sidebar

**MCQ Answer:** `opt_a` — An object with an 'isActive' boolean that tells you if the link matches the current URL, enabling dynamic styling.
**Explain-to-Pass:** "I mapped over the navItems array to render NavLink components with an isActive className callback for dynamic active/inactive styling, inside a layout shell that uses Outlet for nested route composition."

**File:** `src/components/Layout.tsx`

```tsx
import { Outlet, NavLink } from "react-router-dom";

const navItems = [
  { to: "/feed", label: "Home" },
  { to: "/profile/me", label: "Profile" },
];

export default function Layout() {
  return (
    <div className="flex min-h-screen">
      <nav className="sticky top-0 flex h-screen w-64 flex-col gap-2 border-r border-slate-200 bg-white p-4">
        <h1 className="mb-6 text-xl font-bold text-brand-600">Twitter Clone</h1>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-brand-50 text-brand-600"
                  : "text-slate-600 hover:bg-slate-50"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
```

---

### Module 3: The Tweet Component

#### Task 1: Render the tweet body and like count in TweetCard

**MCQ Answer:** `opt_a` — It makes the component reusable across different contexts (feed, profile, search) without duplicating fetch logic.
**Explain-to-Pass:** "I built a presentational TweetCard that receives data via TypeScript-typed props, rendering the tweet text in a paragraph tag and the like count in a semantic footer element."

**File:** `src/components/TweetCard.tsx`

```tsx
export interface TweetAuthor {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
}

export interface TweetCardProps {
  id: string;
  author: TweetAuthor;
  text: string;
  likes: number;
  createdAt: string;
}

export default function TweetCard({ id, author, text, likes, createdAt }: TweetCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="flex items-center gap-3">
        <img
          src={author.avatarUrl}
          alt={author.name}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-slate-900">{author.name}</h3>
          <p className="text-sm text-slate-500">@{author.handle}</p>
        </div>
        <span className="ml-auto text-xs text-slate-400">{createdAt}</span>
      </header>

      <p className="mt-4 text-sm leading-6 text-slate-700">{text}</p>

      <footer className="mt-4 flex items-center border-t border-slate-100 pt-4 text-sm text-slate-500">
        <span>{likes} likes</span>
      </footer>
    </article>
  );
}
```

---

### Module 4: The Feed Timeline

#### Task 1: Map the tweets array into TweetCard components

**MCQ Answer:** `opt_a` — To prevent a state update on an unmounted component if the user navigates away before the timeout completes.
**Explain-to-Pass:** "I added mock tweets to the data file, imported them into MainFeed, populated state via useEffect with a simulated loading delay, and mapped the tweets array into TweetCard components using key and spread props."

**File 1:** `src/utils/mockData.ts`

```ts
import type { TweetCardProps } from "../components/TweetCard";

export const mockTweets: TweetCardProps[] = [
  {
    id: "1",
    author: {
      id: "u1",
      name: "Ada Lovelace",
      handle: "ada",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    },
    text: "Just shipped the first version of my Twitter clone timeline. The component composition pattern is so clean!",
    likes: 128,
    createdAt: "2h",
  },
  {
    id: "2",
    author: {
      id: "u2",
      name: "Grace Hopper",
      handle: "grace",
      avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    },
    text: "A clean component hierarchy makes the feed easy to extend. Separation of concerns FTW.",
    likes: 84,
    createdAt: "5h",
  },
  {
    id: "3",
    author: {
      id: "u3",
      name: "Alan Turing",
      handle: "alan",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    },
    text: "Exploring the limits of computation, one React component at a time.",
    likes: 256,
    createdAt: "8h",
  },
];
```

**File 2:** `src/features/feed/components/MainFeed.tsx`

```tsx
import { useEffect, useState } from "react";
import TweetCard, { type TweetCardProps } from "../../../components/TweetCard";
import { mockTweets } from "../../../utils/mockData";

export default function MainFeed() {
  const [tweets, setTweets] = useState<TweetCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setTweets(mockTweets);
      setIsLoading(false);
    }, 400);

    return () => window.clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white p-6 text-slate-500 shadow-sm">
        Loading timeline...
      </div>
    );
  }

  return (
    <section className="space-y-4">
      {tweets.map((tweet) => (
        <TweetCard key={tweet.id} {...tweet} />
      ))}
    </section>
  );
}
```

---

### Module 5: Engagement Logic

#### Task 1: Implement the toggleLike function in useLikeToggle

**MCQ Answer:** `opt_a` — The callback form guarantees access to the latest state value, preventing bugs from stale closures in rapid event handlers.
**Explain-to-Pass:** "I implemented the toggleLike function using useState's callback form to safely flip the liked boolean and synchronize the likes count, avoiding stale closure bugs in rapid click handlers."

**File:** `src/features/tweets/hooks/useLikeToggle.ts`

```ts
import { useState } from "react";

export function useLikeToggle(initialLikes: number, initialLiked = false) {
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialLikes);

  const toggleLike = () => {
    setLiked((currentLiked) => {
      const nextLiked = !currentLiked;
      setLikes((currentLikes) => (nextLiked ? currentLikes + 1 : currentLikes - 1));
      return nextLiked;
    });
  };

  return { liked, likes, toggleLike };
}
```

---

#### Task 2: Wire useLikeToggle into the TweetCard like button

**MCQ Answer:** `opt_a` — To avoid a naming conflict with the 'likes' value returned from useLikeToggle, which tracks the mutable count.
**Explain-to-Pass:** "I integrated useLikeToggle into TweetCard by renaming the likes prop to initialLikes, wiring the hook's toggleLike to a button onClick, and conditionally rendering the liked/unlike state."

**File:** `src/components/TweetCard.tsx`

```tsx
import { useLikeToggle } from "../features/tweets/hooks/useLikeToggle";

export interface TweetAuthor {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
}

export interface TweetCardProps {
  id: string;
  author: TweetAuthor;
  text: string;
  likes: number;
  createdAt: string;
}

export default function TweetCard({ id, author, text, likes: initialLikes, createdAt }: TweetCardProps) {
  const { liked, likes, toggleLike } = useLikeToggle(initialLikes);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="flex items-center gap-3">
        <img
          src={author.avatarUrl}
          alt={author.name}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-slate-900">{author.name}</h3>
          <p className="text-sm text-slate-500">@{author.handle}</p>
        </div>
        <span className="ml-auto text-xs text-slate-400">{createdAt}</span>
      </header>

      <p className="mt-4 text-sm leading-6 text-slate-700">{text}</p>

      <footer className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm text-slate-500">
        <span>{likes} likes</span>
        <button
          type="button"
          onClick={toggleLike}
          className={liked ? "font-semibold text-rose-600" : "font-medium text-slate-600 hover:text-rose-500"}
        >
          {liked ? "♥ Liked" : "♡ Like"}
        </button>
      </footer>
    </article>
  );
}
```

---

### Module 6: Authentication

#### Task 1: Build the auth API and LoginForm UI

**MCQ Answer:** `opt_a` — Its value is driven by React state (`value={values.email}`) and updates go through onChange, making React the single source of truth.
**Explain-to-Pass:** "I created a mock loginRequest that resolves a Promise with auth data, added a controlled password input following the email pattern, and wired a submit button that calls the API inside the async handleSubmit."

**File 1:** `src/api/auth.ts`

```ts
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
  };
}

export const loginRequest = async (email: string, password: string): Promise<AuthResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        token: "dummy-jwt-token-123",
        user: {
          id: "u123",
          email,
          username: email.split("@")[0],
        },
      });
    }, 1000);
  });
};
```

**File 2:** `src/features/auth/components/LoginForm.tsx`

```tsx
import { type FormEvent, useState } from "react";
import { loginRequest } from "../../api/auth";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await loginRequest(email, password);
      console.log("Logged in!", response);
    } catch (err) {
      setError("Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-6 shadow-soft">
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
          placeholder="Enter your password"
        />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
```

---

#### Task 2: Implement the logout action in authStore

**MCQ Answer:** `opt_a` — It selects which parts of the state to save to localStorage, preventing derived values like isAuthenticated from being persisted unnecessarily.
**Explain-to-Pass:** "I implemented the logout action in the Zustand persist store by calling set() to reset user, token, and isAuthenticated back to their initial null/false values, mirroring the login pattern."

**File:** `src/features/auth/stores/authStore.ts`

```ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthUser {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (payload: { user: AuthUser; token: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: ({ user, token }) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "twitter-clone-auth",
      partialize: (state) => ({ user: state.user, token: state.token }),
    },
  ),
);
```

---
---

## 4. Build a Scalable URL Shortener Service

**Project Slug:** `url-shortener-api` | **Level:** Intermediate | **Category:** Backend

---

### Module 1: Data Layer

#### Task 1: Implement the Url Schema and Validation

**MCQ Answer:** `a` — It tells MongoDB to build a unique index on this field, ensuring two different URLs never receive the same shortCode in the database.
**Explain-to-Pass:** "I implemented the isValidUrl utility using the URL constructor for protocol validation, then defined the Mongoose schema with a custom validator on originalUrl, a unique shortCode index, and a clicks field defaulting to zero."

**File 1:** `src/utils/validation.ts`

```ts
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (err) {
    return false;
  }
}
```

**File 2:** `src/models/urlModel.ts`

```ts
import mongoose, { Document, Schema } from 'mongoose';
import { isValidUrl } from '../utils/validation';

export interface IUrl extends Document {
  originalUrl: string;
  shortCode: string;
  clicks: number;
  createdAt: Date;
}

const urlSchema = new Schema({
  originalUrl: { 
    type: String, 
    required: true,
    validate: {
      validator: isValidUrl,
      message: "Invalid URL format"
    }
  },
  shortCode: { type: String, required: true, unique: true },
  clicks: { type: Number, default: 0 }
}, { timestamps: true });

export const Url = mongoose.model<IUrl>('Url', urlSchema);
```

---

### Module 2: Encoding Service

#### Task 1: Generate a Base62 Short Code

**MCQ Answer:** `a` — Because it avoids special characters like + and / which can cause parsing issues when placed in URLs.
**Explain-to-Pass:** "I implemented a random string generator that loops a specified number of times, picking a random character from the Base62 alphabet on each iteration and concatenating it into a short code result."

**File:** `src/services/encodingService.ts`

```ts
const BASE62_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const generateShortCode = (length: number = 6): string => {
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * BASE62_ALPHABET.length);
    result += BASE62_ALPHABET[randomIndex];
  }
  return result;
};
```

---

### Module 3: Create Endpoint

#### Task 1: Implement the shortenUrl endpoint

**MCQ Answer:** `a` — 201 (Created)
**Explain-to-Pass:** "I wired the shortenUrl controller to generate a short code via the encoding service, persist it with the originalUrl using Url.create(), return a 201 JSON response, and registered the POST /shorten route in the Express router."

**File 1:** `src/controllers/urlController.ts`

```ts
import { Request, Response } from 'express';
import { Url } from '../models/urlModel';
import { generateShortCode } from '../services/encodingService';

export const shortenUrl = async (req: Request, res: Response): Promise<void> => {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    res.status(400).json({ error: 'originalUrl is required' });
    return;
  }

  const shortCode = generateShortCode();
  
  const newUrl = await Url.create({
    originalUrl,
    shortCode
  });

  res.status(201).json(newUrl);
};

// ---------------------------------------------------------
// This endpoint will be implemented in the next module
// ---------------------------------------------------------
export const redirectUrl = async (req: Request, res: Response): Promise<void> => {
  const { code } = req.params;
  
  // TODO (Module 4): Find the url by shortCode, increment clicks, and redirect.
};
```

**File 2:** `src/routes/urlRoutes.ts`

```ts
import { Router } from "express";
import { shortenUrl } from "../controllers/urlController";

const router = Router();

router.post("/shorten", shortenUrl);

export default router;
```

---

### Module 4: Redirect Endpoint

#### Task 1: Implement the redirectUrl endpoint

**MCQ Answer:** `a` — It prevents race conditions if multiple people click the link at the exact same millisecond, keeping the click count accurate.
**Explain-to-Pass:** "I implemented the redirectUrl controller using findOneAndUpdate with $inc to atomically increment clicks, then calling res.redirect with the originalUrl, and added the GET /:code route to the Express router."

**File 1:** `src/controllers/urlController.ts`

```ts
import { Request, Response } from 'express';
import { Url } from '../models/urlModel';
import { generateShortCode } from '../services/encodingService';

export const shortenUrl = async (req: Request, res: Response): Promise<void> => {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    res.status(400).json({ error: 'originalUrl is required' });
    return;
  }

  const shortCode = generateShortCode();
  
  const newUrl = await Url.create({
    originalUrl,
    shortCode
  });

  res.status(201).json(newUrl);
};

// ---------------------------------------------------------
// This endpoint will be implemented in the next module
// ---------------------------------------------------------
export const redirectUrl = async (req: Request, res: Response): Promise<void> => {
  const { code } = req.params;
  
  const urlDoc = await Url.findOneAndUpdate(
    { shortCode: code },
    { $inc: { clicks: 1 } }
  );

  if (!urlDoc) {
    res.status(404).json({ error: 'URL not found' });
    return;
  }

  res.redirect(urlDoc.originalUrl);
};
```

**File 2:** `src/routes/urlRoutes.ts`

```ts
import { Router } from "express";
import { shortenUrl, redirectUrl } from "../controllers/urlController";

const router = Router();

router.post("/shorten", shortenUrl);
router.get("/:code", redirectUrl);

export default router;
```

---

## Quick Reference: MCQ Answer Key

| Project | Module | Task | Answer |
|---------|--------|------|--------|
| Single-Page CV | M1 | T1 - Header | `a` |
| Single-Page CV | M1 | T2 - App Shell | `a` |
| Single-Page CV | M2 | T1 - Experience | `a` |
| Single-Page CV | M2 | T2 - Render Experience | `a` |
| Single-Page CV | M3 | T1 - Skills Data | `a` |
| Single-Page CV | M3 | T2 - Add SkillTags | `a` |
| Kahoot Clone | M1 | T1 - Quiz Store | `a` |
| Kahoot Clone | M2 | T1 - QuestionCard | `a` |
| Kahoot Clone | M3 | T1 - Countdown | `a` |
| Kahoot Clone | M3 | T2 - Wire Timer | `a` |
| Kahoot Clone | M4 | T1 - Game Loop | `a` |
| Twitter Clone | M1 | T1 - Routes | `opt_a` |
| Twitter Clone | M2 | T1 - Layout Nav | `opt_a` |
| Twitter Clone | M3 | T1 - TweetCard | `opt_a` |
| Twitter Clone | M4 | T1 - Feed Timeline | `opt_a` |
| Twitter Clone | M5 | T1 - useLikeToggle | `opt_a` |
| Twitter Clone | M5 | T2 - Wire Like | `opt_a` |
| Twitter Clone | M6 | T1 - Auth + Login | `opt_a` |
| Twitter Clone | M6 | T2 - Auth Store | `opt_a` |
| URL Shortener | M1 | T1 - Schema | `a` |
| URL Shortener | M2 | T1 - Encoding | `a` |
| URL Shortener | M3 | T1 - Create Endpoint | `a` |
| URL Shortener | M4 | T1 - Redirect | `a` |
