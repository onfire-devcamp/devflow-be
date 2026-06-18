import type { SeedProject } from "./seedTypes.js";

// ---------------------------------------------------------------------------
// Foundational Files — read-only, available from the start, not tied to tasks
// ---------------------------------------------------------------------------

const foundationalFiles: SeedProject["foundationalFiles"] = [
  {
    path: "package.json",
    content: `{
  "name": "twitter-clone",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint ."
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.0",
    "zustand": "^5.0.2"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.17.0",
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
  server: {
    port: 5173,
  },
  build: {
    outDir: "dist",
  },
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
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "#2563eb",
          900: "#1e3a8a",
        },
      },
      boxShadow: {
        soft: "0 10px 30px rgba(15, 23, 42, 0.08)",
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

:root {
  color-scheme: light;
  font-family: Inter, system-ui, sans-serif;
}

html,
body,
#root {
  min-height: 100%;
}

body {
  margin: 0;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 45%, #eff6ff 100%);
  color: #0f172a;
}

* {
  box-sizing: border-box;
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
];

// ---------------------------------------------------------------------------
// Module 1 — Routing & Layout
// ---------------------------------------------------------------------------

const m1t1AppSkeleton = `import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

// TODO: Create three placeholder page components:
// 1. LoginPage — returns a <div> with the text "Login page"
// 2. FeedPage — returns a <div> with the text "Feed page"
// 3. ProfilePage — returns a <div> with the text "Profile page"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* TODO: Add the following routes:
            1. "/" → redirect to "/feed" using <Navigate to="/feed" replace />
            2. "/login" → render <LoginPage />
            3. "/feed" → render <FeedPage />
            4. "/profile/:username" → render <ProfilePage />
            5. "*" (catch-all) → redirect to "/feed"
        */}
      </Routes>
    </BrowserRouter>
  );
}`;

const m1t1AppSolution = `import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

function LoginPage() {
  return <div>Login page</div>;
}

function FeedPage() {
  return <div>Feed page</div>;
}

function ProfilePage() {
  return <div>Profile page</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/feed" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/feed" replace />} />
      </Routes>
    </BrowserRouter>
  );
}`;

const m1t2LayoutSkeleton = `import { Outlet, NavLink } from "react-router-dom";

// TODO: Build the main application shell layout.
// 1. Create a 'navItems' array with objects { to: string, label: string } for:
//    - { to: "/feed", label: "Home" }
//    - { to: "/profile/me", label: "Profile" }
// 2. Inside the <nav>, render:
//    a. An <h1> with text "Twitter Clone" styled as the app title.
//    b. Map over 'navItems' and render a <NavLink> for each item.
//       Use NavLink's className callback: ({ isActive }) => ...
//       to apply "bg-brand-50 text-brand-600" when active,
//       and "text-slate-600 hover:bg-slate-50" when inactive.
// 3. Inside <main>, render <Outlet /> to display the matched child route.

export default function Layout() {
  return (
    <div className="flex min-h-screen">
      <nav className="sticky top-0 flex h-screen w-64 flex-col gap-2 border-r border-slate-200 bg-white p-4">
        {/* TODO: Render app title and navigation links */}
      </nav>

      <main className="flex-1 p-6">
        {/* TODO: Render <Outlet /> here */}
      </main>
    </div>
  );
}`;

const m1t2LayoutSolution = `import { Outlet, NavLink } from "react-router-dom";

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
              \`rounded-xl px-4 py-3 text-sm font-medium transition \${
                isActive
                  ? "bg-brand-50 text-brand-600"
                  : "text-slate-600 hover:bg-slate-50"
              }\`
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
}`;

// M1T2 chains App.tsx — skeleton MUST equal M1T1 solution
const m1t2AppSkeleton = m1t1AppSolution;

const m1t2AppSolution = `import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";

function LoginPage() {
  return <div>Login page</div>;
}

function FeedPage() {
  return <div>Feed page</div>;
}

function ProfilePage() {
  return <div>Profile page</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/feed" replace />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/feed" replace />} />
      </Routes>
    </BrowserRouter>
  );
}`;

// ---------------------------------------------------------------------------
// Module 2 — The Timeline Feed
// ---------------------------------------------------------------------------

const m2t1TweetCardSkeleton = `export interface TweetAuthor {
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

// TODO: Build a presentational tweet card component.
// 1. Render a <header> with:
//    a. The author's avatar as a rounded <img> (className="h-12 w-12 rounded-full object-cover").
//    b. A <div> containing the author's name in an <h3> and handle in a <p> prefixed with "@".
//    c. The createdAt timestamp aligned to the right (use "ml-auto").
// 2. Render the tweet 'text' in a <p> tag below the header.
// 3. Render a <footer> with the like count displayed as "{likes} likes".
// 4. Use the outer <article> already provided — it has rounded corners and shadow.

export default function TweetCard({ id, author, text, likes, createdAt }: TweetCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* TODO: Render the tweet header with avatar, author name, handle, and timestamp */}
      {/* TODO: Render the tweet body text */}
      {/* TODO: Render the tweet footer with like count */}
    </article>
  );
}`;

const m2t1TweetCardSolution = `export interface TweetAuthor {
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
}`;

const m2t2MainFeedSkeleton = `import { useEffect, useState } from "react";
import TweetCard, { type TweetCardProps } from "../../../components/TweetCard";

const mockTweets: TweetCardProps[] = [
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

// TODO: Build the main feed component that simulates fetching tweets.
// 1. Create a 'tweets' state variable (TweetCardProps[]) initialized to an empty array.
// 2. Create an 'isLoading' state variable (boolean) initialized to true.
// 3. Use useEffect to simulate a network request:
//    a. Set a setTimeout of 400ms that sets 'tweets' to mockTweets and 'isLoading' to false.
//    b. Return a cleanup function that clears the timeout using window.clearTimeout.
// 4. If isLoading is true, return a loading placeholder:
//    <div className="rounded-2xl bg-white p-6 text-slate-500 shadow-sm">Loading timeline...</div>
// 5. Otherwise, map over 'tweets' and render a <TweetCard /> for each,
//    passing tweet.id as the key and spreading the tweet object as props.

export default function MainFeed() {
  return (
    <section className="space-y-4">
      {/* TODO: Implement the feed with loading state and tweet list */}
    </section>
  );
}`;

const m2t2MainFeedSolution = `import { useEffect, useState } from "react";
import TweetCard, { type TweetCardProps } from "../../../components/TweetCard";

const mockTweets: TweetCardProps[] = [
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
}`;

// ---------------------------------------------------------------------------
// Module 3 — Engagement State
// ---------------------------------------------------------------------------

const m3t1UseLikeToggleSkeleton = `import { useState } from "react";

// TODO: Implement the useLikeToggle custom hook.
// 1. Create a 'liked' state variable (boolean) initialized to 'initialLiked'.
// 2. Create a 'likes' state variable (number) initialized to 'initialLikes'.
// 3. Implement 'toggleLike' that:
//    a. Flips the 'liked' state using the callback form of setLiked.
//    b. Inside the setLiked callback, call setLikes to increment by 1
//       if the new state is liked, or decrement by 1 if unliked.
//    HINT: Use setLiked((currentLiked) => { ... return !currentLiked; })
//    and call setLikes inside it to keep both updates in sync.
// 4. Return an object with { liked, likes, toggleLike }.

export function useLikeToggle(initialLikes: number, initialLiked = false) {
  return {
    liked: initialLiked,
    likes: initialLikes,
    toggleLike: () => {},
  };
}`;

const m3t1UseLikeToggleSolution = `import { useState } from "react";

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

  return {
    liked,
    likes,
    toggleLike,
  };
}`;

// M3T2 chains TweetCard.tsx — skeleton MUST equal M2T1 solution
const m3t2TweetCardSkeleton = m2t1TweetCardSolution;

const m3t2TweetCardSolution = `import { useLikeToggle } from "../features/tweets/hooks/useLikeToggle";

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
          {liked ? "\\u2665 Liked" : "\\u2661 Like"}
        </button>
      </footer>
    </article>
  );
}`;

// ---------------------------------------------------------------------------
// Module 4 — Authentication UI
// ---------------------------------------------------------------------------

const m4t1LoginFormSkeleton = `import { type FormEvent, useState } from "react";

export interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void> | void;
  isLoading?: boolean;
}

// TODO: Implement the login form with controlled inputs.
// 1. Create a 'values' state variable of type LoginFormValues,
//    initialized with empty strings for email and password.
// 2. Create an 'error' state variable (string | null) initialized to null.
// 3. In handleSubmit:
//    a. Call event.preventDefault() to stop the default form submission.
//    b. Clear any previous error by setting it to null.
//    c. Validate that both email and password are non-empty (after trimming).
//       If invalid, set error to "Email and password are required." and return.
//    d. Call await onSubmit(values) with the current form values.
// 4. Render two labeled inputs:
//    a. Email input: id="email", type="email", autoComplete="email",
//       value bound to values.email, onChange updates values.email.
//    b. Password input: id="password", type="password", autoComplete="current-password",
//       value bound to values.password, onChange updates values.password.
// 5. If 'error' is not null, render it in a <p> with className "text-sm text-red-600".
// 6. Render a submit <button> that shows "Signing in..." when isLoading is true,
//    and "Sign in" otherwise. Disable the button when isLoading is true.

export default function LoginForm({ onSubmit, isLoading = false }: LoginFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: implement validation and call onSubmit
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-6 shadow-soft">
      {/* TODO: Render email input with label */}
      {/* TODO: Render password input with label */}
      {/* TODO: Render error message if present */}
      {/* TODO: Render submit button */}
    </form>
  );
}`;

const m4t1LoginFormSolution = `import { type FormEvent, useState } from "react";

export interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void> | void;
  isLoading?: boolean;
}

export default function LoginForm({ onSubmit, isLoading = false }: LoginFormProps) {
  const [values, setValues] = useState<LoginFormValues>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!values.email.trim() || !values.password.trim()) {
      setError("Email and password are required.");
      return;
    }

    await onSubmit(values);
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
          value={values.email}
          onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))}
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
          value={values.password}
          onChange={(event) => setValues((current) => ({ ...current, password: event.target.value }))}
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
}`;

const m4t2AuthStoreSkeleton = `import { create } from "zustand";

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

// TODO: Create the auth store using Zustand with the persist middleware.
// 1. Import { persist } from "zustand/middleware".
// 2. Wrap the store creator function with persist() to enable localStorage hydration.
//    The structure is: create<AuthState>()(persist((set) => ({ ... }), { ... }))
// 3. Implement the 'login' action:
//    a. Accept a payload with { user, token }.
//    b. Call set() to update user, token, and set isAuthenticated to true.
// 4. Implement the 'logout' action:
//    a. Call set() to set user to null, token to null, and isAuthenticated to false.
// 5. Configure the persist middleware options:
//    a. Use "twitter-clone-auth" as the 'name' (localStorage key).
//    b. Use 'partialize' to only persist the 'user' and 'token' fields:
//       partialize: (state) => ({ user: state.user, token: state.token })

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
}));`;

const m4t2AuthStoreSolution = `import { create } from "zustand";
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
);`;

// ---------------------------------------------------------------------------
// Full Project Seed
// ---------------------------------------------------------------------------

const twitterCloneProject: SeedProject = {
  title: "Build a Full-Stack Twitter Clone",
  slug: "twitter-clone",
  description:
    "Build a modern Twitter-inspired platform with reusable UI foundations, routing, auth state, feed rendering, and interactive social engagement patterns.",
  level: "Intermediate",
  previewUrl: "https://example.com/twitter-clone-preview",
  systemFlowUrl: "https://example.com/twitter-clone-system-flow",
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
      name: "Tailwind CSS",
      iconUrl: "https://cdn.simpleicons.org/tailwindcss/06B6D4",
      category: "Frontend",
    },
    {
      name: "React Router",
      iconUrl: "https://cdn.simpleicons.org/reactrouter/CA4245",
      category: "Frontend",
    },
    {
      name: "Zustand",
      iconUrl: "https://cdn.simpleicons.org/npm/CB3837",
      category: "Frontend",
    },
    {
      name: "Vite",
      iconUrl: "https://cdn.simpleicons.org/vite/646CFF",
      category: "Frontend",
    },
  ],
  features: [
    {
      title: "Client-Side Routing",
      description:
        "Navigate between feed, login, and profile views with React Router and a shared layout shell.",
    },
    {
      title: "Timeline Feed",
      description:
        "Render a responsive tweet timeline backed by deterministic mock data with loading states.",
    },
    {
      title: "Social Engagement",
      description:
        "Like and unlike tweets with a custom React hook that encapsulates toggle logic.",
    },
    {
      title: "Authentication UI",
      description:
        "Sign in with a controlled form and persist auth state in localStorage via Zustand.",
    },
  ],
  foundationalFiles,
  modules: [
    // -----------------------------------------------------------------------
    // Module 1: Routing & Layout
    // -----------------------------------------------------------------------
    {
      title: "Routing & Layout",
      description:
        "Set up client-side routing with React Router and build a persistent layout shell with navigation.",
      order: 1,
      tasks: [
        {
          title: "Setup React Router inside App.tsx",
          description:
            "Define the application routes with React Router, including placeholder pages and a catch-all redirect.",
          order: 1,
          instructions:
            "Create three simple placeholder page components (LoginPage, FeedPage, ProfilePage) and wire them into a BrowserRouter with the correct route paths. Add a catch-all route that redirects unknown paths to /feed.",
          difficulty: "Beginner",
          skillCategory: "Frontend",
          skillPoints: 12,
          concepts:
            "React Router, BrowserRouter, Route, Navigate, route parameters",
          files: [
            {
              path: "src/App.tsx",
              skeleton: m1t1AppSkeleton,
              solution: m1t1AppSolution,
            },
          ],
          mcq: {
            question:
              "What does the 'replace' prop on <Navigate to='/feed' replace /> do?",
            options: [
              {
                id: "opt_a",
                text: "It replaces the current entry in the browser history so the user cannot press Back to return to the unknown path",
              },
              {
                id: "opt_b",
                text: "It replaces the text content of the current page with the feed content",
              },
              {
                id: "opt_c",
                text: "It replaces the /feed route definition with a new one",
              },
              {
                id: "opt_d",
                text: "It forces the browser to do a full page refresh instead of a client-side navigation",
              },
            ],
            correctAnswer: "opt_a",
          },
        },
        {
          title: "Create the Layout.tsx shell with Sidebar and Outlet",
          description:
            "Build a persistent layout component with a sidebar navigation and an Outlet for nested child routes.",
          order: 2,
          instructions:
            "Create a Layout component that renders a sidebar with navigation links and a main content area. Then update App.tsx to wrap the feed and profile routes inside this layout using a pathless parent route.",
          difficulty: "Beginner",
          skillCategory: "Frontend",
          skillPoints: 14,
          concepts:
            "Outlet, NavLink, nested routing, layout composition, pathless routes",
          files: [
            {
              path: "src/components/Layout.tsx",
              skeleton: m1t2LayoutSkeleton,
              solution: m1t2LayoutSolution,
            },
            {
              path: "src/App.tsx",
              skeleton: m1t2AppSkeleton,
              solution: m1t2AppSolution,
            },
          ],
          mcq: {
            question:
              "What is the purpose of <Outlet /> in a React Router layout component?",
            options: [
              {
                id: "opt_a",
                text: "It renders the matched child route's component inside the layout, enabling shared UI like sidebars to persist across pages",
              },
              {
                id: "opt_b",
                text: "It creates a new independent routing context that ignores the parent route",
              },
              {
                id: "opt_c",
                text: "It automatically redirects to the first child route defined under the layout",
              },
              {
                id: "opt_d",
                text: "It provides error boundary functionality for any errors thrown in child routes",
              },
            ],
            correctAnswer: "opt_a",
          },
        },
      ],
    },
    // -----------------------------------------------------------------------
    // Module 2: The Timeline Feed
    // -----------------------------------------------------------------------
    {
      title: "The Timeline Feed",
      description:
        "Create a reusable tweet card component and a feed timeline that simulates data fetching.",
      order: 2,
      tasks: [
        {
          title: "Extract the TweetCard UI component",
          description:
            "Build a typed, reusable presentational tweet card that renders author info, tweet text, and engagement metrics.",
          order: 1,
          instructions:
            "Implement the TweetCard component body. Render the author's avatar, name, handle, and a timestamp in a header. Display the tweet text below it. Add a footer showing the like count. Use the pre-defined interfaces for type safety.",
          difficulty: "Beginner",
          skillCategory: "Frontend",
          skillPoints: 14,
          concepts:
            "Props typing, component composition, presentational components, TypeScript interfaces",
          files: [
            {
              path: "src/components/TweetCard.tsx",
              skeleton: m2t1TweetCardSkeleton,
              solution: m2t1TweetCardSolution,
            },
          ],
          mcq: {
            question:
              "Why should TweetCard receive its data via props rather than fetching data internally?",
            options: [
              {
                id: "opt_a",
                text: "It makes the component reusable across different contexts (feed, profile, search) without duplicating fetch logic",
              },
              {
                id: "opt_b",
                text: "React components are not allowed to make API calls directly",
              },
              {
                id: "opt_c",
                text: "Props are always faster than state for rendering data",
              },
              {
                id: "opt_d",
                text: "It prevents the component from ever re-rendering after the initial mount",
              },
            ],
            correctAnswer: "opt_a",
          },
        },
        {
          title: "Fetch mock data and render TweetCards in MainFeed.tsx",
          description:
            "Build a feed container that simulates an API call, handles a loading state, and maps over tweet data to render TweetCard components.",
          order: 2,
          instructions:
            "Use useState to manage the tweets array and loading state. Use useEffect with setTimeout to simulate a network fetch of the provided mockTweets data. Show a loading placeholder while data loads. Once loaded, map over the tweets and render a TweetCard for each one.",
          difficulty: "Intermediate",
          skillCategory: "Frontend",
          skillPoints: 18,
          concepts:
            "useEffect, useState, mock data fetching, list rendering, cleanup functions, loading states",
          files: [
            {
              path: "src/features/feed/components/MainFeed.tsx",
              skeleton: m2t2MainFeedSkeleton,
              solution: m2t2MainFeedSolution,
            },
          ],
          mcq: {
            question:
              "Why does the useEffect cleanup function call window.clearTimeout(timer)?",
            options: [
              {
                id: "opt_a",
                text: "To prevent a state update on an unmounted component if the user navigates away before the timeout completes",
              },
              {
                id: "opt_b",
                text: "To reset the timer back to zero every time the component re-renders",
              },
              {
                id: "opt_c",
                text: "To make the setTimeout callback execute faster by freeing memory",
              },
              {
                id: "opt_d",
                text: "To prevent the browser's event loop from freezing during the timeout period",
              },
            ],
            correctAnswer: "opt_a",
          },
        },
      ],
    },
    // -----------------------------------------------------------------------
    // Module 3: Engagement State
    // -----------------------------------------------------------------------
    {
      title: "Engagement State",
      description:
        "Implement social interaction logic with a custom hook and wire it into the tweet card component.",
      order: 3,
      tasks: [
        {
          title: "Implement useLikeToggle.ts custom hook",
          description:
            "Create a custom React hook that encapsulates the like/unlike toggle logic with synchronized state updates.",
          order: 1,
          instructions:
            "Implement the useLikeToggle hook using useState for both the liked boolean and the likes count. The toggleLike function should flip the liked state and adjust the count atomically using the callback form of setState to prevent stale closure bugs.",
          difficulty: "Intermediate",
          skillCategory: "Frontend",
          skillPoints: 16,
          concepts:
            "Custom hooks, useState callback form, derived state, state synchronization",
          files: [
            {
              path: "src/features/tweets/hooks/useLikeToggle.ts",
              skeleton: m3t1UseLikeToggleSkeleton,
              solution: m3t1UseLikeToggleSolution,
            },
          ],
          mcq: {
            question:
              "Why does toggleLike use the callback form setLiked((currentLiked) => ...) instead of setLiked(!liked)?",
            options: [
              {
                id: "opt_a",
                text: "The callback form guarantees access to the latest state value, preventing bugs from stale closures in rapid event handlers",
              },
              {
                id: "opt_b",
                text: "The callback form is required by React for all boolean state updates",
              },
              {
                id: "opt_c",
                text: "The callback form batches the update so the component re-renders fewer times",
              },
              {
                id: "opt_d",
                text: "The callback form is needed to use TypeScript generics with the useState hook",
              },
            ],
            correctAnswer: "opt_a",
          },
        },
        {
          title: "Wire useLikeToggle into the TweetCard component",
          description:
            "Integrate the useLikeToggle hook into the existing TweetCard to add interactive like/unlike functionality.",
          order: 2,
          instructions:
            "Import useLikeToggle into TweetCard. Rename the 'likes' prop to 'initialLikes' in the destructuring to avoid conflicts. Call useLikeToggle(initialLikes) to get the mutable liked state, count, and toggle function. Update the footer to show a Like/Liked button with conditional styling based on the liked state.",
          difficulty: "Intermediate",
          skillCategory: "Frontend",
          skillPoints: 16,
          concepts:
            "Hook integration, prop renaming, event handlers, conditional rendering, component evolution",
          files: [
            {
              path: "src/components/TweetCard.tsx",
              skeleton: m3t2TweetCardSkeleton,
              solution: m3t2TweetCardSolution,
            },
          ],
          mcq: {
            question:
              "In TweetCard, why is the 'likes' prop renamed to 'initialLikes' in the destructuring { likes: initialLikes }?",
            options: [
              {
                id: "opt_a",
                text: "To avoid a naming conflict with the 'likes' value returned from the useLikeToggle hook, which tracks the mutable count",
              },
              {
                id: "opt_b",
                text: "TypeScript requires all props to be renamed when they are used alongside custom hooks",
              },
              {
                id: "opt_c",
                text: "It creates a new constant that makes the component render more efficiently",
              },
              {
                id: "opt_d",
                text: "React Router requires this specific naming convention for route parameters passed as props",
              },
            ],
            correctAnswer: "opt_a",
          },
        },
      ],
    },
    // -----------------------------------------------------------------------
    // Module 4: Authentication UI
    // -----------------------------------------------------------------------
    {
      title: "Authentication UI",
      description:
        "Build the login form with controlled inputs and persist authentication state with Zustand.",
      order: 4,
      tasks: [
        {
          title: "Implement the controlled inputs inside LoginForm.tsx",
          description:
            "Create a fully controlled login form with email and password fields, client-side validation, and submit handling.",
          order: 1,
          instructions:
            "Use useState to manage the form values (email, password) and an error message. Implement handleSubmit to validate both fields are non-empty before calling the onSubmit prop. Render labeled input fields with their values bound to state and onChange handlers that update state. Show validation errors and a loading-aware submit button.",
          difficulty: "Beginner",
          skillCategory: "Frontend",
          skillPoints: 14,
          concepts:
            "Controlled inputs, form state, event handling, client-side validation, async submit",
          files: [
            {
              path: "src/features/auth/components/LoginForm.tsx",
              skeleton: m4t1LoginFormSkeleton,
              solution: m4t1LoginFormSolution,
            },
          ],
          mcq: {
            question:
              "What makes the email input a 'controlled' input in React?",
            options: [
              {
                id: "opt_a",
                text: "Its value is driven by React state (value={values.email}) and updates are handled via onChange, making React the single source of truth",
              },
              {
                id: "opt_b",
                text: "It has an id attribute that React uses to directly control the DOM element",
              },
              {
                id: "opt_c",
                text: "It is placed inside a <form> element that has an onSubmit handler",
              },
              {
                id: "opt_d",
                text: "It uses the autoComplete attribute to let the browser control its behavior",
              },
            ],
            correctAnswer: "opt_a",
          },
        },
        {
          title: "Wire the Zustand authStore.ts login/logout logic",
          description:
            "Create a Zustand store with persist middleware that manages authentication state across browser sessions.",
          order: 2,
          instructions:
            "Import the persist middleware from zustand/middleware. Wrap the store creator with persist() and configure it with a localStorage key. Implement the login action to store the user and token, and the logout action to clear them. Use partialize to only persist user and token, not the derived isAuthenticated field.",
          difficulty: "Intermediate",
          skillCategory: "Frontend",
          skillPoints: 16,
          concepts:
            "Zustand, persist middleware, auth state, localStorage hydration, partialize",
          files: [
            {
              path: "src/features/auth/stores/authStore.ts",
              skeleton: m4t2AuthStoreSkeleton,
              solution: m4t2AuthStoreSolution,
            },
          ],
          mcq: {
            question:
              "What does the partialize option in Zustand's persist middleware do?",
            options: [
              {
                id: "opt_a",
                text: "It selects which parts of the state to save to localStorage, preventing derived values like isAuthenticated from being persisted unnecessarily",
              },
              {
                id: "opt_b",
                text: "It splits the Zustand store into multiple independent smaller stores for performance",
              },
              {
                id: "opt_c",
                text: "It creates a partial shallow copy of the store state for use in React testing utilities",
              },
              {
                id: "opt_d",
                text: "It prevents certain store actions from being called until the store has fully hydrated from localStorage",
              },
            ],
            correctAnswer: "opt_a",
          },
        },
      ],
    },
  ],
};

export default twitterCloneProject;
